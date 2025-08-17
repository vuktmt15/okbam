import "./index.scss";
import {EyeInvisibleOutlined, EyeTwoTone} from "@ant-design/icons";
import {Input as AntInput} from "antd";
import {InputProps} from "antd/es/input/Input";
import clsx from "clsx";
import {useCallback} from "react";

function PasswordInput(props: InputProps): JSX.Element {
  const {className, ...rest} = props;

  const renderPasswordIcon = useCallback(
    (visible: boolean): React.ReactNode =>
      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />,
    [],
  );

  return (
    <AntInput.Password
      className={clsx(className, "sso-password-input")}
      iconRender={renderPasswordIcon}
      {...rest}
    />
  );
}

export default PasswordInput;
