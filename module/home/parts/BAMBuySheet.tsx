import React from "react";

type Props = {
  planName: string;
  price: string; // e.g. "50USDT"
  onClose: () => void;
};

export default function BAMBuySheet({planName, price, onClose}: Props): JSX.Element {
  return (
    <div className="bambuy-sheet">
      <div className="sheet-title">My Income</div>
      <div className="income-box">
        <div className="col">
          <div className="label">Daily Income</div>
          <div className="value">{planName === "BAM1" ? "2.4USDT" : planName === "BAM2" ? "6USDT" : "20USDT"}</div>
        </div>
        <div className="col">
          <div className="label">Purchase Amount</div>
          <div className="value">{price}</div>
        </div>
        <button className="upgrade">
          Only {price} to upgrade to {planName}
        </button>
      </div>

      <div className="invite-box">
        <div className="title">BAM33 Invitation</div>
        <div className="sub">Monthly Commission <b>(50%)</b> <span className="green">300USDT</span></div>
        <button className="primary">Invite</button>
      </div>

      <button className="close" onClick={onClose}>Close</button>
    </div>
  );
}


