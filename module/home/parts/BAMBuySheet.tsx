import React from "react";

type Props = {
  planId?: number;
  planName: string;
  price: string; // e.g. "50USDT"
  onClose: () => void;
  showBonusNote?: boolean;
};

export default function BAMBuySheet({planId, planName, price, onClose, showBonusNote}: Props): JSX.Element {
  const [detail, setDetail] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>('');
  const [balance, setBalance] = React.useState({usdt: 0, dragon: 0});
  const [quantity, setQuantity] = React.useState<number>(1);
  const [isFirstBy, setIsFirstBy] = React.useState<boolean | null>(null);

  // Initialize quantity for special package (ID 1)
  React.useEffect(() => {
    if (planId === 1) {
      setQuantity(1);
    }
  }, [planId]);

  React.useEffect(() => {
    let active = true;
    const fetchDetail = async () => {
      try {
        if (planId) {
          // read refId from localStorage to forward to detail API
          let refId: string | undefined = undefined;
          try {
            const userDetails = typeof window !== 'undefined' ? (localStorage.getItem('user_details') || localStorage.getItem('userDetails') || localStorage.getItem('user')) : null;
            if (userDetails) {
              const parsed = JSON.parse(userDetails);
              refId = parsed?.referrerId || parsed?.refererCode || parsed?.id || parsed?.userId || parsed?.user?.id;
            }
          } catch {}
          const qs = refId ? `id=${planId}&refId=${encodeURIComponent(refId)}` : `id=${planId}`;
          const res = await fetch(`/api/product/detail-bam?${qs}`);
          const data = await res.json();
          if (active && data?.statusCode === 'OK') {
            setDetail(data.body);
            // pick isFirstBy from response body if present
            if (typeof data.body?.isFirstBy === 'boolean') {
              setIsFirstBy(data.body.isFirstBy);
              // For special package: if not first-by (false), lock quantity at 1
              if (planId === 1) {
                setQuantity(1);
              }
            } else {
              setIsFirstBy(null);
            }
          }
        } else {
          // fallback: derive from name/price if id not provided
          setDetail({ title: planName, purchaseAmount: price.replace(/[^0-9.]/g, ''), dailyIncome: '-', period: '360', amount: '-' });
        }

        // Fetch balance
        const userDetails = typeof window !== 'undefined' ? localStorage.getItem('user_details') : null;
        if (userDetails) {
          const parsed = JSON.parse(userDetails);
          const referrerId = parsed?.referrerId || parsed?.refererCode;
          
          if (referrerId) {
            try {
              const balanceResponse = await fetch(`/api/getBalance?referrerId=${referrerId}`);
              const balanceData = await balanceResponse.json();
              if (balanceData?.balance?.usdt !== undefined && balanceData?.balance?.dragon !== undefined) {
                setBalance({
                  usdt: balanceData.balance.usdt,
                  dragon: balanceData.balance.dragon
                });
              }
            } catch (e) {
              console.error('Error fetching balance:', e);
            }
          }
        }
      } catch (e) {
        console.error('Fetch plan detail error', e);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchDetail();
    return () => { active = false; };
  }, [planId, planName, price]);

  // Reset transient UI state when switching plan/modal
  React.useEffect(() => {
    setMessage('');
    setIsSubmitting(false);
  }, [planId, planName, price]);

  const handleConfirmUpgrade = async () => {
    if (!detail || isSubmitting) return;
    
    // Check if balance is sufficient - use Min (amount) * quantity
    const minAmount = Number(detail.amount) || 0;
    const specialQty = planId === 1 ? ((isFirstBy ? quantity : 1)) : quantity;
    const requiredAmount = minAmount * specialQty;
    if (balance.usdt < requiredAmount) {
      setMessage(`Insufficient balance. You have ${balance.usdt} USDT but need ${requiredAmount} USDT.`);
      return;
    }
    
    setIsSubmitting(true);
    setMessage('');
    
    try {
      // Get referrerId from localStorage
      const userDetails = typeof window !== 'undefined' ? localStorage.getItem('user_details') : null;
      if (!userDetails) {
        setMessage('User not found. Please login again.');
        return;
      }
      
      const parsed = JSON.parse(userDetails);
      const referrerId = parsed?.referrerId || parsed?.refererCode;
      
      if (!referrerId) {
        setMessage('Referrer ID not found.');
        return;
      }

      const response = await fetch('/api/investment-packages/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referrerId: referrerId,
          bamId: String(planId),
          quantities: String(specialQty),
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.statusCode === 'CREATED') {
        setMessage('Successfully registered DRAGON package!');
        // schedule first daily check in 24h for this bamId
        try {
          const key = `bam_next_check_${String(planId)}`;
          if (typeof window !== 'undefined') {
            localStorage.setItem(key, String(Date.now() + 24 * 60 * 60 * 1000));
          }
        } catch {}
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        let errMsg: string = data?.message || '';
        if (typeof errMsg === 'string') {
          // Normalize known Vietnamese messages to English
          const vnAlreadyRegex = /(bam\s*(da|đã)\s*(dc|được)\s*(dang\s*ky|đăng\s*ký))/i;
          if (vnAlreadyRegex.test(errMsg)) {
            errMsg = 'You have already registered this DRAGON package.';
          }
        }
        setMessage(errMsg || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bambuy-sheet">
      <div className="sheet-title name-row">
        <span className="text">{detail?.title || planName}</span>
        <img
          src={(planId === 1) ? "/img/dragon/special-dragon-home.png" : "/img/dragon/normal-dragon-home.png"}
          alt=""
          className="name-icon"
        />
      </div>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="detail-list">
            <div className="row"><span className="label">Min:</span><span className="value">${((Number(detail?.amount) || 0) * (planId === 1 ? 1 : quantity)).toFixed(2)}</span></div>
            <div className="row"><span className="label">24h Profit:</span><span className="value">{((Number(detail?.dailyIncome) || 0) * (planId === 1 ? 1 : quantity)).toFixed(2)} dragon</span></div>
            <div className="row"><span className="label">Cycle:</span><span className="value">{detail?.period} days</span></div>
            <div className="row"><span className="label">Mining Speed:</span><span className="value">{(((Number(detail?.dailyIncome) || 0) * (planId === 1 ? 1 : quantity)) / 24).toFixed(2)} dragon/h</span></div>
            <div className="row quantity-row">
              <span className="label">Quantity:</span>
              <span className="value">
                {planId === 1 ? (
                  (isFirstBy === false) ? (
                    <span className="qty-num">1 (Special package)</span>
                  ) : (
                    <>
                      <button className="qty-btn" onClick={() => setQuantity(Math.max(0, quantity - 1))}>-</button>
                      <span className="qty-num">{quantity}</span>
                      <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
                    </>
                  )
                ) : (
                  <>
                    <button className="qty-btn" onClick={() => setQuantity(Math.max(0, quantity - 1))}>-</button>
                    <span className="qty-num">{quantity}</span>
                    <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
                  </>
                )}
              </span>
            </div>
            <div className="row"><span className="label">Total Profit:</span><span className="value">{((Number(detail?.purchaseAmount) || 0) * (planId === 1 ? 1 : quantity)).toFixed(2)} dragon</span></div>
          </div>

          <div className="nft-illustration">
            <img src="/img/nft.png" alt="NFT" />
          </div>
           
          {planId === 1 && (
            <div className="bonus-note" style={{textAlign: 'center'}}>
              <div className="line-1">Bonus & special offers for new accounts and members.</div>
              <div className="line-2">Join now to receive bonus and enjoy daily profit for {detail?.period} days.</div>
            </div>
          )}         
        </>
      )}

      <button className="upgrade" disabled={loading || isSubmitting || quantity === 0} onClick={handleConfirmUpgrade}>
        {isSubmitting ? 'Processing...' : 'Confirm Purchase'}
      </button>
      {message && (
        <div className={`message ${message.includes('Successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
      <button className="close" onClick={onClose}>Close</button>
    </div>
  );
}


