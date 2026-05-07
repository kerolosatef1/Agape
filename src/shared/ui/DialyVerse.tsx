"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import GoldenCross from "./GoldenCross";

interface DailyVerseProps {
  verse?: string;
  reference?: string;
}

const defaultVerse = "Love is patient, love is kind.";
const defaultReference = "1 Corinthians 13:4";

const DailyVerse: React.FC<DailyVerseProps> = ({
  verse = defaultVerse,
  reference = defaultReference,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const crossRef = useRef<HTMLDivElement>(null);
  const verseRef = useRef<HTMLParagraphElement>(null);
  const refRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(crossRef.current, {
        y: -6,
        duration: 2.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.fromTo(
        verseRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power2.out", delay: 0.3 },
      );

      gsap.fromTo(
        refRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: "power2.out", delay: 1 },
      );
    }, containerRef);

    return () => ctx.revert();
  }, [verse]);

  return (
    <div
      ref={containerRef}
      className="rounded-xl px-4 py-3 select-none"
      style={{ background: "rgba(196, 148, 61, 0.12)" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#c4943d" }}>
          Daily Verse
        </p>
        <div ref={crossRef}>
          <GoldenCross size={16} />
        </div>
      </div>
      <p
        ref={verseRef}
        className="text-xs italic leading-relaxed text-white/70"
      >
        &ldquo;{verse}&rdquo;
      </p>
      <span
        ref={refRef}
        className="text-[10px] font-semibold mt-1 block"
        style={{ color: "#c4943d" }}
      >
        — {reference}
      </span>
    </div>
  );
};

export default DailyVerse;