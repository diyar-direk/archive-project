import React from "react";
import { Link } from "react-router-dom";
import { mediaURL } from "../../context/context";

const CategoriesShow = (props) => {
  return (
    <div>
      <div>
        <h2 className="font-color">{props.title}</h2>
        {props.data?.length > 0 ? (
          props.data?.map((e) =>
            props.name !== "people" ? (
              props.name !== "coordinates" ? (
                <p className="font-color" key={e._id}>
                  <span>{props.title} name:</span> <span> {e[props.name]}</span>
                </p>
              ) : (
                <Link
                  style={{ display: "block" }}
                  to={`/dashboard/coordinates/${e._id}`}
                  className="font-color people-cat"
                  key={e._id}
                >
                  <span>{props.title} name:</span>
                  <span className="name"> {e[props.name]}</span>
                </Link>
              )
            ) : (
              <div className="flex align-center people-cat gap-10" key={e._id}>
                <Link to={`/people/${e._id}`} className="profile-image">
                  {e.image ? (
                    <img src={mediaURL + e.image} alt="" />
                  ) : (
                    <i className="fa-solid fa-user"></i>
                  )}
                </Link>
                <Link to={`/people/${e._id}`} className="name">
                  {e.firstName} {e.surName}
                </Link>
              </div>
            )
          )
        ) : (
          <h3 className="font-color">no {props.title} found</h3>
        )}
      </div>
    </div>
  );
};

export default CategoriesShow;
