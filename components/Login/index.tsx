import * as React from 'react';
import Image from "next/image";
import {signIn} from "next-auth/react";
import Head from "next/head";

interface LoginProps {
  providers: any
}

const Login: React.FC<LoginProps> = ({providers}) => {

  const handleClick = (provId: string, options: any) => {
    signIn(provId, options).then(r => console.log("successfully Sign In"))
  };

  // TODO: Login
  return (
    <div className="flex flex-col items-center space-y-20 pt-48">
      <Head>
        <title>Twitter</title>
        <meta name="description" content="Twitter clone by Nick Miriad"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <Image
        src="https://rb.gy/ogau5a"
        width={150}
        height={150}
        objectFit="contain"
      />

      <div>
        {Object.values(providers).map((provider: any) => (
          <div key={provider.name}>
            <button className="logBtn group"
                    onClick={() => handleClick(provider.id, {callbackUrl: "/"})}
            >
              <span className="logBtn-half-1"/>
              <span className="logBtn-half-2">
                Sign in with {provider.name}
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
};

export default React.memo<LoginProps>(Login);