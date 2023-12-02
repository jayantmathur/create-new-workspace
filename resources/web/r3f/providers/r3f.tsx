"use client";

import {
  HTMLAttributes,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { Canvas } from "@react-three/fiber";
import {
  Preload,
  OrbitControls,
  View as ViewImpl,
  Stage,
} from "@react-three/drei";
import tunnel from "tunnel-rat";

import { cn } from "@/lib/utils";

type ViewProps = HTMLAttributes<HTMLDivElement> & {
  orbit?: boolean;
};

const r3f = tunnel();

const View = forwardRef<HTMLDivElement, ViewProps>(
  ({ children, className, orbit, ...props }, forwardedRef) => {
    const ref = useRef<any>(null);

    useImperativeHandle(forwardedRef, () => ref.current);

    return (
      <>
        <div ref={ref} className={cn(className)} {...props} />
        <r3f.In>
          <ViewImpl track={ref}>
            <Stage>
              {children}
              {orbit && (
                <OrbitControls
                  makeDefault
                  enablePan={false}
                  enableZoom={false}
                  enableDamping
                />
              )}
            </Stage>
          </ViewImpl>
        </r3f.In>
      </>
    );
  },
);

View.displayName = "View";

const Provider = ({ children }: { children: ReactNode }) => {
  const ref = useRef<any>();
  return (
    <div ref={ref} className="grid place-content-center place-items-center">
      {children}
      <Canvas
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
        }}
        eventSource={ref}
        eventPrefix="client"
        shadows
        dpr={[1, 2]}
      >
        <r3f.Out />
        <Preload all />
      </Canvas>
    </div>
  );
};

export default Provider;
export type { ViewProps };
export { View, r3f };
