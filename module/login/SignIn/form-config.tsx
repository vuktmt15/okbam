import {
  emailRegex,
  phoneLaosRegex,
  phoneVNRegex,
  userNameRegex,
} from "@utils/validation";
import * as Yup from "yup";

export interface ISignInForm {
  username: string;
}

export function getValidationSignInSchema(): Yup.ObjectSchema<ISignInForm> {
  return Yup.object().shape({
    username: Yup.string()
      .max(60, "common.username_max")
      .min(6, "common.username_min")
      .required("common.username_empty")
      .test(
        "login_info",
        "sign_in.login_info_is_invalid",
        (val) =>
          phoneLaosRegex.test(val) ||
          phoneVNRegex.test(val) ||
          emailRegex.test(val) ||
          userNameRegex.test(val),
      ),
  });
}
