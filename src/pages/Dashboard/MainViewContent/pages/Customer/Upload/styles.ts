import styled from 'styled-components';

export const DropArea = styled.div`

  display: flex;
  position:relative;
  justify-content: center;
  justify-items:center;
  width: 95%;
  margin:1%;
  height:6rem;
  border-radius:0.25px;
  border:0.5px solid rgba(255, 0, 0, 0.2);
  font-size:0.765rem;
  color:gray;
  padding-top:3rem;
  background-color:var(--gray);

  svg {
    position:absolute;
    width: 1.3rem;
    height: 1.3rem;
    margin-top:-1.4rem;
    margin-bottom:1rem;
  }
`;

export const LoaderContainer = styled.div`
  display:flex;
  justify-content:center;
  width:100%;
  margin-top:-1rem;
`;

export const TaskBar = styled.div `
  position: relative;
  float:right;
  margin-top:10px;
  margin-bottom:40px;
  margin-right:2.5vw;
`;

export const TotalRegisters = styled.div`
  /* margin-left:9.5rem; */
  margin-left:1rem;
  /* margin-top:-1rem; */
  font-size:0.675rem;
  color:var(--secondary);
  font-family:montserrat;
`;