import * as React from 'react';
import Moment from "react-moment";
import {
  ChartBarIcon,
  ChatIcon,
  DotsHorizontalIcon,
  HeartIcon,
  ShareIcon,
  SwitchHorizontalIcon,
  TrashIcon
} from "@heroicons/react/outline";
import {useSession} from "next-auth/react";
import {
  HeartIcon as HeartIconFilled,
} from "@heroicons/react/solid";
import {useRecoilState} from "recoil";

import {modalState, postIdState} from "../../atoms/modalAtom";
import {db} from "../../firebase"
import {useRouter} from "next/router";
import {collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc} from "@firebase/firestore";

interface PostProps {
  id: string;
  post: any;
  isPostPage?: boolean;
}

const Post: React.FC<PostProps> = ({post, id, isPostPage}) => {
  const {data: session} = useSession();
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [comments, setComments] = React.useState<any[]>([]);
  const [likes, setLikes] = React.useState<any[]>([]);
  const [isLiked, setIsLiked] = React.useState(false);

  const router = useRouter();

  React.useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "posts", id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setComments(snapshot.docs)
      ),
    [db, id]
  )

  React.useEffect(
    () =>
      onSnapshot(collection(db, "posts", id, "likes"), (snapshot) =>
        setLikes(snapshot.docs)
      ),
    [db, id]
  );

  React.useEffect(
    () =>
      setIsLiked(
        likes.findIndex((like: any) => like.id === session?.user?.uid) !== -1
      ), [likes])

  const handlePostOpen = () => {
    router.push(`/${id}`)
  };

  const handleOpenModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();

    setPostId(id);
    setIsOpen(true);
  };

  const handleDeletePost = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();

    deleteDoc(doc(db, "posts", id));
    router.push("/");
  };

  const handleLikePost = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();

    if (isLiked) {
      await deleteDoc(doc(db, "posts", id, "likes", session!.user.uid));
    } else {
      await setDoc(doc(db, "posts", id, "likes", session!.user.uid), {
        username: session?.user.name,
      });
    }
  };

  return (
    <div
      className="p-3 flex cursor-pointer border-b border-gray-700"
      onClick={handlePostOpen}
    >
      {!isPostPage && (
        <img
          src={post?.userImg}
          alt="profile image"
          className="h-11 w-11 rounded-full mr-4"
        />
      )}
      <div className="flex flex-col space-y-2 w-full">
        <div className={`flex ${!isPostPage && "justify-between"}`}>
          {isPostPage && (
            <img
              src={post?.userImg}
              alt="profile image"
              className="h-11 w-11 rounded-full mr-4"
            />
          )}
          <div className="text-[#6e767d]">
            <div className="inline-block group">
              <h4
                className={`font-bold text-[15px] sm:text-base text-[#d9d9d9] group-hover:underline ${
                  !isPostPage && "inline-block"
                }`}
              >
                {post?.username}
              </h4>
              <span className={`text-sm sm:text-[15px] ${!isPostPage && "ml-1.5"}`}>
                @{post?.tag}
              </span>
            </div>
            {" "}·{" "}
            <span className="hover:underline text-sm sm:text-[15px]">
              <Moment fromNow>{post?.timestamp?.toDate() || new Date()}</Moment>
            </span>
            {!isPostPage && (
              <p className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5">
                {post?.text}
              </p>
            )}
          </div>

          <div className="icon group flex-shrink-0 ml-auto">
            <DotsHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#1d9df0]"/>
          </div>
        </div>

        {isPostPage && (
          <p className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5">
            {post?.text}
          </p>
        )}
        {post?.image &&
            <img
                src={post?.image}
                alt="post image"
                className="rounded-2xl max-h-[700px] object-cover mr-2"
            />
        }
        <div className={`text-[#6e767d] flex justify-between w-10/12 ${isPostPage && "mx-auto"}`}
        >
          <div
            className="flex items-center space-x-1 group"
            onClick={(e) => handleOpenModal(e)}
          >
            <div className="icon group-hover:bg-[#1d9bf0] group-hover:bg-opacity-10">
              <ChatIcon className="h-5 group-hover:text-[#1d9bf0]"/>
            </div>

            {comments.length > 0 && (
              <span className="group-hover:text-[#1d9bf0] text-sm">
                {comments.length}
              </span>
            )}
          </div>

          {session?.user.uid === post?.id ? (
            <div
              className="flex items-center space-x-1 group"
              onClick={(e) => handleDeletePost(e)}
            >
              <div className="icon group-hover:bg-red-600/10">
                <TrashIcon className="h-5 group-hover:text-red-600"/>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-1 group">
              <div className="icon group-hover:bg-green-500/10">
                <SwitchHorizontalIcon className="h-5 group-hover:text-green-500"/>
              </div>
            </div>
          )}

          <div
            className="flex items-center space-x-1 group"
            onClick={(e) => handleLikePost(e)}
          >
            <div className="icon group-hover:bg-pink-600/10">
              {isLiked ? (
                <HeartIconFilled className="h-5 text-pink-600"/>
              ) : (
                <HeartIcon className="h-5 group-hover:text-pink-600"/>
              )}
            </div>

            {likes.length > 0 && (
              <span className={`group-hover:text-pink-600 text-sm ${isLiked && "text-pink-600"}`}>
                {likes.length}
              </span>
            )}
          </div>

          <div className="icon group">
            <ShareIcon className="h-5 group-hover:text-[#1d9bf0]"/>
          </div>

          <div className="icon group rotate-90">
            <ChartBarIcon className="h-5 group-hover:text-[#1d9bf0]"/>
          </div>
        </div>
      </div>
    </div>
  )
};

export default React.memo<PostProps>(Post);