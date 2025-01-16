import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { baseURL } from "../../context/context";
import Skeleton from "react-loading-skeleton";

const InfoPage = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  useEffect(() => {
    !loading && setLoading(true);
    axios
      .get(`${baseURL}/Information/${id}`)
      .then((res) => setData(res.data.data))
      .catch((err) => {
        console.log(err);
        if (err.status === 500) nav("/not-fond");
      })
      .finally(() => setLoading(false));
  }, []);

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
    <div className="single-info">
      <h1> {data.subject} </h1>
      <h2>details:</h2>
      <p>{data.details}</p>
      <h2>note:</h2>
      <p>{data.note}</p>
      <div className="flex align-center gap-10">
        <h3> country:</h3>
        <p>{data.countryId.name}</p>
      </div>
      <div className="flex align-center gap-10">
        <h3> city:</h3>
        <p>{data.cityId.name}</p>
      </div>
      <div className="flex align-center gap-10">
        <h3> government:</h3>
        <p>{data.governmentId.name}</p>
      </div>
      <div className="flex align-center gap-10">
        <h3> government:</h3>
        <p>{data.governmentId.name}</p>
      </div>
    </div>
  );
};

export default InfoPage;
