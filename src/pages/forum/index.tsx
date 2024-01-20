import Thread from "@/components/Thread";
import { useEffect, useState } from "react";
import CreateThreadModal from "@/components/CreateThreadModal";
import Layout from "@/components/Layout";
import axios from "axios";
import { toast } from "react-toastify";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    const loading = toast.loading("Loading...");
    setLoading(true);
    axios
      .get(process.env.NEXT_PUBLIC_API_URL + "/threads")
      .then((res) => {
        toast.update(loading, {
          render: "Success",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        console.log(res.data);
        setThreads(res.data);
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
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      {
        isModalOpen && (
          <CreateThreadModal
            onConfirm={() => {}}
            onCancel={() => setIsModalOpen(false)}
          />
        )
      }
      <Layout>
        <div className="w-full flex gap-3 items-center bg-white p-5 min-w-[200px] text shadow-md rounded-[12px] text-neutral-900">
          <div className="size-[44px] flex-shrink-0 bg-gradient-to-br from-blue-500 to bg-purple-400 rounded-full" />
          <button
            className="relative w-full h-full"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="outline outline-1 outline-neutral-300 w-full py-1 px-4 rounded-full text-neutral-600 h-full flex items-center transition duration-200 cursor-pointer hover:bg-neutral-200 active:bg-white select-none">
            Suarakan pendapatmu disini...
            </div>
          </button>
        </div>
        {loading ? (
          <>
            <div className="w-full h-[200px] bg-neutral-400 animate-pulse rounded-[12px]" />
            <div className="w-full h-[200px] bg-neutral-400 animate-pulse rounded-[12px]" />
            <div className="w-full h-[200px] bg-neutral-400 animate-pulse rounded-[12px]" />
          </>
        ) : (
          <>
            <Thread />
            <Thread />
            <Thread />
          </>
        )}
      </Layout></>
  );
}
