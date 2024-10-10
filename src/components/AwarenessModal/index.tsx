import React, { useState, useEffect, useCallback } from 'react';
import { BsCheckBox } from 'react-icons/bs';
import { TiCancel } from 'react-icons/ti';
import { Content, Modal } from './styles';

export default function AwarenessModal (props) {
  const {awarenessModalTitle, awarenessModalMessage, awarenessButtonOkText, handleCloseAwarenessModal, handleConfirmAwarenessButton} = props.callbackFunction

  return (
    <Content>
      <Modal>

        <header>{awarenessModalTitle}</header>
       
          <div>
            <p>{awarenessModalMessage}</p>
          </div>
       
        <footer>
          <button
            className="accept"
            type="button"
            onClick={handleConfirmAwarenessButton}
          >
            <BsCheckBox />
            {awarenessButtonOkText}
          </button>

          <button
            className="cancel"
            type="button"
            onClick={handleCloseAwarenessModal}
          >
            <TiCancel />
            Cancelar
          </button>

        </footer>

        </Modal>
    </Content>
  )
}