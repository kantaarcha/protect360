import { useTheme } from '../context/ThemeContext';

const SNOWFLAKES = [
  { id: 1, left: '6%', size: 5, delay: '0s', duration: '11s', opacity: 0.55 },
  { id: 2, left: '14%', size: 7, delay: '-3s', duration: '14s', opacity: 0.42 },
  { id: 3, left: '22%', size: 4, delay: '-6s', duration: '10s', opacity: 0.5 },
  { id: 4, left: '31%', size: 6, delay: '-2s', duration: '13s', opacity: 0.48 },
  { id: 5, left: '42%', size: 5, delay: '-8s', duration: '12s', opacity: 0.45 },
  { id: 6, left: '53%', size: 7, delay: '-4s', duration: '15s', opacity: 0.38 },
  { id: 7, left: '64%', size: 4, delay: '-7s', duration: '10.5s', opacity: 0.52 },
  { id: 8, left: '74%', size: 6, delay: '-1s', duration: '12.5s', opacity: 0.46 },
  { id: 9, left: '84%', size: 5, delay: '-5s', duration: '11.5s', opacity: 0.5 },
  { id: 10, left: '92%', size: 7, delay: '-9s', duration: '14s', opacity: 0.4 },
  { id: 11, left: '19%', size: 5, delay: '-4.5s', duration: '13.5s', opacity: 0.42 },
  { id: 12, left: '69%', size: 5, delay: '-2.5s', duration: '11.8s', opacity: 0.44 },
];

const GARLAND_LIGHTS = [
  { x: '8%', color: '#dc2626', delay: '0s' },
  { x: '18%', color: '#16a34a', delay: '0.6s' },
  { x: '29%', color: '#d97706', delay: '1.2s' },
  { x: '40%', color: '#dc2626', delay: '0.3s' },
  { x: '51%', color: '#16a34a', delay: '0.9s' },
  { x: '62%', color: '#d97706', delay: '1.5s' },
  { x: '73%', color: '#dc2626', delay: '0.4s' },
  { x: '84%', color: '#16a34a', delay: '1.1s' },
  { x: '93%', color: '#d97706', delay: '0.7s' },
];

export default function ChristmasAmbience() {
  const { isChristmas } = useTheme();
  if (!isChristmas) return null;

  return (
    <div className="xmas-ambience-layer" aria-hidden="true">
      {/* Minimalist Top String Lights */}
      <div className="xmas-garland-bar">
        <div className="xmas-garland-wire" />
        {GARLAND_LIGHTS.map((bulb, i) => (
          <span
            key={i}
            className="xmas-bulb"
            style={{
              left: bulb.x,
              '--bulb-color': bulb.color,
              animationDelay: bulb.delay,
            }}
          />
        ))}
      </div>

      {/* Hanging Minimal Baubles & Ribbon Strings */}
      <svg
        className="xmas-baubles-svg xmas-baubles-right"
        viewBox="0 0 110 128"
        fill="none"
      >
        <g className="xmas-bauble-sway-a">
          <line x1="34" y1="0" x2="34" y2="54" stroke="#94a3b8" strokeWidth="1.2" />
          <rect x="30" y="52" width="8" height="4" rx="1" fill="#d97706" />
          <circle cx="34" cy="69" r="14" fill="#b91c1c" opacity="0.88" />
          <circle cx="29" cy="64" r="3" fill="#ffffff" opacity="0.35" />
        </g>
        <g className="xmas-bauble-sway-b">
          <line x1="76" y1="0" x2="76" y2="36" stroke="#94a3b8" strokeWidth="1.2" />
          <rect x="72" y="34" width="8" height="4" rx="1" fill="#d97706" />
          <circle cx="76" cy="48" r="11" fill="#15803d" opacity="0.88" />
          <circle cx="72" cy="44" r="2.5" fill="#ffffff" opacity="0.35" />
        </g>
      </svg>

      {/* Subtle Minimal Evergreen Tree Silhouettes Bottom Corner */}
      <svg
        className="xmas-corner-pine"
        viewBox="0 0 120 96"
        fill="none"
      >
        <polygon points="36,16 14,56 58,56" fill="#15803d" opacity="0.09" />
        <polygon points="36,34 8,80 64,80" fill="#166534" opacity="0.1" />
        <polygon points="82,36 62,84 102,84" fill="#b91c1c" opacity="0.06" />
      </svg>

      {/* Gentle Snowfall */}
      {SNOWFLAKES.map((flake) => (
        <span
          key={flake.id}
          className="xmas-snowflake"
          style={{
            left: flake.left,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            animationDelay: flake.delay,
            animationDuration: flake.duration,
            opacity: flake.opacity,
          }}
        />
      ))}
    </div>
  );
}
