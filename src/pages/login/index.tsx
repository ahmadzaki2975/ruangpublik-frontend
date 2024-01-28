import BackToHome from "@/components/BackToHome";
import { InputComponent, InputPassword } from "@/components/Form/InputField";
import SubmitButton from "@/components/Form/SubmitButton";
import LoadingButton from "@/components/LoadingButton";

import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

interface LoginFormInput {
  email: string;
  password: string;
}

interface LoginErrorInput {
  email?: string;
  password?: string;
}

const initialInput: LoginFormInput = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const router = useRouter();
  const [input, setInput] = useState<LoginFormInput>(initialInput);
  const [errors, setErrors] = useState<LoginErrorInput>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setInput((prev) => ({ ...prev, [id]: value }));

    if (value === "") setErrors((prev) => ({ ...prev, [id]: `${id} tidak boleh kosong` }));
    else setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.email) setErrors((prev) => ({ ...prev, email: "email tidak boleh kosong" }));
    if (!input.password)
      setErrors((prev) => ({ ...prev, password: "password tidak boleh kosong" }));

    if (!input.email || !input.password) return;

    setIsLoading(true);
    const loading = toast.loading("Memproses login...");

    try {
      const res = await axios.post("http://localhost:5000/auth/login", input);
      if (res.status === 200) {
        setIsLoading(false);
        Cookies.set("accessToken", res.data.message);
        toast.update(loading, {
          render: "Login berhasil!",
          type: "success",
          isLoading: false,
          autoClose: 1500,
        });
        router.push("/forum");
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.update(loading, {
        render: "Login gagal!",
        type: "error",
        isLoading: false,
        autoClose: 1500,
      });
    }
  };

  return (
    <div className="max-w-screen min-h-[100dvh] flex flex-col items-center bg-neutral-50 pt-20 pb-10 px-5 md:px-8 md:pt-24">
      <BackToHome />
      <div className="flex flex-col items-center w-[100%] max-w-[400px]">
        <Image src={"/ruangpublik-icon.svg"} alt="ruangpublik icon" width={127} height={47} />
        <div className="mt-6 mb-5 text-center">
          <p className="text-secondary-800 text-2xl font-bold">Masuk ke akunmu</p>
          <p className="text-neutral-700 tracking-[-0.32px]">
            Jelajahi berbagai perspektif dalam satu platform
          </p>
        </div>
        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full text-secondary-800">
          <InputComponent
            id="email"
            type="email"
            name="Email"
            value={input.email}
            placeholder="Masukkan email Anda"
            error={errors.email}
            handleInputChange={handleInput}
          />
          <InputPassword
            id="password"
            name="Password"
            value={input.password}
            placeholder="Masukkan password Anda"
            icon={BsEye}
            secondaryIcon={BsEyeSlash}
            error={errors.password}
            handleInputChange={handleInput}
          />
          <SubmitButton
            customClass="w-full mt-6 rounded-lg flex items-center justify-center gap-x-2"
            disabled={isLoading}
          >
            {isLoading && <LoadingButton />}
            Masuk
          </SubmitButton>
        </form>
        <div className="text-center mt-9 mb-3 text-neutral-700">
          <p>
            Belum mendaftar?
            <a href={`${process.env.NEXT_PUBLIC_BASE_URL}/signup`}>
              <span className="text-blue-500 font-bold">&nbsp;Buat akun</span>
            </a>
          </p>
          <p>atau masuk dengan</p>
        </div>
        <div className="bg-neutral-100 p-3 rounded-lg cursor-pointer">
          <a href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`} className="text-secondary-800">
            <FcGoogle size="1.75rem" />
          </a>
        </div>
        {/* <GoogleLoginButton /> */}
      </div>
    </div>
  );
}
