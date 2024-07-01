import styled from 'styled-components';

  interface SearchProps {
    show:boolean
  }
  
  export const Modal = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size: 0.7rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width: 630px;
  min-height: 25rem;
  max-height: 27rem;
  overflow: auto;
  background-color: var(--white);
  position: absolute;
  z-index: 99999;
  justify-content: center;
  margin-left: 23%;
  margin-top: 5%;

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

  .header {
    height: 30px;
    position: fixed;
    width: 45.95%;
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

export const ProfileTable = styled.div`
  overflow: auto;

  table {
    border-spacing: 0 0;

    th {
      color: white;
      font-weight: 400;
      padding: 0.5rem;
      text-align: center;
      line-height: 1rem;
      background: var(--text-title);
      font-size: 0.7rem;
      background-color: #0177C0;
    }

    tr:nth-child(odd) {
      background-color:#D9ECEC;
    }

    td {
      padding: 0.5rem;
      border: 0;
      background: var(--shape);
      color: var(--text-body);
      font-size: 0.6rem;
      text-align: unset;

      &.wrap {
        max-width: 10rem;
        word-wrap: break-word;
      }
    }
  }
`;
