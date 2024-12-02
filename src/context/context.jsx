import axios from "axios";
import { createContext, useEffect, useState } from "react";
const userLanguage = navigator.language || navigator.userLanguage;
const userLang = userLanguage.startsWith("ar") ? "AR" : "EN";
export const Context = createContext({});
const Provider = ({ children }) => {
  const [mode, setMode] = useState(+localStorage.getItem("isDark") || false);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || userLang || "EN"
  );
  const [isClosed, setIsClosed] = useState(
    JSON.parse(localStorage.getItem("isClosed")) || false
  );
  const [selectedLang, setSelectedLang] = useState("");
  const [userDetails, setUserDetails] = useState({
    isAdmin: false,
    token: "",
    userDetails: {},
    role: "",
  });

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
      }}
    >
      {children}
    </Context.Provider>
  );
};
export default Provider;
