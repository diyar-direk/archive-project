import React, { useEffect, useRef, useState } from "react";
import "../../components/form/form.css";
import { baseURL, placeholder } from "../../context/context";
import axios from "axios";
import SendData from "../../components/response/SendData";
import Loading from "../../components/loading/Loading";
import FormSelect from "../../components/form/FormSelect";
import { useNavigate, useParams } from "react-router-dom";
const UpdatePerson = () => {
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
  const nav = useNavigate();

  const [form, setForm] = useState({});

  const { id } = useParams();
  useEffect(() => {
    axios
      .get(`${baseURL}/people/${id}`)
      .then((res) => {
        setForm({
          ...res.data.data,
          birthDate: res.data.data.birthDate.split("T")[0],
        });
      })
      .catch((err) => {
        console.log(err);
      });
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
    if (!form.maritalStatus) setError("please select maritalStatus");
    else if (!form.gender) setError("please select gender");
    else if (!form.countryId) setError("please select country");
    else if (!form.governmentId) setError("please select government");
    else if (!form.cityId) setError("please select city");
    else if (!form.sectionId) setError("please select section");
    else if (!form.sources) setError("please select source");
    else {
      setLoading(true);
      const keys = Object.keys(form);
      const formData = new FormData();

      keys.forEach((key) => {
        if (
          (form[key] && !Array.isArray(form[key])) ||
          (Array.isArray(form[key]) && form[key]?.length !== 0)
        ) {
          if (!Array.isArray(form[key]))
            formData.append(key, form[key]?._id ? form[key]?._id : form[key]);
          else {
            form[key].forEach((item) => {
              formData.append(`${key}[]`, item._id || item);
            });
          }
        }
      });

      try {
        const data = await axios.patch(`${baseURL}/people/${id}`, formData);
        if (data.status === 200) nav("/people");
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
        <SendData data={`person`} response={response.current} />
      )}
      {loading && <Loading />}
      <h1 className="title">add person</h1>
      <form onSubmit={handleSubmit} className="dashboard-form">
        <div className="form form-profile">
          <label className="gap-10 center">
            <input
              accept="image/*"
              type="file"
              id="image"
              onInput={(e) => {
                setForm({ ...form, image: e.target.files[0] });
              }}
            />

            {!form.image && <i className="fa-solid fa-user"></i>}
            {form.image && (
              <img alt="profile" loading="lazy" src={form.image} />
            )}
          </label>
        </div>

        <div className="form">
          <h1>personal information</h1>
          <div className="flex wrap">
            <div className="flex flex-direction">
              <label htmlFor="firstName">first name</label>
              <input
                required
                type="text"
                id="firstName"
                className="inp"
                value={form.firstName}
                onChange={handleForm}
                placeholder={`${placeholder} first name`}
              />
            </div>

            <div className="flex flex-direction">
              <label htmlFor="fatherName">fother name</label>
              <input
                required
                value={form.fatherName}
                onChange={handleForm}
                type="text"
                id="fatherName"
                className="inp"
                placeholder={`${placeholder} fother name`}
              />
            </div>

            <div className="flex flex-direction">
              <label htmlFor="surName">last name</label>
              <input
                value={form.surName}
                onChange={handleForm}
                required
                type="text"
                id="surName"
                className="inp"
                placeholder={`${placeholder} last name`}
              />
            </div>

            <div className="flex flex-direction">
              <label>gender</label>
              <div className="selecte relative">
                <div onClick={handleClick} className="inp">
                  select gender
                </div>
                <article>
                  <h2
                    onClick={(e) => handleFormSelect(e, e.target.title)}
                    id="gender"
                    title="Male"
                  >
                    male
                  </h2>
                  <h2
                    onClick={(e) => handleFormSelect(e, e.target.title)}
                    id="gender"
                    title="Female"
                  >
                    Female
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
              <label>maritalStatus</label>
              <div className="selecte relative">
                <div onClick={handleClick} className="inp">
                  select maritalStatus
                </div>
                <article>
                  <h2
                    onClick={(e) => handleFormSelect(e, e.target.title)}
                    id="maritalStatus"
                    title="Married"
                  >
                    Married
                  </h2>
                  <h2
                    onClick={(e) => handleFormSelect(e, e.target.title)}
                    id="maritalStatus"
                    title="Single"
                  >
                    single
                  </h2>
                  <h2
                    onClick={(e) => handleFormSelect(e, e.target.title)}
                    id="maritalStatus"
                    title="Other"
                  >
                    Other
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
              <label htmlFor="motherName">mother name</label>
              <input
                value={form.motherName}
                onChange={handleForm}
                required
                type="text"
                id="motherName"
                className="inp"
                placeholder={`${placeholder} mother name`}
              />
            </div>

            <div className="flex flex-direction">
              <label htmlFor="birthDate">date of birth</label>
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
              <label htmlFor="placeOfBirth">place of birth</label>
              <input
                required
                value={form.placeOfBirth}
                onChange={handleForm}
                type="text"
                id="placeOfBirth"
                className="inp"
                placeholder={`${placeholder} place of birth`}
              />
            </div>

            <div className="flex flex-direction">
              <label htmlFor="occupation">occupation</label>
              <input
                value={form.occupation}
                onChange={handleForm}
                required
                type="text"
                id="occupation"
                className="inp"
                placeholder={`${placeholder} occupation`}
              />
            </div>
          </div>
        </div>

        <div className="form">
          <h1>stay informations</h1>
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
              <label htmlFor="addressDetails">addressDetails</label>
              <textarea
                value={form.addressDetails}
                onChange={handleForm}
                className="inp"
                placeholder="test"
                id="addressDetails"
                rows={4}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="form">
          <h1>contact informations</h1>
          <div className="flex wrap">
            <div className="flex flex-direction">
              <label htmlFor="phone">phone</label>
              <input
                required
                value={form.phone}
                onChange={handleForm}
                type="text"
                id="phone"
                className="inp"
                placeholder={`${placeholder} phone`}
              />
            </div>
            <div className="flex flex-direction">
              <label htmlFor="email">email</label>
              <input
                value={form.email}
                onChange={handleForm}
                type="email"
                id="email"
                className="inp"
                placeholder={`${placeholder} email`}
              />
            </div>
          </div>
        </div>

        <div className="form">
          <h1>more informations</h1>
          <div className="flex wrap">
            <FormSelect
              formKey="section"
              error={{ error, setError }}
              form={{ form, setForm }}
            />
            <FormSelect
              formKey="sources"
              error={{ error, setError }}
              form={{ form, setForm }}
            />
          </div>
        </div>

        {error && <p className="error"> {error} </p>}
        <button className="btn">save</button>
      </form>
    </>
  );
};

export default UpdatePerson;
