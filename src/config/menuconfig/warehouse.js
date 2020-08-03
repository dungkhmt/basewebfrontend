export const warehouse = {
  id: "MENU_WAREHOUSE",
  path: "",
  isPublic: false,
  icon: "HomeSharpIcon",
  text: "QL Kho",
  child: [
    {
      id: "MENU_WAREHOUSE_IMPORT",
      path: "/inventory/import",
      isPublic: false,
      icon: "StarBorder",
      text: "Nhập kho",
      child: [],
    },
    {
      id: "MENU_WAREHOUSE_EXPORT",
      path: "/inventory/order",
      isPublic: false,
      icon: "StarBorder",
      text: "Xuất kho",
      child: [],
    },
    {
      id: "MENU_WAREHOUSE_INVENTORY_ITEM",
      path: "/inventory/list",
      isPublic: false,
      icon: "StarBorder",
      text: "QL tồn kho",
      child: [],
    },
  ],
};