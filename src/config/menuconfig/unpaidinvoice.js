export const unpaidinvoice = {
  id: "MENU_UNPAID_INVOICE",
  path: "",
  isPublic: false,
  icon: "DescriptionIcon",
  text: "Báo cáo công nợ",
  child: [
    {
      id: "",
      path: "/invoice-group/distributor-unpaid-invoice/list",
      isPublic: true,
      icon: "StarBorder",
      text: "Công nợ của nhà phân phối",
      child: [],
    },
    {
      id: "",
      path: "/retail-outlet-unpaid-invoice/list",
      isPublic: true,
      icon: "StarBorder",
      text: "Công nợ của đại lí bán lẻ",
      child: [],
    },
  ],
};
