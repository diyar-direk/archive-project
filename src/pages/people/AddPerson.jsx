import { useCallback, useContext, useMemo, useRef, useState } from "react";
import "../../components/form/form.css";
import { baseURL, Context } from "../../context/context";
import axios from "axios";
import SendData from "../../components/response/SendData";
import Loading from "../../components/loading/Loading";
import useLanguage from "../../hooks/useLanguage";
import SelectInputApi from "../../components/inputs/SelectInputApi";
import { getInfinityFeatchApis } from "../../infintyFeatchApis";
import InputWithLabel from "../../components/inputs/InputWithLabel";
import SelectOptionInput from "../../components/inputs/SelectOptionInput";

const AddPerson = () => {
  const [loading, setLoading] = useState(false);

  const context = useContext(Context);
  const token = context.userDetails.token;

  const { language } = useLanguage();

  const [error, setError] = useState(false);

  const [form, setForm] = useState({
    //personal data
    image: "",
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
    governorateId: "",
    countyId: "",
    cityId: "",
    villageId: "",
    regionId: "",
    streetId: "",
    addressDetails: "",
    email: "",
    phone: "",
    sectionId: context?.userDetails?.sectionId || "",
    //categories data
    sources: "",
  });

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
    else if (!form.sectionId) setError(language?.error?.please_selecet_section);
    else if (!form.sources) setError(language?.error?.please_selecet_source);
    else {
      setLoading(true);
      const keys = Object.keys(form);
      const formData = new FormData();

      keys.forEach((key) => {
        if (form[key]) {
          formData.append(
            `${key}`,
            form[key]?._id ? form[key]?._id : form[key]
          );
        }
      });

      try {
        const data = await axios.post(`${baseURL}/people`, formData, {
          headers: { Authorization: "Bearer " + token },
          onUploadProgress: (progress) => {
            const persent =
              Math.floor((progress.loaded * 100) / progress.total) + "%";
            document.querySelector("div.loading.overlay >h1").innerHTML =
              persent;
          },
        });
        if (data.status === 201) {
          responseFun(true);
          setForm({
            //personal data
            image: "",
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
            governorateId: "",
            countyId: "",
            cityId: "",
            villageId: "",
            regionId: "",
            streetId: "",
            addressDetails: "",
            email: "",
            phone: "",
            sectionId: context?.userDetails?.sectionId || "",
            //categories data
            sources: "",
          });
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

  const handleParentChange = useCallback(
    (name, option) => {
      const updated = { ...form };

      if (name === "countryId") {
        if (updated.countyId?.country !== option._id) updated.countyId = "";
        if (updated.governorateId?.country !== option._id)
          updated.governorateId = "";
        if (updated.cityId?.country !== option._id) updated.cityId = "";
        updated.streetId = "";
        updated.regionId = "";
        updated.villageId = "";
      }

      if (name === "countyId") {
        if (updated.cityId?.county !== option._id) updated.cityId = "";
        updated.streetId = "";
        updated.regionId = "";
        updated.villageId = "";
        updated.countryId = option.country;
      }

      if (name === "governorateId") {
        if (updated.cityId?.governorate !== option._id) updated.cityId = "";
        updated.streetId = "";
        updated.regionId = "";
        updated.villageId = "";
        updated.countryId = option.country;
      }

      if (name === "cityId") {
        if (updated.streetId?.city !== option._id) updated.streetId = "";
        if (updated.regionId?.city !== option._id) updated.regionId = "";
        if (updated.villageId?.city !== option._id) updated.villageId = "";
        const parentDataUpdate =
          option.parent === "Governorate"
            ? { governorateId: option.parentId, countyId: "" }
            : { countyId: option.parentId, governorateId: "" };
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
        name: "countryId",
        label: "country",
        onChange: (option) => handleParentChange("countryId", option),
        url: "Countries",
      },
      {
        name: "countyId",
        label: "county",
        onChange: (option) => handleParentChange("countyId", option),
        url: "Counties",
      },
      {
        label: "Government",
        name: "governorateId",
        onChange: (option) => handleParentChange("governorateId", option),
        url: "Governorates",
      },
      {
        name: "cityId",
        label: "city",
        onChange: (option) => handleParentChange("cityId", option),
        url: "Cities",
      },
      {
        name: "streetId",
        label: "street",
        onChange: (option) =>
          setForm((prev) => ({
            ...prev,
            streetId: option,
          })),
        url: "Streets",
      },
      {
        name: "regionId",
        label: "region",
        onChange: (option) =>
          setForm((prev) => ({
            ...prev,
            regionId: option,
          })),
        url: "Regions",
      },
      {
        name: "villageId",
        label: "village",
        onChange: (option) =>
          setForm((prev) => ({
            ...prev,
            villageId: option,
          })),
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
        onChange={input.onChange}
        value={form[input.name]?.name}
        onIgnore={() => setForm({ ...form, [input.name]: "" })}
        url={input.url}
      />
    ));
  }, [form, handleParentChange]);

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

  return (
    <>
      {responseOverlay && (
        <SendData data={language?.header?.person} response={response.current} />
      )}
      {loading && <Loading />}
      <h1 className="title">{language?.header?.add_person}</h1>
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
              <img
                alt="profile"
                loading="lazy"
                src={URL.createObjectURL(form.image)}
              />
            )}
          </label>
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
                selectLabel="section"
                label="section"
                optionLabel={(option) => option?.name}
                onChange={(option) => setForm({ ...form, sectionId: option })}
                value={form.sectionId.name}
                onIgnore={() => setForm({ ...form, sectionId: "" })}
                url="Sections"
              />
            )}
            <SelectInputApi
              fetchData={getInfinityFeatchApis}
              selectLabel="select source"
              label="source"
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
    </>
  );
};

export default AddPerson;
