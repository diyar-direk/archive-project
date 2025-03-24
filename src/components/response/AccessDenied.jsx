import React from "react";
import error_403 from "./icons8-unavailable-100.png";
import useLanguage from "../../hooks/useLanguage";
const AccessDenied = () => {
  const { language } = useLanguage();
  return (
    <div className="not-found gap-20 center">
      <img src={error_403} alt="" loading="lazy" />
      <h1>{language?.login?.access_denied}</h1>
    </div>
  );
};

export default AccessDenied;
