import React from "react";
import { Link } from "react-router-dom";

const CategoriesShow = (props) => {
  return (
    <div>
      <h2>{props.title}</h2>
      {props.data?.length > 0 ? (
        props.data?.map((e) =>
          props.name !== "people" ? (
            <p key={e._id}>
              <span>{props.title} name:</span> <span> {e[props.name]}</span>
            </p>
          ) : (
            <div className="flex align-center people-cat gap-10" key={e._id}>
              <Link to={`/people/${e._id}`} className="profile-image">
                {e.image ? (
                  <img src={e.image} alt="" />
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
        <h3>no {props.title} found</h3>
      )}
    </div>
  );
};

export default CategoriesShow;
