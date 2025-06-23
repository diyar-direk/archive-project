import { useContext, useEffect, useRef, useState } from "react";
import "../../components/form/form.css";
import { baseURL, Context } from "../../context/context";
import axios from "axios";
import SendData from "../../components/response/SendData";
import Loading from "../../components/loading/Loading";
import FormSelect from "../../components/form/FormSelect";
import useLanguage from "../../hooks/useLanguage";
import SelectInputApi from "../../components/inputs/SelectInputApi";
import { getPeopleApi } from "../people/api";
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
  const { language } = useLanguage();

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
  const context = useContext(Context);
  const token = context.userDetails.token;
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
    if (!form.role) setError(language?.table?.please_selecet_role);
    else if (form.role === "user" && !form.sectionId)
      setError(language?.table?.please_selecet_section);
    else if (form.password !== passwordCon)
      setError(language?.table?.password_match);
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
        const data = await axios.post(`${baseURL}/Users`, formData, {
          headers: { Authorization: "Bearer " + token },
        });
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
        <SendData
          data={language?.users?.username}
          response={response.current}
        />
      )}
      {loading && <Loading />}
      <h1 className="title">{language?.header?.add_users}</h1>
      <form onSubmit={handleSubmit} className="dashboard-form">
        <div className="form">
          <div className="flex wrap">
            <div className="flex flex-direction">
              <label htmlFor="username">{language?.users?.user_name}</label>
              <input
                required
                type="text"
                minLength={3}
                maxLength={50}
                id="username"
                className="inp"
                value={form.username}
                onChange={handleForm}
                placeholder={language?.users?.user_name_placeHolder}
              />
            </div>

            <div className="flex flex-direction">
              <label>{language?.users?.select_role}</label>
              <div className="selecte relative">
                <div onClick={handleClick} className="inp">
                  {language?.users?.select_role}
                </div>
                <article>
                  <h2
                    onClick={(e) => handleFormSelect(e, e.target.title)}
                    id="role"
                    title="user"
                  >
                    {language?.users?.user}
                  </h2>
                  <h2
                    onClick={(e) => handleFormSelect(e, e.target.title)}
                    id="role"
                    title="admin"
                  >
                    {language?.users?.admin}
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

            <SelectInputApi
              fetchData={getPeopleApi}
              selectLabel={"people"}
              label={"choose people"}
              optionLabel={(option) => option?.firstName}
              onChange={(option) => setForm({ ...form, role: option?._id })}
              value={form.people}
              onIgnore={() => setForm({ ...form, people: "" })}
            />

            <div className="flex flex-direction">
              <label htmlFor="password">{language?.users?.password}</label>
              <input
                value={form.password}
                onChange={handleForm}
                required
                type="password"
                minLength={6}
                id="password"
                className="inp"
                placeholder={language?.users?.password_placeHolder}
              />
            </div>
            <div className="flex flex-direction">
              <label htmlFor="passwordConf">
                {language?.users?.password_confirmation}
              </label>
              <input
                value={passwordCon}
                onChange={(e) => setPasswordCon(e.target.value)}
                required
                type="password"
                id="passwordConf"
                className="inp"
                placeholder={language?.users?.password_confirmation_placeholder}
              />
            </div>
          </div>
        </div>

        {error && <p className="error"> {error} </p>}
        <button className="btn">{language?.users?.save}</button>
      </form>
    </>
  );
};

export default AddUser;
