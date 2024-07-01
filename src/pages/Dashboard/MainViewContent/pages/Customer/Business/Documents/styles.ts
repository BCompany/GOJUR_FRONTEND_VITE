import styled from 'styled-components';

export const Container = styled.div `
  margin-top:0.5rem;
  font-size:0.8rem;
  font-weight:500;
  color:var(--blue-twitter);

  > svg{
    width:1rem;
    height:1rem;
    color:var(--blue-twitter);
  }

  .uploadButton {
    margin-top: -95px;
    margin-left: 12px;
    z-index: 0;
    cursor:pointer;

    &:hover {
      // filter: brightness(50%);
      color: var(--orange);
    }
  }  
  
  .messageEmpty{
    font-size:0.65rem;
    text-align:center;
    justify-content:center;
    padding-top:1rem;
    margin-left:25px;
    color:var(--blue-twitter);
    display:none; // mobile
    @media (min-width: 480px) {
      display:block;  // browser
    } 
  }

`

export const DocumentItem = styled.div`
  display: grid;
  width: 200%;
  margin-top:-60px;  
  cursor:pointer;
  color:var(--secondary);
  font-weight:300;
  font-family: montserrat, verdana, sans-serif;

  .grid-header {
	  grid-template-columns: 44% 26% 15% 15%;
    font-weight:500;
  }

  .grid-row {
	  grid-template-columns: 44% 26% 15% 15%;
    background-color: var(--white);
    margin: 0.15rem;
  }

  svg {
    position:absolute;
    width: 1rem;
    height: 1rem;
    cursor:pointer;
    color: var(--blue-twitter);
    margin-bottom:1rem;
  }  

`;

export const ButtonUpload = styled.div `
  position:absolute;
  margin:0.5rem;
`

export const DropArea = styled.div`
  display: flex;
  position:relative;
  justify-content: center;
  justify-items:center;
  width: 100%;   // mobile
  @media (min-width: 480px) {
    width: 200%; // browser
  }  
  margin:1%;
  height:4rem;
  border-radius:0.25px;
  border:0.5px solid rgba(255, 0, 0, 0.2);
  font-size:0.665rem;
  color:gray;
  padding-top:2.2rem;
  background-color:var(--gray);  

  svg {
    position:absolute;
    width: 1.3rem;
    height: 1.3rem;
    margin-top:-1.4rem;
    margin-bottom:1rem;
  }
`;
