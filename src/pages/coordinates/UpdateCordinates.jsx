import React, { useContext, useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import FormSelect from "../../components/form/FormSelect";
import Loading from "../../components/loading/Loading";
import SendData from "../../components/response/SendData";
import axios from "axios";
import { baseURL } from "../../context/context";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { Context } from "./../../context/context";
import L from "leaflet";
const MapClickHandler = ({ setCoordinates }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      setCoordinates({ lat, lng });
    },
  });

  return null;
};

const UpdateCoordinates = () => {
  const context = useContext(Context);
  const token = context.userDetails.token;
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLloading, setDataLoading] = useState(true);
  const nav = useNavigate();

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

  const [form, setForm] = useState({});
  const { id } = useParams();
  useEffect(() => {
    getData();
  }, [id]);
  async function getData() {
    !dataLloading && setDataLoading(true);
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
      const coordinat = data.data.data.coordinates.split(",");

      setCoordinates({ lat: coordinat[0], lng: coordinat[1] });
    } catch (error) {
      console.log(error);
      (error.status === 500 || error.status === 404) &&
        nav(`/dashboard/error-404`);
      error.status === 403 && nav(`/dashboard/error-403`);
    } finally {
      setDataLoading(false);
    }
  }
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
  const customIcon = L.icon({
    iconUrl: require("./icons8-location-pin-48.png"),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  });
  return (
    <>
      {responseOverlay && (
        <SendData data={`person`} response={response.current} />
      )}
      {loading && <Loading />}
      {dataLloading ? (
        <Skeleton width={"100%"} height={"400px"} />
      ) : (
        <form onSubmit={handleSubmit} className="dashboard-form">
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
                {coordinates?.lat && coordinates?.lng && (
                  <Marker
                    position={[coordinates?.lat, coordinates?.lng]}
                    icon={customIcon}
                  />
                )}
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
      )}
    </>
  );
};

export default UpdateCoordinates;
