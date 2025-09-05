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
      } catch (e) {
        console.error('Fetch plan detail error', e);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchDetail();
    return () => { active = false; };
  }, [planId, planName, price]);

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
          <div className="row"><span className="label">Wallet Balance</span><span className="value">0.60 USDT</span></div>
        </div>
      )}

      <button className="upgrade" disabled={loading}>Confirm Upgrade</button>
      <button className="close" onClick={onClose}>Close</button>
    </div>
  );
}


