import styled, { css } from 'styled-components';


export const Content = styled.p `
  font-size :0.75rem;
  position :relative;

  &.hightLight{
    background-color:yellow;
  }

  span {
    word-break:break-all;
  }


  > button {
    color: #ff9000;
    text-decoration:none;
    cursor:pointer;
    margin-left:10px;
    font-size :0.75rem;
  }
`;
