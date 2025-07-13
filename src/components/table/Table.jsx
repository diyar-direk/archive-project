import { useContext, useEffect, useState } from "react";
import "./table.css";
import axios from "axios";
import { baseURL } from "../../context/context";
import { Context } from "./../../context/context";
import { Link, useLocation } from "react-router-dom";
import Loading from "../loading/Loading";
import useLanguage from "../../hooks/useLanguage";
import TabelHeader from "./TabelHeader";
import TabelBody from "./TabelBody";
import Pagination from "./Pagination";
import ShowRows from "./ShowRows";
/**
 * @typedef {Object} Utils
 * @property {Array<any>} tabelData - البيانات المعروضة في الجدول.
 * @property {Array<any>} allData - جميع البيانات (قد تكون كاملة أو غير مفلترة).
 * @property {React.Dispatch<React.SetStateAction<any[]>>} setSelectedItems - دالة لتحديث العناصر المحددة.
 * @property {Array<any>} selectedItems - العناصر المحددة حاليًا.
 * @property {boolean} selectable - هل يمكن تحديد الصفوف أم لا.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setOpenFiltersDiv
 * @property {boolean} openFiltersDiv
 * @property {Array<any>} columns - أعمدة الجدول.
 * @property {number} dataLength - عدد البيانات الكلي.
 * @property {boolean} loading - حالة التحميل.
 * @property {number} currentPage - الصفحة الحالية.
 * @property {React.Dispatch<React.SetStateAction<number>>} setPage - دالة لتغيير الصفحة الحالية.
 * @property {React.Dispatch<React.SetStateAction<number>>} setPage - دالة
 * @property {React.Dispatch<React.SetStateAction<object>>} setUpdate - تستخدم في الصفحات التي تكون فيها جدول وحقل ادخال بنفس الصفحة
 * @property {string} deleteUrl - رابط حذف البيانات.
 * @property {string} addPageUrl - رابط صفحة اضافة البيانات.
 * @property {boolean} hideAddBtn - اخفاء زر اضافة البيانات
 * @property {string} search - القيمة التي يتم البحث عنها.
 * @property {React.Dispatch<React.SetStateAction<string>>} setSearch - دالة لتحديث قيمة البحث
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setBackupOverlay - لعرض خصائص النسخ الاحتياطي
 * @property {() => void} getData - دالة جلب البيانات.
 */

/**
 * @param {React.TableHTMLAttributes<HTMLTableElement> & Utils} props
 */

