import Config from "../config";
import store, {persistor} from "../redux/store";
import Routes from "../routes";
import "../styles/_app.scss";
import "../utils/I18n";
import "../utils/firebase";
import HeaderMeta from "@components/HeaderMeta";
import {ConfigProvider} from "antd";
import {AppProps} from "next/app";
import {QueryClient, QueryClientProvider} from "react-query";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import "tailwindcss/tailwind.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: Config.NETWORK_CONFIG.RETRY,
      refetchOnWindowFocus: false,
    },
  },
});

export default function MyApp({
  Component,
  pageProps,
  router,
}: AppProps): JSX.Element {
  if (typeof window !== "undefined") {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <HeaderMeta title="Grab Study" description="Grab Study" />
            <ConfigProvider
              theme={{
                token: {
                  fontFamily: "inherit",
                },
              }}
            >
              <Routes
                Component={Component}
                pageProps={pageProps}
                router={router}
              />
            </ConfigProvider>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <HeaderMeta title="Grab Study" description="Grab Study" />
        <Routes Component={Component} pageProps={pageProps} router={router} />
      </QueryClientProvider>
    </Provider>
  );
}
