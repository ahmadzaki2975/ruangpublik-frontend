import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PostDateFormat from "./PostDateFormat";

interface Thread {
  createdAt: string;
  _id: string;
  userId: string;
  parents: string[];
  title: string;
  content: string;
  poster: {
    _id: string;
    username: string;
  };
  replies: string[];
  upvotes: string[];
  handleRefetch: () => void;
  bookmarks: string[];
  downvotes: string[];
  __v: number;
}

export default function Reply(props: Thread) {
  const router = useRouter();
  const [upvoted, setUpvoted] = useState(props.upvotes.includes(props.userId));
  const [downvoted, setDownvoted] = useState(props.downvotes.includes(props.userId));
  const [upvoteCount, setUpvoteCount] = useState(props.upvotes.length ?? 0);

  const handleUpvote = async () => {
    setUpvoted(!upvoted);
    if (downvoted) {
      setDownvoted(false);
      setUpvoteCount((prev) => prev + 1);
    } else if (upvoted) {
      setUpvoteCount((prev) => prev - 1);
    } else {
      setUpvoteCount((prev) => prev + 1);
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/threads/${props._id}/vote`,
        { upvote: true },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Upvote successful", response.data);
    } catch (error) {
      console.error("Error while upvoting", error);
    }
  };

  const handleDownvote = async () => {
    if (upvoted) {
      setUpvoted(false);
      setUpvoteCount((prev) => prev - 1);
    }
    setDownvoted(!downvoted);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/threads/${props._id}/vote`,
        { upvote: false },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Downvote successful", response.data);
      props.handleRefetch();
    } catch (error) {
      console.error("Error while downvoting", error);
    }
  };

  return (
    <>
      <div className="w-full h-[1px] bg-neutral-200 my-4"></div>
      <div
        className="flex flex-col gap-4"
        onClick={() => router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/thread/${props._id}`)}
      >
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[14px] items-center">
                <div className="flex gap-2 text-[14px] items-center">
                  <div className="size-[32px] flex-shrink-0 bg-gradient-to-br from-blue-500 to bg-purple-400 rounded-full" />
                  <span className="text-neutral-900">{props.poster.username}</span>
                  <span className="text-neutral-500 ">•</span>
                  <span className="text-neutral-500  ">
                    {<PostDateFormat tanggalPost={props.createdAt} />}
                  </span>
                </div>
              </div>

              <div className="text-neutral-900 mt-1">
                <span>{props.content}</span>
              </div>
            </div>
          </div>
        </div>
        <section className="flex justify-between">
          <div className="flex gap-3">
            <button
              className={`px-3 sm:px-5 py-1  outline outline-1 rounded-full flex gap-2 items-center font-semibold ${
                upvoted
                  ? "text-blue-500 outline-blue-300 bg-blue-200 hover:bg-blue-300"
                  : "text-neutral-500 hover:bg-neutral-300 outline-neutral-300 bg-neutral-200"
              } `}
              onClick={handleUpvote}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="16"
                viewBox="0 0 13 16"
                fill={upvoted ? "#3563E9" : "#9E9E9E"}
              >
                <path d="M8.98724 16H4.01275V7.91919H0L6.5 0L13 7.91919H8.98724V16Z" />
              </svg>
              {upvoteCount}
            </button>
            <button
              className={`px-5 py-1  outline outline-1  rounded-full flex gap-2 items-center font-semibold ${
                downvoted
                  ? "text-red-500 outline-red-300 hover:bg-red-300 bg-red-200"
                  : "text-neutral-500 outline-neutral-300 hover:bg-neutral-300 bg-neutral-200"
              } `}
              onClick={handleDownvote}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="16"
                viewBox="0 0 13 16"
                fill={downvoted ? "#FF0000" : "#9E9E9E"}
              >
                <path d="M4.01276 1.67984e-07L8.98725 6.02868e-07L8.98725 8.08081L13 8.08081L6.5 16L6.92318e-07 8.08081L4.01276 8.08081L4.01276 1.67984e-07Z" />
              </svg>
            </button>
          </div>
        </section>
      </div>
      <div className="w-full h-[1px] bg-neutral-200 my-4"></div>
    </>
  );
}
