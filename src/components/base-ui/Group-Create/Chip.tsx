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
        "bg-White border border-primary-2 t:border-2",
        "hover:bg-Subbrown-4",
        "disabled:text-Gray-4 disabled:border-Gray-4 disabled:hover:bg-White disabled:cursor-not-allowed",
        selected
          ? "bg-primary-2 text-White border-primary-2 hover:bg-primary-1 hover:border-primary-1"
          : "text-Gray-5"
      )}
    >
      {label}
    </button>
  );
}
