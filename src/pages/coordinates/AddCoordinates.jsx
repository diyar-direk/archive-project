import React, { useContext, useRef, useState } from "react";
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

  const [form, setForm] = useState({
    countryId: "",
    governmentId: "",
    cityId: "",
    note: "",
    coordinates: "",
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
            <div className="flex flex-direction">
              <label htmlFor="coordinates">coordinates</label>

              <div className="flex gap-20">
                <input
                  required
                  type="text"
                  id="coordinates"
                  className="inp"
                  value={form.coordinates}
                  placeholder="ex: 37sFB 9817 703298"
                />
                <input
                  required
                  type="text"
                  id="coordinates"
                  className="inp"
                  value={form.coordinates}
                  placeholder="ex: 37sFB 9817 703298"
                />
                <input
                  required
                  type="text"
                  id="coordinates"
                  className="inp"
                  value={form.coordinates}
                  placeholder="ex: 37sFB 9817 703298"
                />
                <input
                  required
                  type="text"
                  id="coordinates"
                  className="inp"
                  value={form.coordinates}
                  placeholder="ex: 37sFB 9817 703298"
                />
                <input
                  required
                  type="text"
                  id="coordinates"
                  className="inp"
                  value={form.coordinates}
                  placeholder="ex: 37sFB 9817 703298"
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
