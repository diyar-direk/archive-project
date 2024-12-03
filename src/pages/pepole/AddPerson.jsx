import React from "react";
import "../../components/form.css";

const AddPerson = () => {
  const handleClick = (e) => {
    e.stopPropagation();
    e.target.classList.toggle("active");
  };
  return (
    <>
      <h1 className="title">add person</h1>
      <form className="dashboard-form">
        <div className="form">
          <h1>test title</h1>
          <div className="flex wrap">
            <div className="flex flex-direction">
              <label htmlFor="aliasName">alias name</label>
              <input
                required
                type="text"
                id="aliasName"
                className="inp"
                placeholder="test"
              />
            </div>

            <div className="flex flex-direction">
              <label htmlFor="firstName">first name</label>
              <input
                required
                type="text"
                id="firstName"
                className="inp"
                placeholder="test"
              />
            </div>
            <div className="flex flex-direction">
              <label htmlFor="lastName">last name</label>
              <input
                required
                type="text"
                id="lastName"
                className="inp"
                placeholder="test"
              />
            </div>
            <div className="flex flex-direction">
              <label htmlFor="fotherName">fother name</label>
              <input
                required
                type="text"
                id="fotherName"
                className="inp"
                placeholder="test"
              />
            </div>
            <div className="flex flex-direction">
              <label htmlFor="motherName">mother name</label>
              <input
                required
                type="text"
                id="motherName"
                className="inp"
                placeholder="test"
              />
            </div>

            <div className="flex flex-direction">
              <label htmlFor="dateOfBirth">date of birth</label>
              <input
                required
                type="date"
                id="dateOfBirth"
                className="inp"
                placeholder="test"
              />
            </div>

            <div className="flex flex-direction">
              <label htmlFor="dateOfBirth">date of birth</label>
              <input
                required
                type="text"
                id="dateOfBirth"
                className="inp"
                placeholder="test"
              />
            </div>

            <div className="flex flex-direction">
              <label>select</label>
              <div className="selecte relative">
                <div onClick={handleClick} className="inp">
                  test
                </div>
                <article>
                  <h2>h</h2>
                  <h2>t</h2>
                  <h2>d</h2>
                </article>
              </div>
            </div>
          </div>
        </div>
        <div className="form">
          <h1>test title</h1>
          <div className="flex warp">
            <div className="flex flex-direction">
              <label htmlFor="details">details</label>
              <textarea
                className="inp"
                required
                placeholder="test"
                id="details"
                rows={4}
              ></textarea>
            </div>
            <div className="flex flex-direction">
              <label htmlFor="note">note</label>
              <textarea
                className="inp"
                required
                placeholder="test"
                id="note"
                rows={4}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="form">
          <h1>test title</h1>
          <div className="grid-2">
            <div className="flex flex-direction">
              <label className="inp document gap-10 center">
                <input placeholder="test" type="file" id="image" />
                upload image
                <i className="fa-regular fa-image"></i>
              </label>
            </div>

            <div className="flex flex-direction">
              <label className="inp document gap-10 center">
                <input placeholder="test" type="file" id="video" />
                upload video
                <i className="fa-solid fa-video"></i>
              </label>
            </div>

            <div className="flex flex-direction">
              <label className="inp document gap-10 center">
                <input placeholder="test" type="file" id="audio" />
                upload audio
                <i className="fa-solid fa-microphone"></i>
              </label>
            </div>

            <div className="flex flex-direction">
              <label className="inp document gap-10 center">
                <input placeholder="test" type="file" id="document" />
                upload document
                <i className="fa-solid fa-file"></i>
              </label>
            </div>
          </div>
        </div>

        <button className="btn">save</button>
      </form>
    </>
  );
};

export default AddPerson;
