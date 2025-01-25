import { Link, NavLink, useLocation } from "react-router-dom";
import "./navbar.css";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../context/context";
import { links } from "./links";

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
    if (window.innerWidth <= 500) {
      const nav = document.querySelector("nav");
      if (!nav.classList.contains("closed")) {
        nav && nav.classList.add("closed");
        localStorage.setItem("isClosed", true);
        context?.setIsClosed(true);
      }
    }
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

  const pagesLinks = links?.map((link, i) => {
    return (
      <div title={link.title} key={i} className="links">
        <div onClick={openDiv} className="center">
          <i className={link.icon}></i>
          <h1 className="flex-1">{link.title}</h1>
          <i className="arrow fa-solid fa-chevron-right"></i>
        </div>
        <article>
          {link?.children?.map((e, i) => (
            <NavLink key={i} to={e.path}>
              {e.title}
            </NavLink>
          ))}
        </article>
      </div>
    );
  });

  const [form, setForm] = useState("");
  const nav = useNavigate();

  const search = () => {
    let reasult = [];
    if (form.length > 0) {
      links?.forEach((link, i) => {
        link?.children?.forEach((e) => {
          if (
            e.title?.toLowerCase().includes(form.toLowerCase()) ||
            e.path.toLowerCase().includes(form.toLowerCase())
          ) {
            reasult.push(
              <Link key={e.path} onClick={() => setForm("")} to={e.path}>
                {e.title || "Unnamed"}
              </Link>
            );
          }
        });
      });
    }
    if (reasult.length === 0) {
      reasult.push(<p key={1}>no result found</p>);
    }
    return reasult;
  };

  const searchClick = (e) => {
    e.preventDefault();
    if (form.length > 0) {
      const matchedPage = links?.find((link) =>
        link?.children?.some(
          (child) =>
            child.title.toLowerCase().includes(form.toLowerCase()) ||
            child.path.toLowerCase().includes(form.toLowerCase())
        )
      );

      if (matchedPage) {
        const matchedChild = matchedPage.children.find(
          (child) =>
            child.title.toLowerCase().includes(form.toLowerCase()) ||
            child.path.toLowerCase().includes(form.toLowerCase())
        );

        if (matchedChild) {
          nav(matchedChild.path);
        }
      } else {
        const path = form.replaceAll(" ", "_");
        nav(`/dashboard/${path}`);
      }
      setForm("");
    }
  };

  return (
    <>
      <nav className={`${context?.isClosed ? "closed" : ""} center`}>
        <div className="container between gap-20">
          <form
            onSubmit={searchClick}
            className="relative search flex-1 center"
          >
            <input
              required
              value={form}
              onChange={(e) => setForm(e.target.value)}
              type="text"
              className="flex-1"
              placeholder="search for pages"
            />
            <button className="fa-solid fa-magnifying-glass"></button>
            {form.length > 0 && <div className="results"> {search()} </div>}
          </form>
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
          <i
            onClick={(e) => {
              e.stopPropagation();
              closeAside();
            }}
            className="fa-solid fa-bars-staggered"
          ></i>
        </article>

        <div className="flex-direction flex between gap-20">
          <div className="flex-direction flex gap-10">{pagesLinks}</div>

          <div>
            <span onClick={context?.toggleButtonVisibility}>
              <div className="center c-pointer">
                {!context?.showButton ? (
                  <>
                    <h3 className="log-out center aside">
                      <i className="fa-solid fa-eye"></i>
                      <span>hidden short-cut</span>
                    </h3>
                  </>
                ) : (
                  <>
                    <h3 className="log-out center aside">
                      <i className="fa-solid fa-eye-slash"> </i>
                      <span>show short-cut</span>
                    </h3>
                  </>
                )}
              </div>
            </span>
            <h3 className="log-out center c-pointer aside">
              <i className="fa-solid fa-right-from-bracket"></i>
              <span onClick={handleLogout}>log out </span>
            </h3>
          </div>
        </div>
      </aside>

      <div className="short-cut">
        {!context?.showButton && (
          <i
            onClick={(e) => {
              e.stopPropagation();
              e.target.classList.toggle("active");
            }}
            className="plus fa-solid fa-chevron-down"
          ></i>
        )}
        <div className="short-links flex-direction center gap-10 flex">
          <Link className="fa-solid fa-house" href="#"></Link>
          <Link className="fa-solid fa-house" href="#"></Link>
          <Link className="fa-solid fa-house" href="#"></Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
