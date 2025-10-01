import React, {useContext, useState, useEffect} from "react";
import BottomSheet from "@components/BottomSheet";
import {BellOutlined, GlobalOutlined, SettingOutlined} from "@ant-design/icons";
import {MyTabContext} from "./context";
import {useAuth} from "../../../contexts/AuthContext";
import WalletCard from "./WalletCard";
import SwapScreen from "./SwapScreen";
import {ModalCustom} from "@components/ModalCustom";
// import {useLanguage} from "@hooks/useLanguage";
// import LanguageSelector from "@components/LanguageSelector";

export default function MyTab(): JSX.Element {
  const {goWithdraw} = useContext(MyTabContext);
  const {logout, user, userDetails, fetchUserDetails} = useAuth();
  const [balance, setBalance] = useState({usdt: 0, dragon: 0});
  const [showSwap, setShowSwap] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  // History modals
  const [showDepositHistory, setShowDepositHistory] = useState(false);
  const [showWithdrawHistory, setShowWithdrawHistory] = useState(false);
  const [showSwapHistory, setShowSwapHistory] = useState(false);
  const [depositHistory, setDepositHistory] = useState<any[]>([]);
  const [withdrawHistory, setWithdrawHistory] = useState<any[]>([]);
  const [swapHistory, setSwapHistory] = useState<any[]>([
    { id: 's1', title: 'Swap Dragon → USDT', amount: -50, unit: 'Dragon', time: '11:56:23 2025/09/16' },
    { id: 's2', title: 'Commission', amount: +93.75, unit: 'Dragon', time: '11:20:35 2025/09/16' },
    { id: 's3', title: 'Swap Dragon → USDT', amount: -50, unit: 'Dragon', time: '12:02:58 2025/09/15' },
  ]);
  const [depLoading, setDepLoading] = useState(false);
  const [wdLoading, setWdLoading] = useState(false);
  const [depPage, setDepPage] = useState(1);
  const [wdPage, setWdPage] = useState(1);
  const [depTotalPages, setDepTotalPages] = useState(0);
  const [wdTotalPages, setWdTotalPages] = useState(0);

  // Open withdraw history directly from My tab
  const handleWithdrawClick = () => {
    setShowWithdrawHistory(true);
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
            <div className="avatar">🧸</div>
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
        <div className="notice">User*** successfully recharged 830USDT</div>
        <WalletCard>
          <div className="wallet">
            <div className="wallet-title">
              <span className="wallet-label">Wallet Balance:</span>
            </div>
            <div className="wallet-amounts">
              <span className="wallet-coin"><b>{balance.usdt}</b> USDT</span>
              <span className="wallet-coin"><b>{balance.dragon}</b> Dragon</span>
            </div>
          </div>
          <div className="quick">
            <button onClick={() => setShowDepositHistory(true)}>Deposit</button>
            <button onClick={handleWithdrawClick}>Withdraw</button>
            <button onClick={() => setShowSwap(true)}>SWAP</button>
            <button onClick={() => setShowSwapHistory(true)}>History</button>
          </div>
        </WalletCard>
      </div>
      <div className="list">
        <button className="item" onClick={() => setShowNotifications(true)}>Notifications</button>
        <button className="item">Online Support</button>
        <button className="item">DRAGON Community</button>
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
      {/* Swap history modal */}
      <ModalCustom open={showSwapHistory} onCancel={() => setShowSwapHistory(false)} footer={false} width="100%" style={{maxWidth: 520}} bodyStyle={{padding: 0, background: "#111"}}>
        {showSwapHistory && (
          <div style={{ padding: 16, color: "#fff" }}>
            <div style={{fontWeight: 800, fontSize: 18, marginBottom: 12}}>Swap History</div>
            {swapHistory.length === 0 ? (
              <div style={{textAlign:'center', padding:'20px', color:'#999'}}>
                <div style={{fontSize:'24px', marginBottom:'8px'}}>📊</div>
                <div>No swap history found</div>
              </div>
            ) : (
              swapHistory.map((it) => (
                <div key={it.id} style={{background:'#1a1a1a', borderRadius:12, padding:12, marginBottom:12}}>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}>
                    <span>{it.title}</span>
                    <span style={{color: it.amount >= 0 ? '#52c41a' : '#ff4d4f'}}>{it.amount >= 0 ? `+${it.amount}` : it.amount} {it.unit}</span>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between'}}>
                    <span>Time:</span><span>{it.time}</span>
                  </div>
                </div>
              ))
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
              <div style={{fontWeight: 600}}>Đăng ký tài khoản thành công</div>
              <div style={{opacity: 0.8, fontSize: 12, marginTop: 4}}>Just now</div>
            </div>
          </div>
        )}
      </ModalCustom>
      {/* <BottomSheet open={openLang} onClose={() => setOpenLang(false)}>
        <LanguageSelector onClose={() => setOpenLang(false)} />
      </BottomSheet> */}
    </div>
  );
}


