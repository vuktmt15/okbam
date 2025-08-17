import "./index.scss";
import {Input as AntInput} from "antd";
import {InputProps} from "antd/es/input/Input";
import clsx from "clsx";

function Input(props: InputProps): JSX.Element {
  const {className, ...rest} = props;

  return <AntInput className={clsx(className, "sso-input")} {...rest} />;
}

export default Input;
