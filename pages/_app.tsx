import "../styles/globals.scss";
import Head from "next/head";
import type { AppProps } from "next/app";
import { UserProvider } from "@auth0/nextjs-auth0";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { store } from "../store";
import { Provider } from "react-redux";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { appWithTranslation } from "next-i18next";

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();

  return (
    <>
      <Head>
        <meta name="description" content="Simple URL shortener" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <div className="wrapper">
              <div className="wrapper__header">
                <Navbar />
              </div>

              <div className="wrapper__content">
                <Component {...pageProps} />
              </div>
              <div className="wrapper__footer">
                <Footer />
              </div>
            </div>
          </UserProvider>
        </QueryClientProvider>
      </Provider>
    </>
  );
}

export default appWithTranslation(MyApp);
