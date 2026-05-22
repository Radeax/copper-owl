import type { CSSProperties } from 'react';

interface Props {
  className?: string;
  width?: number | string;
  style?: CSSProperties;
}

export function InstancedMode({ className, width, style }: Props) {
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
        <radialGradient id="in-cosmos" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#4a2d6c" />
          <stop offset="55%" stopColor="#251635" />
          <stop offset="100%" stopColor="#0e0816" />
        </radialGradient>
        <radialGradient id="in-energy" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d4a8ee" stopOpacity=".8" />
          <stop offset="55%" stopColor="#9b6fc0" stopOpacity=".35" />
          <stop offset="100%" stopColor="#7a4fa0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="in-frag" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c89fea" stopOpacity=".95" />
          <stop offset="100%" stopColor="#7a5a9c" stopOpacity=".75" />
        </linearGradient>
        <filter id="in-glow">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id="in-soft">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <filter id="in-paper" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
          <feColorMatrix values="0 0 0 0 0.7  0 0 0 0 0.55  0 0 0 0 0.85  0 0 0 0.07 0" />
        </filter>
      </defs>
      <rect width="400" height="80" fill="url(#in-cosmos)" />
      <ellipse cx="120" cy="35" rx="110" ry="35" fill="#5a3580" opacity=".4" filter="url(#in-glow)" />
      <ellipse cx="290" cy="48" rx="100" ry="32" fill="#7a4a9e" opacity=".35" filter="url(#in-glow)" />
      <circle cx="50" cy="15" r=".8" fill="#fff" opacity=".75" />
      <circle cx="100" cy="10" r=".6" fill="#fff" opacity=".6" />
      <circle cx="190" cy="18" r=".8" fill="#fff" opacity=".7" />
      <circle cx="255" cy="8" r="1" fill="#fff" opacity=".85" />
      <circle cx="340" cy="14" r=".7" fill="#fff" opacity=".65" />
      <circle cx="375" cy="28" r=".5" fill="#fff" opacity=".5" />
      <circle cx="22" cy="50" r=".7" fill="#fff" opacity=".55" />
      <circle cx="385" cy="58" r=".6" fill="#fff" opacity=".5" />
      <circle cx="200" cy="40" r="40" fill="url(#in-energy)" filter="url(#in-soft)" />
      <g filter="url(#in-soft)">
        <polygon points="200,18 224,32 224,54 200,68 176,54 176,32" fill="url(#in-frag)" opacity=".9" />
        <polygon points="200,26 218,36 218,52 200,62 182,52 182,36" fill="#2a1a3d" opacity=".75" stroke="#d4a8ee" strokeWidth=".8" />
      </g>
      <polygon points="200,34 211,40 211,50 200,56 189,50 189,40" fill="none" stroke="#fae09a" strokeWidth="1" opacity=".95" />
      <circle cx="200" cy="45" r="2.5" fill="#fae09a" opacity=".95" />
      <polygon points="90,32 102,40 102,52 90,60 78,52 78,40" fill="url(#in-frag)" opacity=".5" filter="url(#in-soft)" />
      <polygon points="310,36 322,44 322,54 310,62 298,54 298,44" fill="url(#in-frag)" opacity=".5" filter="url(#in-soft)" />
      <polygon points="40,55 48,60 48,68 40,73 32,68 32,60" fill="url(#in-frag)" opacity=".35" filter="url(#in-soft)" />
      <polygon points="360,60 368,65 368,73 360,78 352,73 352,65" fill="url(#in-frag)" opacity=".35" filter="url(#in-soft)" />
      <line x1="102" y1="46" x2="176" y2="40" stroke="#d4a8ee" strokeWidth=".7" opacity=".5" strokeDasharray="2,3" />
      <line x1="224" y1="40" x2="298" y2="48" stroke="#d4a8ee" strokeWidth=".7" opacity=".5" strokeDasharray="2,3" />
      <rect width="400" height="80" filter="url(#in-paper)" opacity=".4" />
    </svg>
  );
}
