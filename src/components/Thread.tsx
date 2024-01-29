import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

import Reply from "./Reply";
import PostDateFormat from "./PostDateFormat";
import ShareThreadModal from "./Share";

interface Thread {
  userId: string;
  _id: string;
  parents: string[];
  title: string;
  content: string;
  poster: {
    _id: string;
    username: string;
  };
  replies: string[];
  upvotes: string[];
  bookmarks: string[];
  downvotes: string[];
  __v: number;
  createdAt: string;
}

interface Reply extends Thread {}

export default function Thread(props: Thread) {
  const [showAll, setShowAll] = useState(false);
  const [comment, setComment] = useState("");
  const [showReply, setShowReply] = useState(false);
  const [replies, setReplies] = useState<Thread[]>([]);
  const [trigger, setTrigger] = useState(false);

  const [upvoted, setUpvoted] = useState(props.upvotes.includes(props.userId));
  const [downvoted, setDownvoted] = useState(props.downvotes.includes(props.userId));
  const [bookmarked, setBookmarked] = useState(props.bookmarks.includes(props.userId));

  const [upvoteCount, setUpvoteCount] = useState(props.upvotes.length ?? 0);
  const [bookmarkCount, setBookmarkCount] = useState(props.bookmarks.length ?? 0);
  

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const router = useRouter();

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const repliesResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/threads/${props._id}/reply`
        );

        setReplies(repliesResponse.data.data);
      } catch (error) {
        console.error("Error fetching replies", error);
      }
    };

    fetchReplies();
  }, [props._id, trigger]);

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
    setDownvoted(!downvoted);
    if (upvoted) {
      setUpvoted(false);
      setUpvoteCount((prev) => prev - 1);
    }

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
    } catch (error) {
      console.error("Error while downvoting", error);
    }
  };

  const handleBookmark = async () => {
    setBookmarked(!bookmarked);
    if (bookmarked) {
      setBookmarkCount((prev) => prev - 1);
    } else {
      setBookmarkCount((prev) => prev + 1);
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/threads/${props._id}/bookmark`,
        null,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      console.log("Bookmark successful", response.data);
    } catch (error) {
      console.error("Error while toggling bookmark", error);
      setBookmarked(!bookmarked);
    }
  };

  const toggleReply = () => {
    setShowReply(!showReply);
  };

  return (
    <>
      <div className="w-full bg-white p-5 min-w-[200px] min-h-[200px] text shadow-md rounded-[12px] text-neutral-900">
        <section className="flex items-center gap-3">
          <div className="size-[44px] flex-shrink-0 bg-gradient-to-br from-blue-500 to bg-purple-400 rounded-full" />
          <div className="flex gap-[13px] items-start">
            <div className="flex flex-col">
              <h1 className="text-[14px] md:text-[16px] font-semibold tracking-[-0.32px] leading-[100%]">
                {props.poster.username}
              </h1>
              <h2 className="text-[14px] mt-[2px] text-neutral-500">
                {<PostDateFormat tanggalPost={props.createdAt} />}
              </h2>
            </div>
            <div className="rounded-full w-max flex-shrink-0 bg-success-100 text-[12px] text-success-700 px-3 py-1">
              Akun Resmi
            </div>
          </div>
        </section>

        <section className="mt-[10px]">
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-[14.5px] md:text-[18px]">{props.title}</h1>
            <div className="bg-neutral-300 text-[12px] px-3 rounded-[4px]">Draf</div>
          </div>
          <p className="font-medium mt-[5px] text-[14px] md:text-[16px] max-w-[600px]">
            {showAll ? props.content : props.content.slice(0, 25)}
            {!showAll && (
              <span onClick={() => setShowAll(true)} className="text-neutral-500 cursor-pointer">
                &nbsp;...Lihat Selengkapnya
              </span>
            )}
          </p>
          <div>
            <iframe
              src="https://drive.google.com/file/d/1jYX9Ajahy0Fu-koWgLgzYGNSJBIGtxp_/preview"
              className="w-full mt-4"
              width="640"
              height="480"
              allow="autoplay"
            ></iframe>
          </div>
        </section>

        <section className="mt-3 flex justify-between h-[40px]">
          <div className="flex gap-3">
            <button
              className={`px-3 sm:px-5 py-1 sm:py-2 outline outline-1 rounded-full flex gap-2 items-center font-semibold ${
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
              className={`px-5 py-1 sm:py-2 outline outline-1  rounded-full flex gap-2 items-center font-semibold ${
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
            <button
              className={`px-5 py-1 sm:py-2 outline outline-1 outline-neutral-300 bg-neutral-200 rounded-full flex gap-2 items-center font-semibold s"text-neutral-500"
      } hover:bg-neutral-300 text-neutral-500`}
              onClick={() => {
                setShowReply(true);
                const currentPosition = window.scrollY;
                const newPosition = currentPosition + 200;
                window.scrollTo({
                  top: newPosition,
                  behavior: "smooth",
                });
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="#9E9E9E"
              >
                <path d="M5.95 17C5.72457 17 5.50837 16.9104 5.34896 16.751C5.18955 16.5916 5.1 16.3754 5.1 16.15V13.6H1.7C1.24913 13.6 0.81673 13.4209 0.497918 13.1021C0.179107 12.7833 0 12.3509 0 11.9V1.7C0 1.24913 0.179107 0.81673 0.497918 0.497918C0.81673 0.179107 1.24913 0 1.7 0H15.3C15.7509 0 16.1833 0.179107 16.5021 0.497918C16.8209 0.81673 17 1.24913 17 1.7V11.9C17 12.3509 16.8209 12.7833 16.5021 13.1021C16.1833 13.4209 15.7509 13.6 15.3 13.6H10.115L6.97 16.7535C6.8 16.915 6.5875 17 6.375 17H5.95Z" />
              </svg>
              {props.replies?.length ?? 0}
            </button>
          </div>
          <div className="flex flex-row gap-3">
            <button
              className={`px-3 sm:px-5 py-1 sm:py-2 outline outline-1 rounded-full flex gap-2 items-center font-semibold ${
                bookmarked
                  ? "text-blue-500 outline-blue-300 bg-blue-200 hover:bg-blue-300"
                  : "text-neutral-500 hover:bg-neutral-300 outline-neutral-300 bg-neutral-200"
              } `}
              onClick={handleBookmark}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="14"
                viewBox="0 0 11 14"
                fill={bookmarked ? "#3563E9" : "#9E9E9E"}
              >
                <path d="M0.25 13.5V1.5C0.25 1.0875 0.397 0.7345 0.691 0.441C0.985 0.1475 1.338 0.0005 1.75 0H9.25C9.6625 0 10.0158 0.147 10.3098 0.441C10.6038 0.735 10.7505 1.088 10.75 1.5V13.5L5.5 11.25L0.25 13.5Z" />
              </svg>
              {bookmarkCount}
            </button>
            <button
              className="px-5 py-1 sm:py-2 outline outline-1 outline-neutral-300 bg-neutral-200 rounded-full flex gap-2 items-center font-semibold text-neutral-500 hover:bg-neutral-300"
              onClick={handleOpenModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M18 9.6C18.731 9.60002 19.4447 9.37752 20.0461 8.96208C20.6476 8.54663 21.1083 7.95794 21.367 7.27428C21.6258 6.59063 21.6703 5.8444 21.4946 5.13484C21.3189 4.42528 20.9314 3.78601 20.3836 3.30204C19.8358 2.81807 19.1536 2.51233 18.4278 2.42549C17.702 2.33865 16.9669 2.47482 16.3204 2.81588C15.6739 3.15695 15.1465 3.68676 14.8084 4.33485C14.4702 4.98293 14.3374 5.71859 14.4276 6.444L8.4996 9.408C7.99107 8.91762 7.34951 8.5877 6.65483 8.45933C5.96014 8.33096 5.24304 8.40982 4.59286 8.68608C3.94267 8.96234 3.38813 9.42379 2.99832 10.013C2.60852 10.6021 2.40067 11.293 2.40067 11.9994C2.40067 12.7058 2.60852 13.3967 2.99832 13.9858C3.38813 14.575 3.94267 15.0365 4.59286 15.3127C5.24304 15.589 5.96014 15.6678 6.65483 15.5395C7.34951 15.4111 7.99107 15.0812 8.4996 14.5908L14.4276 17.5548C14.3226 18.3975 14.5189 19.2502 14.9817 19.9621C15.4446 20.6741 16.1442 21.1995 16.957 21.4456C17.7698 21.6916 18.6434 21.6423 19.4234 21.3066C20.2034 20.9708 20.8396 20.3701 21.2195 19.6106C21.5995 18.8512 21.6987 17.9818 21.4997 17.1563C21.3007 16.3307 20.8163 15.6021 20.132 15.0992C19.4477 14.5962 18.6077 14.3514 17.7604 14.4079C16.9131 14.4644 16.113 14.8187 15.5016 15.408L9.57359 12.444C9.60991 12.1491 9.60991 11.8509 9.57359 11.556L15.5016 8.592C16.1472 9.216 17.028 9.6 18 9.6Z"
                  fill="#9E9E9E"
                />
              </svg>
              <span className="hidden sm:block">Share</span>
            </button>
          </div>
        </section>
        <section className="mt-4 font-medium text-neutral-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-[38px] flex-shrink-0 bg-gradient-to-br from-blue-500 to bg-purple-400 rounded-full" />

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const loading = toast.loading("Mengirim komentar...");
                axios
                  .post(
                    process.env.NEXT_PUBLIC_API_URL + `/threads/${props._id}/reply`,
                    {
                      content: comment,
                    },
                    {
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${Cookies.get("accessToken")}`,
                      },
                    }
                  )
                  .then(() => {
                    toast.update(loading, {
                      render: "Komentar berhasil dikirim",
                      type: "success",
                      isLoading: false,
                      autoClose: 3000,
                    });
                    setComment("");
                    setTrigger((prev) => !prev);
                    router.push(`/thread/${props._id}`);
                  })
                  .catch((err: unknown) => {
                    if (err instanceof Error) {
                      toast.update(loading, {
                        render: err.message,
                        type: "error",
                        isLoading: false,
                        autoClose: 3000,
                      });
                    } else {
                      toast.update(loading, {
                        render: "Unknown error",
                        type: "error",
                        isLoading: false,
                        autoClose: 3000,
                      });
                    }
                  });
              }}
              className="relative w-full h-full"
            >
              <input
                className="outline outline-1 outline-neutral-300 w-full py-2 px-4 rounded-full text-neutral-600 h-full flex items-center transition duration-200 cursor-pointer hover:bg-neutral-200 active:bg-white select-none"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                placeholder="Tulis pendapatmu di sini..."
              />
            </form>
          </div>

          <button className="flex items-center justify-center mt-4 gap-2" onClick={toggleReply}>
            <span>Lihat Diskusi</span>
            <div
              className={`rounded-full bg-neutral-400 p-[1.5px] transition-transform transform ${
                showReply ? "rotate-180" : "rotate-0"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 9 9"
                fill="none"
              >
                <path
                  d="M4.30607 3.02498L1.46143 6.01052C1.41394 6.06033 1.38745 6.12652 1.38745 6.19534C1.38745 6.26416 1.41394 6.33035 1.46143 6.38016L1.46464 6.38338C1.48767 6.40761 1.51538 6.42691 1.54609 6.44009C1.5768 6.45328 1.60988 6.46008 1.64331 6.46008C1.67673 6.46008 1.70981 6.45328 1.74052 6.44009C1.77123 6.42691 1.79894 6.40761 1.82197 6.38338L4.50054 3.57195L7.17804 6.38338C7.20106 6.40761 7.22877 6.42691 7.25948 6.44009C7.2902 6.45328 7.32327 6.46008 7.3567 6.46008C7.39012 6.46008 7.4232 6.45328 7.45391 6.44009C7.48463 6.42691 7.51234 6.40761 7.53536 6.38338L7.53857 6.38016C7.58606 6.33035 7.61255 6.26417 7.61255 6.19534C7.61255 6.12652 7.58606 6.06034 7.53857 6.01052L4.69393 3.02498C4.66891 2.99873 4.63883 2.97782 4.60549 2.96354C4.57216 2.94926 4.53627 2.9419 4.5 2.9419C4.46374 2.9419 4.42785 2.94926 4.39451 2.96354C4.36118 2.97782 4.33109 2.99873 4.30607 3.02498Z"
                  fill="#404040"
                />
              </svg>
            </div>
          </button>
          {showReply &&
            replies.map((reply: Reply) => (
              <Reply
                key={reply._id}
                _id={reply._id}
                userId={props.userId}
                parents={reply.parents}
                poster={reply.poster}
                title={reply.title}
                content={reply.content}
                createdAt={reply.createdAt}
                upvotes={reply.upvotes}
                downvotes={reply.downvotes}
                bookmarks={reply.bookmarks}
                replies={reply.replies}
                __v={reply.__v}
              />
            ))}
        </section>
      </div>
      <ShareThreadModal isOpen={isModalOpen} onClose={handleCloseModal} threadId={props._id} />
    </>
  );
}
