import type { CSSProperties } from 'react';

interface Props {
  className?: string;
  width?: number | string;
  style?: CSSProperties;
}

export function BeaconsAlt({ className, width, style }: Props) {
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
        <linearGradient id="bc-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1c2230" />
          <stop offset="60%" stopColor="#2d3848" />
          <stop offset="100%" stopColor="#1a1f28" />
        </linearGradient>
        <radialGradient id="bc-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7dd3c0" stopOpacity=".3" />
          <stop offset="100%" stopColor="#7dd3c0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bc-flame" cx="50%" cy="60%" r="60%">
          <stop offset="0%" stopColor="#fae09a" />
          <stop offset="60%" stopColor="#e0ad55" />
          <stop offset="100%" stopColor="#a05030" stopOpacity="0" />
        </radialGradient>
        <filter id="bc-soft">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <filter id="bc-paper">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="31" />
          <feColorMatrix values="0 0 0 0 0.7  0 0 0 0 0.85  0 0 0 0 0.85  0 0 0 0.06 0" />
        </filter>
      </defs>
      <rect width="90" height="90" fill="url(#bc-sky)" />
      <ellipse cx="45" cy="50" rx="42" ry="32" fill="url(#bc-glow)" filter="url(#bc-soft)" />
      <rect x="14" y="48" width="10" height="28" fill="#2a2520" />
      <path d="M12,48 L26,48 L24,44 L14,44 Z" fill="#3a3530" />
      <ellipse cx="19" cy="42" rx="6" ry="5" fill="url(#bc-flame)" filter="url(#bc-soft)" />
      <ellipse cx="19" cy="42" rx="3" ry="3" fill="#fae09a" />
      <rect x="40" y="36" width="10" height="40" fill="#2a2520" />
      <path d="M38,36 L52,36 L50,32 L40,32 Z" fill="#3a3530" />
      <ellipse cx="45" cy="30" rx="7" ry="6" fill="url(#bc-flame)" filter="url(#bc-soft)" />
      <ellipse cx="45" cy="30" rx="3.5" ry="3.5" fill="#fae09a" />
      <rect x="66" y="50" width="10" height="26" fill="#2a2520" />
      <path d="M64,50 L78,50 L76,46 L66,46 Z" fill="#3a3530" />
      <ellipse cx="71" cy="44" rx="6" ry="5" fill="url(#bc-flame)" filter="url(#bc-soft)" />
      <ellipse cx="71" cy="44" rx="3" ry="3" fill="#fae09a" />
      <path d="M19,42 Q32,30 45,30" fill="none" stroke="#7dd3c0" strokeWidth=".8" opacity=".7" strokeDasharray="2,2" />
      <path d="M45,30 Q58,32 71,44" fill="none" stroke="#7dd3c0" strokeWidth=".8" opacity=".7" strokeDasharray="2,2" />
      <path d="M0,76 L90,76 L90,90 L0,90 Z" fill="#10160d" />
      <rect width="90" height="90" filter="url(#bc-paper)" opacity=".4" />
    </svg>
  );
}
