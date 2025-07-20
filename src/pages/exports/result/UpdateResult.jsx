import { useContext, useEffect, useRef, useState } from "react";
import "../../../components/form/form.css";
import axios from "axios";
import useLanguage from "../../../hooks/useLanguage";
import SendData from "../../../components/response/SendData";
import Loading from "../../../components/loading/Loading";
import InputWithLabel from "../../../components/inputs/InputWithLabel";
import { baseURL, Context } from "../../../context/context";
import DocumentsShow from "../../info/DocumentsShow";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
const UpdateResult = () => {
  const context = useContext(Context);
  const token = context.userDetails.token;
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  const { id } = useParams();
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${baseURL}/results/${id}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setForm({ ...res.data.data, date: res.data.data.date.split("T")[0] });
        setDocuments({
          image: res.data.data.media.images,
          video: res.data.data.media.videos,
          audio: res.data.data.media.audios,
        });
        setUploadedFiles({ list: res.data.data.media.documents });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setDataLoading(false);
      });
  }, []);

  const nav = useNavigate();

  const [error, setError] = useState(false);

  const [form, setForm] = useState({});

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
      const data = await axios.patch(`${baseURL}/results/${id}`, form, {
        headers: { Authorization: "Bearer " + token },
      });
      const newImages = documents.image.filter((itm) => !itm._id);
      const newVideos = documents.video.filter((itm) => !itm._id);
      const newAudios = documents.audio.filter((itm) => !itm._id);
      const newFiles = uploadedFiles.list.filter((itm) => !itm._id);
      const imagesDoc = new FormData();
      const videosDoc = new FormData();
      const audioDoc = new FormData();
      const documentDoc = new FormData();
      if (newImages?.length > 0) {
        imagesDoc.append("parentModel", "Result");
        imagesDoc.append("parentId", id);
        newImages.forEach((item) => {
          imagesDoc.append(`images`, item);
        });
        try {
          await axios.post(`${baseURL}/media/images`, imagesDoc, {
            headers: { Authorization: "Bearer " + token },
          });
        } catch (error) {
          console.log(error);
        }
      }

      if (newVideos?.length > 0) {
        videosDoc.append("parentModel", "Result");
        videosDoc.append("parentId", id);
        newVideos.forEach((item) => {
          videosDoc.append(`videos`, item);
        });
        try {
          await axios.post(`${baseURL}/media/videos`, videosDoc, {
            headers: { Authorization: "Bearer " + token },
          });
        } catch (error) {
          console.log(error);
        }
      }

      if (newAudios?.length > 0) {
        audioDoc.append("parentModel", "Result");
        audioDoc.append("parentId", id);
        newAudios.forEach((item) => {
          audioDoc.append(`audios`, item);
        });
        try {
          await axios.post(`${baseURL}/media/audios`, audioDoc, {
            headers: { Authorization: "Bearer " + token },
          });
        } catch (error) {
          console.log(error);
        }
      }

      if (newFiles?.length > 0) {
        documentDoc.append("parentModel", "Result");
        documentDoc.append("parentId", id);
        newFiles.forEach((item) => {
          documentDoc.append(`documents`, item);
        });
        try {
          await axios.post(`${baseURL}/media/documents`, documentDoc, {
            headers: { Authorization: "Bearer " + token },
          });
        } catch (error) {
          console.log(error);
        }
      }

      if (data.status === 200) nav(-1);
    } catch (error) {
      console.log(error);
      responseFun(false);
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

  if (dataLoading)
    return (
      <>
        <Skeleton width="100%" height="200px" />
        <Skeleton width="100%" height="200px" />
      </>
    );

  return (
    <>
      {responseOverlay && (
        <SendData data={"result"} response={response.current} />
      )}
      {loading && <Loading />}

      <form onSubmit={handleSubmit} className="dashboard-form">
        <div className="form">
          <div className="flex wrap">
            <InputWithLabel
              label="title"
              value={form.title}
              required
              onChange={handleForm}
              placeholder={"language?.information?.title"}
              id="title"
            />
            <InputWithLabel
              label="date"
              value={form.date}
              required
              onChange={handleForm}
              type="date"
              id="date"
            />
            <InputWithLabel
              label="number"
              value={form.number}
              required
              onChange={handleForm}
              placeholder={"language?.information?.number"}
              id="number"
            />
          </div>
        </div>

        <div className="form">
          <h1>
            <label htmlFor="subject">subject</label>
          </h1>
          <div className="flex wrap">
            <InputWithLabel
              value={form.subject}
              required
              onChange={handleForm}
              placeholder={"language?.information?.subject_placeholder"}
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

        {documents?.image?.length > 0 && (
          <DocumentsShow
            backendKey="/media/images"
            documents={{ documents, setDocuments }}
            data="image"
          />
        )}

        {documents?.video?.length > 0 && (
          <DocumentsShow
            backendKey="/media/videos"
            documents={{ documents, setDocuments }}
            data="video"
          />
        )}

        {documents?.audio?.length > 0 && (
          <DocumentsShow
            backendKey="/media/audios"
            documents={{ documents, setDocuments }}
            data="audio"
          />
        )}

        {uploadedFiles?.list?.length > 0 && (
          <DocumentsShow
            backendKey="/media/documents"
            popup={{ setIsPopupOpen, isPopupOpen }}
            activeFile={{ activeFile, setActiveFile }}
            documents={{
              documents: uploadedFiles,
              setDocuments: setUploadedFiles,
            }}
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

export default UpdateResult;
