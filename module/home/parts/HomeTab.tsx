import React, {useContext, useState} from "react";
import {
  AuditOutlined,
  BellOutlined,
  PlusOutlined,
  RightOutlined,
  SmileOutlined,
  UserOutlined,
  WalletOutlined,
  CalendarOutlined,
  DollarCircleOutlined,
  TeamOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import {Avatar} from "antd";
import {ModalCustom} from "@components/ModalCustom";
import BAMBuySheet from "./BAMBuySheet";
import {MyTabContext} from "./context";

type Props = {
  onGoToBam: () => void;
};

export default function HomeTab({onGoToBam}: Props): JSX.Element {
  const {goWithdraw} = useContext(MyTabContext);
  const tiers = [
    {name: "BAM1", daily: "2.4 USDT", buy: "50USDT", total: "864 USDT", img: "/img/pet1.png"},
    {name: "BAM2", daily: "6 USDT", buy: "89USDT", total: "2160 USDT", img: "/img/pet1.png"},
    {name: "BAM3", daily: "20 USDT", buy: "228USDT", total: "7200 USDT", img: "/img/pet1.png"},
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
        <div className="title">
          BAM–Mời bạn bè
          <br />
          BAM3
        </div>
        <div className="sub">Nhận 300USDT từ thu nhập hàng tháng của bạn bè (50%)</div>
        <div className="banner-bear">
          <img src="/img/pet1.png" alt="bear" />
        </div>
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
          <WalletOutlined />
          <span>nạp tiền</span>
        </button>
        <button className="action" onClick={goWithdraw}>
          <DollarCircleOutlined />
          <span>rút tiền</span>
        </button>
        <button className="action">
          <CalendarOutlined />
          <span>Đăng nhập</span>
        </button>
        <button className="action" onClick={onGoToBam}>
          <TeamOutlined />
          <span>Lời mời</span>
        </button>
      </div>

      <div className="okbam-cta">
        <div className="left">
          <div className="text">
            <div className="headline">
              Chương trình đặc biệt dành cho
              <br className="br-md" />
              tài khoản và thành viên mới.
            </div>
            <div className="row"><span className="label">Sản phẩm hàng đầu:</span> <b>Dragon</b></div>
            <div className="row"><span className="label">Min:</span> 35$ <span>·</span> <span className="label">3.25$/ngày</span></div>
            <div className="row"><span className="label">Chu kỳ:</span> 20 ngày</div>
          </div>
        </div>
        <div className="right">
          <img src="/img/pet1.png" alt="bear" />
        </div>
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
          {tiers.map((t, idx) => (
            <div key={t.name} className={`vip-card vip-${idx + 1}`}>
              <div className="vip-left">
                <div className="vip-name">{t.name}</div>
                <div className="vip-meta">thu nhập hàng ngày: {t.daily}</div>
                <div className="vip-meta">Thời gian cam kết: 360 bầu trời</div>
                <div className="vip-meta">tổng doanh thu: {t.total}</div>
                <div className="price-line">
                  <span>số tiền mua</span>
                  <b className="price">{t.buy}</b>
                </div>
              </div>
              <div className="vip-right">
                <img src="/img/pet1.png" alt="bear" className="bear-img" />
                <button className="buy" onClick={() => setOpenBuy({plan: t.name, price: t.buy})}>
                  Mua
                </button>
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


