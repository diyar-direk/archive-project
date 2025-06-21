import useLanguage from "../../hooks/useLanguage";

const TabelBody = ({ loading, rows }) => {
  const { language } = useLanguage();
  return (
    <tbody className={loading || rows ? "relative" : ""}>
      {loading ? (
        <div className="table-loading"> {language?.table?.loading}</div>
      ) : rows.length > 0 ? (
        <>{rows}</>
      ) : (
        <div className="table-loading">{language?.table?.no_results}</div>
      )}
    </tbody>
  );
};

export default TabelBody;
