import styled from 'styled-components';

interface propsMove{
  isDraggable: boolean;
}

export const Container = styled.div`
  flex: 1;
  height: 100vh;  
  display: flex;
  flex-direction: column;
  padding-bottom: 1rem;
  overflow: auto;

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

export const TaskBar = styled.div`

    display: flex;
    position:relative;
    justify-content: space-between;
    padding-bottom:0.4rem;
    margin: 0.5rem 1rem;
    background-color: var(--white);
    border-radius: 0.25rem;
    box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15); 

    .buttonsHeader{
      position: absolute;
      float: right;
      right: 0px;
      margin-right: 43px;
      margin-top: 21px;
    }

  >div{

    display: flex;   
    margin-left:1rem;
    margin-right:2rem;
    font-size: 0.675rem;
    width:35rem;

    > label {
      padding-top:20px;
      margin-right:1rem;    
    }

    .select{
      margin-top: 10px;
      margin-right: 10px;
      margin-left: -12px;
      width: 10rem;
    }

    >svg{
      width: 1.2rem;
      height: 1.2rem;
      margin-top:0.9rem;
      cursor:pointer;
    }
  } 
`;

export const Content = styled.div<propsMove>`
  overflow: hidden;
  display:flex;
  padding: 0.5rem 1rem;
  transition: 500ms;
  cursor: ${props => (props.isDraggable ? 'move' : 'default')}; 
`;


export const ChartContainer = styled.div`
  width: 100%;
  height: 100%;  
  /* overflow:auto; */
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  justify-content: space-between;
  padding:0.5rem;
  margin:0.5rem;    
  box-shadow: 2px 2px 2px 2px rgba(0,0,0,0.4);
  border-radius:0.25rem; 
  padding-bottom:2.5rem;
  background-color: var(--white-card); 

  
  .chartToolBar{
    font-size:0.65rem;
    text-align:center;
    font-weight:100;
    position:absolute;
    margin-top:-15px;
    right:45px;
    color:var(--blue-light);
  }

    >div{
      flex:1;
      font-size:0.755rem;
      color: var(--blue-twitter);
      font-weight:500;
      text-align:center;
      margin-bottom:1rem;

      >svg{
        width:0.9rem;
        height:0.9rem;
        cursor:pointer;
      }
    }    

    >p{
      flex:1;
      font-size:0.65rem;
      color: '#7d7d7d',
      font-weight:500;
      text-align:center;
      margin-bottom:1rem;
      padding:0.4rem;
    }
`;