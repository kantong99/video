import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { DURATION, useFade } from './Transitions.jsx';

// Ruang desain logis 1920x1080. Semua koordinat komposisi memakai ruang ini,
// lalu diskalakan otomatis ke 3840x2160 (4K) atau ukuran preview.
export const DESIGN_W = 1920;
export const DESIGN_H = 1080;

const sweep = (frame, [from, to]) =>
  interpolate(frame, [0, DURATION], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

// Kamera sinematik: zoom, pan, rotasi X/Y dengan perspektif 3D.
// Setiap prop berupa pasangan [nilai awal, nilai akhir] yang diinterpolasi sepanjang video.
export const CameraStage = ({
  children,
  background = '#000000',
  zoom = [1, 1],
  rotateX = [0, 0],
  rotateY = [0, 0],
  panX = [0, 0],
  panY = [0, 0],
  perspective = 2000,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const fade = useFade();

  const scale = Math.min(width / DESIGN_W, height / DESIGN_H);
  const z = sweep(frame, zoom);
  const rx = sweep(frame, rotateX);
  const ry = sweep(frame, rotateY);
  const px = sweep(frame, panX);
  const py = sweep(frame, panY);

  return (
    <AbsoluteFill style={{ background, overflow: 'hidden', opacity: fade }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: DESIGN_W,
          height: DESIGN_H,
          transformOrigin: '0 0',
          transform: `scale(${scale})`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            perspective,
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              transformStyle: 'preserve-3d',
              transformOrigin: '960px 540px',
              transform: `translate(${px}px, ${py}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${z})`,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
