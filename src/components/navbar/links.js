export const links = [
  {
    type: "multi",
    icon: "fa-solid fa-user-group",
    children: [
      { title: "users", path: "users", role: ["admin"] },
      { title: "add_user", path: "add_user", role: ["admin"] },
    ],
    title: "users",
    role: ["admin"],
  },
  {
    icon: "fa-solid fa-people-group",
    children: [
      { title: "people", path: "/people", role: ["admin", "user"] },
      { title: "add person", path: "/add_person", role: ["admin"] },
    ],
    title: "people",
    type: "multi",
    role: ["admin", "user"],
  },
  {
    icon: "fa-solid fa-map-location-dot",
    children: [
      { title: "countries", path: "/countries", role: ["admin", "user"] },
      { title: "governments", path: "/governments", role: ["admin"] },
      { title: "cities", path: "/cities", role: ["admin"] },
      { title: "villages", path: "/villages", role: ["admin"] },
      { title: "streets", path: "/streets", role: ["admin"] },
      { title: "regions", path: "/regions", role: ["admin"] },
    ],
    title: "Addresses",
    type: "multi",
    role: ["admin", "user"],
  },

  {
    icon: "fa-solid fa-layer-group",
    children: [
      { title: "sections", path: "/sections", role: ["admin", "user"] },
      { title: "sources", path: "/sources", role: ["admin"] },
      { title: "event", path: "/event", role: ["admin", "user"] },
      { title: "party", path: "/party", role: ["admin"] },
    ],
    title: "Catagories",
    type: "multi",
    role: ["admin", "user"],
  },
  {
    icon: "fa-solid fa-sitemap",
    children: [
      { title: "informations", path: "/infromations", role: ["admin", "user"] },
      { title: "add information", path: "/add_information", role: ["admin"] },
    ],
    title: "informations",
    type: "multi",
    role: ["admin", "user"],
  },
  {
    icon: "fa-solid fa-map-location-dot",
    title: "test",
    path: "/test",
    type: "single",
    role: ["admin", "user"],
  },
];
