import styled from 'styled-components';

interface propsMove{
  isDraggable: boolean;
}

export const Container = styled.div`
  flex: 1;
  overflow: auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 1rem;

  @media (max-width: 420px) {
    display: none;
  }
`;

export const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  overflow: auto;
  margin-top: 16px;
  position: relative;
  
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 0.5rem;
    border-radius: 0.5rem;
    background: var(--orange);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
  }

  > h1 {
    background-color: #000;
    color: #fff;
  }
`;

export const Content = styled.div<propsMove>`
  overflow: hidden;
  transition: 500ms;
  /* cursor:move; */
  cursor: ${props => (props.isDraggable ? 'move' : 'default')}; 
  //cursor:$props
  border-radius: 6px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.45);

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 0.5rem;
    border-radius: 0.5rem;
    background: var(--orange);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
  }
`;


export const OverlayDashboard = styled.div `
    background-color: rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;

    /* text inside overlay */
    >div{
      background: var(--white-card);
      height:3rem;
      color:var(--blue-twitter);
      font-size:0.765rem;
      text-align:center;
      padding:1rem;
      margin-left:30vw;
      margin-right:25vw;
      margin-top:20%;
      border-radius: 0.25rem;
      box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
    }
`;

