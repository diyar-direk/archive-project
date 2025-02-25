import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../people/profile.css";
import axios from "axios";
import { baseURL, Context } from "../../context/context";
import Skeleton from "react-loading-skeleton";
import MapComponent from "./MapComponent";
import MediaComponent from "../../components/MediaComponent";
const CoordPage = () => {
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
      const data = await axios.get(`${baseURL}/Coordinates/${id}`, {
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
      (error.status === 500 || error.status === 404) &&
        nav(`/dashboard/error-404`);
      error.status === 403 && nav(`/dashboard/error-403`);
    } finally {
      setLoading(false);
    }
  }

  async function getInfo() {
    let url = `${baseURL}/Information?people=${id}&active=true&fields=people,subject`;
    context.userDetails.role === "user" &&
      (url += `&sectionId=${context.userDetails.sectionId}`);
    try {
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInformatios(res.data.informations);
    } catch (error) {
      console.log(error);
    } finally {
      setInfoLoading(false);
    }
  }

  const info =
    informations &&
    informations?.map((e) => {
      return (
        <article key={e._id} className="person-info">
          <h2>subject</h2>
          <p>{e.subject}</p>
          <h2>realted people</h2>
          {e.people.length > 0 ? (
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
                            <MediaComponent
                              src={e.image}
                              type="image"
                              showUserIcon
                            />
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
            <p>no people found</p>
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
      {loading ? (
        <article className="flex-1 info-skeleton">
          <Skeleton height={"400px"} width={"100%"} />
        </article>
      ) : (
        <div className="profile wrap flex">
          <div style={{ zIndex: 1 }} className="w-100">
            {data?.coordinates && (
              <MapComponent
                lat={data?.coordinates?.split(",")[0]}
                lng={data?.coordinates?.split(",")[1]}
              />
            )}
          </div>
          <div className="info">
            <Link
              to={`/dashboard/coordinates/${id}`}
              className="fa-regular fa-pen-to-square"
            ></Link>
            <div className="flex">
              <h2>coordinates</h2>
              <p>{data?.coordinates}</p>
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
              <h2>village</h2>
              <p> {data?.villageId?.name} </p>
            </div>
            <div className="flex">
              <h2>note</h2>
              <p> {data?.note} </p>
            </div>
            <div className="flex">
              <h2>source</h2>
              <p> {data?.sources?.source_name} </p>
            </div>
            <div className="flex">
              <h2>sectionId</h2>
              <p> {data?.sectionId?.name} </p>
            </div>
          </div>
        </div>
      )}

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

export default CoordPage;
