import styled from 'styled-components';

export const Content = styled.div`

  .headerText{
    text-Align: center;
    height: 35px;
    font-size: 0.765rem;
    font-weight: 500;
  }

  .boxText{
    height: 30px;
    font-size: 0.765rem;
    font-weight: 500;
  }

  .box {
    margin-top: 20px;
    border: solid 1px #cacaca;
    border-Radius: 0.25rem;
    box-Shadow: 1px 1px 4px 0.5px rgba(0, 0, 0, 0.15);
    padding: 15px 15px 15px 15px;
  }

`;


export const GridProfileNames = styled.div`
  width: 60%;
  font-size: 0.3rem;
  margin-left: 21%;
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
