export const eduTeachingManagement = {
  id: "MENU_EDUCATION_TEACHING_MANAGEMENT_TEACHER",
  path: "",
  isPublic: false,
  icon: "GiTeacher",
  text: "Quản lý giảng dạy",
  child: [
    {
      id: "MENU_EDUCATION_TEACHING_MANAGEMENT_TEACHER_VIEW_LIST_CLASS",
      path: "/edu/teacher/class/list",
      isPublic: false,
      icon: null,
      text: "Danh sách lớp",
      child: [],
    },
    {
      id: "MENU_EDUCATION_TEACHING_MANAGEMENT_TEACHER_CREATE_CLASS",
      path: "/edu/class/add",
      isPublic: false,
      icon: null,
      text: "Tạo lớp",
      child: [],
    },
  ],
};
