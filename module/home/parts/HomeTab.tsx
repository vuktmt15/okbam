import React, {useState} from "react";
import {
  AuditOutlined,
  BellOutlined,
  PlusOutlined,
  RightOutlined,
  SmileOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {Avatar} from "antd";
import {ModalCustom} from "@components/ModalCustom";
import BAMBuySheet from "./BAMBuySheet";

type Props = {
  onGoToBam: () => void;
};

export default function HomeTab({onGoToBam}: Props): JSX.Element {
  const tiers = [
    {name: "BAM1", daily: "2.4 USDT", buy: "50USDT", total: "864 USDT"},
    {name: "BAM2", daily: "6 USDT", buy: "89USDT", total: "2160 USDT"},
    {name: "BAM3", daily: "20 USDT", buy: "228USDT", total: "7200 USDT"},
  ];
  const [openBuy, setOpenBuy] = useState<null | {plan: string; price: string}>(null);
  return (
    <div className="okbam-home">
      <div className="okbam-header">
        <div className="left">
          <Avatar size={36} icon={<UserOutlined />} />
          <div className="info">
            <div className="name">BAM</div>
            <div className="sub">Quản lý tài sản Bear</div>
          </div>
        </div>
        <div className="actions">
          <button className="icon-btn" aria-label="bill">
            <AuditOutlined />
          </button>
          <button className="icon-btn" aria-label="bell">
            <BellOutlined />
          </button>
          <button className="icon-btn" aria-label="emoji">
            <SmileOutlined />
          </button>
        </div>
      </div>

      <div className="okbam-banner">
        <div className="title">BAM–Mời bạn bè BAM3</div>
        <div className="sub">Nhận 300USDT từ thu nhập hàng tháng của bạn bè (50%)</div>
      </div>

      <div className="okbam-ticker">
        <div className="ticker-inner">
          <span className="emoji">🔔</span>
          tháng 7 năm 2025, mang đến cho bạn nhiều lợi ích và cơ hội!
          <span className="spacer"> · </span>
          tháng 7 năm 2025, mang đến cho bạn nhiều lợi ích và cơ hội!
        </div>
      </div>

      <div className="okbam-actions">
        <button className="action">
          <ThunderboltOutlined />
          <span>nạp tiền</span>
        </button>
        <button className="action">
          <ThunderboltOutlined />
          <span>Đăng nhập</span>
        </button>
        <button className="action">
          <ThunderboltOutlined />
          <span>xổ số</span>
        </button>
        <button className="action" onClick={onGoToBam}>
          <ThunderboltOutlined />
          <span>Lời mời</span>
        </button>
      </div>

      <div className="okbam-cta">
        <div className="left">
          <div className="plane">✈️</div>
          <div className="text">
            Hoàn tất bài đăng, tham gia nhóm cộng đồng và bạn có thể nhận được
            1USDT
          </div>
        </div>
        <button className="cta-btn">Tham gia</button>
      </div>

      <div className="okbam-section">
        <div className="section-header">
          <div className="section-title">
            <span className="title-icon">🧸</span>
            <span>BAM VIP</span>
          </div>
          <button className="see-all" onClick={onGoToBam}>
            tất cả <RightOutlined />
          </button>
        </div>
        <div className="available-balance">
          <span className="label">số dư khả dụng</span>
          <span className="value">
            <b>31.6USDT</b>
            <span className="plus-circle">
              <PlusOutlined />
            </span>
          </span>
        </div>
        <div className="vip-list">
          {tiers.map((t) => (
            <div key={t.name} className="vip-card">
              <div className="vip-left">
                <div className="vip-name">{t.name}</div>
                <div className="vip-meta">thu nhập hàng ngày {t.daily}</div>
                <div className="vip-meta">Thời gian cam kết 360 bầu trời</div>
                <div className="vip-meta">tổng doanh thu {t.total}</div>
                <div className="vip-meta">số tiền mua {t.buy}</div>
              </div>
              <div className="vip-right">
                <button className="buy" onClick={() => setOpenBuy({plan: t.name, price: t.buy})}>Mua</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ModalCustom open={!!openBuy} onCancel={() => setOpenBuy(null)} footer={false} width="100%" style={{maxWidth: 520}} bodyStyle={{padding: 0, background: "#141414"}}>
        {openBuy && (
          <BAMBuySheet
            planName={openBuy.plan}
            price={openBuy.price}
            onClose={() => setOpenBuy(null)}
          />
        )}
      </ModalCustom>
    </div>
  );
}


