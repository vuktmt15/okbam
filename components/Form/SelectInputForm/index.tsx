import {CloseCircleFilled, DownOutlined} from "@ant-design/icons";
import ErrorMessage from "@components/Form/ErrorMessage";
import {SelectInput} from "@components/SelectInput";
import {SelectProps} from "antd";
import React from "react";
import {useController, useFormContext} from "react-hook-form";

interface ISelectInputFormProps extends SelectProps {
  name: string;
}

export default function SelectInputForm(props: ISelectInputFormProps) {
  const {name} = props;

  const {control} = useFormContext();

  const {field, formState} = useController({
    control: control,
    name: name,
  });

  return (
    <div>
      <SelectInput
        clearIcon={<CloseCircleFilled className="text-[1rem]" />}
        suffixIcon={<DownOutlined />}
        onChange={(value) => {
          field.onChange(value ?? null);
        }}
        value={field.value}
        {...props}
      />
      <ErrorMessage>
        {formState.errors?.[name]?.message?.toString()}
      </ErrorMessage>
    </div>
  );
}
