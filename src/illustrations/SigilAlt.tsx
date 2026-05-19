import type { CSSProperties } from 'react';

interface Props {
  className?: string;
  width?: number | string;
  style?: CSSProperties;
}

export function SigilAlt({ className, width, style }: Props) {
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
        <radialGradient id="sg-bg" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#3a2d56" />
          <stop offset="100%" stopColor="#0e0816" />
        </radialGradient>
        <radialGradient id="sg-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d4a8ee" stopOpacity=".4" />
          <stop offset="100%" stopColor="#7a4fa0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sg-metal" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e0ad55" />
          <stop offset="100%" stopColor="#7a5a30" />
        </linearGradient>
        <filter id="sg-soft">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <filter id="sg-paper">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="33" />
          <feColorMatrix values="0 0 0 0 0.8  0 0 0 0 0.7  0 0 0 0 0.85  0 0 0 0.06 0" />
        </filter>
      </defs>
      <rect width="90" height="90" fill="url(#sg-bg)" />
      <circle cx="45" cy="45" r="35" fill="url(#sg-glow)" filter="url(#sg-soft)" />
      <circle cx="45" cy="45" r="26" fill="none" stroke="url(#sg-metal)" strokeWidth="1.5" opacity=".85" />
      <circle cx="45" cy="45" r="20" fill="none" stroke="url(#sg-metal)" strokeWidth=".8" opacity=".6" />
      <g stroke="url(#sg-metal)" strokeWidth="1.2" strokeLinecap="round">
        <line x1="45" y1="17" x2="45" y2="22" />
        <line x1="45" y1="68" x2="45" y2="73" />
        <line x1="17" y1="45" x2="22" y2="45" />
        <line x1="68" y1="45" x2="73" y2="45" />
      </g>
      <g fill="url(#sg-metal)" stroke="#3a2818" strokeWidth=".3">
        <path d="M45,32 L52,42 L48,42 L48,52 L52,52 L45,60 L38,52 L42,52 L42,42 L38,42 Z" />
      </g>
      <text x="45" y="14" fontFamily="Cinzel,serif" fontSize="6" fontWeight="700" fill="#d4a8ee" textAnchor="middle" opacity=".7">✦</text>
      <text x="45" y="82" fontFamily="Cinzel,serif" fontSize="6" fontWeight="700" fill="#d4a8ee" textAnchor="middle" opacity=".7">✦</text>
      <text x="14" y="48" fontFamily="Cinzel,serif" fontSize="6" fontWeight="700" fill="#d4a8ee" textAnchor="middle" opacity=".55">✦</text>
      <text x="76" y="48" fontFamily="Cinzel,serif" fontSize="6" fontWeight="700" fill="#d4a8ee" textAnchor="middle" opacity=".55">✦</text>
      <rect width="90" height="90" filter="url(#sg-paper)" opacity=".4" />
    </svg>
  );
}
