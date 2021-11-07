export const DataAdministration = {
  id: "MENU_DATA_ADMIN",
  path: "",
  isPublic: false,
  icon: "LocalLibraryIcon",
  text: "Quản trị dữ liệu",
  child: [
    {
      id: "MENU_DATA_ADMIN_NOTIFICATIONS",
      path: "/admin/data/notifications/list",
      isPublic: false,
      icon: null,
      text: "Notifications",
      child: [],
    },
    {
      id: "MENU_DATA_ADMIN_VIEW_COURSE_VIDEO",
      path: "/admin/data/view-course-video/list",
      isPublic: false,
      icon: null,
      text: "View course video",
      child: [],
    },
  ],
};
