import { createContext, useState } from "react";
import translations from "../translations/translations";

export const LanguageContext = createContext();

export default function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  const t = translations[language];

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}