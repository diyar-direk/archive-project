import React, { useState } from "react";
import "../../components/form.css";
import Mammoth from "mammoth";
import { placeholder, searchPlaceholder } from "../../context/context";
const AddPerson = () => {
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
    firstName: "",
    fatherName: "",
    surName: "",
    gender: "",
    maritalStatus: "",
    motherName: "",
    birthDate: "",
    placeOfBirth: "",
    occupation: "",
    countryId: "",
    governmentId: "",
    cityId: "",
    villageId: "",
    regionId: "",
    streetId: "",
    addressDetails: "",
    email: "",
    phone: "",
  });

  const handleForm = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    error && setError(false);
  };
  const handleFormSelect = (e) => {
    setForm({ ...form, [e.target.id]: e.target.title });
    error && setError(false);
  };

  const [documents, setDocuments] = useState({
    image: [],
    video: [],
    file: [],
    audio: [],
  });

  const [uploadedFiles, setUploadedFiles] = useState({ list: [] });
  const [activeFile, setActiveFile] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const formatFileSize = (fileSize) => `${(fileSize / 1024).toFixed(2)} KB`;

  const addperson = (file) => {
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      const fileType = file.type;

      if (fileType === "application/pdf") {
        setActiveFile({
          content: event.target.result,
          type: "application/pdf",
          name: file.name,
        });
      } else if (fileType === "text/plain") {
        setActiveFile({
          content: event.target.result,
          type: "text/plain",
          name: file.name,
        });
      } else if (
        fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const arrayBuffer = event.target.result;
        Mammoth.extractRawText({ arrayBuffer })
          .then((result) => {
            setActiveFile({
              content: result.value,
              type: "docx",
              name: file.name,
            });
            setIsPopupOpen(true);
          })
          .catch((err) => {
            console.error("Error reading .docx file:", err);
            alert("Failed to open .docx file.");
          });
        return;
      } else {
        alert("Unsupported file type for preview.");
      }

      setIsPopupOpen(true);
    };

    if (file.type === "application/pdf") {
      fileReader.readAsDataURL(file);
    } else if (file.type === "text/plain") {
      fileReader.readAsText(file);
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      fileReader.readAsArrayBuffer(file);
    } else {
      alert(
        "Unsupported file type. Only text, PDF, and DOCX files are allowed."
      );
    }
  };

  return (
    <>
      <h1 className="title">add person</h1>
      <form className="dashboard-form">
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
              <label htmlFor="fotherName">fother name</label>
              <input
                required
                value={form.fotherName}
                onChange={handleForm}
                type="text"
                id="fotherName"
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
                  {form.gender ? form.gender : "select gender"}
                </div>
                <article>
                  <h2 onClick={handleFormSelect} id="gender" title="male">
                    male
                  </h2>
                  <h2 onClick={handleFormSelect} id="gender" title="female">
                    Female
                  </h2>
                </article>
              </div>
            </div>

            <div className="flex flex-direction">
              <label>maritalStatus</label>
              <div className="selecte relative">
                <div onClick={handleClick} className="inp">
                  {form.maritalStatus
                    ? form.maritalStatus
                    : "select maritalStatus"}
                </div>
                <article>
                  <h2
                    onClick={handleFormSelect}
                    id="maritalStatus"
                    title="Married"
                  >
                    Married
                  </h2>
                  <h2
                    onClick={handleFormSelect}
                    id="maritalStatus"
                    title="Single"
                  >
                    single
                  </h2>
                  <h2
                    onClick={handleFormSelect}
                    id="maritalStatus"
                    title="Other"
                  >
                    Other
                  </h2>
                </article>
              </div>
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
            <div className="flex flex-direction">
              <label>country</label>
              <div className="selecte relative">
                <div onClick={handleClick} className="inp">
                  country
                </div>
                <article>
                  <input
                    placeholder={`${searchPlaceholder} country`}
                    type="text"
                  />
                  <h2>single</h2>
                  <h2>Female</h2>
                </article>
              </div>
            </div>

            <div className="flex flex-direction">
              <label>government</label>
              <div className="selecte relative">
                <div onClick={handleClick} className="inp">
                  government
                </div>
                <article>
                  <input
                    placeholder={`${searchPlaceholder} government`}
                    type="text"
                  />
                  <h2>single</h2>
                  <h2>Female</h2>
                </article>
              </div>
            </div>

            <div className="flex flex-direction">
              <label>city</label>
              <div className="selecte relative">
                <div onClick={handleClick} className="inp">
                  city
                </div>
                <article>
                  <input
                    placeholder={`${searchPlaceholder} city`}
                    type="text"
                  />
                  <h2>single</h2>
                  <h2>Female</h2>
                </article>
              </div>
            </div>

            <div className="flex flex-direction">
              <label>village</label>
              <div className="selecte relative">
                <div onClick={handleClick} className="inp">
                  village
                </div>
                <article>
                  <input
                    placeholder={`${searchPlaceholder} village`}
                    type="text"
                  />
                  <h2>single</h2>
                  <h2>Female</h2>
                </article>
              </div>
            </div>

            <div className="flex flex-direction">
              <label>region</label>
              <div className="selecte relative">
                <div onClick={handleClick} className="inp">
                  region
                </div>
                <article>
                  <input
                    placeholder={`${searchPlaceholder} region`}
                    type="text"
                  />
                  <h2>single</h2>
                  <h2>Female</h2>
                </article>
              </div>
            </div>

            <div className="flex flex-direction">
              <label>street</label>
              <div className="selecte relative">
                <div onClick={handleClick} className="inp">
                  street
                </div>
                <article>
                  <input
                    placeholder={`${searchPlaceholder} street`}
                    type="text"
                  />
                  <h2>single</h2>
                  <h2>Female</h2>
                </article>
              </div>
            </div>

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
          <div className="flex warp">
            <div className="flex flex-direction">
              <label htmlFor="phone">phone</label>
              <input
                value={form.phone}
                onChange={handleForm}
                required
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
                required
                type="email"
                id="email"
                className="inp"
                placeholder={`${placeholder} email`}
              />
            </div>
          </div>
        </div>

      

        <button className="btn">save</button>
      </form>
    </>
  );
};

export default AddPerson;
