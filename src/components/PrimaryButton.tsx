interface Props {
  text?: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export default function PrimaryButton(props: Props) {
  if (!props.text && !props.iconLeft && !props.iconRight) {
    throw new Error("PrimaryButton must have either (or both) text or icon");
  }
  return (
    <button
      disabled={props.disabled}
      onClick={() => {
        if (props.disabled) return;
        props.onClick();
      }}
      className={`bg-blue-500 flex gap-2 rounded-[4px] text-[13px] font-semibold font-jakarta px-4 py-[10px] transition duration-150 hover:bg-blue-600 active:bg-blue-700 disabled:opacity-80 disabled:cursor-not-allowed ${props.className} `}
    >
      {props.iconLeft}
      {props.text}
      {props.iconRight}
    </button>
  );
}
