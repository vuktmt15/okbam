import React, {useState} from "react";
import {ShoppingOutlined} from "@ant-design/icons";
import {ModalCustom} from "@components/ModalCustom";
import BAMBuySheet from "./BAMBuySheet";

export default function BAMTab(): JSX.Element {
  const tiers = [
    {name: "BAM1", daily: "2.4 USDT", buy: "50USDT", total: "864 USDT", img: "/img/pet1.png"},
    {name: "BAM2", daily: "6 USDT", buy: "89USDT", total: "2160 USDT", img: "/img/pet1.png"},
    {name: "BAM3", daily: "20 USDT", buy: "228USDT", total: "7200 USDT", img: "/img/pet1.png"},
  ];
  const [openBuy, setOpenBuy] = useState<null | {plan: string; price: string}>(null);

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
          {tiers.map((t, idx) => (
            <div key={t.name} className={`vip-card vip-${idx + 1}`}>
              <div className="vip-left">
                <div className="vip-name">{t.name}</div>
                <div className="vip-meta">Daily Income: {t.daily}</div>
                <div className="vip-meta">Commitment Period: 360 days</div>
                <div className="vip-meta">Total Revenue: {t.total}</div>
                <div className="price-line">
                  <span style={{whiteSpace: "nowrap"}}>Purchase Amount</span>
                  <b className="price">{t.buy}</b>
                </div>
              </div>
              <div className="vip-right">
                <div className="bear">
                  <img src={t.img} alt={t.name} onError={(e) => { (e.target as HTMLImageElement).src = "/img/avatar/avatar.jpg"; }} />
                </div>
                <button className="buy" onClick={() => setOpenBuy({plan: t.name, price: t.buy})}>Buy</button>
              </div>
            </div>
          ))}
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


