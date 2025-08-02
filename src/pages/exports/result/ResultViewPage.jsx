import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { baseURL, Context } from "../../../context/context";
import Skeleton from "react-loading-skeleton";
import { dateFormatter } from "../../../utils/dateFormatter";
import MediaShow from "../../../components/categoriesComp/MediaShow";
import useLanguage from "../../../hooks/useLanguage";

const ResultViewPage = () => {
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
      const { data } = await axios.get(`${baseURL}/results/${id}`, {
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
  if (loading) return <Skeleton width="100%" height="400px" />;

  return (
    <div className="flex flex-direction gap-20">
      <div className="profile wrap flex">
        <div className="info">
          <Link
            to={`/update_result/${id}`}
            className="fa-regular fa-pen-to-square"
          ></Link>
          <div className="flex">
            <h2>{language.reports.result_title}</h2>
            <p>{data.title}</p>
          </div>

          <div className="flex">
            <h2>{language.reports.result_number}</h2>
            <p>{data.number}</p>
          </div>
          <div className="flex">
            <h2>{language.reports.result_date}</h2>
            <p>{dateFormatter(data.date)}</p>
          </div>
          <div className="flex">
            <h2>{language.reports.created_at}</h2>
            <p>{dateFormatter(data.createdAt)}</p>
          </div>
          <div className="flex">
            <h2>{language.reports.result_subject}</h2>
            <p>{data.subject}</p>
          </div>
        </div>
      </div>
      {data.media && <MediaShow id={id} data={data?.media} getData={getData} />}
    </div>
  );
};

export default ResultViewPage;
