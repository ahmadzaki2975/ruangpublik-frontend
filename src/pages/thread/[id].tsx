import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Thread from "../../components/Thread";
import { toast } from "react-toastify";
import Layout from "@/components/Layout";
import Cookies from "js-cookie";

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

export default function ThreadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [thread, setThread] = useState<Thread | null>(null);
  const [userId, setUserId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const { id } = router.query;

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        });

        setUserId(userResponse.data.data.id);
        
        // Kudu difix ini
        setIsAdmin(userResponse.data.data.role === "admin");
        console.log(userResponse.data.data.role === "admin");
        //=================================================================

      } catch (error) {
        console.error("Error fetching thread data", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (id) {
      const loadingToast = toast.loading("Loading...");
      setLoading(true);

      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/threads/${id}`)
        .then((res) => {
          toast.update(loadingToast, {
            render: "Success",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });

          setThread(res.data.data);
        })
        .catch((err: unknown) => {
          if (err instanceof Error) {
            toast.update(loadingToast, {
              render: err.message,
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
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  if (!thread) {
    return <p>Thread not found</p>;
  }

  return (
    <Layout>
      {loading && (
        <>
          <div className="w-full h-[600px] bg-neutral-400 animate-pulse rounded-[12px]" />
        </>
      )}
      {!loading && (
        <Thread
          key={thread._id}
          _id={thread._id}
          poster={thread.poster}
          title={thread.title}
          userId={userId}
          isAdmin={isAdmin}
          content={thread.content}
          createdAt={thread.createdAt}
          upvotes={thread.upvotes}
          downvotes={thread.downvotes}
          bookmarks={thread.bookmarks}
          replies={thread.replies}
          parents={thread.parents}
          __v={thread.__v}
        />
      )}
    </Layout>
  );
}
