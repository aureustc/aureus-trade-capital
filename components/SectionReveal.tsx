"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type SectionRevealProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  "data-nav"?: string;
};

export function SectionReveal({
  children,
  className,
  id,
  "data-nav": dataNav,
}: SectionRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-12% 0px -12% 0px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      data-nav={dataNav}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
