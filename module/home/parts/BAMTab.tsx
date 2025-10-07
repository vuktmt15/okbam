import React, {useState} from "react";
import {ShoppingOutlined} from "@ant-design/icons";
import {ModalCustom} from "@components/ModalCustom";
import BAMBuySheet from "./BAMBuySheet";

export default function BAMTab(): JSX.Element {
  const [regularInvestment, setRegularInvestment] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [openBuy, setOpenBuy] = useState<null | {plan: string; price: string; id: number}>(null);
  const [now, setNow] = useState<number>(Date.now());
  const [showHistory, setShowHistory] = React.useState(false);
  const [historyData, setHistoryData] = React.useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = React.useState(false);
  const [historyPage, setHistoryPage] = React.useState(1);
  const [historyTotalPages, setHistoryTotalPages] = React.useState(1);

  // Fetch regular investment data from API
  React.useEffect(() => {
    const fetchRegularInvestment = async () => {
      try {
        const userDetails = typeof window !== 'undefined' ? localStorage.getItem('user_details') : null;
        if (userDetails) {
          const parsed = JSON.parse(userDetails);
          const referrerId = parsed?.referrerId || parsed?.refererCode;
          
          if (referrerId) {
            const response = await fetch(`/api/investment-packages/get-investment-regular?referrerId=${referrerId}`);
            const data = await response.json();
            
            if (data?.statusCode === 'OK' && data.body) {
              setRegularInvestment(data.body);
            } else {
              setRegularInvestment(null);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching regular investment:', error);
        setRegularInvestment(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRegularInvestment();

    // Poll for updates every 2 seconds
    const interval = setInterval(() => {
      fetchRegularInvestment();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // ticker for countdown
  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // countdown helpers per package
  const CHECK_KEY = (id:number) => `bam_next_check_${id}`;
  const getNextCheck = (id:number) => {
    const v = localStorage.getItem(CHECK_KEY(id));
    return v ? parseInt(v, 10) : 0;
  };
  const setNextCheck = (id:number, ts:number) => localStorage.setItem(CHECK_KEY(id), String(ts));
  const ensureScheduled = (id:number) => { if (!getNextCheck(id)) setNextCheck(id, Date.now() + 24*60*60*1000); };
  const msToHHMMSS = (ms:number) => {
    const s = Math.max(0, Math.floor(ms/1000));
    const hh = String(Math.floor(s/3600)).padStart(2,'0');
    const mm = String(Math.floor((s%3600)/60)).padStart(2,'0');
    const ss = String(s%60).padStart(2,'0');
    return `${hh}:${mm}:${ss}`;
  };
  const canClaim = (id:number) => now >= getNextCheck(id);
  const remaining = (id:number) => Math.max(0, getNextCheck(id) - now);
  const handleClaim = async (id:number) => {
    try {
      const userStr = localStorage.getItem('user_details') || localStorage.getItem('userDetails') || localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const referrerId = user?.referrerId || user?.refererCode || user?.id || user?.userId || user?.user?.id;
      if (!referrerId) return alert('Missing user id');
      
      const url = `/api/investment-history/check-daily-bam?referrerId=${encodeURIComponent(referrerId)}&isSpecial=0`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Claim failed');
      
      const data = await res.json();
      if (data?.statusCode === 'OK' && data.body) {
        const investedAtStr = data.body.investedAt || data.body.dateCheck || data.body.createdAt;
        if (!investedAtStr) throw new Error('Missing invested time');
        const investedAt = new Date(investedAtStr).getTime();
        setNextCheck(id, investedAt + 24*60*60*1000);
        alert('Claimed successfully!');
      } else {
        throw new Error('Invalid response');
      }
    } catch (e) {
      console.error(e);
      alert('Network error, please try again.');
    }
  };

  // Fetch claim history for DRAGON packages (isSpecial=0)
  const fetchClaimHistory = async (page: number = 1) => {
    setHistoryLoading(true);
    try {
      const userLocal = typeof window !== 'undefined' ? localStorage.getItem('user_details') : null;
      const parsed = userLocal ? JSON.parse(userLocal) : null;
      const referrerId = parsed?.referrerId || parsed?.refererCode;
      if (!referrerId) return;

      const res = await fetch(`/api/history-balance-claim?ref=${referrerId}&isSpecial=0`);
      const data = await res.json();
      
      if (data?.body && Array.isArray(data.body)) {
        let items = data.body;
        
        // Sort by date descending
        items.sort((a: any, b: any) => {
          const dateA = new Date(a.investedAt);
          const dateB = new Date(b.investedAt);
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
      } else {
        setHistoryData([]);
        setHistoryPage(1);
        setHistoryTotalPages(1);
      }
    } catch (e) {
      console.error('Fetch claim history error', e);
      setHistoryData([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Ensure countdown is scheduled for regular investment
  React.useEffect(() => {
    if (regularInvestment?.bamId) {
      ensureScheduled(regularInvestment.bamId);
    }
  }, [regularInvestment]);

  // Auto-load history when modal opens
  React.useEffect(() => {
    if (showHistory) fetchClaimHistory(1);
  }, [showHistory]);

  return (
    <div className="okbam-bam">
      <div className="vip-dark">
        <div className="special-header">
          <div className="title-left">DRAGON</div>
          <button className="history-btn" onClick={() => setShowHistory(true)}>History →</button>
        </div>
        <div className="vip-list special-like">
          {loading ? (
            <div className="loading">Loading investment data...</div>
          ) : !regularInvestment ? (
            <div className="special-not-purchased">
              <div className="not-purchased-content">
                <div className="not-purchased-title">You haven't registered any DRAGON package yet</div>
                <div className="not-purchased-message">
                  Go to Home to join the DRAGON packages and start earning rewards.
                </div>
                <button className="not-purchased-btn" onClick={() => {
                  const ev = new CustomEvent('navigateToTab', { detail: 'home' });
                  window.dispatchEvent(ev);
                }}>Go to Home</button>
              </div>
            </div>
          ) : (
            <div className="dragon-card dragon-0">
              <div className="special-info">
                <div className="cell name">
                  <div className="value name-row">
                    <span className="text">{regularInvestment.name}</span>
                    <img src="/img/dragon/normal-dragon-home.png" alt="" className="name-icon" />
                  </div>
                </div>
                <div className="cell earn">
                  <div className="label">Dragon Earned</div>
                  <div className="value">{regularInvestment.amount}</div>
                </div>
                <div className="cell cost">
                  <div className="label">Cost</div>
                  <div className="value">${regularInvestment.amount}</div>
                </div>
                <div className="cell speed">
                  <div className="label">Mining Speed</div>
                  <div className="value">{regularInvestment.speed} dragon/h</div>
                </div>
                <div className="cell cycle">
                  <div className="label">Cycle</div>
                  <div className="value">{regularInvestment.durationDays} days</div>
                </div>
              </div>

              <div className="special-dragon">
                <img src="/img/dragon/normal-dragon-detail.png" alt={regularInvestment.name} onError={(e) => { (e.target as HTMLImageElement).src = "/img/dragon/normal-dragon-detail.png"; }} />
              </div>

              <div className="dragon-welcome">
                <div className="welcome-line">Welcome to join and accompany <b>Dragon</b></div>
                <div className="welcome-note">Note: After each 24h, click to start again</div>
              </div>

              <div className={`status-combined ${canClaim(regularInvestment.bamId) ? 'ready' : ''}`}>
                <div className="top">
                  <div className="label">Current status:</div>
                  <div className="time">{msToHHMMSS(remaining(regularInvestment.bamId))}</div>
                </div>
                <button 
                  className="claim-inline"
                  disabled={!canClaim(regularInvestment.bamId)}
                  onClick={canClaim(regularInvestment.bamId) ? () => handleClaim(regularInvestment.bamId) : undefined}
                >
                  Claim
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <ModalCustom open={!!openBuy} onCancel={() => setOpenBuy(null)} footer={false} width="100%" style={{maxWidth: 520}} bodyStyle={{padding: 0, background: "#141414"}}>
        {openBuy && (
          <BAMBuySheet planId={openBuy.id} planName={openBuy.plan} price={openBuy.price} showBonusNote={false} onClose={() => setOpenBuy(null)} />
        )}
      </ModalCustom>

      <ModalCustom open={showHistory} onCancel={() => setShowHistory(false)} footer={false} width="100%" style={{maxWidth: 520}} bodyStyle={{padding: 0, background: "#111"}}>
        {showHistory && (
          <div style={{ padding: 16, color: "#fff" }}>
            <div style={{fontWeight: 800, fontSize: 18, marginBottom: 12}}>Claim History</div>
            
            {historyLoading ? (
              <div style={{textAlign:'center', padding:'20px', color:'#999'}}>Loading history...</div>
            ) : historyData.length === 0 ? (
              <div style={{textAlign:'center', padding:'20px', color:'#999'}}>
                <div style={{fontSize:'24px', marginBottom:'8px'}}>📊</div>
                <div>No claim history found</div>
              </div>
            ) : (
              historyData.map((item: any) => (
                <div key={item.id} style={{background:'#1a1a1a', borderRadius:12, padding:12, marginBottom:12}}>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}>
                    <span>DRAGON Package Claim</span>
                    <span style={{color:'#52c41a'}}>+{item.amount} USDT</span>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between'}}>
                    <span>Time:</span>
                    <span>{new Date(item.investedAt).toLocaleString('en-US', {
                      hour:'2-digit', 
                      minute:'2-digit', 
                      second:'2-digit', 
                      year:'numeric', 
                      month:'2-digit', 
                      day:'2-digit'
                    })}</span>
                  </div>
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
                    onClick={() => fetchClaimHistory(p)}
                  >
                    {p}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </ModalCustom>
    </div>
  );
}

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


