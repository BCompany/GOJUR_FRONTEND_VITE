/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */

import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { FaRegTimesCircle, FaCheck } from 'react-icons/fa';
import { useToast } from 'context/toast';
import { useDevice } from "react-use-device";
import { FiSave, FiX } from 'react-icons/fi';
import api from 'services/api';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useConfirmBox } from 'context/confirmBox';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document/build/ckeditor';
import {customColorPalette} from 'Shared/dataComponents/graphicsColors';
import Uploader from '../Edit/Uploader';
import { ModalHeaderFooter, Editor, ModalInformation, OverlayDocument, OverlayHeader, OverlayFooter } from './styles';

export interface IHeaderFooterData {
  id: string;
  value: string;
  count: string;
}

export interface IParameterData {
  parameterId: number;
  parameterName: string;
  parameterValue: string;
  message: string;
}

const HeaderFooterModal = (props) => {

  const {documentId, headerTypeId, headerText, footerTypeId, footerText, handleHeaderFooterCallback, handleHeaderFooterModalClose} = props.callbackFunction

  const { addToast } = useToast();
  const token = localStorage.getItem('@GoJur:token');
  const {isConfirmMessage, isCancelMessage, handleCancelMessage, handleConfirmMessage, caller, handleCaller, handleCheckConfirm } = useConfirmBox();
  const { isMOBILE } = useDevice();
  console.clear()

  const [warningCaller, setWarningCaller] = useState<string>("");

  const [documentModelId, setDocumentModelId] = useState<string>(documentId)
  const [openInformationModal, setOpenInformationModal] = useState(false)
  const [informationType, setInformationType] = useState('')
  const [confirmSave, setConfirmSave] = useState(false)

  // Header
  const [headerTypeIdModal, setHeaderTypeIdModal] = useState<string>(headerTypeId)
  const [headerTextModal, setHeaderTextModal] = useState<string>(headerText)
  const [checkChangeHeader, setCheckChangeHeader] = useState<boolean>(false)
  const [buttonChangeHeader, setButtonChangeHeader] = useState<boolean>(false)
  const [hasDefaultHeader, setHasDefaultHeader] = useState<boolean>(false)
  const [headerWarning, setHeaderWarning] = useState<boolean>(false)
  const [headerImage, setHeaderImage] = useState(false);

  // Footer
  const [footerTypeIdModal, setFooterTypeIdModal] = useState<string>(footerTypeId)
  const [footerTextModal, setFooterTextModal] = useState<string>(footerText)
  const [checkChangeFooter, setCheckChangeFooter] = useState<boolean>(false)
  const [buttonChangeFooter, setButtonChangeFooter] = useState<boolean>(false)
  const [hasDefaultFooter, setHasDefaultFooter] = useState<boolean>(false)
  const [footerWarning, setFooterWarning] = useState<boolean>(false)
  const [footerImage, setFooterImage] = useState(false);
  
  useEffect(() => {

    if(footerTypeId == 'E')
      setCheckChangeFooter(true)
    else if(footerTypeId == 'A')
      CheckCompanyDefaultHeaderFooter('#DOCDEFFOOTER,')

    if(headerTypeId == 'E')
      setCheckChangeHeader(true)
    else if(headerTypeId == 'A')
      CheckCompanyDefaultHeaderFooter('#DOCDEFHEADER,')

  },[footerTypeId, headerTypeId])
  
  useEffect(() => {

    if (isCancelMessage){

      if (caller === 'changeDefaultHeader')
      {
        setHeaderWarning(false)
      }
      
      if (caller === 'changeDefaultFooter')
      {
        setFooterWarning(false)
      }

      setWarningCaller("")
    }

  },[isCancelMessage, caller]);

  useEffect(() => {

    if(isConfirmMessage)
    {
      if (warningCaller == "C" && caller === 'changeDefaultHeader')
      {
        ChangeDefaultHeader()
        setHeaderWarning(false)
      }
      if (warningCaller == "R" && caller === 'changeDefaultFooter')
      {
        ChangeDefaultFooter()
        setFooterWarning(false)
      }      
      
      setWarningCaller("");
      handleConfirmMessage(false)
    }
  },[isConfirmMessage, caller]);

  // update img src to S3 amazon
  useEffect(() => {
    if (headerImage){
      const documentImage = localStorage.getItem('@Gojur:documentImage')

      if (documentImage){
        const newDocumentText = headerTextModal.replaceAll('<img>', `'<img src=${documentImage} />'`)
        setHeaderTextModal(newDocumentText)
        localStorage.removeItem('@Gojur:documentImage')
      }

      setHeaderImage(false)
    }
  },[headerImage])

  // update img src to S3 amazon
  useEffect(() => {
    if (footerImage){
      const documentImage = localStorage.getItem('@Gojur:documentImage')

      if (documentImage){
        const newDocumentText = footerTextModal.replaceAll('<img>', `'<img src=${documentImage} />'`)
        setFooterTextModal(newDocumentText)
        localStorage.removeItem('@Gojur:documentImage')
      }

      setHeaderImage(false)
    }
  },[footerImage])


  const CheckCompanyDefaultHeaderFooter = async (parameterName) => { 

    try
    {
      const response = await api.post<IParameterData[]>('/Parametro/Selecionar', {
        token,
        allowNull: true,
        parametersName: parameterName,
      })

      // HEADER
      if (parameterName == '#DOCDEFHEADER,')
      {
        if(response.data[0].parameterValue != null)
        {
          setHeaderTextModal(response.data[0].parameterValue)
          setButtonChangeHeader(true)
          setCheckChangeHeader(true)
        }
        else
        {
          setHasDefaultHeader(true);
          setCheckChangeHeader(false);
        }
      }

      // FOOTER
      if (parameterName == '#DOCDEFFOOTER,')
      {
        if(response.data[0].parameterValue != null)
        {
          setFooterTextModal(response.data[0].parameterValue);
          setButtonChangeFooter(true)
          setCheckChangeFooter(true)
        }
        else
        {
          setHasDefaultFooter(true);
          setCheckChangeFooter(false);
        }
      }
      
    }
    catch (err){
      console.log(err)
    }
  }

  // CHANGE HEADER SELECT
  const handleChangeHeaderType = (item) => {
    setHeaderTypeIdModal(item.target.value)

    if(item.target.value == 'E')
    {
      setCheckChangeHeader(true)
      setButtonChangeHeader(false)
      setHasDefaultHeader(false)
      setHeaderTextModal(headerText??"")
      return;
    }
    if(item.target.value == 'A')
    {
      CheckCompanyDefaultHeaderFooter('#DOCDEFHEADER,')
    }
    else
    {
      setCheckChangeHeader(false)
      setButtonChangeHeader(false)
    }
  };

  // CHANGE FOOTER SELECT
  const handleChangeFooterType = (item) => {
    setFooterTypeIdModal(item.target.value)

    if(item.target.value == 'E')
    {
      setCheckChangeFooter(true)
      setButtonChangeFooter(false)
      setHasDefaultFooter(false)
      setFooterTextModal(footerText??"")
      return;
    }
    if(item.target.value == 'A')
    {
      CheckCompanyDefaultHeaderFooter('#DOCDEFFOOTER,')
    }
    else
    {
      setCheckChangeFooter(false)
      setButtonChangeFooter(false)
    }
  };

  // CREATE DEFAULT HEADER
  const CreateDefaultHeader = () => { 
    setHeaderTextModal('')
    setCheckChangeHeader(true)
    setButtonChangeHeader(false)
    setHasDefaultHeader(false)
  }

  // CREATE DEFAULT FOOTER
  const CreateDefaultFooter = () => { 
    setFooterTextModal('')
    setCheckChangeFooter(true)
    setButtonChangeFooter(false)
    setHasDefaultFooter(false)
  }

  
  // CHANGE DEFAULT HEADER WARNING
  const ChangeDefaultHeaderWarning = async () => { 
    setWarningCaller("C")
    handleCaller('changeDefaultHeader')
    setHeaderWarning(true)
  }

  
  // CHANGE DEFAULT HEADER
  const ChangeDefaultHeader = async () => { 
    setCheckChangeHeader(true)
    setButtonChangeHeader(false)
  }


  // CHANGE DEFAULT FOOTER WARNING
  const ChangeDefaultFooterWarning = () => { 
    setWarningCaller("R")
    handleCaller('changeDefaultFooter')
    setFooterWarning(true)
  }


  // CHANGE DEFAULT FOOTER
  const ChangeDefaultFooter = () => { 
    setCheckChangeFooter(true)
    setButtonChangeFooter(false)
  }

  const saveHeaderFooter = useCallback(async() => {
    try {
      // If document exists, save header and footer in database
      if(documentModelId != "0")
      {
        await api.post('/DocumentosModelo/SalvarCabecalhoRodape', {
          id: documentModelId,
          headerType: headerTypeIdModal,
          headerText: headerTextModal,
          footerType: footerTypeIdModal,
          footerText: footerTextModal,
          token
        })
      }

      handleHeaderFooterModalClose()

      addToast({
        type: 'success',
        title: 'Operação realizada com sucesso',
        description: 'O Cabeçalho/Rodapé foram salvos com sucesso',
      });

    } catch (err:any) {
      
      if(err.response.data.typeError.warning == "awareness")
      {
        addToast({
          type: "info",
          title: "Atenção",
          description: err.response.data.Message
        })
      }
      else{
        addToast({
          type: "error",
          title: "Falha ao salvar cabeçalho e rodapé.",
          description: err.response.data.Message
        })
      }
    }
  },[headerTypeIdModal, footerTypeIdModal, headerTextModal, footerTextModal, confirmSave]);


  function HeaderCustomAdapter( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
        return new Uploader( loader );
    };
  }

  function FooterCustomAdapter( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
        return new Uploader( loader );
    };
  }

  return (
    <>

      {headerWarning && (
        <ConfirmBoxModal
          title="Alterar cabeçalho padrão"
          caller="changeDefaultHeader"
          useCheckBoxConfirm
          message="Esta operação irá alterar o cabeçalho padrão do escritório/empresa. ESTA OPERAÇÃO É IRREVERSÍVEL."
        />
      )}
      
      {footerWarning && (
        <ConfirmBoxModal
          title="Alterar rodapé padrão"
          caller="changeDefaultFooter"
          useCheckBoxConfirm
          message="Esta operação irá alterar o rodapé padrão do escritório/empresa. ESTA OPERAÇÃO É IRREVERSÍVEL."
        />
      )}

      {!isMOBILE &&(
        <ModalHeaderFooter show>

          <div id='ModalHeader' style={{width:'1058px', height:'28px', zIndex:9, position:'fixed'}}>
            <div className='menuTitle'>
              DEFINIR O CABEÇALHO E RODAPÉ DOS DOCUMENTOS
            </div>
            <div className='menuSection'>
              <FiX onClick={(e) => handleHeaderFooterModalClose()} />
            </div>
          </div>

          <div style={{width:'100%'}}>

            <div style={{width:'100%', height:'50px'}}><></></div>

            <div id='HeaderFooterSelect' style={{height:'70px'}}>
              <div style={{float:'left', width:'30%', marginLeft:'5%'}}>
                <label htmlFor="type">
                  Cabeçalho
                  <br />
                  <select name="userType" value={headerTypeIdModal} onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChangeHeaderType(e)}>
                    <option disabled value="0">Selecione...</option>
                    <option value="N">Nenhum</option>
                    <option value="A">Padrão</option>
                    <option value="E">Personalizado</option>
                  </select>
                </label>
              </div>

              <div style={{float:'right', width:'30%', marginRight:'5%'}}>
                <label htmlFor="type">
                  Rodapé
                  <br />
                  <select name="userType" value={footerTypeIdModal} onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChangeFooterType(e)}>
                    <option disabled value="0">Selecione...</option>
                    <option value="N">Nenhum</option>
                    <option value="A">Padrão</option>
                    <option value="E">Personalizado</option>
                  </select>
                </label>
              </div>
            </div>

            {hasDefaultHeader && (
              <div id='CreateDefaultHeader' style={{width:'100%', height:'50px', textAlign:'center'}}>
                <button type='button' className="buttonClick" style={{width:'450px', height:'37px'}} onClick={()=> CreateDefaultHeader()}>
                  Você ainda não criou um cabeçalho padrão - Clique aqui para criar um
                </button>
              </div>
            )}

            {buttonChangeHeader && (
              <div id='ChangeDefaultHeader' style={{width:'100%', height:'50px', textAlign:'center'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> ChangeDefaultHeaderWarning()}
                  style={{width:'300px', height:'37px'}}
                >
                  Clique aqui para alterar o cabeçalho padrão
                </button>
              </div>
            )}

            {checkChangeHeader && (
              <>
                {!buttonChangeHeader &&(
                  <div id='HeaderArea' className='HeaderArea'>
                    <div className='headerFooter'>
                      CABEÇALHO
                    </div>

                    <Editor>
                      <div className="App">
                        <CKEditor
                          data={headerTextModal}
                          editor={DecoupledEditor}
                          config={{
                            extraPlugins: [ HeaderCustomAdapter ],
                            removePlugins: [ "TableColumnResize"],
                            language: 'pt-br',
                            toolbar: ["heading", "|", "fontfamily", "fontsize", "fontColor", "fontBackgroundColor", "|", "bold", "italic", "underline", "strikethrough", "link", "|", "alignment", "|", "numberedList", "bulletedList", "|", "outdent", "indent", "|", "uploadImage", "blockquote", "insertTable", "tableColumn", "tableRow", "mergeTableCells", "|", "undo", "redo", "sourceEditing"],
                            image: {
                              resizeUnit: 'px',
                              toolbar: [ 'ImageInline' ],
                              insert: {
                                type: 'inline'
                              },
                            },
                            heading: {
                              options: [
                                  { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                              ]
                          },
                            shouldNotGroupWhenFull: true,
                            tableColumnResize: {
                              isEnabled: false,
                            },
                            fontSize: {
                              options: [ 9, 10, 11, 12, 13, 14, 15, 17, 19, 21 ]
                            },
                            fontColor: {
                              colors: customColorPalette
                            },
                            fontBackgroundColor: {
                              colors: customColorPalette
                            },
                            table: {   
                              tableAlignment: 'center',
                              contentToolbar: [
                                  'tableColumn', 'tableRow', 'mergeTableCells',
                                  'tableProperties', 'tableCellProperties'
                              ],
                  
                              tableProperties: {
                                borderColors: customColorPalette,
                                backgroundColors: customColorPalette
                            },
                
                            // Set the palettes for table cells.
                            tableCellProperties: {
                                borderColors: customColorPalette,
                                backgroundColors: customColorPalette
                            }
        
                            }
                          }}
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

                            // if exists image save set change tag image as true
                            const documentImage = localStorage.getItem('@Gojur:documentImage');
                            if (documentImage){
                              setHeaderImage(true)
                            }

                            setHeaderTextModal(data)
                          }}
                        />
                      </div>
                    </Editor>
                  </div>
                )}

                {buttonChangeHeader &&(
                  <OverlayHeader>
                    <div id='HeaderArea' className='HeaderArea' style={{pointerEvents:'none'}}>
                      <div className='headerFooter'>
                        CABEÇALHO
                      </div>

                      <Editor>
                        <div className="App">
                          <CKEditor
                            data={headerTextModal}
                            editor={DecoupledEditor}
                            config={{
                              extraPlugins: [ HeaderCustomAdapter ],
                              removePlugins: [ "TableColumnResize"],
                              language: 'pt-br',
                              toolbar: ["heading", "|", "fontfamily", "fontsize", "fontColor", "fontBackgroundColor", "|", "bold", "italic", "underline", "strikethrough", "link", "|", "alignment", "|", "numberedList", "bulletedList", "|", "outdent", "indent", "|", "uploadImage", "blockquote", "insertTable", "tableColumn", "tableRow", "mergeTableCells", "|", "undo", "redo", "sourceEditing"],
                              image: {
                                resizeUnit: 'px',
                                toolbar: [ 'ImageInline' ],
                                insert: {
                                  type: 'inline'
                                },
                              },
                              heading: {
                                options: [
                                    { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                                ]
                            },
                              fontSize: {
                                options: [ 9, 10, 11, 12, 13, 14, 15, 17, 19, 21 ]
                              },
                              fontColor: {
                                colors: customColorPalette
                              },
                              fontBackgroundColor: {
                                colors: customColorPalette
                              },
                              table: {   
                                tableAlignment: 'center',
                                contentToolbar: [
                                    'tableColumn', 'tableRow', 'mergeTableCells',
                                    'tableProperties', 'tableCellProperties'
                                ],
                    
                                tableProperties: {
                                  borderColors: customColorPalette,
                                  backgroundColors: customColorPalette
                                },
                  
                                // Set the palettes for table cells.
                                tableCellProperties: {
                                  borderColors: customColorPalette,
                                  backgroundColors: customColorPalette
                                }
                              }
                            }}
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

                              // if exists image save set change tag image as true
                              const documentImage = localStorage.getItem('@Gojur:documentImage');
                              if (documentImage){
                                setHeaderImage(true)
                              }

                              setHeaderTextModal(data)
                            }}
                          />
                        </div>
                      </Editor>
                    </div>
                  </OverlayHeader>
                )}
              </>
            )}

            <div style={{width:'100%', height:'50px'}}><></></div>

            {hasDefaultFooter && (
              <div id='CreateDefaultFooter' style={{width:'100%', height:'50px', textAlign:'center'}}>
                <button type='button' className="buttonClick" style={{width:'450px', height:'37px'}} onClick={()=> CreateDefaultFooter()}>
                  Você ainda não criou um rodapé padrão - Clique aqui para criar um
                </button>
              </div>
            )}

            {buttonChangeFooter && (
              <div id='ChangeDefaultFooter' style={{width:'100%', height:'50px', textAlign:'center'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> ChangeDefaultFooterWarning()}
                  style={{width:'300px', height:'37px'}}
                >
                  Clique aqui para alterar o rodapé padrão
                </button>
              </div>
            )}

            {checkChangeFooter && (
              <>
                {!buttonChangeFooter &&(
                  <div id='FooterArea' className='FooterArea'>
                    <div className='headerFooter'>
                      RODAPÉ
                    </div>

                    <Editor>
                      <div className="App">
                        <CKEditor
                          data={footerTextModal}
                          editor={DecoupledEditor}
                          config={{
                            extraPlugins: [ FooterCustomAdapter ],
                            language: 'pt-br',
                            removePlugins: [ "TableColumnResize"],
                            toolbar: ["heading", "|", "fontfamily", "fontsize", "fontColor", "fontBackgroundColor", "|", "bold", "italic", "underline", "strikethrough", "link", "|", "alignment", "|", "numberedList", "bulletedList", "|", "outdent", "indent", "|", "uploadImage", "blockquote", "insertTable", "tableColumn", "tableRow", "mergeTableCells", "|", "undo", "redo", "sourceEditing"],
                            image: {
                              resizeUnit: 'px',
                              toolbar: [ 'ImageInline' ],
                              insert: {
                                type: 'inline'
                              },
                            },
                            heading: {
                              options: [
                                  { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                              ]
                          },
                            fontSize: {
                              options: [ 9, 10, 11, 12, 13, 14, 15, 17, 19, 21 ]
                            },
                            fontColor: {
                              colors: customColorPalette
                            },
                            fontBackgroundColor: {
                              colors: customColorPalette
                            },
                            table: {   
                              tableAlignment: 'center',
                              contentToolbar: [
                                  'tableColumn', 'tableRow', 'mergeTableCells',
                                  'tableProperties', 'tableCellProperties'
                              ],
                  
                              tableProperties: {
                                borderColors: customColorPalette,
                                backgroundColors: customColorPalette
                            },
                
                            // Set the palettes for table cells.
                            tableCellProperties: {
                                borderColors: customColorPalette,
                                backgroundColors: customColorPalette
                            }
        
                            }
                          }}
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

                            // if exists image save set change tag image as true
                            const documentImage = localStorage.getItem('@Gojur:documentImage');
                            if (documentImage){
                              setFooterImage(true)
                            }

                            setFooterTextModal(data)
                          }}
                        />
                      </div>
                    </Editor>
                  </div>
                )}

                {buttonChangeFooter &&(
                  <OverlayFooter>
                    <div id='FooterArea' className='FooterArea' style={{pointerEvents:'none'}}>
                      <div className='headerFooter'>
                        RODAPÉ
                      </div>

                      <Editor>
                        <div className="App">
                          <CKEditor
                            data={footerTextModal}
                            editor={DecoupledEditor}
                            config={{
                              extraPlugins: [ FooterCustomAdapter ],
                              language: 'pt-br',
                              removePlugins: [ "TableColumnResize"],
                              items: ["heading", "|", "fontfamily", "fontsize", "fontColor", "fontBackgroundColor", "|", "bold", "italic", "underline", "strikethrough", "link", "|", "alignment", "|", "numberedList", "bulletedList", "|", "outdent", "indent", "|", "uploadImage", "blockquote", "pageBreak", "insertTable", "tableColumn", "tableRow", "mergeTableCells", "|", "undo", "redo", "sourceEditing"],
                              image: {
                                resizeUnit: 'px',
                                toolbar: [ 'ImageInline' ],
                                insert: {
                                  type: 'inline'
                                },
                              },
                              heading: {
                                options: [
                                    { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                                ]
                            },
                              fontSize: {
                                options: [ 9, 10, 11, 12, 13, 14, 15, 17, 19, 21 ]
                              },
                              fontColor: {
                                colors: customColorPalette
                              },
                              fontBackgroundColor: {
                                colors: customColorPalette
                              },
                              table: {   
                                tableAlignment: 'center',
                                contentToolbar: [
                                    'tableColumn', 'tableRow', 'mergeTableCells',
                                    'tableProperties', 'tableCellProperties'
                                ],
                    
                                tableProperties: {
                                  borderColors: customColorPalette,
                                  backgroundColors: customColorPalette
                              },
                  
                              // Set the palettes for table cells.
                              tableCellProperties: {
                                  borderColors: customColorPalette,
                                  backgroundColors: customColorPalette
                              }
          
                              }
                            }}
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

                              // if exists image save set change tag image as true
                              const documentImage = localStorage.getItem('@Gojur:documentImage');
                              if (documentImage){
                                setFooterImage(true)
                              }

                              setFooterTextModal(data)
                            }}
                          />
                        </div>
                      </Editor>
                    </div>
                  </OverlayFooter>
                )}
              </>
            )}

            <br />
            <br />

            <div id='SaveCloseButtons' style={{float:'right', marginRight:'83px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> saveHeaderFooter()}
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
                  onClick={() => handleHeaderFooterModalClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>

            <div style={{width:'100%', height:'60px'}}><></></div>

          </div>
          
        </ModalHeaderFooter>
      )}

      {openInformationModal && (
        <ModalInformation>
          <div className='menuHeader'>
            <div className='menuTitle'>
              AVISO
            </div>
            <div className='menuSection'>
              <FiX onClick={(e) => setOpenInformationModal(false)} />
            </div>
          </div>
          
          <div style={{backgroundColor:'white', height:'85%', marginTop:'27px'}}>
            <div style={{marginLeft:'5%'}}>
              <br />
              O seu 
              {informationType} 
              ultrapassou o limite de 500 caracteres.
              <br />
              Com isso é possível que a formatação sofra alterações.
              <br />
              <br />
              Deseja prosseguir mesmo assim ?
              <br />
              <br />
              <div style={{float:'right', marginRight:'7%', marginTop:'-7px'}}>
                <div style={{float:'left'}}>
                  <button 
                    className="buttonClick"
                    type='button'
                    onClick={()=> {setConfirmSave(true); setOpenInformationModal(false); saveHeaderFooter()}}
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
                    onClick={() => setOpenInformationModal(false)}
                    style={{width:'100px'}}
                  >
                    <FaRegTimesCircle />
                    Voltar
                  </button>
                </div>
              </div>
            </div>
          </div>

        </ModalInformation>
      )}

      {(openInformationModal) && <OverlayDocument /> }

    </>
  )

}
export default HeaderFooterModal;
