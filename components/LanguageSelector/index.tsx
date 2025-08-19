import React, {useState} from "react";
import {useLanguage} from "@hooks/useLanguage";

interface LanguageSelectorProps {
  onClose: () => void;
}

export default function LanguageSelector({onClose}: LanguageSelectorProps): JSX.Element {
  const {currentLanguage, changeLanguage, languageOptions} = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode as any);
    // Chỉ cập nhật state local, không đóng modal
  };

  const handleClose = () => {
    changeLanguage(selectedLanguage as any); // Cập nhật ngôn ngữ thật khi đóng
    onClose();
  };

  return (
    <div style={{padding: 12}}>
      <h4 style={{marginBottom: 10}}>Select Language</h4>
      <div style={{display: "grid", gap: 8}}>
        {languageOptions.map((lang) => (
                      <button 
              key={lang.value}
              className={`item ${selectedLanguage === lang.value ? "active" : ""}`}
              onClick={() => handleLanguageChange(lang.value)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px",
              border: selectedLanguage === lang.value ? "2px solid #1890ff" : "1px solid #d9d9d9",
              borderRadius: "8px",
                              background: selectedLanguage === lang.value ? "#f0f8ff" : "white",
              cursor: "pointer",
              width: "100%",
              textAlign: "left"
            }}
          >
            <span style={{fontSize: "16px"}}>{lang.flag}</span>
            <span>{lang.label}</span>
                            {selectedLanguage === lang.value && (
                  <span style={{marginLeft: "auto", color: "#1890ff"}}>✓</span>
                )}
          </button>
        ))}
      </div>
      <div style={{marginTop: 12, textAlign: "right"}}>
        <button 
          className="primary" 
          onClick={handleClose}
          style={{
            padding: "8px 16px",
            background: "#1890ff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
