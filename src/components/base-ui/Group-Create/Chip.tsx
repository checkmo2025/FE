import React from "react";

function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

type ChipProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
};

export default function Chip({ label, selected, onClick, disabled }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "flex justify-center items-center",
        "w-[90px] h-[32px] t:w-[150px] t:h-[48px]",
        "rounded-full",
        "body_1_3 t:subhead_4_1",
        " border border-Subbrown-1 t:border-2",
        "hover:brightness-98 hover:-translate-y-[1px] cursor-pointer",
        "disabled:text-Gray-4 disabled:border-Gray-4 disabled:hover:bg-White disabled:cursor-not-allowed",
        selected
          ? "bg-Subbrown-1 text-White"
          : "bg-White text-Gray-5"
      )}
    >
      {label}
    </button>
  );
}
