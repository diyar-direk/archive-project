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
import { getCoordsApi, getPeopleApi } from "../people/api";
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
    people: [],
    coordinates: [],
    subject: "",
    note: "",
    opinion: "",
    suggestion: "",
    details: "",
    date: "",
    sectionId: context.userDetails.sectionId || "",
    departmentId: "",
    cityId: "",
    countryId: "",
    governmentId: "",
    regionId: "",
    villageId: "",
    streetId: "",
    addressDetails: "",
    credibility: "",
    sources: "",
    events: "",
    parties: "",
  });
  const [newCoords, setNewCorrds] = useState("");

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
    else if (!form.departmentId)
      setError(language?.error?.please_selecet_department);
    else if (!form.sources) setError(language?.error?.please_selecet_source);
    else if (!form.credibility)
      setError(language?.error?.please_selecet_credibility);
    else {
      setLoading(true);

      const coordsList = parseMGRSCoordinates(newCoords);

      const promises = coordsList.map(async (coordObj) => {
        try {
          const res = await axios.post(`${baseURL}/Coordinates`, coordObj, {
            headers: { Authorization: "Bearer " + token },
          });
          return { success: true, data: res.data.data };
        } catch (err) {
          if (err.response?.status === 400 || err.response?.status === 409) {
            try {
              const res = await axios.get(
                `${baseURL}/Coordinates?active=true&search=${coordObj.coordinates}`,
                { headers: { Authorization: "Bearer " + token } }
              );
              return { success: true, data: res.data.data[0] };
            } catch (getErr) {
              return {
                success: false,
                data: coordObj,
                code: getErr.response?.status,
              };
            }
          }
          return {
            success: false,
            data: coordObj,
            code: err.response?.status,
          };
        }
      });

      const results = await Promise.all(promises);

      const success = results.filter((r) => r.success).map((r) => r.data);

      const keys = Object.keys(form);
      const formData = {
        ...form,
        coordinates: [...form?.coordinates, ...success],
      };

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
          imagesDoc.append("parentModel", "SecurityInformation");
          imagesDoc.append("parentId", id);
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
          videosDoc.append("parentModel", "SecurityInformation");
          videosDoc.append("parentId", id);
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
          audioDoc.append("parentModel", "SecurityInformation");
          audioDoc.append("parentId", id);
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
          documentDoc.append("parentModel", "SecurityInformation");
          documentDoc.append("parentId", id);
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
            people: [],
            date: "",
            coordinates: [],
            subject: "",
            note: "",
            details: "",
            sectionId: context.userDetails.sectionId || "",
            departmentId: "",
            cityId: "",
            countryId: "",
            governmentId: "",
            regionId: "",
            villageId: "",
            streetId: "",
            addressDetails: "",
            credibility: "",
            sources: "",
            events: "",
            parties: "",
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
        placeholder: `${language?.information?.select_credibility}`,
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
        value={
          form[input.name] && language?.enums?.credibility[form[input.name]]
        }
        onIgnore={() => setForm({ ...form, [input.name]: "" })}
        options={input.options}
      />
    ));
  }, [language, form]);

  const multiSelectInputs = useMemo(() => {
    const arrayOfApis = [
      {
        name: "people",
        label: language?.information?.people,
        selectLabel: language?.information?.select_people,
        optionLabel: (option) => {
          return `${option?.firstName} ${option?.surName}`;
        },
        fetchData: getPeopleApi,
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
  }, [form, multiSelectInput, ignoreMultiSelectInput, language]);

  const categoriesInputs = useMemo(() => {
    const inputs = [
      {
        name: "events",
        label: language?.information?.event,
        selectLabel: language?.information?.select_event,
        url: "Events",
      },
      {
        name: "sources",
        label: language?.information?.source,
        selectLabel: language?.information?.select_source,
        url: "Sources",
        optionLabel: (option) => option.source_name,
        value: form.sources?.source_name,
      },
      {
        name: "parties",
        label: language?.information?.party,
        selectLabel: language?.information?.select_party,
        url: "Parties",
      },
    ];
    return inputs.map((input) => (
      <SelectInputApi
        key={input.name}
        fetchData={getInfinityFeatchApis}
        selectLabel={input.selectLabel}
        label={input.label}
        optionLabel={
          input.optionLabel ? input.optionLabel : (option) => option?.name
        }
        onChange={(option) => setForm({ ...form, [input.name]: option })}
        value={input.value || form[input.name]?.name}
        onIgnore={() => setForm({ ...form, [input.name]: "" })}
        url={input.url}
      />
    ));
  }, [language, form]);

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
        label: language?.coordinates?.city,
        selectLabel: language?.coordinates?.select_city,
        url: "Cities",
      },
      {
        name: "streetId",
        label: language?.coordinates?.street,
        selectLabel: language?.coordinates?.select_street,
        url: "Streets",
      },
      {
        name: "regionId",
        label: language?.coordinates?.region,
        selectLabel: language?.coordinates?.select_region,
        url: "Regions",
      },
      {
        name: "villageId",
        label: language?.coordinates?.village,
        selectLabel: language?.coordinates?.select_village,
        url: "Villages",
      },
    ];

    return arrayOfApis.map((input) => (
      <SelectInputApi
        key={input.name}
        fetchData={getInfinityFeatchApis}
        selectLabel={input.selectLabel}
        label={input.label}
        optionLabel={(option) => option?.name}
        onChange={(option) => handleParentChange(input.name, option)}
        value={form[input.name]?.name}
        onIgnore={() => setForm({ ...form, [input.name]: "" })}
        url={input.url}
      />
    ));
  }, [form, handleParentChange, language]);

  function parseMGRSCoordinates(input) {
    if (!input) return [];

    return input
      .split(/[,|\-|\n]/)
      .map((coord) => coord.trim().replace(/\s+/g, ""))
      .filter((coord) => coord.length > 0)
      .map((coordinates) => ({
        coordinates,
        sectionId: form.sectionId?._id,
        sources: form.sources?._id,
      }));
  }

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
                selectLabel={language?.coordinates?.select_section}
                label={language?.coordinates?.section}
                optionLabel={(option) => option?.name}
                onChange={(option) => setForm({ ...form, sectionId: option })}
                value={form.sectionId.name}
                onIgnore={() => setForm({ ...form, sectionId: "" })}
                url="Sections"
              />
            )}
            <SelectInputApi
              fetchData={getInfinityFeatchApis}
              selectLabel={language?.information?.select_department}
              label={language?.information?.department}
              optionLabel={(option) => option?.name}
              onChange={(option) => setForm({ ...form, departmentId: option })}
              value={form.departmentId.name}
              onIgnore={() => setForm({ ...form, departmentId: "" })}
              url="Departments"
            />
            {multiSelectInputs}
            <InputWithLabel
              label={language?.information?.date}
              value={form.date}
              onChange={handleForm}
              id="date"
              type="date"
            />
            {credibilityOptions}
            {categoriesInputs}
            <SelectInputApi
              label={language?.information?.coordinates}
              fetchData={getCoordsApi}
              selectLabel={language?.information?.select_coordinates}
              optionLabel={(option) => {
                return `${option?.coordinates}`;
              }}
              onChange={(option) => multiSelectInput(option, "coordinates")}
              onIgnore={(option) =>
                ignoreMultiSelectInput(option, "coordinates")
              }
              isArray
              value={form?.coordinates}
            />
            <InputWithLabel
              label={language?.information?.coordinates}
              placeholder={language.information?.coordinate_placeholder}
              value={newCoords}
              onChange={(e) => setNewCorrds(e.target.value)}
              id="newCoords"
              rows={6}
              writebelType="textarea"
            />
          </div>
        </div>

        <div className="form">
          <h1>{language?.information?.details_placeholder}</h1>
          <div className="flex wrap">
            <InputWithLabel
              label={language?.information?.opinion}
              placeholder={language?.information?.opinion_placeholder}
              value={form.opinion}
              onChange={handleForm}
              id="opinion"
              rows={6}
              writebelType="textarea"
            />
          </div>
          <div className="flex wrap">
            <InputWithLabel
              label={language?.information?.suggestion}
              placeholder={language?.information?.suggestion_placeholder}
              value={form.suggestion}
              onChange={handleForm}
              id="suggestion"
              rows={6}
              writebelType="textarea"
            />
            <InputWithLabel
              label={language?.information?.details}
              placeholder={language?.information?.details_placeholder}
              value={form.details}
              onChange={handleForm}
              id="details"
              rows={6}
              writebelType="textarea"
              required
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