const Table = ({
  tabelData = [],
  allData = [],
  setSelectedItems,
  selectedItems = [],
  selectable = false,
  columns = [],
  dataLength = 0,
  loading = true,
  currentPage = 1,
  setPage,
  deleteUrl,
  getData,
  setSort,
  search,
  setSearch,
  openFiltersDiv,
  setOpenFiltersDiv,
  setUpdate,
  setBackupOverlay,
  addPageUrl,
  hideAddBtn,
  ...props
}) => {
  const [overlay, setOverlay] = useState(false);
  const [columnsState, setColumnsState] = useState(columns);
  const context = useContext(Context);
  const token = context.userDetails.token;
  const [dataLoading, setDataLoading] = useState(false);
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    const pages = document.querySelectorAll(".pagination h3");
    if (pages) {
      pages.forEach((e) => e.classList.remove("active"));

      pages[currentPage - 1]?.classList.add("active");
    }
  }, [currentPage]);

  useEffect(() => {
    const handleClick = () => {
      if (overlay) {
        setOverlay(false);
        if (selectedItems.length < 2) setSelectedItems([]);
      }
      openFiltersDiv && setOpenFiltersDiv(false);
      const optionDiv = document.querySelector(
        "div.table tbody td i.options.active-div"
      );
      optionDiv && optionDiv.classList.remove("active-div");
    };

    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [overlay, openFiltersDiv, selectedItems, setSelectedItems]);

  const deleteData = async () => {
    setOverlay(false);
    setDataLoading(true);
    try {
      if (selectedItems.length > 1) {
        const data = await axios.patch(
          `${baseURL}/${deleteUrl}/deActivate-many`,
          { ids: selectedItems },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        if (data.status === 200) {
          setOverlay(false);
          if (
            allData.length - selectedItems.length === 0 &&
            currentPage !== 1
          ) {
            setPage(1);
          } else getData();
        }
      } else {
        const data = await axios.patch(
          `${baseURL}/${deleteUrl}/deActivate/${selectedItems[0]}`,
          [],
          { headers: { Authorization: "Bearer " + token } }
        );
        if (data.status === 200) {
          setOverlay(false);
          if (
            allData.length - selectedItems.length === 0 &&
            currentPage !== 1
          ) {
            setPage(1);
          } else getData();
        }
      }
    } catch (error) {
      console.log(error);
      alert("somthing want error");
    } finally {
      setDataLoading(false);
    }
  };

  return (
    <>
      {dataLoading && <Loading />}

      {overlay && (
        <div className="overlay">
          <div onClick={(e) => e.stopPropagation()}>
            <h1>
              {language?.table?.are_you_sure_delete}({selectedItems.length})
              {language?.table?.items}
            </h1>
            <div className="flex gap-10 wrap">
              <div onClick={deleteData} className="delete-all overlay-btn">
                <i className="fa-solid fa-trash"></i> {language?.table?.delete}
              </div>
              <div
                onClick={() => {
                  selectedItems.length === 1 && setSelectedItems([]);
                  setOverlay(false);
                }}
                className="delete-all cencel overlay-btn"
              >
                <i className="fa-solid fa-ban"></i> {language?.table?.cancel}
              </div>
            </div>
          </div>
        </div>
      )}

      <form className="flex align-center justify-end gap-10 table-search">
        {!location.pathname.includes("/backup") && (
          <label className="search-container" htmlFor="search">
            <input
              type="text"
              id="search"
              placeholder={`${language?.table?.serach_by_name}`}
              value={search}
              onInput={(e) => {
                currentPage !== 1 && setPage(1);
                setSearch(e.target.value.toLowerCase());
              }}
            />
            <i className="fa-solid fa-magnifying-glass" />
          </label>
        )}
        {(location.pathname.includes("/dashboard/people") ||
          location.pathname.includes("/dashboard/informations")) && (
          <Link
            to="/dashboard/search_by_image"
            title={language?.header?.serach_by_image}
            className="table-form-icons"
          >
            <i className="fa-solid fa-id-card" />
            <span>{language?.header?.serach_by_image}</span>
          </Link>
        )}
        {!hideAddBtn && addPageUrl && (
          <Link
            to={`/dashboard/${addPageUrl}`}
            title="add data"
            className="table-form-icons"
          >
            <i className="fa-solid fa-plus" />
            <span>add data</span>
          </Link>
        )}
        <div
          title="filters"
          onClick={(e) => {
            setOpenFiltersDiv(true);
            e.stopPropagation();
          }}
          className="table-form-icons"
        >
          <i className="fa-solid fa-sliders filter" />
          <span>filters</span>
        </div>
        <ShowRows columns={columnsState} setColumns={setColumnsState} />
      </form>

      <div className="table">
        <table {...props} className={loading || tabelData ? "loading" : ""}>
          <TabelHeader
            selectable={selectable}
            allData={allData}
            setSelectedItems={setSelectedItems}
            column={columnsState}
            setSort={setSort}
          />
          <TabelBody
            loading={loading}
            column={columnsState}
            tabelData={tabelData}
            selectable={selectable}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            setOverlay={setOverlay}
            setUpdate={setUpdate}
            setBackupOverlay={
              location.pathname.includes("/backup") ? setBackupOverlay : null
            }
          />
        </table>
      </div>

      {selectedItems?.length > 0 && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setOverlay(true);
          }}
          className="gap-10 delete-all"
        >
          <i className="fa-solid fa-trash"></i> {language?.table?.delete} (
          {selectedItems.length}){language?.table?.items}
        </div>
      )}
      <Pagination
        dataLength={dataLength}
        currentPage={currentPage}
        loading={loading}
        setPage={setPage}
      />
    </>
  );
};

export default Table;
