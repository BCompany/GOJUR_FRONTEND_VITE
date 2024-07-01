import styled, { keyframes } from 'styled-components';

const colorCycle = keyframes`
0%, 55% {
    filter: brightness(0) invert(1) ;
  }
11%, 33% {
  filter: none;
} 
`;
const colorCycleBtn = keyframes`
0%, 55% {
    filter: brightness(0.5) ;
}
11%, 33% {
  filter: none;
} 
`;

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--white);

  > h1 {
    font-size: 4rem;
    font-family: MontSerrat;
    font-weight: 500;
    text-align: center;
  }
  filter: brightness(0) invert(1);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-image: linear-gradient(
    -45deg,
    var(--blue),
    var(--primary),
    var(--orange)
  );
  animation: ${colorCycle} 10s ease-in-out infinite;
  animation: ${colorCycleBtn} 10s ease-in-out infinite;
  animation-delay: 6s;
  &:hover {
    margin-left: 8px;
  }
`;
