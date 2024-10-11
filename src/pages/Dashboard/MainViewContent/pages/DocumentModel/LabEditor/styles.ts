import styled from 'styled-components';

interface SearchProps {
  show:boolean
}

export const Container = styled.div`
  flex: 1;
  width: 95vw;
  height:100vh;
  display: flex;
  flex-direction: column;   
`;


export const Elements = styled.div`
  padding: 0.5rem 2rem;
  margin: 0.5rem 1rem;
  background-color: rgba(255,255,255, 0.3);
  border-radius: 0.25rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  font-size:0.675rem;
  
  .App {
    font-family: sans-serif;
    text-align: center;
  } 

  span {
    font-size:0.675rem;

    >span{
      margin-left:5px;
    }
  }

  input, select {
    flex: 1;
    font-size: 0.675rem;
    padding: 0.25rem;
    background-color: rgba(255,255,255,0.25);
    width: 90%;
    border-bottom: 1px solid rgba(0,0,0,0.15);
    color: var(--secondary);

    &:focus {
      border-bottom: 1px solid var(--orange);
    }
  }
`;


export const Content = styled.div`
  flex: 1;
  padding: 0.5rem 2rem;
  margin: 0.5rem 1rem;
  background-color: rgba(255,255,255, 0.3);
  border-radius: 0.25rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  font-size:0.675rem;
  overflow: auto;
  margin-top: -8px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  max-height: 100%;

  .App {
    font-family: sans-serif;
    text-align: center;
    width: 837px;
  } 

  span {
    font-size:0.675rem;

    >span{
      margin-left:5px;
    }
  }

  input, select {
    flex: 1;
    font-size: 0.675rem;
    padding: 0.25rem;
    background-color: rgba(255,255,255,0.25);
    width: 90%;
    border-bottom: 1px solid rgba(0,0,0,0.15);
    color: var(--secondary);

    &:focus {
      border-bottom: 1px solid var(--orange);
    }
  }
`;


export const Editor = styled.div`
  flex: 1;
  overflow: auto;
  min-height: 200px;
  height: auto;
  width: 100%;

  .ck.ck-editor {
    width: 95%;
    border: solid 1px;
  }

  .ck-editor__editable {
    max-height: 400px;
}

  .ck-editor__editable:not(.ck-editor__nested-editable) { 
    min-height: 1100px;
    max-height: 1100px;
    border: solid 1px gray;
    background-color: white;
  }

  .ck-rounded-corners .ck.ck-editor__main>.ck-editor__editable, .ck.ck-editor__main>.ck-editor__editable.ck-rounded-corners {
    ol, ul {
      margin-left: 18px;
    }
  }
  .ck.ck-editor__main>.ck-editor__editable:not(.ck-focused){
    ol, ul {
      margin-left: 18px;
    }
  }
  .ck-source-editing-area{ 
    margin-left: -800px;
    max-height: 800px;
    overflow: auto;
  }

`;


export const ModalInformation = styled.div`
  border: 1px solid var(--blue-twitter);
  font-size:0.7rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:30rem;
  height:10rem;
  background-color:var(--white);
  position:absolute;
  z-index:99999;
  justify-content:center;
  margin-left:20%;
  margin-top:5%;
  

  .menuSection {
    font-size:0.65rem;
    padding: 0.25rem 0.5rem;
    color:var(--blue-twitter);
    text-align:right;
    cursor:pointer;

    > svg {
      width:0.85rem;
      height:0.85rem; 
    }

    &:hover {
      color: var(--orange);
    }
  }

`;
