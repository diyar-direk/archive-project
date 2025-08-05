import { useContext, useEffect, useMemo } from "react";
import { baseURL, Context } from "../context/context";
import axios from "axios";
const useLanguage = () => {
  const context = useContext(Context);
  const language = context?.selectedLang;
  const { token, role } = context.userDetails;
  const { expiredExports, setExpiredExports } = context;

  useEffect(() => {
    if (expiredExports >= 0 || role !== "admin") return;
    axios
      .get(`${baseURL}/exports/countExpiredExports`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setExpiredExports(res.data.count))
      .catch((err) => console.log(err));
  }, [expiredExports, token, setExpiredExports, role]);

  const links = useMemo(
    () => [
      {
        icon: "fa-solid fa-chart-column",
        children: [
          {
            title: language?.header?.statistics || "Statistics",
            path: "status",
            role: ["admin", "user"],
          },
        ],
        title: language?.header?.statistics || "Statistics",
        role: ["admin", "user"],
      },

      {
        icon: "fa-solid fa-user-group",
        children: [
          { title: language?.header?.users, path: "users", role: ["admin"] },
          {
            title: language?.header?.add_users,
            path: "add_user",
            role: ["admin"],
          },
        ],
        title: language?.header?.users,
        role: ["admin"],
      },
      {
        icon: "fa-solid fa-people-group",
        children: [
          {
            title: language?.header?.people,
            path: "people",
            role: ["admin", "user"],
          },
          {
            title: language?.header?.add_person,
            path: "add_person",
            role: ["admin", "user"],
          },
        ],
        title: language?.header?.people,
        role: ["admin", "user"],
      },
      {
        icon: "fa-solid fa-map-location-dot",
        children: [
          {
            title: language?.header?.countries,
            path: "countries",
            role: ["admin", "user"],
          },
          {
            title: language?.header?.governments,
            path: "governorates",
            role: ["admin", "user"],
          },
          {
            title: language?.header?.counties,
            path: "counties",
            role: ["admin", "user"],
          },
          {
            title: language?.header?.cities,
            path: "cities",
            role: ["admin", "user"],
          },
          {
            title: language?.header?.villages,
            path: "villages",
            role: ["admin", "user"],
          },
          {
            title: language?.header?.streets,
            path: "streets",
            role: ["admin", "user"],
          },
          {
            title: language?.header?.regions,
            path: "regions",
            role: ["admin", "user"],
          },
        ],
        title: language?.header?.adress,
        role: ["admin", "user"],
      },

      {
        icon: "fa-solid fa-layer-group",
        children: [
          {
            title: language?.header?.sections,
            path: "sections",
            role: ["admin", "user"],
          },
          {
            title: language?.header?.fields,
            path: "fields",
            role: ["admin", "user"],
          },
          {
            title: language?.header?.sources,
            path: "sources",
            role: ["admin", "user"],
          },
          {
            title: language?.header?.events,
            path: "event",
            role: ["admin", "user"],
          },
          {
            title: language?.header?.parties,
            path: "party",
            role: ["admin", "user"],
          },
        ],
        title: language?.header?.categories,
        role: ["admin", "user"],
      },
      {
        icon: "fa-solid fa-sitemap",
        children: [
          {
            title: language?.header?.information,
            path: "informations",
            role: ["admin", "user"],
          },
          {
            title: language?.header?.add_information,
            path: "add_information",
            role: ["admin", "user"],
          },
        ],
        title: language?.header?.information,
        role: ["admin", "user"],
      },
      {
        icon: "fa-solid fa-thumbtack",
        children: [
          {
            title: language?.header?.coordinates,
            path: "coordinates",
            role: ["admin", "user"],
          },
          {
            title: language?.header?.add_coordinates,
            path: "add_coordinates",
            role: ["admin", "user"],
          },
          {
            title: language?.header?.coord_map,
            path: "coordinates_map",
            role: ["admin", "user"],
          },
        ],
        title: language?.header?.coordinates,
        role: ["admin", "user"],
      },
      {
        icon: "fa-solid fa-file-import",
        element:
          expiredExports >= 0 ? (
            <div className="expired-exports-count">
              {expiredExports > 9 ? "+9" : expiredExports}
            </div>
          ) : null,
        children: [
          {
            title: language?.header?.incoming,
            path: "exports",
            role: ["admin"],
            element:
              expiredExports >= 0 ? (
                <div className="expired-exports-count">
                  {expiredExports > 9 ? "+9" : expiredExports}
                </div>
              ) : null,
          },
          {
            title: language?.header?.add_export,
            path: "add_export",
            role: ["admin"],
          },
        ],
        title: language?.header?.outgoing_incoming || "Exports",
        role: ["admin"],
      },
      {
        icon: "fa-solid fa-rectangle-list",
        children: [
          {
            title: language?.header?.reports,
            path: "reports",
            role: ["admin"],
          },
          {
            title: language?.header?.add_report,
            path: "add_report",
            role: ["admin"],
          },
          {
            title: language?.header?.results,
            path: "results",
            role: ["admin"],
          },
          {
            title: language?.header?.add_result,
            path: "add_result",
            role: ["admin"],
          },
        ],
        title: language?.header?.reports_results,
        role: ["admin"],
      },

      {
        icon: "fa-solid fa-folder-open",
        children: [
          {
            title: language?.header?.backUps,
            path: "backup",
            role: ["admin"],
          },
        ],
        title: language?.header?.backUps,
        role: ["admin"],
      },
    ],
    [language, expiredExports]
  );

  return { language, links };
};

export default useLanguage;
