export const tmsreport = {
  id: "MENU_TMS_REPORT",
  path: "",
  isPublic: false,
  icon: "AirportShuttleIcon",
  text: "Báo cáo vận chuyển",
  child: [
    {
      id: "",
      path: "/report-group/transport-reports-by-driver",
      isPublic: true,
      icon: "StarBorder",
      text: "Báo cáo chuyến theo tài xế",
      child: [],
    },
    {
      id: "",
      path: "/report-group/transport-reports-by-customer",
      isPublic: true,
      icon: "StarBorder",
      text: "Báo cáo chuyến theo KH",
      child: [],
    },
    {
      id: "",
      path: "/report-group/transport-reports-by-facility",
      isPublic: true,
      icon: "StarBorder",
      text: "Báo cáo chuyến theo kho",
      child: [],
    },
  ],
};
