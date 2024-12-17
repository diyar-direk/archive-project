import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./profile.css";
import axios from "axios";
import { baseURL, date } from "../../context/context";
const Profile = () => {
  const { id } = useParams();
  const [data, setData] = useState("");

  useEffect(() => {
    axios
      .get(`${baseURL}/people/${id}`)
      .then((res) => setData(res.data.data))
      .catch((err) => console.log(err));
  }, []);
  const [image, setImage] = useState(false);

  return (
    <>
      <div className="profile wrap flex">
        <div className="image center flex-direction">
          <div className="w-100">
            <h3>
              {data?.firstName} {data?.fatherName} {data?.surName}
            </h3>
            {!data?.image && !image && (
              <i className="photo w-100 fa-solid fa-user"></i>
            )}
            {(data?.image || image) && (
              <img
                src={
                  image
                    ? URL.createObjectURL(image)
                    : `https://localhost:8000${data?.image}`
                }
                alt="profile"
                className="photo w-100"
              />
            )}
          </div>
          <div className="flex center gap-10 w-100 wrap">
            <label htmlFor="file" className="center gap-10">
              <input
                onInput={(e) => setImage(e.target.files[0])}
                type="file"
                id="file"
                accept="image/*"
              />
              update
              <i className="fa-regular fa-pen-to-square"></i>
            </label>
            {image && <button className="btn">save</button>}
          </div>
        </div>

        <div className="info">
          <div className="flex">
            <h2>name</h2>
            <p>
              {data?.firstName} {data?.fatherName} {data?.surName}
            </p>
          </div>
          <div className="flex">
            <h2>place and date of birth</h2>
            <p>
              {data?.placeOfBirth} {data?.birthDate && date(data?.birthDate)}
            </p>
          </div>
          <div className="flex">
            <h2>gender</h2>
            <p>{data?.gender}</p>
          </div>
          <div className="flex">
            <h2>maritalStatus</h2>
            <p>{data?.maritalStatus}</p>
          </div>
          <div className="flex">
            <h2>occupation</h2>
            <p>{data?.occupation}</p>
          </div>
          <div className="flex">
            <h2>mother name</h2>
            <p> {data?.motherName} </p>
          </div>
          <div className="flex">
            <h2>country</h2>
            <p> {data?.countryId?.name} </p>
          </div>
          <div className="flex">
            <h2>city</h2>
            <p> {data?.cityId?.name} </p>
          </div>
          <div className="flex">
            <h2>street</h2>
            <p> {data?.streetId?.name} </p>
          </div>
          <div className="flex">
            <h2>region</h2>
            <p> {data?.regionId?.name} </p>
          </div>
          <div className="flex">
            <h2>government</h2>
            <p> {data?.governmentId?.name} </p>
          </div>
          <div className="flex">
            <h2>addressDetails</h2>
            <p> {data?.addressDetails} </p>
          </div>
          <div className="flex">
            <h2>village</h2>
            <p> {data?.villageId?.name} </p>
          </div>
          <div className="flex">
            <h2>phone</h2>
            <p> {data?.phone} </p>
          </div>
          <div className="flex">
            <h2>email</h2>
            <p className="email"> {data?.email} </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
