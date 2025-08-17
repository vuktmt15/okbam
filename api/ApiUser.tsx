import store from "../redux/store";
import {
  IAccountInfo,
  IAccountRole,
  IForceChangePasswordBody,
  IOtpChangePasswordBody,
  IOtpMethodsResponse,
  IOtpResetPasswordBody,
  IOtpVerifyChangePasswordBody,
  IOtpVerifyChangePasswordResponse,
  IOtpVerifyResetPasswordBody,
  IOtpVerifyResetPasswordResponse,
  IParamsGetUserPublic,
  IShareProfileBody,
  IUserLogin,
} from "../types";
import {fetcher} from "./Fetcher";
import {ISignInForm} from "@module/login/SignIn/form-config";
import dayjs from "dayjs";

export interface ILoginBody {
  username: string;
  password: string;
}

export interface ILogin3GBody {
  token: string;
}

export interface IChangePasswordBody {
  oldPassword: string;
  newPassword: string;
}

export interface ILoginSocialBody {
  code: string;
  social: "google" | "facebook" | "apple";
}

export interface IOtpLinkPhoneBody {
  phoneNumber: string;
}

export interface IOtpLinkPhoneResponse {
  success: boolean;
}

export interface ILinkPhoneUserBody {
  phoneNumber: string;
  otp: string;
  isPrimary: boolean;
}

export interface IContactUserBody {
  email?: string;
  phoneNumber?: string;
  otp: string;
  isPrimary?: boolean;
}

export interface IDeleteUserBody {
  otp: string;
}

export interface IOtpSendBody {
  type: string;
  email?: string;
  phoneNumber?: string;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  role?: number | string;
}

export interface IParamsGetUser {
  sort?: string[];
  searchFields?: string[];
  pageSize?: number;
  pageNumber?: number;
  disablePagination?: boolean;
  search?: string;
  searchType?: string;
}

export interface IRequestLoginResponse {
  hasSentOtp: boolean;
}

export interface IUserUpdateInfor {
  username?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  province?: string | null;
  country?: string | null;
  birthday?: string | number | Date | dayjs.Dayjs | null | undefined;
  language?: string;
}

export interface ICityList {
  id: string;
  name_en?: string;
  name_la?: string;
  name_vi?: string;
}

export interface ICountryList {
  id: string;
  name: string;
  code: string;
}

export interface IOtpMethodOfUserData {
  id: string;
  name: string;
}

export interface ILanguageChoosen {
  language: string;
}

const path = {
  login: "/auth/login",
  checkLogin3G: "/auth/check-login-3g",
  login3G: "/auth/login-3g",
  getMe: "/user/me",
  language: "/user/me/language",
  loginSocial: "/auth/",
  otpLinkPhone: "/otp/link-phone",
  linkPhoneUser: "/user/phone",
  cityList: "/address/list-city",
  countryList: "/address/list-country",
  deletePhoneUser: "/user/phone",
  setPrimaryPhoneUser: "/user/set-primary-phone",
  linkEmailUser: "/user/email",
  deleteEmailUser: "/user/email",
  setPrimaryEmailUser: "/user/set-primary-email",
  requestLogin: "/auth/request-login",
  otpSend: "/otp/send",
  otpMethods: "/otp/methods",
  otpResetPassword: "/otp/reset-password",
  otpChangePassword: "/otp/change-password",
  otpVerifyResetPassword: "/otp/verify-reset-password",
  otpVerifyChangePassword: "/otp/verify-change-password",
  forceChangePassword: "/user/force-change-password",
  getOtpMethodOfUser: "/user/otp-methods",
  changePassword: "/user/change-password",
  uploadBanner: "/user/upload-banner",
  uploadAvatar: "/user/upload-avatar",
  shareProfile: "/user/share-setting",
  getUserPublic: "user/",
};

function getMe(): Promise<IUserLogin> {
  return fetcher({url: path.getMe, method: "get"});
}

function getOtpMethodOfUser(): Promise<IOtpMethodOfUserData[]> {
  return fetcher({url: path.getOtpMethodOfUser, method: "get"});
}

function login(body: ILoginBody): Promise<IAccountInfo> {
  return fetcher(
    {url: path.login, method: "post", data: body},
    {displayError: true},
  );
}

function login3G(body: ILogin3GBody): Promise<IAccountInfo> {
  return fetcher(
    {url: path.login, method: "post", data: body},
    {displayError: true},
  );
}

function checkLogin3G(): Promise<IUserLogin> {
  return fetcher(
    {
      url: path.checkLogin3G,
      method: "get",
    },
    {displayError: false},
  );
}

function chooseLanguage(body: ILanguageChoosen): Promise<IUserLogin> {
  return fetcher(
    {
      url: path.language,
      method: "patch",
      data: {language: body.language},
    },
    {displayError: true},
  );
}

function loginSocial(body: ILoginSocialBody): Promise<IAccountInfo> {
  return fetcher(
    {
      url: path.loginSocial + body.social,
      method: "post",
      data: {code: body.code},
    },
    {displayError: true},
  );
}

function requestLogin(body: ISignInForm): Promise<IRequestLoginResponse> {
  return fetcher(
    {
      url: path.requestLogin,
      method: "post",
      data: body,
    },
    {displayError: true},
  );
}

function otpLinkPhone(body: IOtpLinkPhoneBody): Promise<IOtpLinkPhoneResponse> {
  return fetcher(
    {
      url: path.otpLinkPhone,
      method: "post",
      data: {phoneNumber: body.phoneNumber},
    },
    {displayError: true},
  );
}

function otpSend(body: IOtpSendBody): Promise<IOtpLinkPhoneResponse> {
  return fetcher(
    {
      url: path.otpSend,
      method: "post",
      data: body,
    },
    {displayError: true},
  );
}

