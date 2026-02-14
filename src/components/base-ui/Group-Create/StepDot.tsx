import React from "react";

function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function StepDot({ n, current }: { n: number; current: number }) {
  const active = n === current;
  const done = n < current;

  return (
    <div
      className={cx(
        "w-[24px] h-[24px] rounded-full flex items-center justify-center body_1_1",
        (active || done) && "bg-primary-2 text-White",
        !(active || done) && "bg-Gray-1 text-Gray-4"
      )}
    >
      {n}
    </div>
  );
}