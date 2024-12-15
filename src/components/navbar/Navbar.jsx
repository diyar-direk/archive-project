import { Link, NavLink, useLocation } from "react-router-dom";
import "./navbar.css";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { Context } from "../../context/context";
const Navbar = () => {
  const context = useContext(Context);
  const location = useLocation();

  window.addEventListener("click", () => {
    const langDiv = document.querySelector(
      "nav .setting .lang + div.languages.active-div"
    );
    langDiv && langDiv.classList.remove("active-div");
    const linksDiv = document.querySelector(
      "aside.closed >div> div > .links.active"
    );
    if (linksDiv) {
      linksDiv.classList.remove("active");
      document.querySelector("main").classList.remove("div-open");
    }
    const shortCut = document.querySelector(".short-cut i.plus");
    shortCut && shortCut.classList.remove("active");
  });

  const modeFun = () => {
    document.body.classList.toggle("dark");
    context.setMode(document.body.classList.contains("dark"));
  };

  const openDiv = (ele) => {
    ele.stopPropagation();
    const allDivs = document.querySelectorAll(
      "aside >div> div > .links > .center"
    );
    allDivs.forEach((e) => {
      ele.target !== e && e.parentElement.classList.remove("active");
    });
    ele.target.parentElement.classList.toggle("active");
    if (document.querySelector("aside.closed")) {
      const main = document.querySelector("main");
      main && main.classList.toggle("div-open");
    }
  };

  useEffect(() => {
    const linksDiv = document.querySelectorAll("aside .links");
    const removeClass = document.querySelectorAll(
      "aside >div> div > .links > div.center"
    );
    removeClass && removeClass.forEach((e) => e.classList.remove("active"));
    linksDiv &&
      linksDiv.forEach((e) => {
        e.childNodes[1].childNodes.forEach((a) => {
          if (a.classList.contains("active")) {
            e.childNodes[0].classList.add("active");
          }
        });
      });
    const nav = document.querySelector("nav.closed");
    const container = document.querySelector(".dashboard-container");
    nav && container && container.classList.add("closed");
    const activeArticle = document.querySelector(
      "aside >div> div > .links.active"
    );
    activeArticle && activeArticle.classList.remove("active");
  }, [location.pathname]);

  const closeAside = () => {
    const nav = document.querySelector("nav");
    nav && nav.classList.toggle("closed");
    localStorage.setItem("isClosed", nav.classList.contains("closed"));
    context?.setIsClosed(nav.classList.contains("closed"));
  };

  const selectLang = (e) => {
    context.setLanguage(e.target.dataset.lang);
  };
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };
  return (
    <>
      <nav className={`${context?.isClosed ? "closed" : ""} center`}>
        <div className="container between gap-20">
          <Link to={"/s"} className="search flex-1 center">
            <span className="flex-1">search for somthing</span>
            <button className="fa-solid fa-magnifying-glass"></button>
          </Link>
          <div className="setting center">
            <i
              onClick={modeFun}
              className="fa-solid fa-moon fa-regular mode"
            ></i>
            <article className="relative">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  document
                    .querySelector("nav .setting .lang + div.languages")
                    .classList.toggle("active-div");
                }}
                className="lang center"
              >
                <i className="fa-solid fa-earth-americas"></i>
              </div>
              <div className="languages">
                <h2
                  className={`${context?.language === "AR" ? "active" : ""}`}
                  onClick={selectLang}
                  data-lang="AR"
                >
                  عربي
                </h2>
                <h2
                  onClick={selectLang}
                  className={`${context?.language === "EN" ? "active" : ""}`}
                  data-lang="EN"
                >
                  english
                </h2>
                <h2
                  onClick={selectLang}
                  className={`${context?.language === "KU" ? "active" : ""}`}
                  data-lang="KU"
                >
                  kurdish
                </h2>
              </div>
            </article>
            <h4 className="c-pointer log-out center" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket"></i> log out
            </h4>
          </div>
        </div>
      </nav>

      <aside className={`${context?.isClosed ? "closed" : ""}`}>
        <article className="between">
          <Link className="center">
            <i className="fa-solid fa-box-archive"></i>
            <h1>archive</h1>
          </Link>
          <i onClick={closeAside} className="fa-solid fa-bars-staggered"></i>
        </article>

        <div className="flex-direction flex between gap-20">
          <div className="flex-direction flex gap-10">
            <div className="links">
              <div onClick={openDiv} className="center">
                <i className="fa-solid fa-user-group"></i>
                <h1 className="flex-1">users</h1>
                <i className="arrow fa-solid fa-chevron-right"></i>
              </div>
              <article>
                <NavLink to={"all_admins"}>all users</NavLink>
                <NavLink to={"add_admin"}>add user</NavLink>
              </article>
            </div>

            <div className="links">
              <div onClick={openDiv} className="center">
                <i className="fa-solid fa-people-group"></i>
                <h1 className="flex-1">pepole</h1>
                <i className="arrow fa-solid fa-chevron-right"></i>
              </div>
              <article>
                <NavLink to={"/people"}>people</NavLink>
                <NavLink to={"/add_person"}>add person</NavLink>
              </article>
            </div>

            <NavLink to={"classes"} className="w-100 justify-start center">
              <i className="fa-solid fa-school-flag"></i>
              <h1>te</h1>
            </NavLink>
          </div>
          <h3 className="log-out center c-pointer aside">
            <i className="fa-solid fa-right-from-bracket"></i>
            <span onClick={handleLogout}>fs </span>
          </h3>
        </div>
      </aside>

      <div className="short-cut">
        <i
          onClick={(e) => {
            e.stopPropagation();
            e.target.classList.toggle("active");
          }}
          className="plus fa-solid fa-chevron-down"
        ></i>
        <div className="short-links flex-direction center gap-10 flex">
          <Link className="fa-solid fa-house"></Link>
          <Link className="fa-solid fa-house"></Link>
          <Link className="fa-solid fa-house"></Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
