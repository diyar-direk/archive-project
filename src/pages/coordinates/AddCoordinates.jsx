import React, { useCallback, useContext, useRef, useState } from "react";
import "../../components/form/form.css";
import FormSelect from "../../components/form/FormSelect";
import Loading from "../../components/loading/Loading";
import SendData from "../../components/response/SendData";
import axios from "axios";
import { baseURL, Context } from "../../context/context";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.countryId) setError("please select country");
    else if (!form.cityId) setError("please select city");
    else if (!form.governmentId) setError("please select government");
    else if (!form.sectionId) setError("please select scetion");
    else if (!form.sources) setError("please select scetion");
    else {
      setLoading(true);
      const keys = Object.keys(form);
      const data = { ...form };
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
  const handleForm = (e) => {
    const { id, value } = e.target;
    error && setError(false);
    setCoordinates({ ...coordinates, [id]: value });
  };

  const callBack = useCallback(() => {
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

  return (
    <>
      {responseOverlay && (
        <SendData data={`person`} response={response.current} />
      )}
      {loading && <Loading />}
      <form onSubmit={handleSubmit} className="dashboard-form">
        <h1 className="title">Add Coordinates</h1>
        <div className="form">
          <div className="flex wrap">
            <div className="flex coordinates flex-direction">
              <label htmlFor="firstNumber">MGRS coordinates</label>

              <div className="flex wrap gap-20">
                <input
                  required
                  min={0}
                  max={99}
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
                  {callBack()}
                </select>
                <input
                  required
                  minLength={1}
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
                  min={1}
                  max={99999}
                  value={coordinates.secondNumber}
                  onInput={handleForm}
                  type="number"
                  id="secondNumber"
                  className="inp"
                  placeholder="ex: 09523"
                />
                <input
                  required
                  min={1}
                  max={99999}
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
          </div>
        </div>
        <div className="form">
          <h1>more informations</h1>
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

        <div className="form">
          <div className="flex wrap">
            <div className="flex flex-direction">
              <label htmlFor="note">note</label>
              <textarea
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className="inp"
                placeholder="test"
                id="note"
                rows={5}
              ></textarea>
            </div>
          </div>
        </div>
        {error && <p className="error">{error}</p>}
        <button className="btn">save</button>
      </form>
    </>
  );
};

export default AddCoordinates;
