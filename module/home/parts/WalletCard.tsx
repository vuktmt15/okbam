import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function WalletCard({children}: Props): JSX.Element {
  return (
    <div className="wallet-card">
      {children}
    </div>
  );
}



