import React, {useState} from "react";
import {ShoppingOutlined} from "@ant-design/icons";
import {ModalCustom} from "@components/ModalCustom";
import BAMBuySheet from "./BAMBuySheet";

export default function BAMTab(): JSX.Element {
  const tiers = [
    {name: "BAM1", daily: "2.4 USDT", buy: "50USDT", total: "864 USDT"},
    {name: "BAM2", daily: "6 USDT", buy: "89USDT", total: "2160 USDT"},
    {name: "BAM3", daily: "20 USDT", buy: "228USDT", total: "7200 USDT"},
  ];
  const [openBuy, setOpenBuy] = useState<null | {plan: string; price: string}>(null);

  return (
    <div className="okbam-bam">
      <div className="vip-hero-wrap">
        <div className="vip-hero">
          <div className="vipwin-label">VIP WIN</div>
          <div className="hero-title">Chưa kích hoạt</div>
          <div className="hero-sub">Nâng cấp BAM1 để mở khóa lợi ích của nhóm</div>
          <div className="hero-sub">Nâng cấp lên VIP và nhận 50% thu nhập đội nhóm</div>
          <div className="hero-bear">🐻</div>
        </div>
      </div>

      <div className="vip-dark">
        <div className="vip-strip">tất cả VIP</div>
        <div className="vip-list">
          {tiers.map((t, idx) => (
            <div key={t.name} className={`vip-card vip-${idx + 1}`}>
              <div className="vip-left">
                <div className="vip-name">{t.name}</div>
                <div className="vip-meta">thu nhập hàng ngày {t.daily}</div>
                <div className="vip-meta">Thời gian cam kết 360 bầu trời</div>
                <div className="vip-meta">tổng doanh thu {t.total}</div>
                <div className="price-line">
                  <span>số tiền mua</span>
                  <b className="price">{t.buy}</b>
                </div>
              </div>
              <div className="vip-right">
                <div className="bear">🤖</div>
                <button className="buy" onClick={() => setOpenBuy({plan: t.name, price: t.buy})}><ShoppingOutlined /> Mua</button>
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


