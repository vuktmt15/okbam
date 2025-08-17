import ErrorMessage from "@components/Form/ErrorMessage";
import PasswordInput from "@components/PasswordInput";
import {InputProps} from "antd";
import {ChangeEvent} from "react";
import {useController, useFormContext} from "react-hook-form";

interface IPasswordInputFormProps extends InputProps {
  name: string;
  handleChange?: (e: string | ChangeEvent<any>) => void;
  handleBlur?: (e: string | ChangeEvent<any>) => void;
}

export default function PasswordInputForm(props: IPasswordInputFormProps) {
  const {control} = useFormContext();

  const {field, formState} = useController({
    control: control,
    name: props.name,
  });

  return (
    <>
      <PasswordInput
        value={field.value}
        onChange={(text) => {
          field.onChange(text);
          props.handleChange?.(text);
        }}
        onBlur={field.onBlur}
        {...props}
      />
      <ErrorMessage>
        {formState.errors?.[props.name]?.message?.toString()}
      </ErrorMessage>
    </>
  );
}
