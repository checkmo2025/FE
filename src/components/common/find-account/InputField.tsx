import React from "react";

type Props = React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
>;

export default function InputField({ className = "", ...props }: Props) {
    return (
        <div className="flex h-[44px] px-[16px] py-[12px] items-center gap-[10px] self-stretch rounded-lg border border-Subbrown-4 bg-White">
            <input
                className={`flex flex-col justify-center flex-1 self-stretch text-Black body_1_3 outline-none placeholder:text-Gray-3 ${className}`}
                {...props}
            />
        </div>
    );
}
