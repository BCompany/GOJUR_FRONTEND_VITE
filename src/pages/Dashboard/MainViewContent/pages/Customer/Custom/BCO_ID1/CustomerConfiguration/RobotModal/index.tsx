/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
import React, { useCallback, useState, ChangeEvent } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { useToast } from 'context/toast';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { AiOutlineFileSearch } from 'react-icons/ai';
import api from 'services/api';
import { ModalCustomerRobot } from './styles';

const CustomerRobotModalEdit = (props) => {
  const { CloseRobotModal, companyId } = props.callbackFunction
  const { addToast } = useToast();
  const token = localStorage.getItem('@GoJur:token');
  const [isSaving, setisSaving] = useState<boolean>(); // set trigger for show loader

  const [matterNumber, setMatterNumber] = useState<string>("");
  const [robotTypeSearch, setRobotTypeSearch] = useState<string>("0")

  // OPEN LINK BIP BOP
  const OpenDocument = useCallback(async () => {
    try {

      if (matterNumber == "") {
        addToast({
          type: "info",
          title: "Falha na consulta.",
          description: 'Por Favor preencha o número do processo'
        })

        return
      }

      const response = await api.get('/CustomBCO_ID1/ConfiguracaoCliente/ConsultaPushBipBop', {
        params: {
          companyId,
          matterTypeSearch: robotTypeSearch,
          matterNumber,
          token,
        }
      })

      let URL = response.data;

      // Verify if link has token
      // When has token is considerer a link for LegalData, so we need to encode Token to validate on LegalData API
      const hasToken = URL.split('token')
      if (hasToken.length == 2) {
        // Encode token to link
        URL = `${hasToken[0]}token=${encodeURIComponent(hasToken[1])}`
      }

      window.open(`${URL}`, '_blank');

    } catch (err: any) {

      if (err.response.data.typeError.warning == "awareness") {
        addToast({
          type: "info",
          title: "Falha na consulta.",
          description: err.response.data.Message
        })
      }
      else {
        addToast({
          type: "error",
          title: "Falha na consulta.",
          description: err.response.data.Message
        })
      }
    }
  }, [robotTypeSearch, matterNumber]);


  return (
    <>

      <ModalCustomerRobot show>

        <div style={{ marginLeft: '15px', marginTop: '10px', marginRight: '10px' }}>
          Consulta de Job por Monitor

          <br />
          <br />

          <div>
            <label htmlFor="type">
              Tipo de Consulta
              <br />
              <select
                style={{ backgroundColor: "white" }}
                name="type"
                value={robotTypeSearch}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setRobotTypeSearch(e.target.value)}
              >
                <option value="0">Por importação</option>
                <option value="1">Por monitor</option>
              </select>
            </label>
          </div>

          <br />

          <label htmlFor="matterNumber">
            Número do Processo
            <br />
            <input
              type="text"
              style={{ backgroundColor: 'white' }}
              name="matterNumber"
              placeholder='Digite um n° de processo'
              value={matterNumber}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setMatterNumber(e.target.value)}
              autoComplete="off"
            />
          </label>

          <br />
          <br />
          <br />

          <div style={{ float: 'left', marginRight: '12px' }}>

            <div style={{ float: 'left' }}>
              <button
                className="buttonClick"
                type='button'
                onClick={() => OpenDocument()}
                style={{ width: '145x' }}
              >
                <AiOutlineFileSearch />
                Consultar Push
              </button>
            </div>


            <div style={{ float: 'left', width: '100px', marginLeft: "60px" }}>
              <button
                type='button'
                className="buttonClick"
                style={{ width: '145px' }}
                onClick={CloseRobotModal}
              >
                <FaRegTimesCircle />
                Fechar
              </button>
            </div>
          </div>

        </div>
      </ModalCustomerRobot>

      {isSaving && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp;
            Salvando ...
          </div>
        </>
      )}
    </>

  )


}
export default CustomerRobotModalEdit;
