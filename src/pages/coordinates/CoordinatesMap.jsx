import axios from "axios";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { baseURL, Context } from "../../context/context";
import MapTiles from "./Map";
import Skeleton from "react-loading-skeleton";
const limit = 40;
const CoordinatesMap = () => {
  const [data, setData] = useState(null);
  const dataLength = useRef(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const context = useContext(Context);
  const token = context.userDetails.token;

  const getData = useCallback(async () => {
    setLoading(true);
    setData(null);
    const params = new URLSearchParams();
    params.append("active", true);
    params.append("limit", limit);
    params.append("page", page);
    params.append("fields", "_id coordinates");
    if (context.userDetails.role === "user") {
      params.append("sectionId", context.userDetails.sectionId);
    }
    try {
      const { data } = await axios.get(`${baseURL}/Coordinates`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      dataLength.current = data["numberOfActiveCoordinates"];
      setData(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    getData();
  }, [page, limit, getData]);
  const pages = useMemo(() => {
    const pagesCount = Math.ceil(dataLength.current / limit);
    const pagination = [];
    if (pagesCount <= 1 || !pagesCount || !data) return null;
    for (let i = 0; i < pagesCount; i++)
      pagination.push(
        <h3
          key={i}
          onClick={() => setPage(i + 1)}
          className={i + 1 === page ? "active" : ""}
        >
          {i + 1}
        </h3>
      );
    return pagination;
  }, [data, page]);

  if (loading) return <Skeleton width="100%" height="100%" />;
  if (!data)
    return <h1 className="font-color text-capitalize"> no data founded</h1>;
  return (
    <>
      <div className="profile wrap flex">
        <div className="info">
          <MapTiles coords={data} />
          <div className="pagination center align-center">{pages}</div>
        </div>
      </div>
    </>
  );
};

export default CoordinatesMap;
