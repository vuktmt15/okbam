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
          <div className="vip-card vip-1">
            <div className="vip-left">
              <div className="vip-name">BAM Basic</div>
              <div className="vip-meta">Daily Income: $0.5</div>
              <div className="vip-meta">Commitment Period: 360 days</div>
              <div className="vip-meta">Total Revenue: $180</div>
              <div className="price-line">
                <span style={{whiteSpace: "nowrap"}}>Purchase Amount</span>
                <b className="price">$10</b>
              </div>
            </div>
            <div className="vip-right">
              <img src="/img/pet1.png" alt="bear" className="bear-img" />
              <button className="buy">Buy</button>
            </div>
          </div>

          <div className="vip-card vip-2">
            <div className="vip-left">
              <div className="vip-name">BAM Premium</div>
              <div className="vip-meta">Daily Income: $2.25</div>
              <div className="vip-meta">Commitment Period: 360 days</div>
              <div className="vip-meta">Total Revenue: $810</div>
              <div className="price-line">
                <span style={{whiteSpace: "nowrap"}}>Purchase Amount</span>
                <b className="price">$45</b>
              </div>
            </div>
            <div className="vip-right">
              <img src="/img/pet1.png" alt="bear" className="bear-img" />
              <button className="buy">Buy</button>
            </div>
          </div>

          <div className="vip-card vip-3">
            <div className="vip-left">
              <div className="vip-name">BAM Pro</div>
              <div className="vip-meta">Daily Income: $5.25</div>
              <div className="vip-meta">Commitment Period: 360 days</div>
              <div className="vip-meta">Total Revenue: $1890</div>
              <div className="price-line">
                <span style={{whiteSpace: "nowrap"}}>Purchase Amount</span>
                <b className="price">$105</b>
              </div>
            </div>
            <div className="vip-right">
              <img src="/img/pet1.png" alt="bear" className="bear-img" />
              <div className="locked">
                <span>🔒</span>
                <span>Locked</span>
              </div>
            </div>
          </div>

          <div className="vip-card vip-4">
            <div className="vip-left">
              <div className="vip-name">BAM VIP</div>
              <div className="vip-meta">Daily Income: $25</div>
              <div className="vip-meta">Commitment Period: 360 days</div>
              <div className="vip-meta">Total Revenue: $9000</div>
              <div className="price-line">
                <span style={{whiteSpace: "nowrap"}}>Purchase Amount</span>
                <b className="price">$500</b>
              </div>
            </div>
            <div className="vip-right">
              <img src="/img/pet1.png" alt="bear" className="bear-img" />
              <button className="buy">Buy</button>
            </div>
          </div>

          <div className="vip-card vip-5">
            <div className="vip-left">
              <div className="vip-name">BAM Elite</div>
              <div className="vip-meta">Daily Income: $67.5</div>
              <div className="vip-meta">Commitment Period: 360 days</div>
              <div className="vip-meta">Total Revenue: $24300</div>
              <div className="price-line">
                <span style={{whiteSpace: "nowrap"}}>Purchase Amount</span>
                <b className="price">$1350</b>
              </div>
            </div>
            <div className="vip-right">
              <img src="/img/pet1.png" alt="bear" className="bear-img" />
              <div className="locked">
                <span>🔒</span>
                <span>Locked</span>
              </div>
            </div>
          </div>
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


