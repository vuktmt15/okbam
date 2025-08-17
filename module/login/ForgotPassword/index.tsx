import "./index.scss";
import React from "react";

interface ForgotPasswordProps {
  changeTab: (tab: string) => void;
}

export function ForgotPassword({changeTab}: ForgotPasswordProps): JSX.Element {
  return (
    <div
      className="container"
      onClick={() => changeTab("")}
      role="presentation"
    >
      forgot
    </div>
  );
}
