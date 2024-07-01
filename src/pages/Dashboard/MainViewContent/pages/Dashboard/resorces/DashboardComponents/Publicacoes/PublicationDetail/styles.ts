import styled from 'styled-components';
import { motion } from 'framer-motion';

interface DetailProps {
  styles: boolean;
  visible?: boolean;
}

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: transparent;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalContent = styled(motion.div)<DetailProps>`
  width: 50%;
  height: 350px;
  background-color: ${props => (props.styles ? '#e1f5fe' : '#ffffcc')};
  border-radius: 16px;
  box-shadow: 2px 1px 4px 2px rgba(0, 0, 0, 0.4);

  > header {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding: 0.25rem;

    > svg {
      margin-right: 1rem;
      color: ${props => (props.styles ? `var(--blue-light)` : `var(--orange)`)};

      &:hover {
        color: ${props => (props.styles ? `var(--blue)` : `var(--blue)`)};
      }
    }
  }

  > div {
    width: 100%;
    height: 300px;
    display: flex;
    padding-left: 1rem;
    padding-right: 1rem;
    flex-direction: column;
    justify-content: space-around;
    overflow: hidden;
  }
`;

export const Field = styled.div`
  width: 100%;
  display: flex;
  align-items: center;

  > h2 {
    font-family: Montserrat;
    font-size: 0.875rem;
  }

  > p {
    font-family: Montserrat;
    font-size: 0.75rem;
    margin-left: 1rem;
  }
  > a {
    font-family: Montserrat;
    font-size: 0.75rem;
    margin-left: 1rem;
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
  /* justify-content: space-between; */

  > h2 {
    font-family: Montserrat;
    font-size: 0.875rem;
  }
  > h2#release {
    font-family: Montserrat;
    font-size: 0.875rem;
    margin-left: 1rem;
  }

  > p {
    font-family: Montserrat;
    font-size: 0.75rem;
    margin-left: 1rem;
  }
`;
export const Description = styled.div`
  width: 100%;
  overflow: auto;

  ::-webkit-scrollbar {
    width: 0.25rem;
  }

  ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 0.5rem;
    border-radius: 0.5rem;
    background: var(--orange);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.4);
  }

  > h2 {
    font-family: Montserrat;
    font-size: 0.875rem;
  }

  > p {
    font-family: Montserrat;
    font-size: 0.625rem;
    margin-top: 0.5rem;
    margin-right: 0.5rem;
    text-align: justify;
    line-height: 1rem;
  }
`;
