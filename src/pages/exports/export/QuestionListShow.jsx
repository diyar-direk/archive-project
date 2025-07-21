import { useCallback, useContext, useMemo, useState } from "react";
import SelectInputApi from "../../../components/inputs/SelectInputApi";
import InputWithLabel from "../../../components/inputs/InputWithLabel";
import "./questions.css";
import axios from "axios";
import { baseURL, Context } from "../../../context/context";
import { getInformations } from "../../info/getInformations";

const QuestionListShow = ({ questions, setQuestions }) => {
  const context = useContext(Context);
  const [overlay, setOverlay] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const setUpdate = useCallback((e) => {
    setQuestionsList(e);
    setShowQuestionForm(true);
  }, []);

  const setDeleteAction = useCallback((e) => {
    setOverlay(true);
    setSelectedItem(e);
  }, []);
  const questionsData = useMemo(() => {
    if (questions.length === 0) return <p>no data yet</p>;
    return (
      <table>
        <thead>
          <tr>
            <th>question</th>
            <th>information</th>
            <th>option</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((el) => (
            <tr key={el._id}>
              <td> {el.question} </td>
              <td> {el.informationId.subject} </td>
              <td>
                <div className="center gap-10">
                  <i
                    className="fa-solid fa-trash-can delete c-pointer"
                    title="delete"
                    onClick={() => setDeleteAction(el)}
                  />
                  <i
                    className="fa-solid fa-pen-to-square update c-pointer"
                    title="update"
                    onClick={() => setUpdate(el)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }, [questions, setUpdate, setDeleteAction]);

  const [showQuestionForm, setShowQuestionForm] = useState(false);

  const [questionsList, setQuestionsList] = useState({
    question: "",
    informationId: "",
    _id: Date.now(),
  });
  const [error, setError] = useState(false);

  const createNewQuestion = useCallback(async () => {
    if (!questionsList.informationId)
      return setError("please select information");
    if (!questionsList.question) return setError("please write your question");
    setError(false);

    setQuestions((prev) => {
      const existingIndex = prev.questions.findIndex(
        (q) => q._id === questionsList._id
      );
      let updatedQuestions;
      if (existingIndex !== -1) {
        updatedQuestions = [...prev.questions];
        updatedQuestions[existingIndex] = questionsList;
      } else {
        updatedQuestions = [...prev.questions, questionsList];
      }
      return { ...prev, questions: updatedQuestions };
    });
    setQuestionsList({
      question: "",
      informationId: "",
      _id: Date.now(),
    });
    setShowQuestionForm(false);
  }, [questionsList, setError, setQuestions]);
  const { token } = context.userDetails;

  const confirmDelete = useCallback(async () => {
    const id = selectedItem?._id;
    if (!id) return;
    const isTemporaryId = typeof id === "number";
    if (isTemporaryId) {
      setQuestions((prev) => ({
        ...prev,
        questions: prev.questions?.filter((q) => q._id !== id),
      }));
      setOverlay(false);
      return;
    }
    try {
      await axios.delete(`${baseURL}/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions((prev) => ({
        ...prev,
        questions: prev.questions?.filter((q) => q._id !== id),
      }));
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setOverlay(false);
    }
  }, [selectedItem, setQuestions, token]);

  return (
    <>
      {overlay && (
        <div className="overlay" onClick={() => setOverlay(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <h1>
              are you sure you want to delete ? ترجملي لن تتمكن من استعادتها
              لاحقا
            </h1>

            <div className="flex gap-10 wrap">
              <div onClick={confirmDelete} className="delete-all overlay-btn">
                <i className="fa-solid fa-trash"></i> {"delete"}
              </div>
              <div
                onClick={() => {
                  setOverlay(false);
                }}
                className="delete-all cencel overlay-btn"
              >
                <i className="fa-solid fa-ban"></i> {"cancel"}
              </div>
            </div>
          </div>
        </div>
      )}

      {!showQuestionForm && (
        <div className="flex question-list-container">
          <section className="question-list flex-1 show">
            <div
              className="flex gap-10"
              onClick={(e) => e.target.parentNode.classList.toggle("show")}
            >
              question list <i className="fa-solid fa-chevron-up" />
            </div>
            <article>{questionsData}</article>
          </section>
          <button
            className="btn center"
            onClick={() => setShowQuestionForm(true)}
            type="button"
          >
            <i className="fa-solid fa-plus" /> <p> add questions</p>
          </button>
        </div>
      )}

      {showQuestionForm && (
        <>
          <div className="flex direction-revers wrap">
            <SelectInputApi
              fetchData={getInformations}
              label="information"
              selectLabel="select information"
              optionLabel={(option) => option?.subject}
              onChange={(option) =>
                setQuestionsList({
                  ...questionsList,
                  informationId: option,
                })
              }
              value={questionsList.informationId.subject}
              onIgnore={() =>
                setQuestionsList({ ...questionsList, informationId: "" })
              }
            />
            <InputWithLabel
              label="question"
              id="question"
              value={questionsList.question}
              onChange={(e) =>
                setQuestionsList({
                  ...questionsList,
                  question: e.target.value,
                })
              }
              placeholder="write question's text"
              writebelType="textarea"
              rows={5}
            />
          </div>
          <div className="flex question-btns gap-20">
            <button type="button" onClick={createNewQuestion} className="save">
              <i className="fa-solid fa-bookmark"></i>
              save question
            </button>
            <button
              type="button"
              className="cancel"
              onClick={() => setShowQuestionForm(false)}
            >
              <i className="fa-solid fa-trash-can"></i>
              cancel question
            </button>
          </div>
          {error && <p className="error"> {error} </p>}
        </>
      )}
    </>
  );
};

export default QuestionListShow;
