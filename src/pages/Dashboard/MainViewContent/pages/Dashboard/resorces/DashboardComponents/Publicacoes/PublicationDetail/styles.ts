import styled from 'styled-components';
import { motion } from 'framer-motion';

interface DetailProps {
  styles: boolean;
  visible?: boolean;
}

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.35);
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

export const ModalContent = styled(motion.div)<DetailProps>`
  width: 65%;
  max-width: 700px;
  height: auto;
  background-color: var(--white-card);
  border-radius: 8px;
  border-left: 3px solid ${props => (props.styles ? 'var(--blue-twitter)' : '#c49a00')};
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.18);
  overflow: hidden;

  > header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    background: ${props => (props.styles ? '#eaf4ff' : '#ffffcc')};
    border-bottom: 1px solid ${props => (props.styles ? 'rgba(44,142,214,0.15)' : 'rgba(196,154,0,0.2)')};

    > span {
      font-family: Montserrat;
      font-size: 0.75rem;
      font-weight: 500;
      color: ${props => (props.styles ? 'var(--blue-twitter)' : '#c49a00')};
    }

    > svg {
      width: 1rem;
      height: 1rem;
      color: var(--grey);
      cursor: pointer;

      &:hover {
        color: var(--orange);
      }
    }
  }

  > div {
    width: 100%;
    height: auto;
    max-height: 75vh;
    display: flex;
    padding: 1rem;
    flex-direction: column;
    gap: 0.6rem;
    overflow-y: auto;
  }
`;

export const Field = styled.div`
  width: 100%;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;

  > h2 {
    font-family: Montserrat;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--secondary);
    white-space: nowrap;
  }

  > p {
    font-family: Montserrat;
    font-size: 0.75rem;
    color: var(--primary);
  }

  > a {
    font-family: Montserrat;
    font-size: 0.75rem;
    color: var(--secondary);
    text-decoration: none;

    &:hover {
      color: var(--orange);
      text-decoration: underline;
    }
  }
`;

export const Date = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  > h2 {
    font-family: Montserrat;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--secondary);
    white-space: nowrap;
  }

  > p {
    font-family: Montserrat;
    font-size: 0.75rem;
    color: var(--primary);
  }
`;

export const Description = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  > h2 {
    font-family: Montserrat;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--secondary);
  }

  > p {
    font-family: Montserrat;
    font-size: 0.72rem;
    color: var(--primary);
    text-align: justify;
    line-height: 1.5;
  }
`;
