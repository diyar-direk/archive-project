import React, { useState } from "react";
import "../../components/form.css";
import Mammoth from "mammoth"; 
const AddPerson = () => {
  const handleClick = (e) => {
    e.stopPropagation();
    e.target.classList.toggle("active");
  };
  const [documents, setDocuments] = useState({
    image: [],
    video: [],
    file: [],
    audio: [],
  });

  console.log(documents);
  const getFileSize = (size) => {
    const units = ["Bytes", "KB", "MB", "GB"];
    let unitIndex = 0;
    let fileSize = size;

    while (fileSize >= 1024 && unitIndex < units.length - 1) {
      fileSize /= 1024;
      unitIndex++;
    }

    return `${fileSize.toFixed(2)} ${units[unitIndex]}`;
  };







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
      alert("Unsupported file type. Only text, PDF, and DOCX files are allowed.");
    }
  };
  
  




  
  return (
    <>
      <h1 className="title">add person</h1>
      <form className="dashboard-form">
        <div className="form">
          <h1>test title</h1>
          <div className="flex wrap">
            <div className="flex flex-direction">
              <label htmlFor="aliasName">alias name</label>
              <input
                required
                type="text"
                id="aliasName"
                className="inp"
                placeholder="test"
              />
            </div>

            <div className="flex flex-direction">
              <label htmlFor="firstName">first name</label>
              <input
                required
                type="text"
                id="firstName"
                className="inp"
                placeholder="test"
              />
            </div>
            <div className="flex flex-direction">
              <label htmlFor="lastName">last name</label>
              <input
                required
                type="text"
                id="lastName"
                className="inp"
                placeholder="test"
              />
            </div>
            <div className="flex flex-direction">
              <label htmlFor="fotherName">fother name</label>
              <input
                required
                type="text"
                id="fotherName"
                className="inp"
                placeholder="test"
              />
            </div>
            <div className="flex flex-direction">
              <label htmlFor="motherName">mother name</label>
              <input
                required
                type="text"
                id="motherName"
                className="inp"
                placeholder="test"
              />
            </div>

            <div className="flex flex-direction">
              <label htmlFor="dateOfBirth">date of birth</label>
              <input
                required
                type="date"
                id="dateOfBirth"
                className="inp"
                placeholder="test"
              />
            </div>

            <div className="flex flex-direction">
              <label htmlFor="dateOfBirth">date of birth</label>
              <input
                required
                type="text"
                id="dateOfBirth"
                className="inp"
                placeholder="test"
              />
            </div>

            <div className="flex flex-direction">
              <label>select</label>
              <div className="selecte relative">
                <div onClick={handleClick} className="inp">
                  test
                </div>
                <article>
                  <h2>h</h2>
                  <h2>t</h2>
                  <h2>d</h2>
                </article>
              </div>
            </div>
          </div>
        </div>
        <div className="form">
          <h1>test title</h1>
          <div className="flex warp">
            <div className="flex flex-direction">
              <label htmlFor="details">details</label>
              <textarea
                className="inp"
                required
                placeholder="test"
                id="details"
                rows={4}
              ></textarea>
            </div>
            <div className="flex flex-direction">
              <label htmlFor="note">note</label>
              <textarea
                className="inp"
                required
                placeholder="test"
                id="note"
                rows={4}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="form">
          <h1>test title</h1>
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
                list: [...prevFiles.list, ...Array.from(e.target.files)],
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
          <div className="form">
            <h1>images selected</h1>
            <div className="flex wrap">
              {documents.image.map((e, i) => {
                return (
                  <div className="flex flex-direction relative" key={i}>
                    <i
                      onClick={() => {
                        const image = documents.image.filter((img) => img !== e);
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
            <div className="flex wrap">
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
            <div className="flex wrap">
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
          <div className="flex wrap">
            {uploadedFiles.list.map((file, index) => (
              <div className="flex flex-direction relative" key={index}>
                <i
                  onClick={() => {
                    const updatedFiles = uploadedFiles.list.filter(
                      (f) => f !== file
                    );
                    setUploadedFiles({ ...uploadedFiles, list: updatedFiles });
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
      {activeFile.type === "text/plain" || activeFile.type === "docx" ? (
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



    </div>

        <button className="btn">save</button>
      </form>
    </>
  );
};

export default AddPerson;
