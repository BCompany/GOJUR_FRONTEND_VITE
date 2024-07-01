import styled from 'styled-components';

interface SearchProps {
  show:boolean
}


export const Modal = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size: 0.665rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width: 80%;
  height: 620px;
  background-color:var(--white);
  position: fixed;
  justify-content: center;
  left: 13%;
  top: 0.5rem;

  display: ${props => (props.show ? 'block' : 'none')};
  z-index: 3;

  input, select {
    flex: 1;
    font-size: 0.675rem;
    padding: 0.25rem;
    background-color: #FFFFFF;
    width: 99%;
    border-bottom: 1px solid rgba(0,0,0,0.15);
    color: var(--secondary);

    &:focus {
    border-bottom: 1px solid var(--orange);
    }
  }

  textarea {
    border: 1px solid #B3B3B3;
    width: 100%;
    min-height: 3rem;
    height: auto;
    padding: 0.5rem;
    background-color: #FFFFFF;
    color: var(--secondary);
    font-size: 0.65rem;
    border-radius: 0.25rem;
  }

  .menuTitle {
    font-size:0.65rem;
    padding: 0.25rem 0.5rem;
    color:black;
    text-align:center;
    float: left;
    width:96%;
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
    width:4%;
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


export const Container = styled.div`
  flex: 1;
  height: 630px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color:var(--gray);
`;


export const Content = styled.div`
  width: 100%;
  height: 100%;
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
`;


export const Center = styled.div`
  width: 96%;
  padding: 0.5rem 2rem;
  margin: 0.5rem 1rem;
  border-radius: 0.25rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  margin-top: -5px;
  height: auto;
  overflow: auto;

  select {
    /* flex: 1; */
    font-size: 0.675rem;
    padding: 0.25rem;
    background-color: #F9F9F9;
    width: 99%;
    border-bottom: 1px solid rgba(0,0,0,0.15);
    color: var(--secondary);
    margin-top: 5px;
    width: 300px;
    height: 30px;

    &:focus {
    border-bottom: 1px solid var(--orange);
    }
  }

  input {
    /* flex: 1; */
    font-size: 0.675rem;
    padding: 0.25rem;
    background-color: #F9F9F9;
    width: 99%;
    border-bottom: 1px solid rgba(0,0,0,0.15);
    color: var(--secondary);
    margin-top: 5px;
    width: 250px;

    &:focus {
    border-bottom: 1px solid var(--orange);
    }
  }

  .items{
    width:100%;
    display:flex;
    flex-Direction:row;
    justify-Content:center;
    align-Items:center;
    font-Size:14px;
  }

  .itemsInput{
    margin-left: 30%;
    width:40%;
    display:flex;
    flex-Direction:row;
    justify-Content:center;
    align-Items:center;
    font-Size:14px;
  }

  .itemsCheck{
    width:70%;
    display:flex;
    flex-Direction:row;
    justify-Content:center;
    align-Items:center;
    font-Size:14px;
  }

  .itemsSelect{
    font-size: 0.675rem;
    padding: 0.25rem;
    background-color: #F9F9F9;
    width: 99%;
    border-bottom: 1px solid rgba(0,0,0,0.15);
    color: var(--secondary);
    margin-top: 5px;
    width: 110px;
    height: 30px;

    &:focus {
    border-bottom: 1px solid var(--orange);
    }
  }

  .itemsButton{
    display: flex;
    flex-Direction: row;
    justify-Content: center;
    align-Items: center;
    font-Size: 12px;
    text-align: center;
    padding: 10px 20px 10px 20px;
    color: #000000;
    background: #FFFFFF;
    border: 0px;
    border-Radius: 50px 50px 50px 50px;
    text-Decoration: none;
    cursor: pointer;
  }

`;


export const ModalAlert = styled.div`
  border: 1px solid var(--blue-twitter);
  font-size: 0.7rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width: 570px;
  min-height: 13rem;
  max-height: 13rem;
  overflow: auto;
  background-color: var(--white);
  position: absolute;
  z-index: 99999;
  justify-content: center;
  margin-top: 10%;

  input, select {
    flex: 1;
    font-size: 0.675rem;
    padding: 0.25rem;
    background-color: #FFFFFF;
    width: 99%;
    border-bottom: 1px solid rgba(0,0,0,0.15);
    color: var(--secondary);

    &:focus {
    border-bottom: 1px solid var(--orange);
    }
  }

  .menuTitle {
    font-size: 0.65rem;
    padding: 0.25rem 0.5rem;
    color: black;
    text-align: center;
    float: left;
    width: 93%;
    background-color: #dcdcdc;
    height: 27px;
  }

  .menuSection {
    font-size: 0.65rem;
    padding: 0.25rem 0.5rem;
    color: var(--blue-twitter);
    text-align: right;
    cursor: pointer;
    float: left;
    width: 6.9%;
    background-color: #dcdcdc;
    height: 27px;

    > svg {
      width: 0.85rem;
      height: 0.85rem;
      stroke-width: 3px;
    }

    &:hover {
      color: var(--orange);
    }
  }
`;
