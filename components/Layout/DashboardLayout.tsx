import Content from "./Content";
import "./index.scss";
import Config from "@app/config";
import {CommonReactProps} from "@app/types";
import Main from "@components/Layout/Main";
import Navbar from "@components/Layout/Navbar";
import Sidebar from "@components/Layout/Sidebar";
import clsx from "clsx";
import {Noto_Sans_Lao as notoSanLao} from "next/font/google";
import React from "react";

const notoSan = notoSanLao({subsets: ["latin"]});

export default function DashboardLayout({
  children,
}: CommonReactProps): JSX.Element {
  const {useSidebar, useNavbar} = Config.LAYOUT_CONFIG;
  return (
    <div className={clsx(notoSan.className, "wrapper")}>
      {useSidebar && <Sidebar />}
      <Main>
        {useNavbar && <Navbar />}
        <Content>{children}</Content>
      </Main>
    </div>
  );
}
