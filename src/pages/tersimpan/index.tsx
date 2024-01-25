import Thread from "@/components/Thread";
import { useEffect, useState } from "react";
import CreateThreadModal from "@/components/CreateThreadModal";
import Layout from "@/components/Layout";
import axios from "axios";
import { toast } from "react-toastify";

interface Thread {
  createdAt: string;
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
}

export default function TersimpanPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookmarkedThreads, setBookmarkedThreads] = useState<Thread[]>([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        setUserId(userResponse.data.data.id);
      } catch (error) {
        console.error("Error fetching thread data", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const loadingToast = toast.loading("Loading...");
    setLoading(true);

    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        const userId = userResponse.data.data.id;

        const threadsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/threads`
        );

        const allThreads = threadsResponse.data.data;

        const bookmarked = allThreads.filter((thread: Thread) =>
          thread.bookmarks.includes(userId)
        );

        setBookmarkedThreads(bookmarked);

        toast.update(loadingToast, {
          render: "Success",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } catch (error) {
        if (error instanceof Error) {
          toast.update(loadingToast, {
            render: error.message,
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        } else {
          toast.update(loadingToast, {
            render: "Unknown error",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  return (
    <>
      {isModalOpen && (
        <CreateThreadModal
          onConfirm={() => {}}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
      <Layout>
        {!loading &&
          bookmarkedThreads.map((thread: Thread) => (
            <Thread
              key={thread._id}
              _id={thread._id}
              poster={thread.poster}
              title={thread.title}
              userId={userId}
              content={thread.content}
              createdAt={thread.createdAt}
              upvotes={thread.upvotes}
              downvotes={thread.downvotes}
              bookmarks={thread.bookmarks}
              replies={thread.replies}
              parents={thread.parents}
              __v={thread.__v}
            />
          ))}
      </Layout>
    </>
  );
}
