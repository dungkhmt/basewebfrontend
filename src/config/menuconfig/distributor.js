export const distributor = {
  id: "MENU_DISTRIBUTOR",
  path: "",
  isPublic: false,
  icon: "ApartmentSharpIcon",
  text: "QL Nhà Phân Phối",
  child: [
    {
      id: "MENU_CREATE_DISTRIBUTOR",
      path: "/distributor/create",
      isPublic: false,
      icon: "StarBorder",
      text: "Tạo mới NPP",
      child: [],
    },
    {
      id: "MENU_VIEW_DISTRIBUTOR",
      path: "/distributor/list",
      isPublic: false,
      icon: "StarBorder",
      text: "Danh sách NPP",
      child: [],
    },
    {
      id: "MENU_VIEW_ALL_DISTRIBUTOR",
      path: "/distributor/listall",
      isPublic: false,
      icon: "StarBorder",
      text: "Danh sách tất cả NPP",
      child: [],
    },
  ],
};
