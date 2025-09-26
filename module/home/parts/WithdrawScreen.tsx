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
};

const NETWORKS: Record<NetworkKey, {label: string; min: number; networkFee: number; processingFeePercent: number}> = {
  BEP20: {label: "BNB Smart Chain (BEP20)", min: 2, networkFee: 1, processingFeePercent: 5},
  USDT: {label: "USDT", min: 2, networkFee: 1, processingFeePercent: 5},
};

export default function WithdrawScreen({
  balanceUsdt = 31.6,
  onBack,
}: Props): JSX.Element {
  const [showNetworks, setShowNetworks] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [network, setNetwork] = useState<NetworkKey>("BEP20");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState<string>("");

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
        <div className="history-link" onClick={() => setShowHistory(true)}>History →</div>
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
            {[{
              status: 'Processing', amount: -15, networkFee: 1, processingFee: '5%', time: '15:36:09 2025/09/19'
            },{
              status: 'Success', amount: -36, networkFee: 1, processingFee: '5%', time: '11:58:28 2025/09/18'
            }].map((it, idx) => (
              <div key={idx} style={{background:'#1a1a1a', borderRadius:12, padding:12, marginBottom:12}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}>
                  <span>Status:</span><span>{it.status}</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}>
                  <span>Amount:</span><span style={{color:'#ff4d4f'}}>{it.amount}$</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}>
                  <span>Network fee:</span><span>1$</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}>
                  <span>Processing fee:</span><span>{it.processingFee}</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <span>Time:</span><span>{it.time}</span>
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


