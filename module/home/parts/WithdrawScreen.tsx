import React, {useMemo, useState} from "react";
import {
  ArrowLeftOutlined,
  DownOutlined,
  CopyOutlined,
  CheckCircleTwoTone,
} from "@ant-design/icons";

type NetworkKey = "BEP20" | "TRC20";

type Props = {
  balanceUsdt?: number;
  onBack: () => void;
};

const NETWORKS: Record<NetworkKey, {label: string; min: number; fee: number}> = {
  BEP20: {label: "BNB Smart Chain (BEP20)", min: 2, fee: 1},
  TRC20: {label: "Tron (TRC20)", min: 6, fee: 1.6},
};

export default function WithdrawScreen({
  balanceUsdt = 31.6,
  onBack,
}: Props): JSX.Element {
  const [showNetworks, setShowNetworks] = useState(false);
  const [network, setNetwork] = useState<NetworkKey>("BEP20");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState<string>("");

  const {min, fee} = NETWORKS[network];
  const amountNum = Number(amount) || 0;
  const eligible = amountNum >= min && amountNum <= balanceUsdt && !!address;
  const receive = useMemo(() => (amountNum > fee ? amountNum - fee : 0), [amountNum, fee]);

  return (
    <div className="okbam-withdraw">
      <div className="topbar">
        <button className="back" onClick={onBack}>
          <ArrowLeftOutlined />
        </button>
        <div className="title">Rút tiền mặt</div>
        <div className="spacer" />
      </div>

      <div className="form">
        <div className="field">
          <div className="label">Chuyển mạng</div>
          <button className="select" onClick={() => setShowNetworks(true)}>
            <span>{NETWORKS[network].label}</span>
            <DownOutlined />
          </button>
        </div>

        <div className="field">
          <div className="label">Địa chỉ rút tiền</div>
          <div className="input-with-icon">
            <input
              placeholder="Vui lòng chọn địa chỉ rút tiền"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <CopyOutlined />
          </div>
        </div>

        <div className="field">
          <div className="label">Loại tiền tệ được hỗ trợ</div>
          <div className="token-box">
            <CheckCircleTwoTone twoToneColor="#52c41a" />
            <span>USDT</span>
          </div>
        </div>

        <div className="field">
          <div className="label">Số lượng xu được rút</div>
          <div className="input-with-max">
            <input
              type="number"
              placeholder={`Số lượng đầu vào tối thiểu là ${min} USDT`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button className="max" onClick={() => setAmount(String(balanceUsdt))}>
              MAX
            </button>
          </div>
          <div className="hint">
            số dư khả dụng: <b>{balanceUsdt} USDT</b>
          </div>
        </div>

        <div className="fees">
          <div className="row">
            <span>phí xử lý</span>
            <span>{fee} USDT</span>
          </div>
          <div className="row">
            <span>Phí vận hành nền tảng</span>
            <span>0 USDT</span>
          </div>
          <div className="row total">
            <span>Đến thực tế</span>
            <span>{eligible ? receive.toFixed(2) : 0} USDT</span>
          </div>
        </div>

        <button className="submit" disabled={!eligible}>
          Rút xu
        </button>

        <div className="note">
          • Để đảm bảo an toàn cho tiền của bạn, khi chính sách bảo mật tài khoản
          của bạn được ban hành. Khi có thay đổi hoặc mật khẩu của bạn bị thay đổi,
          chúng tôi sẽ xem xét việc rút
        </div>
      </div>

      {showNetworks && (
        <div className="network-overlay" onClick={() => setShowNetworks(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-title">Chọn mạng rút tiền</div>
            <button
              className={`option ${network === "BEP20" ? "active" : ""}`}
              onClick={() => {
                setNetwork("BEP20");
                setShowNetworks(false);
              }}
            >
              <div className="name">BNB Smart Chain (BEP20)</div>
              <div className="desc">Số tiền rút tối thiểu 2.00 USDT • Phí mạng 1.00USDT</div>
            </button>
            <button
              className={`option ${network === "TRC20" ? "active" : ""}`}
              onClick={() => {
                setNetwork("TRC20");
                setShowNetworks(false);
              }}
            >
              <div className="name">Tron (TRC20)</div>
              <div className="desc">Số tiền rút tối thiểu 6.00 USDT • Phí mạng 1.60USDT</div>
            </button>
            <div className="warn">Đảm bảo chọn đúng mạng khớp với địa chỉ nhận của bạn</div>
          </div>
        </div>
      )}
    </div>
  );
}


