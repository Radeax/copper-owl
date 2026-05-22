import type { CSSProperties } from 'react';

interface Props {
  className?: string;
  width?: number | string;
  style?: CSSProperties;
}

export function WorldBossAlt({ className, width, style }: Props) {
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
        <linearGradient id="wb-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a1f28" />
          <stop offset="60%" stopColor="#3d4858" />
          <stop offset="100%" stopColor="#5a4220" />
        </linearGradient>
        <radialGradient id="wb-glow" cx="50%" cy="55%" r="50%">
          <stop offset="0%" stopColor="#fae09a" stopOpacity=".5" />
          <stop offset="100%" stopColor="#a05030" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="wb-dragon" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3a2520" />
          <stop offset="100%" stopColor="#0c0907" />
        </linearGradient>
        <filter id="wb-soft">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <filter id="wb-paper">
          <feTurbulence type="fractalNoise" baseFrequency="0.88" numOctaves="2" seed="7" />
          <feColorMatrix values="0 0 0 0 0.8  0 0 0 0 0.7  0 0 0 0 0.6  0 0 0 0.07 0" />
        </filter>
      </defs>
      <rect width="90" height="90" fill="url(#wb-sky)" />
      <circle cx="45" cy="50" r="30" fill="url(#wb-glow)" filter="url(#wb-soft)" />
      <path d="M45,50 Q25,30 8,38 Q15,40 18,46 Q26,44 38,52 Z" fill="url(#wb-dragon)" />
      <path d="M45,50 Q65,30 82,38 Q75,40 72,46 Q64,44 52,52 Z" fill="url(#wb-dragon)" />
      <ellipse cx="45" cy="56" rx="9" ry="6" fill="url(#wb-dragon)" />
      <path d="M45,58 Q42,68 38,72 Q42,72 47,68 Q52,72 56,72 Q52,68 49,58 Z" fill="url(#wb-dragon)" />
      <circle cx="48" cy="54" r="1" fill="#fae09a" opacity=".95" />
      <path d="M0,78 Q20,72 45,76 Q65,72 90,78 L90,90 L0,90 Z" fill="#10160d" />
      <rect width="90" height="90" filter="url(#wb-paper)" opacity=".4" />
    </svg>
  );
}
