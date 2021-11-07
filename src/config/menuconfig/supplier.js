export const supplier = {
  id: "MENU_SUPPLIER_MANAGEMENT",
  path: "",
  isPublic: false,
  icon: "HomeSharpIcon",
  text: "QL nhà cung cấp",
  child: [
    {
      id: "MENU_SUPPLIER_MANAGEMENT_CREATE",
      path: "/supplier/list",
      isPublic: false,
      icon: "StarBorder",
      text: "DS nhà cung cấp",
      child: [],
    },
    {
      id: "MENU_SUPPLIER_MANAGEMENT_LIST",
      path: "/supplier/create",
      isPublic: false,
      icon: "StarBorder",
      text: "Tạo mới nhà cung cấp",
      child: [],
    },
  ],
};
