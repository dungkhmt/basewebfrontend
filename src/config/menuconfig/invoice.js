export const invoice = {
  id: "MENU_INVOICE",
  path: "",
  isPublic: false,
  icon: "DescriptionIcon",
  text: "Hóa đơn",
  child: [
    {
      id: "MENU_INVOICE_CREATE",
      path: "",
      isPublic: false,
      icon: "StarBorder",
      text: "Tạo mới",
      child: [],
    },
    {
      id: "MENU_INVOICE_LIST",
      path: "/invoice-group/invoice-sales/list",
      isPublic: false,
      icon: "StarBorder",
      text: "DS hóa đơn thu",
      child: [],
    },
    {
      id: "MENU_INVOICE_LIST",
      path: "/payment-group/customer-payment/list",
      isPublic: false,
      icon: "StarBorder",
      text: "DS KH thanh toán",
      child: [],
    },
  ],
};
