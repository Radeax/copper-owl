import type { CSSProperties } from 'react';

interface Props {
  className?: string;
  width?: number | string;
  style?: CSSProperties;
}

export function ScrollAlt({ className, width, style }: Props) {
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
        <linearGradient id="sc-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1f1d1a" />
          <stop offset="100%" stopColor="#2a2520" />
        </linearGradient>
        <radialGradient id="sc-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7dd3c0" stopOpacity=".25" />
          <stop offset="100%" stopColor="#7dd3c0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sc-paper2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d8c89c" />
          <stop offset="100%" stopColor="#a8945c" />
        </linearGradient>
        <filter id="sc-soft">
          <feGaussianBlur stdDeviation="1" />
        </filter>
        <filter id="sc-paper">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="21" />
          <feColorMatrix values="0 0 0 0 0.85  0 0 0 0 0.7  0 0 0 0 0.5  0 0 0 0.06 0" />
        </filter>
      </defs>
      <rect width="90" height="90" fill="url(#sc-bg)" />
      <circle cx="45" cy="45" r="30" fill="url(#sc-glow)" filter="url(#sc-soft)" />
      <path d="M18,28 Q18,22 24,22 L66,22 Q72,22 72,28 L72,62 Q72,68 66,68 L24,68 Q18,68 18,62 Z" fill="url(#sc-paper2)" stroke="#5a4220" strokeWidth=".6" />
      <path d="M18,28 Q24,26 30,28 Q40,26 50,28 Q60,26 72,28" fill="none" stroke="#7a5a30" strokeWidth=".4" opacity=".6" />
      <path d="M18,62 Q24,64 30,62 Q40,64 50,62 Q60,64 72,62" fill="none" stroke="#7a5a30" strokeWidth=".4" opacity=".6" />
      <line x1="26" y1="34" x2="64" y2="34" stroke="#3a2818" strokeWidth=".5" opacity=".8" />
      <line x1="26" y1="40" x2="60" y2="40" stroke="#3a2818" strokeWidth=".4" opacity=".7" />
      <line x1="26" y1="46" x2="64" y2="46" stroke="#3a2818" strokeWidth=".4" opacity=".7" />
      <line x1="26" y1="52" x2="58" y2="52" stroke="#3a2818" strokeWidth=".4" opacity=".65" />
      <line x1="26" y1="58" x2="62" y2="58" stroke="#3a2818" strokeWidth=".4" opacity=".6" />
      <circle cx="56" cy="56" r="4" fill="#a8443a" opacity=".9" />
      <circle cx="56" cy="56" r="2" fill="#6e2820" />
      <rect width="90" height="90" filter="url(#sc-paper)" opacity=".4" />
    </svg>
  );
}
