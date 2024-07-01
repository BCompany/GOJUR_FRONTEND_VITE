/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
// eslint-disable-next-line jsx-a11y/label-has-associated-control
// eslint-disable-next-line jsx-a11y/interactive-supports-focus
/* eslint-disable no-return-assign */
// eslint-disable-next-line jsx-a11y/no-static-element-interactions
import React, { useState, useCallback, useEffect, ChangeEvent, useLayoutEffect} from 'react';
import { HeaderPage } from 'components/HeaderPage';
import { useHeader } from 'context/headerContext';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { ImMenu3, ImMenu4 } from 'react-icons/im';
import { FaRegTimesCircle } from 'react-icons/fa';
import { useToast } from 'context/toast';
import { MdHelp } from 'react-icons/md';
import Resizer from "react-image-file-resizer";
import { getOrientation } from 'get-orientation/browser';
import { FiSave } from 'react-icons/fi';
import { SiProducthunt } from "react-icons/si";
import { useMenuHamburguer } from 'context/menuHamburguer'
import MenuHamburguer from 'components/MenuHamburguer';
import Modal from 'react-modal';
import Cropper from 'react-easy-crop';
import { useHistory } from 'react-router-dom';
import { getCroppedImg } from 'components/CropImage/settings/canvasUtils';
import { useDevice } from "react-use-device";
import TextArea from 'components/TextArea';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { Overlay } from 'Shared/styles/GlobalStyle';
import api from 'services/api';
import { Container, Content, AccountInformationCard, CropContainerMobile, ImgControlsMobile, CropContainer, ImgControls, TollBar } from './styles';

export interface IReportParametersData{
  headerTextUpload: string;
  footerTextUpload: string;
  headerType: string;
}


Modal.setAppElement('#root');

