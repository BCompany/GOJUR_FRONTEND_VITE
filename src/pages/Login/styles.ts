import styled, { keyframes } from "styled-components";
import { envProvider } from "services/hooks/useEnv";

const appearFromLeft = keyframes`
 from {
    opacity: 0;
    transform: translateX(-3.125rem);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }

`;

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  background-color: var(--gray-outline);
`;

export const Aside = styled.div`
  width: 40vw;
  height: 100vh;
  /* background: rgb(0, 119, 192);
  background: linear-gradient(
    142deg,
    rgba(0, 119, 192, 1) 75%,
    rgba(35, 190, 99, 1) 100%
  ); */
  background: url(${envProvider.mainUrl}/assets/AsideBg.png) no-repeat center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  > img {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 420px) {
    display: none;
  }
`;

export const HeaderSide = styled.div`
  width: 27.0625rem;
  height: 6rem;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;

  > a {
    > img {
      width: 4rem;
      height: 4rem;

      animation: ${appearFromLeft} 1.5s;
    }
  }

  div {
    width: 19.0625rem;
    height: 4.625rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    animation: ${appearFromLeft} 1s;

    > h1 {
      font-size: 1.125rem;
      font-family: poppins;
      font-weight: 500;
      color: var(--gray-outline);
    }

    > p {
      font-size: 1rem;
      font-family: Montserrat;
      color: var(--gray-outline);
    }
  }
`;

export const ContentSide = styled.div`
  width: 27.5rem;
  padding: 1rem;

  > p {
    font-size: 0.875rem;
    font-family: Montserrat;
    margin-bottom: 1rem;
    color: var(--gray-outline);

    animation: ${appearFromLeft} 2s;
  }
`;

export const Contrate = styled.div`
  width: 16rem;
  height: 2.5rem;
  padding: 1rem;

  background: var(--green);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  animation: ${appearFromLeft} 3s;

  transition: background-color 0.4s;

  box-shadow: 1px 2px 16px 8px rgba(15, 82, 152, 1);
  &:active {
    transform: scale(0.95);
  }

  &:hover {
    background: var(--green-dark);
  }

  > a {
    text-decoration: none;
    font-size: 1rem;
    font-family: poppins;
    color: var(--gray-outline);
    margin-right: 0.5rem;
  }
`;

export const FooterSide = styled.div`
  width: 28.5rem;
  height: 2rem;
  padding: 1rem;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  > a {
    text-decoration: none;
    font-family: Montserrat;
    font-size: 0.875rem;
    color: var(--gray-outline);
    font-size: 0.75rem;

    &:hover {
      color: var(--blue);
      font-size: 0.8125rem;
    }
  }
`;

export const Socials = styled.div`
  width: 7.75rem;
  height: 2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  > a {
    > svg {
      width: 1.5rem;
      height: 1.5rem;
      color: var(--gray-outline);
      transition: color 0.4s;
      cursor: pointer;

      &:hover {
        width: 2rem;
        height: 2rem;
        color: var(--green-dark);
      }
    }
  }
`;

export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;

  > img {
    width: 23.75rem;
    height: 9.75rem;
  }

  > a {
    text-decoration: none;
    color: var(--secondary);
    font-size: 1.125rem;
    font-family: Poppins;

    &:hover {
      color: var(--orange);
    }
  }

  form {
    width: 23.75rem;
    margin: 0 auto;
    display: flex;
    flex-direction: column;

    h2 {
      font-family: Poppins;
      font-size: 1rem;
      font-weight: 500;
      color: var(--secundary);
      margin-bottom: 0.5rem;
    }
  }

  > select {
    display: none;
    flex: 1;
    padding-right: 0.5rem;
    position: absolute;
    top: 2rem;
    right: 0.5rem;
    background: var(--gray-outline);
    border: 0;
    outline: 0;
    border-bottom: 0.25rem;
    cursor: pointer;

    > option {
      cursor: pointer;
    }
  }
  @media (max-width: 420px) {
    background: var(--blue);
    display: flex;
    flex-direction: column;
    align-items: center;
    /* justify-content: space-around; */

    > img {
      width: 15rem;
      height: 6rem;
    }

    > form {
      margin-top: -300px;
    }
    > a {
      display: none;
    }
  }
`;
