import type { CSSProperties } from 'react';

interface Props {
  className?: string;
  width?: number | string;
  style?: CSSProperties;
}

export function LivingWorldSeason1Banner({ className, width, style }: Props) {
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
        <linearGradient id="lws1-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#180a08" />
          <stop offset="40%" stopColor="#3a1810" />
          <stop offset="80%" stopColor="#7a3018" />
          <stop offset="100%" stopColor="#a04018" />
        </linearGradient>
        <radialGradient id="lws1-fire" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fae09a" stopOpacity=".7" />
          <stop offset="45%" stopColor="#e85820" stopOpacity=".45" />
          <stop offset="100%" stopColor="#7a1810" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lws1-water" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3a1810" />
          <stop offset="100%" stopColor="#1c0c08" />
        </linearGradient>
        <linearGradient id="lws1-arch" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2a1410" />
          <stop offset="100%" stopColor="#0c0604" />
        </linearGradient>
        <filter id="lws1-soft">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
        <filter id="lws1-glow">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id="lws1-paper">
          <feTurbulence type="fractalNoise" baseFrequency="0.88" numOctaves="2" seed="53" />
          <feColorMatrix values="0 0 0 0 0.9  0 0 0 0 0.6  0 0 0 0 0.4  0 0 0 0.07 0" />
        </filter>
      </defs>
      <rect width="400" height="80" fill="url(#lws1-sky)" />
      <ellipse cx="200" cy="52" rx="200" ry="18" fill="url(#lws1-fire)" filter="url(#lws1-glow)" />
      <ellipse cx="170" cy="28" rx="40" ry="10" fill="#2a1410" opacity=".75" filter="url(#lws1-soft)" />
      <ellipse cx="230" cy="22" rx="45" ry="11" fill="#2a1410" opacity=".8" filter="url(#lws1-soft)" />
      <ellipse cx="200" cy="36" rx="60" ry="6" fill="#2a1410" opacity=".55" filter="url(#lws1-soft)" />
      <g fill="url(#lws1-arch)">
        <rect x="60" y="52" width="14" height="20" />
        <path d="M60,52 L67,46 L74,52 Z" />
        <rect x="85" y="48" width="10" height="24" />
        <path d="M85,48 L90,42 L95,48 Z" />
        <rect x="105" y="54" width="16" height="18" />
        <rect x="135" y="46" width="12" height="26" />
        <path d="M135,46 L141,40 L147,46 Z" />
        <rect x="158" y="42" width="14" height="30" />
        <path d="M158,42 L165,34 L172,42 Z" />
        <rect x="184" y="48" width="10" height="24" />
        <rect x="205" y="44" width="14" height="28" />
        <path d="M205,44 L212,38 L219,44 Z" />
        <rect x="232" y="50" width="12" height="22" />
        <rect x="252" y="46" width="10" height="26" />
        <rect x="280" y="52" width="13" height="20" />
        <rect x="302" y="48" width="11" height="24" />
        <path d="M302,48 L307.5,42 L313,48 Z" />
        <rect x="325" y="54" width="14" height="18" />
      </g>
      <circle cx="145" cy="36" r=".8" fill="#fae09a" opacity=".95" />
      <circle cx="165" cy="28" r=".6" fill="#fae09a" opacity=".85" />
      <circle cx="195" cy="32" r=".9" fill="#fae09a" opacity=".9" />
      <circle cx="215" cy="26" r=".7" fill="#fae09a" opacity=".8" />
      <circle cx="235" cy="34" r=".6" fill="#fae09a" opacity=".75" />
      <circle cx="180" cy="40" r=".5" fill="#fae09a" opacity=".7" />
      <circle cx="225" cy="38" r=".5" fill="#fae09a" opacity=".65" />
      <path d="M0,72 L400,72 L400,80 L0,80 Z" fill="url(#lws1-water)" />
      <ellipse cx="200" cy="74" rx="180" ry="3" fill="#e85820" opacity=".3" filter="url(#lws1-soft)" />
      <line x1="120" y1="75" x2="160" y2="75" stroke="#e85820" strokeWidth=".4" opacity=".4" />
      <line x1="180" y1="76" x2="220" y2="76" stroke="#e85820" strokeWidth=".4" opacity=".4" />
      <line x1="240" y1="75" x2="280" y2="75" stroke="#e85820" strokeWidth=".4" opacity=".4" />
      <rect width="400" height="80" filter="url(#lws1-paper)" opacity=".45" />
    </svg>
  );
}
