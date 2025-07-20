import { useCallback, useEffect, useRef, useState } from "react";
import useLanguage from "../../hooks/useLanguage";

/**
 * @typedef {Object} Utils
 * @property {({ page: number, search: string }) => Promise<any[]>} fetchData
 * @property {string} label
 * @property {string} selectLabel
 * @property {(option: any) => string} optionLabel
 * @property {(option: any) => void} onChange
 * @property {() => void} onIgnore
 * @property {any} value
 * @property {boolean} isTabelsFilter
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setReset
 * @property {boolean} reset
 * @property {boolean} isArray هل هناك اكثر من قيمة للادخال
 * @property {string} url
 * @property {string} tabelFilterIgnoreText
 * @param {Utils & React.HtmlHTMLAttributes<HTMLDivElement>} props
 */
const SelectInputApi = ({
  fetchData,
  selectLabel,
  label,
  optionLabel,
  onChange,
  onIgnore,
  value,
  isTabelsFilter,
  url,
  tabelFilterIgnoreText,
  reset,
  isArray,
  setReset,
  ...props
}) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { language } = useLanguage();
  const observer = useRef(null);
  const closeDiv = useCallback(
    (e) => {
      const article = e.currentTarget.closest("article");
      if (!article) return;

      const wrapperDiv = isTabelsFilter
        ? article.closest(".tabel-filter-select")
        : article.closest("div");

      if (wrapperDiv?.children[0]) {
        wrapperDiv?.children[0].classList.remove("active");
      }
    },
    [isTabelsFilter]
  );

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    const divs = document.querySelectorAll("div.form .selecte .inp.active");
    divs?.forEach((ele) => ele !== e.target && ele.classList.remove("active"));
    e.target.classList.toggle("active");
    setIsOpen(e.target.classList.contains("active"));
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const loadData = async () => {
      setLoading(true);
      const params = url ? { page, search, url } : { page, search };
      try {
        const result = await fetchData(params);
        setItems((prev) => {
          const combined = [...prev, ...(result.data || [])];
          const uniqueMap = new Map();
          for (const item of combined) {
            uniqueMap.set(String(item._id), item);
          }
          return Array.from(uniqueMap.values());
        });
        setHasMore(result.hasMore);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (search) loadData();
    else {
      const timeOut = setTimeout(() => loadData(), 500);
      return () => clearTimeout(timeOut);
    }
  }, [page, search, isOpen]);

  const lastElement = useCallback(
    (node) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );
  useEffect(() => {
    if (reset) {
      setPage(1);
      setItems([]);
      setReset(false);
    }
  }, [reset, setReset]);

  const [selectedData, setSelectedData] = useState({});

  return (
    <div className="flex flex-direction">
      {label && <label>{label}</label>}
      <div className="selecte relative" {...props}>
        <div onClick={handleClick} className="inp">
          {selectLabel ? selectLabel : tabelFilterIgnoreText || ""}
        </div>
        <article>
          <input
            value={search}
            onChange={(e) => {
              setItems([]);
              setPage(1);
              setHasMore(true);
              setSearch(e.target.value.toLowerCase());
            }}
            onClick={(e) => e.stopPropagation()}
            placeholder={`${language?.table?.search_for}...`}
          />
          {isTabelsFilter && (
            <h2 onClick={onIgnore}> {tabelFilterIgnoreText} </h2>
          )}
          {items.map((itm, i) => (
            <h2
              key={itm._id}
              onClick={(e) => {
                onChange(itm);
                setSelectedData(itm);
                closeDiv(e);
              }}
              ref={i === items?.length - 1 ? lastElement : null}
            >
              {optionLabel(itm)}
            </h2>
          ))}
          {loading && <p className="font-color">{language?.table?.loading}</p>}
          {!hasMore && <p className="font-color">no more data</p>}
        </article>
        {!isTabelsFilter && isArray && value?.length > 0 ? (
          <div className="flex selceted-itms">
            {value.map((span) => (
              <span onClick={() => onIgnore(span)} key={span._id}>
                {optionLabel(span)}
              </span>
            ))}
          </div>
        ) : (
          !isTabelsFilter &&
          !isArray &&
          value && (
            <span
              onClick={() => {
                onIgnore();
                setSelectedData({});
              }}
            >
              {typeof value === "function" ? value(selectedData) : value}
            </span>
          )
        )}
      </div>
    </div>
  );
};

export default SelectInputApi;
window.addEventListener("click", () => {
  const selectDiv = document.querySelector("div.form .selecte .inp.active");
  selectDiv && selectDiv.classList.remove("active");
});
