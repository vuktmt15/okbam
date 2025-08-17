import "./index.scss";
import {CommonReactProps} from "@app/types";
import React from "react";

export default function Main({children}: CommonReactProps): JSX.Element {
  return <div className="main">{children}</div>;
}
