"use client";

import {
  HTMLAttributes,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { Canvas, PerspectiveCameraProps } from "@react-three/fiber";
import {
  Preload,
  OrbitControls,
  OrbitControlsProps,
  View as ViewImpl,
  Stage,
  PerspectiveCamera,
} from "@react-three/drei";
import tunnel from "tunnel-rat";

import { cn } from "@/lib/utils";

type ViewProps = HTMLAttributes<HTMLDivElement> & {
  orbitControls?: OrbitControlsProps;
  camera?: PerspectiveCameraProps;
};

const r3f = tunnel();

const View = forwardRef<HTMLDivElement, ViewProps>(
  ({ children, className, orbitControls, camera, ...props }, forwardedRef) => {
    const ref = useRef<any>(null);
    const { enabled, ...orbitProps } = orbitControls || { enabled: false };

    useImperativeHandle(forwardedRef, () => ref.current);

    return (
      <div ref={ref} className={cn("w-full h-full", className)} {...props}>
        <r3f.In>
          <ViewImpl track={ref}>
            <Stage>
              {camera && (
                <PerspectiveCamera
                  makeDefault
                  position={[2, 2, 2]}
                  {...camera}
                />
              )}
              {children}
              {enabled && (
                <OrbitControls
                  makeDefault
                  enablePan={false}
                  enableZoom={false}
                  enableDamping
                  // dampingFactor={0.1}
                  {...orbitProps}
                />
              )}
            </Stage>
          </ViewImpl>
        </r3f.In>
      </div>
    );
  },
);

View.displayName = "View";

const Provider = ({ children }: { children: ReactNode }) => {
  const ref = useRef<any>();
  return (
    <>
      {children}
      <div ref={ref} className="relative">
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
