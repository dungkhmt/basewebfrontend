export const lake_mgr = {
  id: "MENU_LAKE_MANAGEMENT",
  path: "",
  isPublic: false,
  icon: "InboxIcon",
  text: "QL hồ đập",
  child: [
    {
      id: "MENU_CREATE_LAKE",
      path: "/lake/create",
      isPublic: false,
      icon: "StarBorder",
      text: "Thêm mới hồ đập",
      child: [],
    },
    {
      id: "MENU_VIEW_ALL_LAKE",
      path: "/lake/listall",
      isPublic: false,
      icon: "StarBorder",
      text: "DS Tất cả Hồ đập",
      child: [],
    },
    {
      id: "MENU_VIEW_OWN_LAKE",
      path: "/lake/list",
      isPublic: false,
      icon: "StarBorder",
      text: "DS hồ đập",
      child: [],
    },
  ],
};
