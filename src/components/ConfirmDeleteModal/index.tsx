import React, { useState, useEffect, useCallback } from 'react';
import { BsCheckBox } from 'react-icons/bs';
import { TiCancel } from 'react-icons/ti';
import { Container, ContainerDetails } from './styles';

export default function ConfirmDeleteModal (props) {
  const {handleCloseConfirmDelete, handleConfirmDelete} = props.callbackFunction
  const token = localStorage.getItem('@GoJur:token')


  const handleConfirm = () => {
    handleConfirmDelete()
  }


  return (
    <Container>
      <ContainerDetails>
        <header>
          <h1>Apagar Compromisso</h1>
        </header>

        <div>
          <p>Deseja realmente apagar este compromisso ?</p>
        </div>

        <footer>
          <button className="accept" type="button" onClick={handleConfirm}>
            <BsCheckBox />
            Confirmar
          </button>

          <button className="cancel" type="button" onClick={handleCloseConfirmDelete}>
            <TiCancel />
            Cancelar
          </button>
        </footer>
      </ContainerDetails>
    </Container>
  )
}