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

interface PostProps {
  id: string;
  post: any;
  isPostPage?: boolean;
}

const Post: React.FC<PostProps> = ({post, id, isPostPage}) => {
  const {data: session} = useSession();
  const [comments, setComments] = React.useState([]);
  const [likes, setLikes] = React.useState([]);
  const [isLiked, setIsLiked] = React.useState(false);

  const handlePostOpen = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  };

  const handlePostComment = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  };

  const handlePostDelete = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  };

  const handlePostLike = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  };

  return (
    <div
      className="p-3 flex cursor-pointer border-b border-gray-700"
      onClick={(e) => handlePostOpen(e)}
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
        <img
          src={post?.image}
          alt="post image"
          className="rounded-2xl max-h-[700px] object-cover mr-2"
        />
        <div className={`text-[#6e767d] flex justify-between w-10/12 ${isPostPage && "mx-auto"}`}
        >
          <div
            className="flex items-center space-x-1 group"
            onClick={(e) => handlePostComment(e)}
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
              onClick={(e) => handlePostDelete(e)}
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
            onClick={(e) => handlePostLike(e)}
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