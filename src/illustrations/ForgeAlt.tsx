import type { CSSProperties } from 'react';

interface Props {
  className?: string;
  width?: number | string;
  style?: CSSProperties;
}

export function ForgeAlt({ className, width, style }: Props) {
  const mergedStyle = width !== undefined ? { ...style, width } : style;
  return (
    <svg
      viewBox="0 0 90 90"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      style={mergedStyle}
    >
      <defs>
        <linearGradient id="fg-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a1612" />
          <stop offset="100%" stopColor="#2a1e16" />
        </linearGradient>
        <radialGradient id="fg-light" cx="50%" cy="65%" r="55%">
          <stop offset="0%" stopColor="#fae09a" stopOpacity=".55" />
          <stop offset="55%" stopColor="#a05030" stopOpacity=".2" />
          <stop offset="100%" stopColor="#5a2818" stopOpacity="0" />
        </radialGradient>
        <filter id="fg-soft">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <filter id="fg-paper">
          <feTurbulence type="fractalNoise" baseFrequency="0.92" numOctaves="2" seed="17" />
          <feColorMatrix values="0 0 0 0 0.85  0 0 0 0 0.7  0 0 0 0 0.5  0 0 0 0.06 0" />
        </filter>
      </defs>
      <rect width="90" height="90" fill="url(#fg-bg)" />
      <ellipse cx="45" cy="65" rx="45" ry="22" fill="url(#fg-light)" filter="url(#fg-soft)" />
      <path d="M22,72 L22,58 L36,58 L36,50 L54,50 L54,58 L68,58 L68,72 Z" fill="#0c0907" />
      <g transform="translate(45,35) rotate(15)">
        <rect x="-1.5" y="-3" width="3" height="14" fill="#3a2818" />
        <rect x="-7" y="-7" width="14" height="7" fill="#5a5448" rx=".5" />
      </g>
      <circle cx="30" cy="46" r="1.2" fill="#fae09a" opacity=".9" />
      <circle cx="60" cy="44" r="1.2" fill="#fae09a" opacity=".85" />
      <circle cx="28" cy="38" r=".7" fill="#fae09a" opacity=".7" />
      <circle cx="62" cy="36" r=".8" fill="#fae09a" opacity=".75" />
      <circle cx="40" cy="30" r=".6" fill="#fae09a" opacity=".6" />
      <circle cx="54" cy="28" r=".6" fill="#fae09a" opacity=".6" />
      <ellipse cx="45" cy="50" rx="10" ry="2" fill="#fae09a" opacity=".4" filter="url(#fg-soft)" />
      <rect width="90" height="90" filter="url(#fg-paper)" opacity=".4" />
    </svg>
  );
}
