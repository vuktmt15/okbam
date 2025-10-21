import React, {useContext, useState, useEffect} from "react";
import BottomSheet from "@components/BottomSheet";
import {BellOutlined, GlobalOutlined, SettingOutlined} from "@ant-design/icons";
import {MyTabContext} from "./context";
import {useAuth} from "../../../contexts/AuthContext";
import WalletCard from "./WalletCard";
import SwapScreen from "./SwapScreen";
import DepositScreen from "./DepositScreen";
import WithdrawScreen from "./WithdrawScreen";
import {ModalCustom} from "@components/ModalCustom";
// import {useLanguage} from "@hooks/useLanguage";
// import LanguageSelector from "@components/LanguageSelector";

export default function MyTab() {
  const {goWithdraw} = useContext(MyTabContext);
  const {logout, user, userDetails, fetchUserDetails} = useAuth();
  const [balance, setBalance] = useState({usdt: 0, dragon: 0});
  const [showSwap, setShowSwap] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  // Modal states  
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  // History modals
  const [showDepositHistory, setShowDepositHistory] = useState(false);
  const [showWithdrawHistory, setShowWithdrawHistory] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [depositHistory, setDepositHistory] = useState<any[]>([]);
  const [withdrawHistory, setWithdrawHistory] = useState<any[]>([]);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [historyTab, setHistoryTab] = useState<'swap' | 'commission'>('swap');
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [depLoading, setDepLoading] = useState(false);
  const [wdLoading, setWdLoading] = useState(false);
  const [fakeNotification, setFakeNotification] = useState("User*** successfully recharged 830USDT");
  const [depPage, setDepPage] = useState(1);
  const [wdPage, setWdPage] = useState(1);
  const [depTotalPages, setDepTotalPages] = useState(0);
  const [wdTotalPages, setWdTotalPages] = useState(0);

  // Number formatting function with thousand separators
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  // Open withdraw modal from My tab  
  const handleWithdrawClick = () => {
    setShowWithdraw(true);
  };

  // Open deposit modal from My tab
  const handleDepositClick = () => {
    setShowDeposit(true);
  };

  // Handle Telegram links
  const handleOnlineSupport = () => {
    window.open('https://t.me/Dragon_Puff', '_blank');
  };

  const handleCommunity = () => {
    window.open('https://t.me/Dragon_community137', '_blank');
  };

  // Fetch histories
  const fetchHistory = async (type: 'deposit' | 'withdraw', page: number = 1) => {
    const setLoading = type === 'deposit' ? setDepLoading : setWdLoading;
    setLoading(true);
    try {
      const userLocal = typeof window !== 'undefined' ? localStorage.getItem('user_details') : null;
      const parsed = userLocal ? JSON.parse(userLocal) : null;
      const referrerId = parsed?.referrerId || parsed?.refererCode;
      if (!referrerId) return;
      const res = await fetch(`/api/history-balance?ref=${referrerId}&page=${page}&limit=5`);
      const data = await res.json();
      if (data?.data) {
        const items = data.data.filter((i: any) => (type === 'deposit' ? i.typeBalance === 1 : i.typeBalance === 2));
        if (type === 'deposit') {
          setDepositHistory(items);
          setDepPage(data.pagination.currentPage);
          setDepTotalPages(data.pagination.totalPages);
        } else {
          setWithdrawHistory(items);
          setWdPage(data.pagination.currentPage);
          setWdTotalPages(data.pagination.totalPages);
        }
      }
    } catch (e) {
      console.error('Fetch history error', e);
    } finally {
      setLoading(false);
    }
  };

  // Fetch swap and commission history
  const fetchHistoryData = async (tab: 'swap' | 'commission', page: number = 1) => {
    setHistoryLoading(true);
    try {
      const userLocal = typeof window !== 'undefined' ? localStorage.getItem('user_details') : null;
      const parsed = userLocal ? JSON.parse(userLocal) : null;
      const referrerId = parsed?.referrerId || parsed?.refererCode;
      if (!referrerId) return;

      let res;
      if (tab === 'swap') {
        res = await fetch(`/api/history-balance-swap?ref=${referrerId}`);
      } else {
        // Updated to use new commission history API
        res = await fetch(`/api/customers/history-balance-claim?ref=${referrerId}&isSpecial=2`);
      }
      
      const data = await res.json();
      if (data?.body) {
        let items = data.body;
        
        // Sort by date descending
        items.sort((a: any, b: any) => {
          const dateA = new Date(a.createDate || a.investedAt);
          const dateB = new Date(b.createDate || b.investedAt);
          return dateB.getTime() - dateA.getTime();
        });

        // Paginate (5 items per page)
        const itemsPerPage = 5;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedItems = items.slice(startIndex, endIndex);
        
        setHistoryData(paginatedItems);
        setHistoryPage(page);
        setHistoryTotalPages(Math.ceil(items.length / itemsPerPage));
      }
    } catch (e) {
      console.error('Fetch history data error', e);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Fetch user details and balance
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user details if not already loaded
        if (user && !userDetails) {
          await fetchUserDetails(user.id);
        }

        // Fetch balance if we have user details
        if (userDetails?.referrerId) {
          const balanceResponse = await fetch(`/api/getBalance?referrerId=${userDetails.referrerId}`);
          const balanceData = await balanceResponse.json();
          if (balanceData?.balance?.usdt !== undefined && balanceData?.balance?.dragon !== undefined) {
            setBalance({
              usdt: balanceData.balance.usdt,
              dragon: balanceData.balance.dragon
            });
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Keep default balance of 0 on error
      }
    };

    fetchData();
    const onBalanceUpdate = () => fetchData();
    window.addEventListener('balanceUpdate', onBalanceUpdate);
    return () => window.removeEventListener('balanceUpdate', onBalanceUpdate);
  }, [user, userDetails, fetchUserDetails]);

  // Auto-load history when modals open
  useEffect(() => {
    if (showDepositHistory) fetchHistory('deposit', 1);
  }, [showDepositHistory]);
  useEffect(() => {
    if (showWithdrawHistory) fetchHistory('withdraw', 1);
  }, [showWithdrawHistory]);
  useEffect(() => {
    if (showHistory) fetchHistoryData(historyTab, 1);
  }, [showHistory, historyTab]);

  // Fake notification rotation system
  useEffect(() => {
    const generateFakeNotification = () => {
      const userIds = ['User0***', 'User0***', 'User0***', 'User1***', 'User2***', 'User3***', 'User4***', 'User5***', 'User7***', 'User8***'];
      const amounts = [150, 230, 450, 680, 830, 920, 1200, 1580, 2340, 3200, 4500, 5800];
      const actions = ['successfully recharged', 'successfully withdrew', 'completed deposit of'];
      
      const randomUser = userIds[Math.floor(Math.random() * userIds.length)];
      const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      
      return `${randomUser} ${randomAction} ${randomAmount}USDT`;
    };

    const interval = setInterval(() => {
      setFakeNotification(generateFakeNotification());
    }, 15000 + Math.random() * 5000); // 15-20 seconds

    return () => clearInterval(interval);
  }, []);

  // const [openLang, setOpenLang] = useState(false);
  // const {currentLanguage, changeLanguage, getCurrentLanguageInfo, languageOptions} = useLanguage();
  return (
    <div className="okbam-my">
      <div className="profile">
        <button className="bell-btn" aria-label="Notifications" onClick={() => setShowNotifications(true)}>
          <BellOutlined />
        </button>
        <div className="row top">
          <div className="left">
            <div className="avatar">
              <img src="/img/avatar/avatar-dragon.jpg" alt="Avatar" />
            </div>
            <div className="info">
              <div className="email">{userDetails?.email || user?.email || ''}</div>
              <div className="id">ID: {userDetails?.id || user?.id || ''}</div>
            </div>
          </div>
          {/* <div className="icons">
            <GlobalOutlined />
            <BellOutlined />
            <SettingOutlined />
          </div> */}
        </div>
        <div className="notice">{fakeNotification}</div>
        <WalletCard>
          <div className="wallet">
            <div className="wallet-title">
              <span className="wallet-label">Wallet Balance:</span>
            </div>
            <div className="wallet-amounts">
              <div className="wallet-coin">
                <span className="amount-value"><b>{formatNumber(balance.usdt)}</b></span>
                <span className="amount-unit">USDT</span>
                <img src="/img/usdt-logo.png" alt="USDT" className="amount-icon" />
              </div>
              <div className="wallet-coin">
                <span className="amount-value"><b>{formatNumber(balance.dragon)}</b></span>
                <span className="amount-unit">Dragon</span>
                <img src="/img/dragon/special-dragon-home.png" alt="dragon egg" className="amount-icon dragon-icon" />
              </div>
            </div>
          </div>
          <div className="quick">
            <button onClick={handleDepositClick}>Deposit</button>
            <button onClick={handleWithdrawClick}>Withdraw</button>
            <button onClick={() => setShowSwap(true)}>SWAP</button>
            <button onClick={() => setShowHistory(true)}>History</button>
          </div>
        </WalletCard>
      </div>
      <div className="list">
        <button className="item" onClick={() => setShowNotifications(true)}>Notifications</button>
        <button className="item" onClick={handleOnlineSupport}>Online Support</button>
        <button className="item" onClick={handleCommunity}>DRAGON Community</button>
        {/* <button className="item" onClick={() => setOpenLang(true)}>
          <span>Language</span>
          <span style={{float: "right", opacity: 0.8}}>{getCurrentLanguageInfo().label} →</span>
        </button> */}
      </div>
      <div className="cta">
        <button className="ghost" onClick={logout}>Logout</button>
      </div>
      {/* Deposit history modal */}
      <ModalCustom open={showDepositHistory} onCancel={() => setShowDepositHistory(false)} footer={false} width="100%" style={{maxWidth: 520}} bodyStyle={{padding: 0, background: "#111"}}>
        {showDepositHistory && (
          <div className="deposit-history" style={{ padding: 16, color: "#fff" }}>
            <div style={{fontWeight: 800, fontSize: 18, marginBottom: 12}}>Deposit History</div>
            {depLoading ? (
              <div style={{textAlign:'center', padding:'20px', color:'#999'}}>Loading deposit history...</div>
            ) : depositHistory.length === 0 ? (
              <div style={{textAlign:'center', padding:'20px', color:'#999'}}>
                <div style={{fontSize:'24px', marginBottom:'8px'}}>📊</div>
                <div>No deposit history found</div>
              </div>
            ) : (
              depositHistory.map((item: any) => (
                <div key={item.id} style={{background:'#1a1a1a', borderRadius:12, padding:12, marginBottom:12}}>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}>
                    <span>Amount:</span><span style={{color:'#52c41a'}}>+${item.amount}</span>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between'}}>
                    <span>Time:</span><span>{new Date(item.createDate).toLocaleString('en-US', {hour:'2-digit', minute:'2-digit', second:'2-digit', year:'numeric', month:'2-digit', day:'2-digit'})}</span>
                  </div>
                </div>
              ))
            )}
            {depTotalPages > 1 && (
              <div style={{display:'flex', justifyContent:'center', gap:16, marginTop:16}}>
                {Array.from({ length: depTotalPages }, (_, i) => i + 1).map((p) => (
                  <span key={p} style={{background: p === depPage ? '#ffd700' : '#555', color: p === depPage ? '#000' : '#fff', borderRadius:14, padding:'4px 10px', cursor:'pointer'}} onClick={() => fetchHistory('deposit', p)}>{p}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </ModalCustom>
      {/* History modal */}
      <ModalCustom open={showHistory} onCancel={() => setShowHistory(false)} footer={false} width="100%" style={{maxWidth: 520}} bodyStyle={{padding: 0, background: "#111"}}>
        {showHistory && (
          <div style={{ padding: 16, color: "#fff" }}>
            <div style={{fontWeight: 800, fontSize: 18, marginBottom: 12}}>History</div>
            
            {/* Tab selector */}
            <div style={{display: 'flex', marginBottom: 16, background: '#1a1a1a', borderRadius: 8, padding: 4}}>
              <button 
                style={{
                  flex: 1, 
                  padding: '8px 16px', 
                  border: 'none', 
                  borderRadius: 6, 
                  background: historyTab === 'swap' ? '#ffd700' : 'transparent',
                  color: historyTab === 'swap' ? '#000' : '#fff',
                  fontWeight: 600
                }}
                onClick={() => setHistoryTab('swap')}
              >
                Swap
              </button>
              <button 
                style={{
                  flex: 1, 
                  padding: '8px 16px', 
                  border: 'none', 
                  borderRadius: 6, 
                  background: historyTab === 'commission' ? '#ffd700' : 'transparent',
                  color: historyTab === 'commission' ? '#000' : '#fff',
                  fontWeight: 600
                }}
                onClick={() => setHistoryTab('commission')}
              >
                Commission
              </button>
            </div>

            {historyLoading ? (
              <div style={{textAlign:'center', padding:'20px', color:'#999'}}>Loading history...</div>
            ) : historyData.length === 0 ? (
              <div style={{textAlign:'center', padding:'20px', color:'#999'}}>
                <div style={{fontSize:'24px', marginBottom:'8px'}}>📊</div>
                <div>No {historyTab} history found</div>
              </div>
            ) : (
              historyData.map((item: any) => (
                <div key={item.id} style={{background:'#1a1a1a', borderRadius:12, padding:12, marginBottom:12}}>
                  {historyTab === 'swap' ? (
                    <>
                      <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}>
                        <span>{item.typeBalance === 3 ? 'USDT → Dragon' : 'Dragon → USDT'}</span>
                        <span style={{color: '#52c41a'}}>
                          {item.typeBalance === 3 ? `+${formatNumber(item.amount)} Dragon` : `+${formatNumber(item.amount)} USDT`}
                        </span>
                      </div>
                      <div style={{display:'flex', justifyContent:'space-between'}}>
                        <span>Time:</span>
                        <span>{new Date(item.createDate).toLocaleString('en-US', {
                          hour:'2-digit', 
                          minute:'2-digit', 
                          second:'2-digit', 
                          year:'numeric', 
                          month:'2-digit', 
                          day:'2-digit'
                        })}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}>
                        <span>Commission</span>
                        <span style={{color:'#52c41a'}}>+{item.amount} Dragon</span>
                      </div>
                      <div style={{display:'flex', justifyContent:'space-between'}}>
                        <span>Time:</span>
                        <span>{new Date(item.createDate).toLocaleString('en-US', {
                          hour:'2-digit', 
                          minute:'2-digit', 
                          second:'2-digit', 
                          year:'numeric', 
                          month:'2-digit', 
                          day:'2-digit'
                        })}</span>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}

            {/* Pagination */}
            {historyTotalPages > 1 && (
              <div style={{display:'flex', justifyContent:'center', gap:16, marginTop:16}}>
                {Array.from({ length: historyTotalPages }, (_, i) => i + 1).map((p) => (
                  <span 
                    key={p} 
                    style={{
                      background: p === historyPage ? '#ffd700' : '#555', 
                      color: p === historyPage ? '#000' : '#fff', 
                      borderRadius:14, 
                      padding:'4px 10px', 
                      cursor:'pointer'
                    }} 
                    onClick={() => fetchHistoryData(historyTab, p)}
                  >
                    {p}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </ModalCustom>
      <ModalCustom open={showSwap} onCancel={() => setShowSwap(false)} footer={false} width="100%" style={{maxWidth: 520}} bodyStyle={{padding: 0, background: "#111"}}>
        {showSwap && (
          <SwapScreen onBack={() => setShowSwap(false)} />
        )}
      </ModalCustom>
      {/* Withdraw history modal */}
      <ModalCustom open={showWithdrawHistory} onCancel={() => setShowWithdrawHistory(false)} footer={false} width="100%" style={{maxWidth: 520}} bodyStyle={{padding: 0, background: "#111"}}>
        {showWithdrawHistory && (
          <div className="withdraw-history" style={{ padding: 16, color: "#fff" }}>
            <div style={{fontWeight: 800, fontSize: 18, marginBottom: 12}}>Withdrawal History</div>
            {wdLoading ? (
              <div style={{textAlign:'center', padding:'20px', color:'#999'}}>Loading withdrawal history...</div>
            ) : withdrawHistory.length === 0 ? (
              <div style={{textAlign:'center', padding:'20px', color:'#999'}}>
                <div style={{fontSize:'24px', marginBottom:'8px'}}>📊</div>
                <div>No withdrawal history found</div>
              </div>
            ) : (
              withdrawHistory.map((item: any) => (
                <div key={item.id} style={{background:'#1a1a1a', borderRadius:12, padding:12, marginBottom:12}}>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}>
                    <span>Amount:</span><span style={{color:'#ff4d4f'}}>- ${item.amount}</span>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between'}}>
                    <span>Time:</span><span>{new Date(item.createDate).toLocaleString('en-US', {hour:'2-digit', minute:'2-digit', second:'2-digit', year:'numeric', month:'2-digit', day:'2-digit'})}</span>
                  </div>
                </div>
              ))
            )}
            {wdTotalPages > 1 && (
              <div style={{display:'flex', justifyContent:'center', gap:16, marginTop:16}}>
                {Array.from({ length: wdTotalPages }, (_, i) => i + 1).map((p) => (
                  <span key={p} style={{background: p === wdPage ? '#ffd700' : '#555', color: p === wdPage ? '#000' : '#fff', borderRadius:14, padding:'4px 10px', cursor:'pointer'}} onClick={() => fetchHistory('withdraw', p)}>{p}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </ModalCustom>
      <ModalCustom open={showNotifications} onCancel={() => setShowNotifications(false)} footer={false} width="100%" style={{maxWidth: 520}} bodyStyle={{padding: 0, background: "#111"}}>
        {showNotifications && (
          <div className="okbam-notifications" style={{padding: 16}}>
            <div style={{fontWeight: 700, fontSize: 16, marginBottom: 12, color: "#fff"}}>Notifications</div>
            <div className="notification-item" style={{background: "#1a1a1a", color: "#fff", borderRadius: 10, padding: 12}}>
              <div style={{fontWeight: 600}}>Account registration successful</div>
              <div style={{opacity: 0.8, fontSize: 12, marginTop: 4}}>Just now</div>
            </div>
          </div>
        )}
      </ModalCustom>

      {/* Deposit Screen Modal */}
      <ModalCustom 
        open={showDeposit} 
        onCancel={() => setShowDeposit(false)} 
        footer={false} 
        width="100%" 
        style={{maxWidth: 520}} 
        bodyStyle={{padding: 0, background: "#000"}}
      >
        {showDeposit && (
          <DepositScreen 
            onBack={() => setShowDeposit(false)} 
          />
        )}
      </ModalCustom>

      {/* Withdraw Screen Modal */}  
      <ModalCustom 
        open={showWithdraw} 
        onCancel={() => setShowWithdraw(false)} 
        footer={false} 
        width="100%" 
        style={{maxWidth: 520}} 
        bodyStyle={{padding: 0, background: "#000"}}
      >
        {showWithdraw && (
          <WithdrawScreen 
            balanceUsdt={balance.usdt}
            onBack={() => setShowWithdraw(false)} 
          />
        )}
      </ModalCustom>

      {/* <BottomSheet open={openLang} onClose={() => setOpenLang(false)}>
        <LanguageSelector onClose={() => setOpenLang(false)} />
      </BottomSheet> */}
    </div>
  );
}


