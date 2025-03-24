import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { baseURL, Context } from "../context/context";

export default function useInfitFetch(key, id, page, limit = 1) {
  const context = useContext(Context);
  const token = context.userDetails.token;

  const [infoLoading, setInfoLoading] = useState(true);
  const [informations, setInformations] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setInfoLoading(true);
    const source = axios.CancelToken.source();

    let url = `${baseURL}/Information?active=true&fields=people,subject&limit=${limit}&page=${page}&${key}=${id}`;

    context.userDetails.role === "user" &&
      (url += `&sectionId=${context.userDetails.sectionId}`);

    axios
      .get(url, {
        headers: { Authorization: `Bearer ${token}` },
        cancelToken: source.token,
      })
      .then((res) => {
        setInformations((prev) => {
          const prevIds = new Set(prev.map((item) => item._id));
          const newData = res.data.informations.filter(
            (item) => !prevIds.has(item._id)
          );
          return [...prev, ...newData];
        });

        setHasMore(res.data.informations.length > 0);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        console.error("Error fetching data:", err);
      })
      .finally(() => setInfoLoading(false));

    return () => source.cancel();
  }, [id, page]);

  return { informations, infoLoading, hasMore };
}
