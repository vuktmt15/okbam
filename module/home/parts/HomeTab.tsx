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
  CheckCircleOutlined,
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
  const [balance, setBalance] = useState({ usdt: 0, dragon: 0 });

  // Check withdraw configuration before opening withdraw screen
  const handleWithdrawClick = async () => {
    try {
      const response = await fetch('http://159.223.91.231:8866/api/admin-configs');
      const configs = await response.json();
      
      if (Array.isArray(configs) && configs.length > 0) {
        const withdrawConfig = configs.find((config: any) => config.id === 1);
        
        if (withdrawConfig) {
          const isEnabled = withdrawConfig.status === 1;
          
          if (isEnabled) {
            goWithdraw(); // Open withdraw screen
          } else {
            alert("System is overloaded, please try again later!");
          }
        } else {
          alert("System is overloaded, please try again later!");
        }
      } else {
        alert("System is overloaded, please try again later!");
      }
    } catch (error) {
      console.error('Error checking withdraw config:', error);
      alert("System is overloaded, please try again later!");
    }
  };

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

  // no global daily check-in anymore

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

  // Per-package daily check-in helpers
  function getNextCheckKey(bamId: number) {
    return `bam_next_check_${bamId}`;
  }

  function getNextCheckTime(bamId: number): number | null {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(getNextCheckKey(bamId)) : null;
    if (!raw) return null;
    const ts = Number(raw);
    return Number.isFinite(ts) ? ts : null;
  }

  function setNextCheckTime(bamId: number, ts: number) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(getNextCheckKey(bamId), String(ts));
    }
  }

  function ensureNextCheckScheduled(bamId: number) {
    const existing = getNextCheckTime(bamId);
    if (existing == null) {
      // schedule 24h from now by default
      setNextCheckTime(bamId, Date.now() + 24 * 60 * 60 * 1000);
    }
  }

  function getDailyCountdown(bamId: number): string {
    const next = getNextCheckTime(bamId);
    if (next == null) return '24:00:00';
    const remainingMs = Math.max(0, next - currentTime.getTime());
    const hours = Math.floor(remainingMs / (60 * 60 * 1000));
    const minutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((remainingMs % (60 * 1000)) / 1000);
    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }

  function canCheckNow(bamId: number): boolean {
    const next = getNextCheckTime(bamId);
    if (next == null) return false;
    return currentTime.getTime() >= next;
  }

  const handleDailyCheck = async (bamId: number) => {
    if (!userDetails?.referrerId && !userDetails?.refererCode) {
      console.error('Referrer ID not found');
      return;
    }
    try {
      const referrerId = userDetails?.referrerId || userDetails?.refererCode;
      const res = await fetch(`/api/investment-history/check-daily-bam?referrerId=${referrerId}&bamId=${bamId}`);
      const data = await res.json();
      if (res.ok && (data.statusCode === 'OK' || data.statusCode === 'CREATED')) {
        // schedule next 24h
        setNextCheckTime(bamId, Date.now() + 24 * 60 * 60 * 1000);
      } else {
        alert(data.message || 'Check-in failed. Please try again.');
      }
    } catch (e) {
      console.error('Daily check error', e);
      alert('Network error. Please try again.');
    }
  };

  // Fetch investments when component mounts to check for active packages
  useEffect(() => {
    if (userDetails?.referrerId || userDetails?.refererCode) {
      fetchMyInvestments();
    }
  }, [userDetails]);

  // Fetch user balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (!userDetails?.referrerId && !userDetails?.refererCode) return;
      
      try {
        const referrerId = userDetails?.referrerId || userDetails?.refererCode;
        const res = await fetch(`/api/getBalance?referrerId=${referrerId}`);
        const data = await res.json();
        
        if (data?.balance?.usdt !== undefined && data?.balance?.dragon !== undefined) {
          setBalance({ usdt: data.balance.usdt, dragon: data.balance.dragon });
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
        // Keep default balance of 0 on error
      }
    };

    fetchBalance();
  }, [userDetails]);
  return (
    <div className="okbam-home">
      <div className="okbam-header">
        <div className="left">
          <div className="dragon-title">DRAGON</div>
        </div>
        <div className="actions" />
      </div>

      <div className="okbam-banner">
        <div className="banner-header">
          <div className="nft-badge">
            <img src="/img/nft.png" alt="NFT" />
          </div>
          <div className="banner-title">DRAGON</div>
          <div className="header-spacer" />
        </div>
        <div className="banner-left">
          <div className="banner-sub1">Explore the Dragon world</div>
          <div className="banner-sub2">NFT Blockchain Project</div>
          <div className="banner-bullets">
            <div className="bullet">🐉 Staking NFT to receive regular tokens</div>
            <div className="bullet">🎁 Daily missions to earn rewards</div>
            <div className="bullet">👉 Early join to get bonus & special offers</div>
          </div>
        </div>
        <div className="banner-right">
          <img src="/img/dragon/special-dragon-detail.png" alt="Dragon" />
        </div>
      </div>

      <div className="okbam-ticker">
        <div className="ticker-inner">
          🚀 NFT DRAGON is live! Start today to earn daily token rewards and special offers. 👉 Join now, don’t miss out!
        </div>
      </div>

      <div className="okbam-actions">
        <button className="action" onClick={() => setShowDeposit(true)}>
          <WalletOutlined />
          <span>Deposit</span>
        </button>
        <button className="action" onClick={handleWithdrawClick}>
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

      <div className="okbam-suggested-section">
        <div className="suggested-title">Suggested Products:</div>
        <div className="suggested-bonus">Special bonus for new accounts and members</div>
      </div>

      <div className="okbam-cta">
        <div className="vip-card vip-special" style={{ background: getVipGradient(1) }}>
          <div className="vip-left">
            {(() => {
              const special = bamPackages.find((p: any) => ((p?.id ?? p?.bamId ?? p?.planId) === 1));
              const title = special?.title ?? 'Special Dragon';
              const min = special?.purchaseAmount ?? 0;
              const daily = special?.dailyIncome ?? 0;
              const period = special?.period ?? 0;
              const total = special?.amount ?? 0;
              return (
                <>
                  <div className="vip-name">{title}</div>
                  <div className="vip-meta">Min: ${min}</div>
                  <div className="vip-meta">24h Profit: {daily} dragon</div>
                  <div className="vip-meta">Cycle: {period} days</div>
                  <div className="vip-meta">Total Profit: {total} dragon</div>
                </>
              );
            })()}
          </div>
          <div className="vip-right">
            {(() => {
              const special = bamPackages.find((p: any) => ((p?.id ?? p?.bamId ?? p?.planId) === 1));
              const imgSrc = special?.imageUrl || '/img/pet1.png';
              return <img src={imgSrc} alt="special" className="bear-img" />;
            })()}
            <button
              className="buy"
              onClick={() => {
                // If special purchased → navigate to Special tab; else open buy
                const userDetailsStr = typeof window !== 'undefined' ? localStorage.getItem('user_details') : null;
                let hasSpecial = false;
                try {
                  if (userDetailsStr) {
                    const parsed = JSON.parse(userDetailsStr);
                    const referrerId = parsed?.referrerId || parsed?.refererCode;
                    if (referrerId) {
                      // Fire and forget check
                      fetch(`/api/investment-packages/get-investment?referrerId=${referrerId}`).then(r=>r.json()).then(d=>{
                        if (d?.statusCode === 'OK' && Array.isArray(d.body)) {
                          const owned = d.body.some((inv:any)=> (inv?.bamId===1||inv?.id===1||inv?.planId===1));
                          if (owned) {
                            const ev = new CustomEvent('navigateToTab', { detail: 'special' });
                            window.dispatchEvent(ev);
                          }
                        }
                      });
                    }
                  }
                } catch {}

                const special = bamPackages.find((p: any) => ((p?.id ?? p?.bamId ?? p?.planId) === 1));
                if (special && special.status === 1) {
                  setOpenBuy({ plan: special.title, price: `$${special.purchaseAmount}`, id: special.id ?? 1 });
                }
              }}
            >
              {/* Text changes: simple Go to */}
              Go to
            </button>
          </div>
        </div>
      </div>

      <div className="okbam-section">
        <div className="wallet-balance-section">
          <div className="balance-row">
            <span className="balance-label">Wallet Balance:</span>
            <span className="balance-amount">
              {balance.usdt} USDT
            </span>
          </div>
          <div className="rank-row">
            <span className="rank-label">Dragon Rank</span>
          </div>
        </div>
        {/** removed available balance block per request */}
        <div className="vip-list">
          {loading ? (
            <div className="loading">Loading BAM packages...</div>
          ) : (
            bamPackages.filter((p:any) => {
              const pid = p?.id ?? p?.bamId ?? p?.planId;
              return pid !== 1 && pid !== 11;
            }).map((pkg, index) => (
              <div
                key={pkg.id}
                className={`vip-card vip-${index + 1}`}
                style={{ background: getVipGradient(pkg?.id ?? index) }}
              >
                <div className="vip-left">
                  <div className="vip-name">Dragon {index + 1}</div>
                  <div className="vip-meta">Min: ${pkg.purchaseAmount}</div>
                  <div className="vip-meta">24h Profit: {pkg.dailyIncome} dragon</div>
                  <div className="vip-meta">Cycle: {pkg.period} days</div>
                  <div className="vip-meta">Total Profit: {pkg.amount} dragon</div>
                </div>
                <div className="vip-right">
                  <img src={pkg.imageUrl || '/img/pet1.png'} alt="bear" className="bear-img" />
                  <button 
                    className="buy" 
                    onClick={() => setOpenBuy({plan: pkg.title, price: `$${pkg.purchaseAmount}`, id: pkg.id})}
                  >
                    Buy
                  </button>
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
            key={openBuy.id}
            planId={openBuy.id}
            planName={openBuy.plan}
            price={openBuy.price}
            showBonusNote={(openBuy.id === 11)}
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
  function getVipGradient(seed: number) {
    const gradients = [
      'linear-gradient(90deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
      'linear-gradient(90deg, #fff8e1 0%, #ffecb3 50%, #ffe082 100%)',
      'linear-gradient(90deg, #fce4ec 0%, #f8bbd9 50%, #f48fb1 100%)',
      'linear-gradient(90deg, #e8f5e8 0%, #c8e6c9 50%, #a5d6a7 100%)',
      'linear-gradient(90deg, #fff3e0 0%, #ffe0b2 50%, #ffcc80 100%)',
      'linear-gradient(90deg, #ede7f6 0%, #d1c4e9 50%, #b39ddb 100%)',
      'linear-gradient(90deg, #e0f7fa 0%, #b2ebf2 50%, #80deea 100%)',
      'linear-gradient(90deg, #f1f8e9 0%, #dcedc8 50%, #c5e1a5 100%)'
    ];
    const index = Math.abs(Number(seed)) % gradients.length;
    return gradients[index];
  }
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


