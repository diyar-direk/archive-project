import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./profile.css";
import axios from "axios";
import { baseURL, Context, date, mediaURL } from "../../context/context";
import Skeleton from "react-loading-skeleton";
const Profile = () => {
  const { id } = useParams();
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const [infoLoading, setInfoLoading] = useState(true);
  const [informations, setInformatios] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const context = useContext(Context);
  const token = context.userDetails.token;
  const nav = useNavigate();

  useEffect(() => {
    getData();
  }, [id]);
  useEffect(() => {
    const time = setTimeout(getInfo, 1000);
    return () => clearTimeout(time);
  }, [id]);

  async function getData() {
    !loading && setLoading(true);
    try {
      const data = await axios.get(`${baseURL}/people/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (
        context.userDetails.role === "user" &&
        context.userDetails.sectionId !== data.data.data.sectionId._id
      ) {
        nav("/dashboard/not-found-404");
        return;
      }
      setData(data.data.data);
    } catch (error) {
      console.log(error);
      error.status === 500 && nav(`/error-404`);
    } finally {
      setLoading(false);
    }
  }

  async function getInfo() {
    try {
      const res = await axios.get(
        `${baseURL}/Information?people=${id}&active=true&fields=people,subject`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInformatios(res.data.informations);
    } catch (error) {
      console.log(error);
    } finally {
      setInfoLoading(false);
    }
  }

  const [image, setImage] = useState(false);

  const updateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);

    try {
      await axios.patch(`${baseURL}/people/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      getData();
    } catch (error) {
      console.log(error);
      alert("some error please try agin");
    } finally {
      setImage(false);
    }
  };

  const info =
    informations &&
    informations?.map((e) => {
      return (
        <article key={e._id} className="person-info">
          <h2>subject</h2>
          <p>{e.subject}</p>
          <h2>realted people</h2>
          {e.people.length > 1 ? (
            <div>
              <div>
                {e.people?.map((e) => (
                  <div
                    className="flex align-center people-cat gap-10"
                    key={e._id}
                  >
                    {e._id !== id && (
                      <>
                        <Link
                          to={`/dashboard/people/${e._id}`}
                          className="profile-image"
                        >
                          {e.image ? (
                            <img src={mediaURL + e.image} alt="" />
                          ) : (
                            <i className="fa-solid fa-user"></i>
                          )}
                        </Link>
                        <Link
                          to={`/dashboard/people/${e._id}`}
                          className="name"
                        >
                          {e.firstName} {e.surName}
                        </Link>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>no other people found</p>
          )}
          <Link to={`/dashboard/informations/${e._id}`} className="flex btn">
            show details
          </Link>
        </article>
      );
    });

  return (
    <>
      {overlay && (
        <div
          onClick={() => setOverlay(false)}
          className="overlay media-overlay"
        >
          <article>
            <div>
              <img src={overlay} alt="" />
            </div>
          </article>
        </div>
      )}
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
                  onClick={() => {
                    setOverlay(
                      image
                        ? URL.createObjectURL(image)
                        : `${mediaURL}${data?.image}`
                    );
                  }}
                  src={
                    image
                      ? URL.createObjectURL(image)
                      : `${mediaURL}${data?.image}`
                  }
                  alt="profile"
                  className="photo w-100 c-pointer"
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
            <Link
              to={`/dashboard/update_person/${id}`}
              className="fa-regular fa-pen-to-square"
            ></Link>
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
            <div className="flex">
              <h2>section</h2>
              <p className="email"> {data?.sectionId?.name} </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex person-info flex-direction gap-20">
        {infoLoading ? (
          <>
            <Skeleton height={"200px"} width={"100%"} />
            <Skeleton height={"200px"} width={"100%"} />
          </>
        ) : (
          info
        )}
      </div>
    </>
  );
};

export default Profile;
