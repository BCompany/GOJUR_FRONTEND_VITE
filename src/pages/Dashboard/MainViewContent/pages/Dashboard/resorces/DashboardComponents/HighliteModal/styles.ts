import styled from 'styled-components';

export const Container = styled.div`
  width: 50%;
  height: 80vh;
  border: 1px solid #000;
  padding: 1rem;
  background-color: var(--white-card);
  border-radius: 6px;
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translateX(50%) translateY(-50%);
  z-index: 999;
  font-family: Arial, Helvetica, sans-serif;

  display: flex;
  flex-direction: column;
  overflow: auto;
  ::-webkit-scrollbar {
    width: 0.25rem;
  }

  ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 0.5rem;
    border-radius: 0.5rem;
    background: var(--orange);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2);
  }

  > header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    > div {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;

      > p {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        font-size: 0.875rem;

        > button {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 1rem;

          > svg {
            width: 1.2rem;
            height: 1.2rem;
            &:hover {
              color: var(--orange);
            }
          }
        }
      }
    }
  }
`;

export const Content = styled.div`
  width: 100%;
  height: 100%;
  background: transparent;
  margin-top: -10px;
`;

export const Message = styled.div`
  border: 1px solid var(--blue-twitter);
  margin-top: 1rem;
  padding-right: 0.5rem;
  padding-left: 0.5rem;
  border-radius: 6px;
  background-color: transparent;

  display: flex;
  flex-direction: column;

  #messageContent{
    margin-top: 15px;
  }

  > div {
    font-size: 0.725rem;
    text-align: justify;
    color: var(--secondary);
    > p {
      font-size: 0.725rem;
      text-align: justify;
      color: var(--secondary);

      > a {
        text-decoration: none;
        color: var(--blue);
        font-size: 0.625rem;

        &:hover {
          color: var(--orange);
          opacity: 0.6;
        }
      }
    }
  }

  > section {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1rem;
    margin-bottom: 15px;

    > button {
      width: 280px;
      height: 32px;
      background-color: var(--orange);
      border-radius: 6px;
      font-size: 0.625rem;
      color: var(--white);

      &:hover {
        opacity: 0.6;
        color: var(--secondary);
      }
    }
  }

  > p {
    font-size: 0.75rem;
    color: var(--secondary);
  }
  > p#subtitle {
    font-size: 0.625rem;
    color: var(--secondary);
  }
`;

export const Shadow = styled.div`
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.1);
  position: absolute;
  z-index: 999;
`;
