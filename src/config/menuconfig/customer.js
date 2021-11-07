export const customer = {
  id: "MENU_CUSTOMER",
  path: "",
  isPublic: false,
  icon: "PeopleOutlineIcon",
  text: "QL Khách hàng",
  child: [
    {
      id: "MENU_CUSTOMER_CREATE",
      path: "/customer/create",
      isPublic: false,
      icon: "StarBorder",
      text: "Tạo mới KH",
      child: [],
    },
    {
      id: "MENU_CUSTOMER_VIEW",
      path: "/customer/list",
      isPublic: false,
      icon: "StarBorder",
      text: "Danh sách KH",
      child: [],
    },
  ],
};
