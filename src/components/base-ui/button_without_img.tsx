'use client';

import React, { useState } from 'react';

type ButtonWithoutImgProps = {
  text: string;
  onClick?: () => void;

  bgColorVar?: string;
  borderColorVar?: string;
  textColorVar?: string;

  hoverBgColorVar?: string;
  hoverBorderColorVar?: string;
  hoverTextColorVar?: string;

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
  return s; // "#fff", "red", "rgba(...)" 등
};

export default function ButtonWithoutImg({
  text,
  onClick,

  bgColorVar = '--primary_2',
  borderColorVar = '--primary_2',
  textColorVar = '--White',

  hoverBgColorVar,
  hoverBorderColorVar,
  hoverTextColorVar,

  width = 132,
  height = 44,

  disabled = false,
  type = 'button',
  className = '',
}: ButtonWithoutImgProps) {
  const [isHover, setIsHover] = useState(false);

  const bg = toCssColor(
    isHover && hoverBgColorVar ? hoverBgColorVar : bgColorVar,
  );
  const border = toCssColor(
    isHover && hoverBorderColorVar ? hoverBorderColorVar : borderColorVar,
  );
  const textColor = toCssColor(
    isHover && hoverTextColorVar ? hoverTextColorVar : textColorVar,
  );

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={disabled ? undefined : () => setIsHover(true)}
      onMouseLeave={disabled ? undefined : () => setIsHover(false)}
      style={{
        width,
        height,
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
