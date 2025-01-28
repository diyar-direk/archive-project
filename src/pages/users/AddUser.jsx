import React, { useEffect, useRef, useState } from "react";
import "../../components/form/form.css";
import { baseURL, placeholder } from "../../context/context";
import axios from "axios";
import SendData from "../../components/response/SendData";
import Loading from "../../components/loading/Loading";
import FormSelect from "../../components/form/FormSelect";
const AddUser = () => {
  const [loading, setLoading] = useState(false);
  const handleClick = (e) => {
    e.stopPropagation();
    const divs = document.querySelectorAll("div.form .selecte .inp.active");
    divs.forEach((ele) => ele !== e.target && ele.classList.remove("active"));
    e.target.classList.toggle("active");
  };

  window.addEventListener("click", () => {
    const selectDiv = document.querySelector("div.form .selecte .inp.active");
    selectDiv && selectDiv.classList.remove("active");
  });

  const [error, setError] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "",
    sectionId: "",
  });
  useEffect(() => {
    if (form.role === "admin")
      form.sectionId && setForm({ ...form, sectionId: "" });
  }, [form.role]);
  const [passwordCon, setPasswordCon] = useState("");

  const ignoreSelect = (e) => {
    setForm({ ...form, [e.target.title]: "" });
  };

  const handleForm = (e) => {
    const { id, value } = e.target;

    const usernameRegex = /^[a-zA-Z0-9]+$/;

    if (id === "username") {
      if (usernameRegex.test(value) || value === "") {
        error && setError(false);
        setForm({ ...form, [id]: value });
      }
    } else {
      setForm({ ...form, [id]: value });
    }
  };

  const handleFormSelect = (e, itm) => {
    setForm({ ...form, [e.target.id]: itm });
    error && setError(false);
  };

  const response = useRef(true);
  const [responseOverlay, setResponseOverlay] = useState(false);

  const responseFun = (complete = false) => {
    complete === true
      ? (response.current = true)
      : complete === "reapeted data"
      ? (response.current = 400)
      : (response.current = false);
    setResponseOverlay(true);
    window.onclick = () => {
      setResponseOverlay(false);
    };
    setTimeout(() => {
      setResponseOverlay(false);
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.role) setError("please select role");
    else if (form.role === "user" && !form.sectionId)
      setError("please select section");
    else if (form.password !== passwordCon) setError("passowrd most be same");
    else {
      setLoading(true);
      const keys = Object.keys(form);
      const formData = {};

      keys.forEach((key) => {
        if (form[key]) {
          formData[key] = form[key];
        }
      });

      try {
        const data = await axios.post(`${baseURL}/Users`, formData);
        if (data.status === 201) {
          responseFun(true);
          setForm({
            username: "",
            password: "",
            role: "",
            sectionId: "",
          });
          setPasswordCon("");
        }
      } catch (error) {
        console.log(error);
        if (error.status === 400) responseFun("reapeted data");
        else responseFun(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {responseOverlay && (
        <SendData data={`person`} response={response.current} />
      )}
      {loading && <Loading />}
      <h1 className="title">add user</h1>
      <form onSubmit={handleSubmit} className="dashboard-form">
        <div className="form">
          <div className="flex wrap">
            <div className="flex flex-direction">
              <label htmlFor="username">user name</label>
              <input
                required
                type="text"
                minLength={3}
                maxLength={50}
                id="username"
                className="inp"
                value={form.username}
                onChange={handleForm}
                placeholder={`${placeholder} user name`}
              />
            </div>

            <div className="flex flex-direction">
              <label>role</label>
              <div className="selecte relative">
                <div onClick={handleClick} className="inp">
                  select role
                </div>
                <article>
                  <h2
                    onClick={(e) => handleFormSelect(e, e.target.title)}
                    id="role"
                    title="user"
                  >
                    user
                  </h2>
                  <h2
                    onClick={(e) => handleFormSelect(e, e.target.title)}
                    id="role"
                    title="admin"
                  >
                    admin
                  </h2>
                </article>
              </div>
              {form.role && (
                <span title="role" onClick={ignoreSelect}>
                  {form.role}
                </span>
              )}
            </div>
            {form.role === "user" && (
              <FormSelect
                formKey="section"
                error={{ error, setError }}
                form={{ form, setForm }}
              />
            )}

            <div className="flex flex-direction">
              <label htmlFor="password">password</label>
              <input
                value={form.password}
                onChange={handleForm}
                required
                type="password"
                minLength={6}
                id="password"
                className="inp"
                placeholder={`${placeholder} password`}
              />
            </div>
            <div className="flex flex-direction">
              <label htmlFor="passwordConf">password confirmation</label>
              <input
                value={passwordCon}
                onChange={(e) => setPasswordCon(e.target.value)}
                required
                type="password"
                id="passwordConf"
                className="inp"
                placeholder={`${placeholder} password`}
              />
            </div>
          </div>
        </div>

        {error && <p className="error"> {error} </p>}
        <button className="btn">save</button>
      </form>
    </>
  );
};

export default AddUser;
