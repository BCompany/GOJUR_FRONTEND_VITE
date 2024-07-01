import styled from "styled-components";

interface Props {
  isHeader?: boolean;
  centerText?: boolean;
}

export const GridUploadFiles = styled.div<Props>`
  flex: 1;
  display: grid;
  width: 95%;
  padding: 0.2rem;
  background-color: ${(props) =>
    props.isHeader ? "var(--gray)" : "transparent"};
  margin: 0.5rem;
  grid-template-columns: 50% 20% 10% 10%;
  border: 2px solid var(--gray);
  text-align: ${(props) => (props.centerText ? "center" : "")};
  justify-content: space-evenly;
`;

export const GridRow = styled.div<Props>`
  display: flex;
  flex-direction: column;
  font-size: 0.675rem;
  text-align: ${(props) => (props.centerText ? "center" : "")};
  font-family: Montserrat;
  cursor: pointer;

  > svg {
    width: 1rem;
    height: 1rem;
    text-align: ${(props) => (props.centerText ? "center" : "")};
    color: var(--secondary);
    cursor: pointer;
    margin-left: 1.5rem;
  }

  > span {
    margin-left: 1rem;
  }

  &:hover {
    > svg {
      color: var(--orange);
    }
  }
`;
