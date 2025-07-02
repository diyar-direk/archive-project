import { useMemo } from "react";

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
  const option = useMemo(
    () =>
      options?.map((opt) => (
        <h2 onClick={opt.onSelectOption}> {opt?.text} </h2>
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
