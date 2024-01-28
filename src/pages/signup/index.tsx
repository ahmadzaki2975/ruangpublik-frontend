import BackToHome from "@/components/BackToHome";
import { InputComponent, InputPassword } from "@/components/Form/InputField";
import SubmitButton from "@/components/Form/SubmitButton";
import LoadingButton from "@/components/LoadingButton";

import axios from "axios";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";

interface SignupFormInput {
  [key: string]: string;
}

interface SignupErrorInput {
  [key: string]: string;
}

const initialInput: SignupFormInput = {
  fullname: "",
  username: "",
  email: "",
  password: "",
  nikCode: "",
};

const fields = ["fullname", "username", "password", "email", "nikCode"];
// TODO: add more error cases
const errorMessages: Record<string, { [key: string]: string }> = {
  fullname: { required: "Nama lengkap tidak boleh kosong" },
  username: { required: "Username tidak boleh kosong" },
  password: { required: "Password tidak boleh kosong" },
  email: { required: "Email tidak boleh kosong" },
  nikCode: { required: "NIK tidak boleh kosong" },
};

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState<SignupFormInput>(initialInput);
  const [errors, setErrors] = useState<SignupErrorInput>({});

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setInput((prev) => ({ ...prev, [id]: value }));

    if (value === "") setErrors((prev) => ({ ...prev, [id]: errorMessages[id]?.required || "" }));
    else setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: SignupErrorInput = {};

    fields.forEach((field) => {
      if (!input[field]) {
        newErrors[field] = errorMessages[field]?.required || "";
      }
    });

    setErrors((prev) => ({ ...prev, ...newErrors }));

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    const loading = toast.loading("Memproses pendaftaran...");

    try {
      const res = await axios.post("http://localhost:5000/auth/signup", input);
      if (res.status === 201) {
        setInput(initialInput);
        setErrors({});
        setIsLoading(false);
        const params = new URLSearchParams(searchParams.toString());
        toast.update(loading, {
          render: "Pendaftaran berhasil! Silahkan login untuk melanjutkan",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        params.set("success", "true");
        router.push(`/signup?${params.toString()}`);
      }
    } catch (error) {
      console.error(error);
      toast.update(loading, {
        render: "Pendaftaran gagal! Silahkan coba lagi",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      setIsLoading(false);
    }
  };

  const showSuccess = useMemo(() => Boolean(searchParams.get("success")), [searchParams]);

  if (showSuccess) {
    return (
      <div className="max-w-screen min-h-[100dvh] flex flex-col items-center bg-neutral-50 pt-24 pb-10 px-5 md:px-8">
        <BackToHome />
        <Image src={"/ruangpublik-icon.svg"} alt="ruangpublik icon" width={127} height={47} />
        <div className="flex flex-col items-center w-[100%] max-w-[600px] bg-white mt-20 px-12 pt-8 pb-12">
          <h1 className="font-bold leading-[48px] tracking-[-0.96px] text-3xl">Sukses!</h1>
          <div className="text-center text-xl mt-4 mb-7">
            <p>Kamu telah berhasil mendaftarkan akun Anda</p>
            <p>Mari suarakan pendapatmu sekarang! 🌟</p>
          </div>
          <a href="/login">
            <SubmitButton customClass="rounded-md px-5 w-[156px]">Login Now</SubmitButton>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen min-h-[100dvh] flex flex-col items-center bg-neutral-50 pt-20 pb-10 px-5 md:px-8 md:pt-24">
      <BackToHome />
      <div className="flex flex-col items-center w-[100%] max-w-[400px]">
        <Image src={"/ruangpublik-icon.svg"} alt="ruangpublik icon" width={127} height={47} />
        <div className="mt-6 mb-5 text-center">
          <p className="text-secondary-800 text-2xl font-bold">Daftarkan akunmu</p>
          <p className="text-neutral-700 tracking-[-0.32px]">
            Mulai utarakan pendapat kamu di Ruang Publik
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="w-full">
          <InputComponent
            id="fullname"
            name="Nama Lengkap"
            value={input.fullname}
            placeholder="Masukkan nama lengkap Anda"
            error={errors.fullname}
            handleInputChange={handleInput}
          />
          <InputComponent
            id="username"
            name="Username"
            value={input.username}
            placeholder="Masukkan username Anda"
            error={errors.username}
            handleInputChange={handleInput}
          />
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
          <InputComponent
            id="nikCode"
            type="text"
            name="NIK"
            value={input.nikCode}
            placeholder="Masukkan NIK Anda"
            error={errors.nikCode}
            handleInputChange={handleInput}
          />
          <SubmitButton
            customClass="w-full mt-6 rounded-lg flex items-center justify-center gap-x-2"
            disabled={isLoading}
          >
            {isLoading && <LoadingButton />}
            Daftar
          </SubmitButton>
        </form>
        <div className="text-center mt-9 mb-3">
          <p>
            Sudah punya akun?
            <a href={`${process.env.NEXT_PUBLIC_BASE_URL}/login`}>
              <span className="text-blue-500 font-bold">&nbsp;Masuk</span>
            </a>
          </p>
          <p>atau daftar dengan</p>
        </div>
        <div className="bg-neutral-100 p-3 rounded-lg cursor-pointer">
          <a href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}>
            <FcGoogle size="1.75rem" />
          </a>
        </div>
      </div>
    </div>
  );
}
