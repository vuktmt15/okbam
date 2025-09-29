import "./index.scss";
import React, {useState, useEffect} from "react";
import {
  CrownOutlined,
  HomeOutlined,
  TeamOutlined,
  UserOutlined,
  StarOutlined,
} from "@ant-design/icons";
import HomeTab from "./parts/HomeTab";
import BAMTab from "./parts/BAMTab";
import SpecialTab from "./parts/SpecialTab";
import InviteTab from "./parts/InviteTab";
import MyTab from "./parts/MyTab";
import WithdrawScreen from "./parts/WithdrawScreen";
import {MyTabContext} from "./parts/context";


type TabKey = "home" | "special" | "bam" | "invite" | "my" | "withdraw";

export function Home(): JSX.Element {
  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const [hasSpecialPackage, setHasSpecialPackage] = useState(false);
  const [checkingSpecial, setCheckingSpecial] = useState(true);

  // Check if user has purchased special package
  useEffect(() => {
    const checkSpecialPurchase = async () => {
      try {
        const userDetails = typeof window !== 'undefined' ? localStorage.getItem('user_details') : null;
        if (userDetails) {
          const parsed = JSON.parse(userDetails);
          const referrerId = parsed?.referrerId || parsed?.refererCode;
          
          if (referrerId) {
            const response = await fetch(`/api/investment-packages/get-investment?referrerId=${referrerId}`);
            const data = await response.json();
            
                 if (data?.statusCode === 'OK' && Array.isArray(data.body)) {
                   const hasSpecial = data.body.some((investment: any) => 
                     (investment?.bamId === 1 || investment?.id === 1 || investment?.planId === 1)
                   );
              setHasSpecialPackage(hasSpecial);
            }
          }
        }
      } catch (e) {
        console.error('Error checking special purchase:', e);
      } finally {
        setCheckingSpecial(false);
      }
    };

    checkSpecialPurchase();
  }, []);

  // Listen for navigation events from HomeTab
  useEffect(() => {
    const handleNavigateToTab = (event: CustomEvent) => {
      const tab = event.detail as TabKey;
      if (tab === 'special') setActiveTab('special');
      if (tab === 'bam') setActiveTab('bam');
    };

    window.addEventListener('navigateToTab', handleNavigateToTab as EventListener);
    
    return () => {
      window.removeEventListener('navigateToTab', handleNavigateToTab as EventListener);
    };
  }, [hasSpecialPackage]);

  const renderContent = (): JSX.Element => {
    switch (activeTab) {
      case "home":
        return <HomeTab onGoToBam={() => setActiveTab("bam")} onGoToInvite={() => setActiveTab("invite")} />;
      case "special":
        return <SpecialTab />;
      case "bam":
        return <BAMTab />;
      case "invite":
        return <InviteTab />;
      case "my":
        return <MyTab />;
      case "withdraw":
        return <WithdrawScreen onBack={() => setActiveTab("my")} />;
    }
  };

  return (
    <div className="okbam-mobile">
      <div className="okbam-content">
        <MyTabContext.Provider value={{goWithdraw: () => setActiveTab("withdraw")}}>
          {renderContent()}
        </MyTabContext.Provider>
      </div>
      <div className="okbam-tabbar">
        <button
          className={`tab-item ${activeTab === "home" ? "active" : ""}`}
          onClick={() => setActiveTab("home")}
        >
          <HomeOutlined />
          <span>Home</span>
        </button>
            <button
              className={`tab-item ${activeTab === "special" ? "active" : ""}`}
              onClick={() => setActiveTab("special")}
            >
              <StarOutlined />
              <span>Special</span>
            </button>
        <button
          className={`tab-item ${activeTab === "bam" ? "active" : ""}`}
          onClick={() => setActiveTab("bam")}
        >
          <CrownOutlined />
          <span>DRAGON</span>
        </button>
        <button
          className={`tab-item ${activeTab === "invite" ? "active" : ""}`}
          onClick={() => setActiveTab("invite")}
        >
          <TeamOutlined />
          <span>Invite</span>
        </button>
        <button
          className={`tab-item ${activeTab === "my" ? "active" : ""}`}
          onClick={() => setActiveTab("my")}
        >
          <UserOutlined />
          <span>My</span>
        </button>
      </div>
    </div>
  );
}
