import error_404 from "./icons8-not-found-64.png";
import useLanguage from "../../hooks/useLanguage";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const { language } = useLanguage();
  const nav = useNavigate();
  return (
    <div className="not-found gap-20 center">
      <div className="arrow-back-page">
        <i
          className="fa-solid fa-share"
          onClick={() => nav("/")}
          title="page back"
        />
      </div>
      <img src={error_404} alt="" loading="lazy" />
      <h1>{language?.error?.lost}</h1>
    </div>
  );
};

export default PageNotFound;
