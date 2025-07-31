import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { baseURL, Context } from "../../../context/context";
import Skeleton from "react-loading-skeleton";
import { dateFormatter } from "../../../utils/dateFormatter";
import Answers from "./Answers";
import useLanguage from "../../../hooks/useLanguage";

const ExportViewPage = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const context = useContext(Context);
  const { token } = context.userDetails;
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const [data, setData] = useState({});
  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${baseURL}/exports/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(data.data);
    } catch (error) {
      console.error(error);
      nav("/error-404");
    } finally {
      setLoading(false);
    }
  }, [token, id, nav]);
  useEffect(() => {
    getData();
  }, [getData]);
  if (loading)
    return (
      <>
        <Skeleton width="100%" height="400px" />
        <Skeleton width="100%" height="100px" />
        <Skeleton width="100%" height="100px" />
      </>
    );

  return (
    <div className="flex flex-direction gap-20">
      <div className="profile wrap flex">
        <div className="info">
          <Link
            to={`/update_export/${id}`}
            className="fa-regular fa-pen-to-square"
          ></Link>
          <div className="flex">
            <h2>{language?.exports?.code}</h2>
            <p>{data.code}</p>
          </div>
          <div className="flex">
            <h2>{language?.exports?.details}</h2>
            <p>{data.details}</p>
          </div>
          <div className="flex">
            <h2>{language?.exports?.expiration_date}</h2>
            <p>{dateFormatter(data.expirationDate)}</p>
          </div>
          <div className="flex">
            <h2>{language?.exports?.created_at}</h2>
            <p>{dateFormatter(data.createdAt)}</p>
          </div>
        </div>
      </div>

      {data?.questions?.map((question, i) => (
        <div key={question._id} className="profile wrap flex answers">
          <h1 className="font-color">{i + 1}.</h1>
          <Answers question={question} refreshData={setData} />
        </div>
      ))}
    </div>
  );
};

export default ExportViewPage;
