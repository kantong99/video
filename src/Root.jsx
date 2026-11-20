import React from 'react';
import { Composition } from 'remotion';
import { DURATION, FPS } from './components/Transitions.jsx';
import { L01_LockUnlock } from './projects/L01_LockUnlock.jsx';

// Final 4K composition. Preview mode overrides --width/--height at render time.
const WIDTH = 3840;
const HEIGHT = 2160;

// IDs may only contain a-z, A-Z, 0-9 and hyphens (-)
export const COMPOSITIONS = [
  { id: 'L01-LockUnlock', component: L01_LockUnlock },
];

export const RemotionRoot = () => (
  <>
    {COMPOSITIONS.map(({ id, component }) => (
      <Composition
        key={id}
        id={id}
        component={component}
        durationInFrames={DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    ))}
  </>
);
