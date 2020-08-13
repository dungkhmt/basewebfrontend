export const purchaseorder = {
  id: "MENU_PURCHASE_ORDER_MANAGEMENT",
  path: "",
  isPublic: false,
  icon: "HomeSharpIcon",
  text: "Mua hàng",
  child: [
    {
      id: "MENU_PURCHASE_ORDER_MANAGEMENT_LIST",
      path: "/purchase-order/list",
      isPublic: false,
      icon: "StarBorder",
      text: "DS đơn mua",
      child: [],
    },
    {
      id: "MENU_PURCHASE_ORDER_MANAGEMENT_SUPPLIER_LIST",
      path: "/supplier/list",
      isPublic: false,
      icon: "StarBorder",
      text: "DS nhà cung cấp",
      child: [],
    },
    {
      id: "MENU_PURCHASE_ORDER_MANAGEMENT_PRODUCT_PRICE_PURCHASE_LIST",
      path: "/product-group/product-price-supplier/list",
      isPublic: false,
      icon: "StarBorder",
      text: "DS giá mua",
      child: [],
    },
  ],
};
