import {useState, useEffect} from "react";
import {uiLanguageOptions} from "@utils/constants/languageList";

export type LanguageCode = "en" | "vi" | "cn" | "ja" | "ko" | "th" | "id" | "ms" | "fr" | "de" | "es" | "ru";

export function useLanguage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>("en");

  useEffect(() => {
    // Lấy ngôn ngữ từ localStorage khi component mount
    const savedLanguage = localStorage.getItem("selectedLanguage") as LanguageCode;
    if (savedLanguage && uiLanguageOptions.find(lang => lang.value === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (languageCode: LanguageCode) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem("selectedLanguage", languageCode);
  };

  const getCurrentLanguageInfo = () => {
    return uiLanguageOptions.find(lang => lang.value === currentLanguage) || uiLanguageOptions[0];
  };

  return {
    currentLanguage,
    changeLanguage,
    getCurrentLanguageInfo,
    languageOptions: uiLanguageOptions,
  };
}
