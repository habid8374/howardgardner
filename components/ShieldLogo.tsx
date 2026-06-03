"use client";

interface ShieldLogoProps {
  size?: number;
  className?: string;
}

export default function ShieldLogo({ size = 100, className = "" }: ShieldLogoProps) {
  const id = Math.random().toString(36).slice(2, 8);
  return (
    <svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 100 120"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={`sh-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2929b0" />
          <stop offset="100%" stopColor="#0d0d5a" />
        </linearGradient>
        <linearGradient id={`gl-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE55C" />
          <stop offset="100%" stopColor="#FFD700" />
        </linearGradient>
        <filter id={`glow-${id}`}>
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Shield body */}
      <path
        d="M50 4 L96 22 L96 62 Q96 98 50 116 Q4 98 4 62 L4 22 Z"
        fill={`url(#sh-${id})`}
        stroke={`url(#gl-${id})`}
        strokeWidth="3.5"
      />
      {/* Inner glow */}
      <path
        d="M50 13 L88 28 L88 60 Q88 90 50 105 Q12 90 12 60 L12 28 Z"
        fill="white"
        opacity="0.07"
      />

      {/* Globe background circle */}
      <circle cx="50" cy="67" r="22" fill="rgba(255,255,255,0.92)" stroke={`url(#gl-${id})`} strokeWidth="1.5" />
      {/* Ocean */}
      <circle cx="50" cy="67" r="18" fill="#1a7acc" />
      {/* Continents (simplified Americas + other) */}
      <ellipse cx="46" cy="62" rx="6.5" ry="8.5" fill="#4CAF50" opacity="0.88" />
      <ellipse cx="57" cy="60" rx="5" ry="6.5" fill="#4CAF50" opacity="0.82" />
      <ellipse cx="43" cy="73" rx="3.5" ry="4.5" fill="#4CAF50" opacity="0.72" />
      <ellipse cx="58" cy="70" rx="2.5" ry="3" fill="#4CAF50" opacity="0.6" />

      {/* Star top */}
      <polygon
        points="50,19 52.9,27.8 62,27.8 54.5,33.2 57.4,42 50,36.6 42.6,42 45.5,33.2 38,27.8 47.1,27.8"
        fill={`url(#gl-${id})`}
        filter={`url(#glow-${id})`}
      />

      {/* Left laurel wreath */}
      <g fill={`url(#gl-${id})`} opacity="0.78">
        <ellipse cx="19" cy="57" rx="2.8" ry="5" transform="rotate(-20,19,57)" />
        <ellipse cx="16" cy="50" rx="2.8" ry="5" transform="rotate(-35,16,50)" />
        <ellipse cx="22" cy="65" rx="2.8" ry="4.5" transform="rotate(-10,22,65)" />
        <ellipse cx="14" cy="43" rx="2.5" ry="4.5" transform="rotate(-48,14,43)" />
      </g>
      {/* Right laurel wreath */}
      <g fill={`url(#gl-${id})`} opacity="0.78">
        <ellipse cx="81" cy="57" rx="2.8" ry="5" transform="rotate(20,81,57)" />
        <ellipse cx="84" cy="50" rx="2.8" ry="5" transform="rotate(35,84,50)" />
        <ellipse cx="78" cy="65" rx="2.8" ry="4.5" transform="rotate(10,78,65)" />
        <ellipse cx="86" cy="43" rx="2.5" ry="4.5" transform="rotate(48,86,43)" />
      </g>

      {/* Bottom banner */}
      <rect x="11" y="88" width="78" height="16" rx="2.5" fill={`url(#gl-${id})`} />
      <text x="50" y="99" textAnchor="middle" fill="#13136b" fontSize="6" fontWeight="900" fontFamily="Arial">
        BILINGUAL SCHOOL
      </text>
      <text x="50" y="108" textAnchor="middle" fill="#13136b" fontSize="3.8" fontWeight="600" fontFamily="Arial">
        SABANALARGA · ATLÁNTICO
      </text>
    </svg>
  );
}
