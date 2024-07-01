import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 9999;
  top: 0;
`;

export const Modal = styled.div`
  width: 50%;
  height: 25rem;
  background-color: var(--white);
  box-shadow: 4px 4px 4px 4px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  display: flex;
  flex-direction: column;

  > header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 0.5rem;
    padding-top: 0.25rem;

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
`;
export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;

  > div {
    display: flex;
    align-items: center;
    margin-top: 0.5rem;
    > h3 {
      font-size: 0.865rem;
      font-family: Montserrat;
      font-weight: 500;
      color: var(--primary);
    }

    > p {
      flex: 1;
      text-align: center;
      font-size: 0.765rem;
      color: var(--secondary);
    }
  }

  > a {
    text-decoration: none;
    font-family: Montserrat;
    font-size: 0.75rem;
    color: var(--blue);
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;

    &:hover {
      color: var(--orange);
    }
  }
`;

export const Acompanhamentos = styled.div`
  border: 1px solid var(--grey);
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 4px;

  > header {
    width: 100%;
    display: flex;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid var(--grey);
    justify-content: center;
    > h1 {
      flex: 1;
      text-align: center;
      font-weight: 500;
      font-size: 1rem;
      color: var(--secondary);
    }

    > div {
      display: flex;
      align-items: center;
      justify-content: center;

      > button {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.625rem;
        font-family: Montserrat;
        color: var(--white);
        margin: 0 0.5rem;
        > svg {
          width: 1rem;
          height: 1rem;
          color: var(--orange);
        }

        &:hover {
          background-color: rgba(0, 0, 0, 0.3);
        }
      }
    }
  }

  > section {
    flex: 1;
    max-height: 220px;
    display: flex;
    flex-direction: column;

    overflow: auto;
    padding: 0 0.5rem;

    ::-webkit-scrollbar {
      width: 4px;
    }
    ::-webkit-scrollbar-thumb {
      -webkit-border-radius: 0.5rem;
      border-radius: 0.5rem;
      background: var(--orange);
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
    }

    > div {
      /* flex: 1; */
      display: flex;
      /* align-items: center; */
      margin-top: 1rem;
      border-bottom: 1px solid var(--grey);
      > h3 {
        font-size: 0.875rem;
        font-weight: 400;
        font-family: Montserrat;
        color: var(--primary);
      }

      > p {
        flex: 1;
        max-height: 96px;
        font-size: 0.75rem;
        font-weight: 400;
        text-align: justify;
        margin-left: 1rem;
        padding-right: 0.25rem;
        overflow: auto;
        color: var(--secondary);

        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-thumb {
          -webkit-border-radius: 0.5rem;
          border-radius: 0.5rem;
          background: var(--orange);
          -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
        }
      }
    }
    > button {
      padding: 0.25rem;

      background-color: var(--orange);
      color: var(--secondary);
      transition: all 0.3s;
      &:hover {
        opacity: 0.5;
      }
    }
  }
`;
