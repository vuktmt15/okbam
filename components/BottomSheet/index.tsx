import {Drawer, DrawerProps} from "antd";
import React from "react";

type Props = DrawerProps & {children?: React.ReactNode};

export default function BottomSheet({children, ...props}: Props): JSX.Element {
  return (
    <Drawer
      placement="bottom"
      closable={false}
      maskClosable
      height="auto"
      {...props}
    >
      {children}
    </Drawer>
  );
}
