import * as React from 'react';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "@firebase/firestore";
import Head from 'next/head'
import {getProviders, getSession, useSession} from "next-auth/react";
import {NextPage} from "next";
import {Comment, Login, Modal, Post, Sidebar} from "../components";
import {useRecoilState} from "recoil";
import {useRouter} from "next/router";
import {ArrowLeftIcon} from "@heroicons/react/solid";

import {CtxOrReq} from "next-auth/client/_utils";
import {modalState} from "../atoms/modalAtom";
import {db} from "../firebase";

interface PostPageProps {

}

const PostPage: NextPage<any> = ({trendingResults, followData, providers}) => {
  const {data: session} = useSession();
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [post, setPost] = React.useState<any>(null);
  const [comments, setComments] = React.useState<any[]>([]);

  const router = useRouter();
  const {id} = router.query;


  React.useEffect(
    () =>
      // @ts-ignore
      onSnapshot(doc(db, "posts", id), (snapshot) => {
        setPost(snapshot.data());
      }),
    [db]
  );

  React.useEffect(
    () =>
      // @ts-ignore
      onSnapshot(query(collection(db, "posts", id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setComments(snapshot.docs)
      ),
    [db, id]
  );

  if (!session) return <Login providers={providers}/>

  return (
    <div>
      <Head>
        <title>{post?.username} on Twitter: "{post?.text}"</title>
        <meta name="description" content="Twitter clone by Nick Miriad"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
        <Sidebar/>
        <div className="flex-grow border-l border-r border-gray-700
                        max-w-2xl sm:ml-[73px] xl:ml-[370px]">
          <div className="flex items-center px-1.5 py-2 border-b
                          border-gray-700 text-[#d9d9d9] font-semibold
                          text-xl gap-x-4 sticky top-0 z-50 bg-black">
            <div
              className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0"
              onClick={() => router.push("/")}
            >
              <ArrowLeftIcon className="h-5 text-white"/>
            </div>
            Tweet
          </div>
          <Post post={post} isPostPage id={id as string}/>

          {comments.length > 0 && (
            <ul className="pb-72">
              {comments.map((comment: any) => (
                <Comment
                  key={comment.id}
                  comment={comment.data()}
                />
              ))}
            </ul>
          )}
        </div>
        {/*  Widgets */}

        {isOpen && <Modal/>}
      </main>
    </div>
  )
};

export async function getServerSideProps(context: CtxOrReq) {
  const trendingData = await fetch("https://jsonkeeper.com/b/NKEV")
    .then((res) => res.json());
  const followData = await fetch("https://jsonkeeper.com/b/NKEV")
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


export default React.memo<PostPageProps>(PostPage);