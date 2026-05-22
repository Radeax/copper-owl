import type { CSSProperties } from 'react';

interface Props {
  className?: string;
  width?: number | string;
  style?: CSSProperties;
}

export function PvpMode({ className, width, style }: Props) {
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
        <radialGradient id="pvpm-spot" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#4a2818" />
          <stop offset="55%" stopColor="#1f1410" />
          <stop offset="100%" stopColor="#0a0807" />
        </radialGradient>
        <radialGradient id="pvpm-clash" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fae09a" stopOpacity=".9" />
          <stop offset="40%" stopColor="#f4c87a" stopOpacity=".5" />
          <stop offset="100%" stopColor="#d4a574" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pvpm-blade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d8d4c8" />
          <stop offset="50%" stopColor="#9c9486" />
          <stop offset="100%" stopColor="#5a5448" />
        </linearGradient>
        <linearGradient id="pvpm-hilt" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a8743a" />
          <stop offset="100%" stopColor="#5a3a18" />
        </linearGradient>
        <linearGradient id="pvpm-axe" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#b8b0a0" />
          <stop offset="100%" stopColor="#4a4438" />
        </linearGradient>
        <filter id="pvpm-soft">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <filter id="pvpm-glow">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
        <filter id="pvpm-bladeglow">
          <feGaussianBlur stdDeviation=".6" />
        </filter>
        <filter id="pvpm-paper" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="5" />
          <feColorMatrix values="0 0 0 0 0.85  0 0 0 0 0.7  0 0 0 0 0.4  0 0 0 0.08 0" />
        </filter>
      </defs>
      <rect width="400" height="80" fill="url(#pvpm-spot)" />
      <path d="M170,0 L230,0 L290,80 L110,80 Z" fill="#fae09a" opacity=".09" filter="url(#pvpm-glow)" />
      <ellipse cx="200" cy="62" rx="170" ry="14" fill="none" stroke="#5a4220" strokeWidth="1" opacity=".55" />
      <ellipse cx="200" cy="62" rx="120" ry="9" fill="none" stroke="#5a4220" strokeWidth=".8" opacity=".4" />
      <ellipse cx="200" cy="62" rx="75" ry="5" fill="none" stroke="#5a4220" strokeWidth=".6" opacity=".3" />
      <circle cx="200" cy="40" r="32" fill="url(#pvpm-clash)" filter="url(#pvpm-soft)" />
      <g transform="translate(200,40) rotate(-32)" filter="url(#pvpm-bladeglow)">
        <path d="M-1.8,-32 L1.8,-32 L2,30 L-2,30 Z" fill="url(#pvpm-blade)" />
        <line x1="0" y1="-30" x2="0" y2="28" stroke="#fff" strokeWidth=".5" opacity=".55" />
        <rect x="-11" y="29" width="22" height="3.5" fill="url(#pvpm-hilt)" rx=".5" />
        <rect x="-1.6" y="32" width="3.2" height="10" fill="#3a2a18" />
        <circle cx="0" cy="44" r="2.5" fill="url(#pvpm-hilt)" />
        <path d="M-1.8,-32 L0,-36 L1.8,-32 Z" fill="url(#pvpm-blade)" />
      </g>
      <g transform="translate(200,40) rotate(32)" filter="url(#pvpm-bladeglow)">
        <rect x="-1.4" y="-30" width="2.8" height="74" fill="url(#pvpm-hilt)" />
        <path d="M1.4,-26 Q14,-22 16,-12 Q14,-8 1.4,-10 Z" fill="url(#pvpm-axe)" />
        <path d="M-1.4,-26 Q-14,-22 -16,-12 Q-14,-8 -1.4,-10 Z" fill="url(#pvpm-axe)" opacity=".7" />
        <path d="M14,-22 Q15.5,-15 14,-10" fill="none" stroke="#fff" strokeWidth=".5" opacity=".55" />
        <circle cx="0" cy="-30" r="1.8" fill="url(#pvpm-hilt)" />
        <rect x="-2.5" y="42" width="5" height="3" fill="#3a2a18" />
      </g>
      <circle cx="200" cy="40" r="2.5" fill="#fae09a" opacity="1" />
      <line x1="200" y1="40" x2="190" y2="32" stroke="#fae09a" strokeWidth=".6" opacity=".85" />
      <line x1="200" y1="40" x2="210" y2="32" stroke="#fae09a" strokeWidth=".6" opacity=".85" />
      <line x1="200" y1="40" x2="187" y2="36" stroke="#fae09a" strokeWidth=".5" opacity=".7" />
      <line x1="200" y1="40" x2="213" y2="36" stroke="#fae09a" strokeWidth=".5" opacity=".7" />
      <circle cx="155" cy="18" r=".7" fill="#fae09a" opacity=".5" />
      <circle cx="245" cy="16" r=".5" fill="#fae09a" opacity=".4" />
      <circle cx="175" cy="28" r=".5" fill="#fae09a" opacity=".4" />
      <circle cx="225" cy="26" r=".6" fill="#fae09a" opacity=".45" />
      <rect width="400" height="80" filter="url(#pvpm-paper)" opacity=".4" />
    </svg>
  );
}
