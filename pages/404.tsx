import Config from "../config";
import {Button, Result} from "antd";
import {useRouter} from "next/router";
import React from "react";

export default function Custom404(): JSX.Element {
  const router = useRouter();

  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi, trang này không tồn tại"
      extra={
        <Button
          type="default"
          onClick={(): void => {
            router.push(Config.PATHNAME.HOME);
          }}
        >
          Quay về trang chủ
        </Button>
      }
    />
  );
}
