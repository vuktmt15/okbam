import {CheckBoxInput, ICheckboxProps} from "@components/CheckboxInput";
import ErrorMessage from "@components/Form/ErrorMessage";
import React from "react";
import {useController, useFormContext} from "react-hook-form";

interface ICheckboxInputFormProps extends ICheckboxProps {
  name: string;
}

export function CheckboxInputForm(props: ICheckboxInputFormProps) {
  const {control} = useFormContext();

  const {field, formState} = useController({
    control: control,
    name: props.name,
  });

  return (
    <div>
      <CheckBoxInput
        checked={field.value}
        onChange={(value) => {
          field.onChange(value);
        }}
        {...props}
      />
      <ErrorMessage>
        {formState.errors?.[props.name]?.message?.toString()}
      </ErrorMessage>
    </div>
  );
}
