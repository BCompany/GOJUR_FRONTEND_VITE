import styled from 'styled-components';

interface SearchProps {
  show:boolean
}

export const Flags = styled.div`
  font-size: 0.675rem;
  width: 50px;;
`;

export const ModalAccount = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size:0.665rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:21rem;
  min-height:22rem;
  height:auto;
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

export const ItemList = styled.div`

  display:flex;
  flex-direction:column;
  
  >span {
    display:flex;
    margin:0.2rem 0.5rem;
  }

  p{
    margin-left:0.75rem;
  }
`;

export const ItemListMobile = styled.div`

  display:flex;
  flex-direction:column;
  
  >span {
    display:flex;
    margin:0.2rem 0.5rem;
    font-size:8px
  }

  p{
    margin-left:0.75rem;
  }
`;

export const ModalAccountMobile = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size:0.9rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:20rem;
  min-height:25rem;
  height:auto;
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
