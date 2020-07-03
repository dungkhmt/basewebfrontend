export const productprice = {
  id: "MENU_PRODUCT_PRICE",
  path: "",
  isPublic: false,
  icon: "AttachMoneySharpIcon",
  text: "QL giá sản phẩm",
  child: [
    {
      id: "MENU_PRODUCT_PRICE_CREATE",
      path: "/distributor/create",
      isPublic: false,
      icon: "StarBorder",
      text: "Thiết lập giá sản phẩm",
      child: [],
    },
    {
      id: "MENU_PRODUCT_VIEW",
      path: "/distributor/list",
      isPublic: false,
      icon: "StarBorder",
      text: "Danh sách SP",
      child: [],
    },
  ],
};
