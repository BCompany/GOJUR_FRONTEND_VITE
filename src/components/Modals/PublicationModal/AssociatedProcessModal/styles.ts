import styled from 'styled-components';

interface GridProps {
  close: boolean;
}

export const Container = styled.div`
  width: 880px;
  height: 480px;

  background-color: var(--gray);
  filter: drop-shadow(1px 4px 4px rgba(0, 0, 0, 0.35));

  z-index: 1;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateY(-50%) translateX(-50%);

  display: flex;
  flex-direction: column;
`;

export const GridSearch = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;

  > label {
    font-size: 0.75rem;
  }
`;

export const Grid = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.2);
  flex: 1;
  height: auto;
  margin: 2rem;
  margin-top: 1rem;
  margin-bottom: 3.5rem;
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
export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  header {
    width: 100%;
    font-size: 0.75rem;
    font-family: montserrat;
    text-align: center;
    padding: 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    margin-bottom: 0.5rem;
    font-size: 12px;
  }
`;
export const ItemContent = styled.div`
  /* border: 1px solid black; */
  width: 100%;
  height: auto;
  max-height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--grey);

  > section {
    padding: 1rem;

    > input {
      width: 20px;
      height: 20px;
    }
  }

  > div {
    /* border: 1px solid black; */
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;

    > article {
      flex: 1;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 0.5rem;
      margin-right: 0.5rem;
      font-size: 0.65rem;
      font-family: Montserrat;
      font-weight: 500;
      > p {
        font-size: 0.5rem;
        font-weight: 300;
        font-family: Poppins;
      }
    }
  }
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 1rem;
  position: absolute;
  bottom: 0;
  right: 2rem;

  > button {
    width: 6rem;
    height: 1.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    font-family: Montserrat;
    padding: 1rem;
    margin: 0.5rem;
    background-color: var(--blue-twitter);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.25rem;
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.2);
    color: var(--white);

    &:hover {
      background-color: var(--blue);
    }
  }

  > div {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    > button {
      width: 6rem;
      height: 1.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      font-family: Montserrat;
      padding: 1rem;
      margin: 0.5rem;
      background-color: var(--blue-twitter);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.25rem;
      box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.2);
      color: var(--white);

      &:hover {
        background-color: var(--blue);
      }
    }
  }
`;
