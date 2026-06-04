"use client";

import type { ReactNode } from "react";

export function SectionContent({
  children,
  className = "",
  centered = false,
  /** Desktop: keep copy in the left column when canvas uses align="right" */
  split = false,
}: {
  children: ReactNode;
  className?: string;
  centered?: boolean;
  split?: boolean;
}) {
  return (
    <div
      className={`px-4 pb-8 pt-14 sm:px-6 sm:pb-10 sm:pt-16 md:px-12 md:pt-20 lg:px-20 lg:pb-12 lg:pt-24 xl:px-28 2xl:px-32 ${
        centered ? "flex flex-col items-center text-center" : ""
      } ${
        split
          ? "lg:relative lg:z-20 lg:max-w-[min(520px,42vw)] lg:pr-4 xl:max-w-[min(560px,40vw)] 2xl:max-w-[600px]"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
