import type { CSSProperties } from 'react';

interface Props {
  className?: string;
  width?: number | string;
  style?: CSSProperties;
}

export function OpenWorldMode({ className, width, style }: Props) {
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
        <linearGradient id="ow-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1f2620" />
          <stop offset="35%" stopColor="#5a4828" />
          <stop offset="75%" stopColor="#c08a4a" />
          <stop offset="100%" stopColor="#dba558" />
        </linearGradient>
        <radialGradient id="ow-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fae09a" stopOpacity=".95" />
          <stop offset="55%" stopColor="#f4c87a" stopOpacity=".5" />
          <stop offset="100%" stopColor="#e0ad55" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ow-far" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a6b48" stopOpacity=".8" />
          <stop offset="100%" stopColor="#3d4830" stopOpacity=".7" />
        </linearGradient>
        <linearGradient id="ow-mid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2d3a25" />
          <stop offset="100%" stopColor="#181f14" />
        </linearGradient>
        <filter id="ow-soft">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <filter id="ow-paper" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="3" />
          <feColorMatrix values="0 0 0 0 0.9  0 0 0 0 0.75  0 0 0 0 0.5  0 0 0 0.08 0" />
        </filter>
      </defs>
      <rect width="400" height="80" fill="url(#ow-sky)" />
      <circle cx="285" cy="46" r="26" fill="url(#ow-sun)" />
      <circle cx="285" cy="46" r="10" fill="#faecbf" opacity=".7" />
      <ellipse cx="285" cy="40" rx="55" ry="3" fill="#f4c87a" opacity=".35" filter="url(#ow-soft)" />
      <path d="M0,48 Q60,36 110,42 Q170,32 230,40 Q290,34 350,42 L400,40 L400,80 L0,80 Z" fill="url(#ow-far)" filter="url(#ow-soft)" />
      <path d="M0,58 Q50,50 100,54 Q160,46 215,52 Q275,46 330,56 Q370,50 400,54 L400,80 L0,80 Z" fill="url(#ow-mid)" opacity=".95" />
      <path d="M0,68 Q80,62 160,66 Q240,60 320,68 L400,66 L400,80 L0,80 Z" fill="#10160d" opacity=".95" />
      <path d="M150,20 q3,-2 6,0 q-3,-1 -6,0" fill="none" stroke="#0d0a06" strokeWidth="1.2" opacity=".7" />
      <path d="M165,24 q2.5,-1.5 5,0 q-2.5,-.7 -5,0" fill="none" stroke="#0d0a06" strokeWidth="1" opacity=".55" />
      <rect width="400" height="80" filter="url(#ow-paper)" opacity=".5" />
    </svg>
  );
}
