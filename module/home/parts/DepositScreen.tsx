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

type NetworkKey = "BEP20";

type Props = {
  onBack: () => void;
  autoShowHistory?: boolean;
};

const NETWORKS: Record<NetworkKey, { label: string; minAmount: string }> = {
  BEP20: { label: "BNB Smart Chain (BEP20)", minAmount: "10.0000" },
};

export default function DepositScreen({ onBack, autoShowHistory = false }: Props): JSX.Element {
  const [showNetworks, setShowNetworks] = useState(false);
  const [network, setNetwork] = useState<NetworkKey>("BEP20");
  const [showHistory, setShowHistory] = useState(!!autoShowHistory);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCopied, setShowCopied] = useState(false);
  const { userDetails } = useAuth();

  const depositAddress = userDetails?.address || "0xddbed71fc5e194081ec1914fad8971b8...";

  // Fetch deposit history
  const fetchHistory = async (page: number = 1) => {
    setHistoryLoading(true);
    try {
      const userLocal = typeof window !== 'undefined' ? localStorage.getItem('user_details') : null;
      const parsed = userLocal ? JSON.parse(userLocal) : null;
      const referrerId = parsed?.referrerId || parsed?.refererCode;
      if (!referrerId) return;
      
      const res = await fetch(`/api/history-balance?ref=${referrerId}&page=${page}&limit=5`);
      const data = await res.json();
      if (data?.data) {
        const items = data.data.filter((i: any) => i.typeBalance === 1); // 1 = deposit
        setHistoryData(items);
        setCurrentPage(data.pagination.currentPage);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (e) {
      console.error('Fetch deposit history error', e);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Auto-fetch history when modal opens
  React.useEffect(() => {
    if (showHistory) {
      fetchHistory(1);
    }
  }, [showHistory]);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(depositAddress);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
      console.log('Address copied:', depositAddress);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = depositAddress;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
      console.log('Address copied (fallback):', depositAddress);
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
        <button className="history-link" onClick={() => setShowHistory(true)}>
          History →
        </button>
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
              {showCopied && <span className="">Copied!</span>}
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
            {/* TRC20 option removed */}
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
            {historyLoading ? (
              <div style={{textAlign:'center', padding:'20px', color:'#999'}}>Loading deposit history...</div>
            ) : historyData.length === 0 ? (
              <div style={{textAlign:'center', padding:'20px', color:'#999'}}>
                <div style={{fontSize:'24px', marginBottom:'8px'}}>📊</div>
                <div>No deposit history found</div>
              </div>
            ) : (
              historyData.map((item: any) => (
                <div key={item.id} style={{background:'#1a1a1a', borderRadius:12, padding:12, marginBottom:12}}>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}>
                    <span>Amount:</span><span style={{color:'#52c41a'}}>+{item.amount}$</span>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}>
                    <span>Time:</span><span>{new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between'}}>
                    <span>Status:</span><span style={{color:'#52c41a'}}>Success</span>
                  </div>
                </div>
              ))
            )}
            {totalPages > 1 && (
              <div style={{display:'flex', justifyContent:'center', gap:16, marginTop:16}}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <span key={p} style={{background: p === currentPage ? '#ffd700' : '#555', color: p === currentPage ? '#000' : '#fff', borderRadius:14, padding:'4px 10px', cursor:'pointer'}} onClick={() => fetchHistory(p)}>{p}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </ModalCustom>
    </div>
  );
}
