import { useState } from "react";
import { IconType } from "react-icons";

interface InputProps {
  id: string;
  name: string;
  type?: string;
  value: string;
  placeholder: string;
  disabled?: boolean;
  error?: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface InputPropsWithIcon extends InputProps {
  icon: IconType;
}

interface InputPropsWithToggle extends InputPropsWithIcon {
  secondaryIcon: IconType;
}

export const InputComponent: React.FC<InputProps> = ({
  id,
  name,
  type = "text",
  value,
  placeholder,
  error,
  disabled = false,
  handleInputChange,
}) => {
  return (
    <div className="flex flex-col mb-3">
      <label htmlFor={id} className="mb-1 font-semibold">
        {name}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        className={`${
          error ? "border-red-500" : "border-neutral-300"
        } w-full h-12 px-4 border  rounded-lg focus:outline-none `}
        onChange={handleInputChange}
      />
      {error ? <span className="mt-1 text-red-500 text-xs">{error}</span> : null}
    </div>
  );
};

export const InputComponentWithIcon: React.FC<InputPropsWithIcon> = ({
  id,
  name,
  type = "text",
  value,
  icon,
  placeholder,
  error,
  handleInputChange,
}) => {
  const Icon = icon;

  return (
    <div className="flex flex-col mb-3">
      <label htmlFor={id} className="mb-1 font-semibold">
        {name}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          className={`${
            error ? "border-red-500" : "border-neutral-300"
          } w-full h-12 px-4 border  rounded-lg focus:outline-none `}
          onChange={handleInputChange}
        />
        <Icon
          size="1.5rem"
          className="absolute top-0 translate-y-[50%] right-4 text-neutral-500 cursor-pointer"
        />
        {error ? <span className="mt-1 text-red-500 text-xs">{error}</span> : null}
      </div>
    </div>
  );
};

export const InputPassword: React.FC<InputPropsWithToggle> = ({
  id,
  name,
  value,
  icon,
  secondaryIcon,
  placeholder,
  error,
  handleInputChange,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const Icon = icon;
  const SecondaryIcon = secondaryIcon;

  return (
    <div className="flex flex-col mb-3">
      <label htmlFor={id} className="mb-1 font-semibold">
        {name}
      </label>
      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          placeholder={placeholder}
          className={`${
            error ? "border-red-500" : "border-neutral-300"
          } w-full h-12 px-4 border  rounded-lg focus:outline-none `}
          onChange={handleInputChange}
          disabled={disabled}
        />
        {showPassword ? (
          <Icon
            size="1.5rem"
            className="absolute top-0 translate-y-[50%] right-4 text-neutral-500 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          />
        ) : (
          <SecondaryIcon
            size="1.5rem"
            className="absolute top-0 translate-y-[50%] right-4 text-neutral-500 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          />
        )}
      </div>
      {error ? <span className="mt-1 text-red-500 text-xs">{error}</span> : null}
    </div>
  );
};
