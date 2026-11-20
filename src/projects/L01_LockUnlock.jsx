import React from 'react';
import { useCurrentFrame } from 'remotion';
import { CameraStage, DESIGN_W as W, DESIGN_H as H } from '../components/Camera.jsx';
import { clampTween } from '../components/Transitions.jsx';

// Lock & unlock line art di latar hijau cerah: gembok digambar, dikunci, lalu shackle-nya terangkat dan terbuka
const INK = '#064e3b';
const GREEN = '#4ade80';
const CX = W / 2;
const SW = 22;
const line = { fill: 'none', stroke: INK, strokeWidth: SW, strokeLinecap: 'round', strokeLinejoin: 'round' };

export const L01_LockUnlock = () => {
  const frame = useCurrentFrame();
  const fade = clampTween(frame, [660, 720], [1, 0]);
  const drawBody = clampTween(frame, [20, 110], [0, 1]);
  const drawKey = clampTween(frame, [110, 170], [0, 1]);
  const drawShackle = clampTween(frame, [170, 250], [0, 1]);
  const shake = frame >= 270 && frame < 350 ? Math.sin((frame - 270) * 0.9) * 2.5 : 0;
  const open = clampTween(frame, [380, 460], [0, 1]);
  const lift = open * 110;
  const tilt = open * 24;
  const ring = clampTween(frame, [440, 600], [0, 1]);
  const dots = Array.from({ length: 12 }, (_, i) => i);

  return (
    <CameraStage background={GREEN} zoom={[1, 1.03]}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0, opacity: fade }}>
        {ring > 0 && ring < 1 && (
          <circle cx={CX} cy={H / 2 + 60} r={200 + ring * 380} fill="none" stroke={INK} strokeWidth={10} opacity={1 - ring} />
        )}
        {dots.map((i) => {
          const a = (i / 12) * Math.PI * 2;
          const s = clampTween(frame, [440 + i, 470 + i], [0, 1]);
          const d = 300 * s;
          return <circle key={i} cx={CX + Math.cos(a) * d} cy={H / 2 + 60 + Math.sin(a) * d} r={12} fill={INK} opacity={s * (1 - ring * 0.5)} />;
        })}
        <g transform={`translate(${shake}, 0)`}>
          <path
            d="M 700 580 Q 700 540 740 540 L 1180 540 Q 1220 540 1220 580 L 1220 840 Q 1220 880 1180 880 L 740 880 Q 700 880 700 840 Z"
            {...line}
            pathLength={100}
            strokeDasharray={`${drawBody * 100} 100`}
          />
          <path
            d={`M ${CX - 36} 690 A 36 36 0 1 1 ${CX + 36} 690 L ${CX + 18} 760 L ${CX - 18} 760 Z`}
            {...line}
            pathLength={100}
            strokeDasharray={`${drawKey * 100} 100`}
          />
          <path
            d="M 790 540 V 420 A 170 170 0 0 1 1130 420 V 540"
            {...line}
            transform={`translate(0, ${-lift}) rotate(${tilt} 1130 540)`}
            pathLength={100}
            strokeDasharray={`${drawShackle * 100} 100`}
          />
        </g>
      </svg>
    </CameraStage>
  );
};
