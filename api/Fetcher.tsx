import Config from "../config";
import store, {persistor} from "../redux/store";
import ListErrorMessage from "./ErrorMessage/ListErrorMessage";
import {logoutUser} from "@slices/UserSlice";
import {Modal, notification} from "antd";
import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";
import i18n from "i18next";
import toString from "lodash.tostring";

export interface IDataError {
  statusCode: string;
  errorMessage?: string;
}

export interface IMetadata {
  time?: string;
  totalPages: number;
  totalItems: number;
  currentPage: number;
  pageSize?: number;
}

export interface IDataWithMeta<T> {
  meta: IMetadata;
  data: T;
}

export interface IResponseDTO<T> {
  success: boolean;
  statusCode: string;
  message?: string;
  meta?: IMetadata;
  data?: T;
}

interface IResponseWithMetadataDTO<T> {
  success: boolean;
  statusCode: string;
  message?: string;
  meta: IMetadata;
  data?: T;
}

interface IFetcherOptions {
  token?: string;
  withToken?: boolean;
  withMetadata?: boolean;
  displayError?: boolean;
  isFormData?: boolean;
}

function logout(): void {
  persistor
    .purge()
    .then(() => {
      store.dispatch(logoutUser());
      window.location.assign(Config.PATHNAME.LOGIN);
    })
    .catch(() => {
      window.alert(i18n.t("fetcher.brower_errors"));
    });
}

function confirmLogout(
  title: string,
  content: string,
  isRequiredLogOut: boolean,
): void {
  Modal.destroyAll();
  if (!isRequiredLogOut) {
    Modal.confirm({
      title,
      content,
      onOk: logout,
    });
  } else {
    Modal.confirm({
      title,
      content,
      onOk: logout,
      onCancel: logout,
    });
  }
}

function displayError(dataError: IDataError): void {
  const {statusCode} = dataError;
  let errorMessage;

  const error = ListErrorMessage.find((dt) => dt.error_code === statusCode);
  if (error) {
    errorMessage = error.description;
  } else {
    errorMessage = dataError.errorMessage ?? i18n.t("fetcher.some_thing_wrong");
  }

  notification.error({
    message: i18n.t("fetcher.some_thing_wrong_pls"),
    description: errorMessage,
    duration: 3,
  });
}

function getAuthorization(defaultOptions: IFetcherOptions) {
  if (defaultOptions.token) {
    return `Bearer ${defaultOptions.token}`;
  }

  if (defaultOptions.withToken) {
    const state = store.getState();
    const token = state.user?.accessToken;
    if (token) {
      return `Bearer ${token}`;
    }
  }

  return undefined;
}

function createApiClient(config: AxiosRequestConfig, options: IFetcherOptions) {
  const defaultOptions: IFetcherOptions = {
    withToken: Config.NETWORK_CONFIG.USE_TOKEN,
    withMetadata: Config.NETWORK_CONFIG.WITH_METADATA,
    displayError: Config.NETWORK_CONFIG.DISPLAY_ERROR,
    ...options,
  };

  const apiClient = axios.create({
    headers: {
      "Content-Type": options.isFormData
        ? "multipart/form-data"
        : "application/json",
      "Authorization": getAuthorization(defaultOptions),
    },
    baseURL: Config.NETWORK_CONFIG.API_BASE_URL,
    timeout: Config.NETWORK_CONFIG.TIMEOUT,
  });

  return {apiClient, defaultOptions};
}

function returnResponseData<T>(
  defaultOptions: IFetcherOptions,
  response: AxiosResponse<IResponseDTO<T>, IDataError>,
  resolve: (value: T | PromiseLike<T>) => void,
  reject: (reason?: IDataError) => void,
) {
  if (response.data?.success) {
    if (response.data.data === undefined) {
      const dataEmpty: IDataError = {
        statusCode: "ERROR???",
        errorMessage: "Data is empty",
      };
      if (defaultOptions.displayError) {
        displayError(dataEmpty);
      }
      reject(dataEmpty);
      return true;
    }
    resolve(response.data.data);
    return true;
  }
  return false;
}

function returnResponseDataWithMetaData<T>(
  defaultOptions: IFetcherOptions,
  response: AxiosResponse<IResponseWithMetadataDTO<T>, IDataError>,
  resolve: (value: IDataWithMeta<T> | PromiseLike<IDataWithMeta<T>>) => void,
  reject: (reason?: IDataError) => void,
) {
  if (response.data.success) {
    if (response.data.data === undefined) {
      const dataEmpty: IDataError = {
        statusCode: "ERROR???",
        errorMessage: i18n.t("fetcher.data_empty"),
      };
      if (defaultOptions.displayError) {
        displayError(dataEmpty);
      }
      reject(dataEmpty);
      return true;
    }
    resolve({
      data: response.data.data,
      meta: response.data.meta,
    });
    return true;
  }
  return false;
}

