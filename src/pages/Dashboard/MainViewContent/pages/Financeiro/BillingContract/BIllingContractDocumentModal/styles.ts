import styled from 'styled-components';

  interface SearchProps {
    show:boolean
  }
  
  export const Modal = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size:0.7rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:25rem;
  height:11rem;
  background-color:var(--white);
  position:absolute;
  z-index:999999999;
  justify-content:center;
  margin-left:25%;
  margin-top:15%;

  .menuTitle {
    font-size:0.65rem;
    padding: 0.25rem 0.5rem;
    color:black;
    text-align:center;
    float: left;
    width:93%;
    background-color: #dcdcdc;
    height: 27px;
  }

  .menuSection {
    font-size:0.65rem;
    padding: 0.25rem 0.5rem;
    color:var(--blue-twitter);
    text-align:right;
    cursor:pointer;
    float: left;
    width:7.003%;
    background-color: #dcdcdc;
    height: 27px;

    > svg {
      width:0.85rem;
      height:0.85rem;
      stroke-width: 3px;
    }

    &:hover {
      color: var(--orange);
    }
  }
`;
