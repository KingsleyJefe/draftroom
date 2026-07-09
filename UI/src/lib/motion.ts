import type { Variants } from "framer-motion";

const editorialEase = [0.22, 1, 0.36, 1] as const;

export const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: editorialEase },
  },
};

export const fileItem: Variants = {
  hidden: { opacity: 0, height: 0, x: -6 },
  show: {
    opacity: 1,
    height: "auto",
    x: 0,
    transition: { duration: 0.32, ease: editorialEase },
  },
  exit: {
    opacity: 0,
    height: 0,
    x: -6,
    transition: { duration: 0.22, ease: "easeOut" },
  },
};

export const routeFade: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: editorialEase },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.16, ease: "easeIn" },
  },
};
