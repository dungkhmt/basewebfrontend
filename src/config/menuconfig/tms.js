export const tms = {
  id: "MENU_TMS",
  path: "",
  isPublic: false,
  icon: "BlurOnIcon",
  text: "Kiểm soát lộ trình",
  child: [
    {
      id: "MENU_TMS_GISMAP",
      path: "/tracklocations/gismap",
      isPublic: true,
      icon: "StarBorder",
      text: "Bản đồ",
      child: [],
    },
    {
      id: "MENU_TMS_OSMAP",
      path: "/tracklocations/osmap",
      isPublic: true,
      icon: "StarBorder",
      text: "Bản đồ OSM",
      child: [],
    },

    {
      id: "MENU_TMS_LIST",
      path: "/tracklocations/list",
      isPublic: true,
      icon: "StarBorder",
      text: "Danh sách",
      child: [],
    },
  ],
};
