import type {NextPage} from 'next'
import Head from 'next/head'
import {Feeds, Login, Modal, Sidebar, Widgets} from "../components";
import {getProviders, getSession, useSession} from "next-auth/react";
import {CtxOrReq} from "next-auth/client/_utils";
import {useRecoilState} from "recoil";
import {modalState} from "../atoms/modalAtom";

const Home: NextPage<any> = ({trendingData, followData, providers}) => {
  const {data: session} = useSession();
  const [isOpen, setIsOpen] = useRecoilState(modalState);

  if (!session) return <Login providers={providers}/>

  return (
    <div>
      <Head>
        <title>Twitter</title>
        <meta name="description" content="Twitter clone by Nick Miriad"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
        <Sidebar/>
        <Feeds/>
        <Widgets followData={followData} trendingData={trendingData}/>

        {isOpen && <Modal/>}
      </main>

    </div>
  )
}

export default Home;

export async function getServerSideProps(context: CtxOrReq) {
  const trendingData = await fetch("https://jsonkeeper.com/b/NKEV")
    .then((res) => res.json());
  const followData = await fetch("https://jsonkeeper.com/b/L6W4")
    .then((res) => res.json());

  const providers = await getProviders();
  const session = await getSession(context);

  return {
    props: {
      trendingData,
      followData,
      providers,
      session,
    },
  };
}
