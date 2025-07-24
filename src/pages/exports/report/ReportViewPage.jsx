import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { baseURL, Context } from "../../../context/context";
import Skeleton from "react-loading-skeleton";
import { dateFormatter } from "../../../utils/dateFormatter";
import MediaShow from "../../../components/categoriesComp/MediaShow";

const ReportViewPage = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const context = useContext(Context);
  const { token } = context.userDetails;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${baseURL}/reports/${id}`, {
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
            to={`/update_report/${id}`}
            className="fa-regular fa-pen-to-square"
          ></Link>
          <div className="flex">
            <h2>title</h2>
            <p>{data.title}</p>
          </div>
          <div className="flex">
            <h2>subject</h2>
            <p>{data.subject}</p>
          </div>
          <div className="flex">
            <h2>number</h2>
            <p>{data.number}</p>
          </div>
          <div className="flex">
            <h2>type</h2>
            <p>{data.type}</p>
          </div>
          <div className="flex">
            <h2>date</h2>
            <p>{dateFormatter(data.date)}</p>
          </div>
          <div className="flex">
            <h2>createdAt</h2>
            <p>{dateFormatter(data.createdAt)}</p>
          </div>
        </div>
      </div>
      {data.media && <MediaShow id={id} data={data?.media} getData={getData} />}
    </div>
  );
};

export default ReportViewPage;
