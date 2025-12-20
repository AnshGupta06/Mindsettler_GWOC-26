"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function OpeningCurtain() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "auto";
      },
    });

    tl.to(leftRef.current, {
      x: "-100%",
      duration: 1,
      ease: "power4.inOut",
    }).to(
      rightRef.current,
      {
        x: "100%",
        duration: 1,
        ease: "power4.inOut",
      },
      "<"
    );
  }, []);

  return (
    <>
      <div
        ref={leftRef}
        className="fixed inset-y-0 left-0 w-1/2 z-50 bg-[#3F2965]"
      />
      <div
        ref={rightRef}
        className="fixed inset-y-0 right-0 w-1/2 z-50 bg-[#3F2965]"
      />
    </>
  );
}
