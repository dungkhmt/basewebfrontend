export const order = {
  id: "MENU_ORDER",
  path: "",
  isPublic: false,
  icon: "DescriptionOutlinedIcon",
  text: "Đơn hàng",
  child: [
    {
      id: "MENU_ORDER_CREATE",
      path: "/orders/create",
      isPublic: false,
      icon: "StarBorder",
      text: "Tạo mới",
      child: [],
    },
    {
      id: "MENU_ORDER_LIST",
      path: "/orders/list",
      isPublic: false,
      icon: "StarBorder",
      text: "DS Đơn Hàng",
      child: [],
    },
  ],
};
