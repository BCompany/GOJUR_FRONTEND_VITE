import styled from 'styled-components';

interface SearchProps {
  show:boolean
}

export const Modal = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size: 0.7rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width: 400px;
  min-height: 12rem;
  max-height: 14rem;
  overflow: auto;
  background-color: var(--white);
  position: absolute;
  z-index: 3;
  justify-content: center;
  margin-left: 35%;
  margin-top: 10%;

  > svg {
    width: 1rem;
    height: 2rem;
    color: white;
  }

  input, select {
    flex: 1;
    font-size: 0.675rem;
    padding: 0.25rem;
    background-color: #FFFFFF;
    width: 99%;
    border-bottom: 1px solid rgba(0,0,0,0.15);
    color: var(--secondary);

    &:focus {
    border-bottom: 1px solid var(--orange);
    }
  }

  .menuTitle {
    font-size: 0.65rem;
    padding: 0.25rem 0.5rem;
    color: black;
    text-align: center;
    float: left;
    width: 100%;
    background-color: #dcdcdc;
    height: 27px;
  }
`;
