export const eduLearningManagement = {
  id: "MENU_EDUCATION_LEARNING_MANAGEMENT_STUDENT",
  path: "",
  isPublic: false,
  icon: "LocalLibraryIcon",
  text: "Học tập",
  child: [
    {
      id: "MENU_EDUCATION_LEARNING_MANAGEMENT_STUDENT_REGISTER_CLASS",
      path: "/edu/class/register",
      isPublic: false,
      icon: null,
      text: "Đăng ký lớp",
      child: [],
    },
    {
      id: "MENU_EDUCATION_LEARNING_MANAGEMENT_STUDENT_VIEW_LIST_CLASS",
      path: "/edu/student/class/list",
      isPublic: false,
      icon: null,
      text: "Danh sách lớp",
      child: [],
    },
    {
      id: "MENU_EDUCATION_TEACHING_MANAGEMENT_STUDENT_QUIZ_TEST_LIST",
      path: "/edu/class/student/quiztest/list",
      isPublic: false,
      icon: null,
      text: "Quiz Test",
      child: [],
    },

    {
      id: "MENU_EDUCATION_ASSIGNMENT_EXECUTION",
      path: "/edu/student/contestprogramming",
      isPublic: true,
      icon: null,
      text: "Programming Contest",
      child: [],
    },
  ],
};
