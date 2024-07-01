import styled from 'styled-components';

export const Container = styled.div`
  width: 24rem;
  height: 12rem;
  background: var(--white);

  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.45);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  z-index: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  > p {
    font-size: 0.65rem;
    font-family: Montserrat;
    margin: 0.5rem;
    text-align: center;
  }
`;

export const Footer = styled.div`
  width: 100%;
  border-top: 1px solid var(--grey);

  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0.25rem;
  > button {
    background-color: var(--blue-light);
    color: var(--white);
    border-radius: 4px;
    padding: 0.5rem;
    transition: all 0.5s;

    &:hover {
      background-color: var(--blue);
    }
  }
`;
