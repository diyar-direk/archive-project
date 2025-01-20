import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./profile.css";
import axios from "axios";
import { baseURL, date } from "../../context/context";
import Skeleton from "react-loading-skeleton";
const Profile = () => {
  const { id } = useParams();
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    getData();
  }, [id]);

  async function getData() {
    !loading && setLoading(true);
    try {
      const data = await axios.get(`${baseURL}/people/${id}`);
      setData(data.data.data);
    } catch (error) {
      console.log(error);
      error.status === 500 && nav(`/error-404`);
    } finally {
      setLoading(false);
    }
  }

  const [image, setImage] = useState(false);

  const updateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);

    try {
      const data = await axios.patch(`${baseURL}/people/${id}`, formData);
      if (data.status === 200) console.log(data);
    } catch (error) {
      console.log(error);
      alert("some error please try agin");
    } finally {
      setImage(false);
    }
  };

  return (
    <>
      <div className="profile wrap flex">
        {loading ? (
          <article className="image-skeleton">
            <Skeleton height={"300px"} width={"100%"} />
          </article>
        ) : (
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
                      : `http://localhost:8000${data?.image}`
                  }
                  alt="profile"
                  className="photo w-100"
                />
              )}
            </div>
            <div className="flex center gap-10 w-100 wrap">
              {!image && (
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
              )}
              {image && (
                <>
                  <button
                    onClick={() => setImage(false)}
                    className="btn flex-1 cencel"
                  >
                    cencel
                  </button>
                  <button onClick={updateProfile} className="btn flex-1 save">
                    save
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {loading ? (
          <article className="flex-1 info-skeleton">
            <Skeleton height={"400px"} width={"100%"} />
          </article>
        ) : (
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
        )}
      </div>
      {loading ? (
        <article className="categories-skeleton">
          <Skeleton />
        </article>
      ) : (
        <div className="categories grid-3">
          <div>
            <h2>events</h2>
            {data?.events?.length > 0 ? (
              data?.events?.map((e) => (
                <p key={e._id}>
                  <span>event name:</span> {e.name}
                </p>
              ))
            ) : (
              <h3>no events found</h3>
            )}
          </div>
          <div className="section-color">
            <h2>parties</h2>
            {data?.parties?.length > 0 ? (
              data?.parties?.map((e) => (
                <p key={e._id}>
                  <span>Party name:</span> {e.name}
                </p>
              ))
            ) : (
              <h3>no events found</h3>
            )}
          </div>
          <div>
            <h2>sources</h2>
            {data?.sources?.length > 10 ? (
              data?.sources?.map((e) => (
                <p key={e._id}>
                  <span>source name:</span> {e.source_name}
                </p>
              ))
            ) : (
              <h3>no events found</h3>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
