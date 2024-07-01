import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Container = styled.div`
  width: 220px;
  height: auto;
  border-radius: 10px;
  background-color: transparent;

  position: absolute;
  top: 64px;
  right: 64px;
  padding: 0.25rem;
  z-index: 1;
`;

export const MenuItem = styled(motion.div)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid var(--secondary);
  background-color: var(--blue-light);
  margin-bottom: 0.25rem;
  transition: all 0.4s;

  &:hover {
    background-color: var(--blue-twitter);
    color: var(--orange);
    margin-left: 0.5rem;
  }

  > a {
    font-family: Montserrat;
    font-size: 0.625rem;
    font-weight: 300;
    text-decoration: none;
    color: var(--white);
    padding: 0.125rem;

    &:hover {
      color: var(--secondary);
    }
  }
`;
