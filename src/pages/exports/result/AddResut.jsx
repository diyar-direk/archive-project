import { useContext, useRef, useState } from "react";
import "../../../components/form/form.css";
import axios from "axios";
import useLanguage from "../../../hooks/useLanguage";
import SendData from "../../../components/response/SendData";
import Loading from "../../../components/loading/Loading";
import InputWithLabel from "../../../components/inputs/InputWithLabel";
import { baseURL, Context } from "../../../context/context";
import DocumentsShow from "../../info/DocumentsShow";
const AddResult = () => {
  const context = useContext(Context);
  const token = context.userDetails.token;
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();

  const [error, setError] = useState(false);

  const [form, setForm] = useState({
    title: "",
    date: "",
    number: "",
    subject: "",
  });

  const handleForm = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    error && setError(false);
  };

  const [documents, setDocuments] = useState({
    image: [],
    video: [],
    audio: [],
  });

  const [uploadedFiles, setUploadedFiles] = useState({ list: [] });
  const [activeFile, setActiveFile] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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
    setLoading(true);
    try {
      const data = await axios.post(`${baseURL}/results`, form, {
        headers: { Authorization: "Bearer " + token },
      });
      const id = data.data.data._id;
      const imagesDoc = new FormData();
      const videosDoc = new FormData();
      const audioDoc = new FormData();
      const documentDoc = new FormData();
      if (documents.image.length > 0) {
        imagesDoc.append("parentModel", "Result");
        imagesDoc.append("parentId", id);
        documents.image.forEach((item) => {
          imagesDoc.append(`images`, item);
        });
        try {
          await axios.post(`${baseURL}/media/images`, imagesDoc, {
            headers: { Authorization: "Bearer " + token },
          });
        } catch (error) {
          console.log(error);
          alert("error in uploading images");
        }
      }

      if (documents.video.length > 0) {
        videosDoc.append("parentModel", "Result");
        videosDoc.append("parentId", id);
        documents.video.forEach((item) => {
          videosDoc.append(`videos`, item);
        });
        try {
          await axios.post(`${baseURL}/media/videos`, videosDoc, {
            headers: { Authorization: "Bearer " + token },
          });
        } catch (error) {
          alert("error in uploading videos");
          console.log(error);
        }
      }
      if (documents.audio.length > 0) {
        audioDoc.append("parentModel", "Result");
        audioDoc.append("parentId", id);
        documents.audio.forEach((item) => {
          audioDoc.append(`audios`, item);
        });
        try {
          await axios.post(`${baseURL}/media/audios`, audioDoc, {
            headers: { Authorization: "Bearer " + token },
          });
        } catch (error) {
          alert("error in uploading audios");
          console.log(error);
        }
      }
      if (uploadedFiles.list.length > 0) {
        documentDoc.append("parentModel", "Result");
        documentDoc.append("parentId", id);
        uploadedFiles.list.forEach((item) => {
          documentDoc.append(`documents`, item);
        });
        try {
          await axios.post(`${baseURL}/media/documents`, documentDoc, {
            headers: { Authorization: "Bearer " + token },
          });
        } catch (error) {
          alert("error in uploading documents");
          console.log(error);
        }
      }
      if (data.status === 201) {
        responseFun(true);
        setForm({
          title: "",
          date: "",
          number: "",
          subject: "",
        });
        setDocuments({
          image: [],
          video: [],
          audio: [],
        });
        setUploadedFiles({ list: [] });
      }
    } catch (error) {
      console.log(error);
      if (error.status === 400) responseFun("reapeted data");
      else responseFun(false);
    } finally {
      setLoading(false);
    }
  };

  const removeDuplicates = (filesArray) => {
    const fileMap = new Map();
    filesArray.forEach((file) => {
      fileMap.set(file.name, file);
    });
    return Array.from(fileMap.values());
  };

  const handleFiles = (files) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    const videoFiles = files.filter((file) => file.type.startsWith("video/"));
    const audioFiles = files.filter((file) => file.type.startsWith("audio/"));
    const documentFiles = files.filter((file) =>
      [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ].includes(file.type)
    );

    setDocuments((prev) => ({
      ...prev,
      image: removeDuplicates([...prev.image, ...imageFiles]),
      video: removeDuplicates([...prev.video, ...videoFiles]),
      audio: removeDuplicates([...prev.audio, ...audioFiles]),
    }));

    setUploadedFiles((prev) => ({
      ...prev,
      list: removeDuplicates([...prev.list, ...documentFiles]),
    }));
  };

  return (
    <>
      {responseOverlay && (
        <SendData data={"result"} response={response.current} />
      )}
      {loading && <Loading />}
      <h1 className="title"> {language?.reports.add_results}</h1>

      <form onSubmit={handleSubmit} className="dashboard-form">
        <div className="form">
          <div className="flex wrap">
            <InputWithLabel
              label={language?.reports.result_title}
              value={form.title}
              required
              onChange={handleForm}
              placeholder={language?.reports.result_title_placeholder}
              id="title"
            />
            <InputWithLabel
              label={language?.reports.result_date}
              value={form.date}
              required
              onChange={handleForm}
              type="date"
              id="date"
            />
            <InputWithLabel
              label={language?.reports.result_number}
              value={form.number}
              required
              onChange={handleForm}
              placeholder={language?.reports.result_number_placeholder}
              id="number"
            />
          </div>
        </div>

        <div className="form">
          <h1>
            <label htmlFor="subject">{language?.reports.result_subject}</label>
          </h1>
          <div className="flex wrap">
            <InputWithLabel
              value={form.subject}
              required
              onChange={handleForm}
              placeholder={language?.reports.result_subject_placeholder}
              id="subject"
              rows={6}
              writebelType="textarea"
            />
          </div>
        </div>

        <div className="form">
          <h1>{language?.information?.files}</h1>
          <div>
            <div className="flex flex-direction">
              <label
                className="inp document gap-10 center"
                onDrop={(e) => {
                  e.preventDefault();
                  const files = Array.from(e.dataTransfer.files);
                  handleFiles(files);
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*, video/*, .mp3, .wav, .mpeg, .ogg, .flac, .aac, .pdf, .docx, .txt"
                  onInput={(e) => {
                    const files = Array.from(e.target.files);
                    handleFiles(files);
                  }}
                />
                {language?.information?.upload_files || "Upload Files"}
                <i className="fa-solid fa-file-upload"></i>
              </label>
            </div>
          </div>
        </div>

        {documents.image.length > 0 && (
          <DocumentsShow
            documents={{ documents, setDocuments }}
            title={language?.information?.images}
            data="image"
          />
        )}

        {documents.video.length > 0 && (
          <DocumentsShow
            documents={{ documents, setDocuments }}
            title={language?.information?.videos}
            data="video"
          />
        )}

        {documents.audio.length > 0 && (
          <DocumentsShow
            documents={{ documents, setDocuments }}
            title={language?.information?.audios}
            data="audio"
          />
        )}

        {uploadedFiles.list.length > 0 && (
          <DocumentsShow
            popup={{ setIsPopupOpen, isPopupOpen }}
            activeFile={{ activeFile, setActiveFile }}
            documents={{
              documents: uploadedFiles,
              setDocuments: setUploadedFiles,
            }}
            title={language?.information?.documents}
            data="list"
          />
        )}

        {isPopupOpen && activeFile && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>{language?.information?.preview_file}</h2>
              {activeFile.type === "text/plain" ||
              activeFile.type === "docx" ? (
                <div className="file-content">{activeFile.content}</div>
              ) : activeFile.type === "application/pdf" ? (
                <>
                  <iframe
                    src={activeFile.content}
                    title="PDF Preview"
                    width="100%"
                    height="500px"
                  ></iframe>
                  <a
                    href={activeFile.content}
                    download={activeFile.name}
                    target="_blank"
                    rel="noreferrer"
                    className="btn"
                  >
                    {language?.information?.open_in_browser}
                  </a>
                </>
              ) : null}
              <button onClick={() => setIsPopupOpen(false)}>
                {language?.information?.close}
              </button>
            </div>
          </div>
        )}

        {error && <p className="error"> {error} </p>}
        <button className="btn">{language?.information?.save}</button>
      </form>
    </>
  );
};

export default AddResult;
