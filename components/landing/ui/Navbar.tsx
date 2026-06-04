"use client";

import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);

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

  const close = () => setOpen(false);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 bg-[#f5f5f7]/72 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <a
          href="#hero"
          className="shrink-0 text-base font-semibold tracking-tight text-[#1d1d1f] sm:text-lg"
          onClick={close}
        >
          NexEdge
        </a>

        <div className="hidden items-center gap-4 text-xs text-[#1d1d1f] lg:flex xl:gap-6 xl:text-[13px]">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="whitespace-nowrap opacity-75 transition-opacity hover:opacity-100"
            >
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

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#d2d2d7]/80 bg-white/80 text-[#1d1d1f] lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#d2d2d7]/60 bg-[#f5f5f7]/95 px-4 py-4 backdrop-blur-xl sm:px-6 md:px-8 lg:hidden">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-1">
            {links.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#1d1d1f] transition-colors hover:bg-white/80"
                onClick={close}
              >
                {label}
              </a>
            ))}
            <a
              href="#contact"
              className="mt-2 rounded-full bg-[#0071e3] px-4 py-2.5 text-center text-sm font-medium text-white"
              onClick={close}
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
