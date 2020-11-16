export const backlog = {
  id: "MENU_BACKLOG",
  path: "",
  isPublic: false,
  icon: "BlurOnIcon",
  text: "Theo dõi dự án",
  child: [
    {
      id: "MENU_BACKLOG_VIEW_LIST_PROJECT",
      path: "/backlog/project-list",
      isPublic: false,
      icon: "StarBorder",
      text: "DS dự án",
      child: [],
    },
    {
      id: "MENU_BACKLOG_CREATE_PROJECT",
      path: "/backlog/create-project",
      isPublic: false,
      icon: "StarBorder",
      text: "Tạo mới dự án",
      child: [],
    },
    {
      id: "MENU_BACKLOG_ASSIGN_SUGGESTION",
      path: "/backlog/assign-suggestion/project-list",
      isPublic: false,
      icon: "StarBorder",
      text: "Gợi ý phân công công việc",
      child: [],
    },
  ],
};
