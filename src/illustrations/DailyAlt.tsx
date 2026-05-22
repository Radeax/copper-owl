import type { CSSProperties } from 'react';

interface Props {
  className?: string;
  width?: number | string;
  style?: CSSProperties;
}

export function DailyAlt({ className, width, style }: Props) {
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
        <linearGradient id="dy-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2a2436" />
          <stop offset="100%" stopColor="#1c1818" />
        </linearGradient>
        <radialGradient id="dy-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d4a8ee" stopOpacity=".35" />
          <stop offset="100%" stopColor="#7a4fa0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dy-rune" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fae09a" />
          <stop offset="100%" stopColor="#e0ad55" />
        </linearGradient>
        <filter id="dy-soft">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <filter id="dy-paper">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="13" />
          <feColorMatrix values="0 0 0 0 0.8  0 0 0 0 0.7  0 0 0 0 0.85  0 0 0 0.06 0" />
        </filter>
      </defs>
      <rect width="90" height="90" fill="url(#dy-bg)" />
      <circle cx="45" cy="45" r="35" fill="url(#dy-glow)" filter="url(#dy-soft)" />
      <circle cx="45" cy="45" r="26" fill="none" stroke="url(#dy-rune)" strokeWidth="1.2" opacity=".85" />
      <circle cx="45" cy="45" r="20" fill="none" stroke="url(#dy-rune)" strokeWidth=".6" opacity=".5" />
      <g stroke="url(#dy-rune)" strokeWidth="1.4" strokeLinecap="round">
        <line x1="45" y1="18" x2="45" y2="22" />
        <line x1="66.5" y1="29" x2="64" y2="32.5" />
        <line x1="71" y1="51" x2="67" y2="50" />
        <line x1="58" y1="69" x2="56" y2="65.5" />
        <line x1="32" y1="69" x2="34" y2="65.5" />
        <line x1="19" y1="51" x2="23" y2="50" />
        <line x1="23.5" y1="29" x2="26" y2="32.5" />
      </g>
      <circle cx="45" cy="20" r="2.5" fill="#7dd3c0" filter="url(#dy-soft)" />
      <circle cx="45" cy="20" r="1.5" fill="#fae09a" />
      <line x1="45" y1="45" x2="45" y2="24" stroke="url(#dy-rune)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="45" cy="45" r="3" fill="#3a2818" stroke="url(#dy-rune)" strokeWidth="1" />
      <circle cx="45" cy="45" r="1" fill="#fae09a" />
      <g fill="#7dd3c0" opacity=".85">
        <circle cx="64" cy="35" r="1.5" />
        <circle cx="69" cy="51" r="1.5" />
        <circle cx="57" cy="67" r="1.5" />
      </g>
      <rect width="90" height="90" filter="url(#dy-paper)" opacity=".4" />
    </svg>
  );
}
