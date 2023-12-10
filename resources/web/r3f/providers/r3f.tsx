"use client";

import { HTMLAttributes, ReactNode, useRef } from "react";
import { Canvas, PerspectiveCameraProps } from "@react-three/fiber";
import {
  Preload,
  CameraControls,
  View as ViewImpl,
  Stage,
  PerspectiveCamera,
} from "@react-three/drei";
import tunnel from "tunnel-rat";

import { cn } from "@/lib/utils";

type ViewProps = HTMLAttributes<HTMLDivElement> & {
  orbit: boolean;
  camera?: PerspectiveCameraProps;
};

const r3f = tunnel();

const View = ({
  children,
  className,
  orbit = false,
  camera = undefined,
  ...props
}: ViewProps) => {
  const ref = useRef<any>(null);
  const controlsRef = useRef<CameraControls>(null);

  let timeout: NodeJS.Timeout | null = null;

  const handleStart = () => {
    if (!timeout) return;
    clearTimeout(timeout);
    timeout = null;
  };

  const handleEnd = () => {
    timeout = setTimeout(() => ref?.current?.reset(true), 3000);
  };

  return (
    <div
      ref={ref}
      className={cn("relative w-full h-full", className)}
      onPointerOver={handleStart}
      onPointerOut={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      {...props}
    >
      <r3f.In>
        <ViewImpl track={ref}>
          <Stage>
            <PerspectiveCamera
              makeDefault
              position={[2, 2, 2]}
              zoom={1}
              {...camera}
            />
            {children}
            <CameraControls
              ref={controlsRef}
              enabled={orbit}
              minDistance={2}
              maxDistance={5}
              // minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 2.125}
              // minAzimuthAngle={-Math.PI / 4}
              // maxAzimuthAngle={Math.PI / 4}
              onStart={handleStart}
              onEnd={handleEnd}
            />
          </Stage>
        </ViewImpl>
      </r3f.In>
    </div>
  );
};

const Provider = ({ children }: { children: ReactNode }) => {
  const ref = useRef<any>();
  return (
    <>
      {children}
      <div
        ref={ref}
        className="relative w-full h-full pointer-events-auto touch-auto"
      >
        <Canvas
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
          }}
          eventSource={ref}
          eventPrefix="client"
          dpr={[1, 2]}
        >
          <r3f.Out />
          <Preload all />
        </Canvas>
      </div>
    </>
  );
};

export default Provider;
export type { ViewProps };
export { View, r3f };
