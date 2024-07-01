import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  overflow: auto;
  width:70vw;
  margin-left:12vw;
  margin-top:5vh;
  display: flex;
  flex-direction: column;
  padding: 0.5rem 4rem;

  .buttonAdd {
    float:right;
    position:absolute;
    right:0;
    margin-right: 18vw;
  }
`;