import styled from 'styled-components';

interface SearchProps {
  show:boolean
}
export const Flags = styled.div`
  font-size: 0.675rem;
  width: 50px;;
`;

export const ModalCategory = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size:0.665rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:20rem;
  height:14.5rem;
  background-color:var(--white);
  position:absolute;
  z-index:99999;
  justify-content:center;
  margin-left:35%;
  margin-top:5%;
  display: ${props => (props.show ? 'block' : 'none')};

  input, select {
      flex: 1;
      font-size: 0.675rem;
      padding: 0.25rem;
      background-color: rgba(255,255,255,0.25);
      width: 99%;
      border-bottom: 1px solid rgba(0,0,0,0.15);
      color: var(--secondary);

      &:focus {
        border-bottom: 1px solid var(--orange);
      }
    }
`;

export const ModalCategoryMobile = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size:0.9rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:20rem;
  height:19.5rem;
  background-color:var(--white);
  position:absolute;
  z-index:99999;
  justify-content:center;
  margin-left:10%;
  margin-top:20%;
  display: ${props => (props.show ? 'block' : 'none')};

  input, select {
      flex: 1;
      font-size: 0.675rem;
      padding: 0.25rem;
      background-color: rgba(255,255,255,0.25);
      width: 99%;
      border-bottom: 1px solid rgba(0,0,0,0.15);
      color: var(--secondary);

      &:focus {
        border-bottom: 1px solid var(--orange);
      }
    }
`;


export const Container = styled.div`
  font-size:0.765rem;    
  flex-direction: column;
  font-family: Montserrat;
  height: 550px;
  max-height: 650px;

  header {
    color: var(--blue-twitter);        
    text-align: center;
    margin-bottom:1rem;
    margin-top: -40px;
        
    h1 { 
      font-size:0.9rem; 
      font-weight:300;
      margin-bottom:0.5rem;
      border-bottom:1px solid var(--gray);
    }
  }

  footer {
    margin-top:1rem;
    margin-bottom:1rem;
    justify-content:center;
    text-align:center;

    >div {
      margin-top:1rem;
      color: var(--blue-twitter);
      font-size:0.65rem;
      text-align:center;
      display:flex;
      font-weight:500;
      flex-direction:column;
    }
  }

  .buttonAddNew {
    font-size:0.65rem;
    margin-top:0.1rem;
    cursor:pointer;    
    margin-left:38%;    
  }

  .messageEmpty{
    font-size:0.65rem;
    color:var(--red);
    text-align:center;
    margin-left:100px;
  }

  > div {
    display:flex;
    z-index:1;
    flex-direction:row;
    justify-content:space-between;
    margin-bottom:0.5rem;

    >svg {
      color: var(--blue-twitter);
      margin-top:10px;
      margin-right:10px;
      cursor:pointer;   
      width:1rem;
      height:1rem;         
      &:hover{
        color:var(--orange);
      }
    }

    select, input {
      border:1px solid var(--gray);
      background-color: rgba(255,255,255,0.25);
      border-bottom: 1px solid rgba(0,0,0,0.15);
      color: var(--secondary); 
      margin-right:0.3rem;
      padding:0.2rem;
      font-size:0.75rem;
    }

    .numOAB {
      width:100px
    }

    .nomAdvogado {
      width:280px
    }

    .loading{
      position: absolute;
      float: right;
      right: 0;
      margin-right: 30px;
      margin-top: 10px;
    }
        
    >div{
      flex:1;
      margin-right:0.3rem;
    }        
  }
`;

export const OverlaySave = styled.div `
    background-color: rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index:99999;

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

