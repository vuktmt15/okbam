import React from "react";

type Props = {
  planName: string;
  price: string; // e.g. "50USDT"
  onClose: () => void;
};

export default function BAMBuySheet({planName, price, onClose}: Props): JSX.Element {
  return (
    <div className="bambuy-sheet">
      <div className="sheet-title">Thu nhập của tôi</div>
      <div className="income-box">
        <div className="col">
          <div className="label">thu nhập hàng ngày</div>
          <div className="value">{planName === "BAM1" ? "2.4USDT" : planName === "BAM2" ? "6USDT" : "20USDT"}</div>
        </div>
        <div className="col">
          <div className="label">số tiền mua</div>
          <div className="value">{price}</div>
        </div>
        <button className="upgrade">
          Chỉ {price} để nâng cấp lên {planName}
        </button>
      </div>

      <div className="invite-box">
        <div className="title">Lời mời BAM33</div>
        <div className="sub">Hoa hồng hàng tháng <b>(50%)</b> <span className="green">300USDT</span></div>
        <button className="primary">Lời mời</button>
      </div>

      <button className="close" onClick={onClose}>Đóng</button>
    </div>
  );
}


