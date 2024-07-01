import { useConfirmBox } from 'context/confirmBox';
import React, { useEffect, useState } from 'react';
import { BsCheckBox } from 'react-icons/bs';
import { TiCancel } from 'react-icons/ti';
import { CheckModal, Content } from './styles';

interface CheckConfig {
  message?: string;
  title?: string;
  checkMessage?: string;
  buttonOkText?: string;
  buttonCancelText?: string;
  caller?: string;
  useCheckBoxConfirm?: false|true;
  showButtonCancel?: false|true;
  showMainButtonCancel?: false|true;
  haveLink?: false|true;
}

const ConfirmBoxModal: React.FC<CheckConfig> = ({
  message = "Confirma esta operação ?",
  buttonOkText = "Confirmar",
  buttonCancelText = "Cancelar",
  title="AVISO",
  caller="",
  checkMessage="Estou ciente sobre a operação e desejo continuar",
  useCheckBoxConfirm  = false,
  showButtonCancel = false,
  showMainButtonCancel = true,
  haveLink = false
}) => {

  const {handleConfirmMessage, handleCancelMessage , handleCheckConfirm, isCheckConfirm, handleCaller} = useConfirmBox();
  const [confirmClick, setConfirmClick] = useState<boolean>(false)
  const [html , setHtml] = useState<string>('')

  useEffect(() => {
    if(haveLink){
      setHtml(message)
    }
    handleCaller(caller)
    handleCheckConfirm(!useCheckBoxConfirm)

  },[])

  function createMarkup() {
    return {__html: html};
  }

  const handleConfirm = () => {

    setConfirmClick(true)

    if (useCheckBoxConfirm && !isCheckConfirm) {
      return false;
    }

    handleConfirmMessage(true)
  }

  const handleCancelButton = () => {
    handleCancelMessage(true)
    handleCaller('hasCanceled')
  }

  return (

    <Content>

      <CheckModal>

        <header>{title}</header>

        {haveLink == false && (
          <div>
            <p>{message}</p>
          </div>
        )}
        
        {haveLink && (
          <div>
            <p><p dangerouslySetInnerHTML={createMarkup()} /></p>
          </div>
        )}

        {useCheckBoxConfirm && (
          <div>
            <p>
              <input type='checkbox' onChange={()=>handleCheckConfirm(!isCheckConfirm)} />
              {' '}
              <span className='checkMessage'>
                {checkMessage}
              </span>
            </p>
          </div>
        )}

        {useCheckBoxConfirm && confirmClick && (
          <div>
            <p>
              <span className='checkMessageWarnning'>
                Marque a confirmação da operação acima antes de prosseguir!
              </span>
            </p>
          </div>
        )}

        <footer>
          <button
            className="accept"
            type="button"
            onClick={handleConfirm}
          >
            <BsCheckBox />
            {buttonOkText}
          </button>

          {showMainButtonCancel && (
            <button
              className={(showButtonCancel?"accept":"cancel")}
              type="button"
              onClick={() => handleCancelMessage(true)}
            >
              {/* showButtonCancel is used to show a button cancel when we have two options of button, like | Excluir este | Excluir todos | Cancelar
              In this case the two first button uses a icon check save normal, and the last one is a cancel button */}
              {showButtonCancel &&  <TiCancel />}
              {!showButtonCancel &&  <BsCheckBox />}
              {buttonCancelText}
            </button>
          )}

          {showButtonCancel && (
            <button
              className="cancel"
              type="button"
              onClick={handleCancelButton}
            >
              <TiCancel />
              Cancelar
            </button>
          )}

        </footer>

      </CheckModal>

    </Content>
  )
}

export default ConfirmBoxModal;
