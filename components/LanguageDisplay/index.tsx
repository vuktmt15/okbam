import React from "react";
import {useLanguage} from "@hooks/useLanguage";

export default function LanguageDisplay(): JSX.Element {
  const {getCurrentLanguageInfo} = useLanguage();
  const currentLang = getCurrentLanguageInfo();

  return (
    <div style={{
      position: "fixed",
      top: "10px",
      right: "10px",
      background: "rgba(0,0,0,0.7)",
      color: "white",
      padding: "4px 8px",
      borderRadius: "12px",
      fontSize: "12px",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      gap: "4px"
    }}>
      <span>{currentLang.flag}</span>
      <span>{currentLang.label}</span>
    </div>
  );
}
