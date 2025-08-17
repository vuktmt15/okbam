import {yupResolver} from "@hookform/resolvers/yup";
import React, {ReactNode, forwardRef, useImperativeHandle} from "react";
import {
  DefaultValues,
  FormProvider,
  UseFormReturn,
  useForm,
} from "react-hook-form";
import {ObjectSchema} from "yup";

interface IValueForm {
  [k: string]: any;
}

export interface IRenderForm extends UseFormReturn<IValueForm, any, undefined> {
  handleSubmitForm: () => void;
}

interface IFormProps<T> {
  defaultValues?: DefaultValues<T>;
  onSubmit: (values: IValueForm | any) => void;
  resolver?: ObjectSchema<T | any>;
  render: (props: IRenderForm) => ReactNode;
}

function FormGlobalInner<T extends IValueForm>(
  props: IFormProps<T>,
  ref: React.ForwardedRef<UseFormReturn<IValueForm>>,
) {
  const {defaultValues, render, onSubmit, resolver} = props;

  const methods = useForm<IValueForm>({
    defaultValues: defaultValues,
    resolver: resolver ? yupResolver(resolver) : undefined,
  });

  useImperativeHandle(ref, () => methods, []);

  return (
    <FormProvider {...methods}>
      {render({
        ...methods,
        handleSubmitForm: methods.handleSubmit(onSubmit),
      })}
    </FormProvider>
  );
}

const FormGlobal = forwardRef(FormGlobalInner) as <T extends IValueForm>(
  // eslint-disable-next-line no-use-before-define
  props: IFormProps<T> & {ref?: React.ForwardedRef<UseFormReturn<IValueForm>>},
) => ReturnType<typeof FormGlobalInner>;

export default FormGlobal;
