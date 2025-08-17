import Input from "@app/components/Input";
import ErrorMessage from "@components/Form/ErrorMessage";
import {InputProps} from "antd";
import {ChangeEvent} from "react";
import {useController, useFormContext} from "react-hook-form";

interface ITextInputFormProps extends InputProps {
  name: string;
  handleChange?: (e: string | ChangeEvent<HTMLInputElement>) => void;
  handleBlur?: (e: string | ChangeEvent<HTMLInputElement>) => void;
  disabledSpace?: boolean;
  isTypeNumber?: boolean;
  onPressEnter?: () => void;
}

function hasWhiteSpace(s: string) {
  return /\s/.test(s);
}

export default function TextInputForm(props: ITextInputFormProps) {
  const {name, isTypeNumber, onPressEnter} = props;

  const {control} = useFormContext();

  const {field, formState} = useController({
    control: control,
    name: name,
  });

  return (
    <>
      <Input
        value={field.value ?? ""}
        onChange={(text) => {
          if (props?.disabledSpace) {
            if (hasWhiteSpace(text.target.value)) {
              return;
            }
          }
          if (isTypeNumber) {
            const valueInput = text.target.value;
            const regex = /^[0-9\b]+$/;
            if (!regex.test(valueInput) && valueInput) {
              return;
            }
          }
          field.onChange(text);
          props.handleChange?.(text);
        }}
        onKeyPress={(e) => {
          if (onPressEnter && e.charCode === 13) {
            onPressEnter();
          }
          if (isTypeNumber) {
            if (e.charCode === 45 || e.charCode === 46 || e.charCode === 43) {
              e.preventDefault();
            }
          }
        }}
        onBlur={field.onBlur}
        {...props}
      />
      <ErrorMessage>
        {formState.errors?.[name]?.message?.toString()}
      </ErrorMessage>
    </>
  );
}
