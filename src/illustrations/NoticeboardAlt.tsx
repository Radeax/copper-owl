import type { CSSProperties } from 'react';

interface Props {
  className?: string;
  width?: number | string;
  style?: CSSProperties;
}

export function NoticeboardAlt({ className, width, style }: Props) {
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
        <linearGradient id="nb-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1f1d1a" />
          <stop offset="100%" stopColor="#2a2520" />
        </linearGradient>
        <linearGradient id="nb-wood" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a3a18" />
          <stop offset="50%" stopColor="#3a2818" />
          <stop offset="100%" stopColor="#2a1e16" />
        </linearGradient>
        <linearGradient id="nb-paper2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d8c89c" />
          <stop offset="100%" stopColor="#a8945c" />
        </linearGradient>
        <filter id="nb-soft">
          <feGaussianBlur stdDeviation="1" />
        </filter>
        <filter id="nb-paper">
          <feTurbulence type="fractalNoise" baseFrequency="0.92" numOctaves="2" seed="29" />
          <feColorMatrix values="0 0 0 0 0.85  0 0 0 0 0.7  0 0 0 0 0.5  0 0 0 0.06 0" />
        </filter>
      </defs>
      <rect width="90" height="90" fill="url(#nb-bg)" />
      <rect x="10" y="14" width="70" height="62" fill="url(#nb-wood)" rx="2" />
      <line x1="10" y1="28" x2="80" y2="28" stroke="#1a1208" strokeWidth=".3" opacity=".4" />
      <line x1="10" y1="42" x2="80" y2="42" stroke="#1a1208" strokeWidth=".3" opacity=".4" />
      <line x1="10" y1="56" x2="80" y2="56" stroke="#1a1208" strokeWidth=".3" opacity=".4" />
      <g>
        <rect x="16" y="20" width="26" height="22" fill="url(#nb-paper2)" transform="rotate(-3 29 31)" stroke="#5a4220" strokeWidth=".3" />
        <line x1="20" y1="26" x2="38" y2="25" stroke="#3a2818" strokeWidth=".3" opacity=".7" transform="rotate(-3 29 31)" />
        <line x1="20" y1="31" x2="36" y2="30" stroke="#3a2818" strokeWidth=".3" opacity=".6" transform="rotate(-3 29 31)" />
        <line x1="20" y1="36" x2="38" y2="35" stroke="#3a2818" strokeWidth=".3" opacity=".55" transform="rotate(-3 29 31)" />
        <circle cx="29" cy="22" r="1.5" fill="#a8443a" />
      </g>
      <g>
        <rect x="48" y="22" width="26" height="22" fill="url(#nb-paper2)" transform="rotate(2 61 33)" stroke="#5a4220" strokeWidth=".3" />
        <line x1="52" y1="28" x2="70" y2="28" stroke="#3a2818" strokeWidth=".3" opacity=".7" transform="rotate(2 61 33)" />
        <line x1="52" y1="33" x2="68" y2="33" stroke="#3a2818" strokeWidth=".3" opacity=".6" transform="rotate(2 61 33)" />
        <line x1="52" y1="38" x2="70" y2="38" stroke="#3a2818" strokeWidth=".3" opacity=".55" transform="rotate(2 61 33)" />
        <circle cx="61" cy="24" r="1.5" fill="#a8443a" />
      </g>
      <g>
        <rect x="28" y="48" width="34" height="22" fill="url(#nb-paper2)" stroke="#7a5a30" strokeWidth=".5" />
        <path d="M28,48 Q32,46 36,48" fill="none" stroke="#7a5a30" strokeWidth=".3" opacity=".7" />
        <line x1="32" y1="54" x2="58" y2="54" stroke="#3a2818" strokeWidth=".4" opacity=".8" />
        <line x1="32" y1="59" x2="56" y2="59" stroke="#3a2818" strokeWidth=".4" opacity=".7" />
        <line x1="32" y1="64" x2="58" y2="64" stroke="#3a2818" strokeWidth=".4" opacity=".7" />
        <circle cx="56" cy="64" r="3" fill="#a8443a" />
        <circle cx="56" cy="64" r="1.5" fill="#6e2820" />
        <circle cx="45" cy="50" r="1.8" fill="#e0ad55" stroke="#3a2818" strokeWidth=".3" />
      </g>
      <rect width="90" height="90" filter="url(#nb-paper)" opacity=".4" />
    </svg>
  );
}
