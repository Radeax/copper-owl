import type { CSSProperties } from 'react';

interface Props {
  className?: string;
  width?: number | string;
  style?: CSSProperties;
}

export function GuildBannerAlt({ className, width, style }: Props) {
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
        <linearGradient id="gb-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1c2230" />
          <stop offset="100%" stopColor="#0e1218" />
        </linearGradient>
        <radialGradient id="gb-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7aa3c0" stopOpacity=".25" />
          <stop offset="100%" stopColor="#7aa3c0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="gb-banner" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3a5570" />
          <stop offset="100%" stopColor="#1c2c40" />
        </linearGradient>
        <linearGradient id="gb-emblem" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e0ad55" />
          <stop offset="100%" stopColor="#7a5a30" />
        </linearGradient>
        <filter id="gb-soft">
          <feGaussianBlur stdDeviation="1" />
        </filter>
        <filter id="gb-paper">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="23" />
          <feColorMatrix values="0 0 0 0 0.7  0 0 0 0 0.8  0 0 0 0 0.9  0 0 0 0.06 0" />
        </filter>
      </defs>
      <rect width="90" height="90" fill="url(#gb-bg)" />
      <circle cx="45" cy="45" r="35" fill="url(#gb-glow)" filter="url(#gb-soft)" />
      <line x1="16" y1="18" x2="74" y2="18" stroke="#5a5448" strokeWidth="1.5" />
      <circle cx="16" cy="18" r="2" fill="#5a5448" />
      <circle cx="74" cy="18" r="2" fill="#5a5448" />
      <path d="M22,18 L68,18 L68,68 L60,76 L52,68 L45,76 L38,68 L30,76 L22,68 Z" fill="url(#gb-banner)" stroke="#0c0907" strokeWidth=".5" />
      <path d="M45,30 L55,33 L55,45 Q55,52 45,57 Q35,52 35,45 L35,33 Z" fill="url(#gb-emblem)" stroke="#3a2818" strokeWidth=".5" />
      <line x1="45" y1="37" x2="45" y2="50" stroke="#3a2818" strokeWidth="1.2" />
      <line x1="41" y1="43" x2="49" y2="43" stroke="#3a2818" strokeWidth="1.2" />
      <circle cx="32" cy="63" r="1.2" fill="#a39e94" opacity=".7" />
      <circle cx="38" cy="63" r="1.2" fill="#a39e94" opacity=".7" />
      <circle cx="44" cy="63" r="1.2" fill="#a39e94" opacity=".7" />
      <circle cx="50" cy="63" r="1.2" fill="#a39e94" opacity=".7" />
      <circle cx="56" cy="63" r="1.2" fill="#a39e94" opacity=".7" />
      <rect width="90" height="90" filter="url(#gb-paper)" opacity=".4" />
    </svg>
  );
}
