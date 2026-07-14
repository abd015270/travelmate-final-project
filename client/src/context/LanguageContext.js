import { createContext, useState } from "react";
import { I18nManager } from "react-native";

import translations from "../translations/translations";

export const LanguageContext = createContext();

export default function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  const t = translations[language];

  const isRTL = language === "ar" || language === "he";

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);

    if (newLanguage === "ar" || newLanguage === "he") {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(false);
    } else {
      I18nManager.allowRTL(false);
      I18nManager.forceRTL(false);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t,
        isRTL,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}