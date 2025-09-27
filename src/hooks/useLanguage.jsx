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
            path: "/people/people",
            role: ["admin", "user"],
          },
          {
            title: language?.header?.add_person,
            path: "/people/add_person",
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
            path: "/addresses/countries",
            role: ["admin", "user"],
          },
          {
            title: language?.header?.governments,
            path: "/addresses/governorates",
            role: ["admin", "user"],
          },
          {
            title: language?.header?.counties,
            path: "/addresses/counties",
            role: ["admin", "user"],
          },
          {
            title: language?.header?.cities,
            path: "/addresses/cities",
            role: ["admin", "user"],
          },
          {
            title: language?.header?.villages,
            path: "/addresses/villages",
            role: ["admin", "user"],
          },
          {
            title: language?.header?.streets,
            path: "/addresses/streets",
            role: ["admin", "user"],
          },
          {
            title: language?.header?.regions,
            path: "/addresses/regions",
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
            path: "/categories/sections",
            role: ["admin", "user"],
          },
          {
            title: language?.header?.departments,
            path: "/categories/departments",
            role: ["admin", "user"],
          },
          {
            title: language?.header?.fields,
            path: "/categories/fields",
            role: ["admin", "user"],
          },
          {
            title: language?.header?.sources,
            path: "/categories/sources",
            role: ["admin", "user"],
          },
          {
            title: language?.header?.events,
            path: "/categories/event",
            role: ["admin", "user"],
          },
          {
            title: language?.header?.parties,
            path: "/categories/party",
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
            path: "/coordinates/coordinates",
            role: ["admin", "user"],
          },
          {
            title: language?.header?.add_coordinates,
            path: "/coordinates/add_coordinates",
            role: ["admin", "user"],
          },
          {
            title: language?.header?.coord_map,
            path: "/coordinates/coordinates_map",
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
          {
            title: language?.header?.recipients,
            path: "recipients",
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
      {
        icon: "fa-solid fa-comments",
        children: [
          {
            title: "chat",
            path: "chat",
            role: ["admin", "user"],
          },
        ],
        title: "chat",
        role: ["admin", "user"],
      },
    ],
    [language, expiredExports]
  );

  return { language, links };
};

export default useLanguage;
