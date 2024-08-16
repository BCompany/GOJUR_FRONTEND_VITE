import styled from 'styled-components';

interface SearchProps {
  show: boolean;
}

export const FModal = styled.div<SearchProps>`
  font-size: 0.665rem;
  border-radius: 10px;
  box-shadow: 1px 1px 4px 0.5px rgba(0, 0, 0, 0.15);
  width: 42rem;
  min-height: 10rem; /* Reduced height */
  max-height: 30rem; /* Reduced height */
  background-color: var(--white);
  position: absolute;
  z-index: 999;
  justify-content: center;
  display: ${props => (props.show ? 'block' : 'none')};
  overflow: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .header {
    background-color: rgba(0, 0, 0, 0.1);
  }

  h5 {
        font-size:0.6rem; 
        font-weight:300;
        color: var(--blue-twitter);        
        text-align: center;
        margin-bottom:0.5rem;
        margin-top:1rem;
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
    border-top: 1px solid var(--blue-twitter);
    width: 100%;
  }
`;

export const Overlay = styled.div`
  background-color: rgba(0, 0, 0, 0.4);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999999999;

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