import type { CSSProperties } from 'react';

interface Props {
  className?: string;
  width?: number | string;
  style?: CSSProperties;
}

export function PvpAlt({ className, width, style }: Props) {
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
        <radialGradient id="pv-bg" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#4a2818" />
          <stop offset="100%" stopColor="#0a0807" />
        </radialGradient>
        <radialGradient id="pv-clash" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fae09a" stopOpacity=".9" />
          <stop offset="100%" stopColor="#d4a574" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pv-blade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d8d4c8" />
          <stop offset="100%" stopColor="#5a5448" />
        </linearGradient>
        <linearGradient id="pv-hilt" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a8743a" />
          <stop offset="100%" stopColor="#5a3a18" />
        </linearGradient>
        <filter id="pv-soft">
          <feGaussianBlur stdDeviation="1" />
        </filter>
        <filter id="pv-paper">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="5" />
          <feColorMatrix values="0 0 0 0 0.85  0 0 0 0 0.7  0 0 0 0 0.4  0 0 0 0.06 0" />
        </filter>
      </defs>
      <rect width="90" height="90" fill="url(#pv-bg)" />
      <circle cx="45" cy="45" r="28" fill="url(#pv-clash)" filter="url(#pv-soft)" />
      <g transform="translate(45,45) rotate(-32)">
        <rect x="-1.4" y="-26" width="2.8" height="40" fill="url(#pv-blade)" />
        <rect x="-8" y="13" width="16" height="2.5" fill="url(#pv-hilt)" rx=".5" />
        <rect x="-1.2" y="15.5" width="2.4" height="7" fill="#3a2a18" />
        <circle cx="0" cy="24" r="2" fill="url(#pv-hilt)" />
      </g>
      <g transform="translate(45,45) rotate(32)">
        <rect x="-1.2" y="-24" width="2.4" height="48" fill="url(#pv-hilt)" />
        <path d="M1.2,-20 Q10,-17 11.5,-10 Q10,-7 1.2,-8 Z" fill="#9c9486" />
        <path d="M-1.2,-20 Q-10,-17 -11.5,-10 Q-10,-7 -1.2,-8 Z" fill="#5a5448" />
      </g>
      <circle cx="45" cy="45" r="2" fill="#fae09a" />
      <line x1="45" y1="45" x2="38" y2="39" stroke="#fae09a" strokeWidth=".5" opacity=".85" />
      <line x1="45" y1="45" x2="52" y2="39" stroke="#fae09a" strokeWidth=".5" opacity=".85" />
      <rect width="90" height="90" filter="url(#pv-paper)" opacity=".4" />
    </svg>
  );
}
