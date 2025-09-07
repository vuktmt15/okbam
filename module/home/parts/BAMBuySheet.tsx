import React from "react";

type Props = {
  planId?: number;
  planName: string;
  price: string; // e.g. "50USDT"
  onClose: () => void;
};

export default function BAMBuySheet({planId, planName, price, onClose}: Props): JSX.Element {
  const [detail, setDetail] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>('');
  const [balance, setBalance] = React.useState({usdt: 0, dragon: 0});

  React.useEffect(() => {
    let active = true;
    const fetchDetail = async () => {
      try {
        if (planId) {
          const res = await fetch(`/api/product/detail-bam?id=${planId}`);
          const data = await res.json();
          if (active && data?.statusCode === 'OK') setDetail(data.body);
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
              if (balanceData.statusCode === 'OK' && balanceData.body?.balance) {
                setBalance({
                  usdt: balanceData.body.balance.usdt || 0,
                  dragon: balanceData.body.balance.dragon || 0
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

  const handleConfirmUpgrade = async () => {
    if (!detail || isSubmitting) return;
    
    // Check if balance is sufficient
    const purchaseAmount = Number(detail.purchaseAmount);
    if (balance.usdt < purchaseAmount) {
      setMessage(`Insufficient balance. You have ${balance.usdt} USDT but need ${purchaseAmount} USDT.`);
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
          bamId: String(planId)
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.statusCode === 'CREATED') {
        setMessage('Successfully registered BAM package!');
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setMessage(data.message || 'Registration failed. Please try again.');
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
      <div className="sheet-title">Upgrade Confirmation</div>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="detail-list">
          <div className="row"><span className="label">Level</span><span className="value">{detail?.title || planName}</span></div>
          <div className="row"><span className="label">Daily Income</span><span className="value">{detail?.dailyIncome} USDT</span></div>
          <div className="row"><span className="label">Total Profit</span><span className="value">240%</span></div>
          <div className="row"><span className="label">Total Revenue</span><span className="value">{detail?.amount} USDT</span></div>
          <div className="row"><span className="label">Period</span><span className="value">{detail?.period} days</span></div>
          <div className="row"><span className="label">Food Cost</span><span className="value">{Number(detail?.purchaseAmount) * 1.25} USDT</span></div>
          <div className="row"><span className="label">Purchase Amount</span><span className="value green">{detail?.purchaseAmount} USDT</span></div>
          <div className="row"><span className="label">Wallet Balance</span><span className="value">{balance.usdt} USDT</span></div>
        </div>
      )}

      <button className="upgrade" disabled={loading || isSubmitting} onClick={handleConfirmUpgrade}>
        {isSubmitting ? 'Processing...' : 'Confirm Upgrade'}
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


