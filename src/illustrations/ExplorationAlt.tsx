import type { CSSProperties } from 'react';

interface Props {
  className?: string;
  width?: number | string;
  style?: CSSProperties;
}

export function ExplorationAlt({ className, width, style }: Props) {
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
        <linearGradient id="ex-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1f2620" />
          <stop offset="55%" stopColor="#7a5a30" />
          <stop offset="100%" stopColor="#d4a574" />
        </linearGradient>
        <radialGradient id="ex-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fae09a" stopOpacity=".95" />
          <stop offset="100%" stopColor="#e0ad55" stopOpacity="0" />
        </radialGradient>
        <filter id="ex-soft">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <filter id="ex-paper">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="3" />
          <feColorMatrix values="0 0 0 0 0.9  0 0 0 0 0.75  0 0 0 0 0.5  0 0 0 0.08 0" />
        </filter>
      </defs>
      <rect width="90" height="90" fill="url(#ex-sky)" />
      <circle cx="62" cy="50" r="14" fill="url(#ex-sun)" />
      <circle cx="62" cy="50" r="5" fill="#faecbf" opacity=".7" />
      <path d="M0,58 Q20,48 40,52 Q60,46 90,52 L90,90 L0,90 Z" fill="#3d4830" opacity=".75" filter="url(#ex-soft)" />
      <path d="M0,68 Q22,62 45,64 Q65,58 90,64 L90,90 L0,90 Z" fill="#2d3a25" opacity=".95" />
      <path d="M0,80 Q30,76 60,78 Q80,76 90,78 L90,90 L0,90 Z" fill="#10160d" opacity=".95" />
      <rect width="90" height="90" filter="url(#ex-paper)" opacity=".5" />
    </svg>
  );
}
