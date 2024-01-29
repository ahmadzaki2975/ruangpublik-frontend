import { InputComponent, InputPassword } from "@/components/Form/InputField";
import SubmitButton from "@/components/Form/SubmitButton";
import { NIKVerificationStatus } from "@/enums/enum";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import Cookies from "js-cookie";

interface UserProfile {
  id: string;
  username: string;
  fullname: string;
  email: string;
  nik: {
    nikCode: string;
    isVerified: boolean;
    status: string;
  };
}

interface UserFormInput {
  [key: string]: string;
}

interface UserErrorInput {
  [key: string]: string;
}

const initialInput: UserFormInput = {
  fullname: "",
  username: "",
  email: "",
  nikCode: "",
  status: "",
};

const fields = ["fullname", "username", "email", "nikCode"];
const errorMessages: Record<string, { [key: string]: string }> = {
  fullname: { required: "Nama lengkap tidak boleh kosong" },
  username: { required: "Username tidak boleh kosong" },
  email: { required: "Email tidak boleh kosong" },
  nikCode: { required: "NIK tidak boleh kosong" },
};

const parseStatus = (status: string) => {
  switch (status) {
    case NIKVerificationStatus.PENDING:
      return (
        <span className="p-2 rounded-lg text-orange-400 bg-orange-100 border border-orange-300 ">
          Status NIK: menunggu verifikasi
        </span>
      );
    case NIKVerificationStatus.VERIFIED:
      return (
        <span className="p-2 rounded-lg text-green-400 bg-green-100 border border-green-300">
          Status NIK: terverifikasi
        </span>
      );
    case NIKVerificationStatus.REJECTED:
      return (
        <span className="p-2 rounded-lg text-red-400 bg-red-100 border border-red-300">
          Status NIK: ditolak
        </span>
      );
    default:
      return (
        <span className="p-2 rounded-lg text-gray-400 bg-gray-100 border border-gray-300">
          Status NIK: belum diajukan
        </span>
      );
  }
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  const [onEdit, setOnEdit] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [errors, setErrors] = useState<UserErrorInput>({});

  const [lastData, setLastData] = useState<UserFormInput>(initialInput);
  const [input, setInput] = useState<UserFormInput>(initialInput);

  const allowEditNIK =
    user?.nik.status === NIKVerificationStatus.REJECTED ||
    user?.nik.status === NIKVerificationStatus.DRAFT;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setInput((prev) => ({ ...prev, [id]: value }));

    if (value === "") setErrors((prev) => ({ ...prev, [id]: errorMessages[id]?.required || "" }));
    else setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: UserErrorInput = {};

    fields.forEach((field) => {
      if (!input[field]) {
        newErrors[field] = errorMessages[field]?.required || "";
      }
    });

    setErrors((prev) => ({ ...prev, ...newErrors }));

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      const accessToken = Cookies.get("accessToken");

      let data: UserFormInput = {
        fullname: input.fullname,
        username: input.username,
        email: input.email,
        nikCode: input.nikCode,
      };

      if (allowEditNIK) {
        data = {
          ...data,
          status: NIKVerificationStatus.PENDING,
        };
      }

      const res = await axios.put(`${BASE_URL}/users`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.status === 200) {
        toast.success("Berhasil mengubah data user!");
        setOnEdit(false);
        setLastData(input);
        setInput((prev) => ({ ...prev, status: NIKVerificationStatus.PENDING }));
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat mengubah data user!");
    }
  };

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");

    const getUserData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/users", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (res.status === 200) {
          setUser(res.data.data);
          const data = {
            fullname: res.data.data.fullname,
            username: res.data.data.username,
            email: res.data.data.email,
            nikCode: res.data.data.nik.nikCode,
            status: res.data.data.nik.status,
          };

          setInput(data);
          setLastData(data);
        }
      } catch (error) {
        console.error(error);
        toast.error("Terjadi kesalahan saat mengambil data user!");
      }
    };

    getUserData();
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="relative mt-32 max-w-[1500px] mx-auto px-4 pb-10">
      <form className="w-full bg-white p-4 rounded-xl" onSubmit={handleSaveProfile}>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold">Informasi Pengguna</h2>
            <p className="text-neutral-400 font-medium">
              Anda dapat mengubah data Anda jika dirasa salah
            </p>
          </div>
          <SubmitButton
            customClass="px-5 rounded-lg flex items-center justify-center gap-x-2 bg-white !text-black border border-blue-500"
            onClick={(e) => {
              e.preventDefault();
              setOnEdit((prev) => {
                if (prev) {
                  setInput({
                    ...lastData,
                    status: input.status,
                  });
                  setErrors({});
                }
                return !prev;
              });
            }}
          >
            {onEdit ? "Batal" : "Ubah"}
          </SubmitButton>
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <InputComponent
            id="username"
            type="text"
            name="Username"
            value={input.username}
            placeholder="Isi dengan username Anda"
            error={errors.username}
            handleInputChange={handleInput}
            disabled={!onEdit}
          />
          <InputComponent
            id="fullname"
            type="text"
            name="Nama Lengkap"
            value={input.fullname}
            placeholder="Isi dengan nama lengkap Anda"
            error={errors.fullname}
            handleInputChange={handleInput}
            disabled={!onEdit}
          />
          <InputComponent
            id="email"
            type="email"
            name="Email"
            value={input.email}
            placeholder="Isi dengan email Anda"
            error={errors.email}
            handleInputChange={handleInput}
            disabled={!onEdit}
          />
          <InputPassword
            id="nikCode"
            type="password"
            name="Nomor Induk Kependudukan"
            value={input.nikCode}
            placeholder="Isi dengan NIK Anda"
            icon={BsEye}
            secondaryIcon={BsEyeSlash}
            error={errors.nikCode}
            handleInputChange={handleInput}
            disabled={!onEdit || !allowEditNIK || input.status === NIKVerificationStatus.PENDING}
          />
          <p className="font-medium">{parseStatus(input.status)}</p>
        </div>
        <SubmitButton
          customClass="px-4 mt-6 rounded-lg flex items-center justify-center gap-x-2 disabled:bg-gray-300 disabled:!text-white disabled:cursor-not-allowed"
          disabled={!onEdit}
        >
          {/* {isLoading && <LoadingButton />} */}
          {input.status === NIKVerificationStatus.PENDING
            ? "Simpan"
            : allowEditNIK
            ? "Ajukan & Simpan"
            : "Simpan"}
        </SubmitButton>
      </form>
    </div>
  );
}
