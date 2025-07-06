import { useContext } from "react";
import { Context } from "../context/context";
const useLanguage = () => {
  const context = useContext(Context);
  const language = context?.selectedLang;

  const links = [
    {
      icon: "fa-solid fa-chart-column",
      children: [
        {
          title: "status",
          path: "status",
          role: ["admin", "user"],
        },
      ],
      title: "status",
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
      icon: "fa-solid fa-magnifying-glass",
      children: [
        {
          title: language?.header?.serach_by_image,
          path: "search_by_image",
          role: ["admin", "user"],
        },
      ],
      title: language?.header?.search,
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
          title: "lang.Counties",
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
          title: "Fields",
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
      ],
      title: language?.header?.coordinates,
      role: ["admin", "user"],
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
  ];

  return { language, links };
};

export default useLanguage;
