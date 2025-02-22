import React, { useState } from "react";
import "./images-search.css";
const ImageSearch = () => {
  const [image, setImage] = useState(false);
  return (
    <form className="flex flex-direction gap-20 search-image ">
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
          <img alt="" src={URL.createObjectURL(image)} />
        )}
      </label>
      <div className="flex wrap gap-10">
        <button title="submit" className="btn flex-1" disabled={!image}>
          search
        </button>
        {image && (
          <div
            onClick={() => setImage(false)}
            className="btn center delete-all flex-1"
          >
            delete image
          </div>
        )}
      </div>
    </form>
  );
};

export default ImageSearch;
