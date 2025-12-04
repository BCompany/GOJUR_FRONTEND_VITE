import styled from 'styled-components'

export const Container = styled.div`
  font-family: montserrat, verdana;
  overflow:auto;
  height:100vh;
  width:90vw;   /*  default adjust for mobile  */
  margin:0.1rem;

  @media (min-width: 480px) {
    padding: 0.1rem 5rem;
    width:100%;
  }

  /* default size when heigth is small to much */
  @media (max-width: 1024px) {
    width:1000px;
  }

  margin-bottom:10rem;
`;

export const TollBar = styled.div `
  display:flex;
  max-height:1.5rem;
  font-size:0.65rem;
  justify-content:space-between;

  .buttonReturn {
    display:flex;
    flex:1;
    justify-content:start;
  }

  .hamburguerMenu {
    flex:1;
    display:flex;
    justify-content:end;
  }

  #options {
     svg {
       color: var(--blue);
       width: 1.5rem;
       height: 1.5rem;
     }

     &:hover {
       svg { color: var(--orange); }
    }
  }
`;

export const Content = styled.div `
    flex: 1;
    flex-direction: column;
    background-color: var(--white);
    border-radius: 0.25rem;
    margin-left:1%;
    @media (min-width: 480px) {
      width: 100%;
      margin-left:0%;
    }
    box-shadow: 1px 1px 5px 5px rgba(0,0,0,0.15);
    margin-top:0.5rem;
    overflow:auto;
    padding-bottom:2rem;

    .title {
      background: rgba(0,0,0,0.1);
      font-weight: 600;
      margin: -4px;
      margin: 0.2rem 0;

      > span {
        float: right;
        margin-right: 5px;
        font-size: 0.765rem;
        margin-top: 10px;
        color: var(--blue-twitter);
        svg{
          cursor:pointer;
          &:hover {
            color: var(--orange);
          }
        }
      }
    }

    .first {
      margin-top: -4px;
    }


    .title.first {
  border-right: none !important;
}

.title.first button {
  border-right: none !important;
}

.title.first::after,
.title.first::before {
  display: none !important;
}


`

export const TabContent = styled.div `
    font-size: 0.75rem;
    margin: 0.3rem 0.5rem;
    padding: 0.2rem;
`
