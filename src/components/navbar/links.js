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
    title: "test",
    path: "/test",
    type: "single",
    role: ["admin", "user"],
  },
];
