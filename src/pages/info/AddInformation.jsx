import React, { useRef, useState } from "react";
import "../../components/form/form.css";
import "./information.css";
import { baseURL } from "../../context/context";
import axios from "axios";
import SendData from "../../components/response/SendData";
import Loading from "../../components/loading/Loading";
import People from "./../people/People";
import { Link } from "react-router-dom";
import FormSelect from "../../components/form/FormSelect";
import DocumentsShow from "./DocumentsShow";
const AddInformation = () => {
  const [loading, setLoading] = useState(false);

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
    sectionId: "",
    cityId: "",
    countryId: "",
    governmentId: "",
    regionId: "",
    villageId: "",
    streetId: "",
    addressDetails: "",
    //categories data
    sources: [],
    events: [],
    parties: [],
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
    if (!form.countryId) setError("please select country");
    else if (!form.governmentId) setError("please select government");
    else if (!form.cityId) setError("please select city");
    else if (!form.sectionId) setError("please select section");
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
        const data = await axios.post(`${baseURL}/Information`, formData);
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
            await axios.post(`${baseURL}/media/images`, imagesDoc);
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
            await axios.post(`${baseURL}/media/videos`, videosDoc);
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
            await axios.post(`${baseURL}/media/audios`, audioDoc);
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
            await axios.post(`${baseURL}/media/documents`, documentDoc);
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
            sectionId: "",
            cityId: "",
            countryId: "",
            governmentId: "",
            regionId: "",
            villageId: "",
            streetId: "",
            addressDetails: "",
            //categories data
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

  return (
    <>
      {responseOverlay && (
        <SendData data={`person`} response={response.current} />
      )}
      {loading && <Loading />}
      <h1 className="title">add info</h1>
      <h2 className="text-capitalize font-color mb-10">select people</h2>
      <People workSpace="add_info align-center" people={{ setForm, form }} />
      <div className="selected-people flex wrap gap-10">
        <h2 className="text-capitalize font-color">{`people selectd : ${
          form.people.length <= 0 ? "no one" : ""
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
          <h1>subject info </h1>
          <div className="flex wrap">
            <div className="flex flex-direction">
              <label htmlFor="subject">subject</label>
              <textarea
                required
                value={form.subject}
                onChange={handleForm}
                className="inp"
                placeholder="test"
                id="subject"
                rows={4}
              ></textarea>
            </div>
            <div className="flex flex-direction">
              <label htmlFor="note">note</label>
              <textarea
                value={form.note}
                onChange={handleForm}
                required
                className="inp"
                placeholder="test"
                id="note"
                rows={4}
              ></textarea>
            </div>
            <div className="flex flex-direction">
              <label htmlFor="details">details</label>
              <textarea
                value={form.details}
                required
                onChange={handleForm}
                className="inp"
                placeholder="test"
                id="details"
                rows={4}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="form">
          <h1>place informations</h1>
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
              <label htmlFor="addressDetails">addressDetails</label>
              <textarea
                value={form.addressDetails}
                onChange={handleForm}
                className="inp"
                placeholder="test"
                id="addressDetails"
                rows={4}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="form">
          <h1>more informations</h1>
          <div className="flex wrap">
            <FormSelect
              formKey="section"
              error={{ error, setError }}
              form={{ form, setForm }}
            />

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
          <h1>test title2</h1>
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
                upload image
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
                upload video
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
                upload audio
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
                Upload Document
                <i className="fa-solid fa-file"></i>
              </label>
            </div>
          </div>
        </div>

        {documents.image.length > 0 && (
          <DocumentsShow documents={{ documents, setDocuments }} data="image" />
        )}

        {documents.video.length > 0 && (
          <DocumentsShow documents={{ documents, setDocuments }} data="video" />
        )}

        {documents.audio.length > 0 && (
          <DocumentsShow documents={{ documents, setDocuments }} data="audio" />
        )}

        {uploadedFiles.list.length > 0 && (
          <DocumentsShow
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
              <h2>File Preview</h2>
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
                    Open in Browser
                  </a>
                </>
              ) : null}
              <button onClick={() => setIsPopupOpen(false)}>Close</button>
            </div>
          </div>
        )}

        {error && <p className="error"> {error} </p>}
        <button className="btn">save</button>
      </form>
    </>
  );
};

export default AddInformation;
