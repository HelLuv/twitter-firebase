import * as React from 'react';
import {CalendarIcon, ChartBarIcon, EmojiHappyIcon, PhotographIcon, XIcon} from "@heroicons/react/outline";
import {addDoc, collection, doc, serverTimestamp, updateDoc} from "@firebase/firestore";
import {getDownloadURL, ref, uploadString} from "@firebase/storage";
import {useSession} from "next-auth/react";
import {EmojiData, Picker} from 'emoji-mart';
import "emoji-mart/css/emoji-mart.css";

import {db, storage} from "../../firebase";

interface InputProps {

}

const Input: React.FC<InputProps> = ({}) => {
  const {data: session} = useSession();
  const [input, setInput] = React.useState<string>("");
  const [selectedFile, setSelectedFile] = React.useState<string | null>(null);
  const [isShowEmojis, setIsShowEmojis] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const filePickerRef = React.useRef<HTMLInputElement>(null);

  const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }

  const addImageToPost = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (e.target.files?.length) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target?.result as string);
    }
  }

  const addEmoji = (e: EmojiData) => {
    // @ts-ignore
    const sym = e.unified.split("-");
    const codesArray: string[] = [];

    sym.forEach((el: string) => codesArray.push("0x" + el));
    // @ts-ignore
    const emoji = String.fromCodePoint(...codesArray);

    setInput(input + emoji);
  }

  const sendPost = async () => {
    if (isLoading) return;

    setIsLoading(true);

    const docRef = await addDoc(collection(db, 'posts'), {
      id: session?.user?.uid,
      username: session?.user?.name,
      userImg: session?.user?.image,
      tag: session?.user.tag,
      text: input,
      timestamp: serverTimestamp(),
    });

    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    if (selectedFile) {
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
      });
    }

    setIsLoading(false);
    setInput("");
    setSelectedFile(null);
    setIsShowEmojis(false);
  };

  return (
    <div className={`border-b border-gray-700 p-3 flex space-x-3 overflow-y-scroll scrollbar-hide
    ${isLoading && "opacity-60"}
    `}>
      <img
        className="h-11 w-11 rounded-full cursor-pointer"
        src={session?.user.image!}
        alt="profile image"
      />
      <div className="w-full divide-y divide-gray-700">
        <div className={`${selectedFile && "pb-7"} ${input && "space-y-2.5"}`}>
          <textarea
            value={input}
            rows={2}
            onChange={e => onInputChange(e)}
            placeholder="What's poppin?"
            className="bg-transparent outline-none text-[#d9d9d9] text-lg
             placeholder-gray-500 tracking-wide w-full min-h-[50px]"
          />

          {selectedFile && (
            <div className="relative">
              <div className="absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26]
                    bg-opacity-75 rounded-full flex items-center justify-center top-1
                    left-1 cursor-pointer"
                   onClick={() => setSelectedFile(null)}>
                <XIcon className="text-white h-5"/>
              </div>
              <img
                src={selectedFile}
                alt="uploaded image"
                className="rounded-2xl max-h-80 object-contain"/>
            </div>
          )}
        </div>

        {!isLoading &&
            <div className="flex items-center justify-between pt-2.5">
                <div className="flex items-center">
                    <div
                        className="icon"
                        onClick={() => filePickerRef.current?.click()}
                    >
                        <PhotographIcon className="text-[#1d9bf0] h-[22px]"/>
                        <input
                            type="file"
                            ref={filePickerRef}
                            onChange={addImageToPost}
                            hidden
                        />
                    </div>

                    <div className="icon rotate-90">
                        <ChartBarIcon className="text-[#1d9bf0] h-[22px]"/>
                    </div>

                    <div className="icon" onClick={() => setIsShowEmojis(!isShowEmojis)}>
                        <EmojiHappyIcon className="text-[#1d9bf0] h-[22px]"/>
                    </div>

                    <div className="icon">
                        <CalendarIcon className="text-[#1d9bf0] h-[22px]"/>
                    </div>

                  {isShowEmojis && (
                    <Picker
                      onSelect={addEmoji}
                      style={{
                        position: "absolute",
                        marginTop: "465px",
                        marginLeft: -40,
                        maxWidth: "320px",
                        borderRadius: "20px",
                      }}
                      theme="dark"
                    />
                  )}
                </div>

                <button className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md
          hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default"
                        disabled={!input?.trim() && !selectedFile}
                        onClick={sendPost}
                >
                    Tweet
                </button>
            </div>
        }
      </div>
    </div>
  )
};

export default React.memo<InputProps>(Input);