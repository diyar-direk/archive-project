import DateFilter from "../../components/tabelFilterData/DateFilter";
import useLanguage from "../../hooks/useLanguage";

/**
 * @typedef {object} TabelFilterDivProps
 * @property {React.Dispatch<React.SetStateAction<object>>} setFilter - يتم استخدامه لتحديث الفلاتر عند الضغط على زر "موافق"
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setIsopen - فتح أو إغلاق نافذة الفلاتر
 * @property {React.ReactNode} children - عناصر الفلترة التي سيتم عرضها داخل المكون
 * @property {React.Dispatch<React.SetStateAction<number>>} setPage - إعادة تعيين الصفحة الحالية إلى الصفحة الأولى
 * @property {object} beforeFiltering - الفلاتر الحالية قبل تأكيد التعديلات
 * @property {React.Dispatch<React.SetStateAction<object>>} setBeforeFiltering - تحديث كائن الفلاتر قبل تأكيد التعديلات
 * @param {TabelFilterDivProps} props
 */

const TabelFilterDiv = ({
  setFilter,
  setIsopen,
  children,
  setPage,
  beforeFiltering,
  setBeforeFiltering,
}) => {
  const { language } = useLanguage();

  return (
    <div className="overlay">
      <div onClick={(e) => e.stopPropagation()} className="table-fltr">
        <DateFilter filter={beforeFiltering} setFilter={setBeforeFiltering} />
        <div className="filters"> {children} </div>

        <div className="gap-10 center filters-setting">
          <span
            onClick={() => {
              setPage(1);
              setFilter(beforeFiltering);
              setIsopen(false);
            }}
          >
            {language?.table?.okay}
          </span>
          <span
            className="cencel-fltr"
            onClick={() => {
              setIsopen(false);
            }}
          >
            {language?.table?.cancel}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TabelFilterDiv;
