import React, { useRef, useState } from "react";
import "../../components/form/form.css";
import "./information.css";
import Mammoth from "mammoth";
import { baseURL } from "../../context/context";
import axios from "axios";
import SendData from "../../components/response/SendData";
import Loading from "../../components/loading/Loading";
import People from "./../people/People";
import { Link } from "react-router-dom";
import FormSelect from "../../components/form/FormSelect";
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
    Coordinates: [],
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
    file: [],
    audio: [],
  });

  const [uploadedFiles, setUploadedFiles] = useState({ list: [] });
  const [activeFile, setActiveFile] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const formatFileSize = (fileSize) => `${(fileSize / 1024).toFixed(2)} KB`;

  const addperson = (file) => {
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      const fileType = file.type;

      if (fileType === "application/pdf") {
        setActiveFile({
          content: event.target.result,
          type: "application/pdf",
          name: file.name,
        });
      } else if (fileType === "text/plain") {
        setActiveFile({
          content: event.target.result,
          type: "text/plain",
          name: file.name,
        });
      } else if (
        fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const arrayBuffer = event.target.result;
        Mammoth.extractRawText({ arrayBuffer })
          .then((result) => {
            setActiveFile({
              content: result.value,
              type: "docx",
              name: file.name,
            });
            setIsPopupOpen(true);
          })
          .catch((err) => {
            console.error("Error reading .docx file:", err);
            alert("Failed to open .docx file.");
          });
        return;
      } else {
        alert("Unsupported file type for preview.");
      }

      setIsPopupOpen(true);
    };

    if (file.type === "application/pdf") {
      fileReader.readAsDataURL(file);
    } else if (file.type === "text/plain") {
      fileReader.readAsText(file);
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      fileReader.readAsArrayBuffer(file);
    } else {
      alert(
        "Unsupported file type. Only text, PDF, and DOCX files are allowed."
      );
    }
  };

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
    if (!form.maritalStatus) setError("please select maritalStatus");
    else if (!form.gender) setError("please select gender");
    else if (!form.countryId) setError("please select country");
    else if (!form.governmentId) setError("please select government");
    else if (!form.cityId) setError("please select city");
    else if (!form.sectionId) setError("please select section");
    else if (!form.sources) setError("please select source");
    else {
      setLoading(true);
      const keys = Object.keys(form);
      const formData = new FormData();

      keys.forEach((key) => {
        if (
          (form[key] && !Array.isArray(form[key])) ||
          (Array.isArray(form[key]) && form[key]?.length !== 0)
        ) {
          if (!Array.isArray(form[key]))
            formData.append(key, form[key]?._id ? form[key]?._id : form[key]);
          else {
            form[key].forEach((item) => {
              formData.append(`${key}[]`, item._id || item);
            });
          }
        }
      });

      try {
        const data = await axios.post(`${baseURL}/people`, formData);
        if (data.status === 201) {
          responseFun(true);
          setForm({
            //personal data
            imgae: "",
            firstName: "",
            fatherName: "",
            surName: "",
            gender: "",
            maritalStatus: "",
            motherName: "",
            birthDate: "",
            placeOfBirth: "",
            occupation: "",
            countryId: "",
            governmentId: "",
            cityId: "",
            villageId: "",
            regionId: "",
            streetId: "",
            addressDetails: "",
            email: "",
            phone: "",
            sectionId: "",
            //categories data
            sources: "",
            events: [],
            parties: [],
          });
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
                to={`/people/${e._id}`}
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

            <div>
              <div className="flex flex-direction">
                <label className="inp document gap-10 center">
                  <input
                    type="file"
                    id="document"
                    multiple
                    accept=".pdf, .docx, .txt"
                    onInput={(e) => {
                      setUploadedFiles((prevFiles) => ({
                        ...prevFiles,
                        list: [
                          ...prevFiles.list,
                          ...Array.from(e.target.files),
                        ],
                      }));
                    }}
                  />
                  Upload Document
                  <i className="fa-solid fa-file"></i>
                </label>
              </div>
            </div>
          </div>
        </div>

        {documents.image.length > 0 && (
          <div className="form">
            <h1>images selected</h1>
            <div className="grid-3">
              {documents.image.map((e, i) => {
                return (
                  <div className="flex flex-direction relative" key={i}>
                    <i
                      onClick={() => {
                        const image = documents.image.filter(
                          (img) => img !== e
                        );
                        setDocuments({ ...documents, image });
                      }}
                      className="remove-doc fa-solid fa-trash-can"
                    ></i>
                    <img src={URL.createObjectURL(e)} alt="" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {documents.video.length > 0 && (
          <div className="form">
            <h1>videos selected</h1>
            <div className="grid-3">
              {documents.video.map((e, i) => {
                return (
                  <div className="flex flex-direction relative" key={i}>
                    <i
                      onClick={() => {
                        const updatedVideos = documents.video.filter(
                          (video) => video !== e
                        );
                        setDocuments({ ...documents, video: updatedVideos });
                      }}
                      className="remove-doc fa-solid fa-trash-can"
                    ></i>
                    <video src={URL.createObjectURL(e)} controls></video>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {documents.audio.length > 0 && (
          <div className="form">
            <h1>audios selected</h1>
            <div className="grid-3">
              {documents.audio.map((e, i) => {
                return (
                  <div className="flex flex-direction relative" key={i}>
                    <i
                      onClick={() => {
                        const updatedaudio = documents.audio.filter(
                          (audio) => audio !== e
                        );
                        setDocuments({ ...documents, audio: updatedaudio });
                      }}
                      className="remove-doc fa-solid fa-trash-can"
                    ></i>
                    <audio src={URL.createObjectURL(e)} controls></audio>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {uploadedFiles.list.length > 0 && (
          <div className="form">
            <h1>Files Selected</h1>
            <div className="grid-3">
              {uploadedFiles.list.map((file, index) => (
                <div
                  className="c-pointer flex flex-direction relative"
                  key={index}
                >
                  <i
                    onClick={() => {
                      const updatedFiles = uploadedFiles.list.filter(
                        (f) => f !== file
                      );
                      setUploadedFiles({
                        ...uploadedFiles,
                        list: updatedFiles,
                      });
                    }}
                    className="remove-doc fa-solid fa-trash-can"
                  ></i>
                  <div
                    className="flex gap-10 files"
                    onClick={() => addperson(file)}
                  >
                    <img
                      src={require(`./${file.name.split(".").pop()}.png`)}
                      alt=""
                    />
                    <div className="flex flex-direction">
                      <h3>{file.name}</h3>
                      <h4>{formatFileSize(file.size)}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
