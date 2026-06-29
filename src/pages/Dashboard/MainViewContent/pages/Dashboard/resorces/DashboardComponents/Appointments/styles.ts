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
  height: 2rem;
  background: #eef4fb;
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: 0.3s all;
  border-bottom: 1px solid rgba(44, 142, 214, 0.12);

  > div {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

      > p {
        font-family: Montserrat;
        font-weight: 500;
        font-size: 0.72rem;
        line-height: 1.2;
        color: var(--blue-twitter);
        padding: 0 0.5rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
  background-color: transparent;
  display: flex;
  flex-direction: column;
  padding: 0.6rem 0.75rem 0.5rem;
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
    align-items: center;
    margin-bottom: 0.5rem;

    > h2 {
      font-family: Montserrat;
      font-weight: 500;
      font-size: 0.72rem;
      color: var(--blue-twitter);
      display: flex;
      align-items: center;
      gap: 0.5rem;

      > button {
        width: 16px;
        height: 16px;
        background: var(--orange);
        border-radius: 4px;
        color: var(--white);
        display: flex;
        align-items: center;
        justify-content: center;

        > svg {
          width: 12px;
          height: 12px;
        }

        > p {
          display: none;
        }
      }
    }
  }
`;

export const AppointmentItens = styled(motion.div)<ItemProps>`
  width: 100%;
  height: auto;
  min-height: 4rem;
  background: var(--white-card);
  border-radius: 4px;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.10);
  margin-bottom: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;

  ${props =>
    props.done === 'L' &&
    css`
      filter: opacity(30%);
    `}

  transition: background-color 0.3s, box-shadow 0.3s, height 1.5s;

  &:hover {
    height: 17.5rem;
    background-color: var(--blue-hover-light);
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
  }
`;

export const AppointmentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 1.25rem;
  margin-top: 0.5rem;
  padding-left: 0.5rem;
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
  padding: 0.35rem 0.75rem 0.5rem;
  overflow: hidden;

  > p {
    font-family: Montserrat;
    font-weight: normal;
    font-size: 0.68rem;
    color: var(--secondary);
    line-height: 1.45;
    overflow-wrap: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;
