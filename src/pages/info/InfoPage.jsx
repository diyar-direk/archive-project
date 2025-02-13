import axios from "axios";
import "../people/profile.css";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { baseURL, Context } from "../../context/context";
import Skeleton from "react-loading-skeleton";
import CategoriesShow from "../../components/categoriesComp/CategoriesShow";
import MediaShow from "../../components/categoriesComp/MediaShow";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import DataComponent from "./DataComponent ";
const InfoPage = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const context = useContext(Context);
  const token = context.userDetails.token;
  const nav = useNavigate();
  const componentRef = useRef(null);
  useEffect(() => {
    getData();
  }, []);

  const [exportPDF, setExportPDF] = useState(false);

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

  const handleExportPDF = async () => {
    const element = componentRef.current;
    // تحويل العنصر إلى صورة عبر html2canvas
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    // إنشاء مستند PDF وإضافة الصورة إليه
    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();

    // لضبط الصورة بشكل يناسب الصفحة
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${data.subject}.pdf`);
    setExportPDF(false);
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
  ) : !exportPDF ? (
    <div className="relative single-info">
      <div className="info-actions flex gap-10">
        <i
          title="export as PDF"
          onClick={() => setExportPDF(true)}
          className="fa-solid fa-download"
        ></i>
        <Link
          to={`/dashboard/update_info/${id}`}
          title="update"
          className="fa-regular fa-pen-to-square"
        ></Link>
      </div>

      <h1> {data.subject} </h1>
      <h2>details</h2>
      <p>{data.details}</p>
      <h2>note</h2>
      <p>{data.note}</p>
      <div className="flex align-center gap-10">
        <h2> country</h2>
        <p>{data.countryId?.name}</p>
      </div>
      <div className="flex align-center gap-10">
        <h2> city</h2>
        <p>{data.cityId?.name}</p>
      </div>
      <div className="flex align-center gap-10">
        <h2> government</h2>
        <p>{data.governmentId?.name}</p>
      </div>
      <div className="flex align-center gap-10">
        <h2>region</h2>
        <p>{data.regionId ? data.regionId?.name : "no region found"}</p>
      </div>
      <div className="flex align-center gap-10">
        <h2>street</h2>
        <p>{data.streetId ? data.streetId?.name : "no street found"}</p>
      </div>
      <div className="flex align-center gap-10">
        <h2>village</h2>
        <p>{data.villageId ? data.villageId?.name : "no village found"}</p>
      </div>
      <div className="flex align-center gap-10">
        <h2>addressDetails</h2>
        <p>{data.addressDetails ? data.addressDetails : "no Details found"}</p>
      </div>

      <div className="categories grid-3">
        <CategoriesShow
          title="coordinates"
          data={data.coordinates}
          name="coordinates"
        />
        <CategoriesShow title="people" name="people" data={data.people} />
        <CategoriesShow title="events" data={data.events} name="name" />
        <CategoriesShow title="parties" data={data.parties} name="name" />
        <CategoriesShow
          title="sources"
          data={data.sources}
          name="source_name"
        />
      </div>
      {data.media && <MediaShow id={id} data={data?.media} getData={getData} />}
    </div>
  ) : (
    <>
      <i
        onClick={() => setExportPDF(false)}
        className="close-pdf fa-solid fa-xmark"
      ></i>
      <DataComponent data={data} ref={componentRef} />
      <div style={{ marginTop: "20px" }} className="flex gap-20 wrap">
        <button onClick={handleExportPDF} className="btn flex-1 save">
          <i className="fa-solid fa-download"></i> export
        </button>
        <button
          onClick={() => setExportPDF(false)}
          className="btn flex-1 cencel"
        >
          <i className="fa-solid fa-ban"></i> cencel
        </button>
      </div>
    </>
  );
};

export default InfoPage;
