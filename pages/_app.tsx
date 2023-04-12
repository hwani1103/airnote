import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";

//SWRConfig는, _app.tsx에 적용해서
//모든 페이지에 적용되어 fetcher같은것의 기본값을 지정할 수 있는
//Provider이다.
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          fetch(url).then((response) => response.json()),
      }}
    >
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </SWRConfig>
  );
}
export default MyApp;
