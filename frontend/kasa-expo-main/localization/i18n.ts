import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import he from "./locales/he.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18nManager } from "react-native";
import * as Updates from "expo-updates";

const LANG_KEY = "app-language";
const fallbackLng = "en";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)

export const initI18n = async () => {
  const storedLang = await AsyncStorage.getItem(LANG_KEY);
  const deviceLang = i18n.language || fallbackLng;
  const lng = storedLang || (deviceLang === "he" ? "he" : "en");

  await i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources: {
        en: { translation: en },
        he: { translation: he },
      },
      lng: lng, // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
      // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
      // if you're using a language detector, do not define the lng option
      // compatibilityJSON: "v3",
      fallbackLng,
      interpolation: {
        escapeValue: false, // react already safes from xss
      },
    });

  // Handle RTL
  const isRTL = lng === "he";
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.forceRTL(isRTL);
  }

  return lng;
};

export const toggleLanguage = async () => {
  const currentLang = i18n.language;
  const nextLang = currentLang === "en" ? "he" : "en";
  await i18n.changeLanguage(nextLang);
  await AsyncStorage.setItem(LANG_KEY, nextLang);

  const isRTL = nextLang === "he";
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.forceRTL(isRTL);
    // await Updates.reloadAsync();
  }

  return nextLang;
};

export default i18n;
