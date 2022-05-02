import type {AppProps} from 'next/app';
import {SessionProvider} from "next-auth/react";

import '../styles/globals.css';
import {RecoilRoot} from "recoil";

const App = ({Component, pageProps: {session, ...pageProps}}: AppProps) => {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </SessionProvider>
  )
}

export default App;
