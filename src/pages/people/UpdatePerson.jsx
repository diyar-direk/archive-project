import React, { useContext, useEffect, useRef, useState } from "react";
import "../../components/form/form.css";
import { baseURL, placeholder } from "../../context/context";
import axios from "axios";
import SendData from "../../components/response/SendData";
import Loading from "../../components/loading/Loading";
import FormSelect from "../../components/form/FormSelect";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { Context } from "./../../context/context";
import MediaComponent from "../../components/MediaComponent";
import useLanguage from "../../hooks/useLanguage";
const UpdatePerson = () => {
  const [loading, setLoading] = useState(false);
  const context = useContext(Context);
  const token = context.userDetails.token;
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
  const nav = useNavigate();
  const { language } = useLanguage();
  const [form, setForm] = useState({});
  const [newImage, setNewImage] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const { id } = useParams();
  useEffect(() => {
    axios
      .get(`${baseURL}/people/${id}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (
          context.userDetails.role === "user" &&
          context.userDetails.sectionId !== res.data.data.sectionId._id
        ) {
          nav("/dashboard/not-found-404");
          return;
        }

        setForm({
          ...res.data.data,
          birthDate: res.data.data.birthDate.split("T")[0],
        });
      })
      .catch((err) => {
        console.log(err);
        if (err.status === 500 || err.status === 404)
          nav("/dashboard/error-404");
        err.status === 403 && nav(`/dashboard/error-403`);
      })
      .finally(() => setDataLoading(false));
  }, []);

  const ignoreSelect = (e) => {
    setForm({ ...form, [e.target.title]: "" });
  };

  const handleForm = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    error && setError(false);
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
    if (!form.maritalStatus)
      setError(language?.error?.please_selecet_maritalStatus);
    else if (!form.gender) setError(language?.error?.please_selecet_gender);
    else if (!form.countryId) setError(language?.error?.please_selecet_country);
    else if (!form.governmentId)
      setError(language?.error?.please_selecet_government);
    else if (!form.cityId) setError(language?.error?.please_selecet_city);
    else if (!form.sectionId) setError(language?.error?.please_selecet_section);
    else if (!form.sources) setError(language?.error?.please_selecet_source);
    else {
      let newForm = { ...form };
      newImage && (newForm = { ...form, image: newImage });
      setLoading(true);
      const keys = Object.keys(newForm);
      const formData = new FormData();

      keys.forEach((key) => {
        if (
          (newForm[key] && !Array.isArray(newForm[key])) ||
          (Array.isArray(newForm[key]) && newForm[key]?.length !== 0)
        ) {
          if (!Array.isArray(newForm[key]))
            formData.append(
              key,
              newForm[key]?._id ? newForm[key]?._id : newForm[key]
            );
          else {
            newForm[key].forEach((item) => {
              formData.append(`${key}[]`, item._id || item);
            });
          }
        }
      });

      try {
        const data = await axios.patch(`${baseURL}/people/${id}`, formData, {
          headers: { Authorization: "Bearer " + token },
        });
        if (data.status === 200) nav("/dashboard/people");
      } catch (error) {
        console.log(error);
        responseFun(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {responseOverlay && (
        <SendData data={language?.header?.person} response={response.current} />
      )}
      {loading && <Loading />}
      {dataLoading ? (
        <>
          <Skeleton width={"50%"} height={"200px"} />
          <br />
          <Skeleton width={"100%"} height={"500px"} />
        </>
      ) : (
        <form onSubmit={handleSubmit} className="dashboard-form">
          <div className="form flex-direction gap-10 form-profile">
            <label className="gap-10 center">
              <input
                accept="image/*"
                type="file"
                id="image"
                onInput={(e) => {
                  setNewImage(e.target.files[0]);
                }}
              />

              {!form.image && <i className="fa-solid fa-user"></i>}
              {(form?.image || newImage) &&
                (newImage ? (
                  <img
                    alt=""
                    className="photo w-100 c-pointer"
                    src={URL.createObjectURL(newImage)}
                  />
                ) : (
                  <MediaComponent
                    type="image"
                    className="photo w-100 c-pointer"
                    src={`${form?.image}`}
                  />
                ))}
            </label>
            {newImage && (
              <span onClick={() => setNewImage(false)} className="cencel">
                {language?.people?.cancel}
              </span>
            )}
          </div>

          <div className="form">
            <h1>{language?.people?.personal_information}</h1>
            <div className="flex wrap">
              <div className="flex flex-direction">
                <label htmlFor="firstName">
                  {language?.people?.first_name}
                </label>
                <input
                  required
                  type="text"
                  id="firstName"
                  className="inp"
                  value={form.firstName}
                  onChange={handleForm}
                  placeholder={language?.people?.first_name_placeholder}
                />
              </div>

              <div className="flex flex-direction">
                <label htmlFor="fatherName">
                  {language?.people?.father_name}
                </label>
                <input
                  required
                  value={form.fatherName}
                  onChange={handleForm}
                  type="text"
                  id="fatherName"
                  className="inp"
                  placeholder={language?.people?.father_name_placeholder}
                />
              </div>

              <div className="flex flex-direction">
                <label htmlFor="surName">{language?.people?.last_name}</label>
                <input
                  value={form.surName}
                  onChange={handleForm}
                  required
                  type="text"
                  id="surName"
                  className="inp"
                  placeholder={language?.people?.last_name_placeholder}
                />
              </div>

              <div className="flex flex-direction">
                <label>{language?.people?.gender}</label>
                <div className="selecte relative">
                  <div onClick={handleClick} className="inp">
                    {language?.people?.select_gender}
                  </div>
                  <article>
                    <h2
                      onClick={(e) => handleFormSelect(e, e.target.title)}
                      id="gender"
                      title="Male"
                    >
                      {language?.people?.male}
                    </h2>
                    <h2
                      onClick={(e) => handleFormSelect(e, e.target.title)}
                      id="gender"
                      title="Female"
                    >
                      {language?.people?.female}
                    </h2>
                  </article>
                </div>
                {form.gender && (
                  <span title="gender" onClick={ignoreSelect}>
                    {form.gender}
                  </span>
                )}
              </div>

              <div className="flex flex-direction">
                <label>{language?.people?.marital_status}</label>
                <div className="selecte relative">
                  <div onClick={handleClick} className="inp">
                    {language?.people?.select_marital_status}
                  </div>
                  <article>
                    <h2
                      onClick={(e) => handleFormSelect(e, e.target.title)}
                      id="maritalStatus"
                      title="Married"
                    >
                      {language?.people?.married}
                    </h2>
                    <h2
                      onClick={(e) => handleFormSelect(e, e.target.title)}
                      id="maritalStatus"
                      title="Single"
                    >
                      {language?.people?.single}
                    </h2>
                    <h2
                      onClick={(e) => handleFormSelect(e, e.target.title)}
                      id="maritalStatus"
                      title="Other"
                    >
                      {language?.people?.other}
                    </h2>
                  </article>
                </div>
                {form.maritalStatus && (
                  <span title="maritalStatus" onClick={ignoreSelect}>
                    {form.maritalStatus}
                  </span>
                )}
              </div>

              <div className="flex flex-direction">
                <label htmlFor="motherName">
                  {language?.people?.motherName}
                </label>
                <input
                  value={form.motherName}
                  onChange={handleForm}
                  required
                  type="text"
                  id="motherName"
                  className="inp"
                  placeholder={language?.people?.motherName_placeholder}
                />
              </div>

              <div className="flex flex-direction">
                <label htmlFor="birthDate">
                  {language?.people?.date_of_birth}
                </label>
                <input
                  value={form.birthDate}
                  onChange={handleForm}
                  required
                  type="date"
                  id="birthDate"
                  className="inp"
                />
              </div>

              <div className="flex flex-direction">
                <label htmlFor="placeOfBirth">
                  {language?.people?.place_of_birth}
                </label>
                <input
                  required
                  value={form.placeOfBirth}
                  onChange={handleForm}
                  type="text"
                  id="placeOfBirth"
                  className="inp"
                  placeholder={language?.people?.place_of_birth_placeholder}
                />
              </div>

              <div className="flex flex-direction">
                <label htmlFor="occupation">
                  {language?.people?.occupation}
                </label>
                <input
                  value={form.occupation}
                  onChange={handleForm}
                  required
                  type="text"
                  id="occupation"
                  className="inp"
                  placeholder={language?.people?.occupation_placeholder}
                />
              </div>
            </div>
          </div>

          <div className="form">
            <h1>{language?.people?.adress_information}</h1>
            <div className="flex wrap">
              <FormSelect
                formKey="country"
                error={{ error, setError }}
                form={{ form, setForm }}
              />
              <FormSelect
                formKey="city"
                error={{ error, setError }}
                form={{ form, setForm }}
              />

              <FormSelect
                formKey="government"
                error={{ error, setError }}
                form={{ form, setForm }}
              />

              <FormSelect
                formKey="village"
                error={{ error, setError }}
                form={{ form, setForm }}
              />
              <FormSelect
                formKey="region"
                error={{ error, setError }}
                form={{ form, setForm }}
              />
              <FormSelect
                formKey="street"
                error={{ error, setError }}
                form={{ form, setForm }}
              />

              <div className="flex flex-direction">
                <label htmlFor="addressDetails">
                  {language?.people?.extra_adress_details}
                </label>
                <textarea
                  value={form.addressDetails}
                  onChange={handleForm}
                  className="inp"
                  placeholder={
                    language?.people?.extra_adress_details_placeholder
                  }
                  id="addressDetails"
                  rows={4}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="form">
            <h1>{language?.people?.contact_information}</h1>
            <div className="flex wrap">
              <div className="flex flex-direction">
                <label htmlFor="phone">{language?.people?.phone}</label>
                <input
                  required
                  value={form.phone}
                  onChange={handleForm}
                  type="text"
                  id="phone"
                  className="inp"
                  placeholder={language?.people?.phone_placeholder}
                />
              </div>
              <div className="flex flex-direction">
                <label htmlFor="email">{language?.people?.email}</label>
                <input
                  value={form.email}
                  onChange={handleForm}
                  type="email"
                  id="email"
                  className="inp"
                  placeholder={language?.people?.email_placeholder}
                />
              </div>
            </div>
          </div>

          <div className="form">
            <h1>{language?.people?.more_information}</h1>
            <div className="flex wrap">
              {context.userDetails.isAdmin && (
                <FormSelect
                  formKey="section"
                  error={{ error, setError }}
                  form={{ form, setForm }}
                />
              )}
              <FormSelect
                formKey="sources"
                error={{ error, setError }}
                form={{ form, setForm }}
              />
            </div>
          </div>

          {error && <p className="error"> {error} </p>}
          <button className="btn">{language?.people?.save}</button>
        </form>
      )}
    </>
  );
};

export default UpdatePerson;
