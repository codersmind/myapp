"use client";

import { AppleSections } from "./sections/AppleSections";
import { Navbar } from "./ui/Navbar";

export function LandingPage() {
  return (
    <div className="relative">
      <Navbar />
      <AppleSections />
    </div>
  );
}
