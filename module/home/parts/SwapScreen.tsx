import React, { useState } from "react";
import { ModalCustom } from "@components/ModalCustom";
import { ArrowLeftOutlined, SwapOutlined, DownOutlined } from "@ant-design/icons";

type Props = {
  onBack: () => void;
};

export default function SwapScreen({ onBack }: Props): JSX.Element {
  const [from, setFrom] = useState<string>("USDT");
  const [to, setTo] = useState<string>("DRAGON");
  const [asset, setAsset] = useState<string>("USDT");
  const [amount, setAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<number>(0);
  const [balances, setBalances] = useState<{usdt:number; dragon:number}>({usdt:0, dragon:0});
  const [submitting, setSubmitting] = useState(false);
  // typeSwap: 1 = USDT -> DRAGON, 2 = DRAGON -> USDT
  const [typeSwap, setTypeSwap] = useState<1 | 2>(1);

  const loadBalance = React.useCallback(async () => {
    try {
      const userDetailsStr = typeof window !== 'undefined' ? (localStorage.getItem('user_details') || localStorage.getItem('userDetails') || localStorage.getItem('user')) : null;
      if (!userDetailsStr) return;
      const parsed = JSON.parse(userDetailsStr);
      const referrerId = parsed?.referrerId || parsed?.refererCode || parsed?.id || parsed?.userId || parsed?.user?.id;
      if (!referrerId) return;
      const res = await fetch(`/api/getBalance?referrerId=${referrerId}`);
      const data = await res.json();
      const usdt = data?.balance?.usdt ?? 0;
      const dragon = data?.balance?.dragon ?? 0;
      setBalances({ usdt, dragon });
      // set max theo hướng swap
      setMaxAmount(typeSwap === 1 ? usdt : dragon);
    } catch (e) {
      console.error('Load balance error:', e);
    }
  }, [typeSwap]);

  // Load user's balance and update max per direction
  React.useEffect(() => {
    loadBalance();
  }, [loadBalance]);

  // Handler switch hướng swap
  const handleSwitch = () => {
    if (typeSwap === 1) {
      setTypeSwap(2);
      setFrom('DRAGON');
      setTo('USDT');
      setAsset('DRAGON');
      setMaxAmount(balances.dragon);
    } else {
      setTypeSwap(1);
      setFrom('USDT');
      setTo('DRAGON');
      setAsset('USDT');
      setMaxAmount(balances.usdt);
    }
    setAmount("");
  };

  const unit = typeSwap === 1 ? 'USDT' : 'DRAGON';

  const handleSubmit = async () => {
    if (submitting) return;
    const amt = Number(amount);
    if (!amt || amt <= 0 || amt > maxAmount) return;
    try {
      setSubmitting(true);
      const userDetailsStr = typeof window !== 'undefined' ? (localStorage.getItem('user_details') || localStorage.getItem('userDetails') || localStorage.getItem('user')) : null;
      const parsed = userDetailsStr ? JSON.parse(userDetailsStr) : null;
      const referrerId = parsed?.referrerId || parsed?.refererCode || parsed?.id || parsed?.userId || parsed?.user?.id;
      if (!referrerId) {
        alert('Missing user id');
        return;
      }
      const url = `http://159.223.91.231:8866/api/investment-history/swap-amount?referrerId=${encodeURIComponent(referrerId)}&amount=${encodeURIComponent(String(amt))}&typeSwap=${typeSwap}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Swap failed');
      const text = await res.text();
      if (text?.toLowerCase().includes('done')) {
        alert('Swap successful');
      } else {
        alert('Swap processed');
      }
      await loadBalance();
      setAmount("");
      // Notify other tabs to refresh balance and close modal
      try { window.dispatchEvent(new CustomEvent('balanceUpdate')); } catch {}
      onBack();
    } catch (e) {
      console.error(e);
      alert('Network error, please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = Number(amount) > 0 && Number(amount) <= maxAmount;

  return (
    <div className="okbam-swap">
      <div className="topbar">
        <button className="back" onClick={onBack}>
          <ArrowLeftOutlined />
        </button>
        <div className="title">Swap</div>
        {/* History link removed; SWAP history is shown from My tab */}
      </div>

      <div className="swap-form">
        <div className="fromto">
          <div className="box">
            <div className="label">From</div>
            <div className="value">{from}</div>
          </div>
          <div className="switch" onClick={handleSwitch}><SwapOutlined /></div>
          <div className="box">
            <div className="label">To</div>
            <div className="value">{to}</div>
          </div>
        </div>

        <div className="field">
          <div className="label">Asset</div>
          <button className="select">
            <span>{asset}</span>
            <DownOutlined />
          </button>
        </div>

        <div className="field">
          <div className="label">Amount</div>
          <div className="amount-row">
            <input
              type="number"
              min="0"
              step="0.00000001"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <span className="unit">{unit}</span>
            <button className="max" onClick={() => setAmount(String(maxAmount))}>MAX</button>
          </div>
          <div className="hint">Maximum transferable {maxAmount} {unit} (100 dragon = 1$)</div>
        </div>

        <button className="submit" disabled={!canSubmit || submitting} onClick={handleSubmit}>{submitting ? 'Processing...' : 'Confirm'}</button>
      </div>

      {/* History modal removed; handled in My tab */}
    </div>
  );
}


