import styled from 'styled-components'

export const Container = styled.div`
  z-index:99999,
  flex-direction: column;
  font-family: Montserrat;
  min-height:80vh;

  header {
    color: var(--blue-twitter);
    text-align: center;
    margin-bottom:1rem;

    h1 {
      font-size:0.8rem;
      font-weight:300;
      margin-bottom:0.5rem;
    }
  }
`;

export const ContainerDetails = styled.div `
  width: 32rem;
  height: auto;
  max-height: 25rem;
  background-color: #fff;
  z-index: 99999;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  font-size: 0.675rem;
  top: 32%;
  left: 32%;
  position: absolute;

  // mídia para dispositivos móveis
  @media (max-width: 768px) {
    width: 90%;
    height: auto;
    max-height: none;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  > header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 0.5rem;
    padding-top: 0.25rem;
    background-color: rgba(0, 0, 0, 0.06);
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
    padding: 0.8rem 2rem;
    font-family: Montserrat;

    p {
      font-size: 0.75rem;
      color: var(--primary);
      text-align: center;

      .checkMessage{
        color:red;
        font-size:0.7rem;
      }

      .checkMessageWarnning{
        color:red;
        font-size:0.7rem;
        font-weight:600;
      }
    }
  }

  footer {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    width:100%;

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