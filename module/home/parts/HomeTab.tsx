import React, {useContext, useState} from "react";
import {
  AuditOutlined,
  BellOutlined,
  PlusOutlined,
  RightOutlined,
  SmileOutlined,
  UserOutlined,
  WalletOutlined,
  CalendarOutlined,
  DollarCircleOutlined,
  TeamOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import {Avatar} from "antd";
import {ModalCustom} from "@components/ModalCustom";
import BAMBuySheet from "./BAMBuySheet";
import {MyTabContext} from "./context";

type Props = {
  onGoToBam: () => void;
};

export default function HomeTab({onGoToBam}: Props): JSX.Element {
  const {goWithdraw} = useContext(MyTabContext);
  const tiers = [
    {name: "BAM1", daily: "2.4 USDT", buy: "50USDT", total: "864 USDT", img: "/img/pet1.png"},
    {name: "BAM2", daily: "6 USDT", buy: "89USDT", total: "2160 USDT", img: "/img/pet1.png"},
    {name: "BAM3", daily: "20 USDT", buy: "228USDT", total: "7200 USDT", img: "/img/pet1.png"},
  ];
  const [openBuy, setOpenBuy] = useState<null | {plan: string; price: string}>(null);
  return (
    <div className="okbam-home">
      <div className="okbam-header">
        <div className="left">
          <Avatar size={36} icon={<UserOutlined />} />
          <div className="info">
            <div className="name">BAM</div>
            <div className="sub">Bear Asset Management</div>
          </div>
        </div>
        <div className="actions">
          <button className="icon-btn" aria-label="bill">
            <AuditOutlined />
          </button>
          <button className="icon-btn" aria-label="bell">
            <BellOutlined />
          </button>
          <button className="icon-btn" aria-label="emoji">
            <SmileOutlined />
          </button>
        </div>
      </div>

      <div className="okbam-banner">
        <div className="title">
          BAM–Invite Friends
          <br />
          BAM3
        </div>
        <div className="sub">Earn 300USDT from your friends' monthly income (50%)</div>
        <div className="banner-bear">
          <img src="/img/pet1.png" alt="bear" />
        </div>
      </div>

      <div className="okbam-ticker">
        <div className="ticker-inner">
          <span className="emoji">🔔</span>
          July 2025 brings you many benefits and opportunities!
          <span className="spacer"> · </span>
          July 2025 brings you many benefits and opportunities!
        </div>
      </div>

      <div className="okbam-actions">
        <button className="action">
          <WalletOutlined />
          <span>Deposit</span>
        </button>
        <button className="action" onClick={goWithdraw}>
          <DollarCircleOutlined />
          <span>Withdraw</span>
        </button>
        <button className="action">
          <CalendarOutlined />
          <span>Login</span>
        </button>
        <button className="action" onClick={onGoToBam}>
          <TeamOutlined />
          <span>Invite</span>
        </button>
      </div>

      <div className="okbam-cta">
        <div className="cta-title">Special program for<br />new accounts and members</div>
        <div className="cta-content">
          <div className="cta-row">
            <span className="cta-label">Premium Product:</span>
            <span className="cta-value">Dragon</span>
          </div>
          <div className="cta-row">
            <span className="cta-label">Cycle: 20 days</span>
            <span className="cta-value">3.25$/day</span>
          </div>
          <div className="cta-row">
            <span className="cta-label">Min: 35$</span>
            <button className="cta-button">Join Now</button>
          </div>
        </div>
      </div>

      <div className="okbam-section">
        <div className="section-header">
          <div className="section-title">
            <span className="title-icon">🧸</span>
            <span>BAM VIP</span>
          </div>
          <button className="see-all" onClick={onGoToBam}>
            View All <RightOutlined />
          </button>
        </div>
        {/** removed available balance block per request */}
        <div className="vip-list">
          {tiers.map((t, idx) => (
            <div key={t.name} className={`vip-card vip-${idx + 1}`}>
              <div className="vip-left">
                <div className="vip-name">{t.name}</div>
                <div className="vip-meta">Daily Income: {t.daily}</div>
                <div className="vip-meta">Commitment Period: 360 days</div>
                <div className="vip-meta">Total Revenue: {t.total}</div>
                <div className="price-line">
                  <span style={{whiteSpace: "nowrap"}}>Purchase Amount</span>
                  <b className="price">{t.buy}</b>
                </div>
              </div>
              <div className="vip-right">
                <img src="/img/pet1.png" alt="bear" className="bear-img" />
                <button className="buy" onClick={() => setOpenBuy({plan: t.name, price: t.buy})}>
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ModalCustom open={!!openBuy} onCancel={() => setOpenBuy(null)} footer={false} width="100%" style={{maxWidth: 520}} bodyStyle={{padding: 0, background: "#141414"}}>
        {openBuy && (
          <BAMBuySheet
            planName={openBuy.plan}
            price={openBuy.price}
            onClose={() => setOpenBuy(null)}
          />
        )}
      </ModalCustom>
    </div>
  );
}


