import Mammoth from "mammoth";
import { baseURL, Context } from "./../../context/context";
import { useContext, useState } from "react";
import axios from "axios";
import MediaComponent from "../../components/MediaComponent";

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
  const [deleteDoc, setDeleteDoc] = useState({
    image: {},
    video: {},
    audio: {},
    list: {},
  });
  const context = useContext(Context);
  const token = context.userDetails.token;
  const [overlay, setOverlay] = useState(false);

  const deleteData = async () => {
    try {
      await axios.patch(
        `${baseURL}${props.backendKey}`,
        {
          ids: [deleteDoc[props.data]._id],
        },
        { headers: { Authorization: "Bearer " + token } }
      );
      const data = props.documents.documents[props.data].filter(
        (itm) => itm !== deleteDoc[props.data]
      );
      props.documents.setDocuments({
        ...props.documents.documents,
        [props.data]: data,
      });
    } catch (error) {
      console.log(error);
      alert("some error please try again");
    } finally {
      setOverlay(false);
    }
  };

  const [showPdf, setShowPdf] = useState(false);

  return (
    <>
      {overlay && (
        <div
          onClick={() => {
            setOverlay(false);
            showPdf && setShowPdf(false);
          }}
          className="overlay"
        >
          {!showPdf ? (
            <div onClick={(e) => e.stopPropagation()}>
              <h1>are you sure yo want to delete this itms</h1>
              <div className="flex gap-10 wrap">
                <div onClick={deleteData} className="delete-all overlay-btn">
                  <i className="fa-solid fa-trash"></i> delete
                </div>
                <div
                  onClick={() => {
                    setDeleteDoc({
                      image: {},
                      video: {},
                      audio: {},
                      list: {},
                    });
                    setOverlay(false);
                  }}
                  className="delete-all cencel overlay-btn"
                >
                  <i className="fa-solid fa-ban"></i> cencel
                </div>
              </div>
            </div>
          ) : (
            <div onClick={(e) => e.stopPropagation()}>
              <MediaComponent type="pdf" className="flex-1" src={showPdf} />
            </div>
          )}
        </div>
      )}

      <div className="form">
        <h1>{props.data} selected</h1>
        <div className="grid-3">
          {props?.documents?.documents[props.data]?.map((e, i) => {
            return (
              <div className="flex gap-10 docments relative" key={i}>
                {props.data === "image" ? (
                  <MediaComponent type="image" src={!e._id ? e : e.src} />
                ) : props.data === "video" ? (
                  <MediaComponent type="video" src={!e._id ? e : e.src} />
                ) : props.data === "audio" ? (
                  <MediaComponent type="audio" src={!e._id ? e : e.src} />
                ) : (
                  <article
                    className="c-pointer flex flex-direction relative"
                    key={i}
                    style={{ minWidth: "auto" }}
                  >
                    {!e._id ? (
                      <div
                        className="flex gap-10 wrap files"
                        onClick={() => addperson(e)}
                      >
                        <img
                          src={require(`./${e.name.split(".").pop()}.png`)}
                          alt=""
                        />
                        <div
                          style={{ minWidth: "auto", padding: "0" }}
                          className="flex flex-direction"
                        >
                          <h3>{e.name.split("/").pop()}</h3>
                          <h4>{formatFileSize(e.size)}</h4>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setOverlay(true);
                          setShowPdf(e.src);
                        }}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex gap-10 wrap files"
                      >
                        <img
                          src={require(`./${e.src.split(".").pop()}.png`)}
                          alt=""
                        />
                        <div
                          style={{ minWidth: "auto", padding: "0" }}
                          className="flex flex-direction"
                        >
                          <h3>{e.src.split("/").pop()}</h3>
                        </div>
                      </div>
                    )}

                    <div
                      onClick={() => {
                        if (e._id) {
                          setOverlay(true);
                          setDeleteDoc({ ...deleteDoc, list: e });
                        } else {
                          const updatedFiles = props.documents.documents[
                            props.data
                          ].filter((f) => f !== e);
                          props.documents.setDocuments({
                            ...props.documents.documents,
                            [props.data]: updatedFiles,
                          });
                        }
                      }}
                      className="remove-doc gap-10"
                    >
                      delete
                      <i className="fa-solid fa-trash-can"></i>
                    </div>
                  </article>
                )}
                {props.data !== "list" && (
                  <div
                    onClick={() => {
                      if (e._id) {
                        setOverlay(true);
                        setDeleteDoc({ ...deleteDoc, [props.data]: e });
                      } else {
                        const data = props.documents.documents[
                          props.data
                        ].filter((itm) => itm !== e);
                        props.documents.setDocuments({
                          ...props.documents.documents,
                          [props.data]: data,
                        });
                      }
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
    </>
  );
};

export default DocumentsShow;
