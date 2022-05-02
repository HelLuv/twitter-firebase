import * as React from 'react';
import Image from "next/image";
import {DotsHorizontalIcon} from "@heroicons/react/outline";

interface TrendingProps {
  result: any;
}

const Trending: React.FC<TrendingProps> = ({result}) => {
  // TODO: Trending
  return (
    <div
      className="hover:bg-white hover:bg-opacity-[0.03]
                 px-4 py-2 cursor-pointer transition
                 duration-200 ease-out flex items-center justify-between">
      <div className="space-y-0.5">
        <p className="text-[#6e767d] text-xs font-medium">{result.heading}</p>
        <h6 className="font-bold max-w-[250px] text-sm">{result.description}</h6>
        <p className="text-[#6e767d] text-xs font-medium max-w-[250px]">
          Trending with {" "}
          {result.tags.map((tag: string, index: number) => (
            <span className="tag" key={index}>
              {tag}
            </span>
          ))}
        </p>
      </div>
      {/*{result.img ? (*/}
      {/*  <img*/}
      {/*    src={result.userImg || ""}*/}
      {/*    width={50}*/}
      {/*    height={50}*/}
      {/*    className="rounded-full object-cover"*/}
      {/*    alt="trending image"*/}
      {/*  />*/}
      {/*) : (*/}
      <div className="icon group">
        <DotsHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]"/>
      </div>
      {/*)}*/}
    </div>
  )
};

export default React.memo<TrendingProps>(Trending);