import { RiCalendarCheckFill, RiEmotionHappyLine, RiEmotionUnhappyLine, RiTimer2Line } from "react-icons/ri"
import { ContentLegalResume } from "./styles"

type PropsPublicationIA = {
  publicationAI: any,
  handleDefinirDias: (publicationAI: any, legalResumeActionId: number) => void,
  handlePublicationIAModalEvent: (publicationAI: any, legalResumeActionId: string | number) => void,
  handleEvaluateIA: (legalResumeId: number, id: number, value: 'S' | 'N') => void,
  isRead: boolean
}

export default function ContentLegalResumeRender({
  publicationAI,
  handleDefinirDias,
  handlePublicationIAModalEvent,
  handleEvaluateIA,
  isRead
}: PropsPublicationIA) {

  return (
    <ContentLegalResume isRead={isRead}>
      <p className="title">Resumo:</p>
      <div className="resumo">{publicationAI.Resumo}</div>

      <p className="title">Partes:</p>
      <div className="partes">
        <div>
          <strong>Demandante:</strong> {publicationAI.Partes.Demandante}
        </div>
        <div>
          <strong>Demandado:</strong> {publicationAI.Partes.Demandado}
        </div>
      </div>

      <p className="title">Prazos e Audiências:</p>
      <div className="prazos">
        {(!publicationAI.Prazos?.length &&
          (!publicationAI.Audiencia ||
            publicationAI.Audiencia.Data === "" ||
            publicationAI.Audiencia.Tipo === "")) ? (
          <div>
            <span>Não foram identificados prazos nem audiências.</span>
          </div>
        ) : (
          <>
            {publicationAI.Prazos.map((item: any, index: number) => (
              <div key={index}>
                {item.LegalResumeActionId ? (
                  <>
                    {item.DefinirDiasManualmente ? (
                      <p
                        // onClick={() => handleDefinirDias(item)}
                        onClick={() => handleDefinirDias(publicationAI, item.LegalResumeActionId)}
                        title="Clique para definir manualmente os dias do prazo"
                      >
                        <RiTimer2Line />
                        <span>Agendar Prazo</span>
                      </p>
                    ) : 
                    (
                      <p
                        onClick={() => handlePublicationIAModalEvent(publicationAI, item.LegalResumeActionId)}
                        title="Clique para agendar um prazo automaticamente através da calculadora de prazos"
                      >
                        <RiCalendarCheckFill />
                        {`${item.TipoAcao} ${item.Prazo}`}
                      </p>
                    )}
                    <span>
                     {"- "} {item.Finalidade}
                    </span>
                  </>
                ) : (
                  <span></span>
                )}
              </div>
            ))}

            {publicationAI.Audiencia &&
              publicationAI.Audiencia.Data !== "" &&
              publicationAI.Audiencia.Tipo !== "" && (
                <div>
                  <p
                    onClick={() =>
                      handlePublicationIAModalEvent(
                        publicationAI,
                        publicationAI.Audiencia.LegalResumeActionId
                      )
                    }
                    title="Clique para agendar um prazo"
                  >
                    <RiCalendarCheckFill />
                    Audiência dia {publicationAI.Audiencia.Data} às {publicationAI.Audiencia.Hora}
                  </p>
                  <span> - {publicationAI.Audiencia.Tipo}</span>
                </div>
              )}
          </>
        )}

        <div className="emojiEvaluate">
          <RiEmotionHappyLine
            onClick={() => handleEvaluateIA(publicationAI.legalResumeId, publicationAI.Id, "S")}
            title="Gostei da análise"
            style={{
              color: publicationAI.AvaliacaoPositiva === "S" ? "#4DA3FF" : "#B0B0B0"
            }}
          />
          <RiEmotionUnhappyLine
            onClick={() => handleEvaluateIA(publicationAI.legalResumeId, publicationAI.Id, "N")}
            title="Não gostei da análise"
            style={{
              color: publicationAI.AvaliacaoPositiva === "N" ? "#FF6B6B" : "#B0B0B0"
            }}
          />
        </div>
      </div>
    </ContentLegalResume>
  )
}
