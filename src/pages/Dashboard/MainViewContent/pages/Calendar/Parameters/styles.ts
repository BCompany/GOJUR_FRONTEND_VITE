import styled from 'styled-components';

export const ModalParameters = styled.div`
  border: 1px solid var(--blue-twitter);
  font-size:0.665rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:22rem;
  height:25rem;
  background-color:var(--white);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index:99999;

  input, select {
      flex: 1;
      font-size: 0.675rem;
      padding: 0.25rem;
      background-color: rgba(255,255,255,0.25);
      width: 99%;
      border-bottom: 1px solid rgba(0,0,0,0.15);
      color: var(--secondary);

      &:focus {
        border-bottom: 1px solid var(--orange);
      }
    }
`;

export const ModalParametersMobile = styled.div`
  border: 1px solid var(--blue-twitter);
  font-size:0.665rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:22rem;
  height:34rem;
  background-color:var(--white);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index:99999;

  input, select {
      flex: 1;
      font-size: 0.675rem;
      padding: 0.25rem;
      background-color: rgba(255,255,255,0.25);
      width: 99%;
      border-bottom: 1px solid rgba(0,0,0,0.15);
      color: var(--secondary);

      &:focus {
        border-bottom: 1px solid var(--orange);
      }
    }
`;
