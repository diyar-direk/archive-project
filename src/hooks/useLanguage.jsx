import React, { useContext } from "react";
import { Context } from "../context/context";

const useLanguage = () => {
  const context = useContext(Context);
  const language = context?.language;

  const links = [
    {
      icon: "fa-solid fa-user-group",
      children: [
        { title: "users", path: "users", role: ["admin"] },
        { title: "add user", path: "add_user", role: ["admin"] },
      ],
      title: "users",
      role: ["admin"],
    },
    {
      icon: "fa-solid fa-people-group",
      children: [
        { title: "people", path: "people", role: ["admin", "user"] },
        {
          title: "add person",
          path: "add_person",
          role: ["admin", "user"],
        },
      ],
      title: "people",
      role: ["admin", "user"],
    },
    {
      icon: "fa-solid fa-magnifying-glass",
      children: [
        {
          title: "search by image",
          path: "search_by_image",
          role: ["admin", "user"],
        },
      ],
      title: "search",
      role: ["admin", "user"],
    },
    {
      icon: "fa-solid fa-map-location-dot",
      children: [
        {
          title: "countries",
          path: "countries",
          role: ["admin", "user"],
        },
        {
          title: "governments",
          path: "governments",
          role: ["admin", "user"],
        },
        { title: "cities", path: "cities", role: ["admin", "user"] },
        {
          title: "villages",
          path: "villages",
          role: ["admin", "user"],
        },
        { title: "streets", path: "streets", role: ["admin", "user"] },
        { title: "regions", path: "regions", role: ["admin", "user"] },
      ],
      title: "Addresses",
      role: ["admin", "user"],
    },

    {
      icon: "fa-solid fa-layer-group",
      children: [
        {
          title: "sections",
          path: "sections",
          role: ["admin", "user"],
        },
        { title: "sources", path: "sources", role: ["admin", "user"] },
        { title: "event", path: "event", role: ["admin", "user"] },
        { title: "party", path: "party", role: ["admin", "user"] },
      ],
      title: "Catagories",
      role: ["admin", "user"],
    },
    {
      icon: "fa-solid fa-sitemap",
      children: [
        {
          title: "informations",
          path: "informations",
          role: ["admin", "user"],
        },
        {
          title: "add information",
          path: "add_information",
          role: ["admin", "user"],
        },
      ],
      title: "informations",
      role: ["admin", "user"],
    },
    {
      icon: "fa-solid fa-thumbtack",
      children: [
        {
          title: "Coordinates",
          path: "coordinates",
          role: ["admin", "user"],
        },
        {
          title: "add coordinates",
          path: "add_coordinates",
          role: ["admin", "user"],
        },
      ],
      title: "Coordinates",
      role: ["admin", "user"],
    },

    {
      icon: "fa-solid fa-folder-open",
      children: [
        {
          title: "back ups",
          path: "backup",
          role: ["admin"],
        },
      ],
      title: "back up",
      role: ["admin"],
    },
  ];

  return { language, links };
};

export default useLanguage;
