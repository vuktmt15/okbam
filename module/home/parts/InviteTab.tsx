import React, {useState} from "react";
import {CopyOutlined, LinkOutlined, SearchOutlined} from "@ant-design/icons";
// import InviteTree from "./InviteTree";
import {ModalCustom} from "@components/ModalCustom";

export default function InviteTab(): JSX.Element {
  const [active, setActive] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [memberTab, setMemberTab] = useState<"members" | "stats">("members");
  const [openAgency, setOpenAgency] = useState(false);
  
  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText("123456");
    // Optional: add toast notification
  };
  
  const handleCopyUrl = () => {
    navigator.clipboard.writeText("https://bam-play.com?pcode=***");
    // Optional: add toast notification
  };
  const commission = [
    {level: "F1", rate: "25%"},
    {level: "F2", rate: "5%"},
    {level: "F3", rate: "5%"},
    {level: "F4", rate: "5%"},
    {level: "F5", rate: "5%"},
  ];
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
            <span className="value">123456</span>
            <button className="icon" onClick={handleCopyReferralCode}><CopyOutlined /></button>
          </div>
          <div className="row">
            <span className="label"><LinkOutlined /> Suggested URL</span>
            <span className="value url">https://bam-play.com?pcode=***</span>
            <button className="icon" onClick={handleCopyUrl}><CopyOutlined /></button>
          </div>
        </div>
      </div>

      {/* <InviteTree /> */}

      <div className="commission-card">
        <div className="commission-title-row">
          <div className="commission-title">Agency Commission</div>
          <button className="commission-detail" onClick={() => setOpenAgency(true)}>Detail &gt;</button>
        </div>
        <div className="commission-grid header">
          <div>Level</div>
          <div>Commission</div>
        </div>
        {commission.map((row) => (
          <div key={row.level} className="commission-grid">
            <div>{row.level}</div>
            <div>{row.rate}</div>
          </div>
        ))}
      </div>

      <div className="member-box">
        <div className="member-switch">
          <button
            className={`switch ${memberTab === "members" ? "active" : ""}`}
            onClick={() => setMemberTab("members")}
          >
            Team Members
          </button>
          <button
            className={`switch ${memberTab === "stats" ? "active" : ""}`}
            onClick={() => setMemberTab("stats")}
          >
            Team Statistics
          </button>
        </div>

        {memberTab === "members" ? (
          <>
            <div className="filters">
              <div className="level-select">
                <select
                  value={active}
                  onChange={(e) => setActive(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)}
                >
                  <option value={1}>Lv1</option>
                  <option value={2}>Lv2</option>
                  <option value={3}>Lv3</option>
                  <option value={4}>Lv4</option>
                  <option value={5}>Lv5</option>
                </select>
              </div>
              <div className="search">
                <input placeholder="Search member ID" />
                <button><SearchOutlined /></button>
              </div>
            </div>
            <div className="empty">No team members yet</div>
          </>
        ) : (
          <div className="stats">
            <div className="stat-section">
              <div className="section-title">Number Of Registrations</div>
              <div className="stat-row">
                <span>Total registrations</span>
                <b>0</b>
              </div>
              <div className="stat-row">
                <span>F1</span>
                <b>0</b>
              </div>
            </div>
            
            <div className="stat-section">
              <div className="section-title">Team Size</div>
              <div className="stat-row">
                <span>Total system</span>
                <b>0</b>
              </div>
              <div className="stat-row">
                <span>F1 quantity</span>
                <b>0</b>
              </div>
            </div>
            
            <div className="stat-section">
              <div className="section-title">Total Commission</div>
              <div className="stat-row">
                <span>Total commission system</span>
                <b>0 Dragon</b>
              </div>
              <div className="stat-row">
                <span>F1 commission</span>
                <b>0 Dragon</b>
              </div>
            </div>
          </div>
        )}
      </div>

      <ModalCustom open={openAgency} onCancel={() => setOpenAgency(false)} footer={false} width="100%" style={{maxWidth: 520}} bodyStyle={{padding: 0}}>
        <div className="agency-modal">
          <div className="agency-title">Agency Rules</div>
          <div className="agency-list">
            <div className="rule-row">
              <div className="rule-text">Invite 10 direct F1 with $8 investment: reward $5</div>
              <div className="rule-badge">0/10</div>
            </div>
            <div className="rule-row">
              <div className="rule-text">Invite 10 direct F1 with $18 investment: reward $13</div>
              <div className="rule-badge">0/10</div>
            </div>
            <div className="rule-row">
              <div className="rule-text">Invite 10 direct F1 with $42 investment: reward $25</div>
              <div className="rule-badge">0/10</div>
            </div>
            <div className="rule-row">
              <div className="rule-text">Invite 7 direct F1 with $355 investment: reward $88</div>
              <div className="rule-badge">0/10</div>
            </div>
            <div className="rule-row">
              <div className="rule-text">Invite 4 direct F1 with $3000 investment: reward $299</div>
              <div className="rule-badge">0/10</div>
            </div>
            <div className="rule-row">
              <div className="rule-text">Invite 1 direct F1 with $12,000 investment: reward $499</div>
              <div className="rule-badge">0/10</div>
            </div>
          </div>
          <button className="agency-close" onClick={() => setOpenAgency(false)}>Close</button>
        </div>
      </ModalCustom>
    </div>
  );
}


