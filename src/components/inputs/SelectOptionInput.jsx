import { useCallback, useMemo } from "react";

/**
 * @typedef utils
 * @property {array} options
 * @property {string} label
 * @property {string} placeholder
 * @property {string} value
 * @property {()=> void} onIgnore
 * @param {utils} props
 */
const SelectOptionInput = ({
  label,
  placeholder,
  onIgnore,
  value,
  options,
}) => {
  const handleClick = (e) => {
    e.stopPropagation();
    const divs = document.querySelectorAll("div.form .selecte .inp.active");
    divs.forEach((ele) => ele !== e.target && ele.classList.remove("active"));
    e.target.classList.toggle("active");
  };
  const closeDiv = useCallback((e) => {
    const article = e.currentTarget.closest("article");
    if (!article) return;

    const wrapperDiv = article.closest("div");

    if (wrapperDiv?.children[0]) {
      wrapperDiv?.children[0].classList.remove("active");
    }
  }, []);
  const option = useMemo(
    () =>
      options?.map((opt) => (
        <h2
          key={opt.text}
          onClick={(e) => {
            opt.onSelectOption();
            closeDiv(e);
          }}
        >
          {opt?.text}
        </h2>
      )),
    [options]
  );
  return (
    <div className="flex flex-direction">
      <label>{label}</label>
      <div className="selecte relative">
        <div onClick={handleClick} className="inp">
          {placeholder}
        </div>
        <article>{option}</article>
      </div>
      {value && (
        <span title="gender" onClick={onIgnore}>
          {value}
        </span>
      )}
    </div>
  );
};

export default SelectOptionInput;
window.addEventListener("click", () => {
  const selectDiv = document.querySelector("div.form .selecte .inp.active");
  selectDiv && selectDiv.classList.remove("active");
});
