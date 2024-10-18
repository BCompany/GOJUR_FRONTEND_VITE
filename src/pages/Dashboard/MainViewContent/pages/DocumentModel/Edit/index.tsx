/* eslint-disable dot-notation */
/* eslint-disable no-param-reassign */
/* eslint-disable radix */

import React, { useCallback, useEffect, useState, ChangeEvent, useRef } from 'react';
import {useHistory, useLocation  } from 'react-router-dom'
import { FaFileAlt, FaRegTimesCircle, FaCheck, FaEye } from 'react-icons/fa'
import { FcAbout} from 'react-icons/fc';
import { FiSave, FiX } from 'react-icons/fi'
import { GoPlus, GoDash } from 'react-icons/go'
import { useToast } from 'context/toast';
import { HeaderPage } from 'components/HeaderPage';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { useModal } from 'context/modal';
import api from 'services/api';
import UploadAdapter from "./upload_adapter";
import {CKEditor} from '@ckeditor/ckeditor5-react';
import {ClassicEditor, AccessibilityHelp, Alignment, AutoImage, Autosave, BlockQuote, Bold, CloudServices, Essentials, FontBackgroundColor, FontColor, FontFamily, FontSize, Heading, ImageBlock, ImageCaption, ImageInline, ImageInsertViaUrl, ImageResize, ImageStyle, ImageTextAlternative, ImageToolbar, ImageUpload, Indent, IndentBlock, Italic, Link, LinkImage, List, ListProperties, PageBreak, Paragraph, SelectAll, SourceEditing, Strikethrough, Table, TableCaption, TableCellProperties, TableColumnResize, TableProperties, TableToolbar, Underline, Undo} from 'ckeditor5';
import {customColorPalette} from 'Shared/dataComponents/graphicsColors';
import translations from 'ckeditor5/translations/pt-br.js';
import Uploader from './Uploader'
import HeaderFooterModal from '../HeaderFooterModal/index';
import { Container, Content, Editor, Elements, ModalInformation, OverlayDocument, ModalWarning } from './styles';
import { AutoCompleteSelect } from 'Shared/styles/GlobalStyle';
import Select from 'react-select'
import { selectStyles, useDelay } from 'Shared/utils/commonFunctions';

export interface IDocumentModelData{
  cod_DocumentoModelo: string;
  des_Titulo: string;
  tpo_Documento: string;
  des_TituloWithType: string;
  des_TextoModelo: string;
  tpo_Cabecalho: string;
  des_CabecalhoPersonalizado: string;
  tpo_Rodape: string;
  des_RodapePersonalizado: string;
}

export const documentExtensionsList = [
  {id: "1", label: "PDF"},
  {id: "2", label: "WORD (.docx)"}
];

