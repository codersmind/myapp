"use client";

export function Navbar() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between bg-[#f5f5f7]/72 px-6 py-3 backdrop-blur-xl backdrop-saturate-150 md:px-10">
      <a href="#hero" className="text-lg font-semibold tracking-tight text-[#1d1d1f]">
        NexEdge
      </a>

      <div className="hidden items-center gap-8 text-xs font-normal text-[#1d1d1f] md:flex">
        <a href="#smart-home" className="opacity-80 transition-opacity hover:opacity-100">
          Smart Home
        </a>
        <a href="#industrial" className="opacity-80 transition-opacity hover:opacity-100">
          Industrial
        </a>
        <a href="#robotics" className="opacity-80 transition-opacity hover:opacity-100">
          Robotics
        </a>
        <a href="#agriculture" className="opacity-80 transition-opacity hover:opacity-100">
          Agriculture
        </a>
        <a href="#automotive" className="opacity-80 transition-opacity hover:opacity-100">
          Automotive
        </a>
        <a href="#edge-ml" className="opacity-80 transition-opacity hover:opacity-100">
          Edge ML
        </a>
        <a
          href="#contact"
          className="rounded-full bg-[#0071e3] px-4 py-1.5 text-white transition-opacity hover:opacity-85"
        >
          Contact
        </a>
      </div>
    </nav>
  );
}
