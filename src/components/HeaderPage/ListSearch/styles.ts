import styled from 'styled-components';
import { motion } from 'framer-motion';


export const Container = styled.div`
  width: 20.5rem;
  height: 28.125rem;
  max-height: 28.125rem;
  background: transparent;
  color: #fff;
  /* border: 1px solid black; */
  margin-top: 1.5rem;
  border-radius: 0.375rem;
  /* box-shadow: 2px 4px 2px rgba(0, 0, 0, 0.25); */

  display: flex;
  flex-direction: column;
  align-items: center;

  overflow: auto;
  z-index: 1;
  position: absolute;
  top: 32px;

  ::-webkit-scrollbar {
    width: 0.25rem;
  }

  ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 0.5rem;
    border-radius: 0.5rem;
    background: var(--orange);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2);
  }
`;


export const ListItem = styled(motion.div)`
  width: 376px;
  height: 64px;
  border-radius: 4px;
  background: var(--white);
  box-shadow: 2px 4px 2px rgba(44, 130, 201, 0.5);
  /* border: 1px solid black; */

  color: #000;
  margin-top: 4px;
  padding: 0 8px;

  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    background-color: var(--orange);
    opacity: 0.75;
  }

  > a {
    flex: 1;
    /* border: 1px solid black; */
    text-decoration: none;
    color: #000;
    margin-top: 4px;
    /* padding: 0 8px; */
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    cursor: pointer;
    font-size: 0.5rem;

    > section {
      /* border: 1px solid black; */

      flex: 1;
      /* width: 376px;
      height: 64px; */
      height: 64px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      > p {
        font-size: 0.5rem;
        padding: 0 8px;
      }
    }

    > svg {
      width: 1.5rem;
      height: 1.5rem;
      color: var(--blue);
    }
  }

  > button {
    flex: 1;
    /* border: 1px solid black; */
    text-decoration: none;
    color: #000;
    margin-top: 4px;
    /* padding: 0 8px; */
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    cursor: pointer;
    font-size: 0.5rem;

    > section {
      /* border: 1px solid black; */

      flex: 1;
      /* width: 376px;
      height: 64px; */
      height: 64px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      > p {
        font-size: 0.5rem;
        padding: 0 8px;
      }
    }

    > svg {
      width: 1.5rem;
      height: 1.5rem;
      color: var(--blue);
    }
  }
`;
