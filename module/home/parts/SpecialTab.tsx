import React from "react";
import {ModalCustom} from "@components/ModalCustom";
import BAMBuySheet from "./BAMBuySheet";

export default function SpecialTab(): JSX.Element {
  const [pkg, setPkg] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [openBuy, setOpenBuy] = React.useState(false);
  const [now, setNow] = React.useState<number>(Date.now());
  const [showHistory, setShowHistory] = React.useState(false);

  React.useEffect(() => {
    const fetchSpecial = async () => {
      try {
        const response = await fetch(`/api/product/?t=${Date.now()}`);
        const data = await response.json();
        if (data?.statusCode === 'OK' && Array.isArray(data.body)) {
          const special = data.body.find((p: any) => ((p?.id ?? p?.bamId ?? p?.planId) === 1)) || null;
          setPkg(special);
        }
      } catch (e) {
        console.error('Error fetching special package:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecial();
  }, []);

  // simple 1s ticker for countdown display
  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // countdown helpers
  const CHECK_KEY = (id:number) => `special_next_check_${id}`;
  const getNextCheck = (id:number) => {
    const v = localStorage.getItem(CHECK_KEY(id));
    return v ? parseInt(v, 10) : 0;
  };
  const setNextCheck = (id:number, ts:number) => {
    localStorage.setItem(CHECK_KEY(id), String(ts));
  };
  const ensureScheduled = (id:number) => {
    const ts = getNextCheck(id);
    if (!ts) setNextCheck(id, Date.now() + 24*60*60*1000);
  };
  const msToHHMMSS = (ms:number) => {
    const s = Math.max(0, Math.floor(ms/1000));
    const hh = String(Math.floor(s/3600)).padStart(2,'0');
    const mm = String(Math.floor((s%3600)/60)).padStart(2,'0');
    const ss = String(s%60).padStart(2,'0');
    return `${hh}:${mm}:${ss}`;
  };
  const canClaim = (id:number) => now >= getNextCheck(id);
  const remaining = (id:number) => Math.max(0, getNextCheck(id) - now);

  const handleClaim = async () => {
    if (!pkg) return;
    try {
      const userStr = localStorage.getItem('userDetails') || localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const referrerId = user?.referrerId || user?.refererCode || user?.id;
      if (!referrerId) return alert('Missing user id');
      const url = `/api/investment-history/check-daily-bam?referrerId=${encodeURIComponent(referrerId)}&bamId=${pkg.id ?? 1}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Claim failed');
      setNextCheck(pkg.id ?? 1, Date.now() + 24*60*60*1000);
      alert('Claimed successfully!');
    } catch (e) {
      console.error(e);
      alert('Network error, please try again.');
    }
  };

  return (
    <div className="okbam-special">
      {loading ? (
        <div className="loading">Loading special package...</div>
      ) : !pkg ? (
        <div className="special-not-purchased">
          <div className="not-purchased-content">
            <div className="not-purchased-icon">⭐️</div>
            <div className="not-purchased-title">You haven't registered the special package yet</div>
            <div className="not-purchased-message">Go to Home to join the Special package and unlock exclusive rewards.</div>
            <button className="not-purchased-btn" onClick={() => {
              const ev = new CustomEvent('navigateToTab', { detail: 'home' });
              window.dispatchEvent(ev);
            }}>Go to Home</button>
          </div>
        </div>
      ) : (
        <>
          <div className="special-header">
            <div className="title-left">DRAGON</div>
            <button className="history-btn" onClick={() => setShowHistory(true)}>History →</button>
          </div>

          <div className="special-info">
            <div className="cell name">
              <div className="value name-row">
                <span className="text">{pkg.title}</span>
                <img src="/img/dragon/special-dragon-home.png" alt="" className="name-icon" />
              </div>
            </div>
            <div className="cell earn">
              <div className="label">Dragon Earned</div>
              <div className="value">{pkg.amount}</div>
            </div>
            <div className="cell cost">
              <div className="label">Cost</div>
              <div className="value">{pkg.purchaseAmount}</div>
            </div>
            <div className="cell speed">
              <div className="label">Mining Speed</div>
              <div className="value">{pkg.dailyIncome}</div>
            </div>
            <div className="cell cycle">
              <div className="label">Cycle</div>
              <div className="value">{pkg.period} days</div>
            </div>
          </div>

          <div className="special-dragon">
            <img src={pkg.urlDetail || pkg.imageUrl || '/img/dragon/special-dragon-detail.png'} alt={pkg.title} onError={(e) => { (e.target as HTMLImageElement).src = "/img/dragon/special-dragon-detail.png"; }} />
          </div>

          <div className="dragon-welcome">
            <div className="welcome-line">Welcome to join and accompany <b>Dragon</b></div>
            <div className="welcome-note">Note: After each 24h, click to start again</div>
          </div>

          <div className={`status-combined ${canClaim(pkg.id ?? 1) ? 'ready' : ''}`}>
            <div className="top">
              <div className="label">Current status:</div>
              <div className="time">{msToHHMMSS(remaining(pkg.id ?? 1))}</div>
            </div>
            <button 
              className="claim-inline" 
              disabled={!canClaim(pkg.id ?? 1)} 
              onClick={canClaim(pkg.id ?? 1) ? handleClaim : undefined}
            >
              Claim
            </button>
          </div>
        </>
      )}

      <ModalCustom open={openBuy} onCancel={() => setOpenBuy(false)} footer={false} width="100%" style={{maxWidth: 520}} bodyStyle={{padding: 0, background: "#141414"}}>
        {openBuy && pkg && (
          <BAMBuySheet planId={pkg.id ?? 11} planName={pkg.title} price={`$${pkg.purchaseAmount}`} onClose={() => setOpenBuy(false)} />
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


