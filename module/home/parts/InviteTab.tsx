import React, {useState} from "react";
import {CopyOutlined, LinkOutlined, SearchOutlined} from "@ant-design/icons";
import InviteTree from "./InviteTree";

export default function InviteTab(): JSX.Element {
  const [active, setActive] = useState<1 | 2 | 3>(1);
  return (
    <div className="okbam-invite">
      <div className="invite-hero">
        <div className="title-row">
          <div className="title">My Team</div>
        </div>
        <div className="subtitle">
          <span className="group-icon">👥</span>
          Team Commission Rewards
        </div>
        <div className="reward-row">
          <div className="reward-badge">
            <span className="coin">T</span>
            <span className="amount">0 USDT</span>
          </div>
          <button className="btn-claim">Claim</button>
        </div>
        <div className="rows">
          <div className="row">
            <span className="label">Referral Code</span>
            <span className="value">8621559</span>
            <button className="icon"><CopyOutlined /></button>
          </div>
          <div className="row">
            <span className="label"><LinkOutlined /> Suggested URL</span>
            <span className="value url">https://bam-play.com?pcode=***</span>
            <button className="icon"><CopyOutlined /></button>
          </div>
        </div>
      </div>

      <InviteTree />

      <div className="member-box">
        <div className="member-header">
          <div className="title">Team Members</div>
          <button className="subtab">Team Statistics</button>
        </div>
        <div className="tabs">
          <button className={`tab ${active === 1 ? "active" : ""}`} onClick={() => setActive(1)}>Level 1 Downline</button>
          <button className={`tab ${active === 2 ? "active" : ""}`} onClick={() => setActive(2)}>Level 2 Downline</button>
          <button className={`tab ${active === 3 ? "active" : ""}`} onClick={() => setActive(3)}>Level 3 Downline</button>
        </div>
        <div className="filters">
          <div className="total">Total people: 0</div>
          <div className="search">
            <input placeholder="Enter ID" />
            <button><SearchOutlined /></button>
          </div>
        </div>
        <div className="empty">No data available</div>
      </div>
    </div>
  );
}


