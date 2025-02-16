export const links = [
  {
    icon: "fa-solid fa-user-group",
    children: [
      { title: "users", path: "/dashboard/users", role: ["admin"] },
      { title: "add user", path: "/dashboard/add_user", role: ["admin"] },
    ],
    title: "users",
    role: ["admin"],
  },
  {
    icon: "fa-solid fa-people-group",
    children: [
      { title: "people", path: "/dashboard/people", role: ["admin", "user"] },
      {
        title: "add person",
        path: "/dashboard/add_person",
        role: ["admin", "user"],
      },
    ],
    title: "people",
    role: ["admin", "user"],
  },
  {
    icon: "fa-solid fa-map-location-dot",
    children: [
      {
        title: "countries",
        path: "/dashboard/countries",
        role: ["admin", "user"],
      },
      {
        title: "governments",
        path: "/dashboard/governments",
        role: ["admin", "user"],
      },
      { title: "cities", path: "/dashboard/cities", role: ["admin", "user"] },
      {
        title: "villages",
        path: "/dashboard/villages",
        role: ["admin", "user"],
      },
      { title: "streets", path: "/dashboard/streets", role: ["admin", "user"] },
      { title: "regions", path: "/dashboard/regions", role: ["admin", "user"] },
    ],
    title: "Addresses",
    role: ["admin", "user"],
  },

  {
    icon: "fa-solid fa-layer-group",
    children: [
      {
        title: "sections",
        path: "/dashboard/sections",
        role: ["admin", "user"],
      },
      { title: "sources", path: "/dashboard/sources", role: ["admin", "user"] },
      { title: "event", path: "/dashboard/event", role: ["admin", "user"] },
      { title: "party", path: "/dashboard/party", role: ["admin", "user"] },
    ],
    title: "Catagories",
    role: ["admin", "user"],
  },
  {
    icon: "fa-solid fa-sitemap",
    children: [
      {
        title: "informations",
        path: "/dashboard/informations",
        role: ["admin", "user"],
      },
      {
        title: "add information",
        path: "/dashboard/add_information",
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
        path: "/dashboard/coordinates",
        role: ["admin", "user"],
      },
      {
        title: "add coordinates",
        path: "/dashboard/add_coordinates",
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
        path: "/dashboard/backup",
        role: ["admin"],
      },
    ],
    title: "back up",
    role: ["admin"],
  },
];
