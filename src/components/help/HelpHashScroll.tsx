"use client";

import { useEffect } from "react";

/** Scroll to `#anchor` after Help article navigation (App Router + client Link). */
export default function HelpHashScroll() {
  useEffect(() => {
    const id = window.location.hash.replace(/^#/, "");
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return null;
}
