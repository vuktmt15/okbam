import React, { useState } from "react";
import { ArrowLeftOutlined, SwapOutlined, DownOutlined } from "@ant-design/icons";

type Props = {
  onBack: () => void;
};

export default function SwapScreen({ onBack }: Props): JSX.Element {
  const [from, setFrom] = useState<string>("DRAGON");
  const [to, setTo] = useState<string>("Trading Account");
  const [asset, setAsset] = useState<string>("USDT");
  const [amount, setAmount] = useState<string>("");

  const maxAmount = 30; // placeholder per request (~30 USDT)
  const canSubmit = Number(amount) > 0 && Number(amount) <= maxAmount;

  return (
    <div className="okbam-swap">
      <div className="topbar">
        <button className="back" onClick={onBack}>
          <ArrowLeftOutlined />
        </button>
        <div className="title">Swap</div>
        <div className="spacer" />
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
    </div>
  );
}


