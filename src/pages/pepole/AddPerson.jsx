import React, { useState } from "react";
import "../../components/form.css";

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

            <div className="flex flex-direction">
              <label className="inp document gap-10 center">
                <input
                  type="file"
                  id="document"
                  multiple
                  accept=".pdf, .doc, .docx, .txt"
                  onInput={(e) => {
                    setDocuments((prevDocuments) => ({
                      ...prevDocuments,
                      file: [
                        ...prevDocuments.file,
                        ...Array.from(e.target.files),
                      ],
                    }));
                  }}
                />
                upload document
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
                        const image = documents.image.filter((img) => img != e);
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

        {documents.file.length > 0 && (
          <div className="form">
            <h1>files selected</h1>
            <div className="flex wrap">
              {documents.file.map((e, i) => {
                const src = e.name.split(".");
                return (
                  <div className="flex flex-direction relative" key={i}>
                    <i
                      onClick={() => {
                        const updatedfile = documents.file.filter(
                          (file) => file !== e
                        );
                        setDocuments({ ...documents, file: updatedfile });
                      }}
                      className="remove-doc fa-solid fa-trash-can"
                    ></i>
                    <div className="flex gap-10 files">
                      <img
                        src={require(`./${src[src.length - 1]}.png`)}
                        alt=""
                      />
                      <div className="flex flex-direction">
                        <h3>{e.name}</h3>
                        <h4> {getFileSize(e.size)} </h4>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <button className="btn">save</button>
      </form>
    </>
  );
};

export default AddPerson;
