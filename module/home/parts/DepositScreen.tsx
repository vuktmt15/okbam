import React, { useState } from "react";
import {
  ArrowLeftOutlined,
  CopyOutlined,
  LinkOutlined,
  DownOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../contexts/AuthContext";
import { ModalCustom } from "@components/ModalCustom";

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
  const [showHistory, setShowHistory] = useState(false);
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
          Deposit - USDT
          <span className="usdt-icon">💎</span>
        </div>
        <div className="history-link" onClick={() => setShowHistory(true)}>History →</div>
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
          <div className="qr-instruction">
            Scan QR code or copy BEP 20 network wallet address to deposit.
          </div>
        </div>

        {/* Network Selection */}
        <div className="field-group">
          <div className="label">Deposit Network :</div>
          <button className="select" onClick={() => setShowNetworks(true)}>
            <span>{NETWORKS[network].label}</span>
            <DownOutlined />
          </button>
        </div>

        {/* Deposit Address */}
        <div className="field-group">
          <div className="label">Deposit Address :</div>
          <div className="input-with-icon">
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
            1. Copy the address above or scan the QR code and select BNB Smart Chain (BEP20) network to deposit.
          </div>
          <div className="info-text">
            2. Minimum deposit 10$
          </div>
          <div className="info-text">
            3. Estimated 1 minute
          </div>
        </div>

        <button className="submit" onClick={onBack}>
          Complete
        </button>
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

      <ModalCustom
        open={showHistory}
        onCancel={() => setShowHistory(false)}
        footer={false}
        width="100%"
        style={{ maxWidth: 520 }}
        bodyStyle={{ padding: 0, background: "#111" }}
      >
        {showHistory && (
          <div className="deposit-history" style={{ padding: 16, color: "#fff" }}>
            <div style={{fontWeight: 800, fontSize: 18, marginBottom: 12}}>Deposit History</div>
            {[{
              amount: 50, time: '21:52:03 2025/09/17', status: 'Success'
            },{
              amount: 102, time: '13:45:57 2025/09/15', status: 'Success'
            }].map((it, idx) => (
              <div key={idx} style={{background:'#1a1a1a', borderRadius:12, padding:12, marginBottom:12}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}>
                  <span>Amount:</span><span style={{color:'#52c41a'}}>+{it.amount}$</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}>
                  <span>Time:</span><span>{it.time}</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <span>Status:</span><span>{it.status}</span>
                </div>
              </div>
            ))}
            <div style={{display:'flex', justifyContent:'center', gap:16, marginTop:16}}>
              <span style={{background:'#555', borderRadius:14, padding:'4px 10px'}}>1</span>
              <span>2</span>
              <span>3</span>
            </div>
          </div>
        )}
      </ModalCustom>
    </div>
  );
}
