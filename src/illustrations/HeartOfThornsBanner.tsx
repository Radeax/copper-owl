import type { CSSProperties } from 'react';

interface Props {
  className?: string;
  width?: number | string;
  style?: CSSProperties;
}

export function HeartOfThornsBanner({ className, width, style }: Props) {
  const mergedStyle = width !== undefined ? { ...style, width } : style;
  return (
    <svg
      viewBox="0 0 400 74"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      style={mergedStyle}
    >
      <defs>
        <linearGradient id="hot-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a2818" />
          <stop offset="50%" stopColor="#2d4a28" />
          <stop offset="100%" stopColor="#4a6838" />
        </linearGradient>
        <radialGradient id="hot-mist" cx="50%" cy="60%" r="70%">
          <stop offset="0%" stopColor="#a8c884" stopOpacity=".25" />
          <stop offset="100%" stopColor="#5a8048" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hot-canopy" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3a5828" />
          <stop offset="100%" stopColor="#1a2812" />
        </linearGradient>
        <linearGradient id="hot-foreground" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a2812" />
          <stop offset="100%" stopColor="#0c1208" />
        </linearGradient>
        <filter id="hot-soft">
          <feGaussianBlur stdDeviation="1.8" />
        </filter>
        <filter id="hot-paper" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.88" numOctaves="2" seed="41" />
          <feColorMatrix values="0 0 0 0 0.65  0 0 0 0 0.8  0 0 0 0 0.5  0 0 0 0.07 0" />
        </filter>
      </defs>
      <rect width="400" height="74" fill="url(#hot-sky)" />
      <ellipse cx="200" cy="40" rx="280" ry="22" fill="url(#hot-mist)" filter="url(#hot-soft)" />
      <path d="M0,32 Q40,20 80,28 Q120,16 160,26 Q200,18 240,24 Q280,16 320,26 Q360,20 400,28 L400,74 L0,74 Z" fill="url(#hot-canopy)" opacity=".7" filter="url(#hot-soft)" />
      <path d="M0,44 Q35,34 70,40 Q110,30 145,38 Q185,32 220,38 Q260,30 295,40 Q335,32 370,40 L400,38 L400,74 L0,74 Z" fill="url(#hot-canopy)" opacity=".9" />
      <g opacity=".95">
        <ellipse cx="40" cy="42" rx="22" ry="14" fill="url(#hot-foreground)" />
        <rect x="38" y="42" width="4" height="32" fill="#0c1208" />
        <ellipse cx="110" cy="38" rx="26" ry="18" fill="url(#hot-foreground)" />
        <rect x="108" y="38" width="4" height="36" fill="#0c1208" />
        <ellipse cx="200" cy="44" rx="24" ry="15" fill="url(#hot-foreground)" />
        <rect x="198" y="44" width="4" height="30" fill="#0c1208" />
        <ellipse cx="285" cy="38" rx="28" ry="18" fill="url(#hot-foreground)" />
        <rect x="283" y="38" width="4" height="36" fill="#0c1208" />
        <ellipse cx="365" cy="44" rx="22" ry="14" fill="url(#hot-foreground)" />
        <rect x="363" y="44" width="4" height="30" fill="#0c1208" />
      </g>
      <g stroke="#1a2812" strokeWidth="1" fill="none" opacity=".85">
        <path d="M40,42 Q42,52 40,62" />
        <path d="M110,38 Q115,52 112,64" />
        <path d="M200,44 Q198,56 200,68" />
        <path d="M285,38 Q288,52 285,64" />
        <path d="M365,44 Q368,56 365,68" />
      </g>
      <circle cx="75" cy="20" r="1.5" fill="#c4e89c" opacity=".6" filter="url(#hot-soft)" />
      <circle cx="155" cy="14" r="1.2" fill="#c4e89c" opacity=".55" filter="url(#hot-soft)" />
      <circle cx="245" cy="18" r="1.3" fill="#c4e89c" opacity=".55" filter="url(#hot-soft)" />
      <circle cx="325" cy="16" r="1.4" fill="#c4e89c" opacity=".5" filter="url(#hot-soft)" />
      <circle cx="160" cy="50" r=".7" fill="#fae09a" opacity=".7" />
      <circle cx="245" cy="48" r=".5" fill="#fae09a" opacity=".55" />
      <circle cx="330" cy="54" r=".6" fill="#fae09a" opacity=".6" />
      <rect width="400" height="74" filter="url(#hot-paper)" opacity=".45" />
    </svg>
  );
}
