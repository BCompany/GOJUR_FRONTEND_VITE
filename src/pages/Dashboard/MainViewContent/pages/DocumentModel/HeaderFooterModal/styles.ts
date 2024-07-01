import styled from 'styled-components';

interface SearchProps {
  show:boolean
}

export const ModalHeaderFooter = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size:0.665rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:1060px;
  min-height: 220px;
  height:auto;
  max-height: 85%;
  background-color:var(--white);
  position:absolute;
  z-index:2;
  justify-content:center;
  margin-left:10%;
  margin-top:5%;
  overflow: auto;
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

  .HeaderArea{
    margin-Left:1.5%;
    border-Radius:10px;
    background-Color:#E7E7E7;
    width: 1010px;
    height:250px;
  }

  .FooterArea{
    margin-Left:1.5%;
    border-Radius:10px;
    width: 1010px;
    background-Color:#E7E7E7;
    height:250px;
  }

  .headerFooter {
    font-size:0.65rem;
    padding: 0.25rem 0.5rem;
    color:black;
    text-align:center;
    float: left;
    width:100%;
    height: 27px;
    font-weight: 600;
  }

  .createChangeButtons {
    width:100%;
    height:50px;
    text-Align:center;
  }

  .menuTitle {
    font-size:0.65rem;
    padding: 0.25rem 0.5rem;
    color:black;
    text-align:center;
    float: left;
    width:97%;
    background-color: #dcdcdc;
    height: 27px;
  }

  .menuSection {
    font-size:0.65rem;
    padding: 0.25rem 0.5rem;
    color:var(--blue-twitter);
    text-align:right;
    cursor:pointer;
    float: left;
    width:3%;
    background-color: #dcdcdc;
    height: 27px;

    > svg {
      width:0.85rem;
      height:0.85rem;
      stroke-width: 3px;
    }

    &:hover {
      color: var(--orange);
    }
  }
`;

export const Editor = styled.div`
  flex: 1;
  overflow: auto;
  height: auto;
  margin-left: 5%;
  width: 90%;

  .ck.ck-editor {
    width: 100%;
    border: solid 1px;
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

  .ck-editor__editable:not(.ck-editor__nested-editable) { 
    min-height: 150px;
    max-height: 150px;
    border: solid 1px gray;
    background-color: white;
  }

  /* Used to force the browser to always pull down the dropDownList with the font size selector */
  .ck.ck-dropdown .ck-dropdown__panel.ck-dropdown__panel_n, .ck.ck-dropdown .ck-dropdown__panel.ck-dropdown__panel_ne, .ck.ck-dropdown .ck-dropdown__panel.ck-dropdown__panel_nme, .ck.ck-dropdown .ck-dropdown__panel.ck-dropdown__panel_nmw, .ck.ck-dropdown .ck-dropdown__panel.ck-dropdown__panel_nw{
    top: 100%;
  }

`;

export const ModalInformation = styled.div`
  border: 1px solid var(--blue-twitter);
  font-size:0.7rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:25rem;
  height:10rem;
  background-color:var(--white);
  position:absolute;
  z-index:4;
  justify-content:center;
  margin-left:25%;
  margin-top:10%;
  
  .menuHeader {
    background-Color:#dcdcdc;
    width:'100%';
    height:'27px'
  }

  .menuTitle {
    font-size:0.65rem;
    padding: 0.25rem 0.5rem;
    color:black;
    text-align:center;
    float: left;
    width:93%;
    background-Color:#dcdcdc;
  }

  .menuSection {
    font-size:0.65rem;
    padding: 0.25rem 0.5rem;
    color:var(--blue-twitter);
    text-align:center;
    cursor:pointer;
    float: right;
    width:7%;
    background-Color: #dcdcdc;
    height: 27px;

    > svg {
      width:0.85rem;
      height:0.85rem;
      stroke-width: 3px;
    }

    &:hover {
      color: var(--orange);
    }
  }

`;

export const OverlayDocument = styled.div `
    background-color: rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index:3;

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


// export const OverlayHeader = styled.div `
//     background-color: rgba(0, 0, 0, 0.4);
//     position: absolute;
//     z-index:3;

//     /* text inside overlay */
//     >div{
//       background: var(--white-card);
//       height:3rem;
//       color:var(--blue-twitter);
//       font-size:0.765rem;
//       text-align:center;
//       padding:1rem;
//       margin-left:30vw;
//       margin-right:25vw;
//       margin-top:20%;
//       border-radius: 0.25rem;
//       box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
//     }
// `;


export const OverlayHeader = styled.div `
    margin-Left:1.5%;
    border-Radius:10px;
    width: 1010px;
    background-Color:#FFFFFF;
    opacity: 0.5;
    height:250px;
    z-index:4;
`;

export const OverlayFooter = styled.div `
    margin-Left:1.5%;
    width: 1010px;
    border-Radius:10px;
    background-Color:#FFFFFF;
    opacity: 0.5;
    height:250px;
    z-index:4;
`;

