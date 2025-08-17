// NAME
const STORE_NAME = "state";

// FORMAT DATE TIME
const DATE_TIME_FORMAT = "DD/MM/YYYY";

// NETWORK
const NETWORK_CONFIG = {
  HOST: process.env.NEXT_PUBLIC_APP_URL,
  API_BASE_URL: process.env.NEXT_PUBLIC_APP_URL + "/api/v1",
  BASE_URL: process.env.NEXT_PUBLIC_WEB_URL,
  TIMEOUT: 30000,
  RETRY: false,
  DISPLAY_ERROR: process.env.NEXT_PUBLIC_DISPLAY_ERROR === "true",
  USE_TOKEN: true,
  WITH_METADATA: false,
};

// PATHNAME
const PATHNAME = {
  HOME: "/",
  LOGIN: "/login",
  ACCOUNT_SETTING: "/account-setting",
  EDIT_PROFILE: "/edit-profile",
  EDIT_CONTACT: "/edit-contact",
  EDIT_INFOR: "/edit-info",
  PRIVACY_POLICY: "/privacy-policy",
  TERM: "/term-and-condition",
  USER_PUBLIC_PROFILE: "/user-profile",
  PAGE_404: "/404",
};

// LAYOUT
const LAYOUT_CONFIG = {
  useSidebar: false,
  useNavbar: false,
  useFooter: false,
  useBottomNavigator: false,
};

// LANGUAGE
const LANGUAGE = {
  DEFAULT: "en",
};

// FIREBASE
// Also update firebase-messaging-sw.js file if update this value
const FIREBASE = {
  apiKey: "AIzaSyCKkv7LL9tO5D0U4Cnfi3CM-OFpuyseq_M",
  authDomain: "nextjs-core.firebaseapp.com",
  projectId: "nextjs-core",
  storageBucket: "nextjs-core.appspot.com",
  messagingSenderId: "905897922179",
  appId: "1:905897922179:web:b075e0fe50ba8bbafa15b6",
  measurementId: "G-ZDEHHJF4SZ",
};

const ERRORS_CODE = {
  NOT_AUTHENTICATED: "AUTH3001.NotAuthenticated", // Not authenticated
  NO_PERMISSION: "JWT000201", // No permission to call api
  EXPIRED_TOKEN: "AUTH000220", // Token expired
  LOGIN_3G_FAIL: "LOGIN0245", // Login 3G fail
  GET_PUBLIC_INFO_FAIL: "USER0223",
};

export default {
  STORE_NAME,
  NETWORK_CONFIG,
  PATHNAME,
  LAYOUT_CONFIG,
  LANGUAGE,
  FIREBASE,
  ERRORS_CODE,
  DATE_TIME_FORMAT,
};
