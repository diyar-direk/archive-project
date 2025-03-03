import React, { useContext, useRef, useState } from "react";
import "../../components/form/form.css";
import "./information.css";
import { baseURL, Context } from "../../context/context";
import axios from "axios";
import SendData from "../../components/response/SendData";
import Loading from "../../components/loading/Loading";
import People from "./../people/People";
import { Link } from "react-router-dom";
import FormSelect from "../../components/form/FormSelect";
import DocumentsShow from "./DocumentsShow";
import useLanguage from "../../hooks/useLanguage";
const AddInformation = () => {
  const context = useContext(Context);
  const token = context.userDetails.token;
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();

  window.addEventListener("click", () => {
    const selectDiv = document.querySelector("div.form .selecte .inp.active");
    selectDiv && selectDiv.classList.remove("active");
  });

  const [error, setError] = useState(false);

  const [form, setForm] = useState({
    //personal data
    people: [],
    coordinates: [],
    subject: "",
    note: "",
    details: "",
    sectionId: context.userDetails.sectionId || "",
    cityId: "",
    countryId: "",
    governmentId: "",
    regionId: "",
    villageId: "",
    streetId: "",
    addressDetails: "",
    //categories data
    credibility: "",
    sources: [],
    events: [],
    parties: [],
  });
  const handleFormSelect = (e, itm) => {
    setForm({ ...form, [e.target.id]: itm });
    error && setError(false);
  };
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
    if (!form.countryId) setError(language?.error?.select_country);
    else if (!form.governmentId) setError(language?.error?.select_government);
    else if (!form.cityId) setError(language?.error?.please_selecet_city);
    else if (!form.sectionId) setError(language?.error?.please_selecet_section);
    else if (form.sources.length < 1)
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
          if (!Array.isArray(form[key])) {
            formData[key] = null;
          } else {
            formData[key] = [];
          }
        }
      });

      try {
        const data = await axios.post(`${baseURL}/Information`, formData, {
          headers: { Authorization: "Bearer " + token },
        });
        const id = data.data.data._id;

        const imagesDoc = new FormData();
        const videosDoc = new FormData();
        const audioDoc = new FormData();
        const documentDoc = new FormData();
        if (documents.image.length > 0) {
          imagesDoc.append("informationId", id);
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
          videosDoc.append("informationId", id);
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
          audioDoc.append("informationId", id);
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
          documentDoc.append("informationId", id);
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
            //personal data
            people: [],
            coordinates: [],
            subject: "",
            note: "",
            details: "",
            sectionId: context.userDetails.sectionId || "",
            cityId: "",
            countryId: "",
            governmentId: "",
            regionId: "",
            villageId: "",
            streetId: "",
            addressDetails: "",
            //categories data
            credibility: "",
            sources: [],
            events: [],
            parties: [],
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
    }
  };

  const deSelect = (id) => {
    setForm({ ...form, people: form.people.filter((e) => e._id !== id._id) });
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

  return (
    <>
      {responseOverlay && (
        <SendData data={`person`} response={response.current} />
      )}
      {loading && <Loading />}
      <h1 className="title"> {language?.header?.add_information}</h1>
      <h2 className="text-capitalize font-color mb-10">
        {language?.information?.select_people}
      </h2>
      <People workSpace="add_info align-center" people={{ setForm, form }} />
      <div className="selected-people flex wrap gap-10">
        <h2 className="text-capitalize font-color">{`${
          language?.information?.people_selected
        } : ${
          form.people.length <= 0 ? language?.information?.no_one : ""
        }`}</h2>
        {form.people.length > 0 &&
          form.people.map((e) => (
            <div key={e._id} className="center gap-10">
              <Link
                to={`/dashboard/people/${e._id}`}
                className="center text-capitalize font-color"
              >
                {e.firstName} {e.surName}
              </Link>
              <i onClick={() => deSelect(e)} className="fa-solid fa-xmark"></i>
            </div>
          ))}
      </div>

      <form onSubmit={handleSubmit} className="dashboard-form">
        <div className="form">
          <h1>{language?.information?.information} </h1>
          <div className="flex wrap">
            <div className="flex flex-direction">
              <label htmlFor="subject">{language?.information?.subject}</label>
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
                value={form.addressDetails}
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
            <label htmlFor="details">{language?.information?.details}</label>
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
                rows={6}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="form">
          <h1>{language?.information?.files}</h1>
          <div className="grid-2">
            <div className="flex flex-direction">
              <label className="inp document gap-10 center">
                <input
                  multiple
                  accept="image/*"
                  type="file"
                  id="image"
                  onInput={(e) => {
                    setDocuments((prevDocuments) => ({
                      ...prevDocuments,
                      image: [
                        ...prevDocuments.image,
                        ...Array.from(e.target.files),
                      ],
                    }));
                  }}
                />
                {language?.information?.upload_images}
                <i className="fa-regular fa-image"></i>
              </label>
            </div>

            <div className="flex flex-direction">
              <label className="inp document gap-10 center">
                <input
                  type="file"
                  id="video"
                  multiple
                  accept="video/*"
                  onInput={(e) => {
                    setDocuments((prevDocuments) => ({
                      ...prevDocuments,
                      video: [
                        ...prevDocuments.video,
                        ...Array.from(e.target.files),
                      ],
                    }));
                  }}
                />
                {language?.information?.upload_videos}
                <i className="fa-solid fa-video"></i>
              </label>
            </div>

            <div className="flex flex-direction">
              <label className="inp document gap-10 center">
                <input
                  type="file"
                  id="audio"
                  multiple
                  accept=".mp3, .wav, .mpeg, .ogg, .flac, .aac"
                  onInput={(e) => {
                    setDocuments((prevDocuments) => ({
                      ...prevDocuments,
                      audio: [
                        ...prevDocuments.audio,
                        ...Array.from(e.target.files),
                      ],
                    }));
                  }}
                />
                {language?.information?.upload_audios}
                <i className="fa-solid fa-microphone"></i>
              </label>
            </div>

            <div className="flex flex-direction">
              <label className="inp document gap-10 center">
                <input
                  type="file"
                  id="list"
                  multiple
                  accept=".pdf, .docx, .txt"
                  onInput={(e) => {
                    const validFiles = Array.from(e.target.files).filter(
                      (file) =>
                        [
                          "application/pdf",
                          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                          "text/plain",
                        ].includes(file.type)
                    );
                    setUploadedFiles((prevFiles) => ({
                      ...prevFiles,
                      list: [...prevFiles.list, ...validFiles],
                    }));
                  }}
                />
                {language?.information?.upload_documents}
                <i className="fa-solid fa-file"></i>
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

export default AddInformation;
