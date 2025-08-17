import ErrorMessage from "@components/Form/ErrorMessage";
import {IRadioInputProps, RadioInput} from "@components/RadioInput";
import React from "react";
import {useController, useFormContext} from "react-hook-form";

interface IRadioInputFormProps extends IRadioInputProps {
  name: string;
}

export function RadioInputForm(props: IRadioInputFormProps) {
  const {name} = props;

  const {control} = useFormContext();

  const {field, formState} = useController({
    control: control,
    name: name,
  });

  return (
    <div>
      <RadioInput
        value={field.value}
        onChange={(e) => {
          field.onChange(e.target.value);
        }}
        {...props}
      />
      <ErrorMessage>
        {formState.errors?.[name]?.message?.toString()}
      </ErrorMessage>
    </div>
  );
}
