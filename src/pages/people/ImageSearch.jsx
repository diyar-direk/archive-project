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

  const data = response?.map((e, i) => (
    <Virtual key={i}>
      <div className="image-card">
        <h3> {(e.similarity * 100).toFixed(2)} % </h3>
        {e.tableData.informationId ? (
          <>
            <MediaComponent type={"image"} src={e.tableData.src} />
            <Link
              className="btn"
              to={`/dashboard/informations/${e.tableData.informationId}`}
            >
              show info
            </Link>
          </>
        ) : (
          <>
            <Link className="photo" to={`/dashboard/people/${e.tableData._id}`}>
              <MediaComponent type={"image"} src={e.tableData.image} />
            </Link>
            <Link
              to={`/dashboard/people/${e.tableData._id}`}
              className="name w-100"
            >
              {e.tableData.firstName} {e.tableData.fatherName}
              {e.tableData.surName}
            </Link>
          </>
        )}
      </div>
    </Virtual>
  ));

  return (
    <>
      {loading.loading && <Loading />}
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
      <div className="grid-3">{data}</div>
    </>
  );
};

export default ImageSearch;
