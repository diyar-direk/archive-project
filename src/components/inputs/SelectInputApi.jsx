import { useCallback, useEffect, useRef, useState } from "react";
import useLanguage from "../../hooks/useLanguage";
/**
 * @typedef {Object} Utils
 * @property {() => Promise<any[]>} fetchData
 * @property {string} label
 * @property {string} selectLabel
 * @property {(option: any) => string} optionLabel
 * @property {(option: any) => void} onChange
 * @property {() => void} onIgnore
 * @property {any} value
 * @param {Utils} props
 */
const SelectInputApi = ({
  fetchData,
  selectLabel,
  label,
  optionLabel,
  onChange,
  onIgnore,
  value,
}) => {
  const [data, setData] = useState({});

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setloading] = useState(true);
  const { language } = useLanguage();
  const [search, setSearch] = useState("");
  const handleClick = useCallback((e) => {
    e.stopPropagation();
    const divs = document.querySelectorAll("div.form .selecte .inp.active");
    divs.forEach((ele) => ele !== e.target && ele.classList.remove("active"));
    e.target.classList.toggle("active");
    e.target.classList.contains("active") ? setIsOpen(true) : setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const loadData = async () => {
      setloading(true);
      try {
        const result = await fetchData({ page: data.page || 1 });
        setData(() => {
          const existingIds = new Set(
            (data.data || []).map((item) => item._id)
          );

          const newData = result.data.filter(
            (item) => !existingIds.has(item._id)
          );
          return {
            ...result,
            data: [...(data?.data || []), ...newData],
          };
        });
      } catch {}
      setloading(false);
    };
    loadData();
  }, [fetchData, search, isOpen, data.page]);

  const observer = useRef(null);
  const lastElement = useCallback(
    (node) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        const firstEntry = entries[0];
        if (firstEntry?.isIntersecting && data.hasMore && !loading) {
          setData((prev) => ({ ...prev, page: (prev.page || 1) + 1 }));
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, data.hasMore]
  );

  return (
    <div className="flex flex-direction">
      <label>{label}</label>

      <div className="selecte relative">
        <div onClick={handleClick} className="inp">
          {selectLabel}
        </div>
        <article>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder={`${language?.table?.search_for} role`}
          />

          {data?.data?.map((itm, i) => (
            <h2
              key={itm._id}
              onClick={() => onChange(itm)}
              ref={i === data?.data?.length - 1 ? lastElement : null}
            >
              {optionLabel(itm)}
            </h2>
          ))}
          {loading && <p>{language?.table?.loading}</p>}
        </article>
        {value && <span onClick={onIgnore}> {value} </span>}
      </div>
    </div>
  );
};

export default SelectInputApi;
