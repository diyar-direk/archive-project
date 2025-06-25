/**
 *
 * @typdef utils
 * @proprty {string} alt
 * @param {*} loading
 * @returns
 */

const Test = (alt, src, loading) => {
  return <img alt={alt || ""} src={src || ""} loading={loading || "lazy"} />;
};

export default Test;
