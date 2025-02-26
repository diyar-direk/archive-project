import React, { useContext, useState } from "react";
import { baseURL, Context } from "../../context/context";
import axios from "axios";
import Loading from "../loading/Loading";
import MediaComponent from "../MediaComponent";

const MediaShow = (props) => {
  const data = props?.data;
  const formatFileSize = (fileSize) => `${(fileSize / 1024).toFixed(2)} KB`;
  const noData =
    [...data?.images, ...data?.documents, ...data?.audios, ...data?.videos]
      .length <= 0;
  const [formLoading, setFormLoading] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [form, setForm] = useState({
    images: "",
    videos: "",
    audios: "",
    documents: "",
  });
  const [actions, setActions] = useState({
    showImage: false,
    deleteData: false,
    addData: false,
    showDocs: false,
  });
  const context = useContext(Context);
  const token = context.userDetails.token;

  const deleteData = async () => {
    try {
      setFormLoading(true);
      await axios.patch(
        `${baseURL}/media/${actions.deleteData.data}`,
        {
          ids: actions.deleteData.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      props.getData();
    } catch (error) {
      console.log(error);
      alert("some error please try again");
    } finally {
      setActions({
        showImage: false,
        deleteData: false,
        addData: false,
        showDocs: false,
      });
      setFormLoading(true);
      setOverlay(false);
    }
  };

  const submitData = async (e) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      const keys = Object.keys(form);
      const formData = new FormData();
      const res = keys.filter((key) => form[key])[0];
      formData.append("informationId", props.id);
      formData.append(res, form[res]);
      await axios.post(`${baseURL}/media/${res}`, formData, {
        headers: { Authorization: "Bearer " + token },
        onUploadProgress: (progress) => {
          const persent =
            Math.floor((progress.loaded * 100) / progress.total) + "%";
          document.querySelector("div.loading.overlay >h1").innerHTML = persent;
        },
      });
      setForm({
        images: "",
        videos: "",
        audios: "",
        documents: "",
      });
      setActions({
        showImage: false,
        deleteData: false,
        addData: false,
        showDocs: false,
      });
      setOverlay(false);
      props.getData();
    } catch (error) {
      console.log(error);
      alert("some error pleasse tyr again");
    } finally {
      setFormLoading(false);
    }
  };
  const [docDownload, setDocDownload] = useState(false);

  return (
    <>
      {docDownload && <MediaComponent src={`${docDownload}`} />}
      {formLoading && <Loading />}
      {overlay && !formLoading && (
        <div
          onClick={() => {
            setActions({
              showImage: false,
              deleteData: false,
              addData: false,
              showDocs: false,
            });
            setOverlay(false);
          }}
          className="overlay media-overlay"
        >
          {actions.showImage ? (
            <article>
              <i
                onClick={() => {
                  setActions({
                    showImage: false,
                    deleteData: false,
                    addData: false,
                    showDocs: false,
                  });
                  setOverlay(false);
                }}
                className="fa-classic fa-solid fa-xmark fa-fw"
              ></i>
              <div>
                <MediaComponent type="image" src={`${actions.showImage}`} />
              </div>
            </article>
          ) : actions.deleteData ? (
            <div onClick={(e) => e.stopPropagation()}>
              <h1>are you sure yo want to delete this itms</h1>
              <div className="flex gap-10 wrap">
                <div onClick={deleteData} className="delete-all overlay-btn">
                  <i className="fa-solid fa-trash"></i> delete
                </div>
                <div
                  onClick={() => {
                    setActions({
                      showImage: false,
                      deleteData: false,
                      addData: false,
                      showDocs: false,
                    });
                    setOverlay(false);
                  }}
                  className="delete-all cencel overlay-btn"
                >
                  <i className="fa-solid fa-ban"></i> cencel
                </div>
              </div>
            </div>
          ) : actions.showDocs ? (
            <div>
              <MediaComponent
                type="pdf"
                className="flex-1"
                src={actions.showDocs}
              />
            </div>
          ) : (
            <div>
              <form
                onSubmit={submitData}
                className="flex gap-20 flex-direction"
              >
                {!form.images &&
                !form.audios &&
                !form.documents &&
                !form.videos ? (
                  <>
                    <label
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      htmlFor="photo"
                    >
                      add image
                      <i className="fa-regular fa-image"></i>
                      <input
                        type="file"
                        accept="image/*"
                        id="photo"
                        onInput={(e) => {
                          setForm({
                            images: e.target.files[0],
                            videos: "",
                            audios: "",
                            documents: "",
                          });
                        }}
                      />
                    </label>

                    <label
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      htmlFor="video"
                    >
                      add video
                      <i className="fa-solid fa-video"></i>
                      <input
                        type="file"
                        accept="video/*"
                        id="video"
                        onInput={(e) => {
                          setForm({
                            videos: e.target.files[0],
                            images: "",
                            audios: "",
                            documents: "",
                          });
                        }}
                      />
                    </label>

                    <label
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      htmlFor="audio"
                    >
                      add audio
                      <i className="fa-solid fa-headphones"></i>
                      <input
                        type="file"
                        accept=".mp3, .wav, .mpeg, .ogg, .flac, .aac"
                        id="audio"
                        onInput={(e) => {
                          setForm({
                            audios: e.target.files[0],
                            images: "",
                            videos: "",
                            documents: "",
                          });
                        }}
                      />
                    </label>
                    <label
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      htmlFor="documents"
                    >
                      add documents
                      <i className="fa-solid fa-file"></i>
                      <input
                        type="file"
                        accept=".pdf, .docx, .txt"
                        id="documents"
                        onInput={(e) => {
                          setForm({
                            documents: e.target.files[0],
                            images: "",
                            audios: "",
                            videos: "",
                          });
                        }}
                      />
                    </label>
                  </>
                ) : (
                  <>
                    {form.images && (
                      <div>
                        <i
                          onClick={(e) => {
                            e.stopPropagation();
                            setForm({
                              images: "",
                              videos: "",
                              audios: "",
                              documents: "",
                            });
                          }}
                          className="trash fa-regular fa-trash-can"
                        ></i>
                        <img
                          onClick={(e) => e.stopPropagation()}
                          src={URL.createObjectURL(form.images)}
                          alt=""
                        />
                      </div>
                    )}
                    {form.videos && (
                      <div>
                        <i
                          onClick={(e) => {
                            e.stopPropagation();
                            setForm({
                              images: "",
                              videos: "",
                              audios: "",
                              documents: "",
                            });
                          }}
                          className="trash fa-regular fa-trash-can"
                        ></i>
                        <video
                          onClick={(e) => e.stopPropagation()}
                          controls
                          src={URL.createObjectURL(form.videos)}
                          alt=""
                        />
                      </div>
                    )}
                    {form.audios && (
                      <div>
                        <i
                          onClick={(e) => {
                            e.stopPropagation();
                            setForm({
                              images: "",
                              videos: "",
                              audios: "",
                              documents: "",
                            });
                          }}
                          className="trash fa-regular fa-trash-can"
                        ></i>
                        <audio
                          onClick={(e) => e.stopPropagation()}
                          controls
                          src={URL.createObjectURL(form.audios)}
                          alt=""
                        />
                      </div>
                    )}
                    {form.documents && (
                      <div>
                        <i
                          onClick={(e) => {
                            e.stopPropagation();
                            setForm({
                              images: "",
                              videos: "",
                              audios: "",
                              documents: "",
                            });
                          }}
                          className="trash fa-regular fa-trash-can"
                        ></i>
                        <div className="flex gap-10 wrap files">
                          <img
                            src={require(`../../pages/info/${form.documents.name
                              .split(".")
                              .pop()}.png`)}
                            alt=""
                          />
                          <div className="flex flex-direction">
                            <h3>{form.documents.name}</h3>
                            <h4>{formatFileSize(form.documents.size)}</h4>
                          </div>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="btn save"
                    >
                      save
                    </button>
                  </>
                )}
              </form>
            </div>
          )}
        </div>
      )}

      <div>
        <div className="flex gap-10 flex-direction media">
          <h1>medias</h1>
          <div className="media-container center">
            <div className="flex gap-20 wrap">
              <h4 className="center gap-10 font-color">
                <i className="fa-regular fa-image"></i> {data?.images?.length}
              </h4>
              <h4 className="center gap-10 font-color">
                <i className="fa-solid fa-video"></i> {data?.videos?.length}
              </h4>
              <h4 className="center gap-10 font-color">
                <i className="fa-solid fa-microphone"></i>{" "}
                {data?.audios?.length}
              </h4>
              <h4 className="center gap-10 font-color">
                <i className="fa-solid fa-file"></i> {data.documents.length}
              </h4>
            </div>
            <p
              onClick={(e) => {
                e.preventDefault();
                setActions({
                  showImage: false,
                  deleteData: false,
                  addData: true,
                  showDocs: false,
                });
                setOverlay(true);
              }}
              className="add-media center gap-10"
            >
              <span> add media </span>
              <i className="fa-solid fa-plus"></i>
            </p>

            {noData ? (
              <h1>no media found</h1>
            ) : (
              <article className="w-100 grid-3">
                {data?.images?.length > 0 &&
                  data?.images?.map((e) => (
                    <div key={e._id} className="center flex-direction">
                      <MediaComponent
                        type={"image"}
                        onClick={() => {
                          setActions({
                            showImage: e.src,
                            deleteData: false,
                            addData: false,
                            showDocs: false,
                          });
                          setOverlay(true);
                        }}
                        src={e.src}
                      />

                      <p
                        onClick={(ele) => {
                          ele.preventDefault();
                          setOverlay(true);
                          setActions({
                            showImage: false,
                            deleteData: { data: "images", id: e._id },
                            addData: false,
                            showDocs: false,
                          });
                        }}
                        className="center gap-10 delete"
                      >
                        delete <i className="fa-regular fa-trash-can"></i>
                      </p>
                    </div>
                  ))}
                {data?.videos?.length > 0 &&
                  data?.videos?.map((e) => (
                    <div key={e._id} className="center flex-direction">
                      <MediaComponent
                        type="video"
                        className="flex-1"
                        src={e.src}
                      />

                      <p
                        onClick={(ele) => {
                          ele.preventDefault();
                          setOverlay(true);
                          setActions({
                            showImage: false,
                            deleteData: { data: "videos", id: e._id },
                            addData: false,
                            showDocs: false,
                          });
                        }}
                        className="center gap-10 delete"
                      >
                        delete <i className="fa-regular fa-trash-can"></i>
                      </p>
                    </div>
                  ))}
                {data?.audios?.length > 0 &&
                  data?.audios?.map((e) => (
                    <div key={e._id} className="center flex-direction">
                      <MediaComponent
                        type="audio"
                        className="flex-1"
                        src={e.src}
                      />
                      <p
                        onClick={(ele) => {
                          ele.preventDefault();
                          setOverlay(true);
                          setActions({
                            showImage: false,
                            deleteData: { data: "audios", id: e._id },
                            addData: false,
                            showDocs: false,
                          });
                        }}
                        className="center gap-10 delete"
                      >
                        delete <i className="fa-regular fa-trash-can"></i>
                      </p>
                    </div>
                  ))}

                {data?.documents?.length > 0 &&
                  data?.documents?.map((e) => (
                    <div key={e._id} className="center flex-direction">
                      <div
                        onClick={() => {
                          if (e.src.split(".").pop() === "pdf") {
                            setOverlay(true);
                            setActions({
                              showImage: false,
                              deleteData: false,
                              addData: false,
                              showDocs: e.src,
                            });
                          } else {
                            setDocDownload(e.src);
                          }
                        }}
                        className="center c-pointer flex-1 gap-10 wrap"
                      >
                        <img
                          loading="lazy"
                          src={require(`../../pages/info/${e.src
                            .split(".")
                            .pop()}.png`)}
                          alt=""
                        />
                        <div className="flex flex-direction">
                          <h3 className="font-color">
                            {e.src.split("/").pop()}
                          </h3>
                        </div>
                      </div>
                      <div className="flex w-100 gap-10 wrap">
                        <p
                          onClick={(ele) => {
                            ele.preventDefault();
                            setOverlay(true);
                            setActions({
                              showImage: false,
                              deleteData: { data: "documents", id: e._id },
                              addData: false,
                              showDocs: false,
                            });
                          }}
                          className="center gap-10 flex-1 delete"
                        >
                          delete <i className="fa-regular fa-trash-can"></i>
                        </p>
                      </div>
                    </div>
                  ))}
              </article>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MediaShow;
