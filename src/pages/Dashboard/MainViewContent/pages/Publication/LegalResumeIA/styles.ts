import styled from 'styled-components';
interface PublicationProps {
  isRead: boolean;
}

export const ContentLegalResume =  styled.div<PublicationProps>`
  border: 0.5px solid #E0E0E0;
  border-radius: 8px;
  padding: 0.5rem;
  flex-direction: column;
  margin-top: 1rem;
  background-color: #fff;
  color: #333;
  opacity: ${props => (props.isRead ? 0.5 : 1)};

  .title {
    font-size: 0.775rem;
    font-weight: 600;
    margin: 0rem 0 0.5rem;
    color: #444;
    margin-top: 0.5rem;
  }

  .resumo {
    font-size: 0.775rem;
    line-height: 1.5;
    color: #555;
  }

  .partes {
    font-size: 0.775rem;
    color: #444;

    > div {
      margin: 0.205rem 0;
    }

    strong {
      font-weight: 600;
      margin-right: 0.25rem;
      margin-left: 0.5rem;
    }
  }

  .prazos {
    display: flex;    
    flex-direction: column;
    gap: 0.4rem;
    font-size: 0.775rem;
    color: #444;
    margin-top: 0.5rem;

    
    > div {
      display: flex;

      > p {
        > svg {
            margin-right: 0.25rem;
            width: 0.765rem;
            height: 0.765rem;;
            color: var(--blue);
            cursor: pointer;
          }
          font-weight: 600;
          color: var(--blue);
          text-decoration: none;
          transition: color 0.2s ease;
          cursor: pointer;
          margin-right: 0.15rem;
          min-width: 100px;
          

          &:hover {
            color: #0d47a1;
            text-decoration: underline;
          }
      }
    }

    .emojiEvaluate {
        display: flex;
        justify-content: flex-end; 
        gap: 8px;
        align-items: center;

         > svg {
          width: 1.5rem;
          height: 1.5rem;
          cursor: pointer;
          &:hover {
            color: var(--orange);
            transform: scale(1.1);
          }          
        }
      }

    }

  }
`;

export const ModalDiasPrazo = styled.div`
  border: 1px solid var(--blue-twitter);
  font-size: 0.665rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width: 20rem;
  height: 10rem;
  background-color: var(--white);
  position: absolute;
  z-index: 99999;
  justify-content: center;
  margin-left: 35%;
  margin-top: 5%;
  display: flex;
  flex-direction: column;

  .modal-title {
    text-align: center;
    font-size: 0.750rem;
    margin: 0.5rem 0 1rem 0;
    color: var(--secondary);

    >svg
    {
      margin-left:10px;
    }
  }

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
