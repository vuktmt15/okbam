import React, {useContext, useState, useEffect} from "react";
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
  CloseOutlined,
} from "@ant-design/icons";
import {Avatar} from "antd";
import {ModalCustom} from "@components/ModalCustom";
import BAMBuySheet from "./BAMBuySheet";
import {MyTabContext} from "./context";
import DepositScreen from "./DepositScreen";
import {useAuth} from "../../../contexts/AuthContext";

type Props = {
  onGoToBam: () => void;
  onGoToInvite: () => void;
};

export default function HomeTab({onGoToBam, onGoToInvite}: Props): JSX.Element {
  const {goWithdraw} = useContext(MyTabContext);
  const {user, userDetails, fetchUserDetails} = useAuth();
  const [showDeposit, setShowDeposit] = useState(false);
  const [bamPackages, setBamPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openBuy, setOpenBuy] = useState<null | {plan: string; price: string; id: number}>(null);
  const [showMyInvestments, setShowMyInvestments] = useState(false);
  const [myInvestments, setMyInvestments] = useState<any[]>([]);
  const [investmentsLoading, setInvestmentsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch user details and BAM packages from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user details if not already loaded
        if (user && !userDetails) {
          await fetchUserDetails(user.id);
        }

        // Fetch BAM packages with cache busting
        const packagesResponse = await fetch(`/api/product/?t=${Date.now()}`);
        const packagesData = await packagesResponse.json();
        console.log('HomeTab - BAM packages response:', packagesData);
        if (packagesData.statusCode === 'OK' && packagesData.body) {
          setBamPackages(packagesData.body);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Poll for updates every 2 seconds
    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, [user, userDetails, fetchUserDetails]);

  // Update current time every second for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch my investments
  const fetchMyInvestments = async () => {
    if (!userDetails?.referrerId && !userDetails?.refererCode) {
      console.error('Referrer ID not found');
      return;
    }

    setInvestmentsLoading(true);
    try {
      const referrerId = userDetails?.referrerId || userDetails?.refererCode;
      const response = await fetch(`/api/investment-packages/get-investment?referrerId=${referrerId}`);
      const data = await response.json();
      
      if (data.statusCode === 'OK' && data.body) {
        setMyInvestments(data.body);
      }
    } catch (error) {
      console.error('Error fetching investments:', error);
    } finally {
      setInvestmentsLoading(false);
    }
  };

  const handleViewAll = () => {
    setShowMyInvestments(true);
    fetchMyInvestments();
  };

  // Fetch investments when component mounts to check for active packages
  useEffect(() => {
    if (userDetails?.referrerId || userDetails?.refererCode) {
      fetchMyInvestments();
    }
  }, [userDetails]);
  return (
    <div className="okbam-home">
      <div className="okbam-header">
        <div className="left">
          <Avatar size={36} icon={<UserOutlined />} />
          <div className="info">
            <div className="name">{userDetails?.name || 'BAM'}</div>
            <div className="sub">{userDetails?.email || 'Bear Asset Management'}</div>
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
          <button className="see-all" onClick={handleViewAll}>
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
                  {isPackageActive(pkg.id) ? (
                    <div className="countdown-container">
                      <div className="countdown-title">Time Remaining</div>
                      <div className="countdown-time">{getCountdownTime(pkg.id)}</div>
                      <div className="countdown-days">{getRemainingDays(pkg.id)} days left</div>
                    </div>
                  ) : (
                    <img src={pkg.imageUrl} alt="bear" className="bear-img" />
                  )}
                  {!isPackageActive(pkg.id) && (
                    <button 
                      className="buy" 
                      onClick={pkg.status === 1 ? () => setOpenBuy({plan: pkg.title, price: `$${pkg.purchaseAmount}`, id: pkg.id}) : undefined}
                      disabled={pkg.status !== 1}
                    >
                      {pkg.status === 1 ? 'Buy' : '🔒'}
                    </button>
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
            planId={openBuy.id}
            planName={openBuy.plan}
            price={openBuy.price}
            onClose={() => setOpenBuy(null)}
          />
        )}
      </ModalCustom>

      {/* My Investments Modal */}
      <ModalCustom 
        open={showMyInvestments} 
        onCancel={() => setShowMyInvestments(false)} 
        footer={false} 
        width="100%" 
        style={{maxWidth: 520}} 
        bodyStyle={{padding: 0, background: "#111"}}
      >
        <div className="my-investments-modal">
          <div className="modal-header">
            <h2>My Investments</h2>
            <button className="close-btn" onClick={() => setShowMyInvestments(false)}>
              <CloseOutlined />
            </button>
          </div>
          
          <div className="modal-content">
            {investmentsLoading ? (
              <div className="loading">Loading investments...</div>
            ) : myInvestments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <h3>No Investments Yet</h3>
                <p>You haven't invested in any BAM packages yet.</p>
                <button className="invest-btn" onClick={() => setShowMyInvestments(false)}>
                  Start Investing
                </button>
              </div>
            ) : (
              <div className="investments-list">
                {myInvestments.map((investment) => (
                  <div key={investment.id} className="investment-card">
                    <div className="card-header">
                      <div className="bam-info">
                        <h3>{getBamName(investment.bamId)}</h3>
                        <span className="status active">Active</span>
                      </div>
                      <div className="amount">${investment.amount}</div>
                    </div>
                    
                    <div className="card-body">
                      <div className="info-row">
                        <div className="info-item">
                          <CalendarOutlined />
                          <span>Duration: {investment.durationDays} days</span>
                        </div>
                        <div className="info-item">
                          <DollarCircleOutlined />
                          <span>Interest: {investment.interestRate}% daily</span>
                        </div>
                      </div>
                      
                      <div className="remaining-days">
                        <div className="remaining-info">
                          <span className="remaining-label">Days Remaining:</span>
                          <span className="remaining-value">{calculateRemainingDays(investment)} days</span>
                        </div>
                        <div className="remaining-bar">
                          <div 
                            className="remaining-fill" 
                            style={{ width: `${calculateRemainingPercentage(investment)}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="progress-section">
                        <div className="progress-label">Progress</div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${investment.progress * 100}%` }}
                          />
                        </div>
                        <div className="progress-text">{Math.round(investment.progress * 100)}%</div>
                      </div>
                      
                      <div className="dates">
                        <div className="date-item">
                          <span className="label">Invested:</span>
                          <span className="value">{formatDate(investment.createdAt)}</span>
                        </div>
                        {investment.updatedAt && (
                          <div className="date-item">
                            <span className="label">Updated:</span>
                            <span className="value">{formatDate(investment.updatedAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </ModalCustom>
    </div>
  );

  // Helper functions
  function getBamName(bamId: number) {
    const bamNames: { [key: number]: string } = {
      1: 'BAM Basic',
      2: 'BAM Premium', 
      3: 'BAM Pro',
      4: 'BAM VIP',
      5: 'BAM Elite'
    };
    return bamNames[bamId] || `BAM ${bamId}`;
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function calculateRemainingDays(investment: any) {
    const startDate = new Date(investment.createdAt);
    const endDate = new Date(startDate.getTime() + (investment.durationDays * 24 * 60 * 60 * 1000));
    const now = new Date();
    const remainingMs = endDate.getTime() - now.getTime();
    const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
    return Math.max(0, remainingDays);
  }

  function calculateRemainingPercentage(investment: any) {
    const startDate = new Date(investment.createdAt);
    const endDate = new Date(startDate.getTime() + (investment.durationDays * 24 * 60 * 60 * 1000));
    const now = new Date();
    const totalMs = endDate.getTime() - startDate.getTime();
    const elapsedMs = now.getTime() - startDate.getTime();
    const percentage = (elapsedMs / totalMs) * 100;
    return Math.min(100, Math.max(0, percentage));
  }

  // Check if a package is currently active (user has invested in it)
  function isPackageActive(packageId: number) {
    return myInvestments.some(investment => investment.bamId === packageId);
  }

  // Get countdown time for a specific package
  function getCountdownTime(packageId: number) {
    const investment = myInvestments.find(inv => inv.bamId === packageId);
    if (!investment) return '00:00:00';

    const startDate = new Date(investment.createdAt);
    const endDate = new Date(startDate.getTime() + (investment.durationDays * 24 * 60 * 60 * 1000));
    const remainingMs = endDate.getTime() - currentTime.getTime();

    if (remainingMs <= 0) return '00:00:00';

    const days = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
    const hours = Math.floor((remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((remainingMs % (60 * 1000)) / 1000);

    return `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Get remaining days for a specific package
  function getRemainingDays(packageId: number) {
    const investment = myInvestments.find(inv => inv.bamId === packageId);
    if (!investment) return 0;

    const startDate = new Date(investment.createdAt);
    const endDate = new Date(startDate.getTime() + (investment.durationDays * 24 * 60 * 60 * 1000));
    const remainingMs = endDate.getTime() - currentTime.getTime();
    const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
    return Math.max(0, remainingDays);
  }
}


