import { useCallback, useContext, useMemo, useState } from "react";
import SelectInputApi from "../../../components/inputs/SelectInputApi";
import InputWithLabel from "../../../components/inputs/InputWithLabel";
import "./questions.css";
import axios from "axios";
import { baseURL, Context } from "../../../context/context";
import { getInformations } from "../../info/getInformations";
import useLanguage from "../../../hooks/useLanguage";

const QuestionListShow = ({ questions, setQuestions }) => {
  const context = useContext(Context);
  const [overlay, setOverlay] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { language } = useLanguage();
  const setUpdate = useCallback((e) => {
    setQuestionsList(e);
    setShowQuestionForm(true);
  }, []);

  const setDeleteAction = useCallback((e) => {
    setOverlay(true);
    setSelectedItem(e);
  }, []);
  const questionsData = useMemo(() => {
    if (questions.length === 0) return <p>{language?.exports?.no_data}</p>;
    return (
      <table>
        <thead>
          <tr>
            <th>{language?.exports.question}</th>
            <th>{language?.exports.information}</th>
            <th>{language?.exports.option}</th>
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
      return setError(language?.error?.please_selecet_information);
    if (!questionsList.question)
      return setError(language?.error?.question_text_error);
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
  }, [questionsList, setError, setQuestions, language]);

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
            <h1>{language?.exports.are_you_sure_delete}</h1>

            <div className="flex gap-10 wrap">
              <div onClick={confirmDelete} className="delete-all overlay-btn">
                <i className="fa-solid fa-trash"></i> {language?.exports.delete}
              </div>
              <div
                onClick={() => {
                  setOverlay(false);
                }}
                className="delete-all cencel overlay-btn"
              >
                <i className="fa-solid fa-ban"></i> {language?.exports.cancel}
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
              {language?.exports.question_list}{" "}
              <i className="fa-solid fa-chevron-up" />
            </div>
            <article>{questionsData}</article>
          </section>
          <button
            className="btn center"
            onClick={() => setShowQuestionForm(true)}
            type="button"
          >
            <i className="fa-solid fa-plus" />{" "}
            <p> {language?.exports.add_question}</p>
          </button>
        </div>
      )}

      {showQuestionForm && (
        <>
          <div className="flex direction-revers wrap">
            <SelectInputApi
              fetchData={getInformations}
              label={language?.exports.information}
              selectLabel={language?.exports.information_placeholder}
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
              label={language?.exports.question}
              id="question"
              value={questionsList.question}
              onChange={(e) =>
                setQuestionsList({
                  ...questionsList,
                  question: e.target.value,
                })
              }
              placeholder={language?.exports.question_placeholder}
              writebelType="textarea"
              rows={5}
            />
          </div>
          <div className="flex question-btns gap-20">
            <button type="button" onClick={createNewQuestion} className="save">
              <i className="fa-solid fa-bookmark"></i>
              {language?.exports.save}
            </button>
            <button
              type="button"
              className="cancel"
              onClick={() => setShowQuestionForm(false)}
            >
              <i className="fa-solid fa-trash-can"></i>
              {language?.exports.cancel}
            </button>
          </div>
          {error && <p className="error"> {error} </p>}
        </>
      )}
    </>
  );
};

export default QuestionListShow;