const ReportParameters: React.FC = () => {
  const { addToast } = useToast();
  const token = localStorage.getItem('@GoJur:token');
  const { handleCaptureNewImage , imageT } = useHeader();
  const {isMenuOpen,  handleIsMenuOpen, } = useMenuHamburguer();
  const history = useHistory();
  const [isLoading, setIsLoading]= useState<boolean>(true);
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const [idReportGenerate, setIdReportGenerate] = useState<number>(0)

  const [headerType, setHeaderType] = useState<string>("1")
  const [headerTextUpload, setHeaderTextUpload] = useState<string>("")
  const [headerImgUpload, setHeaderImgtUpload] = useState<string>("")
  const [footerTextUpload, setFooterTextUpload] = useState<string>("")

  const [imageSrc, setImageSrc] = useState<any>(null);
	const [image, setImage] = useState<any>(null);
	const [imageTratada, setImageTratada] = useState<any>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [aspectTotal, setAspectTotal] = useState<number>()
  const [imageRate, setImageRate] = useState<number>()

  const [filesName, setFilesName] = useState<string>("");

  const { isMOBILE } = useDevice();

  useEffect(() => {

    if(headerImgUpload != "" && imageRate! > 4){
      setIsLoading(false)
      const image = document.querySelectorAll<HTMLElement>('.headerImage');
      image.forEach((e) => {
        e.style.maxWidth = '400px';
      });
      
    }

    else if(headerImgUpload != "" && imageRate! <= 4 && imageRate! > 3){
      setIsLoading(false)
      const image = document.querySelectorAll<HTMLElement>('.headerImage');
      image.forEach((e) => {
        e.style.maxWidth = '250px';
      });
    }

    else if(headerImgUpload != "" && imageRate! < 3 && imageRate! > 2.5){
      setIsLoading(false)
      const image = document.querySelectorAll<HTMLElement>('.headerImage');
      image.forEach((e) => {
        e.style.maxWidth = '150px';
      });
    }
    
    else if(headerImgUpload != "" && imageRate! < 2.5 && imageRate! > 1.8){
      setIsLoading(false)
      const image = document.querySelectorAll<HTMLElement>('.headerImage');
      image.forEach((e) => {
        e.style.maxWidth = '100px';
      });
    }

    else if(headerImgUpload != "" && imageRate! < 1.8 && imageRate! > 1.3){
      setIsLoading(false)
      const image = document.querySelectorAll<HTMLElement>('.headerImage');
      image.forEach((e) => {
        e.style.maxWidth = '70px';
      });
    }

    else{
      setIsLoading(false)
      const image = document.querySelectorAll<HTMLElement>('.headerImage');
      image.forEach((e) => {
        e.style.maxWidth = '50px';
      });
    }

  },[headerImgUpload, imageRate, headerType])

  useEffect(() => {

    if (headerImgUpload != "") {
      const img = new Image();
      img.onload = function() {
        setImageRate(img.width / img.height);
      }
      img.src = headerImgUpload;
    }
  
  },[headerImgUpload,imageRate])

  useEffect(() => {
    GetReportParameters()
  },[])

  useLayoutEffect(() => {
    if(imageTratada != null) {
      handleUpload(imageTratada)
    }
    
},[imageTratada])


useEffect(() => {
  if (idReportGenerate > 0){
    const checkInterval = setInterval(() => { CheckReportPending(checkInterval) }, 2000);
  }
},[idReportGenerate])


  // Check is report is already
  const CheckReportPending = useCallback(async (checkInterval) => {
    if (isGeneratingReport){
        const response = await api.post(`/ProcessosGOJUR/VerificarStatus`, {
          id: idReportGenerate,
          token
        })

        if (response.data == "F" && isGeneratingReport){
          clearInterval(checkInterval);
          setIsGeneratingReport(false)
          OpenReportAmazon()
        }

        if (response.data == "E"){
          clearInterval(checkInterval);
          setIsGeneratingReport(false)
  
          addToast({
            type: "error",
            title: "Operação não realizada",
            description: "Não foi possível gerar o relatório."
          })
  
        }
    }
  },[isGeneratingReport, idReportGenerate])


  // Open link with report
  const OpenReportAmazon = async() => {
    const response = await api.post(`/ProcessosGOJUR/Editar`, {
      id: idReportGenerate,
      token
    });

    setIdReportGenerate(0)
    window.open(`${response.data.des_Parametro}`, '_blank');
  }


  const GetReportParameters = useCallback(async() => {
    const token = localStorage.getItem('@GoJur:token');
    const response = await api.get<IReportParametersData>('/ParametrosRelatorio/Editar', {
      params:{
        token
      }
    })
  
    setFooterTextUpload(response.data.footerTextUpload)
    
    if(response.data.headerType == "img"){
      setHeaderType("2")
      setHeaderImgtUpload(response.data.headerTextUpload)
    }
    else{
      setHeaderType("1")
      setHeaderTextUpload(response.data.headerTextUpload.substring(9))
      setIsLoading(false)
    }

    

  },[ headerTextUpload, footerTextUpload, headerType]);


  async function handleUpload(image: any) {
    if(image === null) return;

    try {

    setIsUploading(true)
    const tokenApi = localStorage.getItem('@GoJur:token');

    const payload = {
        token: tokenApi,
        fileName: filesName
      }

      const file = new File([image], image)

      const headerImage = new FormData()
        
      headerImage.append('headerImage', file)
      headerImage.append('payload',  JSON.stringify(payload))  
      
        const response = await api.post('/ParametrosRelatorio/Upload', headerImage)

  
        addToast({
          title: "Cabeçalho alterado",
          type:"success",
          description: "Seu cabeçalho foi alterado com sucesso"
        })
        history.push('/ReportParameters')

        handleResetStates();
         
      } catch (error) {
        setImageTratada(null)
        handleResetStates();
        addToast({
          title: "Falha no upload",
          type:"error",
          description: "Não foi possivel alterar seu cabeçalho, tente novamente!"
        })          
      }
  }


  const saveReportParameters = useCallback(async() => {
    try {

      setisSaving(true)

      const token = localStorage.getItem('@GoJur:token');
      
      await api.post('/ParametrosRelatorio/Salvar', {
        headerText: headerTextUpload,
        footerText: footerTextUpload,
        headerType,
        token
      })
      
      addToast({
        type: "success",
        title: "Parâmetros de relatório salvo",
        description: "Os parâmetros de relatório foi adicionado no sistema."
      })
      
      setisSaving(false)
      GetReportParameters();
      window.location.reload()

    } catch (err) {
      setisSaving(false)
      addToast({
        type: "error",
        title: "Falha ao salvar parâmetros de relatório.",
      })
    }
  },[isSaving, footerTextUpload, headerType, headerTextUpload, headerImgUpload]);

  const img = new Image();
img.onload = function() {
  setAspectTotal(img.width / img.height);
}
img.src = imageSrc;



  const handleNewDescriptionHeader = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      const descriptionHeader = event.target.value;

      setHeaderTextUpload(descriptionHeader);
    },
    [],
  ); // salva o valor da descrição Header

  const handleNewDescriptionFooter = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      const descriptionFooter = event.target.value;

      setFooterTextUpload(descriptionFooter);
    },
    [],
  ); // salva o valor da descrição Footer

  const addPagination = useCallback(() => {
      let pagination = footerTextUpload
      pagination += " #Pagina#"

      setFooterTextUpload(pagination);
    },
    [footerTextUpload],
  ); // salva o valor da descrição do footer no botão de adicionar paginação

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFilesName(e.target.files[0].name)

      await handleCompress(file)
    }

  }; // carega a imagem selecionada


  async function handleCompress(imageSrc){
    uploadAfterProcessImage(imageSrc)
  }

  async function uploadAfterProcessImage(file){
    
    const imageDataUrl = await readFile(file);

      // apply rotation if needed
      const orientation = await getOrientation(file);

      const reader = new FileReader();
      
			reader.readAsDataURL(file);
			reader.addEventListener("load", () => {
				setImage(reader.result);
			});


      setImageSrc(imageDataUrl);
      console.log(imageSrc)
  }

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);


  }, []); // retorna o corte da imagem


  const showCroppedImage = useCallback(async () => {

    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
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

  }, [imageSrc, croppedAreaPixels, handleCaptureNewImage]); // executa o corte da imagem



  function handleControlMaxRowsHeader(event) {
    const newLines = headerTextUpload.split("\n").length
    const keyCode = event.which || event.keyCode;
    if (keyCode == 13 && newLines >= 3) {                
        event.preventDefault();
    }
  }

  function handleControlMaxRowsFooter(event) {
    const newLines = footerTextUpload.split("\n").length
    const keyCode = event.which || event.keyCode;
    if (keyCode == 13 && newLines >= 3) {                
        event.preventDefault();
    }
  }

  const handleResetStates = () => { 
    setImageSrc(null);
    setZoom(1);
    setImage(null)
    setCroppedImage(null)
    setHeaderTextUpload("");
    setHeaderImgtUpload("");
    GetReportParameters();
    
  }

  const handleOpenMatterDataReport = useCallback(async () => {

    if (isGeneratingReport){
      return;
    }

    setIsGeneratingReport(true)

    try
    {
      // matter legal filter
      const filter = `matterType=legal,privateEvent=Y,matterEventQty=T,reportLayout=detailedRecord,calendarEventQty=00,matterId=1}`;

      const response = await api.get('/ParametrosRelatorio/RelatorioExemplo', {
        params:{
          filter,
          filterDescription: `Tipo Processo: Jurídico`,
          token
        }
      })

      setIdReportGenerate(response.data)
    }
    catch{
      setIsGeneratingReport(false)
    }

  },[token])


  if(isLoading)
  {
    return (
      <Container>
        <HeaderPage />

        <Overlay />
        <div className='waitingMessage'>   
          <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
          &nbsp;&nbsp; Aguarde...
        </div>

      </Container>

    )
  }


  return (
    <>
      {!isMOBILE &&(
        <Container>

          <HeaderPage />

          <Content>

            <AccountInformationCard>
              {imageSrc ? (
                <>
                  <CropContainer>
                    <Cropper
                      image={imageSrc}
                      crop={crop}
                      zoom={zoom}
                      aspect={aspectTotal}
                      cropShape="rect"
                      // showGrid={false}
                      onCropChange={setCrop}
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
                        step={0.01}
                        aria-labelledby="Zoom"
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setZoom(Number(e.target.value))
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

                  <img src={String(croppedImage)} alt="" style={{ display: 'none'}} id="uploadImg" />
                </>
          ) : (
            <>
              <header>

                <p style={{fontSize: "18px"}}>
                  Parâmetros de Relatório
                </p>
                      
              </header>

              <b className='headerLabel'>
                CABEÇALHO
              </b>

              <div className='headerTypeDiv'>
                <p style={{fontSize:"16px", marginLeft:"1%", marginTop:"auto", marginBottom:"auto"}}>Tipo de Cabeçalho:</p>
                <label htmlFor="type" className='headerTypeLabel'>    
                  <select
                    className='headerTypeSelect'
                    name="Type"
                    value={headerType}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setHeaderType(e.target.value)}
                  >
                    <option value="1">Texto</option>
                    <option value="2">Imagem</option>
                  </select>
                </label>

                <MdHelp className='infoMessage' title="Inclua um texto ou uma imagem como cabeçalho nos relatórios." />
              </div>

              <div className='informationDiv'>
                <li> Clique no texto &quot;Nova Imagem&quot; abaixo caso queira substituir por uma nova.</li>
                <li> Clique no texto &quot;Visualizar Exemplo&quot; abaixo para visualizar um exemplo de relatório.</li>
                <li> No caso de utilizar imagem, sugerimos utilizar uma no formato retangular e com boa resolução.</li>
                <li> No cabeçalho em formato de texto e no rodapé são permitidas apenas 3 linhas de texto.</li>

              </div>

              {headerType == "1" && (
              <>
                <div className='textArea'>
                  <TextArea
                    name=""
                    value={headerTextUpload}
                    onChange={handleNewDescriptionHeader}
                    onKeyPress={(e) => handleControlMaxRowsHeader(e)}
                    style={{overflow:'auto', textAlign:"center"}}
                    maxLength={500}
                    rows={10}
                  />
                </div>

                <div className="uploadButton">
                  <label
                    className="buttonLinkClick"
                    title="Clique para gerar um relatório de exemplo"
                    style={{marginLeft:"15%"}}
                  >
                    Visualizar Exemplo
                    <input
                      type="button"
                      multiple
                      style={{display: 'none'}}
                      onClick={() => handleOpenMatterDataReport()}
                    />
                  </label>                
                </div>
              </>
            )} 

              {headerType == "2" && (
                <>
                  <img 
                    className='headerImage'
                    src={headerImgUpload} 
                    alt=""
                  />

                  <div className="uploadButton">
                    <label
                      className="buttonLinkClick"
                      title="Clique para selecionar arquivos em seu computador"
                    >
                      Nova Imagem
                      <input
                        type="file"
                        multiple
                        style={{display: 'none'}}
                        onChange={(e) => onFileChange(e)}
                      />
                    </label>

                    {headerImgUpload != "" && (
                    <label
                      className="buttonLinkClick"
                      title="Clique para gerar um relatório de exemplo"
                      style={{marginLeft:"7%"}}
                    >
                      Visualizar Exemplo
                      <input
                        type="button"
                        multiple
                        style={{display: 'none'}}
                        onClick={() => handleOpenMatterDataReport()}
                      />
                    </label>
                    )}
                  </div>
                </>
              )}


              <b className='footerLabel'>
                RODAPÉ  
              </b>

              <div>
                <p className='footerInformation'>
                  Clique no botão para incluir paginação no rodapé:
                </p>

                <div className='buttonAddPage'>
                  <button
                    className="buttonLinkClick"
                    onClick={addPagination}
                    type="submit"
                  >
                    <SiProducthunt className='buttonIcon' title="A Tag #Pagina# incluída no final do texto indica que o documento será paginado." />
                  </button>
                </div>
              
              </div>

              <div className='textAreaFooter'>
                <TextArea
                  name=""
                  value={footerTextUpload}
                  onChange={handleNewDescriptionFooter}
                  onKeyPress={(e) => handleControlMaxRowsFooter(e)}
                  style={{overflow:'auto', textAlign:"center"}}
                  maxLength={500}
                  rows={10}
                />
              </div>

              <br />

              <div style={{width:'100%'}}>
                <div id='Buttons' style={{float:'right', marginRight:'130px'}}>
                  <div id='ButtonSave' style={{float:'left'}}>
                    <button 
                      className="buttonClick"
                      type='button'
                      onClick={()=> saveReportParameters()}
                      style={{width:'100px'}}
                    >
                      <FiSave style={{marginTop:"1%", color:"white"}} />
                      Salvar
                    </button>
                  </div>
                            
                  <div id='ButtonCancel' style={{float:'left', width:'100px'}}>
                    <button 
                      type='button'
                      className="buttonClick"
                      onClick={() => history.push('/dashboard')}
                      title="Clique para voltar para o dashboard"
                      style={{width:'100px'}}
                    >
                      <FaRegTimesCircle style={{marginTop:"1%", color:"white"}} />
                      Fechar
                    </button>
                  </div>
                </div>
              </div>

              <br />
              <br />
              &nbsp;

            </>
          )}

              

            </AccountInformationCard>

          </Content>

        </Container>
    )}

      {isMOBILE &&(
        <Container>

          <HeaderPage />

          <Content>

            <AccountInformationCard>
              {imageSrc ? (
                <>
                  <CropContainerMobile>
                    <Cropper
                      image={imageSrc}
                      crop={crop}
                      zoom={zoom}
                      aspect={aspectTotal}
                      cropShape="rect"
                      // showGrid={false}
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                    />
                  </CropContainerMobile>

                  <ImgControlsMobile>
                    <label htmlFor="zoom">
                      Zoom
                      <input
                        type="range"
                        id="zoom"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.01}
                        aria-labelledby="Zoom"
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setZoom(Number(e.target.value))
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
                        Escolher outra imagem
                      </label>

                      
                      <button 
                        type="button" 
                        onClick={showCroppedImage}
                      >
                        Salvar nova imagem
                      </button>             
                    </div>
    
                  </ImgControlsMobile>

                  <img src={String(croppedImage)} alt="" style={{ display: 'none'}} id="uploadImg" />
                </>
          ) : (
            <>
              <header>

                <p style={{fontSize: "14px"}}>
                  Parâmetros de Relatório
                </p>
                      
              </header>

              <b className='headerLabelMobile'>
                CABEÇALHO
              </b>

              <div id='Header' className='headerTypeDiv'>
                <div>
                  <label htmlFor="type" className='headerTypeLabelMobile'>
                    Tipo de Cabeçalho
                    <select
                      className='headerTypeSelect'
                      name="Type"
                      value={headerType}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setHeaderType(e.target.value)}
                    >
                      <option value="1">Texto</option>
                      <option value="2">Imagem</option>
                    </select>
                  </label>
                </div>

                <div id='HelpButton' style={{marginTop:'5px', color:'blue'}}>
                  <MdHelp className='infoMessageMobile' title="Inclua um texto ou uma imagem como cabeçalho nos relatórios." />
                </div>
              </div>

              <div className='informationDivMobile'>
                <li> Clique no texto &quot;Nova Imagem&quot; abaixo caso queira substituir por uma nova.</li>
                <li> Clique no texto &quot;Visualizar Exemplo&quot; abaixo para visualizar um exemplo de relatório.</li>
                <li> No caso de utilizar imagem, sugerimos utilizar uma no formato retangular e com boa resolução.</li>
                <li> No cabeçalho em formato de texto e no rodapé são permitidas apenas 3 linhas de texto.</li>

              </div>

              {headerType == "1" && (
              <>
                <div className='textArea'>
                  <TextArea
                    name=""
                    value={headerTextUpload}
                    onChange={handleNewDescriptionHeader}
                    onKeyPress={(e) => handleControlMaxRowsHeader(e)}
                    style={{overflow:'auto', textAlign:"center"}}
                    maxLength={500}
                    rows={10}
                  />
                </div>
              </>
            )} 

              {headerType == "2" && (
                <>
                  <img 
                    className='headerImage'
                    src={headerImgUpload} 
                    alt=""
                  />

                  <div className="uploadButtonMobile">
                    <label
                      className="buttonLinkClick"
                      title="Clique para selecionar arquivos em seu computador"
                    >
                      Nova Imagem
                      <input
                        type="file"
                        multiple
                        style={{display: 'none'}}
                        onChange={(e) => onFileChange(e)}
                      />
                    </label>


                    {headerImgUpload != "" && (
                    <label
                      className="buttonLinkClick"
                      title="Clique para gerar um relatório de exemplo"
                      style={{marginLeft:"10%"}}
                    >
                      Relatório Exemplo
                      <input
                        type="button"
                        multiple
                        style={{display: 'none'}}
                        onClick={() => handleOpenMatterDataReport()}
                      />
                    </label>
                    )}
                  </div>
                </>
              )}


              <b className='footerLabelMobile'>
                RODAPÉ  
              </b>

              <div>
                <p className='footerInformationMobile'>
                  Clique no botão para incluir paginação no rodapé:
                </p>

                <div style={{display:"inline-block"}}>
                  <button
                    className="buttonLinkClick"
                    onClick={addPagination}
                    type="submit"
                  >
                    <SiProducthunt className='buttonAddPageMobile' title="A Tag #Pagina# incluída no final do texto indica que o documento será paginado." />
                  </button>
                </div>
              
              </div>

              <div className='textAreaFooterMobile'>
                <TextArea
                  name=""
                  value={footerTextUpload}
                  onChange={handleNewDescriptionFooter}
                  onKeyPress={(e) => handleControlMaxRowsFooter(e)}
                  style={{overflow:'auto', textAlign:"center"}}
                  maxLength={500}
                  rows={10}
                />
              </div>

              <br />

              <div style={{marginLeft:'5%', marginBottom:"1%"}}>
                <div style={{float:'left'}}>
                  <button 
                    className="buttonClick"
                    type='button'
                    onClick={()=> saveReportParameters()}
                    style={{width:'100px'}}
                  >
                    Salvar 
                  </button>
                </div>
                          
                <div style={{float:'left', width:'100px'}}>
                  <button 
                    type='button'
                    className="buttonClick"
                    onClick={() => history.push('/dashboard')}
                    title="Clique para voltar para o dashboard"
                    style={{width:'100px'}}
                  >
                    Fechar
                  </button>
                </div>
              </div>

            </>
          )}

              

            </AccountInformationCard>

          </Content>

        </Container>
    )}

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

      {isGeneratingReport && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Gerando Relatório ...
          </div>
        </>
  )}  

    </>
  );
}
function readFile(file: any) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}

export default ReportParameters;
