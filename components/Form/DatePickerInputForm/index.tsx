import {CloseCircleFilled} from "@ant-design/icons";
import {DatePickerInput} from "@components/DatePickerInput";
import ErrorMessage from "@components/Form/ErrorMessage";
import {DatePickerProps} from "antd";
import dayjs from "dayjs";
import React from "react";
import {useController, useFormContext} from "react-hook-form";

type IDatePickerInputFormProps = DatePickerProps & {name: string};

export default function DatePickerInputForm(props: IDatePickerInputFormProps) {
  const {name} = props;

  const {control} = useFormContext();

  const {field, formState} = useController({
    control: control,
    name: name,
  });

  return (
    <div>
      <DatePickerInput
        clearIcon={
          <CloseCircleFilled className="w-6 h-6 bg-white flex justify-center items-center" />
        }
        onChange={(value) => {
          field.onChange(value);
        }}
        value={field.value}
        disabledDate={(e) => e > dayjs()}
        {...props}
      />
      <ErrorMessage>
        {formState.errors?.[name]?.message?.toString()}
      </ErrorMessage>
    </div>
  );
}
