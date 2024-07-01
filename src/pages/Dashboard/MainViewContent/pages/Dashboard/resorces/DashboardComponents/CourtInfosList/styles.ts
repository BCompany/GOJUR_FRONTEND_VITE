import styled from 'styled-components';
import { motion } from 'framer-motion';

const containerAnimation = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

export const Container = styled(motion.div).attrs(() => ({
  // initial: 'hidden',
  variants: containerAnimation,
}))`
  width: 50%;
  height: auto;
  max-height: 450px;
  position: absolute;
  top: 4rem;
  padding: 1rem;
  z-index: 1;
  overflow: auto;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 0.25rem;
  box-shadow: rgba(0, 0, 0, 0.8);
  color: var(--primary);

  ::-webkit-scrollbar {
    width: 0.225rem;
  }

  ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 0.5rem;
    border-radius: 0.5rem;
    background: var(--orange);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.125);
  }
`;
