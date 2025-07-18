import { useCallback, useContext, useMemo, useRef, useState } from "react";
import "../../components/form/form.css";
import "./information.css";
import { baseURL, Context } from "../../context/context";
import axios from "axios";
import SendData from "../../components/response/SendData";
import Loading from "../../components/loading/Loading";
import DocumentsShow from "./DocumentsShow";
import useLanguage from "../../hooks/useLanguage";
import SelectInputApi from "../../components/inputs/SelectInputApi";
import { getPeopleApi } from "../people/api";
import SelectOptionInput from "../../components/inputs/SelectOptionInput";
import InputWithLabel from "../../components/inputs/InputWithLabel";
import { getInfinityFeatchApis } from "../../utils/infintyFeatchApis";
const AddInformation = () => {
  const context = useContext(Context);
  const token = context.userDetails.token;
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();

  const [error, setError] = useState(false);

  const [form, setForm] = useState({
    //personal data
    people: [],
    coordinates: [],
    subject: "",
    note: "",
    details: "",
    sectionId: context.userDetails.sectionId || "",
    cityId: "",
    countryId: "",
    governmentId: "",
    regionId: "",
    villageId: "",
    streetId: "",
    addressDetails: "",
    //categories data
    credibility: "",
    sources: [],
    events: [],
    parties: [],
  });

  const handleForm = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    error && setError(false);
  };

  const [documents, setDocuments] = useState({
    image: [],
    video: [],
    audio: [],
  });

  const [uploadedFiles, setUploadedFiles] = useState({ list: [] });
  const [activeFile, setActiveFile] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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
    if (!form.cityId) setError(language?.error?.please_selecet_city);
    else if (!form.sectionId) setError(language?.error?.please_selecet_section);
    else if (form.sources.length < 1)
      setError(language?.error?.please_selecet_source);
    else if (!form.credibility)
      setError(language?.error?.please_selecet_credibility);
    else {
      setLoading(true);
      const keys = Object.keys(form);
      const formData = { ...form };

      keys.forEach((key) => {
        if (
          (form[key] && !Array.isArray(form[key])) ||
          (Array.isArray(form[key]) && form[key]?.length !== 0)
        ) {
          if (!Array.isArray(form[key])) {
            formData[key] = form[key]?._id ? form[key]._id : form[key];
          } else {
            formData[key] = form[key].map((itm) => itm._id || itm);
          }
        } else {
          if (!Array.isArray(form[key])) {
            formData[key] = null;
          } else {
            formData[key] = [];
          }
        }
      });

      try {
        const data = await axios.post(`${baseURL}/Information`, formData, {
          headers: { Authorization: "Bearer " + token },
        });
        const id = data.data.data._id;

        const imagesDoc = new FormData();
        const videosDoc = new FormData();
        const audioDoc = new FormData();
        const documentDoc = new FormData();
        if (documents.image.length > 0) {
          imagesDoc.append("informationId", id);
          documents.image.forEach((item) => {
            imagesDoc.append(`images`, item);
          });
          try {
            await axios.post(`${baseURL}/media/images`, imagesDoc, {
              headers: { Authorization: "Bearer " + token },
            });
          } catch (error) {
            console.log(error);
            alert("error in uploading images");
          }
        }

        if (documents.video.length > 0) {
          videosDoc.append("informationId", id);
          documents.video.forEach((item) => {
            videosDoc.append(`videos`, item);
          });
          try {
            await axios.post(`${baseURL}/media/videos`, videosDoc, {
              headers: { Authorization: "Bearer " + token },
            });
          } catch (error) {
            alert("error in uploading videos");
            console.log(error);
          }
        }

        if (documents.audio.length > 0) {
          audioDoc.append("informationId", id);
          documents.audio.forEach((item) => {
            audioDoc.append(`audios`, item);
          });
          try {
            await axios.post(`${baseURL}/media/audios`, audioDoc, {
              headers: { Authorization: "Bearer " + token },
            });
          } catch (error) {
            alert("error in uploading audios");
            console.log(error);
          }
        }

        if (uploadedFiles.list.length > 0) {
          documentDoc.append("informationId", id);
          uploadedFiles.list.forEach((item) => {
            documentDoc.append(`documents`, item);
          });
          try {
            await axios.post(`${baseURL}/media/documents`, documentDoc, {
              headers: { Authorization: "Bearer " + token },
            });
          } catch (error) {
            alert("error in uploading documents");
            console.log(error);
          }
        }

        if (data.status === 201) {
          responseFun(true);
          setForm({
            //personal data
            people: [],
            coordinates: [],
            subject: "",
            note: "",
            details: "",
            sectionId: context.userDetails.sectionId || "",
            cityId: "",
            countryId: "",
            governmentId: "",
            regionId: "",
            villageId: "",
            streetId: "",
            addressDetails: "",
            //categories data
            credibility: "",
            sources: [],
            events: [],
            parties: [],
          });
          setDocuments({
            image: [],
            video: [],
            audio: [],
          });
          setUploadedFiles({ list: [] });
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

  const removeDuplicates = (filesArray) => {
    const fileMap = new Map();
    filesArray.forEach((file) => {
      fileMap.set(file.name, file);
    });
    return Array.from(fileMap.values());
  };

  const handleFiles = (files) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    const videoFiles = files.filter((file) => file.type.startsWith("video/"));
    const audioFiles = files.filter((file) => file.type.startsWith("audio/"));
    const documentFiles = files.filter((file) =>
      [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ].includes(file.type)
    );

    setDocuments((prev) => ({
      ...prev,
      image: removeDuplicates([...prev.image, ...imageFiles]),
      video: removeDuplicates([...prev.video, ...videoFiles]),
      audio: removeDuplicates([...prev.audio, ...audioFiles]),
    }));

    setUploadedFiles((prev) => ({
      ...prev,
      list: removeDuplicates([...prev.list, ...documentFiles]),
    }));
  };

  const multiSelectInput = useCallback(
    (itm, name) => {
      const oldItems = form[name] || [];
      const alreadyExists = oldItems.some((oldItm) => oldItm._id === itm._id);
      if (alreadyExists) return;
      setForm({ ...form, [name]: [...oldItems, itm] });
    },
    [form]
  );
  const ignoreMultiSelectInput = useCallback(
    (itm, name) => {
      const oldItems = form[name] || [];

      const updatedItems = oldItems.filter(
        (element) => element._id !== itm._id
      );
      setForm({ ...form, [name]: updatedItems });
    },
    [form]
  );

  const credibilityOptions = useMemo(() => {
    const arrayOfOptionsInput = [
      {
        name: "credibility",
        label: language?.information?.credibility,
        placeholder: `select ${language?.information?.select_credibility}`,
        options: [
          {
            onSelectOption: () => setForm({ ...form, credibility: "High" }),
            text: language?.information?.high,
          },
          {
            text: language?.information?.medium,
            onSelectOption: () => setForm({ ...form, credibility: "Medium" }),
          },
          {
            text: language?.information?.low,
            onSelectOption: () => setForm({ ...form, credibility: "Low" }),
          },
        ],
      },
    ];

    return arrayOfOptionsInput.map((input) => (
      <SelectOptionInput
        key={input.name}
        label={input.label}
        placeholder={input.placeholder}
        value={form[input.name]}
        onIgnore={() => setForm({ ...form, [input.name]: "" })}
        options={input.options}
      />
    ));
  }, [language, form]);

  const multiSelectInputs = useMemo(() => {
    const arrayOfApis = [
      {
        name: "people",
        label: "people",
        selectLabel: "select people",
        optionLabel: (option) => {
          return `${option?.firstName} ${option?.surName}`;
        },
        fetchData: getPeopleApi,
      },
      {
        name: "events",
        label: "event",
        selectLabel: "select events",
        url: "Events",
      },
      {
        name: "sources",
        label: "source",
        selectLabel: "select sources",
        url: "Sources",
        optionLabel: (option) => option.source_name,
      },
      {
        name: "parties",
        label: "party",
        selectLabel: "select parties",
        url: "Parties",
      },
    ];

    return arrayOfApis.map((input) => (
      <SelectInputApi
        key={input.name}
        label={input.label}
        fetchData={input.fetchData ? input.fetchData : getInfinityFeatchApis}
        selectLabel={input.selectLabel}
        optionLabel={
          input.optionLabel ? input.optionLabel : (option) => option?.name
        }
        onChange={(option) => multiSelectInput(option, input.name)}
        onIgnore={(option) => ignoreMultiSelectInput(option, input.name)}
        url={input.url}
        isArray
        value={form[input.name]}
      />
    ));
  }, [form, multiSelectInput, ignoreMultiSelectInput]);

  const handleParentChange = useCallback(
    (name, option) => {
      const updated = { ...form };

      if (name === "cityId") {
        if (updated.streetId?.city?._id !== option._id) updated.streetId = "";
        if (updated.regionId?.city?._id !== option._id) updated.regionId = "";
        if (updated.villageId?.city?._id !== option._id) updated.villageId = "";

        const parentDataUpdate =
          option.parent === "Governorate"
            ? { governorateId: option.parentId, countyId: "" }
            : { countyId: option.parentId, governorateId: "" };

        updated.countryId = option.parentId?.country;
        Object.assign(updated, parentDataUpdate);
      } else {
        updated.cityId = option.city;

        if (updated.streetId?.city?._id !== option.city._id)
          updated.streetId = "";
        if (updated.regionId?.city?._id !== option.city._id)
          updated.regionId = "";
        if (updated.villageId?.city?._id !== option.city._id)
          updated.villageId = "";

        const parentDataUpdate =
          option.city.parent === "Governorate"
            ? { governorateId: option.city.parentId, countyId: "" }
            : { countyId: option.city.parentId, governorateId: "" };

        updated.countryId = option.city.parentId.country;
        Object.assign(updated, parentDataUpdate);
      }

      updated[name] = option;
      setForm(updated);
    },
    [form]
  );

  const addressesFApisForm = useMemo(() => {
    const arrayOfApis = [
      {
        name: "cityId",
        label: "city",
        url: "Cities",
      },
      {
        name: "streetId",
        label: "street",
        url: "Streets",
      },
      {
        name: "regionId",
        label: "region",
        url: "Regions",
      },
      {
        name: "villageId",
        label: "village",
        url: "Villages",
      },
    ];

    return arrayOfApis.map((input) => (
      <SelectInputApi
        key={input.name}
        fetchData={getInfinityFeatchApis}
        selectLabel={`select ${input.label}`}
        label={input.label}
        optionLabel={(option) => option?.name}
        onChange={(option) => handleParentChange(input.name, option)}
        value={form[input.name]?.name}
        onIgnore={() => setForm({ ...form, [input.name]: "" })}
        url={input.url}
      />
    ));
  }, [form, handleParentChange]);

  return (
    <>
      {responseOverlay && (
        <SendData
          data={language?.header?.information}
          response={response.current}
        />
      )}
      {loading && <Loading />}
      <h1 className="title"> {language?.header?.add_information}</h1>

      <form onSubmit={handleSubmit} className="dashboard-form">
        <div className="form">
          <h1>{language?.information?.information} </h1>
          <div className="flex wrap">
            <InputWithLabel
              label={language?.information?.subject}
              required
              value={form.subject}
              onChange={handleForm}
              placeholder={language?.information?.subject_placeholder}
              id="subject"
              rows={5}
              writebelType="textarea"
            />
            <InputWithLabel
              label={language?.information?.notes}
              value={form.note}
              onChange={handleForm}
              required
              placeholder={language?.information?.notes_placeholder}
              id="note"
              rows={5}
              writebelType="textarea"
            />
          </div>
        </div>

        <div className="form">
          <h1>{language?.information?.adress}</h1>
          <div className="flex wrap">
            {addressesFApisForm}

            <InputWithLabel
              label={language?.information?.extra_adress_details}
              value={form.addressDetails}
              onChange={handleForm}
              placeholder={
                language?.information?.extra_adress_details_placeholder
              }
              id="addressDetails"
              rows={4}
              writebelType="textarea"
            />
          </div>
        </div>

        <div className="form">
          <h1>{language?.information?.more_information}</h1>
          <div className="flex wrap">
            {context.userDetails.isAdmin && (
              <SelectInputApi
                fetchData={getInfinityFeatchApis}
                selectLabel="section"
                label="section"
                optionLabel={(option) => option?.name}
                onChange={(option) => setForm({ ...form, sectionId: option })}
                value={form.sectionId.name}
                onIgnore={() => setForm({ ...form, sectionId: "" })}
                url="Sections"
              />
            )}
            {multiSelectInputs}
            {credibilityOptions}
          </div>
        </div>

        <div className="form">
          <h1>
            <label htmlFor="details">{language?.information?.details}</label>
          </h1>
          <div className="flex wrap">
            <InputWithLabel
              value={form.details}
              required
              onChange={handleForm}
              placeholder={language?.information?.details_placeholder}
              id="details"
              rows={6}
              writebelType="textarea"
            />
          </div>
        </div>

        <div className="form">
          <h1>{language?.information?.files}</h1>
          <div>
            <div className="flex flex-direction">
              <label
                className="inp document gap-10 center"
                onDrop={(e) => {
                  e.preventDefault();
                  const files = Array.from(e.dataTransfer.files);
                  handleFiles(files);
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*, video/*, .mp3, .wav, .mpeg, .ogg, .flac, .aac, .pdf, .docx, .txt"
                  onInput={(e) => {
                    const files = Array.from(e.target.files);
                    handleFiles(files);
                  }}
                />
                {language?.information?.upload_files || "Upload Files"}
                <i className="fa-solid fa-file-upload"></i>
              </label>
            </div>
          </div>
        </div>

        {documents.image.length > 0 && (
          <DocumentsShow
            documents={{ documents, setDocuments }}
            title={language?.information?.images}
            data="image"
          />
        )}

        {documents.video.length > 0 && (
          <DocumentsShow
            documents={{ documents, setDocuments }}
            title={language?.information?.videos}
            data="video"
          />
        )}

        {documents.audio.length > 0 && (
          <DocumentsShow
            documents={{ documents, setDocuments }}
            title={language?.information?.audios}
            data="audio"
          />
        )}

        {uploadedFiles.list.length > 0 && (
          <DocumentsShow
            popup={{ setIsPopupOpen, isPopupOpen }}
            activeFile={{ activeFile, setActiveFile }}
            documents={{
              documents: uploadedFiles,
              setDocuments: setUploadedFiles,
            }}
            title={language?.information?.documents}
            data="list"
          />
        )}

        {isPopupOpen && activeFile && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>{language?.information?.preview_file}</h2>
              {activeFile.type === "text/plain" ||
              activeFile.type === "docx" ? (
                <div className="file-content">{activeFile.content}</div>
              ) : activeFile.type === "application/pdf" ? (
                <>
                  <iframe
                    src={activeFile.content}
                    title="PDF Preview"
                    width="100%"
                    height="500px"
                  ></iframe>
                  <a
                    href={activeFile.content}
                    download={activeFile.name}
                    target="_blank"
                    rel="noreferrer"
                    className="btn"
                  >
                    {language?.information?.open_in_browser}
                  </a>
                </>
              ) : null}
              <button onClick={() => setIsPopupOpen(false)}>
                {language?.information?.close}
              </button>
            </div>
          </div>
        )}

        {error && <p className="error"> {error} </p>}
        <button className="btn">{language?.information?.save}</button>
      </form>
    </>
  );
};

export default AddInformation;
