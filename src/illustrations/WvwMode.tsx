import type { CSSProperties } from 'react';

interface Props {
  className?: string;
  width?: number | string;
  style?: CSSProperties;
}

export function WvwMode({ className, width, style }: Props) {
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
        <linearGradient id="wvw-storm" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a1f28" />
          <stop offset="50%" stopColor="#2d3848" />
          <stop offset="100%" stopColor="#3a4452" />
        </linearGradient>
        <radialGradient id="wvw-firelight" cx="50%" cy="80%" r="55%">
          <stop offset="0%" stopColor="#e0ad55" stopOpacity=".55" />
          <stop offset="60%" stopColor="#a05030" stopOpacity=".2" />
          <stop offset="100%" stopColor="#5a2818" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="wvw-keep" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3a4250" />
          <stop offset="100%" stopColor="#1a1f28" />
        </linearGradient>
        <linearGradient id="wvw-banner" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a8443a" />
          <stop offset="100%" stopColor="#6e2820" />
        </linearGradient>
        <filter id="wvw-soft">
          <feGaussianBlur stdDeviation="1.8" />
        </filter>
        <filter id="wvw-glow">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id="wvw-paper" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="11" />
          <feColorMatrix values="0 0 0 0 0.6  0 0 0 0 0.7  0 0 0 0 0.85  0 0 0 0.08 0" />
        </filter>
      </defs>
      <rect width="400" height="80" fill="url(#wvw-storm)" />
      <ellipse cx="80" cy="18" rx="80" ry="8" fill="#161a22" opacity=".75" filter="url(#wvw-soft)" />
      <ellipse cx="290" cy="14" rx="100" ry="9" fill="#161a22" opacity=".8" filter="url(#wvw-soft)" />
      <ellipse cx="200" cy="28" rx="90" ry="6" fill="#161a22" opacity=".55" filter="url(#wvw-soft)" />
      <ellipse cx="200" cy="72" rx="200" ry="35" fill="url(#wvw-firelight)" filter="url(#wvw-glow)" />
      <g opacity=".4" filter="url(#wvw-soft)">
        <path d="M22,62 L22,55 L28,55 L28,52 L32,52 L32,55 L38,55 L38,62 Z" fill="url(#wvw-keep)" />
        <path d="M362,62 L362,55 L368,55 L368,52 L372,52 L372,55 L378,55 L378,62 Z" fill="url(#wvw-keep)" />
      </g>
      <path d="M70,68 L70,52 L78,52 L78,46 L84,46 L84,50 L90,50 L90,46 L96,46 L96,50 L104,50 L104,46 L110,46 L110,52 L118,52 L118,68 Z" fill="url(#wvw-keep)" opacity=".8" />
      <line x1="94" y1="46" x2="94" y2="33" stroke="#0a0c10" strokeWidth="1.3" />
      <path d="M94,33 L107,36 L103,40 L107,44 L94,47 Z" fill="url(#wvw-banner)" opacity=".85" />
      <path d="M282,68 L282,52 L290,52 L290,46 L296,46 L296,50 L302,50 L302,46 L308,46 L308,50 L316,50 L316,46 L322,46 L322,52 L330,52 L330,68 Z" fill="url(#wvw-keep)" opacity=".8" />
      <line x1="306" y1="46" x2="306" y2="33" stroke="#0a0c10" strokeWidth="1.3" />
      <path d="M306,33 L319,36 L315,40 L319,44 L306,47 Z" fill="url(#wvw-banner)" opacity=".85" />
      <path d="M148,72 L148,40 L160,40 L160,30 L166,30 L166,38 L174,38 L174,30 L182,30 L182,38 L190,38 L190,30 L198,30 L198,38 L206,38 L206,30 L214,30 L214,38 L222,38 L222,30 L230,30 L230,38 L240,38 L240,40 L252,40 L252,72 Z" fill="url(#wvw-keep)" />
      <line x1="200" y1="30" x2="200" y2="12" stroke="#0a0c10" strokeWidth="2" />
      <path d="M200,12 L222,16 L217,22 L222,28 L200,32 Z" fill="url(#wvw-banner)" />
      <path d="M0,68 Q100,67 200,69 Q300,67 400,68 L400,80 L0,80 Z" fill="#100c08" />
      <circle cx="158" cy="22" r="1" fill="#fae09a" opacity=".8" />
      <circle cx="245" cy="18" r=".8" fill="#fae09a" opacity=".7" />
      <circle cx="225" cy="26" r="1.2" fill="#fae09a" opacity=".85" />
      <rect width="400" height="80" filter="url(#wvw-paper)" opacity=".4" />
    </svg>
  );
}
