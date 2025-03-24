import React from "react";
import error_404 from "./icons8-not-found-64.png";
import useLanguage from "../../hooks/useLanguage";

const PageNotFound = () => {
  const { language } = useLanguage();
  return (
    <div className="not-found gap-20 center">
      <img src={error_404} alt="" loading="lazy" />
      <h1>{language?.error?.lost}</h1>
    </div>
  );
};

export default PageNotFound;
