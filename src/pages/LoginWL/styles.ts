import styled, { keyframes } from 'styled-components';
import BgImg from '../../assets/AsideBg.png';

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

export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;

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
    width: 18.75rem;
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
