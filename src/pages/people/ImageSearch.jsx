import React, { useState } from "react";
import "./images-search.css";
const ImageSearch = () => {
  const [image, setImage] = useState(false);
  return (
    <form className="flex flex-direction gap-10 search-image">
      {image && (
        <i onClick={() => setImage(false)} className="fa-solid fa-xmark"></i>
      )}
      <label htmlFor="image" className=" center">
        <input
          type="file"
          id="image"
          hidden
          accept="image/*"
          onInput={(e) => setImage(e.target.files[0])}
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
    </form>
  );
};

export default ImageSearch;
