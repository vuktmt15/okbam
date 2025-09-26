import React, { useState } from "react";
import { ModalCustom } from "@components/ModalCustom";
import { ArrowLeftOutlined, SwapOutlined, DownOutlined } from "@ant-design/icons";

type Props = {
  onBack: () => void;
};

export default function SwapScreen({ onBack }: Props): JSX.Element {
  const [from, setFrom] = useState<string>("DRAGON");
  const [to, setTo] = useState<string>("Trading Account");
  const [asset, setAsset] = useState<string>("USDT");
  const [amount, setAmount] = useState<string>("");
  const [showHistory, setShowHistory] = useState(false);

  const maxAmount = 30; // placeholder per request (~30 USDT)
  const canSubmit = Number(amount) > 0 && Number(amount) <= maxAmount;

  return (
    <div className="okbam-swap">
      <div className="topbar">
        <button className="back" onClick={onBack}>
          <ArrowLeftOutlined />
        </button>
        <div className="title">Swap</div>
        <div className="history-link" onClick={() => setShowHistory(true)}>History →</div>
      </div>

      <div className="swap-form">
        <div className="fromto">
          <div className="box">
            <div className="label">From</div>
            <div className="value">{from}</div>
          </div>
          <div className="switch"><SwapOutlined /></div>
          <div className="box">
            <div className="label">To</div>
            <div className="value">{to}</div>
          </div>
        </div>

        <div className="field">
          <div className="label">Asset</div>
          <button className="select">
            <span>{asset}</span>
            <DownOutlined />
          </button>
        </div>

        <div className="field">
          <div className="label">Amount</div>
          <div className="amount-row">
            <input
              type="number"
              min="0"
              step="0.00000001"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <span className="unit">USDT</span>
            <button className="max" onClick={() => setAmount(String(maxAmount))}>MAX</button>
          </div>
          <div className="hint">Maximum transferable {maxAmount} USDT</div>
        </div>

        <button className="submit" disabled={!canSubmit}>Confirm</button>
      </div>

      <ModalCustom
        open={showHistory}
        onCancel={() => setShowHistory(false)}
        footer={false}
        width="100%"
        style={{ maxWidth: 520 }}
        bodyStyle={{ padding: 0, background: "#111" }}
      >
        {showHistory && (
          <div style={{ padding: 16, color: "#fff" }}>
            <div style={{fontWeight: 800, fontSize: 18, marginBottom: 12}}>History</div>
            {[{
              title: 'Swap Dragon → USDT', amount: -50, unit: 'Dragon', time: '11:56:23 2025/09/16'
            },{
              title: 'Commission', amount: +93.75, unit: 'Dragon', time: '11:20:35 2025/09/16'
            },{
              title: 'Swap Dragon → USDT', amount: -50, unit: 'Dragon', time: '12:02:58 2025/09/15'
            },{
              title: 'Commission', amount: +12.5, unit: 'Dragon', time: '10:26:38 2025/09/15'
            }].map((it, idx) => (
              <div key={idx} style={{background:'#1a1a1a', borderRadius:12, padding:12, marginBottom:12}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}>
                  <span>{it.title}</span>
                  <span style={{color: it.amount >= 0 ? '#52c41a' : '#ff4d4f'}}>{it.amount >= 0 ? `+${it.amount}` : it.amount} {it.unit}</span>
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


