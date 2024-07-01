import styled from 'styled-components';
import { MultiSelect } from 'react-multi-select-component';

export const Content = styled.div`
  .headerText {
    text-align: center;
    height: 35px;
    font-size: 0.765rem;
    font-weight: 500;
  }

  .boxText {
    height: 30px;
    font-size: 0.765rem;
    font-weight: 500;
  }

  .box {
    margin-top: 20px;
    border: solid 1px #cacaca;
    border-radius: 0.25rem;
    box-shadow: 1px 1px 4px 0.5px rgba(0, 0, 0, 0.15);
    padding: 15px 15px 15px 15px;
  }
`;

export const Multi = styled(MultiSelect)`
  font-size: 0.7rem;
  background-color: var(--white);
  color: var(--primary);

  &::placeholder {
    color: var(--primary);
  }

  &:focus {
    border: none;
  }
`;

export const GridProfileNames = styled.div`
  width: 90%;
  font-size: 0.3rem;
  margin-left: 5%;
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
      color: var(--orange);
    }
  }
  & tbody tr:nth-of-type(odd) {
    background-color: #d9ecec;
  }
`;
