import React, { useState } from "react";

const MediaShow = (props) => {
  const data = props.data;

  const noData =
    [...data.images, ...data.documents, ...data.audios, ...data.videos]
      .length <= 0;

  const [overlay, setOverlay] = useState(false);

  

  return (
    <>
      {overlay && (
        <div
          onClick={() => setOverlay(false)}
          className="overlay media-overlay"
        >
          <article>
            <i
              onClick={() => setOverlay(false)}
              className="fa-classic fa-solid fa-xmark fa-fw"
            ></i>
            <div>
              <img src={overlay} alt="" />
            </div>
          </article>
        </div>
      )}
      <div>
        <div className="flex gap-10 flex-direction media">
          <h1>medias</h1>
          <div className="media-container center">
            <div className="flex gap-20 wrap">
              <h4 className="center gap-10 font-color">
                <i className="fa-regular fa-image"></i> {data.images.length}
              </h4>
              <h4 className="center gap-10 font-color">
                <i className="fa-solid fa-video"></i> {data.videos.length}
              </h4>
              <h4 className="center gap-10 font-color">
                <i className="fa-solid fa-microphone"></i> {data.audios.length}
              </h4>
              <h4 className="center gap-10 font-color">
                <i className="fa-solid fa-file"></i> {data.documents.length}
              </h4>
            </div>
            {noData ? (
              <h1>no media found</h1>
            ) : (
              <article className="w-100 grid-3">
                {data.images.length > 0 && (
                  <div className="center">
                    {data.images.map((e) => (
                      <img
                        onClick={() => setOverlay(e)}
                        alt=""
                        src={`http://localhost:8000${e}`}
                      />
                    ))}
                  </div>
                )}
                {data.videos.length > 0 && (
                  <div className="center">
                    {data.videos.map((e) => (
                      <video controls src={e}></video>
                    ))}
                  </div>
                )}
                {data.audios.length > 0 && (
                  <div className="center">
                    {data.audios.map((e) => (
                      <audio controls src={e}></audio>
                    ))}
                  </div>
                )}
              </article>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MediaShow;
