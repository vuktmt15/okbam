import React, {useState} from "react";
import {ShoppingOutlined} from "@ant-design/icons";
import {ModalCustom} from "@components/ModalCustom";
import BAMBuySheet from "./BAMBuySheet";

export default function BAMTab(): JSX.Element {
  const [bamPackages, setBamPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openBuy, setOpenBuy] = useState<null | {plan: string; price: string}>(null);

  // Fetch BAM packages from API
  React.useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/product/');
        const data = await response.json();
        if (data.statusCode === 'OK' && data.body) {
          setBamPackages(data.body);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchPackages, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="okbam-bam">
      <div className="vip-hero-wrap">
        <div className="vip-hero">
          <div className="vipwin-label">VIP WIN</div>
          <div className="hero-title">Not Activated</div>
          <div className="hero-sub">Upgrade to BAM1 to unlock group benefits</div>
          <div className="hero-sub">Upgrade to VIP and receive 50% team income</div>
          <div className="hero-bear">
            <img src="/img/pet1.png" alt="bear" />
          </div>
        </div>
      </div>

      <div className="vip-dark">
        <div className="vip-strip">All VIP</div>
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
                  <div className="bear">
                    <img src={pkg.imageUrl} alt={pkg.title} onError={(e) => { (e.target as HTMLImageElement).src = "/img/avatar/avatar.jpg"; }} />
                  </div>
                  {pkg.status === 1 ? (
                    <button className="buy" onClick={() => setOpenBuy({plan: pkg.title, price: `$${pkg.purchaseAmount}`})}>Buy</button>
                  ) : (
                    <div className="locked">
                      <span className="lock-icon">🔒</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <ModalCustom open={!!openBuy} onCancel={() => setOpenBuy(null)} footer={false} width="100%" style={{maxWidth: 520}} bodyStyle={{padding: 0, background: "#141414"}}>
        {openBuy && (
          <BAMBuySheet planName={openBuy.plan} price={openBuy.price} onClose={() => setOpenBuy(null)} />
        )}
      </ModalCustom>
    </div>
  );
}


