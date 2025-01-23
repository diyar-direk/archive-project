import React, { useState } from "react";
import { mediaURL } from "../../context/context";

const MediaShow = (props) => {
  const data = props.data;

  const noData =
    [...data.images, ...data.documents, ...data.audios, ...data.videos]
      .length <= 0;

  const [overlay, setOverlay] = useState(false);
  const [actions, setActions] = useState({
    showImage: false,
    deleteData: false,
    addData: false,
  });

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
              <img src={`${mediaURL}${actions.showImage}`} alt="" />
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
                {data.images.length > 0 &&
                  data.images.map((e) => (
                    <div key={e} className="center flex-direction">
                      <img
                        onClick={() => {
                          setActions({
                            showImage: e.src,
                            deleteData: false,
                            addData: false,
                          });
                          setOverlay(true);
                        }}
                        alt=""
                        src={`${mediaURL}${e.src}`}
                      />
                      <p className="center gap-10 delete">
                        delete <i className="fa-regular fa-trash-can"></i>
                      </p>
                    </div>
                  ))}
                {data.videos.length > 0 &&
                  data.videos.map((e) => (
                    <div key={e} className="center flex-direction">
                      <video controls src={`${mediaURL}${e.src}`}></video>
                    </div>
                  ))}
                {data.audios.length > 0 &&
                  data.audios.map((e) => (
                    <div key={e} className="center flex-direction">
                      <audio controls src={`${mediaURL}${e.src}`}></audio>
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
