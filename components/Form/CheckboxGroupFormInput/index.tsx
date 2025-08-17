import {CheckboxInputForm} from "@components/Form/CheckboxInputForm";
import {Checkbox} from "antd";
import {t} from "i18next";
import React, {ReactNode} from "react";

interface Option {
  label: string;
  value: string;
  name: string;
  icon: ReactNode;
}

type CheckboxValueType = string | number | boolean;

interface MyCheckboxGroupProps {
  options: Option[];
  onChange?: (checkedValues: CheckboxValueType[]) => void;
  className?: string;
  value?: CheckboxValueType[];
  checked?: boolean;
}

export function CustomCheckboxGroup({
  options,
  onChange,
  className,
  value,
  checked,
}: MyCheckboxGroupProps) {
  return (
    <Checkbox.Group onChange={onChange} value={value} className={className}>
      {options.map((option) => {
        return (
          <div
            className="flex items-center justify-between my-2 w-full"
            key={option.label}
          >
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center justify-center w-5 mr-2 ">
                {option.icon}
              </div>
              <div className="text-sm font-normal text-grey-text-color-4">
                {t(option.label)}
              </div>
            </div>
            <CheckboxInputForm
              name={option.name}
              value={option.name}
              checked={checked}
            />
          </div>
        );
      })}
    </Checkbox.Group>
  );
}
