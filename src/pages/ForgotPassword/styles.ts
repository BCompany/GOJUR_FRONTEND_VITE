import styled, { keyframes } from 'styled-components';

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
  @media (max-width: 26.25rem) {
    display: none;
  }
`;

export const Aside = styled.div`
  width: 40vw;
  height: 100vh;
  background: rgb(0, 119, 192);
  background: linear-gradient(
    142deg,
    rgba(0, 119, 192, 1) 75%,
    rgba(35, 190, 99, 1) 100%
  );
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  > img {
    width: 100%;
    height: 100%;
  }

  > a {
    text-decoration: none;
    color: var(--gray-outline);
    font-family: Poppins;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2rem;

    &:hover {
      color: var(--blue-light);
    }

    > svg {
      margin-right: 0.5rem;
    }
  }
`;

export const HeaderSide = styled.div`
  width: 27.0625rem;
  height: 6rem;
  padding: 1rem;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

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
      font-size: 1.375rem;
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
export const Content = styled.div`
  width: 27.5rem;
  height: 13.75rem;
  padding: 1rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: ${appearFromLeft} 2s;

  form {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    > h1 {
      font-size: 1.375rem;
      font-weight: 500;
      font-family: Poppins;
      color: var(--gray-outline);
      margin-bottom: 2rem;
    }
  }
`;
export const ImgBackground = styled.img`
  flex: 1;
  height: 100vh;
  overflow: hidden;
`;
