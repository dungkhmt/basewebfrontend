import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import vi from "./vi";
import en from "./en";

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  lng: "vi",
  debug: true,
  resources: {
    en,
    vi
  }
});

export default i18n;
