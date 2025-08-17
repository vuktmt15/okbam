import ApiUser from "../../../api/ApiUser";
import RouteList from "../../../routes/RouteList";
import "./index.scss";
import {IAccountRole} from "@app/types";
import {Menu, MenuProps} from "antd";
import Image from "next/image";
import {useRouter} from "next/router";
import React, {useMemo} from "react";

const RenderMenu = React.memo(() => {
  const router = useRouter();
  const userRole = ApiUser.getUserRole();

  const menuItems = useMemo(() => {
    return RouteList.filter(
      ({role}) => !(role && userRole ? !role?.includes(userRole) : undefined),
    ).map(({path, name, children, icon}) => {
      if (children) {
        return {
          key: path,
          title: name,
          label: name,
          icon: icon,
          children: children
            .filter(
              (child) =>
                !child.role?.includes(userRole ?? IAccountRole.ANONYMOUS),
            )
            .map((child) => ({
              key: path + child.path,
              title: child.name,
              label: child.name,
              icon: child.icon,
            })),
        };
      }
      return {
        key: path,
        title: name,
        label: name,
        icon: icon,
      };
    });
  }, []);

  const onClick: MenuProps["onClick"] = (e) => {
    router.push(e.key);
  };

  return (
    <Menu
      mode="inline"
      theme="light"
      defaultSelectedKeys={[router.pathname]}
      defaultOpenKeys={["/" + router.pathname.split("/")[1]]}
      items={menuItems}
      onClick={onClick}
      className="menu-container"
    />
  );
});
RenderMenu.displayName = "RenderMenu";

/**
 *
 */
export default function Sidebar(): JSX.Element {
  return (
    <div className="sidebar">
      <div className="logo-container">
        <Image src="/favicon.ico" alt="logo" width={20} height={20} />
      </div>
      <RenderMenu />
    </div>
  );
}
