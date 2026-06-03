"use client";

export function Navbar() {
  const links = [
    { href: "#microcontroller", label: "Embedded" },
    { href: "#smart-home", label: "Smart Home" },
    { href: "#industrial", label: "Industrial" },
    { href: "#robotics", label: "Robotics" },
    { href: "#healthcare", label: "Healthcare" },
    { href: "#smart-city", label: "Smart City" },
    { href: "#smart-grid", label: "Energy" },
    { href: "#playground", label: "Playground" },
  ];

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between bg-[#f5f5f7]/72 px-4 py-3 backdrop-blur-xl backdrop-saturate-150 md:px-8">
      <a href="#hero" className="shrink-0 text-lg font-semibold tracking-tight text-[#1d1d1f]">
        NexEdge
      </a>

      <div className="hidden items-center gap-5 overflow-x-auto text-[11px] text-[#1d1d1f] lg:flex xl:gap-7 xl:text-xs">
        {links.map(({ href, label }) => (
          <a key={href} href={href} className="whitespace-nowrap opacity-75 transition-opacity hover:opacity-100">
            {label}
          </a>
        ))}
        <a
          href="#contact"
          className="whitespace-nowrap rounded-full bg-[#0071e3] px-4 py-1.5 text-white transition-opacity hover:opacity-85"
        >
          Contact
        </a>
      </div>
    </nav>
  );
}
