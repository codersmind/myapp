"use client";

import { memo, useEffect, useState, type ComponentType } from "react";

const SCENE_STEP = 0.022;

interface SceneRunnerProps {
  getProgress: () => number;
  Scene: ComponentType<{ progress: number }>;
}

function SceneRunnerInner({ getProgress, Scene }: SceneRunnerProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    let last = -1;

    const tick = () => {
      const next = getProgress();
      if (Math.abs(next - last) >= SCENE_STEP) {
        last = next;
        setProgress(next);
      }
      raf = requestAnimationFrame(tick);
    };

    last = getProgress();
    setProgress(last);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [getProgress]);

  return <Scene progress={progress} />;
}

export const SceneRunner = memo(SceneRunnerInner);
