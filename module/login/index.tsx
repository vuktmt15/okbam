import "./index.scss";
import {ForgotPassword} from "@module/login/ForgotPassword";
import {SignIn} from "@module/login/SignIn";
import React, {useState} from "react";

export function Login(): JSX.Element {
  const [tab, setTab] = useState("signIn");
  // const user = useSelector((state: IRootState) => state.user);

  const tabList = {
    signIn: {
      component: SignIn,
    },
    forgotPassword: {
      component: ForgotPassword,
    },
  };

  return (
    <div className="container-login">
      <div className="form-container">
        <div className="form">
          {React.createElement(tabList[tab as keyof typeof tabList].component, {
            changeTab: setTab,
          })}
        </div>
      </div>
    </div>
  );
}
