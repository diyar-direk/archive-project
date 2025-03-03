import errorImg from "./error.png";
import completeImg from "./complete.png";
import "./overlay.css";
import useLanguage from "../../hooks/useLanguage";
const SendData = (props) => {
  const { language } = useLanguage();
  return (
    <div className="center response">
      <img
        src={props.response === true ? completeImg : errorImg}
        alt=""
        loading="lazy"
      />
      <h1>
        {props.response === true
          ? `${language?.error?.sent}`
          : props.response === 400
          ? `${props.data} ${language?.error?.already_exists}`
          : `${language?.error?.somthing_went_wrong}`}
      </h1>
    </div>
  );
};

export default SendData;
