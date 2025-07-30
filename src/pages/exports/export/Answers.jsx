import axios from "axios";
import { useCallback, useContext, useMemo, useState } from "react";
import { baseURL, Context } from "../../../context/context";
import Button from "../../../components/Button";
import useLanguage from "../../../hooks/useLanguage";

const Answers = ({ question, refreshData }) => {
  const [showTextArea, setShowTextArea] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const context = useContext(Context);
  const { token } = context.userDetails;
  const [form, setForm] = useState({ answer: "" });
  const [overlay, setOverlay] = useState(false);

  const { language } = useLanguage();
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSending(true);
      try {
        await axios.patch(`${baseURL}/questions/${question._id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        refreshData((prev) => ({
          ...prev,
          questions: prev.questions.map((ele) =>
            ele._id === question._id ? { ...ele, answer: form.answer } : ele
          ),
        }));
        setForm({ answer: "" });
      } catch (error) {
        console.log(error);
      } finally {
        setIsSending(false);
        setShowTextArea(false);
      }
    },
    [setIsSending, token, question._id, form, refreshData]
  );
  const answerArea = useMemo(() => {
    if (!question.answer || (question.answer && showTextArea))
      return (
        <>
          {!showTextArea ? (
            <p onClick={() => setShowTextArea(true)}>
              <i className="fa-solid fa-plus" />{" "}
              {language.exports.no_answer_yet}
            </p>
          ) : (
            <form className="w-100" onSubmit={handleSubmit}>
              <textarea
                rows={5}
                className="inp"
                placeholder={language.exports.answer_placeholder}
                required
                value={form.answer}
                onChange={(e) =>
                  !isSending && setForm({ answer: e.target.value })
                }
              />
              <div className="flex gap-10 wrap">
                <Button isSending={isSending}>{language.exports.save}</Button>
                <Button
                  onClick={() => setShowTextArea(false)}
                  className="btn cencel"
                  type="button"
                >
                  {language.exports.cancel}
                </Button>
              </div>
            </form>
          )}
        </>
      );
    else
      return (
        <p className="answer-text flex">
          <span className="flex-1">{question.answer}</span>
          <i
            className="fa-solid fa-ellipsis menu"
            title="options"
            onClick={(e) => {
              e.stopPropagation();
              e.target.nextSibling.classList.toggle("active");
            }}
          />
          <div>
            <article className="delete" onClick={() => setOverlay(true)}>
              <i className="fa-solid fa-trash-can" />
              <span className="flex-1"> {language.exports.delete_answer}</span>
            </article>
            <article
              className="update"
              onClick={() => {
                setShowTextArea(true);
                setForm({ answer: question.answer });
              }}
            >
              <i className="fa-solid fa-pen-to-square" />
              <span className="flex-1"> {language.exports.update_answer}</span>
            </article>
          </div>
        </p>
      );
  }, [question, showTextArea, form.answer, handleSubmit, isSending, language]);

  const confirmDelete = useCallback(async () => {
    setIsSending(true);
    try {
      await axios.patch(
        `${baseURL}/questions/${question._id}`,
        { answer: "" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      refreshData((prev) => ({
        ...prev,
        questions: prev.questions.map((ele) =>
          ele._id === question._id ? { ...ele, answer: "" } : ele
        ),
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setIsSending(false);
      setOverlay(false);
    }
  }, [setIsSending, token, question._id, refreshData]);

  return (
    <>
      {overlay && (
        <div
          className="overlay"
          onClick={() => {
            setOverlay(false);
          }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <h1>تاكيد الحذف</h1>
            <div className="flex gap-10 wrap">
              <Button
                onClick={confirmDelete}
                className="delete-all overlay-btn btn"
                isSending={isSending}
                isSendingText="deleteing please wait"
              >
                <i className="fa-solid fa-trash"></i> {language.exports.delete}
              </Button>

              <Button
                onClick={() => {
                  setOverlay(false);
                }}
                className="delete-all cencel overlay-btn btn"
                disabled={isSending}
              >
                <i className="fa-solid fa-ban"></i> {language.exports.cancel}
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="info">
        <div className="flex">
          <h2>{language.exports.question}</h2>
          <p>{question.question}</p>
        </div>
        <div className="flex answer-container">
          <h2>{language.exports.answer}</h2>
          {answerArea}
        </div>
      </div>
    </>
  );
};

export default Answers;
window.addEventListener("click", () => {
  if (document.querySelector(".answer-text > div.active"))
    document
      .querySelector(".answer-text > div.active")
      .classList.remove("active");
});
