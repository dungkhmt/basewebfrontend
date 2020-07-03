export const purchaseorder = {
  id: "MENU_PURCHASE_ORDER",
  path: "",
  isPublic: true,
  icon: "HomeSharpIcon",
  text: "Mua hàng",
  child: [
    {
      id: "",
      path: "/purchase-order/list",
      isPublic: true,
      icon: "StarBorder",
      text: "DS đơn mua",
      child: [],
    },
    {
      id: "",
      path: "/supplier/list",
      isPublic: true,
      icon: "StarBorder",
      text: "DS nhà cung cấp",
      child: [],
    },
  ],
};
