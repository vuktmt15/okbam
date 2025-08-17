import ErrorMessage from "@components/Form/ErrorMessage";
import {SwitchGlobal} from "@components/SwitchGlobal";
import {SwitchProps} from "antd";
import {useController, useFormContext} from "react-hook-form";

interface ISwitchInputFormProps extends SwitchProps {
  name: string;
}

export default function SwitchInputForm(props: ISwitchInputFormProps) {
  const {control} = useFormContext();

  const {field, formState} = useController({
    control: control,
    name: props.name,
  });
  return (
    <>
      <SwitchGlobal
        onChange={(value) => {
          field.onChange(value);
        }}
        checked={field.value}
        {...props}
      />
      <ErrorMessage>
        {formState.errors?.[props.name]?.message?.toString()}
      </ErrorMessage>
    </>
  );
}
