import "./index.scss";
import {
  CheckboxOptionType,
  Radio,
  RadioChangeEvent,
  RadioGroupProps,
  Space,
} from "antd";
import {useState} from "react";

export interface IRadioInputProps extends RadioGroupProps {
  direction: "vertical" | "horizontal";
  options: CheckboxOptionType[];
}
export function RadioInput({
  direction = "vertical",
  options,
  onChange,
  className,
  defaultValue,
}: IRadioInputProps) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
    onChange?.(e);
  };

  return (
    <Radio.Group onChange={handleChange} value={value} className={className}>
      <Space direction={direction}>
        {options?.map((val, key) => (
          <Radio key={key} value={val.value}>
            <span className="text-base ml-3">{val.label} </span>
          </Radio>
        ))}
      </Space>
    </Radio.Group>
  );
}
