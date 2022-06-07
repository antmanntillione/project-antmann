import i18n from "i18next";
import translationEN from "./en/translationEN.json";
import translationDE from "./de/translationDE.json";
import { initReactI18next } from "react-i18next";

/**
 * We use i18next to enable a multi-lingual frontend.
 * For more information about i18next see https://react.i18next.com .
 */
export const resources = {
  english: {
    translation: translationEN,
  },
  german: {
    translation: translationDE,
  },
};

i18n.use(initReactI18next).init({
  lng: "english",
  resources,
});

export default i18n;
