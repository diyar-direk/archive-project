import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import "../../components/form/form.css";
import FormSelect from "../../components/form/FormSelect";
import Loading from "../../components/loading/Loading";
import SendData from "../../components/response/SendData";
import axios from "axios";
import { baseURL, Context } from "../../context/context";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

const UpdateCoordinates = () => {
  const context = useContext(Context);
  const token = context.userDetails.token;
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
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

  const nav = useNavigate();

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

  const { id } = useParams();
  useEffect(() => {
    getData();
  }, [id]);

  async function getData() {
    !dataLoading && setDataLoading(true);
    try {
      const data = await axios.get(`${baseURL}/Coordinates/${id}`, {
        headers: { Authorization: "Bearer " + token },
      });
      if (
        context.userDetails.role === "user" &&
        context.userDetails.sectionId !== data.data.data.sectionId._id
      ) {
        nav("/dashboard/not-found-404");
        return;
      }
      setForm(data.data.data);

      const coordinat = data.data.data.coordinates.split(" ");
      const firstNumber = coordinat[0]
        ?.split("")
        ?.filter((e) => !isNaN(e))
        .join("");
      const firstLetter = coordinat[0]
        ?.split("")
        ?.filter((e) => isNaN(e))
        .join("");
      const secondLetter = coordinat[1];
      const secondNumber = coordinat[2];
      const thirdNumber = coordinat[3];
      setCoordinates({
        firstNumber,
        firstLetter,
        secondLetter,
        secondNumber,
        thirdNumber,
      });
    } catch (error) {
      console.log(error);
      (error.status === 500 || error.status === 404) &&
        nav(`/dashboard/error-404`);
      error.status === 403 && nav(`/dashboard/error-403`);
    } finally {
      setDataLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      ...form,
      coordinates: `${coordinates.firstNumber}${coordinates.firstLetter} ${coordinates.secondLetter} ${coordinates.secondNumber} ${coordinates.thirdNumber}`,
    };

    if (!formData.countryId) setError("please select country");
    else if (!formData.cityId) setError("please select city");
    else if (!formData.governmentId) setError("please select government");
    else if (!formData.sectionId) setError("please select scetion");
    else if (!formData.sources) setError("please select scetion");
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
        const res = await axios.patch(`${baseURL}/Coordinates/${id}`, data, {
          headers: { Authorization: "Bearer " + token },
        });
        if (res.status === 200) nav("/dashboard/coordinates");
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
    const { id, value, maxLength } = e.target;

    const updatedValue = isNaN(value) ? value.toUpperCase() : value;

    if (value?.length > maxLength) return;

    if (error) setError(false);

    setCoordinates((prev) => ({ ...prev, [id]: updatedValue }));

    if (value?.length === maxLength) {
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

  return (
    <>
      {responseOverlay && (
        <SendData data={`person`} response={response.current} />
      )}
      {loading && <Loading />}
      {dataLoading ? (
        <Skeleton height={"400px"} width={"100%"} />
      ) : (
        <form onSubmit={handleSubmit} className="dashboard-form">
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
                  value={form.note ? form.note : ""}
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
      )}
    </>
  );
};

export default UpdateCoordinates;
