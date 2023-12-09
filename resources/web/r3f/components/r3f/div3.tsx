"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { View, ViewProps } from "@/providers/r3f";
import { cn } from "@/lib/utils";

const Component = ({ children, className, ...props }: ViewProps) => {
  const router = useRouter();

  useEffect(() => router.refresh(), [router]);

  return (
    <div
      className={cn(
        "relative w-full h-full rounded-lg bg-cyan-300 aspect-square sm:aspect-auto",
        className,
      )}
    >
      <View {...props}>{children}</View>
    </div>
  );
};

export default Component;
