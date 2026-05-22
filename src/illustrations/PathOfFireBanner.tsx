import type { CSSProperties } from 'react';

interface Props {
  className?: string;
  width?: number | string;
  style?: CSSProperties;
}

export function PathOfFireBanner({ className, width, style }: Props) {
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
        <linearGradient id="pof-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3a2818" />
          <stop offset="35%" stopColor="#a06838" />
          <stop offset="75%" stopColor="#e0a058" />
          <stop offset="100%" stopColor="#f0c878" />
        </linearGradient>
        <radialGradient id="pof-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fae09a" stopOpacity="1" />
          <stop offset="45%" stopColor="#f4c87a" stopOpacity=".65" />
          <stop offset="100%" stopColor="#e0ad55" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pof-dune-far" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a8743a" />
          <stop offset="100%" stopColor="#7a5028" />
        </linearGradient>
        <linearGradient id="pof-dune-mid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7a5028" />
          <stop offset="100%" stopColor="#4a3018" />
        </linearGradient>
        <linearGradient id="pof-dune-near" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3a2418" />
          <stop offset="100%" stopColor="#1a1208" />
        </linearGradient>
        <filter id="pof-soft">
          <feGaussianBlur stdDeviation="1.8" />
        </filter>
        <filter id="pof-paper" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="43" />
          <feColorMatrix values="0 0 0 0 0.95  0 0 0 0 0.75  0 0 0 0 0.45  0 0 0 0.07 0" />
        </filter>
      </defs>
      <rect width="400" height="74" fill="url(#pof-sky)" />
      <circle cx="200" cy="44" r="32" fill="url(#pof-sun)" />
      <circle cx="200" cy="44" r="14" fill="#faecbf" opacity=".75" />
      <circle cx="200" cy="44" r="6" fill="#fff8df" opacity=".95" />
      <ellipse cx="200" cy="48" rx="180" ry="3" fill="#fae09a" opacity=".35" filter="url(#pof-soft)" />
      <path d="M0,44 L20,42 L20,38 L60,38 L60,44 L120,44 L120,40 L160,40 L160,44 L240,44 L240,40 L290,40 L290,44 L340,44 L340,38 L380,38 L380,44 L400,44 L400,52 L0,52 Z" fill="url(#pof-dune-far)" opacity=".6" filter="url(#pof-soft)" />
      <path d="M0,52 Q60,46 130,50 Q200,44 270,50 Q340,46 400,50 L400,74 L0,74 Z" fill="url(#pof-dune-far)" opacity=".85" />
      <path d="M0,58 Q50,54 100,58 Q160,52 220,58 Q280,54 340,60 Q370,56 400,58 L400,74 L0,74 Z" fill="url(#pof-dune-mid)" />
      <path d="M0,66 Q60,62 130,66 Q200,60 270,66 Q340,62 400,66 L400,74 L0,74 Z" fill="url(#pof-dune-near)" />
      <g fill="#1a1208">
        <line x1="62" y1="72" x2="65" y2="58" stroke="#1a1208" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M65,58 Q58,54 52,56 M65,58 Q68,52 73,52 M65,58 Q60,50 58,46 M65,58 Q70,52 76,50 M65,58 Q63,48 61,44" stroke="#1a1208" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <line x1="336" y1="72" x2="334" y2="56" stroke="#1a1208" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M334,56 Q328,52 322,54 M334,56 Q338,50 343,50 M334,56 Q330,48 327,44 M334,56 Q340,50 346,48 M334,56 Q332,46 330,42" stroke="#1a1208" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </g>
      <path d="M150,22 q3,-2 6,0 q-3,-1 -6,0" fill="none" stroke="#1a1208" strokeWidth="1.2" opacity=".7" />
      <path d="M165,26 q2.5,-1.5 5,0 q-2.5,-.7 -5,0" fill="none" stroke="#1a1208" strokeWidth="1" opacity=".55" />
      <path d="M225,20 q3,-2 6,0 q-3,-1 -6,0" fill="none" stroke="#1a1208" strokeWidth="1.1" opacity=".6" />
      <rect width="400" height="74" filter="url(#pof-paper)" opacity=".45" />
    </svg>
  );
}
