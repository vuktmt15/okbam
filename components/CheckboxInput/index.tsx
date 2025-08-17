import "./index.scss";
import {Checkbox, CheckboxProps} from "antd";

export interface ICheckboxProps extends CheckboxProps {
  label?: string;
}

export function CheckBoxInput({label, ...restProps}: ICheckboxProps) {
  return <Checkbox {...restProps}>{label}</Checkbox>;
}
