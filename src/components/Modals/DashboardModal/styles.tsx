import styled from 'styled-components';

interface SearchProps {
  show: boolean;
}

export const ChangeVisibilityModal = styled.div<SearchProps>`
  width: '50%'; 
  height: '70%'; 
  font-size: 0.665rem;
  border-radius: 10px;
  box-shadow: 1px 1px 4px 0.5px rgba(0, 0, 0, 0.15);
  background-color: var(--white);
  position: fixed; /* Alterado de absolute para fixed */
  justify-content: center;
  display: ${props => (props.show ? 'block' : 'none')};
  overflow: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  flex-direction: 'column'; 
  border: '1px solid var(--blue-twitter)'; 
  z-index: 99999;

  .header {
    background-color: rgba(0, 0, 0, 0.1);
    flex: '0 0 auto'; 
    padding: '2px 5px';

    > p {
    font-weight: 500;
    }
  }

  .headerLabel {
    text-align: center;
    font-size: 15px;
    font-family: montserrat;
    font-weight: normal;
    padding: 3px;
  }

  .mainDiv {
    margin-left: 10px;
    margin-top: 10px;
    margin-right: 10px;
    height: 84%;
    overflow: auto;
    @media screen and (max-width: 1280px) and (max-height: 768px) {
      height: 84%;
    }
    @media screen and (max-width: 1280px) and (max-height: 600px) {
      height: 80%;
    }
  }

  .footer {
    float: right;
    border-top: solid var(--blue-twitter);
    padding: 10px;
  }

  .refresh {
    color: #72a6ef;

    
    cursor:pointer;
    &:hover {
      color: var(--orange)
    }
  }
`;

export const GridSubContainer = styled.div`
  width: 100%;
  font-family: Montserrat;
  margin-top: 5px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 13px;
  flex: '1 1 auto'; 
  overflow-y: 'auto'; 

  big {
    font-size: 0.675rem;
    color: var(--blue-twitter);
  }

  span {
    font-size: 0.65rem;
    color: var(--blue-twitter);
  }

  text-decoration {
    font-size: 0.70rem;
    color: var(--blue-twitter);
  }

  table tr td {
    white-space: inherit;
    font-size: 0.70rem;
  }

  svg {
    width: 1.2rem;
    height: 1.2rem;
    color: var(--blue-light);
    cursor: pointer;

    &:hover {
      color: var(--orange);
    }
  }
  & tbody tr:nth-of-type(odd) {
    background-color: #d9ecec;
  }
`;

export const Overlay = styled.div`
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed; /* Alterado de absolute para fixed */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99; /* Diminuído o valor do z-index */

  /* text inside overlay */
  > div {
    background: var(--white-card);
    height: 3rem;
    color: var(--blue-twitter);
    font-size: 0.765rem;
    text-align: center;
    padding: 1rem;
    margin-left: 30vw;
    margin-right: 25vw;
    margin-top: 20%;
    border-radius: 0.25rem;
    box-shadow: 1px 1px 4px 0.5px rgba(0, 0, 0, 0.15);
  }
`;

export const Overlay2 = styled.div`
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed; /* Alterado de absolute para fixed */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999; /* Diminuído o valor do z-index */
  display: flex;
  justify-content: center;
  align-items: center;

  /* text inside overlay */
  > div {
    background: var(--white-card);
    height: 3rem;
    color: var(--blue-twitter);
    font-size: 0.765rem;
    text-align: center;
    padding: 1rem;
    border-radius: 0.25rem;
    box-shadow: 1px 1px 4px 0.5px rgba(0, 0, 0, 0.15);
  }
`;