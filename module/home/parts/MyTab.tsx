import React, {useContext, useState} from "react";
import BottomSheet from "@components/BottomSheet";
import {BellOutlined, GlobalOutlined, SettingOutlined} from "@ant-design/icons";
import {MyTabContext} from "./context";
import {useAuth} from "../../../contexts/AuthContext";
import DepositScreen from "./DepositScreen";
import {ModalCustom} from "@components/ModalCustom";
// import {useLanguage} from "@hooks/useLanguage";
// import LanguageSelector from "@components/LanguageSelector";

export default function MyTab(): JSX.Element {
  const {goWithdraw} = useContext(MyTabContext);
  const {logout} = useAuth();
  const [showDeposit, setShowDeposit] = useState(false);
  // const [openLang, setOpenLang] = useState(false);
  // const {currentLanguage, changeLanguage, getCurrentLanguageInfo, languageOptions} = useLanguage();
  return (
    <div className="okbam-my">
      <div className="profile">
        <div className="row top">
          <div className="left">
            <div className="avatar">🧸</div>
            <div className="info">
              <div className="email">Hoa****@gmail.com</div>
              <div className="id">ID: 123456</div>
            </div>
          </div>
          {/* <div className="icons">
            <GlobalOutlined />
            <BellOutlined />
            <SettingOutlined />
          </div> */}
        </div>
        <div className="notice">User*** successfully recharged 830USDT</div>
        <div className="wallet">
          <div className="wallet-title">
            <span className="wallet-label">Wallet Balance:</span>
            <span className="wallet-amounts">
              <span className="wallet-coin"><b>6</b> USDT</span>
              <span className="wallet-coin"><b>0</b> Dragon</span>
            </span>
          </div>
        </div>
        <div className="quick">
          <button onClick={() => setShowDeposit(true)}>Deposit</button>
          <button onClick={goWithdraw}>Withdraw</button>
          <button>SWAP</button>
          <button>History</button>
        </div>
      </div>
      <div className="list">
        <button className="item">Online Support</button>
        <button className="item">DRAGON Community</button>
        {/* <button className="item" onClick={() => setOpenLang(true)}>
          <span>Language</span>
          <span style={{float: "right", opacity: 0.8}}>{getCurrentLanguageInfo().label} →</span>
        </button> */}
      </div>
      <div className="cta">
        <button className="primary" onClick={() => {
          logout();
          window.location.href = '/signup';
        }}>Switch/Create New Account</button>
                    <button className="ghost" onClick={logout}>Logout</button>
      </div>
      <ModalCustom open={showDeposit} onCancel={() => setShowDeposit(false)} footer={false} width="100%" style={{maxWidth: 520}} bodyStyle={{padding: 0, background: "#111"}}>
        {showDeposit && (
          <DepositScreen onBack={() => setShowDeposit(false)} />
        )}
      </ModalCustom>
      {/* <BottomSheet open={openLang} onClose={() => setOpenLang(false)}>
        <LanguageSelector onClose={() => setOpenLang(false)} />
      </BottomSheet> */}
    </div>
  );
}


