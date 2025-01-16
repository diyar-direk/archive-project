import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import FormSelect from "../../components/form/FormSelect";
import Loading from "../../components/loading/Loading";
import SendData from "../../components/response/SendData";
import axios from "axios";
import { baseURL } from "../../context/context";

const MapClickHandler = ({ setCoordinates }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      setCoordinates({ lat, lng });
    },
  });

  return null;
};

const AddCoordinates = () => {
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
    streetId: "",
    regionId: "",
    villageId: "",
    sources: "",
    sectionId: "",
  });
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  useEffect(() => {
    error && setError(false);
  }, [coordinates]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coordinates) setError("please select cordinats");
    else if (!form.countryId) setError("please select country");
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
      data.coordinates = `${parseFloat(coordinates.lat)},${parseFloat(
        coordinates.lng
      )}`;

      try {
        const res = await axios.post(`${baseURL}/Coordinates`, data);
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
            sectionId: "",
          });
          setCoordinates({ lat: null, lng: null });
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
          <div>
            <h2>Click on the Map to Get Coordinates</h2>
            <h3>Latitude: {coordinates.lat}</h3>
            <h3>Longitude: {coordinates.lng}</h3>

            <MapContainer
              center={[51.505, -0.09]}
              zoom={13}
              style={{ height: "400px", width: "100%", zIndex: 1 }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapClickHandler setCoordinates={setCoordinates} />
            </MapContainer>
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
