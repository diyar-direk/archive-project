/**
 * @param {string} date - The date string to format.
 * @param {"justYear"|"fullDate"} [format="justYear"] - The format type.
 * @returns {string} The formatted date.
 */
export const dateFormatter = (date, format = "justYear") => {
  const time = new Date(date);
  const year = time.getFullYear();
  const month = String(time.getMonth() + 1).padStart(2, "0");
  const day = String(time.getDate()).padStart(2, "0");
  if (format === "justYear") return `${year}-${month}-${day}`;
  const hoursFormat =
    time.getHours() > 12 ? time.getHours() - 12 : time.getHours();
  const at = time.getHours() > 12 ? "PM" : "AM";
  const hours = String(hoursFormat).padStart(2, "0");
  const minutes = String(time.getMinutes()).padStart(2, "0");
  const seconds = String(time.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} / ${hours}:${minutes}:${seconds} ${at}`;
};
