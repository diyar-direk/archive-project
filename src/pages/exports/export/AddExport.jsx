import { useCallback, useContext, useRef, useState } from "react";
import "../../../components/form/form.css";
import { baseURL, Context } from "../../../context/context";
import axios from "axios";
import SendData from "../../../components/response/SendData";
import Loading from "../../../components/loading/Loading";
import useLanguage from "../../../hooks/useLanguage";
import InputWithLabel from "../../../components/inputs/InputWithLabel";
import QuestionListShow from "./QuestionListShow";

const AddExport = () => {
  const [loading, setLoading] = useState(false);

  const { language } = useLanguage();

  const [error, setError] = useState(false);

  const [form, setForm] = useState({
    code: "",
    details: "",
    expirationDate: "",
    questions: [],
  });

  const handleForm = useCallback(
    (e) => {
      const { id, value } = e.target;
      setForm({ ...form, [id]: value });
    },
    [form]
  );

  const context = useContext(Context);
  const token = context.userDetails.token;
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
    const inputDate = new Date(form.expirationDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    if (inputDate <= today) return setError("Date must be in the future");
    if (form.questions.length === 0)
      return setError("you have to add one or more questions");
    setLoading(true);
    try {
      const createdQuestions = await Promise.all(
        form.questions.map((question) =>
          axios.post(
            `${baseURL}/questions`,
            {
              question: question.question,
              informationId: question.informationId._id,
            },
            {
              headers: { Authorization: "Bearer " + token },
            }
          )
        )
      );
      const questionPayload = createdQuestions.map((res) => res.data.data._id);
      const formData = {
        code: form.code,
        details: form.details,
        expirationDate: form.expirationDate,
        questions: questionPayload,
      };
      const data = await axios.post(`${baseURL}/exports`, formData, {
        headers: { Authorization: "Bearer " + token },
      });

      if (data.status === 201) {
        responseFun(true);
        setForm({
          code: "",
          details: "",
          expirationDate: "",
          questions: [],
        });
      }
    } catch (error) {
      console.log(error);
      if (error.status === 400) responseFun("reapeted data");
      else responseFun(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {responseOverlay && (
        <SendData data="export" response={response.current} />
      )}
      {loading && <Loading />}
      <h1 className="title">add export</h1>
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

export default AddExport;