function linkPhoneUser(body: IContactUserBody): Promise<IOtpLinkPhoneResponse> {
  return fetcher(
    {
      url: path.linkPhoneUser,
      method: "post",
      data: body,
    },
    {displayError: true},
  );
}

function setPrimaryPhoneUser(body: IContactUserBody): Promise<null> {
  return fetcher(
    {
      url: path.setPrimaryPhoneUser,
      method: "post",
      data: body,
    },
    {displayError: true},
  );
}

function deletePhoneUser(body: IContactUserBody): Promise<null> {
  return fetcher({
    url: path.deletePhoneUser,
    method: "delete",
    data: body,
  });
}

function linkEmailUser(body: IContactUserBody): Promise<IOtpLinkPhoneResponse> {
  return fetcher(
    {
      url: path.linkEmailUser,
      method: "post",
      data: body,
    },
    {displayError: true},
  );
}

function setPrimaryEmailUser(body: IContactUserBody): Promise<null> {
  return fetcher(
    {
      url: path.setPrimaryEmailUser,
      method: "post",
      data: body,
    },
    {displayError: true},
  );
}

function deleteEmailUser(body: IContactUserBody): Promise<null> {
  return fetcher({
    url: path.deleteEmailUser,
    method: "delete",
    data: body,
  });
}

function isLogin(): boolean {
  return !!getAuthToken();
}

function getUserRole(): IAccountRole | undefined {
  const {user} = store.getState();
  return user?.user?.role?.id;
}

function getAuthToken(): string | undefined {
  const {user} = store.getState();
  return user?.accessToken;
}

function otpMethods(username: string): Promise<IOtpMethodsResponse[]> {
  return fetcher(
    {
      url: path.otpMethods,
      method: "post",
      data: username,
    },
    {displayError: true},
  );
}

function otpResetPassword(body: IOtpResetPasswordBody): Promise<null> {
  return fetcher(
    {
      url: path.otpResetPassword,
      method: "post",
      data: body,
    },
    {displayError: true},
  );
}

function otpVerifyResetPassword(
  body: IOtpVerifyResetPasswordBody,
): Promise<IOtpVerifyResetPasswordResponse> {
  return fetcher(
    {
      url: path.otpVerifyResetPassword,
      method: "post",
      data: body,
    },
    {displayError: true},
  );
}

function otpChangePassword(body: IOtpChangePasswordBody): Promise<null> {
  return fetcher(
    {
      url: path.otpChangePassword,
      method: "post",
      data: body,
    },
    {displayError: true},
  );
}

function otpVerifyChangePassword(
  body: IOtpVerifyChangePasswordBody,
): Promise<IOtpVerifyChangePasswordResponse> {
  return fetcher(
    {
      url: path.otpVerifyChangePassword,
      method: "post",
      data: body,
    },
    {displayError: true},
  );
}

function forceChangePassword(body: IForceChangePasswordBody): Promise<null> {
  return fetcher(
    {
      url: path.forceChangePassword,
      method: "post",
      data: body,
    },
    {displayError: true},
  );
}

function changePassword(body: IChangePasswordBody): Promise<null> {
  return fetcher(
    {
      url: path.changePassword,
      method: "post",
      data: body,
    },
    {displayError: true},
  );
}

function uploadBanner(body: FormData): Promise<null> {
  return fetcher(
    {
      url: path.uploadBanner,
      method: "post",
      data: body,
    },
    {
      isFormData: true,
    },
  );
}

function uploadAvatar(body: FormData): Promise<null> {
  return fetcher(
    {
      url: path.uploadAvatar,
      method: "post",
      data: body,
    },
    {
      isFormData: true,
    },
  );
}

function shareProfile(body: IShareProfileBody): Promise<IShareProfileBody> {
  return fetcher(
    {
      url: path.shareProfile,
      method: "post",
      data: body,
    },
    {displayError: true},
  );
}

function getShareProfile(): Promise<IShareProfileBody> {
  return fetcher({url: path.shareProfile, method: "get"});
}

function updateUserInfo(body: IUserUpdateInfor): Promise<null> {
  return fetcher(
    {
      url: path.getMe,
      method: "patch",
      data: body,
    },
    {displayError: true},
  );
}

function getProvinceList(): Promise<ICityList[]> {
  return fetcher({
    url: path.cityList,
    method: "get",
  });
}

function getCountryList(): Promise<ICountryList[]> {
  return fetcher({
    url: path.countryList,
    method: "get",
  });
}

function getUserPublic(params: IParamsGetUserPublic): Promise<IUserLogin> {
  return fetcher(
    {url: path.getUserPublic + params.id, method: "get"},
    {displayError: false},
  );
}

function deleteUser(body: IDeleteUserBody): Promise<null> {
  return fetcher({
    url: path.getMe,
    method: "delete",
    data: body,
  });
}

export default {
  login,
  isLogin,
  checkLogin3G,
  getAuthToken,
  getOtpMethodOfUser,
  getUserRole,
  getMe,
  chooseLanguage,
  loginSocial,
  otpLinkPhone,
  linkPhoneUser,
  setPrimaryPhoneUser,
  linkEmailUser,
  setPrimaryEmailUser,
  deleteEmailUser,
  deletePhoneUser,
  updateUserInfo,
  getProvinceList,
  requestLogin,
  otpSend,
  otpMethods,
  otpResetPassword,
  otpVerifyResetPassword,
  otpChangePassword,
  otpVerifyChangePassword,
  forceChangePassword,
  changePassword,
  uploadBanner,
  uploadAvatar,
  shareProfile,
  getShareProfile,
  getUserPublic,
  getCountryList,
  login3G,
  deleteUser,
};
