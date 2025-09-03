import React, { useState } from "react";
import {
  ArrowLeftOutlined,
  CopyOutlined,
  LinkOutlined,
  DownOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../contexts/AuthContext";

type NetworkKey = "BEP20" | "TRC20";

type Props = {
  onBack: () => void;
};

const NETWORKS: Record<NetworkKey, { label: string; minAmount: string }> = {
  BEP20: { label: "BNB Smart Chain (BEP20)", minAmount: "10.0000" },
  TRC20: { label: "Tron (TRC20)", minAmount: "10.0000" },
};

export default function DepositScreen({ onBack }: Props): JSX.Element {
  const [showNetworks, setShowNetworks] = useState(false);
  const [network, setNetwork] = useState<NetworkKey>("BEP20");
  const { userDetails } = useAuth();

  const depositAddress = userDetails?.address || "0xddbed71fc5e194081ec1914fad8971b8...";

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(depositAddress);
      // Có thể thêm toast notification ở đây
      console.log('Địa chỉ đã được copy:', depositAddress);
    } catch (err) {
      // Fallback cho các trình duyệt cũ
      const textArea = document.createElement('textarea');
      textArea.value = depositAddress;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      console.log('Địa chỉ đã được copy (fallback):', depositAddress);
    }
  };

  const handleRefreshBalance = () => {
    // Logic refresh balance
    console.log("Refreshing balance...");
  };

  return (
    <div className="okbam-deposit">
      <div className="topbar">
        <button className="back" onClick={onBack}>
          <ArrowLeftOutlined />
        </button>
        <div className="title">
          <span className="token-icon">T</span>
          USDT-Deposit
        </div>
        <div className="spacer" />
      </div>

      <div className="deposit-content">
        {/* QR Code Section */}
        <div className="qr-section">
          <div className="qr-code">
            <img 
              src="/img/usdt-qr.png" 
              alt="USDT QR Code" 
              className="qr-image"
            />
          </div>
          <div className="refresh-link" onClick={handleRefreshBalance}>
            Didn't receive deposit? <span className="refresh-text">Click to refresh balance</span>
          </div>
        </div>

        {/* Network Selection */}
        <div className="field">
          <div className="label">Deposit Network</div>
          <button className="select" onClick={() => setShowNetworks(true)}>
            <span>{NETWORKS[network].label}</span>
            <DownOutlined />
          </button>
        </div>

        {/* Deposit Address */}
        <div className="field">
          <div className="label">Deposit Address</div>
          <div className="input-with-icon">
            <LinkOutlined className="link-icon" />
            <input
              value={depositAddress}
              readOnly
              placeholder="Deposit address"
            />
            <button className="copy-btn" onClick={handleCopyAddress}>
              <CopyOutlined />
            </button>
          </div>
        </div>

        {/* Deposit Information */}
        <div className="deposit-info">
          <div className="info-text">
            1. Copy the address above or scan the QR code and select BNB Smart Chain (BEP20) network to send USDT.
          </div>
          <div className="info-text">
            2. Please do not send other assets that are not BNB Smart Chain (BEP20)-USDT network.
          </div>
          <div className="info-text">
            3. Minimum deposit is 5 USDT.
          </div>
        </div>
      </div>

      {/* Network Selection Modal */}
      {showNetworks && (
        <div className="network-overlay" onClick={() => setShowNetworks(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-title">Select Deposit Network</div>
            <button
              className={`option ${network === "BEP20" ? "active" : ""}`}
              onClick={() => {
                setNetwork("BEP20");
                setShowNetworks(false);
              }}
            >
              <div className="name">BNB Smart Chain (BEP20)</div>
              <div className="desc">Minimum deposit {NETWORKS.BEP20.minAmount} USDT</div>
            </button>
            <button
              className={`option ${network === "TRC20" ? "active" : ""}`}
              onClick={() => {
                setNetwork("TRC20");
                setShowNetworks(false);
              }}
            >
              <div className="name">Tron (TRC20)</div>
              <div className="desc">Minimum deposit {NETWORKS.TRC20.minAmount} USDT</div>
            </button>
            <div className="warn">Make sure to select the correct network that matches your sending address</div>
          </div>
        </div>
      )}
    </div>
  );
}
