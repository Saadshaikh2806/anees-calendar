"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface MeteorsProps {
  number?: number;
}
export const Meteors = ({ number = 70 }: MeteorsProps) => {
  const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>(
    [],
  );

  useEffect(() => {
    const styles = [...new Array(number)].map(() => ({
      top: Math.floor(Math.random() * 100) + '%',
      left: Math.floor(Math.random() * 100) + '%',
      animationDelay: Math.random() * 1 + 0.2 + "s",
      animationDuration: Math.floor(Math.random() * 8 + 2) + "s",
    }));
    setMeteorStyles(styles);
  }, [number]);

  return (
    <>
      {[...meteorStyles].map((style, idx) => (
        <span
          key={idx}
          className={cn(
            "pointer-events-none absolute size-0.5 rotate-[215deg] animate-meteor rounded-full bg-white shadow-[0_0_0_1px_#ffffff10]",
            "before:absolute before:top-1/2 before:h-[1px] before:w-[50px] before:-translate-y-1/2 before:transform before:bg-gradient-to-r before:from-[#64748b] before:to-transparent before:content-['']",
            "opacity-10"
          )}
          style={{
            ...style,
            top: `calc(${style.top} - 200px)`,
            left: `calc(${style.left} - 200px)`,
          }}
        />
      ))}
    </>
  );
};

export default Meteors;
