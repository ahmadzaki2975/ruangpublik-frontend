import { useState } from "react";
import PrimaryButton from "./PrimaryButton";
import axios from "axios";
import Cookies from "js-cookie";

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ onConfirm = () => {}, onCancel = () => {} }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handlePostThread = async () => {
    try {
      // const formData = new FormData();
      // formData.append("title", title);
      // formData.append("content", content);
      // console.log(formData);
      // if (file) {
      //   formData.append("file", file);
      // }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/threads`,
        { title, content },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      if (response.status === 201) {
        console.log("Thread posted successfully", response.data);
        onConfirm();
        setFile(null);
        setTitle("");
        setContent("");
      } else {
        console.error("Error while posting thread. Status:", response.status);
      }
    } catch (error) {
      console.error("Error while posting thread", error);
    }
  };

  return (
    <main className="w-screen h-screen fixed top-0 bg-black bg-opacity-70 grid place-items-center z-[100]">
      <div className="absolute w-full h-full z-[1]" onClick={() => onCancel()} />
      <section className="bg-white text-black p-5 pt-12 rounded-[5px] relative z-[2]">
        <button className="absolute top-0 right-0 mt-2 mr-5" onClick={() => onCancel()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="33"
            height="33"
            viewBox="0 0 33 33"
            fill="none"
          >
            <g clip-path="url(#clip0_287_3422)">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.4999 19.4177L23.7916 26.7093C24.1785 27.0963 24.7033 27.3136 25.2504 27.3136C25.7976 27.3136 26.3224 27.0963 26.7093 26.7093C27.0962 26.3224 27.3136 25.7977 27.3136 25.2505C27.3136 24.7033 27.0962 24.1785 26.7093 23.7916L19.4149 16.5L26.7079 9.20834C26.8994 9.01676 27.0513 8.78934 27.1549 8.53906C27.2585 8.28878 27.3118 8.02054 27.3117 7.74967C27.3117 7.4788 27.2583 7.21059 27.1545 6.96036C27.0508 6.71012 26.8988 6.48277 26.7073 6.29128C26.5157 6.09979 26.2882 5.94791 26.038 5.84431C25.7877 5.74071 25.5195 5.68742 25.2486 5.68748C24.9777 5.68755 24.7095 5.74096 24.4593 5.84468C24.209 5.9484 23.9817 6.10039 23.7902 6.29197L16.4999 13.5836L9.20832 6.29197C9.01815 6.09489 8.79064 5.93766 8.53906 5.82945C8.28748 5.72124 8.01686 5.66422 7.74301 5.66171C7.46915 5.6592 7.19754 5.71126 6.94402 5.81484C6.6905 5.91843 6.46015 6.07146 6.2664 6.26503C6.07266 6.45859 5.9194 6.6888 5.81558 6.94222C5.71175 7.19564 5.65944 7.46721 5.66169 7.74106C5.66394 8.01492 5.72071 8.28559 5.82868 8.53727C5.93665 8.78896 6.09367 9.01662 6.29057 9.20697L13.5849 16.5L6.29194 23.793C6.09505 23.9833 5.93803 24.211 5.83006 24.4627C5.72208 24.7143 5.66532 24.985 5.66307 25.2589C5.66082 25.5327 5.71313 25.8043 5.81695 26.0577C5.92078 26.3111 6.07403 26.5413 6.26778 26.7349C6.46152 26.9285 6.69187 27.0815 6.94539 27.1851C7.19892 27.2887 7.47053 27.3407 7.74438 27.3382C8.01824 27.3357 8.28885 27.2787 8.54043 27.1705C8.79202 27.0623 9.01953 26.905 9.20969 26.708L16.4999 19.4177Z"
                fill="black"
              />
            </g>
            <defs>
              <clipPath id="clip0_287_3422">
                <rect width="33" height="33" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </button>
        <form className="min-w-[200px] flex flex-col gap-4">
          <label className="flex items-center gap-3">
            <div className="size-[70px] flex-shrink-0 bg-gradient-to-br from-blue-500 to bg-purple-400 rounded-full" />
            <div className="flex flex-col justify-start">
              <p className="text-[16px] font-semibold">Judul</p>
              <input
                className="min-w-[500px] bg-neutral-200 rounded-[8px] focus:outline-neutral-300 px-4 py-3"
                placeholder="Masukkan Judul"
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </label>

          <textarea
            className="w-full bg-neutral-200 rounded-[8px] focus:outline-neutral-300 px-4 py-3 min-h-[150px] max-h-[250px]"
            placeholder="Jelaskan lebih lanjut tentang postingan anda"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div>
            {file ? (
              <div className="flex justify-between items-center bg-blue-100 px-4 py-2 rounded-[8px] relative text-blue-500">
                <p className="text-[14px]">{file.name}</p>
                <button onClick={() => setFile(null)} className="underline text-[14px]">
                  Hapus
                </button>
              </div>
            ) : (
              <label htmlFor="dokumen" className="flex items-center gap-3 cursor-pointer">
                <input
                  id="dokumen"
                  name="dokumen"
                  type="file"
                  className="hidden"
                  accept="application/pdf"
                  onChange={(e) => {
                    if (e.target.files) {
                      setFile(e.target.files[0]);
                    }
                  }}
                />
                <div
                  onDragEnter={() => setDragging(true)}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setFile(e.dataTransfer.files[0]);
                    setDragging(false);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  className={`
                w-full h-[150px] bg-blue-100 rounded-[8px] outline-dashed outline-blue-400 text-blue-500 flex flex-col justify-center items-center
                ${dragging && "bg-blue-200"}
                `}
                >
                  <div className={dragging ? "animate-bounce" : ""}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="35"
                      height="35"
                      viewBox="0 0 35 35"
                      fill="none"
                    >
                      <path
                        d="M6.01562 30.625C5.00034 30.625 4.02664 30.2217 3.30873 29.5038C2.59082 28.7859 2.1875 27.8122 2.1875 26.7969V21.3281C2.1875 20.893 2.36035 20.4757 2.66803 20.168C2.9757 19.8604 3.393 19.6875 3.82812 19.6875C4.26325 19.6875 4.68055 19.8604 4.98822 20.168C5.2959 20.4757 5.46875 20.893 5.46875 21.3281V26.7969C5.46875 27.0988 5.71375 27.3438 6.01562 27.3438H28.9844C29.1294 27.3438 29.2685 27.2861 29.3711 27.1836C29.4736 27.081 29.5312 26.9419 29.5312 26.7969V21.3281C29.5312 20.893 29.7041 20.4757 30.0118 20.168C30.3195 19.8604 30.7368 19.6875 31.1719 19.6875C31.607 19.6875 32.0243 19.8604 32.332 20.168C32.6396 20.4757 32.8125 20.893 32.8125 21.3281V26.7969C32.8125 27.8122 32.4092 28.7859 31.6913 29.5038C30.9734 30.2217 29.9997 30.625 28.9844 30.625H6.01562Z"
                        fill="#3563E9"
                      />
                      <path
                        d="M25.7687 10.325C25.921 10.4772 26.0417 10.658 26.1241 10.8569C26.2065 11.0558 26.2489 11.269 26.2489 11.4843C26.2489 11.6996 26.2065 11.9128 26.1241 12.1118C26.0417 12.3107 25.921 12.4915 25.7687 12.6437C25.6165 12.796 25.4357 12.9167 25.2368 12.9991C25.0379 13.0815 24.8246 13.1239 24.6093 13.1239C24.394 13.1239 24.1808 13.0815 23.9819 12.9991C23.783 12.9167 23.6022 12.796 23.45 12.6437L19.1406 8.33651V20.7812C19.1406 21.2163 18.9677 21.6336 18.6601 21.9413C18.3524 22.249 17.9351 22.4218 17.5 22.4218C17.0648 22.4218 16.6475 22.249 16.3399 21.9413C16.0322 21.6336 15.8593 21.2163 15.8593 20.7812V8.33651L11.55 12.6437C11.3977 12.796 11.217 12.9167 11.018 12.9991C10.8191 13.0815 10.6059 13.1239 10.3906 13.1239C10.1753 13.1239 9.96206 13.0815 9.76313 12.9991C9.56421 12.9167 9.38346 12.796 9.2312 12.6437C9.07895 12.4915 8.95818 12.3107 8.87578 12.1118C8.79339 11.9128 8.75098 11.6996 8.75098 11.4843C8.75098 11.269 8.79339 11.0558 8.87578 10.8569C8.95818 10.658 9.07895 10.4772 9.2312 10.325L16.3406 3.21558C16.4928 3.06319 16.6735 2.94229 16.8724 2.85981C17.0714 2.77732 17.2846 2.73486 17.5 2.73486C17.7153 2.73486 17.9286 2.77732 18.1275 2.85981C18.3264 2.94229 18.5072 3.06319 18.6593 3.21558L25.7687 10.325Z"
                        fill="#3563E9"
                      />
                    </svg>
                  </div>
                  <div>
                    <h1 className="font-bold text-center">Upload Dokumen</h1>
                    <p className="text-center">Pilih atau letakkan file di sini</p>
                  </div>
                </div>
              </label>
            )}
          </div>

          <PrimaryButton
            className="w-fit text-white text-[16px]"
            onClick={handlePostThread}
            text="Posting"
          />
        </form>
      </section>
    </main>
  );
}
