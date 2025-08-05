import { useEffect, useState } from "react";
import "./images-search.css";
import Loading from "../../components/loading/Loading";
import Virtual from "../../components/Virtual";
import MediaComponent from "../../components/MediaComponent";
import { Link, useNavigate } from "react-router-dom";
import useLanguage from "../../hooks/useLanguage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { searchByImage } from "./api";

const ImageSearch = () => {
  const [image, setImage] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState({ loading: false, loaded: false });
  const [overlay, setOverlay] = useState(false);
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const nav = useNavigate();
  const [response, setResponse] = useState([]);

  useEffect(() => {
    const cached = queryClient.getQueryData(["images"]);
    if (cached) {
      const unique = Array.from(
        new Map(cached.map((item) => [item.tableData._id, item])).values()
      );
      setResponse(unique);
      setLoading({ loading: false, loaded: true });
    }
  }, [queryClient]);

  const handelImageSubmit = useMutation({
    mutationFn: searchByImage,
    onSuccess: (data) => {
      const unique = Array.from(
        new Map(data.map((item) => [item.tableData._id, item])).values()
      );
      queryClient.setQueryData(["images"], unique);
      setResponse(unique);
      setError(false);
      setLoading({ loading: false, loaded: true });
    },
    onError: (err) => {
      console.log(err);

      setLoading({ loading: false, loaded: true });
      if (err?.response?.status === 404) {
        setResponse([]);
        setError(language?.searchImage?.no_data);
      } else {
        alert(language?.login?.error);
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!image) return setError(language?.error?.add_an_image);
    setError(false);
    setLoading({ loading: true, loaded: false });

    const formData = new FormData();
    formData.append("image", image);
    handelImageSubmit.mutate(formData);
  };

  const data = response.map((e, i) => {
    const tableData = e.tableData;
    const similarity = (e.similarity * 100).toFixed(2);

    const { parentModel } = tableData;
    const parentType =
      parentModel === "SecurityInformation"
        ? "informations"
        : parentModel === "Result"
        ? "results"
        : parentModel === "Report"
        ? "reports"
        : "";

    return (
      <Virtual key={tableData._id || i}>
        <div className="image-card flex flex-direction gap-10">
          <h3
            className={
              similarity <= 25
                ? "red"
                : similarity > 25 && similarity <= 60
                ? "orange"
                : "green"
            }
          >
            {language?.filter?.similarity} {similarity} %
          </h3>
          {tableData.parentId ? (
            <>
              <article className="parent-type">
                <h4> {language?.searchImage?.model_type} </h4>
                <p> {language?.enums?.images_model[parentType]} </p>
              </article>
              <div className="flex-1 image">
                <MediaComponent
                  onClick={() => setOverlay(tableData.src)}
                  type="image"
                  src={tableData.src}
                />
              </div>
              <Link className="btn" to={`/${parentType}/${tableData.parentId}`}>
                {language?.filter?.details}
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
                <Link to={`/people/${tableData._id}`} className="name flex">
                  {tableData.firstName} {tableData.fatherName}{" "}
                  {tableData.surName}
                </Link>
                <Link to={`/people/${tableData._id}`} className="profile-btn">
                  {language?.filter?.visit_profile}
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

      <div className="arrow-back-page">
        <i
          className="fa-solid fa-share"
          onClick={() => nav(-1)}
          title="page back"
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-direction gap-10 search-image"
      >
        {image && (
          <i onClick={() => setImage(false)} className="fa-solid fa-xmark"></i>
        )}
        <label htmlFor="image" className="center">
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
              {language?.searchImage?.uplaod_your_image}{" "}
              <i className="fa-solid fa-plus"></i>
            </h3>
          ) : (
            <img alt="" src={URL.createObjectURL(image)} loading="lazy" />
          )}
        </label>
        <button title="submit" className="btn center gap-2" disabled={!image}>
          {language?.searchImage?.search}
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
        {error && <p className="error"> {error} </p>}
      </form>

      {loading.loaded && response.length < 1 ? (
        <h3 className="font-color">
          {error || language?.searchImage?.no_data}
        </h3>
      ) : response.length > 0 ? (
        <div className="grid-3">{data}</div>
      ) : null}
    </>
  );
};

export default ImageSearch;
