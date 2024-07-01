import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

interface ItemProps {
  read: string;
}
export const Container = styled(motion.div)`
  width: 24rem;
  height: auto;
  max-height: 18rem;
  background-color: var(--white);
  position: absolute;
  z-index: 9998;
  top: 64px;
  right: 48px;
  border-radius: 10px;
  /* border: 1px solid var(--blue-light); */
  box-shadow: 1px 1px 1px 2px var(--secondary);
  overflow: auto;
  padding: 0.5rem;

  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 0.5rem;
    border-radius: 0.5rem;
    background: var(--orange);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
  }
`;

export const ListItem = styled(motion.div)<ItemProps>`
  width: 100%;
  height: auto;
  min-height: 64px;
  background-color: var(--white);
  /* border: 1px solid #000; */
  border-radius: 10px;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  box-shadow: ${props =>
    props.read === 'NL'
      ? `1px 1px 1px 2px rgba(0, 0, 255, 0.5)`
      : `1px 1px 1px 2px rgba(0, 0, 0, 0.25)`};

  > header {
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    /* justify-content: center; */
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 10px 10px 0 0;
    padding: 0.5rem;
    overflow: hidden;

    flex: 1;
    cursor: pointer;
    ${props =>
      props.read === 'LM' &&
      css`
        background-color: transparent;
      `};
    ${props =>
      props.read === 'NL' &&
      css`
        background-color: var(--blue-soft);
      `};
    ${props =>
      props.read === 'VM' &&
      css`
        background-color: var(--blue-soft);
      `};
    ${props =>
      props.read === null &&
      css`
        background-color: var(--blue-soft);
      `};

    &:hover {
      background-color: var(--blue-twitter);
    }

    > p {
      padding-top: 0.5rem;

      font-size: 0.625rem;
      text-align: justify;
      white-space: normal;
      text-overflow: ellipsis;
    }

    > div {
      font-size: 0.725rem;
      text-align: justify;
      color: var(--secondary);
      > p {
        font-size: 0.725rem;
        text-align: justify;
        color: var(--secondary);
      }
    }
  }

  > div {
    width: 100%;
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;

    > button {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Montserrat;

      &:hover {
        background-color: var(--blue-twitter);
        color: var(--white);
      }

      > svg {
        width: 0.875rem;
        height: 0.875rem;
        color: var(--orange);

        margin-right: 0.25rem;
      }
    }
  }
`;
