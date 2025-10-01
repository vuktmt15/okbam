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

  // Fetch regular investment data from API
  React.useEffect(() => {
    const fetchRegularInvestment = async () => {
      try {
        const userDetails = typeof window !== 'undefined' ? localStorage.getItem('user_details') : null;
        if (userDetails) {
          const parsed = JSON.parse(userDetails);
          const referrerId = parsed?.referrerId || parsed?.refererCode;
          
          if (referrerId) {
            const response = await fetch(`http://159.223.91.231:8866/api/investment-packages/get-investment-regular?referrerId=${referrerId}`);
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
      
      const url = `http://159.223.91.231:8866/api/investment-history/check-daily-bam?referrerId=${encodeURIComponent(referrerId)}&isSpecial=0`;
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

  // Ensure countdown is scheduled for regular investment
  React.useEffect(() => {
    if (regularInvestment?.bamId) {
      ensureScheduled(regularInvestment.bamId);
    }
  }, [regularInvestment]);

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
            <div className="no-packages">
              <div className="no-packages-content">
                <div className="no-packages-icon">📦</div>
                <div className="no-packages-title">No regular investment</div>
                <div className="no-packages-message">
                  You haven't purchased any DRAGON packages yet. Go to Home to buy some!
                </div>
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
                  <div className="value">${regularInvestment.minAmount}</div>
                </div>
                <div className="cell speed">
                  <div className="label">Mining Speed</div>
                  <div className="value">${regularInvestment.interestRate}/h</div>
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
            <div style={{fontWeight: 800, fontSize: 18, marginBottom: 12}}>History</div>
            {[{
              time: '15:33:43 2025/09/17', amount: +3550, unit: 'Dragon'
            },{
              time: '15:32:55 2025/09/16', amount: -3555, unit: 's'
            },{
              time: '10:27:11 2025/09/15', amount: +50, unit: 'Dragon'
            },{
              time: '09:15:33 2025/09/14', amount: +50, unit: 'Dragon'
            },{
              time: '09:12:42 2025/09/13', amount: -8, unit: 's'
            }].map((it, idx) => (
              <div key={idx} style={{background:'#1a1a1a', borderRadius:12, padding:12, marginBottom:12}}>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <span>Time:</span>
                  <span>{it.time}</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', marginTop:6}}>
                  <span />
                  <span style={{color: it.amount >= 0 ? '#52c41a' : '#ff4d4f'}}>{it.amount >= 0 ? `+${it.amount}` : it.amount} {it.unit}</span>
                </div>
              </div>
            ))}
            <div style={{display:'flex', justifyContent:'center', gap:16, marginTop:16}}>
              <span style={{background:'#555', borderRadius:14, padding:'4px 10px'}}>1</span>
              <span>2</span>
              <span>3</span>
            </div>
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


