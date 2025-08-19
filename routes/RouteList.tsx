import {IAccountRole} from "../types";
import IconBook from "@components/Icon/IconBook";
import IconDashboard from "@components/Icon/IconDashboard";
import {ReactElement} from "react";

export interface IRoute {
  path: string;
  name: string;
  role?: Array<IAccountRole>;
  icon?: ReactElement;
  isSidebar?: boolean;
  isPrivate?: boolean;
  isPublic?: boolean;
  isUpdating?: boolean;
  isAuth?: boolean;
  isSSR?: boolean;
  children?: IRoute[];
}

const routes: IRoute[] = [
  {
    path: "/",
    name: "Dashboard",
    icon: <IconDashboard />,
    isSSR: true,
    isSidebar: true,
  },
  {
    path: "/study-page",
    name: "Lessons",
    icon: <IconBook />,
    isSidebar: true,
    children: [
      {
        path: "/study",
        name: "Manage Lessons",
        isSidebar: true,
      },
      {
        path: "/study-add",
        name: "Add Lesson",
        isSidebar: true,
      },
    ],
  },
  {
    path: "/leave-work",
    name: "heh heh ",
    icon: <IconDashboard />,
    isSidebar: true,
  },
];

export default routes;
