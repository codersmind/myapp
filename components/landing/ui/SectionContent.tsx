"use client";

import type { ReactNode } from "react";

export function SectionContent({
  children,
  className = "",
  centered = false,
}: {
  children: ReactNode;
  className?: string;
  centered?: boolean;
}) {
  return (
    <div
      className={`px-4 pb-10 pt-16 sm:px-6 sm:pt-20 md:px-16 lg:px-24 lg:pb-12 lg:pt-24 ${
        centered ? "flex flex-col items-center text-center" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