async function processOtherCase<T>(
  defaultOptions: IFetcherOptions,
  response:
    | AxiosResponse<IResponseDTO<T>, IDataError>
    | AxiosResponse<IResponseWithMetadataDTO<T>, IDataError>,
  reject: (reason?: IDataError) => void,
) {
  const dataError: IDataError = {
    statusCode: response.data.statusCode,
    errorMessage: response.data.message,
  };
  if (dataError?.statusCode === Config.ERRORS_CODE.EXPIRED_TOKEN) {
    confirmLogout(
      i18n.t("fetcher.login_expired"),
      i18n.t("fetcher.retry_login"),
      true,
    );
    reject(dataError);
    return;
  }
  if (dataError?.statusCode === Config.ERRORS_CODE.NO_PERMISSION) {
    confirmLogout(
      i18n.t("fetcher.not_login"),
      i18n.t("fetcher.retry_login_pls"),
      false,
    );
    reject(dataError);
    return;
  }
  if (defaultOptions.displayError) {
    displayError(dataError);
  }
  reject(dataError);
}

function returnErrorData(
  defaultOptions: IFetcherOptions,
  error: Error | AxiosError,
  reject: (reason?: any) => void,
) {
  if (axios.isAxiosError(error)) {
    // Axios error
    const somethingsWrong: IDataError = {
      statusCode: "ERROR???",
      errorMessage: !window.navigator.onLine
        ? i18n.t("fetcher.internet_errors")
        : i18n.t("fetcher.some_thing_wrong"),
    };

    let dataError: IDataError = somethingsWrong;
    if (error?.response?.data) {
      dataError = {
        statusCode: error?.response?.data.statusCode,
        errorMessage: error?.response?.data.message,
      };
    }

    if (dataError?.statusCode === Config.ERRORS_CODE.NOT_AUTHENTICATED) {
      logout();
    } else if (defaultOptions.displayError) {
      displayError(dataError);
    }

    return reject(dataError);
  }

  // Native error
  notification.error({
    message: i18n.t("fetcher.some_thing_wrong"),
    description: toString(error),
  });

  return reject({
    statusCode: "NATIVE_ERROR",
    errorMessage: i18n.t("fetcher.some_thing_wrong"),
  });
}

export async function fetcher<T>(
  config: AxiosRequestConfig,
  options: IFetcherOptions = {},
): Promise<T> {
  const {apiClient, defaultOptions} = createApiClient(config, options);

  return new Promise<T>((resolve, reject) => {
    apiClient
      .request<T, AxiosResponse<IResponseDTO<T>>>(config)
      .then(async (response) => {
        if (!returnResponseData(defaultOptions, response, resolve, reject)) {
          await processOtherCase(defaultOptions, response, reject);
        }
        const dataError: IDataError = {
          statusCode: "ERROR???",
          errorMessage: i18n.t("fetcher.some_thing_wrong"),
        };

        if (
          response?.data.statusCode === Config.ERRORS_CODE.NOT_AUTHENTICATED
        ) {
          logout();
        }
        return reject(dataError);
      })
      .catch((error: Error | AxiosError) => {
        returnErrorData(defaultOptions, error, reject);
      });
  });
}

export async function fetcherWithMetadata<T>(
  config: AxiosRequestConfig,
  options: IFetcherOptions = {},
): Promise<IDataWithMeta<T>> {
  const {apiClient, defaultOptions} = createApiClient(config, options);

  return new Promise<IDataWithMeta<T>>((resolve, reject) => {
    apiClient
      .request<T, AxiosResponse<IResponseWithMetadataDTO<T>>>(config)
      .then(async (response) => {
        if (
          !returnResponseDataWithMetaData(
            defaultOptions,
            response,
            resolve,
            reject,
          )
        ) {
          await processOtherCase(defaultOptions, response, reject);
        }
        let dataError: IDataError = {
          statusCode: "ERROR???",
          errorMessage: i18n.t("fetcher.some_thing_wrong"),
        };

        if (
          response?.data.statusCode === Config.ERRORS_CODE.NOT_AUTHENTICATED
        ) {
          logout();
        } else if (!response?.data.success && defaultOptions.displayError) {
          dataError = {
            statusCode: response?.data.statusCode,
            errorMessage: response?.data.message,
          };
          displayError(dataError);
        }
        return reject(dataError);
      })
      .catch((error: Error | AxiosError) => {
        returnErrorData(defaultOptions, error, reject);
      });
  });
}
