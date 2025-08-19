import "./index.scss";
import ApiUser from "@api/ApiUser";
import GlobalButton from "@app/components/GlobalButton";
import FormGlobal from "@components/Form/FormGlobal";
import TextInputForm from "@components/Form/TextInputForm";
import {
  ISignInForm,
  getValidationSignInSchema,
} from "@module/login/SignIn/form-config";
import React from "react";
import {useMutation} from "react-query";

export interface ISignInProps {
  changeTab: (tab: string) => void;
}

export function SignIn({changeTab}: ISignInProps) {
  const requestLoginMutation = useMutation(ApiUser.requestLogin);

  const handleNextScreen = (value: ISignInForm) => {
    const data = {
      username: value.username,
    };
    requestLoginMutation.mutate(data, {
      onSuccess: () => {
        changeTab("inputOTP");
      },
    });
  };

  return (
    <FormGlobal<ISignInForm>
      resolver={getValidationSignInSchema()}
      onSubmit={handleNextScreen}
      render={({handleSubmitForm, watch}) => {
        const watchUsernameField = watch().username;

        return (
          <div className="container-sign-in">
            <h1>Login Form</h1>
            <TextInputForm
              className="mb-2"
              placeholder="Enter username"
              name="username"
              onPressEnter={handleSubmitForm}
            />
            <TextInputForm
              placeholder="Enter username"
              name="username"
              onPressEnter={handleSubmitForm}
            />
            <GlobalButton
              disabled={!watchUsernameField}
              onClick={handleSubmitForm}
              className="mt-6 primary"
            >
              <span className="text-lg-semibold">Next</span>
            </GlobalButton>
          </div>
        );
      }}
    />
  );
}
