import type { CSSProperties } from 'react';

interface Props {
  className?: string;
  width?: number | string;
  style?: CSSProperties;
}

export function DungeonAlt({ className, width, style }: Props) {
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
        <linearGradient id="dg-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a1612" />
          <stop offset="100%" stopColor="#0e0c09" />
        </linearGradient>
        <radialGradient id="dg-light" cx="50%" cy="60%" r="55%">
          <stop offset="0%" stopColor="#e0ad55" stopOpacity=".55" />
          <stop offset="60%" stopColor="#a05030" stopOpacity=".15" />
          <stop offset="100%" stopColor="#5a2818" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dg-stone" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3a3530" />
          <stop offset="100%" stopColor="#1a1612" />
        </linearGradient>
        <filter id="dg-soft">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <filter id="dg-paper">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="11" />
          <feColorMatrix values="0 0 0 0 0.7  0 0 0 0 0.65  0 0 0 0 0.55  0 0 0 0.07 0" />
        </filter>
      </defs>
      <rect width="90" height="90" fill="url(#dg-bg)" />
      <ellipse cx="45" cy="62" rx="50" ry="30" fill="url(#dg-light)" filter="url(#dg-soft)" />
      <path d="M28,78 L28,46 Q28,30 45,30 Q62,30 62,46 L62,78 Z" fill="url(#dg-stone)" stroke="#0c0907" strokeWidth=".8" />
      <path d="M32,78 L32,48 Q32,35 45,35 Q58,35 58,48 L58,78 Z" fill="#0a0807" />
      <line x1="28" y1="50" x2="62" y2="50" stroke="#0c0907" strokeWidth=".5" opacity=".6" />
      <line x1="32" y1="62" x2="58" y2="62" stroke="#0c0907" strokeWidth=".5" opacity=".5" />
      <circle cx="45" cy="64" r="3" fill="#fae09a" opacity=".55" filter="url(#dg-soft)" />
      <circle cx="45" cy="64" r="1.5" fill="#fae09a" opacity=".9" />
      <ellipse cx="45" cy="78" rx="22" ry="2" fill="#5a4220" opacity=".25" filter="url(#dg-soft)" />
      <rect width="90" height="90" filter="url(#dg-paper)" opacity=".4" />
    </svg>
  );
}
