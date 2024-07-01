/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useState, useCallback, ChangeEvent, useEffect, useLayoutEffect } from 'react';
import { useHeader } from 'context/headerContext';
import { HeaderPage } from 'components/HeaderPage';
import { FiCamera, FiSave, FiInfo } from 'react-icons/fi';
import { FaRegTimesCircle, FaKey, FaMoneyCheckAlt, FaWhatsapp } from 'react-icons/fa';
import Cropper from 'react-easy-crop';
import { getOrientation } from 'get-orientation/browser';
import { envProvider } from 'services/hooks/useEnv';
import { BsFillFolderFill } from 'react-icons/bs';
import {useHistory} from 'react-router-dom';
import { useSecurity } from 'context/securityContext';
import { SecurityModule } from 'context/Interfaces/ISecurity';
import Resizer from "react-image-file-resizer";
import { getCroppedImg, getRotatedImage } from 'components/CropImage/settings/canvasUtils';
import { useToast } from 'context/toast';
import api from 'services/api';
import { useDefaultSettings } from 'context/defaultSettings';
import Loader from 'react-spinners/PulseLoader';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { AvatarChange, Container, Content, CropContainer, ImgControls, AccountHelper, ModalPassword, ItemCard, OverlayPassword } from './styles';

interface DefaultsProps {
  id: string;
  value: string;
}

