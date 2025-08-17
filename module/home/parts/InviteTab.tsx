import React, {useState} from "react";
import {CopyOutlined, LinkOutlined, SearchOutlined} from "@ant-design/icons";
import InviteTree from "./InviteTree";

export default function InviteTab(): JSX.Element {
  const [active, setActive] = useState<1 | 2 | 3>(1);
  return (
    <div className="okbam-invite">
      <div className="invite-hero">
        <div className="title-row">
          <div className="title">Nhóm của tôi</div>
          <button className="btn-claim">nhận được</button>
        </div>
        <div className="subtitle">
          <span className="group-icon">👥</span>
          Phần thưởng hoa hồng cho nhóm
        </div>
        <div className="reward-badge">
          <span className="coin">T</span>
          <span className="amount">0 USDT</span>
        </div>
        <div className="rows">
          <div className="row">
            <span className="label">Mã giới thiệu</span>
            <span className="value">8621559</span>
            <button className="icon"><CopyOutlined /></button>
          </div>
          <div className="row">
            <span className="label"><LinkOutlined /> URL được đề xuất</span>
            <span className="value url">https://bam-play.com?pcode=***</span>
            <button className="icon"><CopyOutlined /></button>
          </div>
        </div>
      </div>

      <InviteTree />

      <div className="member-box">
        <div className="member-header">
          <div className="title">thành viên trong nhóm</div>
          <button className="subtab">Thống kê đội</button>
        </div>
        <div className="tabs">
          <button className={`tab ${active === 1 ? "active" : ""}`} onClick={() => setActive(1)}>Cấp dưới Lv1</button>
          <button className={`tab ${active === 2 ? "active" : ""}`} onClick={() => setActive(2)}>Cấp dưới cấp 2</button>
          <button className={`tab ${active === 3 ? "active" : ""}`} onClick={() => setActive(3)}>Cấp dưới cấp 3</button>
        </div>
        <div className="filters">
          <div className="total">tổng số người: 0</div>
          <div className="search">
            <input placeholder="Nhập ID" />
            <button><SearchOutlined /></button>
          </div>
        </div>
        <div className="empty">Chưa có dữ liệu</div>
      </div>
    </div>
  );
}


