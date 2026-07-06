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

const normalizeCssColor = (v?: string) => v?.trim().replace(/^var\((--[^)]+)\)$/, '$1');

const DEFAULT_HOVER_COLOR_BY_TOKEN: Record<string, string> = {
  '--Primary_1': '--Primary_3',
  '--Primary_2': '--Primary_1',
  '--Subbrown_4': '--Subbrown_3',
  '--White': '--Subbrown_3',
  '--background': '--Subbrown_3',
};

const getDefaultHoverColor = (v?: string) => {
  const token = normalizeCssColor(v);
  return token ? DEFAULT_HOVER_COLOR_BY_TOKEN[token] : undefined;
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

  const shouldUseHover = isHover && !disabled;
  const bg = toCssColor(
    shouldUseHover ? hoverBgColorVar ?? getDefaultHoverColor(bgColorVar) ?? bgColorVar : bgColorVar
  );
  const border = toCssColor(
    shouldUseHover
      ? hoverBorderColorVar ?? getDefaultHoverColor(borderColorVar) ?? borderColorVar
      : borderColorVar
  );
  const textColor = toCssColor(shouldUseHover ? hoverTextColorVar ?? textColorVar : textColorVar);

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
        'transition-colors',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className,
      ].join(' ')}
    >
      {text}
    </button>
  );
}
