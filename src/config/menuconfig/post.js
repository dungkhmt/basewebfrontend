export const post = {
  id: "MENU_POST",
  path: "",
  isPublic: false,
  icon: "ApartmentSharpIcon",
  text: "QL chuyển phát bưu kiện",
  child: [
    {
      id: "MENU_POST_VIEW_VEHICLE",
      path: "/postoffice/triplist",
      isPublic: false,
      icon: "StarBorder",
      text: "Danh sách phương tiện",
      child: [],
    },
    {
      id: "MENU_POST_VIEW_CUSTOMER",
      path: "/postoffice/userlist",
      isPublic: false,
      icon: "StarBorder",
      text: "Danh sách khách hàng",
      child: [],
    },
    {
      id: "MENU_POST_VIEW_POST_OFFICE",
      path: "/postoffice/list",
      isPublic: false,
      icon: "StarBorder",
      text: "DS bưu cục",
      child: [],
    },
    {
      id: "MENU_POST_VIEW_POST_ORDER",
      path: "/postoffice/orderlist",
      isPublic: false,
      icon: "StarBorder",
      text: "DS đơn hàng chuyển phát",
      child: [],
    },
    {
      id: "MENU_POST_CREATE_POST_ORDER",
      path: "",
      isPublic: false,
      icon: "StarBorder",
      text: "Tạo mới đợt chuyển phát",
      child: [],
    },
    {
      id: "MENU_POST_VIEW_PACKAGE_PICKUP_PLAN",
      path: "/postoffice/pickanddelivery",
      isPublic: false,
      icon: "StarBorder",
      text: "Lập kế hoạch thu gom bưu kiện",
      child: [],
    },
    {
      id: "MENU_POST_VIEW_PACKAGE_DELIVERY_PLAN",
      path: "",
      isPublic: false,
      icon: "StarBorder",
      text: "Lập kế hoạch phát bưu kiện",
      child: [],
    },
    {
      id: "MENU_POST_CREATE_POST_SHIP_ORDER",
      path: "/postoffice/createshiporder",
      isPublic: false,
      icon: "StarBorder",
      text: "Tạo đơn chuyển phát",
      child: [],
    },
    {
      id: "MENU_POST_CREATE_EXECUTE_POST_TRIP",
      path: "/postoffice/executetrip",
      isPublic: false,
      icon: "StarBorder",
      text: "Thực thi chuyến xe",
      child: [],
    },
    {
      id: "MENU_POST_MAN_VIEW_POST_ASSIGNMENT",
      path: "/postoffice/view-postman-assignment",
      isPublic: false,
      icon: "StarBorder",
      text: "Xem đơn hàng cần giao và nhận",
      child: [],
    },
    {
      id: "MENU_POST_MAN_VIEW_POST_TRIP",
      path: "/postoffice/view-post-driver-post-trip",
      isPublic: false,
      icon: "StarBorder",
      text: "Xem thông tin chuyến xe",
      child: [],
    },
    {
      id: "MENU_POSTMAN_MANAGE",
      path: "/postoffice/manage-postman",
      isPublic: false,
      icon: "StarBorder",
      text: "Quản lý người vận chuyển",
      child: [],
    }
  ],
};
