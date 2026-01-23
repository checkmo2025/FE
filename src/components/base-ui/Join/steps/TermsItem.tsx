import React from "react";
import Image from "next/image";
interface TermsItemProps {
  id: string;
  label: string;
  required: boolean;
  checked: boolean;
  onChange: (id: string, checked: boolean) => void;
  link?: string;
}

const TermsItem: React.FC<TermsItemProps> = ({
  id,
  label,
  required,
  checked,
  onChange,
}) => {
  return (
    <label className="flex items-center justify-between w-full cursor-pointer select-none">
      <span className="text-[#353535] text-[19.861px] font-normal leading-[15.605px]">
        {label} ({required ? "필수" : "선택"})
      </span>
      <div className="relative flex items-center justify-center w-[24px] h-[24px]">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(id, e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-full h-full peer-checked:hidden">
          <Image
            src="/CheckBox_No.svg"
            alt="Unchecked"
            width={24}
            height={24}
          />
        </div>
        <div className="hidden w-full h-full peer-checked:block">
          <Image src="/CheckBox_Yes.svg" alt="Checked" width={24} height={24} />
        </div>
      </div>
    </label>
  );
};

export default TermsItem;
