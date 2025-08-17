import "./index.scss";
import {Button, ButtonProps} from "antd";
import clsx from "clsx";
import React from "react";

export function ButtonGlobal(props: ButtonProps) {
  return (
    <Button
      {...props}
      className={clsx(
        "button-global transition duration-150 ease-out hover:ease-in",
        props.className,
      )}
    >
      {props.children}
    </Button>
  );
}
