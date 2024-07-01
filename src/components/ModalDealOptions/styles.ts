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

  z-index: 99999;
  position: fixed;
  top: 50.5%;
  left: 57%;
  transform: translateX(-50%) translateY(-50%);
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  font-size:0.75rem;
  text-align: center;
  padding: 0.5rem;
  color: var(--secondary);
  font-size: 0.7rem;
  font-family: Montserrat;
  margin: 0.5rem;
  text-align: center;
`;

export const Footer = styled.div`
    margin-bottom:10px;

`;
