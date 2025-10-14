import { FiSave } from "react-icons/fi"
import { FaRegTimesCircle } from "react-icons/fa"
import { ModalDiasPrazo } from "./styles"
import { Overlay } from "Shared/styles/GlobalStyle"
import { FcAbout } from "react-icons/fc"

type Props = {
  daysDeadline: number | string,
  currentDeadlineIA: any,
  handleDeadlineDays: (val: string) => void,
  handleSaveDays: () => void,
  handleCloseDaysModal: () => void
}

export default function ContentLegalResumeDaysModal({
  daysDeadline,
  handleDeadlineDays,
  handleSaveDays,
  handleCloseDaysModal
}: Props) {
  return (
    <>
      <ModalDiasPrazo>

        <div className="modal-title">
          Definição de Prazo
          <FcAbout title="Não foi possivel identificar os dias do prazo na análise da notificação, informe abaixo para prosseguir." style={{ cursor: 'pointer' }} />
        </div>
        

        <div style={{ marginLeft: "15px", marginTop: "10px", marginRight: "10px" }}>
          <label htmlFor="dias" style={{ fontSize: "12px" }}>
            Informe a quantidade de dias para calcular o prazo:
            <input
              required
              type="number"
              min="1"
              step="1"
              name="dias"
              value={daysDeadline}
              onChange={(e) => handleDeadlineDays(e.target.value)}
              autoComplete="off"
              style={{ backgroundColor: "white", marginTop:"10px" }}
            />
          </label>

          <br />
          <br />

          <div style={{ float: "right", marginRight: "12px" }}>
            <div style={{ float: "left" }}>
              <button
                className="buttonClick"
                type="button"
                onClick={handleSaveDays}
                style={{ width: "100px" }}
              >
                <FiSave />
                Salvar
              </button>
            </div>

            <div style={{ float: "left", width: "100px" }}>
              <button
                type="button"
                className="buttonClick"
                onClick={handleCloseDaysModal}
              >
                <FaRegTimesCircle />
                Fechar
              </button>
            </div>
          </div>
        </div>
      </ModalDiasPrazo>

      <Overlay />
    </>
  )
}
