import React, {useContext} from "react";
import {BellOutlined, GlobalOutlined, SettingOutlined} from "@ant-design/icons";
import {MyTabContext} from "./context";

export default function MyTab(): JSX.Element {
  const {goWithdraw} = useContext(MyTabContext);
  return (
    <div className="okbam-my">
      <div className="profile">
        <div className="row top">
          <div className="left">
            <div className="avatar">🧸</div>
            <div className="info">
              <div className="email">Hoa****@gmail.com</div>
              <div className="id">ID: 8621559</div>
            </div>
          </div>
          <div className="icons">
            <GlobalOutlined />
            <BellOutlined />
            <SettingOutlined />
          </div>
        </div>
        <div className="notice">User*** successfully recharged 830USDT</div>
        <div className="wallet">
          <div className="asset"><b>6</b>USDT</div>
          <div className="asset"><b>0</b>TRX</div>
        </div>
        <div className="quick">
          <button>nạp tiền</button>
          <button onClick={goWithdraw}>Rút tiền mặt</button>
          <button>SWAP</button>
          <button>Lịch sử</button>
        </div>
      </div>
      <div className="list">
        <button className="item">Support trực tuyến</button>
        <button className="item">Cộng đồng DRAGON</button>
      </div>
      <div className="cta">
        <button className="primary">Chuyển đổi/tạo tài khoản mới</button>
        <button className="ghost">lối thoát an toàn</button>
      </div>
    </div>
  );
}


