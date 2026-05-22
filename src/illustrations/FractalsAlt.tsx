import type { CSSProperties } from 'react';

interface Props {
  className?: string;
  width?: number | string;
  style?: CSSProperties;
}

export function FractalsAlt({ className, width, style }: Props) {
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
        <radialGradient id="fr-bg" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#4a2d6c" />
          <stop offset="100%" stopColor="#0e0816" />
        </radialGradient>
        <radialGradient id="fr-energy" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d4a8ee" stopOpacity=".8" />
          <stop offset="100%" stopColor="#7a4fa0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fr-hex" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c89fea" />
          <stop offset="100%" stopColor="#7a5a9c" />
        </linearGradient>
        <filter id="fr-soft">
          <feGaussianBlur stdDeviation="1" />
        </filter>
        <filter id="fr-paper">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
          <feColorMatrix values="0 0 0 0 0.7  0 0 0 0 0.55  0 0 0 0 0.85  0 0 0 0.06 0" />
        </filter>
      </defs>
      <rect width="90" height="90" fill="url(#fr-bg)" />
      <circle cx="45" cy="45" r="35" fill="url(#fr-energy)" filter="url(#fr-soft)" />
      <circle cx="15" cy="18" r=".6" fill="#fff" opacity=".7" />
      <circle cx="72" cy="22" r=".5" fill="#fff" opacity=".6" />
      <circle cx="18" cy="68" r=".5" fill="#fff" opacity=".55" />
      <circle cx="78" cy="72" r=".6" fill="#fff" opacity=".65" />
      <polygon points="45,18 67,30 67,55 45,68 23,55 23,30" fill="url(#fr-hex)" opacity=".85" filter="url(#fr-soft)" />
      <polygon points="45,26 60,34 60,52 45,60 30,52 30,34" fill="#2a1a3d" opacity=".75" stroke="#d4a8ee" strokeWidth=".6" />
      <polygon points="45,34 53,38 53,48 45,53 37,48 37,38" fill="none" stroke="#fae09a" strokeWidth=".7" opacity=".9" />
      <circle cx="45" cy="44" r="2" fill="#fae09a" opacity=".95" />
      <rect width="90" height="90" filter="url(#fr-paper)" opacity=".4" />
    </svg>
  );
}
