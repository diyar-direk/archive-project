import React, { useContext } from "react";
import errorImg from "./error.png";
import completeImg from "./complete.png";
import "./overlay.css";
import { Context } from "../../context/context";
const SendData = (props) => {
  const context = useContext(Context);
  return (
    <div className="center response">
      <img
        src={props.response === true ? completeImg : errorImg}
        alt=""
        loading="lazy"
      />
      <h1>
        {props.response === true
          ? `sent successfully`
          : props.response === 400
          ? `${props.data} allready exisits`
          : `network error`}
      </h1>
    </div>
  );
};

export default SendData;
