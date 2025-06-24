import React, { useContext, useEffect, useRef, useState } from "react";
import "../../components/form/form.css";
import "./information.css";
import { baseURL } from "../../context/context";
import axios from "axios";
import SendData from "../../components/response/SendData";
import Loading from "../../components/loading/Loading";
import People from "./../people/People";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormSelect from "../../components/form/FormSelect";
import DocumentsShow from "./DocumentsShow";
import Skeleton from "react-loading-skeleton";
import { Context } from "./../../context/context";
import useLanguage from "../../hooks/useLanguage";
const UpdateInfo = () => {
  const { id } = useParams();
  const context = useContext(Context);
  const token = context.userDetails.token;
  const [dataLoading, setDataLoading] = useState(true);
  const [form, setForm] = useState({});
  const { language } = useLanguage();

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    axios
      .get(`${baseURL}/Information/${id}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (
          context.userDetails.role === "user" &&
          context.userDetails.sectionId !== res.data.data.sectionId._id
        ) {
          nav("/dashboard/not-found-404");
          return;
        }

        setForm(res.data.data);
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

  window.addEventListener("click", () => {
    const selectDiv = document.querySelector("div.form .selecte .inp.active");
    selectDiv && selectDiv.classList.remove("active");
  });
  const nav = useNavigate();

  const [error, setError] = useState(false);

  const handleForm = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    error && setError(false);
  };

  const [documents, setDocuments] = useState({});

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
    if (!form.countryId) setError(language?.error?.select_country);
    else if (!form.governmentId) setError(language?.error?.select_government);
    else if (!form.cityId) setError(language?.error?.please_selecet_city);
    else if (!form.sectionId) setError(language?.error?.please_selecet_section);
    else if (form?.sources?.length < 1)
      setError(language?.error?.please_selecet_source);
    else if (!form.credibility)
      setError(language?.error?.please_selecet_credibility);
    else {
      setLoading(true);
      const keys = Object.keys(form);
      const formData = { ...form };

      keys.forEach((key) => {
        if (
          (form[key] && !Array.isArray(form[key])) ||
          (Array.isArray(form[key]) && form[key]?.length !== 0)
        ) {
          if (!Array.isArray(form[key])) {
            formData[key] = form[key]?._id ? form[key]._id : form[key];
          } else {
            formData[key] = form[key].map((itm) => itm._id || itm);
          }
        } else {
          formData[key] = null;
        }
      });

      try {
        const data = await axios.patch(
          `${baseURL}/Information/${id}`,
          formData,
          { headers: { Authorization: "Bearer " + token } }
        );
        const newImages = documents.image.filter((itm) => !itm._id);
        const newVideos = documents.video.filter((itm) => !itm._id);
        const newAudios = documents.audio.filter((itm) => !itm._id);
        const newFiles = uploadedFiles.list.filter((itm) => !itm._id);
        const imagesDoc = new FormData();
        const videosDoc = new FormData();
        const audioDoc = new FormData();
        const documentDoc = new FormData();
        if (newImages?.length > 0) {
          imagesDoc.append("informationId", id);
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
          videosDoc.append("informationId", id);
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
          audioDoc.append("informationId", id);
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
          documentDoc.append("informationId", id);
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

        if (data.status === 200) nav("/dashboard/informations");
      } catch (error) {
        console.log(error);
        responseFun(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const deSelect = (id) => {
    setForm({ ...form, people: form.people.filter((e) => e._id !== id._id) });
  };

  const handleFormSelect = (e, itm) => {
    setForm({ ...form, [e.target.id]: itm });
    error && setError(false);
  };
  const handleClick = (e) => {
    e.stopPropagation();
    const divs = document.querySelectorAll("div.form .selecte .inp.active");
    divs.forEach((ele) => ele !== e.target && ele.classList.remove("active"));
    e.target.classList.toggle("active");
  };
  const ignoreSelect = (e) => {
    setForm({ ...form, [e.target.title]: "" });
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
        <SendData data={language?.header?.information}  response={response.current} />
      )}
      {loading && <Loading />}
      {dataLoading ? (
        <>
          <Skeleton width={"100%"} height={"200px"} />
          <br />
          <Skeleton width={"100%"} height={"400px"} />
        </>
      ) : (
        <>
          <h2 className="text-capitalize font-color mb-10">
            {language?.information?.select_people}
          </h2>
          <People
            workSpace="add_info align-center"
            people={{ setForm, form }}
          />
          <div className="selected-people flex wrap gap-10">
            <h2 className="text-capitalize font-color">{`${
              language?.information?.people_selected
            } : ${
              form?.people?.length <= 0 ? language?.information?.no_one : ""
            }`}</h2>
            {form?.people?.length > 0 &&
              form.people.map((e) => (
                <div key={e._id} className="center gap-10">
                  <Link
                    to={`/dashboard/people/${e._id}`}
                    className="center text-capitalize font-color"
                  >
                    {e.firstName} {e.surName}
                  </Link>
                  <i
                    onClick={() => deSelect(e)}
                    className="fa-solid fa-xmark"
                  ></i>
                </div>
              ))}
          </div>

          <form onSubmit={handleSubmit} className="dashboard-form">
            <div className="form">
              <h1>{language?.information?.information} </h1>
              <div className="flex wrap">
                <div className="flex flex-direction">
                  <label htmlFor="subject">
                    {language?.information?.subject}
                  </label>
                  <textarea
                    required
                    value={form.subject}
                    onChange={handleForm}
                    className="inp"
                    placeholder={language?.information?.subject_placeholder}
                    id="subject"
                    rows={5}
                  ></textarea>
                </div>
                <div className="flex flex-direction">
                  <label htmlFor="note">{language?.information?.notes}</label>
                  <textarea
                    value={form.note}
                    onChange={handleForm}
                    required
                    className="inp"
                    placeholder={language?.information?.notes_placeholder}
                    id="note"
                    rows={5}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="form">
              <h1>{language?.information?.adress}</h1>
              <div className="flex wrap">
                <FormSelect
                  formKey="country"
                  error={{ error, setError }}
                  form={{ form, setForm }}
                />

                <FormSelect
                  formKey="government"
                  error={{ error, setError }}
                  form={{ form, setForm }}
                />

                <FormSelect
                  formKey="city"
                  error={{ error, setError }}
                  form={{ form, setForm }}
                />

                <FormSelect
                  formKey="village"
                  error={{ error, setError }}
                  form={{ form, setForm }}
                />

                <FormSelect
                  formKey="region"
                  error={{ error, setError }}
                  form={{ form, setForm }}
                />

                <FormSelect
                  formKey="street"
                  error={{ error, setError }}
                  form={{ form, setForm }}
                />

                <FormSelect
                  formKey="coordinates"
                  type="multi"
                  error={{ error, setError }}
                  form={{ form, setForm }}
                />

                <div className="flex flex-direction">
                  <label htmlFor="addressDetails">
                    {language?.information?.extra_adress_details}
                  </label>
                  <textarea
                    value={form.addressDetails || ""}
                    onChange={handleForm}
                    className="inp"
                    placeholder={
                      language?.information?.extra_adress_details_placeholder
                    }
                    id="addressDetails"
                    rows={4}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="form">
              <h1>{language?.information?.more_information}</h1>
              <div className="flex wrap">
                {context.userDetails.isAdmin && (
                  <FormSelect
                    formKey="section"
                    error={{ error, setError }}
                    form={{ form, setForm }}
                  />
                )}

                <div className="flex flex-direction">
                  <label>{language?.information?.credibility}</label>
                  <div className="selecte relative">
                    <div onClick={handleClick} className="inp">
                      {language?.information?.select_credibility}
                    </div>
                    <article>
                      <h2
                        onClick={(e) => handleFormSelect(e, e.target.title)}
                        id="credibility"
                        title="Low"
                      >
                        {language?.information?.low}
                      </h2>
                      <h2
                        onClick={(e) => handleFormSelect(e, e.target.title)}
                        id="credibility"
                        title="Medium"
                      >
                        {language?.information?.medium}
                      </h2>
                      <h2
                        onClick={(e) => handleFormSelect(e, e.target.title)}
                        id="credibility"
                        title="High"
                      >
                        {language?.information?.high}
                      </h2>
                    </article>
                  </div>
                  {form.credibility && (
                    <span title="credibility" onClick={ignoreSelect}>
                      {form.credibility}
                    </span>
                  )}
                </div>

                <FormSelect
                  formKey="events"
                  type="multi"
                  error={{ error, setError }}
                  form={{ form, setForm }}
                />
                <FormSelect
                  formKey="parties"
                  type="multi"
                  error={{ error, setError }}
                  form={{ form, setForm }}
                />
                <FormSelect
                  formKey="sources"
                  type="multi"
                  error={{ error, setError }}
                  form={{ form, setForm }}
                />
              </div>
            </div>

            <div className="form">
              <h1>
                <label htmlFor="details">
                  {language?.information?.details}
                </label>
              </h1>
              <div className="flex wrap">
                <div className="flex flex-direction">
                  <textarea
                    value={form.details}
                    required
                    onChange={handleForm}
                    className="inp"
                    placeholder={language?.information?.details_placeholder}
                    id="details"
                    rows={4}
                  ></textarea>
                </div>
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
      )}
    </>
  );
};

export default UpdateInfo;
