import React, {useMemo, useState} from "react";
import {
  ArrowLeftOutlined,
  DownOutlined,
  CopyOutlined,
  CheckCircleTwoTone,
} from "@ant-design/icons";

type NetworkKey = "BEP20" | "TRC20";

type Props = {
  balanceUsdt?: number;
  onBack: () => void;
};

const NETWORKS: Record<NetworkKey, {label: string; min: number; fee: number}> = {
  BEP20: {label: "BNB Smart Chain (BEP20)", min: 2, fee: 1},
  TRC20: {label: "Tron (TRC20)", min: 6, fee: 1.6},
};

export default function WithdrawScreen({
  balanceUsdt = 31.6,
  onBack,
}: Props): JSX.Element {
  const [showNetworks, setShowNetworks] = useState(false);
  const [network, setNetwork] = useState<NetworkKey>("BEP20");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState<string>("");

  const {min, fee} = NETWORKS[network];
  const amountNum = Number(amount) || 0;
  const eligible = amountNum >= min && amountNum <= balanceUsdt && !!address;
  const receive = useMemo(() => (amountNum > fee ? amountNum - fee : 0), [amountNum, fee]);

  return (
    <div className="okbam-withdraw">
      <div className="topbar">
        <button className="back" onClick={onBack}>
          <ArrowLeftOutlined />
        </button>
        <div className="title">Withdraw</div>
        <div className="spacer" />
      </div>

      <div className="form">
        <div className="field">
          <div className="label">Network</div>
          <button className="select" onClick={() => setShowNetworks(true)}>
            <span>{NETWORKS[network].label}</span>
            <DownOutlined />
          </button>
        </div>

        <div className="field">
          <div className="label">Withdrawal Address</div>
          <div className="input-with-icon">
            <input
              placeholder="Please enter withdrawal address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <CopyOutlined />
          </div>
        </div>

        <div className="field">
          <div className="label">Supported Currency</div>
          <div className="token-box">
            <CheckCircleTwoTone twoToneColor="#52c41a" />
            <span>USDT</span>
          </div>
        </div>

        <div className="field">
          <div className="label">Withdrawal Amount</div>
          <div className="input-with-max">
            <input
              type="number"
              placeholder={`Minimum withdrawal amount is ${min} USDT`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button className="max" onClick={() => setAmount(String(balanceUsdt))}>
              MAX
            </button>
          </div>
          <div className="hint">
            Available Balance: <b>{balanceUsdt} USDT</b>
          </div>
        </div>

        <div className="fees">
          <div className="row">
            <span>Processing Fee</span>
            <span>{fee} USDT</span>
          </div>
          <div className="row">
            <span>Platform Operation Fee</span>
            <span>0 USDT</span>
          </div>
          <div className="row total">
            <span>Actual Amount</span>
            <span>{eligible ? receive.toFixed(2) : 0} USDT</span>
          </div>
        </div>

        <button className="submit" disabled={!eligible}>
          Withdraw
        </button>

        <div className="note">
          • To ensure the security of your funds, when your account security policy
          is implemented. When there are changes or your password is changed,
          we will review the withdrawal
        </div>
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
              <div className="desc">Minimum withdrawal 2.00 USDT • Network fee 1.00USDT</div>
            </button>
            <button
              className={`option ${network === "TRC20" ? "active" : ""}`}
              onClick={() => {
                setNetwork("TRC20");
                setShowNetworks(false);
              }}
            >
              <div className="name">Tron (TRC20)</div>
              <div className="desc">Minimum withdrawal 6.00 USDT • Network fee 1.60USDT</div>
            </button>
            <div className="warn">Make sure to select the correct network that matches your receiving address</div>
          </div>
        </div>
      )}
    </div>
  );
}


