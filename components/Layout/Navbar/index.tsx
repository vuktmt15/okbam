import "./index.scss";
import {SearchOutlined, UserOutlined} from "@ant-design/icons";
import ApiUser from "@app/api/ApiUser";
import {loginUser} from "@app/redux/slices/UserSlice";
import {IRootState} from "@app/redux/store";
import {IUserLogin} from "@app/types";
import {Avatar, Input} from "antd";
import React, {useEffect} from "react";
import {useQuery} from "react-query";
import {useDispatch, useSelector} from "react-redux";

/**
 *
 */
export default function Navbar(): JSX.Element {
  const user = useSelector((state: IRootState) => state.user);

  const dispatch = useDispatch();

  const getMeData = (): Promise<IUserLogin> => {
    return ApiUser.getMe();
  };

  const dataUser = useQuery("dataUser", getMeData);

  useEffect(() => {
    dataUser.refetch().then((data) => {
      dispatch(loginUser({...user, user: data?.data}));
    });
  }, []);

  return (
    <div className="navbar flex items-center justify-between">
      <div className="flex items-center">
        <Input
          size="large"
          placeholder="Search"
          prefix={<SearchOutlined />}
        />
      </div>
      <div className="group-user-info">
        {/* <Dropdown overlay={renderDropdown()} trigger={["click"]}> */}
        <div className="cursor-pointer flex items-center">
          <Avatar size="default" icon={<UserOutlined />} />
          <span className="ml-2 hidden md:flex">
            {dataUser?.data?.fullName}
          </span>
        </div>
      </div>
    </div>
  );
}
