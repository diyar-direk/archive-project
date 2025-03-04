import React, { useContext, useState } from "react";
import "./images-search.css";
import Loading from "../../components/loading/Loading";
import axios from "axios";
import { baseURL, Context } from "../../context/context";
import Virtual from "../../components/Virtual";
import MediaComponent from "../../components/MediaComponent";
import { Link } from "react-router-dom";
const ImageSearch = () => {
  const [image, setImage] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState({ loading: false, loaded: false });
  const context = useContext(Context);
  const token = context?.userDetails?.token;

  const [response, setResponse] = useState([]);
  const [overlay, setOverlay] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError("please uploade a photo");
      return;
    }
    try {
      setLoading({ loading: true, loaded: false });
      const formData = new FormData();
      formData.append("image", image);
      const res = await axios.post(
        `${baseURL}/media/images/searchImages`,
        formData,
        { headers: { Authorization: "Bearer " + token } }
      );
      setImage(false);
      setResponse(res.data);
      setLoading({ loading: true, loaded: true });
    } catch (error) {
      console.log(error);
      alert("some error");
    } finally {
      setLoading({ ...loading, loading: false });
    }
  };

  const data = response?.map((e, i) => {
    const tableData = e.tableData;
    const similarity = (e.similarity * 100).toFixed(2);
    return (
      <Virtual key={i}>
        <div className="image-card flex flex-direction gap-20">
          <h3
            className={
              similarity <= 25
                ? "red"
                : similarity > 25 && similarity <= 60
                ? "orange"
                : "green"
            }
          >
            similarity: {similarity} %
          </h3>
          {tableData.informationId ? (
            <>
              <div className="flex-1 image">
                <MediaComponent
                  onClick={() => setOverlay(tableData.src)}
                  type="image"
                  src={tableData.src}
                />
              </div>
              <Link
                className="btn"
                to={`/dashboard/informations/${tableData.informationId}`}
              >
                show info
              </Link>
            </>
          ) : (
            <>
              <div className="flex-1 center">
                <div className="photo">
                  <MediaComponent
                    type={"image"}
                    onClick={() => setOverlay(tableData.image)}
                    src={tableData.image}
                  />
                </div>
              </div>

              <div className="flex info">
                <Link
                  to={`/dashboard/people/${tableData._id}`}
                  className="name flex"
                >
                  {tableData.firstName} {tableData.fatherName}
                  {tableData.surName}
                </Link>
                <Link
                  to={`/dashboard/people/${tableData._id}`}
                  className="profile-btn"
                >
                  visti profile
                </Link>
              </div>
            </>
          )}
        </div>
      </Virtual>
    );
  });

  return (
    <>
      {loading.loading && <Loading />}
      {overlay && (
        <div
          onClick={() => setOverlay(false)}
          className="overlay media-overlay"
        >
          <article>
            <div>
              <MediaComponent type="image" src={overlay} />
            </div>
          </article>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-direction gap-10 search-image"
      >
        {image && (
          <i onClick={() => setImage(false)} className="fa-solid fa-xmark"></i>
        )}
        <label htmlFor="image" className=" center">
          <input
            type="file"
            id="image"
            hidden
            accept="image/*"
            onInput={(e) => {
              setImage(e.target.files[0]);
              error && setError(false);
            }}
          />
          {!image ? (
            <h3 className="center gap-10">
              upload your photo <i className="fa-solid fa-plus"></i>
            </h3>
          ) : (
            <img alt="" src={URL.createObjectURL(image)} loading="lazy" />
          )}
        </label>
        <button title="submit" className="btn center gap-2" disabled={!image}>
          search
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
        {error && <p className="error"> {error} </p>}
      </form>

      {loading.loaded && response.length < 1 ? (
        <h3 className="font-color">no results found</h3>
      ) : response.length > 0 ? (
        <div className="grid-3">{data}</div>
      ) : (
        loading.loaded && (
          <h2
            style={{ textAlign: "center" }}
            className="font-color text-capitalize"
          >
            no result found
          </h2>
        )
      )}
    </>
  );
};

export default ImageSearch;
