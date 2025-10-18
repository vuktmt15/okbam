import React, {useMemo, useState} from "react";
import {
  ArrowLeftOutlined,
  DownOutlined,
  CopyOutlined,
  CheckCircleTwoTone,
} from "@ant-design/icons";
import { ModalCustom } from "@components/ModalCustom";

type NetworkKey = "BEP20" | "USDT";

type Props = {
  balanceUsdt?: number;
  onBack: () => void;
  autoShowHistory?: boolean;
};

const NETWORKS: Record<NetworkKey, {label: string; min: number; networkFee: number; processingFeePercent: number}> = {
  BEP20: {label: "BNB Smart Chain (BEP20)", min: 2, networkFee: 1, processingFeePercent: 5},
  USDT: {label: "USDT", min: 2, networkFee: 1, processingFeePercent: 5},
};

export default function WithdrawScreen({
  balanceUsdt = 31.6,
  onBack,
  autoShowHistory = false,
}: Props): JSX.Element {
  const [showNetworks, setShowNetworks] = useState(false);
  const [showHistory, setShowHistory] = useState(!!autoShowHistory);
  const [network, setNetwork] = useState<NetworkKey>("BEP20");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const {min, networkFee, processingFeePercent} = NETWORKS[network];
  const amountNum = Number(amount) || 0;
  const eligible = amountNum >= min && amountNum <= balanceUsdt && !!address;
  
  // Tính toán phí theo logic mới:
  // 1. Trừ phí mạng (network fee)
  // 2. Trừ 5% phí xử lý trên số tiền còn lại
  const afterNetworkFee = amountNum - networkFee;
  const processingFee = afterNetworkFee > 0 ? (afterNetworkFee * processingFeePercent / 100) : 0;
  const platformFee = 1; // Platform Operation Fee cố định 1 USDT
  const receive = useMemo(() => {
    if (amountNum <= 0) return 0;
    const afterNetwork = amountNum - networkFee;
    if (afterNetwork <= 0) return 0;
    const afterProcessing = afterNetwork - (afterNetwork * processingFeePercent / 100);
    const final = afterProcessing - platformFee;
    return Math.max(0, final);
  }, [amountNum, networkFee, processingFeePercent, platformFee]);

  const handleWithdraw = async () => {
    try {
      if (!eligible) return;
      const params = new URLSearchParams({
        toAddress: address,
        amount: String(amountNum),
      });

      // referrerId lấy từ localStorage user_details.body.refererCode hoặc referrerId? Theo mô tả dùng từ API detail-user
      try {
        const details = typeof window !== 'undefined' ? localStorage.getItem('user_details') : null;
        if (details) {
          const parsed = JSON.parse(details);
          if (parsed?.refererCode) params.set('referrerId', parsed.refererCode);
          else if (parsed?.referrerId) params.set('referrerId', parsed.referrerId);
        }
      } catch {}

      const endpoint = network === 'BEP20' ? `/api/withdrawBNB?${params.toString()}` : `/api/usdt?${params.toString()}`;
      const res = await fetch(endpoint);
      const text = await res.text();

      alert(text || 'Request sent');
    } catch (e) {
      alert('Withdraw failed. Please try again.');
      console.error(e);
    }
  };

  // Fetch withdraw history
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
        const items = data.data.filter((i: any) => i.typeBalance === 2); // 2 = withdraw
        setHistoryData(items);
        setCurrentPage(data.pagination.currentPage);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (e) {
      console.error('Fetch withdraw history error', e);
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

  return (
    <div className="okbam-withdraw">
      <div className="topbar">
        <button className="back" onClick={onBack}>
          <ArrowLeftOutlined />
        </button>
        <div className="title">
          Withdraw - USDT
          <span className="usdt-icon">💎</span>
        </div>
        <button className="history-link" onClick={() => setShowHistory(true)}>
          History →
        </button>
      </div>

      <div className="form">
        <div className="field-group">
          <div className="label">Network :</div>
          <button className="select" onClick={() => setShowNetworks(true)}>
            <span>{NETWORKS[network].label}</span>
            <DownOutlined />
          </button>
        </div>

        <div className="field-group">
          <div className="label">Withdrawal Address :</div>
          <div className="input-with-icon">
            <input
              placeholder="Please enter withdrawal address ..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        <div className="field-group">
          <div className="label">Withdrawal Amount :</div>
          <div className="input-with-max">
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Please enter amount ..."
              value={amount}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (value >= 0 || e.target.value === '') {
                  setAmount(e.target.value);
                }
              }}
            />
            <button className="max">/max</button>
          </div>
        </div>

        <div className="field">
          <div className="label">Min withdrawal :</div>
          <div className="value">2$</div>
        </div>

        <div className="field">
          <div className="label">Wallet Balance :</div>
          <div className="value">
            {balanceUsdt}$
            <span className="usdt-icon">💎</span>
          </div>
        </div>

        <div className="field">
          <div className="label">Network Fee :</div>
          <div className="value">1$</div>
        </div>

        <div className="field">
          <div className="label">Processing Fee :</div>
          <div className="value">5%</div>
        </div>

        <div className="field">
          <div className="label">Actual Amount :</div>
          <div className="value">{amountNum > 0 ? receive.toFixed(0) : 0}$</div>
        </div>

        <div className="note-box">
          <div className="note-title">Withdrawal Notes :</div>
          <div className="note-text">
            Please enter the correct BEP 20 network wallet address to complete the withdrawal.
          </div>
          <div className="note-text">
            If you enter an incorrect address, we will not be responsible.
          </div>
          <div className="note-text">
            After submitting your withdrawal request, it will be completed within 1-5 seconds.
          </div>
        </div>

        <button className="submit" disabled={!eligible} onClick={handleWithdraw}>
          Confirm Withdrawal
        </button>
      </div>

      {showNetworks && (
        <div className="network-overlay" onClick={() => setShowNetworks(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-title">Select Withdrawal Network</div>
            <button
              className={`option ${network === "BEP20" ? "active" : ""}`}
              onClick={() => {
                setNetwork("BEP20");
                setShowNetworks(false);
              }}
            >
              <div className="name">BNB Smart Chain (BEP20)</div>
              <div className="desc">Minimum withdrawal 2.00 USDT • Network fee 1.00 USDT</div>
            </button>
            <button
              className={`option ${network === "USDT" ? "active" : ""}`}
              onClick={() => {
                setNetwork("USDT");
                setShowNetworks(false);
              }}
            >
              <div className="name">USDT</div>
              <div className="desc">Minimum withdrawal {NETWORKS.USDT.min.toFixed(2)} USDT • Network fee {NETWORKS.USDT.networkFee.toFixed(2)} USDT</div>
            </button>
            <div className="warn">Make sure to select the correct network that matches your receiving address</div>
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
          <div className="withdraw-history" style={{ padding: 16, color: "#fff" }}>
            <div style={{fontWeight: 800, fontSize: 18, marginBottom: 12}}>Withdrawal History</div>
            {historyLoading ? (
              <div style={{textAlign:'center', padding:'20px', color:'#999'}}>Loading withdrawal history...</div>
            ) : historyData.length === 0 ? (
              <div style={{textAlign:'center', padding:'20px', color:'#999'}}>
                <div style={{fontSize:'24px', marginBottom:'8px'}}>📊</div>
                <div>No withdrawal history found</div>
              </div>
            ) : (
              historyData.map((item: any) => (
                <div key={item.id} style={{background:'#1a1a1a', borderRadius:12, padding:12, marginBottom:12}}>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}>
                    <span>Status:</span><span style={{color: item.status === 'completed' ? '#52c41a' : '#ffa940'}}>{item.status || 'Processing'}</span>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}>
                    <span>Amount:</span><span style={{color:'#ff4d4f'}}>-{item.amount}$</span>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}>
                    <span>Network fee:</span><span>1$</span>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}>
                    <span>Processing fee:</span><span>5%</span>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between'}}>
                    <span>Time:</span><span>{new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
            {totalPages > 1 && (
              <div style={{display:'flex', justifyContent:'center', gap:16, marginTop:16}}>
                {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                  <span 
                    key={page}
                    style={{
                      background: page === currentPage ? '#ffd700' : '#555',
                      color: page === currentPage ? '#000' : '#fff',
                      borderRadius: 14,
                      padding: '4px 10px',
                      cursor: 'pointer'
                    }}
                    onClick={() => fetchHistory(page)}
                  >
                    {page}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </ModalCustom>
    </div>
  );
}


