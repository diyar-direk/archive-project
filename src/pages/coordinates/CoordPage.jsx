import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../people/profile.css";
import axios from "axios";
import { baseURL, Context } from "../../context/context";
import Skeleton from "react-loading-skeleton";
import MediaComponent from "../../components/MediaComponent";
import useInfitFetch from "../../hooks/useInfitFetch";
import useLanguage from "../../hooks/useLanguage";
const CoordPage = () => {
  const { id } = useParams();
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const [overlay, setOverlay] = useState(false);
  const [infoPage, setInfoPage] = useState(1);
  const context = useContext(Context);
  const token = context.userDetails.token;
  const { language } = useLanguage();

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
  const nav = useNavigate();

  useEffect(() => {
    getData();
  }, [id]);

  const { informations, infoLoading, hasMore } = useInfitFetch(
    `coordinates`,
    id,
    infoPage
  );
  const observer = useRef(null);

  const lastElement = useCallback(
    (node) => {
      if (infoLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        const firstEntry = entries[0];
        if (firstEntry?.isIntersecting && hasMore && !infoLoading) {
          setInfoPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [infoLoading, hasMore]
  );

  const info =
    informations &&
    informations.map((e, i) => {
      return (
        <article
          key={e._id}
          ref={informations.length === i + 1 ? lastElement : null}
          className="person-info"
        >
          <h2>{language?.information?.subject}</h2>
          <p>{e.subject}</p>

          <h2>{language?.information?.related_people}</h2>
          {e.people.length > 0 ? (
            <div>
              <div>
                {e.people.map((person) => (
                  <div
                    className="flex align-center people-cat gap-10"
                    key={person._id}
                  >
                    {person._id !== id && (
                      <>
                        <Link
                          to={`/dashboard/people/${person._id}`}
                          className="profile-image"
                        >
                          {person.image ? (
                            <MediaComponent
                              src={person.image}
                              type="image"
                              showUserIcon
                            />
                          ) : (
                            <i className="fa-solid fa-user"></i>
                          )}
                        </Link>
                        <Link
                          to={`/dashboard/people/${person._id}`}
                          className="name"
                        >
                          {person.firstName} {person.surName}
                        </Link>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>{language?.information?.no_related_people}</p>
          )}

          <Link to={`/dashboard/informations/${e._id}`} className="flex btn">
            {language?.information?.show_details}
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
        <>
          <div className="profile wrap flex">
            <div className="info">
              <Link
                to={`/dashboard/coordinates/${id}`}
                className="fa-regular fa-pen-to-square"
              ></Link>
              <div className="flex">
                <h2>{language?.information?.coordinates}</h2>
                <p>{data?.coordinates}</p>
              </div>

              <div className="flex">
                <h2>{language?.information?.country}</h2>
                <p> {data?.countryId?.name} </p>
              </div>
              <div className="flex">
                <h2>{language?.information?.city}</h2>
                <p> {data?.cityId?.name} </p>
              </div>
              <div className="flex">
                <h2>{language?.information?.street}</h2>
                <p> {data?.streetId?.name} </p>
              </div>
              <div className="flex">
                <h2>{language?.information?.region}</h2>
                <p> {data?.regionId?.name} </p>
              </div>
              <div className="flex">
                <h2>{language?.information?.government}</h2>
                <p> {data?.governmentId?.name} </p>
              </div>
              <div className="flex">
                <h2>{language?.information?.village}</h2>
                <p> {data?.villageId?.name} </p>
              </div>
              <div className="flex">
                <h2>{language?.information?.notes}</h2>
                <p> {data?.note} </p>
              </div>
              <div className="flex">
                <h2>{language?.information?.source}</h2>
                <p> {data?.sources?.source_name} </p>
              </div>
              <div className="flex">
                <h2>{language?.information?.section}</h2>
                <p> {data?.sectionId?.name} </p>
              </div>
            </div>
          </div>

          <div className="flex person-info flex-direction gap-20">{info}</div>
          {infoLoading && <Skeleton height={"200px"} width={"100%"} />}
        </>
      )}
    </>
  );
};

export default CoordPage;