const Usuario: React.FC = () => {
  const { addToast } = useToast();
  const { handleShowListSearch, handleCaptureNewImage , imageT } = useHeader();
  const { handleUserPermission } = useDefaultSettings();
  const history = useHistory();
  const [imageSrc, setImageSrc] = useState<any>(null);
	const [image, setImage] = useState<any>(null);
	const [imageTratada, setImageTratada] = useState<any>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [openPasswordModal, setOpenPasswordModal] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const token = localStorage.getItem('@GoJur:token');
  const accessCode = localStorage.getItem('@GoJur:accessCode')
  const baseUrl = envProvider.redirectUrl;
  const {permissionsSecurity, handleValidateSecurity } = useSecurity();
  const checkAccountInformation = permissionsSecurity.find(item => item.name === "CACINFO");
  const checkFinancialInformation = permissionsSecurity.find(item => item.name === "CACINFFI");


  async function handleUpload(image: any) {
    if(image === null) return;

    try {
      setIsUploading(true)
      const tokenApi = localStorage.getItem('@GoJur:token');

      const payload = {
        token: tokenApi,
        parameter: "userPhoto" 
      }

      const file = new File([image], `imageAvatar.png`, {type: "image/png"})

      const avatar = new FormData()
        
      avatar.append('avatar', file)
      avatar.append('payload',  JSON.stringify(payload))  
      
      const response = await api.post('/Arquivos/UploadUserPhoto', avatar)

      localStorage.setItem('@GoJur:Avatar', response.data)

      history.push('/dashboard')
  
      addToast({type:"success", title: "Avatar Alterado", description: "Seu avatar de perfil foi alterado com sucesso"})

      setIsUploading(false)
    } 
    catch (error) {
      setImageTratada(null)
      setIsUploading(false)
      addToast({type:"error", title: "Falha no upload", description: "Não foi possivel alterar seu avatar, tente novamente!"})          
    }
  }


  // useEffect(() => {
  //   async function handleDefaultProps() {
  //     try {
  //       const tokenapi = localStorage.getItem('@GoJur:token');
  
  //       const response = await api.post<DefaultsProps[]>('/Defaults/Listar', {
  //         token: tokenapi,
  //       });
        
  //       const userprops = response.data[4].value.split('|');
  
  //       handleUserPermission(userprops);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }

  //   handleDefaultProps()
  // }, [handleUserPermission])


  // Call security permission - passing module
  useEffect(() => {
    handleValidateSecurity(SecurityModule.configuration)
  }, [])


  useLayoutEffect(() => {
    handleUpload(imageTratada)
  }, [])


  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []); // Retorna o corte da imagem


  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation,
      );
      
      setCroppedImage(croppedImage);  

      const url = String(croppedImage)
      handleCaptureNewImage(url)

      fetch(url)
       .then(res => res.blob())
        .then(blob => setImageTratada(blob))
    } catch (e) {
      console.error(e);
    }   
  }, [imageSrc, croppedAreaPixels, rotation, handleCaptureNewImage]); // Executa o corte da imagem


  async function handleCompress(imageSrc){
    resizeFile(imageSrc)
  }


  const resizeFile = (file) => {
    Resizer.imageFileResizer(
      file,
      400,
      400,
      "JPEG",
      80,
      0,
      (uri) => {
        uploadAfterProcessImage(uri)
      },
      "file",
      200,
      200
    );
  };


  async function uploadAfterProcessImage(file){
    let imageDataUrl = await readFile(file);

    // apply rotation if needed
    const orientation = await getOrientation(file);
    const rotation = orientation;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("load", () => {
      setImage(reader.result);
    });

    if (rotation) {
      imageDataUrl = await getRotatedImage(imageDataUrl, rotation);
    }

    setImageSrc(imageDataUrl);
  }


  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await handleCompress(file)
    }
  }; // Carrega a imagem selecionada


  useEffect(() => {
    if (imageTratada != null) {
      handleUpload(imageTratada)
    }
  }, [imageTratada])


  const ChangePassword = () => {
    setOpenPasswordModal(true)
  }


  const handleAccountInformation = () => {
    history.push(`/AccountInformation`)
  }


  const handleFinancialInformation = () => {
    localStorage.setItem('@GoJur:financialInformationCaller', 'userProfile');
    window.open(`/financialInformation`)
  }


  const handlebackup = () => {
    history.push(`/companyfiles`)
  }


  const PasswordModalClose = () => {
    setOpenPasswordModal(false)
    setPassword("")
  }


  const saveNewPassword = useCallback(async() => {
    try {
      const token = localStorage.getItem('@GoJur:token');
      
      const response = await api.post('/Usuario/TrocarSenha', {
        password,
        token
      })
      
      localStorage.setItem('@GoJur:token', response.data)

      addToast({type: "success", title: "Senha salva", description: "A senha foi alterada no sistema."})

      PasswordModalClose()
    } 
    catch (err) {
      addToast({type: "error", title: "Falha ao alterar senha."})
    }
  }, [password]);


  return (    
    <Container id='Container'>
      <HeaderPage />
      <Content id='Content' onClick={() => handleShowListSearch(false)}>
        {imageSrc ? (
          <>
            <CropContainer>
              <Cropper
                image={imageSrc}
                crop={crop}
                rotation={rotation}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                // showGrid={false}
                onCropChange={setCrop}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </CropContainer>
            <ImgControls>
              <label htmlFor="zoom">
                Zoom
                <input
                  type="range"
                  id="zoom"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setZoom(Number(e.target.value))
                  }
                />
              </label>
              <label htmlFor="rotate">
                Rotação
                <input
                  type="range"
                  id="rotate"
                  value={rotation}
                  min={0}
                  max={360}
                  step={1}
                  aria-labelledby="Rotation"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setRotation(Number(e.target.value))
                  }
                />
              </label>

              <div className="button-controls">
                <label htmlFor="file">
                  <input
                    type="file"
                    id="file"
                    accept="image/*"
                    onChange={onFileChange}
                  />
                  <FiCamera />
                  Escolher outra imagem
                </label>
                
                <button 
                  type="button" 
                  onClick={showCroppedImage}
                >
                  Salvar nova imagem
                </button>             
              </div>
            </ImgControls>

            <img src={String(croppedImage)} alt="image" style={{ display: 'none'}} id="uploadImg" />
          </>
        ) : (
          <>
            <ItemCard id='ItemCard1'>
              <header>
                IMAGEM DE PERFIL
              </header>
              <div>
                <section>
                  <article>
                    <br />
                    <AccountHelper htmlFor="file">
                      <input
                        type="file"
                        id="file"
                        accept="image/*"
                        onChange={onFileChange}
                      />
                      <FiCamera />
                      Trocar imagem de perfil
                    </AccountHelper>
                  </article>
                </section>
              </div>
            </ItemCard>

            <ItemCard id='ItemCard2'>
              <header>
                SENHA DE ACESSO
              </header>
              <div>
                <section>
                  <article>
                    <br />
                    <AccountHelper htmlFor="password">
                      <button
                        type="button"
                        onClick={ChangePassword}
                      >
                        <FaKey />
                        Trocar senha
                      </button>
                    </AccountHelper>
                  </article>
                </section>
              </div>
            </ItemCard>

            {checkAccountInformation && (
              <ItemCard id='ItemCard3'>
                <header>
                  CONTA GOJUR
                </header>
                <div>
                  <section>
                    <article>
                      <br />
                      <AccountHelper htmlFor="password">
                        <button
                          type="button"
                          onClick={handleAccountInformation}
                        >
                          <FiInfo />
                          Informações da Conta
                        </button>
                      </AccountHelper>
                    </article>
                  </section>
                </div>
              </ItemCard>
            )}

            {checkFinancialInformation && (
              <ItemCard id='ItemCard4'>
                <header>
                  FINANCEIRO
                </header>
                <div>
                  <section>
                    <article>
                      <br />
                      <AccountHelper htmlFor="password">
                        <button
                          type="button"
                          onClick={handleFinancialInformation}
                        >
                          <FaMoneyCheckAlt />
                          Informações Financeiro
                        </button>
                      </AccountHelper>
                    </article>
                  </section>
                </div>
              </ItemCard>
            )}

            {accessCode == "adm" && (
              <ItemCard id='ItemCard5'>
                <header>
                  ARQUIVOS
                </header>
                <div>
                  <section>
                    <article>
                      <br />
                      <AccountHelper htmlFor="backup">
                        <button
                          type="button"
                          onClick={handlebackup}
                        >
                          <BsFillFolderFill />
                          Backup Arquivos
                        </button>
                      </AccountHelper>
                    </article>
                  </section>
                </div>
              </ItemCard>
            )}
          </>
        )}
        <div />

        <ModalPassword show={openPasswordModal}>
          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Alterar senha:&nbsp;
            
            <br />
            <br />
            <br />

            <label htmlFor="senha" style={{fontSize:'12px'}}>
              Digite a nova senha 
              <br />
              <input 
                type="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                autoComplete="off"
              />
            </label>

            <br />
            <br />
            <br />

            <div style={{float:'right', marginRight:'10px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> saveNewPassword()}
                  style={{width:'100px'}}
                >
                  <FiSave />
                  Salvar 
                </button>
              </div>
                        
              <div style={{float:'left', width:'100px'}}>
                <button 
                  type='button'
                  className="buttonClick"
                  onClick={() => PasswordModalClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>

          </div>
        </ModalPassword>

      </Content>

      {openPasswordModal &&(<OverlayPassword />)}

      {(isUploading) && (
        <Overlay>
          <div>
            Aguarde... Carregando Imagem
            &nbsp;
            &nbsp;
            <Loader size={4} color="var(--blue-twitter)" /> 
          </div>
        </Overlay>
      )}

    </Container>
  );
};

function readFile(file: any) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}

export default Usuario;