const DocumentModelEdit: React.FC = () => {
  // #region STATES
  const { addToast } = useToast();
  const token = localStorage.getItem('@GoJur:token');
  const history = useHistory();
  const { caller, modalActive } = useModal();
  const { pathname  } = useLocation();
  const [documentId, setDocumentId] = useState<string>(pathname.substr(20));
  const [documentTitle, setDocumentTitle] = useState<string>('');
  const [documentText, setDocumentText] = useState<string>('');  
  const [documentTypeId, setDocumentTypeId] = useState<string>('')
  const [oldDocumentTypeId, setOldDocumentTypeId] = useState<string>('')
  const [newDocumentTypeId, setNewDocumentTypeId] = useState<string>('')
  const [defaultHeader, setDefaultHeader] = useState<string>('S');
  const [showModal, setShowModal] = useState(false);
  const [openInformationModal, setOpenInformationModal] = useState(false);
  const [openWarningModal, setOpenWarningModal] = useState(false);
  const [headerTypeId, setHeaderTypeId] = useState<string>('')
  const [headerText, setHeaderText] = useState<string>('')
  const [footerTypeId, setFooterTypeId] = useState<string>('')
  const [footerText, setFooterText] = useState<string>('')
  const [defaultValue, setDefaultValue] = useState<string>('0');
  const [htmlChangeData, setHtmlChangeData] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [disableSelect, setDisableSelect] = useState(false);
  const [confirmWarning, setConfirmWarning] = useState(false);
  const [visualize, setVisualize] = useState<string>('')
  const [generateViewDocument, setGenerateViewDocument] = useState(false)
  const [showElementsDiv, setShowElementsDiv] = useState(true)
  const [buttonElementDiv, setButtonElementDiv] = useState<string>('Expandir editor')
  const MDLFAT = localStorage.getItem('@GoJur:moduleCode');
  const [fromCaller, setFromCaller] = useState<string>("")
  const [documentExtensionId, setDocumentExtensionId] = useState('')
  const editorContainerRef = useRef(null);
	const editorRef = useRef(null);
  const [selectedFormat, setSelectedFormat] = useState(null);


  // #region USE EFFECT
  useEffect(() => {
    DocumentEdit()
  }, [])
  


  useEffect(() => {
    setDocumentId(pathname.substr(20))
  }, [documentId])



  useEffect(() => {
    if (caller == 'advisoryTypeModal' && modalActive)
      setShowModal(true)      
  }, [caller, modalActive])


  useEffect(() => {
    if(confirmWarning)
      handleEditSave()
  }, [confirmWarning])



  useEffect(() => {
    if(visualize == "SaveAndGenerate")
      handleEditSave(false,true)
  }, [visualize])


  useEffect(() => {
    if(generateViewDocument)
      VisualizeDocument()
  }, [generateViewDocument])


  useEffect(() => {
    if(showElementsDiv)
      setButtonElementDiv("Expandir editor")
    else
      setButtonElementDiv("Reexibir campos")
  }, [showElementsDiv])
  // #endregion


  useEffect(() => {
    const defaultFormat = documentExtensionsList[0]; 
    setSelectedFormat(defaultFormat);
    handleModelDocumentExtensionValue(defaultFormat); 
  }, []);


  const DocumentEdit = async() => {
    try {
      const id = documentId

      if (id == "0")
      {
        return;
      }

      const response = await api.post<IDocumentModelData>('/DocumentosModelo/Editar', {id, token})

      setDocumentTitle(response.data.des_Titulo)
      setDocumentTypeId(response.data.tpo_Documento)
      setDocumentText(response.data.des_TextoModelo)
      setHeaderTypeId(response.data.tpo_Cabecalho)
      setHeaderText(response.data.des_CabecalhoPersonalizado)
      setFooterTypeId(response.data.tpo_Rodape)
      setFooterText(response.data.des_RodapePersonalizado)

      setDisableSelect(true)
    }
    catch (err) {
      console.log(err);
    }
  }


  const handleChangeDocumentType = (item) => {

    const id = pathname.substr(20)

    if(id == "0" && disableSelect == false)
    {
      setDocumentTypeId(item.target.value)
      setDisableSelect(true)
    }
    else
    {
      setOldDocumentTypeId(documentTypeId)
      setNewDocumentTypeId(item.target.value)
  
      setOpenInformationModal(true)
      setDisableSelect(true)
    }
    
  }



  const handleHeaderFooterModalClick = async () => {

    setFromCaller("headerAndFooter")

    const save = await handleEditSave(true)
    
    if (save == true){
      setShowModal(true)
    }
    else{
      return
    }
  }



  const ConfirmDocumentTypeChange = () => {
    setDocumentTypeId(newDocumentTypeId)
    setOpenInformationModal(false)
  }



  const DiscardDocumentTypeChange = () => {
    setDocumentTypeId(oldDocumentTypeId)
    setOpenInformationModal(false)
  }



  const handleEditClose = () => {
    history.push(`/documentModel/list`)
  }



  const handleEditSave = useCallback(async(fromheader = false, fromVisualize = false) => {
    try {
      
      if((documentText.includes("#cabecalho") || documentText.includes("#cabecalho")) && confirmWarning == false)
      {
        setOpenWarningModal(true)
        return
      }

      const token = localStorage.getItem('@GoJur:token');
    
      const response = await api.post('/DocumentosModelo/Salvar', {
        id: documentId,
        type: documentTypeId,
        title: documentTitle,
        text: documentText,
        headerType: headerTypeId,
        headerText,
        footerType: footerTypeId,
        footerText,
        token
      })

      history.push(`/documentmodel/edit/${response.data}`)
      setDocumentId(response.data)
      DocumentEdit()
      
      if(fromheader == false && fromVisualize == false){
        addToast({
          type: "success",
          title: "Documento salvo",
          description: "O documento foi adicionado no sistema."
        })
      }
    
      if(visualize == "SaveAndGenerate")
      {
        setGenerateViewDocument(true)
      }

      return true

    } catch (err:any) {
      setVisualize("")

      if (fromheader == true){
        addToast({
          type: "info",
          title: "Não foi possivel abrir o Cabeçalho/Rodapé.",
          description: err.response.data.Message
        })
      }
      else if (fromVisualize == true){
        addToast({
          type: "info",
          title: "Não foi possivel visualizar o documento.",
          description: err.response.data.Message
        })
      }
      else if (err.response.data.typeError.warning == "awareness"){
        addToast({
          type: "info",
          title: "Falha ao salvar documento.",
          description: err.response.data.Message
        })
      }
      else{
        addToast({
          type: "error",
          title: "Falha ao salvar documento.",
          description: err.response.data.Message
        })
      }

      return false
    }
  },[documentTitle, documentText, documentTypeId, headerTypeId, headerText, footerTypeId, footerText, confirmWarning, visualize, fromCaller, documentId ])



  const handleHeaderFooterCallback = (headerType: string, footerType: string, headerText: string, footerText: string ) => {

    setHeaderTypeId(headerType)
    setHeaderText(headerText)
    setFooterTypeId(footerType)
    setFooterText(footerText)
  }

  
  const handleHeaderFooterModalClose = () => {
    DocumentEdit()
    setShowModal(false)
  }


  function CustomAdapter( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
        return new Uploader( loader );
    };
  }


  const handleVisualize = () => {
    const id = pathname.substr(20)

      if(id == "0")
      {
        setVisualize("SaveAndGenerate")
      }
      else
      {
        VisualizeDocument()
      }
  }


  const VisualizeDocument = useCallback(async() => {
    try {
      setIsGenerating(true)
      const token = localStorage.getItem('@GoJur:token');

      const extensionId = Number(
        documentExtensionsList
          .filter(extension => extension.id === documentExtensionId)
          .map(extension => extension.id),
      );

      if(documentId == "0")
      {
        addToast({
          type: "info",
          title: "Atenção",
          description: "Favor salvar o documento antes de visualizar."
        })
        setIsGenerating(false)
        return;
      }

      if(extensionId == 0 && extensionId == null)
        {
          addToast({
            type: "info",
            title: "Atenção",
            description: "Favor selecionar o formato antes de visualizar."
          })
          setIsGenerating(false)
          return;
        }

      const response = await api.post('/DocumentosModelo/VisualizarModelo', {
        id: documentId,
        type: documentTypeId,
        title: documentTitle,
        text: documentText,
        headerType: headerTypeId,
        headerText,
        footerType: footerTypeId,
        footerText,
        token,
        documentExtensionId: extensionId
      })
      
      window.open(`${response.data.value}`, '_blank');
      
      setIsGenerating(false)
    }
    catch (err: any) {

      if (err.response.data.typeError.warning == "awareness") {

        setIsGenerating(false);
        addToast({
          type: "info",
          title: "Falha ao gerar documento.",
          description: err.response.data.Message
        })
      }
      else {
        setIsGenerating(false)
        addToast({
          type: "error",
          title: "Falha ao gerar documento.",
          description: err.response.data.Message
        })
      }
    }
  },[documentTitle, documentText, documentTypeId, headerTypeId, headerText, footerTypeId, footerText, pathname, documentId, documentExtensionId]);


  // update img src to S3 amazon
  useEffect(() => {
    if (htmlChangeData){
      const documentImage = localStorage.getItem('@Gojur:documentImage')

      if (documentImage){
        const newDocumentText = documentText.replaceAll('<img>', `'<img src=${documentImage} />'`)
        setDocumentText(newDocumentText)
        localStorage.removeItem('@Gojur:documentImage')
      }

      setHtmlChangeData(false)
    }
  }, [htmlChangeData])


  const ConfirmWarning = () => {
    setConfirmWarning(true)
    setOpenWarningModal(false)
  }



  const DiscardWarning = () => {
    setOpenWarningModal(false)
  }
  

  const handleComboChange = (e: any) => {
    
    if (editorRef.current){
      
      const {editor} = editorRef.current;
      
      editor.model.change(writer => {
        writer.insertText(e.target.value, editor.model.document.selection.getFirstPosition() );
      });
    }
  }


  // const createElementEditor = useCallback(() => {

  //   return (

  //     <div className="App">

  //       <CKEditor
  //         editor={DecoupledEditor}
  //         data={documentText}
  //         ref={editorRef}
  //         config={{
  //           language: 'pt-br',
  //           removePlugins: [ "TableColumnResize"],
  //           toolbar: {
  //             items: ["heading", "|", "fontfamily", "fontsize", "fontColor", "fontBackgroundColor", "|", "bold", "italic", "underline", "strikethrough", "link", "|", "alignment", "|", "numberedList", "bulletedList", "|", "outdent", "indent", "|", "uploadImage", "blockquote", "pageBreak", "insertTable", "tableColumn", "tableRow", "mergeTableCells", "|", "undo", "redo", "sourceEditing"],
  //             shouldNotGroupWhenFull: true
  //           },
  //           tableColumnResize: {
  //             isEnabled: false,
  //           },
  //           extraPlugins: [CustomAdapter, ],
  //           image: {
  //             insert: {
  //               type: 'inline'
  //             },
  //             resizeUnit: 'px',
  //             toolbar: [ 'ImageInline' ]
  //           },
  //           fontSize: {
  //             options: [ 9, 10, 11, 12, 13, 14, 15, 17, 19, 21 ]
  //           },
  //           fontColor: {
  //             colors: customColorPalette
  //           },
  //           fontBackgroundColor: {
  //             colors: customColorPalette
  //           },
  //           table: {
  //             contentToolbar: [
  //                 'tableColumn', 'tableRow', 'mergeTableCells',
  //                 'tableProperties', 'tableCellProperties'
  //             ],
  //             tableProperties: {
  //               tableAlignment: 'center',
  //               borderColors: customColorPalette,
  //               backgroundColors: customColorPalette
  //           },
  //           // Set the palettes for table cells.
  //           tableCellProperties: {
  //               borderColors: customColorPalette,
  //               backgroundColors: customColorPalette
  //           }
  //         }
  //         }}
  //         onReady={(editor) => {
           
  //           editor.ui.getEditableElement().parentElement.prepend(editor.ui.view.toolbar.element);
            
  //           editor.keystrokes.set( 'Tab', ( data, cancel ) => {
  //             editor.model.change(writer => {
  //               writer.insertText("            ", editor.model.document.selection.getFirstPosition() );
  //             });
  //             cancel();
  //           });
  //         }}
  //         onChange={(event, editor) => {

  //           const data = editor.getData();
  //           const documentImage = localStorage.getItem('@Gojur:documentImage');
  //           if (documentImage){
  //             setHtmlChangeData(true)
  //           }
           
  //           setDocumentText(data);
  //         }}
  //       />
        
  //     </div>
  //   )
  
  // },[documentText])


  const handleModelDocumentExtensionValue = (item) => { 
    if (item) {
      setSelectedFormat(item);
      setDocumentExtensionId(item.id); 
    } else {
      setSelectedFormat(null); 
      setDocumentExtensionId(''); 
    }
  };
  // },[documentText])


  const editorConfig = {
		toolbar: {
			items: [
				'heading',
        '|',
        'fontFamily', 'fontSize', 'fontColor', 'fontBackgroundColor',
        '|',
        'bold', 'italic', 'underline', 'strikethrough', 'link',
        '|',
        'alignment',
        '|',
        'bulletedList', 'numberedList', 
        '|',
        'outdent', 'indent', 'uploadImage',
        '|',
        'blockQuote', 'pageBreak', 'insertTable', 
        '|',
        'undo', 'redo',
        '|',
        'sourceEditing',
				'|',
			],
			shouldNotGroupWhenFull: true
		},
    extraPlugins: [CustomAdapter],
		plugins: [AccessibilityHelp, Alignment, AutoImage, Autosave, BlockQuote, Bold, CloudServices, Essentials, FontBackgroundColor, FontColor, FontFamily, FontSize, Heading, ImageBlock, ImageCaption, ImageInline, ImageInsertViaUrl, ImageResize, ImageStyle, ImageTextAlternative, ImageToolbar, ImageUpload, Indent, IndentBlock, Italic, Link, LinkImage, List, ListProperties, PageBreak, Paragraph, SelectAll, SourceEditing, Strikethrough, Table, TableCaption, TableCellProperties, TableColumnResize, TableProperties, TableToolbar, Underline, Undo],
		fontFamily: {supportAllValues: true},
		fontSize: {
			options: [ 9, 10, 11, 12, 13, 14, 15, 17, 19, 21 ],
			supportAllValues: true
		},
    fontColor: {
      colors: customColorPalette
    },
    fontBackgroundColor: {
      colors: customColorPalette
    },    
		heading: {
			options: [
				{
					model: 'paragraph',
					title: 'Paragraph',
					class: 'ck-heading_paragraph'
				},
				{
					model: 'heading1',
					view: 'h1',
					title: 'Heading 1',
					class: 'ck-heading_heading1'
				},
				{
					model: 'heading2',
					view: 'h2',
					title: 'Heading 2',
					class: 'ck-heading_heading2'
				},
				{
					model: 'heading3',
					view: 'h3',
					title: 'Heading 3',
					class: 'ck-heading_heading3'
				},
				{
					model: 'heading4',
					view: 'h4',
					title: 'Heading 4',
					class: 'ck-heading_heading4'
				},
				{
					model: 'heading5',
					view: 'h5',
					title: 'Heading 5',
					class: 'ck-heading_heading5'
				},
				{
					model: 'heading6',
					view: 'h6',
					title: 'Heading 6',
					class: 'ck-heading_heading6'
				}
			]
		},
		image: {
      insert: {type: 'inline'},
      resizeUnit: 'px',
      resizeOptions: [
        {
          name: 'resizeImage:original',
          label: 'Original',
          value: null
        },
        {
          name: 'resizeImage:custom',
          label: 'Custom',
          value: 'custom'
        },
        {
          name: 'resizeImage:100',
          label: '100px',
          value: '100'
        },
        {
          name: 'resizeImage:200',
          label: '200px',
          value: '200'
        }
      ],
			toolbar: ['ImageInline',]
		},
		initialData:
      documentText,
		language: 'pt-br',
		link: {
			addTargetToExternalLinks: true,
			defaultProtocol: 'https://',
			decorators: {
				toggleDownloadable: {
					mode: 'manual',
					label: 'Downloadable',
					attributes: {
						download: 'file'
					}
				}
			}
		},
		list: {
			properties: {
				styles: true,
				startIndex: true,
				reversed: true
			}
		},
		table: {
			contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
		},
		translations: [translations]
	}
 

  return (
    
    <Container>

      <HeaderPage />

      {showElementsDiv &&(
        <Elements id='Elements'>
          <div id='fixedElements'>
            <div style={{height:'60px', width:'100%'}}>
              <div style={{float:'left', width:'38%'}}>
                <label htmlFor="name" className="required">
                  Título do Documento
                  <br />
                  <input  
                    type="text" 
                    value={documentTitle}  
                    autoComplete="off"
                    name="nome"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDocumentTitle(e.target.value)} 
                    required
                  />
                </label>
              </div>

              <div style={{float:'left', width:'38%'}}>
                <label htmlFor="type">
                  Tipo de Documento
                  <br />

                  <select 
                    name="userType" 
                    value={documentTypeId} 
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChangeDocumentType(e)}
                  >
                    <option disabled={disableSelect} value="0">Selecione...</option>
                    <option value="CL">Cliente</option>
                    <option value="PR">Processo</option>
                    <option value="FI">Financeiro Movimento</option>
                    {MDLFAT == 'MDLFAT#' && (<option value="FC">Financeiro Contrato</option>)}
                    {MDLFAT == 'MDLFAT#' && (<option value="FF">Financeiro Fatura</option>)}
                  </select>
                </label>
              </div>

              <div style={{float:'left', width:'24%', marginTop:'13px'}}>
                <button 
                  className="buttonClick" 
                  title="Clique para editar o cabeçalho e rodapé dos documentos"
                  type="submit"
                  onClick={() => handleHeaderFooterModalClick()}
                >
                  <FaFileAlt />
                  Configurar Cabeçalho/Rodapé
                </button>
              </div>
            </div>

            <div style={{height:'20px'}}>
              <span style={{fontWeight:600}}>
                Palavras-Chave
              </span>
            </div>

            <div style={{height:'60px', width:'100%'}}>
              
              {documentTypeId == 'PR' &&(
                <div style={{float:'left', width:'19%'}}>
                  <label htmlFor="type">
                    Processo
                    <br />
                    <select 
                      id="matter" 
                      value={defaultValue} 
                      onChange={handleComboChange}
                      // onChange={(e) => setKeyWord(e.target.value)}
                    >
                      <option value="0">Selecione...</option>
                      <option value="#data">Data do Dia</option>
                      <option value="#numeroProcesso">Número</option>
                      <option value="#acaoJudicial">Ação Judicial</option>
                      <option value="#forumVara">Fórum Vara</option>
                      <option value="#objeto">Objeto</option>
                    </select>
                  </label>
                </div>
              )}

              {(documentTypeId == 'PR' || documentTypeId == 'CL') &&(
                <div style={{float:'left', width:'19%'}}>
                  <label htmlFor="type">
                    Cliente
                    <br />
                    <select 
                      id="customer" 
                      onChange={handleComboChange}
                      // onChange={(e) => setKeyWord(e.target.value)}
                    >
                      <option value="0">Selecione...</option>
                      <option value="#data">Data do Dia</option>
                      <option value="#nomeCliente">Nome</option>
                      <option value="#nacionalidadeCliente">Nacionalidade</option>
                      <option value="#estadoCivilCliente">Estado Civil</option>
                      <option value="#profissaoCliente">Profissão</option>
                      <option value="#rgCliente">RG</option>
                      <option value="#cnpjcpfPessoa">CNPJ ou CPF</option>
                      <option value="#nascimentoCliente">Nascimento</option>
                      <option value="#ctpsCliente">CTPS</option>
                      <option value="#serieCtpsCliente">Serie CTPS</option>
                      <option value="#pisCliente">PIS</option>
                      <option value="#salarioCliente">Último Salário</option>
                      <option value="#nomeMaeCliente">Nome Mãe</option>
                      <option value="#nomePaiCliente">Nome Pai</option>
                      <option value="#enderecoCliente">Endereço</option>
                      <option value="#telefoneCliente1">Telefone 1</option>
                      <option value="#telefoneCliente2">Telefone 2</option>
                      <option value="#emailCliente">E-Mail</option>
                      {documentTypeId == 'PR' &&(
                        <option value="#nomeContrario">Contrário</option>
                      )}
                    </select>
                  </label>
                </div>
              )}

              {documentTypeId == 'PR' &&(
                <div style={{float:'left', width:'19%'}}>
                  <label htmlFor="type">
                    Advogado
                    <br />
                    <select 
                      id="lawyer" 
                      onChange={handleComboChange}
                      // onChange={(e) => setKeyWord(e.target.value)}
                    >
                      <option value="0">Selecione...</option>
                      <option value="#data">Data do Dia</option>
                      <option value="##secaoAdvogados">Seção Advogados</option>
                      <option value="#nomeAdvogado">Nome</option>
                      <option value="#nacionalidadeAdvogado">Nacionalidade</option>
                      <option value="#estadoCivilAdvogado">Estado Civil</option>
                      <option value="#oabAdvogado">OAB</option>
                      <option value="#emailAdvogado">E-Mail</option>
                      <option value="#cpfAdvogado">CPF</option>
                      <option value="#enderecoAdvogado">Endereço</option>
                    </select>
                  </label>
                </div>
              )}

              {(documentTypeId == 'CL' || documentTypeId == 'PR') &&(
                <>
                  <div style={{float:'left', width:'19%'}}>
                    <label htmlFor="type">
                      Representante
                      <br />
                      <select 
                        id="repLegal" 
                        onChange={handleComboChange}
                        // onChange={(e) => setKeyWord(e.target.value)}
                      >
                        <option value="0">Selecione...</option>
                        <option value="#data">Data do Dia</option>
                        <option value="##secaoRepLegal">Seção Rep. Legal</option>
                        <option value="#nomeRepLegal">Nome</option>
                        <option value="#tpoRepLegal">Tipo</option>
                        <option value="#cpfRepLegal">CPF</option>
                        <option value="#rgRepLegal">RG</option>
                        <option value="#profissaoRepLegal">Profissão</option>
                        <option value="#estadoCivilRepLegal">Estado Civil</option>
                        <option value="#enderecoRepLegal">Endereço</option>
                        <option value="#preposto">Preposto</option>
                      </select>
                    </label>
                  </div>

                  {/* do not give space in the text placed in the corner of the screen to not add tabs in the title */}
                  <FcAbout
                    className='icons' 
                    title='Para exibir no documento os dados de todos os representantes cadastrados, as palavras-chaves devem ser inseridos dentro de uma seção que é identificada pela palavra chave ##secaoRepresentante.
A identificação deve ser inserida no início (antes da primeira palavra chave) e no fim da seção (após a ultima palavra chave).
A não utilização desta marcação fará com que sejam exibidos os dados apenas do primeiro representante cadastrado.
Ex. Representado por ##secaoRepresentante Dr(a). #nomeRepresentante, portador do CPF nº #cpfRepresentante.......... ##secaoRepresentante'
                    style={{minWidth: '20px', minHeight: '20px', marginTop:'25px'}}
                  />

                  &nbsp;&nbsp;

                  {/* do not give space in the text placed in the corner of the screen to not add tabs in the title */}
                  <FcAbout
                    className='icons' 
                    title='Ao utilizar a palavra chave #preposto, será substituído no texto pelo nome, CPF e RG do preposto(caso estejam cadastrados).
Ex. Fulano de Tal, portador do CPF nº xxx.xxx.xxx-xx, portador do RG nºxx.xxx.xx
Para cadastrar um preposto, utilize a opção de incluir um representante legal no cadastro de cliente, e selecione a opção Preposto no combo para classifica-lo.'
                    style={{minWidth: '20px', minHeight: '20px', marginTop:'25px'}}
                  />
                </>
              )}

              {documentTypeId == 'FI' &&(
                <div style={{float:'left', width:'19%'}}>
                  <label htmlFor="type">
                    Movimento
                    <br />
                    <select 
                      id="finance" 
                      onChange={handleComboChange}
                    >
                      <option value="0">Selecione...</option>
                      <option value="#data">Data do Dia</option>
                      <option value="#dataMovimento">Data do Movimento</option>
                      <option value="#descricaoMovimento">Descrição</option>
                      <option value="#valorMovimento">Valor</option>
                      <option value="#valorExtenso">Valor Extenso</option>
                      <option value="#numeroParcela">N° Parcela</option>
                      <option value="#notaFiscal">N° Nota Fiscal</option>
                    </select>
                  </label>
                </div> 
              )}

              {documentTypeId == 'FI' &&(
                <div style={{float:'left', width:'19%'}}>
                  <label htmlFor="type">
                    Cliente
                    <br />
                    <select 
                      id="financePeople" 
                      onChange={handleComboChange}
                      // onChange={(e) => setKeyWord(e.target.value)}
                    >
                      <option value="0">Selecione...</option>
                      <option value="#data">Data do Dia</option>
                      <option value="#nomePessoa">Nome</option>
                      <option value="#cnpjcpfPessoa">CNPJ ou CPF</option>
                      <option value="#rgPessoa">RG</option>
                      <option value="#enderecoPessoa">Endereço</option>
                    </select>
                  </label>
                </div>
              )}

              {(documentTypeId == 'FC' && MDLFAT == 'MDLFAT#') &&(
                <div style={{float:'left', width:'19%'}}>
                  <label htmlFor="type">
                    Contrato
                    <br />
                    <select 
                      id="financeContract" 
                      onChange={handleComboChange}
                    >
                      <option value="0">Selecione...</option>
                      <option value="#data">Data do Dia</option>
                      <option value="#objeto">Objeto</option>
                      <option value="#referenciaContrato">Referencia Contrato</option>
                      <option value="#servicosDescricao">Serviços Descrição</option>
                      <option value="#servicosListaComValor">Serviços Lista Com Valor</option>
                      <option value="#tipoContrato">Tipo Contrato</option>
                      <option value="#totalContrato">Total Contrato</option>
                    </select>
                  </label>
                </div>
              )}

              {(documentTypeId == 'FC' && MDLFAT == 'MDLFAT#') &&(
                <div style={{float:'left', width:'19%'}}>
                  <label htmlFor="type">
                    Cliente
                    <br />
                    <select 
                      id="financeContractPeople" 
                      onChange={handleComboChange}
                    >
                      <option value="0">Selecione...</option>
                      <option value="#data">Data do Dia</option>
                      <option value="#nomePessoa">Nome Pessoa</option>
                      <option value="#emailPessoa">E-Mail Pessoa</option>
                      <option value="#enderecoPessoa">Endereço Pessoa</option>
                      <option value="#cnpjcpfPessoa">CNPJ/CPF Pessoa</option>
                    </select>
                  </label>
                </div>
              )}

              {(documentTypeId == 'FF'  && MDLFAT == 'MDLFAT#') &&(
                <div style={{float:'left', width:'19%'}}>
                  <label htmlFor="type">
                    Fatura
                    <br />
                    <select 
                      id="financeBilling" 
                      onChange={handleComboChange}
                    >
                      <option value="0">Selecione...</option>
                      <option value="#data">Data do Dia</option>
                      <option value="#contaBancaria">Conta Bancária</option>
                      <option value="#categoria">Categoria</option>
                      <option value="#formaPagamento">Forma Pagamento</option>
                      <option value="#tipoPagamento">Tipo Pagamento</option>
                      <option value="#numeroFatura">Número Fatura</option>
                      <option value="#referenciaFatura">Referencia Fatura</option>
                      <option value="#servicosDescricao">Serviços Descrição</option>
                      <option value="#servicosListaComValor">Serviços Lista Com Valor</option>
                      <option value="#totalFatura">Total Fatura</option>
                      <option value="#valorTotalExtenso">valor Total Extenso</option>
                      <option value="#dataemissao">Data Emissão</option>
                      <option value="#primeiroVencimentoParcela">Primeiro Vencimento Parcela</option>
                      <option value="#todosVencimentosParcela">Todos Vencimentos Parcela</option>
                      <option value="#primeiroVencimentoBoleto">Primeiro Vencimento Boleto</option>
                      <option value="#todosVencimentosBoleto">Todos Vencimentos Boleto</option>
                    </select>
                  </label>
                </div>
              )}

              {(documentTypeId == 'FF' && MDLFAT == 'MDLFAT#') &&(
                <div style={{float:'left', width:'19%'}}>
                  <label htmlFor="type">
                    Cliente
                    <br />
                    <select 
                      id="financeBillingPeople" 
                      onChange={handleComboChange}
                    >
                      <option value="0">Selecione...</option>
                      <option value="#data">Data do Dia</option>
                      <option value="#nomePessoa">Nome Pessoa</option>
                      <option value="#cnpjcpfPessoa">CNPJ/CPF Pessoa</option>
                      <option value="#enderecoPessoa">Endereço Pessoa</option>
                    </select>
                  </label>
                </div>
              )}

              {(documentTypeId == 'FF'  && MDLFAT == 'MDLFAT#') &&(
                <div style={{float:'left', width:'19%'}}>
                  <label htmlFor="type">
                    Processo
                    <br />
                    <select 
                      id="financeBillingMatter" 
                      onChange={handleComboChange}
                    >
                      <option value="0">Selecione...</option>
                      <option value="#data">Data do Dia</option>
                      <option value="#numeroProcesso">Número Processo</option>
                      <option value="#partesProcesso">Partes Processo</option>
                    </select>
                  </label>
                </div>
              )}

            </div>
          </div>
        </Elements>
      )}

      <Content id='Content'>
        <>
          <div id='TextElements' style={{height:'1400px', overflow:'auto', width:'850px', margin:'auto'}}>

            <div id='Bottons' style={{float:'right', marginRight:'5%', display: "flex", alignItems: "center"}}>
              <div style={{float:'left', width:'160px', marginTop:'20px'}}>
                <button 
                  type='button'
                  className="buttonClick"
                  onClick={() => setShowElementsDiv(!showElementsDiv)}
                  style={{width:'145px'}}
                >
                  {showElementsDiv &&(
                    <GoDash />
                  )}
                  {!showElementsDiv &&(
                    <GoPlus />
                  )}
                  {buttonElementDiv}
                </button>
              </div>

              <div style={{float:'left', width:'265px', marginRight:"20px"}}>
                <AutoCompleteSelect style={{width: "265px"}}>
                    <p>Formato</p>  
                    <Select
                      isSearchable   
                      isClearable
                      placeholder="Selecione um formato"
                      onChange={(item) => handleModelDocumentExtensionValue(item)}
                      styles={selectStyles}                 
                      options={documentExtensionsList}
                      defaultValue={documentExtensionsList[0]}
                      value={selectedFormat} 
                    />
                </AutoCompleteSelect>
              </div>
              
              <div style={{float:'left', width:'120px', marginTop:'20px'}}>
                <button 
                  type='button'
                  className="buttonClick"
                  onClick={() => handleVisualize()}
                  style={{width:'100px'}}
                >
                  <FaEye />
                  Visualizar
                </button>
              </div>
              
              <div style={{float:'left', width:'120px', marginTop:'20px'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> handleEditSave()}
                  style={{width:'100px'}}
                >
                  <FiSave />
                  Salvar 
                </button>
              </div>
                        
              <div style={{float:'left', width:'120px', marginTop:'20px'}}>
                <button 
                  type='button'
                  className="buttonClick"
                  onClick={() => handleEditClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>

            <div id='Space' style={{width:'100%', height:'90px'}}><></></div>

            <Editor>
              <div className="main-container">
                <div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
                  <div className="editor-container__editor">
                    <div>
                      <CKEditor 
                        ref={editorRef}
                        editor={ClassicEditor}
                        data={documentText}
                        config={editorConfig}
                        onReady={(editor) => {
                          editor.ui.getEditableElement().parentElement.prepend(editor.ui.view.toolbar.element);
                          editor.keystrokes.set( 'Tab', ( data, cancel ) => {
                            editor.model.change(writer => {
                              writer.insertText("            ", editor.model.document.selection.getFirstPosition() );
                            });
                            cancel();
                          });
                        }}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          const documentImage = localStorage.getItem('@Gojur:documentImage');

                          if (documentImage){
                            setHtmlChangeData(true)
                          }
                          setDocumentText(data);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Editor>

            <div id='Space' style={{width:'100%', height:'40px'}}><></></div>

            <div id='Bottons' style={{float:'right', marginRight:'5%'}}>

            <div style={{float:'left', width:'265px', marginRight:"20px"}}>
                <AutoCompleteSelect style={{width: "265px"}}>
                    <p>Formato</p>  
                    <Select
                      isSearchable   
                      isClearable
                      placeholder="Selecione um formato"
                      onChange={(item) => handleModelDocumentExtensionValue(item)}
                      styles={selectStyles}                 
                      options={documentExtensionsList}
                      defaultValue={documentExtensionsList[0]}
                      value={selectedFormat} 
                    />
                </AutoCompleteSelect>
              </div>

              <div style={{float:'left', width:'120px', marginTop: "25px"}}>
                <button 
                  type='button'
                  className="buttonClick"
                  onClick={() => handleVisualize()}
                  style={{width:'100px'}}
                >
                  <FaEye />
                  Visualizar
                </button>
              </div>
              
              <div style={{float:'left', width:'120px', marginTop: "25px"}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> handleEditSave()}
                  style={{width:'100px'}}
                >
                  <FiSave />
                  Salvar 
                </button>
              </div>
                        
              <div style={{float:'left', width:'120px', marginTop: "25px"}}>
                <button 
                  type='button'
                  className="buttonClick"
                  onClick={() => handleEditClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </>
      </Content>

      {showModal && <HeaderFooterModal callbackFunction={{documentId, headerTypeId, headerText, footerTypeId, footerText, handleHeaderFooterCallback, handleHeaderFooterModalClose}} /> } 

      {showModal && <OverlayDocument /> }
      {(openInformationModal) && <OverlayDocument /> }

      {isGenerating && (
        <>
          <OverlayDocument />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp; Aguarde...
          </div>
        </>
      )}

      {openInformationModal && (
        <ModalInformation>
          <div className='menuSection'>
            <FiX onClick={(e) => setOpenInformationModal(false)} />
          </div>
          <div style={{marginLeft:'5%'}}>
            Ao alterar um tipo de documento, as palavras-chave presente no texto não funcionarão no novo tipo selecionado.
            <br />
            <br />
            Deseja realmente prosseguir com a alteração ?
            <br />
            <br />
            <div style={{float:'right', marginRight:'7%', bottom:0}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> ConfirmDocumentTypeChange()}
                  style={{width:'100px'}}
                >
                  <FaCheck />
                  Sim
                </button>
              </div>
                        
              <div style={{float:'left', width:'100px'}}>
                <button 
                  type='button'
                  className="buttonClick"
                  onClick={() => DiscardDocumentTypeChange()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Não
                </button>
              </div>
            </div>
          </div>

        </ModalInformation>
      )}

      {openWarningModal && (
        <ModalWarning>
          <div className='menuSection'>
            <FiX onClick={(e) => setOpenWarningModal(false)} />
          </div>
          <div style={{marginLeft:'5%'}}>
            Verificamos que você está utilizando as palavras chave cabeçalho/rodapé no texto do seu documento.
            <br />
            É mais interessante utilizar a nova funcionalidade e configurar o cabeçalho e rodapé direto no documento através do botão Configurar Cabeçalho/Rodapé.
            <br />
            <br />
            Deseja realmente utilizar as palavras chave no modelo ?
            <br />
            <br />
            <div style={{float:'right', marginRight:'7%', bottom:0}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> ConfirmWarning()}
                  style={{width:'100px'}}
                >
                  <FaCheck />
                  Sim
                </button>
              </div>
                        
              <div style={{float:'left', width:'100px'}}>
                <button 
                  type='button'
                  className="buttonClick"
                  onClick={() => DiscardWarning()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Não
                </button>
              </div>
            </div>
          </div>

        </ModalWarning>
      )}

    </Container>
  )

}

export default DocumentModelEdit;