import Logo from "@/../public/Logo.png";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Account from "@/../public/svgs/account.svg";
import searchAtom from "@/atoms/searchAtom";
import axios from "axios";
import { MdNotifications } from "react-icons/md";
import { useSetRecoilState } from "recoil";

interface MenuLinkProps {
  label: string;
  path: string;
  active: string;
  iconActive: JSX.Element;
  icon: JSX.Element;
}

interface Profile {
  id: string;
  username: string;
  email: string;
}

interface Notification {
  type: string;
  sender: {
    username: string;
  };
}

const MenuLink = (props: MenuLinkProps) => {
  const active = props.path === props.active;
  return (
    <Link href={props.path}>
      <div
        className={`p-3 w-full min-w-[170px] flex justify-start items-start rounded-[10px] font-semibold gap-3 transition duration-200 ${
          active
            ? "bg-blue-100 text-blue-500"
            : "bg-transparent text-neutral-500 hover:bg-neutral-100"
        }`}
      >
        {active ? props.iconActive : props.icon}
        <span>{props.label}</span>
      </div>
    </Link>
  );
};

export default function Navbar() {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("/");
  const [isLogged, setIsLogged] = useState(false);
  const [profile, setProfile] = useState<Profile>();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [input, setInput] = useState("");

  const searchPage = ["/forum", "/tersimpan", "/terbaru"];
  const isSearchPage = searchPage.includes(router.pathname);

  const setSearchParams = useSetRecoilState(searchAtom);

  const LogoutHandler = () => {
    localStorage.removeItem("access_token");
    setIsLogged(false);
    router.push("/");
  };

  const checkLogin = () => {
    if (localStorage.getItem("access_token")) {
      setIsLogged(true);
    }
  };

  useEffect(() => {
    checkLogin();
    setActivePage(router.pathname);
    setInput("");
  }, [router.pathname]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setProfile(response.data.data);
      } catch (error) {
        console.error("Error fetching thread data", error);
      }
    };

    const fetchNotification = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users/notification?limit=5`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setNotifications(response.data.data);
      } catch (error) {
        console.error("Error fetching thread data", error);
      }
    };

    if (isLogged) {
      fetchUser();
      fetchNotification();
    }
  }, [isLogged]);

  const changeURLParams = () => {
    const params = new URLSearchParams();
    setSearchParams(input);
    params.set("search", input);
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    if (router.query.search) {
      setInput(router.query.search as string);
      setSearchParams(router.query.search as string);
    }
  }, [router.query]);

  useEffect(() => {
    if (!isSearchPage) return;

    const timeout = setTimeout(() => {
      changeURLParams();
    }, 500);

    return () => clearTimeout(timeout);
  }, [input]);

  const openNotification = () => {
    setShowNotif((prev) => !prev);
    setShowProfile(false);
  };

  const openProfile = () => {
    setShowProfile((prev) => !prev);
    setShowNotif(false);
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const parseNotificationMessage = (type: string) => {
    switch (type) {
      case "reply":
        return "membalas thread Anda";
      case "upvote":
        return "menyukai thread Anda";
      case "downvote":
        return "tidak menyukai thread Anda";
      case "broadcast":
        return "memposting thread baru";
      default:
        return "";
    }
  };

  return (
    <nav className="bg-white p-[14px] flex justify-between items-center fixed top-0 w-screen z-[90] shadow-md">
      <Link href="/">
        <Image src={Logo} alt="Logo Ruang Publik" className="w-[90px] lg:w-[105px]" />
      </Link>

      {isSearchPage && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            changeURLParams();
          }}
          className="relative hidden md:block"
        >
          <input
            type="text"
            className="outline outline-1 outline-neutral-300 w-[200px] lg:w-[430px] py-1 px-4 rounded-full text-neutral-600"
            placeholder="Cari sesuatu di sini"
            value={input}
            onChange={handleSearchInput}
          />
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
            onClick={changeURLParams}
          >
            <path
              d="M7.66659 14C11.1644 14 13.9999 11.1645 13.9999 7.66668C13.9999 4.16887 11.1644 1.33334 7.66659 1.33334C4.16878 1.33334 1.33325 4.16887 1.33325 7.66668C1.33325 11.1645 4.16878 14 7.66659 14Z"
              stroke="#757575"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14.6666 14.6667L13.3333 13.3333"
              stroke="#757575"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </form>
      )}

      {/* if isLoggedin, then don't show login button */}
      {isLogged ? (
        isSearchPage ? (
          <div className="relative hidden md:flex md:items-center md:gap-x-3 md:pr-2 ">
            <div className="relative">
              <div
                onClick={openNotification}
                className="rounded-full border border-neutral-300 p-[11px] cursor-pointer"
              >
                <div className="relative">
                  <div className="absolute -right-[10px] -top-1 rounded-full p-1 bg-blue-500"></div>
                </div>
                <MdNotifications size="1.65rem" />
              </div>
              {showNotif && (
                <div className="absolute min-w-[180px] top-14 right-1 bg-white rounded-lg border text-xs">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div className="border-b last:border-none py-2 px-2 w-[300px] text-[14px]">
                        <span className="font-bold">{notification.sender.username}</span>&nbsp;
                        <span>{parseNotificationMessage(notification.type)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-base px-2 min-w-[180px] min-h-[120px] grid place-content-center">
                      Tidak ada notifikasi
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <div
                onClick={openProfile}
                className="rounded-full border border-neutral-300 p-3 cursor-pointer"
              >
                <Image src={Account} width={24} height={24} alt="profile account" />
              </div>
              {showProfile && (
                <div className="absolute min-w-[180px] top-14 right-2 bg-white rounded-lg border px-3 py-2 text-xs font-bold">
                  <p className="text-base">{profile?.username}</p>
                  <p className="text-neutral-400">{profile?.email}</p>
                  <hr className="my-2" />
                  <div className="flex flex-col gap-y-2">
                    <a href="/profile">Pengaturan akun</a>
                    <a href="">Keamanan akun</a>
                  </div>
                  <hr className="my-2" />
                  <a href="" className="text-red-600" onClick={LogoutHandler}>
                    Logout
                  </a>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden md:flex">
            <Link href="/forum">
              <button className="rounded-full bg-blue-500 px-6 py-[6px] font-semibold text-white mr-4">
                Forum
              </button>
            </Link>
            <button
              className="rounded-full bg-blue-500 px-6 py-[6px] font-semibold text-white"
              onClick={LogoutHandler}
            >
              Logout
            </button>
          </div>
        )
      ) : (
        <Link href="/login">
          <button className="hidden md:block rounded-full bg-blue-500 px-6 py-[6px] font-semibold text-white">
            Login
          </button>
        </Link>
      )}

      {/* <Link href="/login">
        <button className="hidden md:block rounded-full bg-blue-500 px-6 py-[6px] font-semibold text-white">
          Login
        </button>
      </Link> */}

      <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <div className="w-[30px] relative flex flex-col justify-center items-center gap-1.5 z-[10]">
          <div
            className={`h-[4px] rounded-full bg-blue-500 transition-[width] duration-150 ${
              !isMenuOpen ? "w-full" : "w-0"
            }`}
          />
          <div
            className={`h-[4px] w-full rounded-full bg-blue-500 transition duration-150 ${
              !isMenuOpen ? "rotate-0" : "rotate-45"
            }`}
          />
          <div
            className={`h-[4px] w-full rounded-full bg-blue-500 transition duration-150 absolute ${
              !isMenuOpen ? "rotate-0" : "-rotate-45"
            }`}
          />
          <div
            className={`h-[4px] rounded-full bg-blue-500 transition-[width] duration-150 ${
              !isMenuOpen ? "w-full" : "w-0"
            }`}
          />
        </div>
      </button>

      <section
        className={`w-fit fixed md:hidden shadow-md top-0 right-0 min-h-screen bg-white z-[9] flex flex-col justify-start items-center pt-[100px] px-5 gap-3 transition duration-200 ${
          isMenuOpen ? "translate-x-0" : "translate-x-[100%]"
        }`}
      >
        <ul>
          <MenuLink
            label="Beranda"
            path="/"
            active={activePage}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M10.0427 3.15015L10.0431 3.14984C11.1273 2.27903 12.8675 2.28412 13.968 3.16072C13.9681 3.16082 13.9682 3.16093 13.9684 3.16103L20.514 8.39754C20.5146 8.39801 20.5152 8.39847 20.5157 8.39893C20.893 8.7071 21.2196 9.18941 21.4304 9.74097C21.641 10.2922 21.7196 10.8699 21.6462 11.3509L20.3873 18.8845C20.3872 18.8849 20.3872 18.8854 20.3871 18.8859C20.1374 20.3188 18.7432 21.5 17.3 21.5H6.69996C5.23549 21.5 3.8725 20.3476 3.62294 18.8965C3.62288 18.8961 3.62282 18.8958 3.62276 18.8954L2.36313 11.3576L2.36293 11.3564C2.28079 10.8718 2.35452 10.2929 2.56465 9.74191C2.77476 9.19093 3.10548 8.70908 3.4918 8.40084L3.49267 8.40015L10.0427 3.15015ZM12 19.25C12.6861 19.25 13.25 18.6861 13.25 18V15C13.25 14.3139 12.6861 13.75 12 13.75C11.3138 13.75 10.75 14.3139 10.75 15V18C10.75 18.6861 11.3138 19.25 12 19.25Z"
                  fill="#9E9E9E"
                  stroke="#9E9E9E"
                />
              </svg>
            }
            iconActive={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#3563E9"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.0427 3.15015L10.0431 3.14984C11.1274 2.27903 12.8676 2.28412 13.968 3.16072C13.9682 3.16082 13.9683 3.16093 13.9684 3.16103L20.5141 8.39754C20.5147 8.39801 20.5152 8.39847 20.5158 8.39893C20.893 8.7071 21.2197 9.18941 21.4305 9.74097C21.6411 10.2922 21.7196 10.8699 21.6463 11.3509L20.3874 18.8845C20.3873 18.8849 20.3872 18.8854 20.3871 18.8859C20.1375 20.3188 18.7433 21.5 17.3 21.5H6.70002C5.23555 21.5 3.87256 20.3476 3.623 18.8965C3.62294 18.8961 3.62288 18.8958 3.62282 18.8954L2.36319 11.3576L2.36299 11.3564C2.28085 10.8718 2.35458 10.2929 2.56471 9.74191C2.77482 9.19093 3.10555 8.70908 3.49187 8.40084L3.49273 8.40015L10.0427 3.15015ZM12 19.25C12.6862 19.25 13.25 18.6861 13.25 18V15C13.25 14.3139 12.6862 13.75 12 13.75C11.3139 13.75 10.75 14.3139 10.75 15V18C10.75 18.6861 11.3139 19.25 12 19.25Z"
                  fill="#3563E9"
                  stroke="#3563E9"
                />
              </svg>
            }
          />
        </ul>
        <ul>
          <MenuLink
            label="Terbaru"
            path="/terbaru"
            active={activePage}
            iconActive={
              <svg
                fill="#3563E9"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <g clipPath="url(#clip0_132_13631)">
                  <path
                    d="M12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2ZM12 6C11.7348 6 11.4804 6.10536 11.2929 6.29289C11.1054 6.48043 11 6.73478 11 7V12C11.0001 12.2652 11.1055 12.5195 11.293 12.707L14.293 15.707C14.4816 15.8892 14.7342 15.99 14.9964 15.9877C15.2586 15.9854 15.5094 15.8802 15.6948 15.6948C15.8802 15.5094 15.9854 15.2586 15.9877 14.9964C15.99 14.7342 15.8892 14.4816 15.707 14.293L13 11.586V7C13 6.73478 12.8946 6.48043 12.7071 6.29289C12.5196 6.10536 12.2652 6 12 6Z"
                    fill="#3563E9"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_132_1363">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            }
            icon={
              <svg
                fill="#F5F5F5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <g clipPath="url(#clip0_132_13632)">
                  <path
                    d="M12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2ZM12 6C11.7348 6 11.4804 6.10536 11.2929 6.29289C11.1054 6.48043 11 6.73478 11 7V12C11.0001 12.2652 11.1055 12.5195 11.293 12.707L14.293 15.707C14.4816 15.8892 14.7342 15.99 14.9964 15.9877C15.2586 15.9854 15.5094 15.8802 15.6948 15.6948C15.8802 15.5094 15.9854 15.2586 15.9877 14.9964C15.99 14.7342 15.8892 14.4816 15.707 14.293L13 11.586V7C13 6.73478 12.8946 6.48043 12.7071 6.29289C12.5196 6.10536 12.2652 6 12 6Z"
                    fill="#9E9E9E"
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
        </ul>
        <ul>
          <MenuLink
            label="Forum"
            path="/forum"
            active={activePage}
            icon={
              <svg
                fill="#F5F5F5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  d="M7 18C6.71667 18 6.47933 17.904 6.288 17.712C6.09667 17.52 6.00067 17.2827 6 17V15H19V6H21C21.2833 6 21.521 6.096 21.713 6.288C21.905 6.48 22.0007 6.71733 22 7V19.575C22 20.025 21.796 20.3377 21.388 20.513C20.98 20.6883 20.6173 20.6173 20.3 20.3L18 18H7ZM6 13L3.7 15.3C3.38334 15.6167 3.02067 15.6877 2.612 15.513C2.20333 15.3383 1.99933 15.0257 2 14.575V3C2 2.71667 2.096 2.47933 2.288 2.288C2.48 2.09667 2.71733 2.00067 3 2H16C16.2833 2 16.521 2.096 16.713 2.288C16.905 2.48 17.0007 2.71733 17 3V12C17 12.2833 16.904 12.521 16.712 12.713C16.52 12.905 16.2827 13.0007 16 13H6Z"
                  fill="#9E9E9E"
                />
              </svg>
            }
            iconActive={
              <svg
                fill="#3563E9"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  d="M7 18C6.71667 18 6.47933 17.904 6.288 17.712C6.09667 17.52 6.00067 17.2827 6 17V15H19V6H21C21.2833 6 21.521 6.096 21.713 6.288C21.905 6.48 22.0007 6.71733 22 7V19.575C22 20.025 21.796 20.3377 21.388 20.513C20.98 20.6883 20.6173 20.6173 20.3 20.3L18 18H7ZM6 13L3.7 15.3C3.38334 15.6167 3.02067 15.6877 2.612 15.513C2.20333 15.3383 1.99933 15.0257 2 14.575V3C2 2.71667 2.096 2.47933 2.288 2.288C2.48 2.09667 2.71733 2.00067 3 2H16C16.2833 2 16.521 2.096 16.713 2.288C16.905 2.48 17.0007 2.71733 17 3V12C17 12.2833 16.904 12.521 16.712 12.713C16.52 12.905 16.2827 13.0007 16 13H6Z"
                  fill="#3563E9"
                />
              </svg>
            }
          />
        </ul>
        {/* <ul>
          <MenuLink
            label="Tersimpan"
            path="/tersimpan"
            active={activePage}
            icon={
              <svg
                fill={activePage === "/" ? "#3563E9" : "#F5F5F5"}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 21V5C5 4.45 5.196 3.97933 5.588 3.588C5.98 3.19667 6.45067 3.00067 7 3H17C17.55 3 18.021 3.196 18.413 3.588C18.805 3.98 19.0007 4.45067 19 5V21L12 18L5 21Z"
                  fill="#9E9E9E"
                />
              </svg>
            }
          />
        </ul> */}
      </section>
    </nav>
  );
}
