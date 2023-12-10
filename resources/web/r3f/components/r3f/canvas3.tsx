"use client";
import { Canvas, PerspectiveCameraProps } from "@react-three/fiber";
import { cn } from "@/lib/utils";
import { Stage, CameraControls, PerspectiveCamera } from "@react-three/drei";
import { HTMLAttributes, useRef } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  orbit: boolean;
  camera?: PerspectiveCameraProps;
};

const Component = ({ children, className, orbit, camera, ...props }: Props) => {
  const ref = useRef<CameraControls>(null);

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
      className={cn(
        "relative w-full h-full pointer-events-auto touch-auto bg-cyan-300 rounded-lg",
        className,
      )}
      onPointerOver={handleStart}
      onPointerOut={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      {...props}
    >
      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          //   pointerEvents: "none",
        }}
      >
        <Stage>
          <PerspectiveCamera
            makeDefault
            position={[2, 2, 2]}
            zoom={1}
            {...camera}
          />
          {children}
          <CameraControls
            ref={ref}
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
      </Canvas>
    </div>
  );
};

export default Component;
export type { Props as Canvas3Props };
