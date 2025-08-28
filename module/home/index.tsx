import "./index.scss";
import React, {useState} from "react";
import {
  CrownOutlined,
  HomeOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import HomeTab from "./parts/HomeTab";
import BAMTab from "./parts/BAMTab";
import InviteTab from "./parts/InviteTab";
import MyTab from "./parts/MyTab";
import WithdrawScreen from "./parts/WithdrawScreen";
import {MyTabContext} from "./parts/context";


type TabKey = "home" | "bam" | "invite" | "my" | "withdraw";

export function Home(): JSX.Element {
  const [activeTab, setActiveTab] = useState<TabKey>("home");

  const renderContent = (): JSX.Element => {
    switch (activeTab) {
      case "home":
        return <HomeTab onGoToBam={() => setActiveTab("bam")} onGoToInvite={() => setActiveTab("invite")} />;
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
          className={`tab-item ${activeTab === "bam" ? "active" : ""}`}
          onClick={() => setActiveTab("bam")}
        >
          <CrownOutlined />
          <span>BAM</span>
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
