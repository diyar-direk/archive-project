import axios from "axios";
import { createContext, useEffect, useState } from "react";
const userLanguage = navigator.language || navigator.userLanguage;
const userLang = userLanguage?.startsWith("ar") ? "AR" : "EN";
export const Context = createContext({});

export const baseURL = `http://192.19.19.1:8000/api`;
export const mediaURL = `http://192.19.19.1:8000/files`;

const Provider = ({ children }) => {
  const [progressBar, setProgress] = useState(false);
  const [limit, setLimit] = useState(10);
  const [mode, setMode] = useState(+localStorage.getItem("isDark") || false);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || userLang || "EN"
  );
  const [isClosed, setIsClosed] = useState(
    JSON.parse(localStorage.getItem("isClosed")) || false
  );
  const [showButton, setShowButton] = useState(
    JSON.parse(localStorage.getItem("short-cut")) || false
  );

  const toggleButtonVisibility = () => {
    localStorage.setItem("short-cut", !showButton);
    setShowButton((prev) => !prev);
  };

  const [selectedLang, setSelectedLang] = useState("");
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    localStorage.setItem("isDark", mode ? 1 : 0);
    mode && document.body.classList.add("dark");
  }, [mode]);

  useEffect(() => {
    const h2Active = document.querySelector(".languages h2.active");
    const h2 = document.querySelectorAll(".languages h2");
    h2Active && h2Active.classList.remove("active");
    localStorage.setItem("language", language);
    if (h2) {
      h2.forEach(
        (e) => e.dataset.lang === language && e.classList.add("active")
      );
    }
    if (language === "AR") document.body.classList.add("arabic");
    else document.body.classList.remove("arabic");
  }, [language]);
  const getLang = async () => {
    try {
      const data = await axios.get(`/${language && language}.json`);
      setSelectedLang(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getLang();
  }, [language]);

  const [expiredExports, setExpiredExports] = useState(-1);

  return (
    <Context.Provider
      value={{
        isClosed,
        setIsClosed,
        setMode,
        language,
        setLanguage,
        selectedLang,
        userDetails,
        setUserDetails,
        toggleButtonVisibility,
        showButton,
        limit,
        setLimit,
        setProgress,
        progressBar,
        mode,
        expiredExports,
        setExpiredExports,
      }}
    >
      {children}
    </Context.Provider>
  );
};
export default Provider;

export const placeholder = `pleace write`;
export const searchPlaceholder = `search for`;
