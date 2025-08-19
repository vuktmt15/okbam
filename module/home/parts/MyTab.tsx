import React, {useContext, useState} from "react";
import BottomSheet from "@components/BottomSheet";
import {BellOutlined, GlobalOutlined, SettingOutlined} from "@ant-design/icons";
import {MyTabContext} from "./context";
import {useLanguage} from "@hooks/useLanguage";
import LanguageSelector from "@components/LanguageSelector";

export default function MyTab(): JSX.Element {
  const {goWithdraw} = useContext(MyTabContext);
  const [openLang, setOpenLang] = useState(false);
  const {currentLanguage, changeLanguage, getCurrentLanguageInfo, languageOptions} = useLanguage();
  return (
    <div className="okbam-my">
      <div className="profile">
        <div className="row top">
          <div className="left">
            <div className="avatar">🧸</div>
            <div className="info">
              <div className="email">Hoa****@gmail.com</div>
              <div className="id">ID: 8621559</div>
            </div>
          </div>
          <div className="icons">
            <GlobalOutlined />
            <BellOutlined />
            <SettingOutlined />
          </div>
        </div>
        <div className="notice">User*** successfully recharged 830USDT</div>
        <div className="wallet">
          <div className="wallet-title">Wallet Balance:</div>
          <div className="assets">
            <div className="asset"><b>6</b>USDT</div>
            <div className="asset"><b>0</b>TRX</div>
          </div>
        </div>
        <div className="quick">
          <button>Deposit</button>
          <button onClick={goWithdraw}>Withdraw</button>
          <button>SWAP</button>
          <button>History</button>
        </div>
      </div>
      <div className="list">
        <button className="item">Online Support</button>
        <button className="item">DRAGON Community</button>
        <button className="item" onClick={() => setOpenLang(true)}>
          <span>Language</span>
          <span style={{float: "right", opacity: 0.8}}>{getCurrentLanguageInfo().label} →</span>
        </button>
      </div>
      <div className="cta">
        <button className="primary">Switch/Create New Account</button>
        <button className="ghost">Safe Exit</button>
      </div>
      <BottomSheet open={openLang} onClose={() => setOpenLang(false)}>
        <LanguageSelector onClose={() => setOpenLang(false)} />
      </BottomSheet>
    </div>
  );
}


