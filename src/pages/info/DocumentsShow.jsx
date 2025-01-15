import React, { useState } from "react";
import Mammoth from "mammoth";

const DocumentsShow = (props) => {
  const addperson = (file) => {
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      const fileType = file.type;

      if (fileType === "application/pdf") {
        props.activeFile.setActiveFile({
          content: event.target.result,
          type: "application/pdf",
          name: file.name,
        });
      } else if (fileType === "text/plain") {
        props.activeFile.setActiveFile({
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
            props.activeFile.setActiveFile({
              content: result.value,
              type: "docx",
              name: file.name,
            });
            props.popup.setIsPopupOpen(true);
          })
          .catch((err) => {
            console.error("Error reading .docx file:", err);
            alert("Failed to open .docx file.");
          });
        return;
      } else {
        alert("Unsupported file type for preview.");
      }

      props.popup.setIsPopupOpen(true);
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
  const formatFileSize = (fileSize) => `${(fileSize / 1024).toFixed(2)} KB`;

  return (
    <div className="form">
      <h1>{props.data} selected</h1>
      <div className="grid-3">
        {props.documents.documents[props.data].map((e, i) => {
          return (
            <div className="flex gap-10 docments relative" key={i}>
              {props.data === "image" ? (
                <img loading="lazy" src={URL.createObjectURL(e)} alt="" />
              ) : props.data === "video" ? (
                <video src={URL.createObjectURL(e)} controls></video>
              ) : props.data === "audio" ? (
                <audio src={URL.createObjectURL(e)} controls></audio>
              ) : (
                <div className="c-pointer flex flex-direction relative" key={i}>
                  <div
                    className="flex gap-10 files"
                    onClick={() => addperson(e)}
                  >
                    <img
                      src={require(`./${e.name.split(".").pop()}.png`)}
                      alt=""
                    />
                    <div className="flex flex-direction">
                      <h3>{e.name}</h3>
                      <h4>{formatFileSize(e.size)}</h4>
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      const updatedFiles = props.documents.documents[
                        props.data
                      ].filter((f) => f !== e);
                      props.documents.setDocuments({
                        ...props.documents.documents,
                        [props.data]: updatedFiles,
                      });
                    }}
                    className="remove-doc gap-10"
                  >
                    delete
                    <i className="fa-solid fa-trash-can"></i>
                  </div>
                </div>
              )}
              {props.data !== "list" && (
                <div
                  onClick={() => {
                    const data = props.documents.documents[props.data].filter(
                      (itm) => itm !== e
                    );
                    props.documents.setDocuments({
                      ...props.documents.documents,
                      [props.data]: data,
                    });
                  }}
                  className="flex gap-10 remove-doc"
                >
                  delete
                  <i className=" fa-solid fa-trash-can"></i>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentsShow;
