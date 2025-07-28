import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "../../components/form/form.css";
import { baseURL } from "../../context/context";
import axios from "axios";
import SendData from "../../components/response/SendData";
import Loading from "../../components/loading/Loading";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { Context } from "./../../context/context";
import MediaComponent from "../../components/MediaComponent";
import useLanguage from "../../hooks/useLanguage";
import InputWithLabel from "../../components/inputs/InputWithLabel";
import SelectOptionInput from "../../components/inputs/SelectOptionInput";
import SelectInputApi from "../../components/inputs/SelectInputApi";
import { getInfinityFeatchApis } from "../../utils/infintyFeatchApis";
const UpdatePerson = () => {
  const [loading, setLoading] = useState(false);
  const context = useContext(Context);
  const token = context.userDetails.token;

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
          nav("/not-found-404");
          return;
        }

        setForm({
          ...res.data.data,
          birthDate: res.data.data.birthDate.split("T")[0],
        });
      })
      .catch((err) => {
        console.log(err);
        if (err.status === 500 || err.status === 404) nav("/error-404");
        err.status === 403 && nav(`/error-403`);
      })
      .finally(() => setDataLoading(false));
  }, []);

  const handleForm = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
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
        if (data.status === 200) nav("/people");
      } catch (error) {
        console.log(error);
        responseFun(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const optionInputs = useMemo(() => {
    const arrayOfOptionsInput = [
      {
        name: "gender",
        label: language?.people?.gender,
        placeholder: language?.people?.select_gender,
        options: [
          {
            onSelectOption: () => setForm({ ...form, gender: "Male" }),
            text: language?.people?.male,
          },
          {
            text: language?.people?.female,
            onSelectOption: () => setForm({ ...form, gender: "Female" }),
          },
        ],
      },
      {
        name: "maritalStatus",
        label: language?.people?.marital_status,
        placeholder: language?.people?.select_marital_status,
        options: [
          {
            onSelectOption: () =>
              setForm({ ...form, maritalStatus: "Married" }),
            text: language?.people?.married,
          },
          {
            text: language?.people?.single,
            onSelectOption: () => setForm({ ...form, maritalStatus: "Single" }),
          },
          {
            text: language?.people?.other,
            onSelectOption: () => setForm({ ...form, maritalStatus: "Other" }),
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

        updated.countryId = option.country?._id;
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

        updated.countryId = option.city.country?._id;
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
              <InputWithLabel
                label={language?.people?.first_name}
                placeholder={language?.people?.first_name_placeholder}
                required
                id="firstName"
                value={form.firstName}
                onChange={handleForm}
              />
              <InputWithLabel
                label={language?.people?.father_name}
                required
                value={form.fatherName}
                onChange={handleForm}
                id="fatherName"
                placeholder={language?.people?.father_name_placeholder}
              />
              <InputWithLabel
                label={language?.people?.last_name}
                value={form.surName}
                onChange={handleForm}
                required
                id="surName"
                placeholder={language?.people?.last_name_placeholder}
              />

              {optionInputs}

              <InputWithLabel
                label={language?.people?.motherName}
                value={form.motherName}
                onChange={handleForm}
                required
                id="motherName"
                placeholder={language?.people?.motherName_placeholder}
              />
              <InputWithLabel
                label={language?.people?.date_of_birth}
                value={form.birthDate}
                onChange={handleForm}
                required
                type="date"
                id="birthDate"
              />
              <InputWithLabel
                label={language?.people?.place_of_birth}
                required
                value={form.placeOfBirth}
                onChange={handleForm}
                id="placeOfBirth"
                placeholder={language?.people?.place_of_birth_placeholder}
              />
              <InputWithLabel
                label={language?.people?.occupation}
                value={form.occupation}
                onChange={handleForm}
                required
                id="occupation"
                placeholder={language?.people?.occupation_placeholder}
              />
            </div>
          </div>

          <div className="form">
            <h1>{language?.people?.adress_information}</h1>
            <div className="flex wrap">
              {addressesFApisForm}
              <InputWithLabel
                label={language?.people?.extra_adress_details}
                value={form.addressDetails}
                onChange={handleForm}
                placeholder={language?.people?.extra_adress_details_placeholder}
                id="addressDetails"
                rows={4}
                writebelType="textarea"
              />
            </div>
          </div>

          <div className="form">
            <h1>contact informations</h1>
            <div className="flex wrap">
              <InputWithLabel
                label={language?.people?.phone}
                required
                value={form.phone}
                onChange={handleForm}
                id="phone"
                placeholder={language?.people?.phone_placeholder}
              />
              <InputWithLabel
                label={language?.people?.email}
                value={form.email}
                onChange={handleForm}
                type="email"
                id="email"
                placeholder={language?.people?.email_placeholder}
              />
            </div>
          </div>

          <div className="form">
            <h1>{language?.people?.more_information}</h1>
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
                selectLabel={language?.coordinates?.select_source}
                label={language?.coordinates?.source}
                optionLabel={(option) => option?.source_name}
                onChange={(option) => setForm({ ...form, sources: option })}
                value={form.sources.source_name}
                onIgnore={() => setForm({ ...form, sources: "" })}
                url="Sources"
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
