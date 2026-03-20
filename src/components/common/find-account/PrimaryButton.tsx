import React from "react";

type Props = React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>;

export default function PrimaryButton({ className = "", children, ...props }: Props) {
    return (
        <button
            className={`flex w-[258px] h-[48px] px-[16px] py-[12px] justify-center items-center rounded-lg bg-primary-1 text-White body_1_1 hover:bg-primary-3 transition-colors ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
