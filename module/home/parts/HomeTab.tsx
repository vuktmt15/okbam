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
import DepositScreen from "./DepositScreen";

type Props = {
  onGoToBam: () => void;
  onGoToInvite: () => void;
};

export default function HomeTab({onGoToBam, onGoToInvite}: Props): JSX.Element {
  const {goWithdraw} = useContext(MyTabContext);
  const [showDeposit, setShowDeposit] = useState(false);
  const [bamPackages, setBamPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openBuy, setOpenBuy] = useState<null | {plan: string; price: string}>(null);

  // Fetch BAM packages from API
  React.useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/product/');
        const data = await response.json();
        if (data.statusCode === 'OK' && data.body) {
          setBamPackages(data.body);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchPackages, 5000);

    return () => clearInterval(interval);
  }, []);
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
        {/* <div className="actions">
          <button className="icon-btn" aria-label="bill">
            <AuditOutlined />
          </button>
          <button className="icon-btn" aria-label="bell">
            <BellOutlined />
          </button>
          <button className="icon-btn" aria-label="emoji">
            <SmileOutlined />
          </button>
        </div> */}
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
        <button className="action" onClick={() => setShowDeposit(true)}>
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
        <button className="action" onClick={onGoToInvite}>
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
          {loading ? (
            <div className="loading">Đang tải danh sách BAM packages...</div>
          ) : (
            bamPackages.map((pkg, index) => (
              <div key={pkg.id} className={`vip-card vip-${index + 1}`}>
                <div className="vip-left">
                  <div className="vip-name">{pkg.title}</div>
                  <div className="vip-meta">Daily Income: ${pkg.dailyIncome}</div>
                  <div className="vip-meta">Commitment Period: {pkg.period} days</div>
                  <div className="vip-meta">Total Revenue: ${pkg.amount}</div>
                  <div className="price-line">
                    <span style={{whiteSpace: "nowrap"}}>Purchase Amount</span>
                    <b className="price">${pkg.purchaseAmount}</b>
                  </div>
                </div>
                <div className="vip-right">
                  <img src={pkg.imageUrl} alt="bear" className="bear-img" />
                  {pkg.status === 1 ? (
                    <button className="buy" onClick={() => setOpenBuy({plan: pkg.title, price: `$${pkg.purchaseAmount}`})}>Buy</button>
                  ) : (
                    <div className="locked">
                      <span className="lock-icon">🔒</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ModalCustom open={showDeposit} onCancel={() => setShowDeposit(false)} footer={false} width="100%" style={{maxWidth: 520}} bodyStyle={{padding: 0, background: "#111"}}>
        {showDeposit && (
          <DepositScreen onBack={() => setShowDeposit(false)} />
        )}
      </ModalCustom>

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


