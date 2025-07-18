import axios from "axios";
import "../people/profile.css";
import  { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { baseURL, Context } from "../../context/context";
import Skeleton from "react-loading-skeleton";
import CategoriesShow from "../../components/categoriesComp/CategoriesShow";
import MediaShow from "../../components/categoriesComp/MediaShow";
import useLanguage from "../../hooks/useLanguage";
const InfoPage = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const context = useContext(Context);
  const token = context.userDetails.token;
  const lang = context.language;
  const { language } = useLanguage();
  const nav = useNavigate();
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    !loading && setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/Information/${id}`, {
        headers: { Authorization: "Bearer " + token },
      });
      if (
        context.userDetails.role === "user" &&
        context.userDetails.sectionId !== res.data.data.sectionId._id
      ) {
        nav("/dashboard/not-found-404");
        return;
      }
      setData(res.data.data);
    } catch (err) {
      if (err.status === 500 || err.status === 404) nav("/dashboard/error-404");
      err.status === 403 && nav(`/dashboard/error-403`);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/information/download-information",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/zip",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ informationId: id, lang: lang }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${id}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert(language?.error?.error_downloading);
    }
  };

  return loading ? (
    <div className="flex flex-direction gap-20">
      <Skeleton height={"400px"} width={"100%"} />
      <div className="grid-3">
        <Skeleton height={"200px"} width={"100%"} />
        <Skeleton height={"200px"} width={"100%"} />
        <Skeleton height={"200px"} width={"100%"} />
        <Skeleton height={"200px"} width={"100%"} />
      </div>
    </div>
  ) : (
    <div className="relative single-info">
      <div className="info-actions flex gap-10">
        <i
          onClick={handleExport}
          title="export"
          className="fa-solid fa-download"
        ></i>
        <Link
          to={`/dashboard/update_info/${id}`}
          title="update"
          className="fa-regular fa-pen-to-square"
        ></Link>
      </div>

      <h1> {data.subject} </h1>

      <h2>{language?.information?.notes}</h2>
      <p>{data.note}</p>
      <div className="flex align-center gap-10">
        <h2> {language?.information?.credibility}</h2>
        <p>{data.credibility}</p>
      </div>
      <div className="flex align-center gap-10">
        <h2> {language?.information?.country}</h2>
        <p>{data.countryId?.name}</p>
      </div>
      <div className="flex align-center gap-10">
        <h2> {language?.information?.city}</h2>
        <p>{data.cityId?.name}</p>
      </div>
      <div className="flex align-center gap-10">
        <h2> {language?.information?.government}</h2>
        <p>{data.governmentId?.name}</p>
      </div>
      <div className="flex align-center gap-10">
        <h2>{language?.information?.region}</h2>
        <p>{data.regionId ? data.regionId?.name : "no region found"}</p>
      </div>
      <div className="flex align-center gap-10">
        <h2>{language?.information?.street}</h2>
        <p>{data.streetId ? data.streetId?.name : "no street found"}</p>
      </div>
      <div className="flex align-center gap-10">
        <h2>{language?.information?.village}</h2>
        <p>{data.villageId ? data.villageId?.name : "no village found"}</p>
      </div>
      <div className="flex align-center gap-10">
        <h2>{language?.information?.adress}</h2>
        <p>{data.addressDetails ? data.addressDetails : "no Details found"}</p>
      </div>
      <h2>{language?.information?.details}</h2>
      <p>{data.details}</p>

      <div className="categories grid-3">
        <CategoriesShow
          title="coordinates"
          data={data.coordinates}
          name="coordinates"
        />
        <CategoriesShow
          title={language?.information?.people}
          name="people"
          data={data.people}
        />
        <CategoriesShow
          title={language?.information?.events}
          data={data.events}
          name="name"
        />
        <CategoriesShow
          title={language?.information?.parties}
          data={data.parties}
          name="name"
        />
        <CategoriesShow
          title={language?.information?.sources}
          data={data.sources}
          name="source_name"
        />
      </div>
      {data.media && <MediaShow id={id} data={data?.media} getData={getData} />}
    </div>
  );
};

export default InfoPage;
