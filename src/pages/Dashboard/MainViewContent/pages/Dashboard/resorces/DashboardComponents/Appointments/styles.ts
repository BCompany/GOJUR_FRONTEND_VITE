import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

interface ItemProps {
  done: string;
}

interface headerProps {
  cursorMouse: boolean;
  handleClose: boolean;
}

export const ContainerHeader = styled.div<headerProps>`
  width: 100%;
  height: 1.5rem;
  background: rgba(0, 0, 0, 0.1);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: 0.3s all;

  > div {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

      > p {
        font-family: montserrat;
        font-weight: normal;
        font-size: 0.75rem;
        line-height: 1.2px;
        padding: 20px;
      }

      div{
        display: flex;
      }

      > button {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;

        > svg {
          width: 24px;
          height: 24px;
          color: var(--blue-twitter);
          cursor:pointer;
        }

        &:hover {
          > svg {
            color: var(--orange);
          }
        }
      }
    }

  > div {
    display: ${props => (props.handleClose ? 'flex' : 'none')};
    align-items: center;
    justify-content: center;

    > svg {
      width: 1.5rem;
      height: 1.5rem;
      color: var(--grey);
      border-radius: 4px;
      margin-right: 0.5rem;

      &:hover {
        color: var(--orange);
        background-color: var(--white);
      }
    }
  }`;

export const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: var(--white);

  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const AppointmentContent = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fafafa;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.4);
  /* border: 1px solid #999591; */
  display: flex;
  flex-direction: column;
  align-items: center;
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

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 0.25rem;
    margin-bottom: 1rem;

    > h2 {
      font-family: Poppins;
      font-weight: normal;
      font-size: 0.875rem;
      color: var(--secondary);
      display: flex;
      align-items: center;
      justify-content: center;

      > button {
        /* margin-top: 16px; */
        margin-left: 16px;
        width: 16px;
        height: 16px;
        background: var(--orange);
        border-radius: 6px;
        color: var(--white);
        transition: all 0.5s;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        > svg {
          width: 14px;
          height: 14px;
        }

        > p {
          display: none;
        }

        // effect when hover pllus button
        /* &:hover {
          width: 124px;
          height: 20px;
          color: var(--secondary);
          align-items: center;

          > svg {
            color: var(--white);
          }

          > p {
            display: flex;
          }
        } */
      }

      > p {
        font-family: Poppins;
        font-weight: normal;
        font-size: 11px;
        color: var(--orange);
        margin-top: 0.25rem;
      }
    }
  }
`;

export const AppointmentItens = styled(motion.div)<ItemProps>`
  width: 90%;
  height: 5rem;
  background: var(--white-card);
  border-radius: 0.5rem;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);

  ${props =>
    props.done === 'L' &&
    css`
      filter: opacity(30%);
    `}

  transition: background-color 0.3s, height 1.5s;

  &:hover {
    margin-left: 0.5rem;
    height: 17.5rem;

    cursor: pointer;

    background-color: var(--blue-hover-light);
  }
`;

export const AppointmentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 1.25rem;
  margin-top: 0.5rem;
  > div {
    display: flex;
    align-items: center;
    justify-content: center;

    > svg {
      width: 0.875rem;
      height: 0.875rem;
      color: var(--orange);
    }

    > p {
      font-family: Poppins;
      font-weight: 600;
      font-size: 0.625rem;
      color: #999591;
      margin-left: 0.25rem;
    }
  }

  > strong {
    width: 18.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: Poppins;
    font-weight: 600;
    font-size: 0.625rem;
    color: var(--primary);
  }

  > svg {
    width: 1.5rem;
    height: 1.5rem;
    color: var(--blue-light);
    margin-right: 0.5rem;

    &:hover {
      color: var(--blue-twitter);
    }
  }
`;

export const AppointmentDescription = styled.div`
  flex: 1;
  padding: 0.5rem;
  overflow: hidden;

  > p {
    font-family: Poppins;
    font-weight: normal;
    word-break: break-all;
    font-size: 0.625rem;
    color: var(--secondary);
  }
`;
