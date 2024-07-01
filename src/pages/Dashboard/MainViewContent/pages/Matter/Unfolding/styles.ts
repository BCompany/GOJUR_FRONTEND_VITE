import styled from 'styled-components';

interface SearchProps {
  show:boolean
}

export const Modal = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size: 0.7rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width: 70%;
  min-height: 70%;
  max-height: 80%;
  overflow: auto;
  background-color: var(--white);
  position: absolute;
  z-index: 99998;
  justify-content: center;
  margin-left: 4%;
  margin-top: -6%;

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
    width: 93%;
    background-color: #dcdcdc;
    height: 27px;
  }

  .menuSection {
    font-size: 0.65rem;
    padding: 0.25rem 0.5rem;
    color: var(--blue-twitter);
    text-align: right;
    cursor: pointer;
    float: left;
    width: 6.9%;
    background-color: #dcdcdc;
    height: 27px;

    > svg {
      width: 0.85rem;
      height: 0.85rem;
      stroke-width: 3px;
    }

    &:hover {
      color: var(--orange);
    }
  }
`;

export const GridUnfolding = styled.div`

  width: 95%;
  font-size: 0.3rem;
  margin-left: 2%;
  font-family: Montserrat;

  span {
    font-size: 0.675rem;
    color: var(--blue-twitter);
  }

  big {
    font-size: 0.675rem;
    color: var(--blue-twitter);
  }

  svg {
      width: 1rem;
      height: 1rem;
      margin-left: 0.8rem;
      color: var(--blue-light);
      cursor: pointer;

      &:hover {
        color: var(--orange)
      }
  }
  & tbody tr:nth-of-type(odd){
    background-color: #D9ECEC
  }
`;
