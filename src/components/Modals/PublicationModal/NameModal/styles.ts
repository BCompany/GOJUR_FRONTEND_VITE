import styled from 'styled-components';

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

export const Modal = styled.div`
  width: 60%;
  height: auto;
  max-height: 25rem;
  background-color: var(--white);
  box-shadow: 4px 4px 4px 4px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  display: flex;
  flex-direction: column;

/* adjust for size in mobile application */
  @media (max-width: 600px)
  {
    width: 95%;  
  }
  
  p {
      flex: 1;
      color: var(--secondary);
      font-size: 0.675rem;
      text-align: center;
  }
  > header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 0.5rem;
    padding-top: 0.25rem;
    background-color: rgba(0, 0, 0, 0.1);
    > button {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      > svg {
        width: 24px;
        height: 24px;
        color: var(--secondary);
      }

      &:hover {
        > svg {
          color: var(--orange);
        }
      }
    }
  }

  > div {
    display: flex;
    flex-direction: column;
    padding: 0.5rem;

    > section {
      display: flex;

      > input {
        /* flex: 1; */
        width: 180px;
        height: 40px;
        margin-top: 1px;
        border-bottom: 1px solid var(--grey);
        padding: 0 0.5rem;
        margin-left: 0.5rem;
        margin-right: 0.5rem;

        &:hover {
          border-bottom: 2px solid var(--grey);
        }
      }

      > button {
        width: 5rem;
        height: 2rem;
        margin-top: 1px;
        background-color: var(--blue-light);
        color: var(--white);

        &:hover {
          background-color: var(--blue-twitter);
        }
      }
    }
  }
`;

export const ContentGrid = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  border: 1px solid var(--secondary);

  > header {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.1);
    font-size: 0.875rem;
    font-family: Montserrat;
    padding: 0.25rem 0;
    border-bottom: 1px solid var(--primary);
  }

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const Grid = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.2);
  flex: 1;
  height: auto;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  overflow: auto;

  ::-webkit-scrollbar {
    width: 0.225rem;
  }

  ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 0.5rem;
    border-radius: 0.5rem;
    background: var(--orange);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.125);
  }

  /* border: 1px solid black; */

  > header {
    width: 100%;
    height: 2rem;
    background: rgba(0, 0, 0, 0.1);
    color: var(--grey);
    border-radius: 0.5rem 0.5rem 0 0;

    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: 0.3s all;
    font-size: 0.875rem;
    padding: 1rem;
    font-family: montserrat;
    font-weight: normal;
    font-size: 0.75rem;
    line-height: 1.2px;
    padding: 20px;

    > div {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0.5rem;

      > button {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        > svg {
          width: 20px;
          height: 20px;
          color: var(--blue-light);
          margin-left: 8px;
          margin-right: 8px;
        }

        &:hover {
          background-color: rgba(0, 0, 0, 0.05);

          > svg {
            color: var(--orange);
          }
        }
      }

      > p {
        font-size: 0.875rem;
        font-family: Montserrat;
      }
    }
  }
`;

export const Footer = styled.div`
  flex: 1;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  > button {
    width: 4rem;
    height: 2rem;
    background-color: var(--orange);
    color: var(--white);
    border-radius: 6px;

    &:hover {
      opacity: 0.5;
    }
  }
`;

export const ProfileTable = styled.div`
  margin-top: -0.5rem;
  max-height: 12.5rem;
  overflow: auto;

  ::-webkit-scrollbar {
    width: 0.225rem;
  }

  ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 0.5rem;
    border-radius: 0.5rem;
    background: var(--orange);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.125);
  }
  table {
    width: 100%;
    border-spacing: 0 0.5rem;
    th {
      color: var(--text-body);
      font-weight: 400;
      padding: 0.5rem;
      text-align: center;
      line-height: 1rem;
      background: var(--text-title);
      font-size: 0.75rem;
      color: var(--grey);
      background-color: var(--gray);
    }

    td {
      padding: 0.5rem;
      border: 0;
      background: var(--shape);
      color: var(--text-body);
      background-color: var(--white-card);
      box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
      font-size: 0.65rem;
      text-align: center;

      &.wrap {
        max-width: 10rem;
        word-wrap: break-word;
      }

      button {
        width: 100%;

        svg {
          width: 1rem;
          height: 1rem;
          color: var(--blue-light);
        }

        &:hover {
          svg {
            color: var(--orange);
          }
        }
      }

      input {
        width: 100%;
        height: 40px;
        padding: 0 0.5rem;
        border-radius: 4px;
        border: 1px solid var(--blue-light);
        word-wrap: break-word;
        font-size: 0.625rem;
        color: var(--blue);

        &:focus {
          border: 1px solid var(--orange);
        }
      }
    }
  }
`;

export const CheckModal = styled.div`
  width: 32rem;
  height: auto;
  max-height: 25rem;
  background-color: #fff;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  font-size:0.675rem;
  position: absolute;

  > header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 0.5rem;
    padding-top: 0.25rem;
    background-color: rgba(0, 0, 0, 0.1);
    color: var(--orange);
    > button {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      > svg {
        width: 24px;
        height: 24px;
        color: var(--secondary);
      }

      &:hover {
        > svg {
          color: var(--orange);
        }
      }
    }
  }

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 4rem;
    p {
      font-size: 0.7rem;
      color: var(--primary);
    }
  }

  footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 1rem;

    button {
      padding: 0.5rem 2rem;
      color: var(--white);
      border-radius: 0.25rem;
      margin: 0 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        color: var(--white);
        width: 1.25rem;
        height: 1.25rem;
        margin-right: 0.5rem;
      }

      &:hover {
        filter: brightness(75%);
        font-size:0.65rem;
      }

      &.accept {
        background-color: var(--green);
        font-size:0.65rem;
      }

      &.cancel {
        background-color: var(--red);
        font-size:0.65rem;
      }
    }
  }
`;
