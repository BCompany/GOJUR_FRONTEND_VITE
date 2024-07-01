import styled from 'styled-components';

interface SearchProps {
  show:boolean
}

export const ModalDateSelect = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size: 0.7rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width: 400px;
  min-height: 10rem;
  max-height: 12rem;
  overflow: auto;
  background-color: var(--white);
  position: absolute;
  z-index: 99999;
  justify-content: center;
  margin-left: 25%;
  margin-top: 15%;

  > svg {
    width:1rem;
    height:2rem;
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

  .paymentButtons {
    height: 27px;
    background-color: var(--blue-twitter);
    font-size: 0.625rem;
    color: #FFFFFF;
    cursor:pointer;
    font-family: montserrat;
    border-radius: 0.25rem;
    justify-content: center;
    border: solid 1px #2c8ed6;
    width: 30px;
    margin-top: 6px;

    > svg {
      width: 0.8rem;
      height: 0.8rem;
      margin-right: 0.3rem;
    }

    &:hover {
      filter: brightness(80%);
    }
  }
`;
