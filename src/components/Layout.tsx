import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

interface MenuLinkProps {
  label: string;
  path: string;
  active: string;
  icon: JSX.Element;
}
const MenuLink = (props: MenuLinkProps) => {
  const active = props.path === props.active;
  return (
    <Link href={props.path}>
      <div
        className={`p-3 min-w-[140px] lg:min-w-[217px] flex justify-start items-start rounded-[10px] font-semibold gap-3 transition duration-200 ${
          active
            ? "bg-blue-100 text-blue-500"
            : "bg-transparent text-neutral-500 hover:bg-neutral-100"
        }`}
      >
        {props.icon}
        <span>{props.label}</span>
      </div>
    </Link>
  );
};

const RefreshHandler = () => {
  window.location.reload();
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const [activePage, setActivePage] = useState("");
  const router = useRouter();

  useEffect(() => {
    setActivePage(router.pathname);
  }, [router]);

  return (
    <main className="bg-neutral-200 min-h-[200vh] flex pt-[60px] max-w-[1500px] mx-auto">
      <aside className="hidden md:flex flex-shrink-0 pt-12 px-5 bg-white min-h-screen flex-col items-start gap-2">
        <div className="sticky top-[100px]">
          <MenuLink
            label="Beranda"
            path="/"
            active={activePage}
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={activePage === "/" ? "#3563E9" : "#9E9E9E"}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.0427 3.15015L10.0431 3.14984C11.1274 2.27903 12.8676 2.28412 13.968 3.16072C13.9682 3.16082 13.9683 3.16093 13.9684 3.16103L20.5141 8.39754C20.5147 8.39801 20.5152 8.39847 20.5158 8.39893C20.893 8.7071 21.2197 9.18941 21.4305 9.74097C21.6411 10.2922 21.7196 10.8699 21.6463 11.3509L20.3874 18.8845C20.3873 18.8849 20.3872 18.8854 20.3871 18.8859C20.1375 20.3188 18.7433 21.5 17.3 21.5H6.70002C5.23555 21.5 3.87256 20.3476 3.623 18.8965C3.62294 18.8961 3.62288 18.8958 3.62282 18.8954L2.36319 11.3576L2.36299 11.3564C2.28085 10.8718 2.35458 10.2929 2.56471 9.74191C2.77482 9.19093 3.10555 8.70908 3.49187 8.40084L3.49273 8.40015L10.0427 3.15015ZM12 19.25C12.6862 19.25 13.25 18.6861 13.25 18V15C13.25 14.3139 12.6862 13.75 12 13.75C11.3139 13.75 10.75 14.3139 10.75 15V18C10.75 18.6861 11.3139 19.25 12 19.25Z"
                  fill={activePage === "/" ? "#3563E9" : "#9E9E9E"}
                  stroke={activePage === "/" ? "#3563E9" : "#9E9E9E"}
                />
              </svg>
            }
          />
          <MenuLink
            label="Forum"
            path="/forum"
            active={activePage}
            icon={
              <svg
                fill={activePage === "/forum" ? "#3563E9" : "#F5F5F5"}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  d="M7 18C6.71667 18 6.47933 17.904 6.288 17.712C6.09667 17.52 6.00067 17.2827 6 17V15H19V6H21C21.2833 6 21.521 6.096 21.713 6.288C21.905 6.48 22.0007 6.71733 22 7V19.575C22 20.025 21.796 20.3377 21.388 20.513C20.98 20.6883 20.6173 20.6173 20.3 20.3L18 18H7ZM6 13L3.7 15.3C3.38334 15.6167 3.02067 15.6877 2.612 15.513C2.20333 15.3383 1.99933 15.0257 2 14.575V3C2 2.71667 2.096 2.47933 2.288 2.288C2.48 2.09667 2.71733 2.00067 3 2H16C16.2833 2 16.521 2.096 16.713 2.288C16.905 2.48 17.0007 2.71733 17 3V12C17 12.2833 16.904 12.521 16.712 12.713C16.52 12.905 16.2827 13.0007 16 13H6Z"
                  fill={activePage === "/forum" ? "#3563E9" : "#9E9E9E"}
                />
              </svg>
            }
          />
          <MenuLink
            label="Terbaru"
            path="/terbaru"
            active={activePage}
            icon={
              <svg
                fill={activePage === "/terbaru" ? "#3563E9" : "#9E9E9E"}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <g clipPath="url(#clip0_132_1363)">
                  <path
                    d="M12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2ZM12 6C11.7348 6 11.4804 6.10536 11.2929 6.29289C11.1054 6.48043 11 6.73478 11 7V12C11.0001 12.2652 11.1055 12.5195 11.293 12.707L14.293 15.707C14.4816 15.8892 14.7342 15.99 14.9964 15.9877C15.2586 15.9854 15.5094 15.8802 15.6948 15.6948C15.8802 15.5094 15.9854 15.2586 15.9877 14.9964C15.99 14.7342 15.8892 14.4816 15.707 14.293L13 11.586V7C13 6.73478 12.8946 6.48043 12.7071 6.29289C12.5196 6.10536 12.2652 6 12 6Z"
                    fill={activePage === "/terbaru" ? "#3563E9" : "#9E9E9E"}
                  />
                </g>
                <defs>
                  <clipPath id="clip0_132_1363">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            }
          />
          <MenuLink
            label="Tersimpan"
            path="/tersimpan"
            active={activePage}
            icon={
              <svg
                fill={activePage === "/tersimpan" ? "#3563E9" : "#F5F5F5"}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 21V5C5 4.45 5.196 3.97933 5.588 3.588C5.98 3.19667 6.45067 3.00067 7 3H17C17.55 3 18.021 3.196 18.413 3.588C18.805 3.98 19.0007 4.45067 19 5V21L12 18L5 21Z"
                  fill={activePage === "/tersimpan" ? "#3563E9" : "#9E9E9E"}
                />
              </svg>
            }
          />
        </div>
      </aside>

      <section className="px-[3%] sm:px-5 lg:px-9 pt-[30px] md:pt-[40px] w-full flex flex-col gap-5 pb-20 max-w-[1000px]">
        {children}
      </section>

      <aside className="bg-white hidden sm:block h-fit mt-[30px] md:mt-[40px] text-black flex-shrink-0 font-semibold p-6 mr-4 rounded-[12px] shadow-md sticky top-[90px] md:top-[100px]">
        <h1 className="text-[18px] mb-5">Topik-Topik</h1>
        <div className="flex flex-col gap-2">
          <button
            className="min-w-[100px] lg:min-w-[175px] text-left flex gap-[10px] rounded-[5px] hover:bg-neutral-100 p-2"
            onClick={RefreshHandler}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M18 22C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V4C20 3.46957 19.7893 2.96086 19.4142 2.58579C19.0391 2.21071 18.5304 2 18 2H12V9L9.5 7.5L7 9V2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18Z"
                fill="#3563E9"
              />
            </svg>
            Pendidikan
          </button>
          <button
            className="min-w-[100px] lg:min-w-[175px] text-left flex gap-[10px] rounded-[5px] hover:bg-neutral-100 p-2"
            onClick={RefreshHandler}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M10.5 13H8V10H10.5V7.5H13.5V10H16V13H13.5V15.5H10.5V13ZM12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2Z"
                fill="#3563E9"
              />
            </svg>
            Kesehatan
          </button>
          <button
            className="min-w-[100px] lg:min-w-[175px] text-left flex gap-[10px] rounded-[5px] hover:bg-neutral-100 p-2"
            onClick={RefreshHandler}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M6.26 21.388H6C5.057 21.388 4.586 21.388 4.293 21.095C4 20.804 4 20.332 4 19.389V18.277C4 17.759 4 17.5 4.133 17.268C4.266 17.037 4.467 16.92 4.869 16.686C7.515 15.147 11.272 14.281 13.779 15.776C13.947 15.877 14.099 15.999 14.229 16.144C14.3633 16.2912 14.4668 16.4638 14.5333 16.6516C14.5998 16.8394 14.628 17.0387 14.6163 17.2376C14.6045 17.4365 14.553 17.631 14.4649 17.8097C14.3767 17.9884 14.2537 18.1476 14.103 18.278C13.9828 18.3922 13.8361 18.4747 13.676 18.518C13.796 18.504 13.911 18.488 14.021 18.471C14.932 18.326 15.697 17.838 16.397 17.309L18.205 15.944C18.5275 15.7094 18.9161 15.583 19.315 15.583C19.7139 15.583 20.1024 15.7094 20.425 15.944C20.998 16.377 21.174 17.09 20.811 17.672C20.388 18.35 19.792 19.217 19.22 19.747C18.647 20.277 17.794 20.751 17.098 21.087C16.326 21.46 15.474 21.674 14.607 21.815C12.849 22.099 11.017 22.055 9.277 21.697C8.28429 21.4929 7.27348 21.3887 6.26 21.388ZM6.586 2.586C6.219 2.953 6.082 3.459 6.031 4.25C6.61719 4.24197 7.1771 4.00547 7.59155 3.59084C8.00599 3.17621 8.24224 2.61619 8.25 2.03C7.46 2.082 6.953 2.219 6.586 2.586ZM17.414 2.586C17.047 2.219 16.541 2.082 15.75 2.031C15.758 2.61719 15.9945 3.1771 16.4092 3.59154C16.8238 4.00599 17.3838 4.24224 17.97 4.25C17.918 3.46 17.781 2.953 17.414 2.586ZM17.414 9.414C17.047 9.781 16.541 9.918 15.75 9.969C15.758 9.38281 15.9945 8.8229 16.4092 8.40845C16.8238 7.99401 17.3838 7.75776 17.97 7.75C17.918 8.54 17.781 9.047 17.414 9.414ZM6.586 9.414C6.953 9.781 7.459 9.918 8.25 9.969C8.24197 9.38281 8.00547 8.8229 7.59084 8.40845C7.17621 7.99401 6.61619 7.75776 6.03 7.75C6.082 8.54 6.219 9.047 6.586 9.414Z"
                fill="#3563E9"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 5.75C6.99456 5.75 7.94839 5.35491 8.65165 4.65165C9.35491 3.94839 9.75 2.99456 9.75 2H14.25C14.25 2.99456 14.6451 3.94839 15.3483 4.65165C16.0516 5.35491 17.0054 5.75 18 5.75V6.25C17.0054 6.25 16.0516 6.64509 15.3483 7.34835C14.6451 8.05161 14.25 9.00544 14.25 10H9.75C9.75 9.00544 9.35491 8.05161 8.65165 7.34835C7.94839 6.64509 6.99456 6.25 6 6.25V5.75ZM12 7C12.2652 7 12.5196 6.89464 12.7071 6.70711C12.8946 6.51957 13 6.26522 13 6C13 5.73478 12.8946 5.48043 12.7071 5.29289C12.5196 5.10536 12.2652 5 12 5C11.7348 5 11.4804 5.10536 11.2929 5.29289C11.1054 5.48043 11 5.73478 11 6C11 6.26522 11.1054 6.51957 11.2929 6.70711C11.4804 6.89464 11.7348 7 12 7Z"
                fill="#3563E9"
              />
            </svg>
            Ekonomi
          </button>
        </div>
      </aside>
    </main>
  );
}
