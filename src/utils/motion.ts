import { Variants, Transition } from "framer-motion";

export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const dialogVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

export const dialogTransition: Transition = {
  duration: 0.2,
  ease: "easeOut",
};

export const drawerBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const getDrawerVariants = (isRight: boolean): Variants => ({
  hidden: { x: isRight ? "100%" : "-100%" },
  visible: { x: 0 },
});

export const drawerTransition: Transition = {
  type: "spring",
  damping: 25,
  stiffness: 200,
};
