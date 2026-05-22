import type { CSSProperties } from 'react';

interface Props {
  className?: string;
  width?: number | string;
  style?: CSSProperties;
}

export function MountAlt({ className, width, style }: Props) {
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
        <linearGradient id="mt-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2a1e16" />
          <stop offset="100%" stopColor="#d4a574" />
        </linearGradient>
        <radialGradient id="mt-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fae09a" stopOpacity=".9" />
          <stop offset="100%" stopColor="#e0ad55" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="mt-raptor" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3a2520" />
          <stop offset="100%" stopColor="#0c0907" />
        </linearGradient>
        <filter id="mt-soft">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <filter id="mt-paper">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="9" />
          <feColorMatrix values="0 0 0 0 0.9  0 0 0 0 0.75  0 0 0 0 0.5  0 0 0 0.07 0" />
        </filter>
      </defs>
      <rect width="90" height="90" fill="url(#mt-sky)" />
      <circle cx="68" cy="38" r="16" fill="url(#mt-sun)" />
      <path d="M0,55 Q20,48 45,52 Q65,46 90,52 L90,90 L0,90 Z" fill="#5a4220" opacity=".65" filter="url(#mt-soft)" />
      <path d="M0,65 Q22,60 45,62 Q65,58 90,62 L90,90 L0,90 Z" fill="#3a2818" opacity=".85" />
      <ellipse cx="42" cy="70" rx="14" ry="6" fill="url(#mt-raptor)" transform="rotate(-8 42 70)" />
      <path d="M52,68 Q60,60 64,58 Q66,60 64,64 Q62,66 56,68 Z" fill="url(#mt-raptor)" />
      <path d="M30,70 Q22,72 18,76 Q20,74 26,72 Q30,71 32,70 Z" fill="url(#mt-raptor)" />
      <line x1="44" y1="74" x2="42" y2="82" stroke="#0c0907" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="48" y1="75" x2="50" y2="82" stroke="#0c0907" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="36" y1="73" x2="30" y2="78" stroke="#0c0907" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="30" cy="82" rx="10" ry="2" fill="#a8743a" opacity=".4" filter="url(#mt-soft)" />
      <rect width="90" height="90" filter="url(#mt-paper)" opacity=".4" />
    </svg>
  );
}
