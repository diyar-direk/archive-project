import React from "react";
import error_404 from "./icons8-not-found-64.png";
const PageNotFound = () => {
  return (
    <div className="not-found gap-20 center">
      <img src={error_404} alt="" loading="lazy" />
      <h1>ops are you lost?</h1>
    </div>
  );
};

export default PageNotFound;
