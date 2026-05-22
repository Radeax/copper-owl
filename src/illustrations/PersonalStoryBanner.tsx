import type { CSSProperties } from 'react';

interface Props {
  className?: string;
  width?: number | string;
  style?: CSSProperties;
}

export function PersonalStoryBanner({ className, width, style }: Props) {
  const mergedStyle = width !== undefined ? { ...style, width } : style;
  return (
    <svg
      viewBox="0 0 400 80"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      style={mergedStyle}
    >
      <defs>
        <linearGradient id="ps-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1f1a14" />
          <stop offset="45%" stopColor="#4a3520" />
          <stop offset="80%" stopColor="#8a5a30" />
          <stop offset="100%" stopColor="#c08648" />
        </linearGradient>
        <radialGradient id="ps-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fae09a" stopOpacity=".95" />
          <stop offset="55%" stopColor="#f4a858" stopOpacity=".5" />
          <stop offset="100%" stopColor="#c08648" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ps-ridge" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2a1f14" />
          <stop offset="100%" stopColor="#0c0907" />
        </linearGradient>
        <filter id="ps-soft">
          <feGaussianBlur stdDeviation="1.8" />
        </filter>
        <filter id="ps-paper">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="51" />
          <feColorMatrix values="0 0 0 0 0.9  0 0 0 0 0.75  0 0 0 0 0.5  0 0 0 0.07 0" />
        </filter>
      </defs>
      <rect width="400" height="80" fill="url(#ps-sky)" />
      <ellipse cx="230" cy="56" rx="34" ry="22" fill="url(#ps-sun)" />
      <circle cx="230" cy="56" r="9" fill="#faecbf" opacity=".85" />
      <path d="M0,52 Q40,42 80,48 Q140,38 200,46 Q260,40 320,48 Q360,42 400,46 L400,80 L0,80 Z" fill="#3a2e1c" opacity=".7" filter="url(#ps-soft)" />
      <path d="M0,60 Q50,52 100,56 Q160,48 220,54 Q280,48 340,56 Q380,52 400,54 L400,80 L0,80 Z" fill="url(#ps-ridge)" opacity=".95" />
      <g opacity=".55" filter="url(#ps-soft)">
        <path d="M115,32 Q90,18 60,22 Q70,24 78,30 Q92,28 115,38 Z" fill="#0c0907" />
        <path d="M135,28 Q145,16 165,18 Q155,22 148,28 Q140,26 135,32 Z" fill="#0c0907" />
      </g>
      <g opacity=".95">
        <ellipse cx="320" cy="68" rx="3.5" ry="1.5" fill="#0c0907" />
        <path d="M320,68 L320,52 Q318,49 318,45 Q318,41 320,40 Q322,41 322,45 Q322,49 320,52 Z" fill="#0c0907" />
        <line x1="324" y1="68" x2="324" y2="36" stroke="#0c0907" strokeWidth="1.2" />
        <path d="M324,36 L335,38 L332,42 L335,46 L324,48 Z" fill="#8a5a30" opacity=".85" />
      </g>
      <path d="M0,72 Q100,70 200,73 Q300,71 400,72 L400,80 L0,80 Z" fill="#100c08" />
      <circle cx="160" cy="36" r=".7" fill="#fae09a" opacity=".5" />
      <circle cx="240" cy="32" r=".5" fill="#fae09a" opacity=".4" />
      <circle cx="280" cy="42" r=".6" fill="#fae09a" opacity=".45" />
      <rect width="400" height="80" filter="url(#ps-paper)" opacity=".4" />
    </svg>
  );
}
