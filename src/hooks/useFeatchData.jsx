import { useContext, useEffect, useRef, useState } from "react";
import { baseURL, Context } from "../context/context";
import axios from "axios";

const useFeatchData = ({
  URL = "",
  filters = {},
  search = false,
  numberOf = "",
}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [slectedItems, setSelectedItems] = useState([]);
  const [page, setPage] = useState(1);
  const context = useContext(Context);
  const token = context.userDetails.token;
  const limit = context?.limit;
  const dataLength = useRef(0);
  const allPeople = useRef([]);

  const getData = async () => {
    setLoading(true);
    setData([]);
    setSelectedItems([]);
    document.querySelector("th .checkbox")?.classList.remove("active");
    let url = `${baseURL}/${URL}?active=true&limit=${limit}&page=${page}`;

    const keys = Object.keys(filters);
    keys.forEach(
      (key) =>
        key !== "date" &&
        filters[key] &&
        (url += `&${key}=${filters[key]._id ? filters[key]._id : filters[key]}`)
    );
    filters.date.from && filters.date.to
      ? (url += `&createdAt[gte]=${filters.date.from}&createdAt[lte]=${filters.date.to}`)
      : filters.date.from && !filters.date.to
      ? (url += `&createdAt[gte]=${filters.date.from}`)
      : !filters.date.from &&
        filters.date.to &&
        (url += `&createdAt[lte]=${filters.date.to}`);

    try {
      const data = await axios.get(url, {
        headers: { Authorization: "Bearer " + token },
      });

      dataLength.current = data.data[numberOf];
      allPeople.current = data.data.data.map((e) => e._id);
      setData(data.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getSearchData = async () => {
    setLoading(true);
    setData([]);
    setSelectedItems([]);
    document.querySelector("th .checkbox")?.classList.remove("active");
    let url = `${baseURL}/${URL}/search?active=true&limit=${limit}&page=${page}`;

    filters.date.from && filters.date.to
      ? (url += `&createdAt[gte]=${filters.date.from}&createdAt[lte]=${filters.date.to}`)
      : filters.date.from && !filters.date.to
      ? (url += `&createdAt[gte]=${filters.date.from}`)
      : !filters.date.from &&
        filters.date.to &&
        (url += `&createdAt[lte]=${filters.date.to}`);

    try {
      const data = await axios.post(
        url,
        {
          search: search,
        },
        { headers: { Authorization: "Bearer " + token } }
      );
      dataLength.current = data.data.numberOfActiveResults;
      allPeople.current = data.data.data.map((e) => e._id);
      setData(data.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    !search ? getData() : getSearchData();
  }, [search, filters, page, limit]);

  return {
    data,
    getData,
    dataLength: dataLength.current,
    allPeople: allPeople.current,
    page,
    setPage,
    slectedItems,
    setSelectedItems,
    loading,
  };
};

export default useFeatchData;
