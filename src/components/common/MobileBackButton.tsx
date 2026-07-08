type MobileBackButtonProps = {
  label?: string;
  onClick: () => void;
  className?: string;
};

export default function MobileBackButton({
  label = "뒤로가기",
  onClick,
  className = "",
}: MobileBackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`t:hidden w-full cursor-pointer flex items-center gap-2 px-[10px] py-[12px] border-b border-Gray-2 text-Gray-7 body_1_2 transition-colors hover:bg-Gray-1 ${className}`}
    >
      <svg
        width="9"
        height="11"
        viewBox="0 0 9 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <path d="M0 5.19629L9 10.3924V0.00014L0 5.19629Z" fill="#BBAA9B" />
      </svg>
      <span>{label}</span>
    </button>
  );
}
