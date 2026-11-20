import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// Timeline global: 30 FPS x 24 detik = 720 frame
// Intro 0-90, bagian utama 90-630, outro 630-720
export const FPS = 30;
export const DURATION = 720;
export const INTRO_END = 90;
export const OUTRO_START = 630;
export const FADE_FRAMES = 30;

export const clampTween = (frame, inputRange, outputRange, easing) =>
  interpolate(frame, inputRange, outputRange, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

// Fade masuk di awal dan fade keluar di akhir, dipakai bersama semua komposisi
export const useFade = () => {
  const frame = useCurrentFrame();
  const fadeIn = clampTween(frame, [0, FADE_FRAMES], [0, 1], Easing.out(Easing.cubic));
  const fadeOut = clampTween(
    frame,
    [DURATION - FADE_FRAMES, DURATION],
    [1, 0],
    Easing.in(Easing.cubic)
  );
  return fadeIn * fadeOut;
};

// Progress 0 -> 1 selama intro, dipakai untuk memunculkan objek utama
export const useIntro = () => {
  const frame = useCurrentFrame();
  return clampTween(frame, [0, INTRO_END], [0, 1], Easing.out(Easing.cubic));
};

// Progress 0 -> 1 selama outro
export const useOutro = () => {
  const frame = useCurrentFrame();
  return clampTween(frame, [OUTRO_START, DURATION], [0, 1], Easing.inOut(Easing.cubic));
};

// Judul teks dengan animasi spring dan garis aksen
export const Caption = ({
  title,
  subtitle,
  color = '#ffffff',
  subColor = 'rgba(226,232,240,0.85)',
  accent = '#38bdf8',
  x = 140,
  y = 110,
  delay = 0,
  align = 'left',
  titleSize = 84,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = Math.max(0, frame - delay);
  const rise = spring({ frame: local, fps, config: { damping: 200 } });
  const subIn = spring({
    frame: Math.max(0, frame - delay - 14),
    fps,
    config: { damping: 200 },
  });
  const outro = clampTween(frame, [OUTRO_START, DURATION], [1, 0]);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        textAlign: align,
        fontFamily: '"Helvetica Neue", Arial, sans-serif',
        color,
        opacity: rise * outro,
        transform: `translateY(${(1 - rise) * 28}px)`,
      }}
    >
      <div
        style={{
          fontSize: titleSize,
          fontWeight: 800,
          letterSpacing: 4,
          lineHeight: 1.05,
          textShadow: `0 0 30px ${accent}55`,
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 18,
          width: 260 * rise,
          height: 4,
          background: accent,
          marginLeft: align === 'center' ? 'auto' : 0,
          marginRight: align === 'center' ? 'auto' : 0,
        }}
      />
      <div
        style={{
          marginTop: 18,
          fontSize: 34,
          letterSpacing: 2,
          color: subColor,
          opacity: subIn,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};

// Label kecil dengan garis penunjuk, dipakai untuk anotasi ilmiah
export const Label = ({ text, x, y, color = '#e2e8f0', delay = 0, width = 260 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 200 } });
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        fontFamily: '"Helvetica Neue", Arial, sans-serif',
        color,
        opacity: p,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        whiteSpace: 'nowrap',
      }}
    >
      <div
        style={{
          width: width * p,
          height: 2,
          background: color,
          opacity: 0.7,
          order: 2,
        }}
      />
      <div style={{ fontSize: 30, letterSpacing: 3, fontWeight: 600, order: 1 }}>{text}</div>
    </div>
  );
};

// Layer penutup full-screen untuk transisi kilat, dipakai di beberapa komposisi
export const FlashSweep = ({ start, end, color = '#ffffff' }) => {
  const frame = useCurrentFrame();
  const p = clampTween(frame, [start, end], [0, 1], Easing.inOut(Easing.cubic));
  const alpha = clampTween(frame, [start, (start + end) / 2, end], [0, 0.55, 0]);
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(100deg, transparent ${(p * 140 - 40)}%, ${color} ${(p * 140 - 20)}%, transparent ${(p * 140)}%)`,
        opacity: alpha,
        pointerEvents: 'none',
      }}
    />
  );
};
