/* eslint-disable jsx-a11y/control-has-associated-label */
import { useModal } from 'context/modal';
import React, { useEffect, useState } from 'react';
import Loader from 'react-spinners/ClipLoader';
import { FiX } from 'react-icons/fi';
import Modal from 'react-modal';
import { useLocation } from 'react-router-dom';
import api from 'services/api';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { Container } from './styles';

interface DefaultsProps {
  id: string;
  value: string;
}

export default function VideoTrainningModal() {

  const { handleShowVideoTrainning, showVideoTrainning } = useModal();
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [videoSrc, setVideoSrc] = useState('')
  const [videoTitle, setVideoTitle] = useState('')

  useEffect(() => {

    ConfigureVideo();

  },[])

  const handleCloseModal = async () => {

    setIsLoading(true)
    const tokenApi = localStorage.getItem('@GoJur:token')
    const moduleName = pathname.replace('/', '')
    const response = await api.post<DefaultsProps[]>('/Defaults/Listar', { token: tokenApi,     });

    // verify if user need to see a video trainning at the first time access
    const userConfiguration = response.data.find(item => item.id === 'defaultUserLogFirstAccess')

    if (userConfiguration) {
      // verify if default value config for this used inform that video is already watched
      const videoAlreadyWatched = (userConfiguration.value??"").includes(moduleName);

      // if is the first time,  call endpoint to save log marking video as read
      if (!videoAlreadyWatched){
        await api.post('/Usuario/MarcarVideoComoVisto', {
          token: tokenApi,
          module: moduleName
        })      }


    }else{
      handleShowVideoTrainning(false)
    }

    handleShowVideoTrainning(false)
    setIsLoading(false)
  }

  
  const ConfigureVideo = () => {
    if (pathname ==='/publication'){
      setVideoSrc('https://www.youtube.com/embed/HJ5HZeWrES4')
      setVideoTitle('Treinamento virtual - módulo de publicação')
    }
    if (pathname ==='/calendar'){
      setVideoSrc('https://www.youtube.com/embed/3CCCpt-dQks')
      setVideoTitle('Treinamento virtual - módulo de compromissos / agendamentos')
    }
    if (pathname ==='/matter/list'){

      // setVideoSrc('https://www.youtube.com/embed/tjgacqVI6OA')
      setVideoSrc('https://bcompany-publicbkt.s3.us-west-1.amazonaws.com/GOJUR/videos/ProcessoIntroducao.mp4')
      setVideoTitle('Treinamento virtual - módulo de processos')
    }
    if (pathname ==='/customer/list'){
      setVideoTitle('Treinamento virtual - módulo de clientes')
    }
  }

  return (
    <>
      <Modal
        isOpen={showVideoTrainning}
        onRequestClose={handleCloseModal}
        overlayClassName="react-modal-overlay"
        className="react-modal-content-medium"
      >

        <button
          type="button"
          className="react-modal-close"
          onClick={handleCloseModal}
        >
          <FiX />
        </button>


        <Container>

          <div style={{borderColor:'red'}}>
            <h1>{videoTitle}</h1>
          </div>

          <iframe
            src={videoSrc}
            title={videoTitle}
            width='785rem'
            height='486rem'
            encrypted-media='true'
            name='BCompany video de treinamento GOJUR'
          />

        </Container>

      </Modal>

      {isLoading && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <Loader size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp;Aguarde...
          </div>
        </>
      )}

    </>

  )

}
