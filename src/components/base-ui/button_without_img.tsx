'use client';

import { useState } from 'react';

type ButtonWithoutImgProps = {
  text: string;
  onClick?: () => void;

  bgColorVar?: string;
  borderColorVar?: string;
  textColorVar?: string;

  hoverBgColorVar?: string;
  hoverBorderColorVar?: string;
  hoverTextColorVar?: string;

  // ✅ 기본 고정폭 제거 (반응형은 className으로)
  width?: number;
  height?: number;

  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
};

const toCssColor = (v?: string) => {
  if (!v) return undefined;
  const s = v.trim();
  if (s.startsWith('var(')) return s;
  if (s.startsWith('--')) return `var(${s})`;
  return s;
};

export default function ButtonWithoutImg({
  text,
  onClick,

  bgColorVar = '--Primary_2',
  borderColorVar = '--Primary_2',
  textColorVar = '--White',

  hoverBgColorVar,
  hoverBorderColorVar,
  hoverTextColorVar,

  width,
  height,

  disabled = false,
  type = 'button',
  className = '',
}: ButtonWithoutImgProps) {
  const [isHover, setIsHover] = useState(false);

  const bg = toCssColor(isHover && hoverBgColorVar ? hoverBgColorVar : bgColorVar);
  const border = toCssColor(isHover && hoverBorderColorVar ? hoverBorderColorVar : borderColorVar);
  const textColor = toCssColor(isHover && hoverTextColorVar ? hoverTextColorVar : textColorVar);

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={disabled ? undefined : () => setIsHover(true)}
      onMouseLeave={disabled ? undefined : () => setIsHover(false)}
      style={{
        ...(width ? { width } : {}),
        ...(height ? { height } : {}),
        backgroundColor: bg,
        borderColor: border,
        color: textColor,
      }}
      className={[
        'flex px-[16px] py-[12px] justify-center items-center gap-[10px]',
        'rounded-[8px] border',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className,
      ].join(' ')}
    >
      {text}
    </button>
  );
}
