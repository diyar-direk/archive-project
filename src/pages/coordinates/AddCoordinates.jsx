import { useCallback, useContext, useMemo, useRef, useState } from "react";
import "../../components/form/form.css";
import Loading from "../../components/loading/Loading";
import SendData from "../../components/response/SendData";
import axios from "axios";
import { baseURL, Context } from "../../context/context";
import useLanguage from "../../hooks/useLanguage";
import SelectInputApi from "../../components/inputs/SelectInputApi";
import InputWithLabel from "../../components/inputs/InputWithLabel";
import { getInfinityFeatchApis } from "../../utils/infintyFeatchApis";

const AddCoordinates = () => {
  const context = useContext(Context);
  const token = context.userDetails.token;
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const response = useRef(true);
  const [responseOverlay, setResponseOverlay] = useState(false);

  const responseFun = (complete = false) => {
    complete === true
      ? (response.current = true)
      : complete === "reapeted data"
      ? (response.current = 400)
      : complete === "Invalid coordinates"
      ? (response.current = "Invalid coordinates")
      : (response.current = false);
    setResponseOverlay(true);
    window.onclick = () => {
      setResponseOverlay(false);
    };
    setTimeout(() => {
      setResponseOverlay(false);
    }, 3000);
  };

  const [coordinates, setCoordinates] = useState({
    firstNumber: "",
    firstLetter: "S",
    secondLetter: "",
    secondNumber: "",
    thirdNumber: "",
  });

  const [form, setForm] = useState({
    countryId: "",
    governmentId: "",
    cityId: "",
    note: "",
    streetId: "",
    regionId: "",
    villageId: "",
    sources: "",
    sectionId: context.userDetails.sectionId || "",
  });
  const { language } = useLanguage();

  const handleSubmit = async (e) => {
    const coordinants = `${coordinates.firstNumber}${coordinates.firstLetter} ${
      coordinates.secondLetter
    } ${formatCoordinates(coordinates.secondNumber)} ${formatCoordinates(
      coordinates.thirdNumber
    )}`;

    const formData = {
      ...form,
      coordinates: coordinants,
    };

    e.preventDefault();

    if (!form.countryId) setError(language?.error?.select_country);
    else if (!form.governmentId) setError(language?.error?.select_government);
    else if (!form.cityId) setError(language?.error?.please_selecet_city);
    else if (!form.sectionId) setError(language?.error?.please_selecet_section);
    else if (!formData.sources)
      setError(language?.error?.please_selecet_source);
    else {
      setLoading(true);
      const keys = Object.keys(formData);
      const data = { ...formData };
      keys.forEach((key) => {
        data[key]
          ? (data[key] = data[key]?._id ? data[key]?._id : data[key])
          : (data[key] = null);
      });

      try {
        const res = await axios.post(`${baseURL}/Coordinates`, data, {
          headers: { Authorization: "Bearer " + token },
        });
        if (res.status === 201) {
          responseFun(true);
          setForm({
            countryId: "",
            governmentId: "",
            cityId: "",
            note: "",
            streetId: "",
            regionId: "",
            villageId: "",
            sources: "",
            sectionId: context.userDetails.sectionId || "",
          });
          setCoordinates({
            firstNumber: "",
            firstLetter: "S",
            secondLetter: "",
            secondNumber: "",
            thirdNumber: "",
          });
        }
      } catch (error) {
        console.log(error);
        if (error.status === 400) responseFun("reapeted data");
        else if (error) responseFun("Invalid coordinates");
        else responseFun(false);
      } finally {
        setLoading(false);
      }
    }
  };
  const handleForm = (e) => {
    const { id, value, maxLength } = e.target;

    const updatedValue = isNaN(value) ? value.toUpperCase() : value;

    if (value.length > maxLength) return;

    if (error) setError(false);

    setCoordinates((prev) => ({ ...prev, [id]: updatedValue }));

    if (value.length === maxLength) {
      let nextInput = e.target.nextElementSibling;

      while (nextInput && nextInput.tagName !== "INPUT") {
        nextInput = nextInput.nextElementSibling;
      }

      nextInput && nextInput.focus();
    }
  };

  const callBack = useMemo(() => {
    const vaildLetter = [
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "J",
      "K",
      "L",
      "M",
      "N",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
    ];

    const options = vaildLetter.map((e, i) => (
      <option key={e} value={e}>
        {e}
      </option>
    ));

    return options;
  }, []);

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
          data={language?.header?.coordinates}
          response={response.current}
        />
      )}
      {loading && <Loading />}
      <form onSubmit={handleSubmit} className="dashboard-form">
        <h1 className="title">{language?.coordinates?.add_coordinates}</h1>
        <div className="form">
          <div className="flex wrap">
            <div className="flex coordinates flex-direction">
              <label htmlFor="firstNumber">MGRS coordinates</label>

              <div className="flex wrap gap-20">
                <input
                  required
                  maxLength={2}
                  type="number"
                  id="firstNumber"
                  className="inp"
                  placeholder="ex: 37"
                  value={coordinates.firstNumber}
                  onInput={handleForm}
                />
                <select
                  onChange={(e) =>
                    setCoordinates({
                      ...coordinates,
                      firstLetter: e.target.value,
                    })
                  }
                  className="inp"
                  value={coordinates.firstLetter}
                >
                  {callBack}
                </select>
                <input
                  required
                  maxLength={2}
                  value={coordinates.secondLetter}
                  onInput={handleForm}
                  type="text"
                  id="secondLetter"
                  className="inp"
                  placeholder="ex: FB"
                />
                <input
                  required
                  maxLength={5}
                  value={coordinates.secondNumber}
                  onInput={handleForm}
                  type="number"
                  id="secondNumber"
                  className="inp"
                  placeholder="ex: 09523"
                />
                <input
                  required
                  maxLength={5}
                  value={coordinates.thirdNumber}
                  onInput={handleForm}
                  type="number"
                  id="thirdNumber"
                  className="inp"
                  placeholder="ex: 0964"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="form">
          <h1>{language?.coordinates?.adress}</h1>
          <div className="flex wrap">{addressesFApisForm}</div>
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

        <div className="form">
          <div className="flex wrap">
            <InputWithLabel
              label={language?.coordinates?.notes}
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder={language?.coordinates?.notes_placeholder}
              id="note"
              rows={5}
              writebelType="textarea"
            />
          </div>
        </div>
        {error && <p className="error">{error}</p>}
        <button className="btn">{language?.coordinates?.save}</button>
      </form>
    </>
  );
};

export default AddCoordinates;

export const formatCoordinates = (coordinates) =>
  coordinates.length < 5
    ? (coordinates = coordinates.padEnd(5, "0"))
    : coordinates;
