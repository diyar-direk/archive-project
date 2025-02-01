import React, { useContext, useEffect, useRef, useState } from "react";
import Table from "../../components/table/Table";
import { baseURL, Context } from "../../context/context";
import axios from "axios";
import { date } from "../../context/context";

const Backup = () => {
  const [data, setData] = useState([]);
  const dataLength = useRef(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const context = useContext(Context);
  const limit = context?.limit;
  const token = context.userDetails.token;
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    date: {
      from: "",
      to: "",
    },
  });

  const header = ["root", "creat at"];

  useEffect(() => {
    if (!search) getData();
  }, [page, search, limit, filters]);

  const getData = async () => {
    setLoading(true);
    setData([]);
    let url = `${baseURL}/backup/roots?limit=${limit}&page=${page}`;
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
      dataLength.current = data.data.numberOfroots;
      console.log(data.data);

      setData(data.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!search) return;
    const timeOut = setTimeout(() => getSearchData(), 500);
    return () => clearTimeout(timeOut);
  }, [page, search, limit, filters]);

  const getSearchData = async () => {
    setLoading(true);
    setData([]);
    let url = `${baseURL}/backup/roots/search?limit=${limit}&page=${page}`;
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
      setData(data.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const countryData = data?.map((e) => (
    <tr key={e._id}>
      <td>{e.root}</td>
      <td>{date(e.createdAt)}</td>
      <td></td>
    </tr>
  ));

  return (
    <>
      <h1 className="title">Sections</h1>
      <div className="flex align-start gap-20 wrap">
        {context.userDetails.isAdmin && (
          <form className="addresses">
            <h1>dsa</h1>
            <label htmlFor="name">section name</label>
            <input
              className="inp"
              required
              placeholder="please write a section name"
              type="text"
              id="name"
            />
            <div className="flex wrap gap-10">
              <button className={`btn flex-1`}>add</button>
            </div>
          </form>
        )}
        <div className="flex-1">
          <Table
            hideActionForUser={true}
            header={header}
            loading={loading}
            page={{ page: page, setPage, dataLength: dataLength.current }}
            data={{ data: countryData }}
            filters={{ search, setSearch, filters, setFilters }}
          />
        </div>
      </div>
    </>
  );
};

export default Backup;
