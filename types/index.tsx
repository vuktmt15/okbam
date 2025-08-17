import React from "react";

export interface CommonReduxAction {
  type: string;
}

export interface CommonReactProps {
  children: React.ReactNode;
}

export interface ISettingId {
  _id?: string;
  themes?: string;
  location?: string;
  region?: string;
  language?: string;
  referCode?: string;
}

export enum GENDER {
  MALE = "0",
  FEMALE = "1",
  UNKNOWN = "2",
}

export enum IAccountRole {
  USER = 0,
  ADMIN = 1,
  ANONYMOUS = 2,
}

export enum IState {
  INACTIVE,
  ACTIVE,
  DELETED,
}

export enum IContactOption {
  PHONE,
  EMAIL,
}

export enum IOTPConfirmScreenCase {
  ADD = "LINK",
  SET_PRIMARY = "SET_PRIMARY_VALUE",
  REMOVE = "DELETE",
}

interface IPhoneNumber {
  phoneNumber: string;
  primary: boolean;
}

interface IEmail {
  email: string;
  primary: boolean;
}

export interface IPaymentMethod {
  paymentName: string;
  balance?: number;
  id?: string;
}

export interface IUserLogin {
  id?: string;
  username?: string;
  fullName?: string;
  state?: IState;
  email?: IEmail[];
  dateOfBirth?: string;
  positionId?: number;
  avatar?: string;
  banner?: string;
  wallPaper?: string;
  personId?: number;
  address?: string;
  phoneNumber?: IPhoneNumber[];
  province?: string;
  provinceName?: string;
  country?: string;
  countryName?: string;
  role?: {
    id?: IAccountRole;
    roleName?: string;
  };
  phoneNumberRelative?: string;
  baseSalary?: number;
  manageSalary?: number;
  gender?: string;
  fullyUpdateProfile?: boolean;
  payment?: IPaymentMethod[];
  cityList?: string[];
  firstName?: string;
  lastName?: string;
  personalPageLink?: string;
  allowProfileSharing?: boolean;
  allowPersonalInformationShowing?: boolean;
  allowDateOfBirthShowing?: boolean;
  allowGenderShowing?: boolean;
  allowCurrentCityShowing?: boolean;
  allowHometownShowing?: boolean;
  allowContactInforShowing?: boolean;
  allowEmailShowing?: boolean;
  allowPhoneShowing?: boolean;
  hasPassword?: boolean;
  language?: string;
}

export interface IProfile {
  _id?: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  phone?: string;
  location?: string;
  website?: string;
  facebook?: string;
  twitter?: string;
  avatar?: string;
  newEmail?: string;
}

export interface IAccountInfo {
  accessToken?: string;
  user?: IUserLogin;
  userInfo?: IUserLogin;
}

export interface IOtpMethodsResponse {
  id: string;
  name: string;
}

export interface IOtpResetPasswordBody {
  id: string;
  username: string;
}

export interface IOtpVerifyResetPasswordBody {
  id: string;
  username: string;
  otp: string;
}

export interface IOtpVerifyResetPasswordResponse {
  token: string;
}

export interface IOtpChangePasswordBody {
  id: string;
}

export interface IOtpVerifyChangePasswordBody {
  id: string;
  otp: string;
}

export interface IOtpVerifyChangePasswordResponse {
  token: string;
}

export interface IForceChangePasswordBody {
  token: string;
  password: string;
}

export interface IChangePasswordBody {
  oldPassword: string;
  newPassword: string;
}

export interface IShareProfileBody {
  publicProfile?: boolean;
  dateOfBirth?: boolean;
  gender?: boolean;
  province?: boolean;
  country?: boolean;
  email?: boolean;
  phone?: boolean;
}

export interface IParamsGetUserPublic {
  id: string | undefined | string[];
}
