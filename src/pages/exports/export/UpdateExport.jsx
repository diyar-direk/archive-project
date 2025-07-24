import { useCallback, useContext, useEffect, useRef, useState } from "react";
import "../../../components/form/form.css";
import { baseURL, Context } from "../../../context/context";
import axios from "axios";
import QuestionListShow from "./QuestionListShow";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import useLanguage from "../../../hooks/useLanguage";
import SendData from "../../../components/response/SendData";
import Loading from "../../../components/loading/Loading";
import InputWithLabel from "../../../components/inputs/InputWithLabel";

const UpdateExport = () => {
  const { id } = useParams();
  const context = useContext(Context);
  const token = context.userDetails.token;
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    code: "",
    details: "",
    expirationDate: "",
    questions: [],
  });
  const nav = useNavigate();
  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${baseURL}/exports/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setForm({
        code: data.data.code,
        details: data.data.details,
        expirationDate: data.data.expirationDate.split("T")[0],
        questions: data.data.questions || [],
      });
    } catch (error) {
      console.error(error);
      nav("/error-404");
    } finally {
      setLoading(false);
    }
  }, [token, id, nav]);

  useEffect(() => {
    getData();
  }, [getData]);
  const [formLoading, setFormLoading] = useState(false);
  const { language } = useLanguage();
  const [error, setError] = useState(false);
  const handleForm = useCallback(
    (e) => {
      const { id, value } = e.target;
      setForm({ ...form, [id]: value });
    },
    [form]
  );
  const response = useRef(true);
  const [responseOverlay, setResponseOverlay] = useState(false);
  const responseFun = (complete = false) => {
    complete === true
      ? (response.current = true)
      : complete === "reapeted data"
      ? (response.current = 400)
      : (response.current = false);
    setResponseOverlay(true);
    window.onclick = () => {
      setResponseOverlay(false);
    };
    setTimeout(() => {
      setResponseOverlay(false);
    }, 3000);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.questions.length === 0)
      return setError("you have to add one or more questions");
    setFormLoading(true);
    try {
      const createdQuestions = await Promise.all(
        form.questions.map(async (question) => {
          try {
            if (typeof question._id === "string") {
              return await axios.patch(
                `${baseURL}/questions/${question._id}`,
                {
                  question: question.question,
                  informationId: question.informationId._id,
                },
                {
                  headers: { Authorization: "Bearer " + token },
                }
              );
            } else {
              return await axios.post(
                `${baseURL}/questions`,
                {
                  question: question.question,
                  informationId: question.informationId._id,
                },
                {
                  headers: { Authorization: "Bearer " + token },
                }
              );
            }
          } catch (err) {
            console.error("Error in question:", question, err);
            return null;
          }
        })
      );

      const questionPayload = createdQuestions.map((res) => res.data.data._id);
      const formData = {
        code: form.code,
        details: form.details,
        expirationDate: form.expirationDate,
        questions: questionPayload,
      };
      const data = await axios.patch(`${baseURL}/exports/${id}`, formData, {
        headers: { Authorization: "Bearer " + token },
      });

      if (data.status === 200) {
        nav(-1);
      }
    } catch (error) {
      console.log(error);
      if (error.status === 400) responseFun("reapeted data");
      else responseFun(false);
    } finally {
      setFormLoading(false);
    }
  };
  if (loading) return <Skeleton width="100%" height="400px" />;

  return (
    <>
      {responseOverlay && (
        <SendData data="export" response={response.current} />
      )}
      {formLoading && <Loading />}
      <form onSubmit={handleSubmit} className="dashboard-form">
        <div className="form">
          <div className="flex wrap">
            <InputWithLabel
              label="code"
              required
              id="code"
              value={form.code}
              onChange={handleForm}
              placeholder="please enter export code"
            />

            <InputWithLabel
              label="expiration date"
              value={form.expirationDate}
              required
              onChange={handleForm}
              type="date"
              id="expirationDate"
              placeholder="please enter expiration date"
            />
          </div>
          <div className="flex wrap">
            <InputWithLabel
              label="details"
              id="details"
              value={form.details}
              onChange={handleForm}
              placeholder="please enter export details"
              writebelType="textarea"
              rows={5}
            />
          </div>
        </div>
        <div className="form">
          <h1>questions</h1>
          <QuestionListShow questions={form.questions} setQuestions={setForm} />
        </div>

        {error && <p className="error"> {error} </p>}
        <button className="btn">{language?.users?.save}</button>
      </form>
    </>
  );
};

export default UpdateExport;
