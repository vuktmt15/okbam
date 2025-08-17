import "./index.scss";
import {CommonReactProps} from "@app/types";
import React from "react";

export default function Content({children}: CommonReactProps): JSX.Element {
  return <div className="content">{children}</div>;
}
