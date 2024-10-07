/* eslint-disable no-param-reassign */
/* eslint-disable radix */

import React, { useCallback, useEffect, useState } from 'react';
import {useHistory, useLocation  } from 'react-router-dom'
import { FaRegTimesCircle, FaFileAlt } from 'react-icons/fa'
import { useToast } from 'context/toast';
import { HeaderPage } from 'components/HeaderPage';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { Overlay } from 'Shared/styles/GlobalStyle';
import api from 'services/api';
import UploadAdapter from "../Edit/upload_adapter";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {customColorPalette} from 'Shared/dataComponents/graphicsColors';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document/build/ckeditor';
import Uploader from '../Edit/Uploader';
import { Container, Content, Editor } from './styles';
import { AutoCompleteSelect } from 'Shared/styles/GlobalStyle';
import Select from 'react-select'
import { selectStyles, useDelay } from 'Shared/utils/commonFunctions';


export const documentExtensionsList = [
  {id: "1", label: "PDF"},
  {id: "2", label: "WORD (.docx)"}
];

const DocumentModelVizualize: React.FC = () => {
  const { addToast } = useToast();
  const token = localStorage.getItem('@GoJur:token');
  const history = useHistory();
  const { pathname  } = useLocation();
  const [documentText, setDocumentText] = useState<string>(localStorage.getItem('@GoJur:documentText')??"");  
  const [keyWord, setKeyWord] = useState<string>('');
  const [htmlChangeData, setHtmlChangeData] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [documentExtensionId, setDocumentExtensionId] = useState(''); 

  
  const handleEditClose = () => {
    localStorage.removeItem('@Gojur:documentText')

    const location = localStorage.getItem('@GoJur:documentLocation');

    if(location == 'matter')
    {
      localStorage.removeItem('@Gojur:documentLocation')
      history.push(`/matter/list`)
    }    
    else if(location == 'customer')
    {
      localStorage.removeItem('@Gojur:documentLocation')
      history.push(`/customer/list`)
    }
    else if(location == 'financial')
    {
      localStorage.removeItem('@Gojur:documentLocation')
      history.push(`/financeiro`)
    }
    else if(location == 'billingContractEdit')
    {
      localStorage.removeItem('@Gojur:documentLocation')
      const billingContractId = localStorage.getItem('@GoJur:billingContractId')
      history.push(`/financeiro/billingcontract/edit/${billingContractId}`)
      localStorage.removeItem('@Gojur:billingContractId')
    }
    else if(location == 'billingContractList')
    {
      localStorage.removeItem('@Gojur:documentLocation')
      history.push(`/financeiro/billingcontract/list`)
      localStorage.removeItem('@Gojur:billingContractId')
    }
    else if(location == 'billingInvoiceList')
    {
      localStorage.removeItem('@Gojur:documentLocation')
      history.push(`/financeiro/billinginvoice/list`)
      localStorage.removeItem('@Gojur:billingInvoiceId')
    }
    else if(location == 'billingInvoiceEdit')
    {
      localStorage.removeItem('@Gojur:documentLocation')
      const billingInvoiceId = localStorage.getItem('@GoJur:billingInvoiceId')
      history.push(`/financeiro/billinginvoice/edit/${billingInvoiceId}`)
      localStorage.removeItem('@Gojur:billingInvoicetId')
    }
    else
    {
      history.push(`/documentmodel/list`)
    }
  };


  function CustomAdapter( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
      return new Uploader( loader );
    };
  }


  function CustomAdapter64( editor ) {
    editor.plugins.get('FileRepository').createUploadAdapter = ( loader ) => {
      return new UploadAdapter( loader );
    };
  }


  const VisualizeDocument = useCallback(async() => {
    try {
      setIsGenerating(true)
      const id = pathname.substr(25);

      const extensionId = Number(
        documentExtensionsList
          .filter(extension => extension.id === documentExtensionId)
          .map(extension => extension.id),
      );

      if(extensionId == 0){
        addToast({
          title: 'Não foi possivel completar a operação',
          type: 'info',
          description: 'Para gerar um documento do tipo processo favor selecionar um formato',
        });     
        setIsGenerating(false)   
        return;
      }

      const response = await api.post('/DocumentosModelo/GerarDocumento', {
        id,
        text: documentText,
        token,
        documentExtensionId: extensionId
      })
         
      window.open(`${response.data.value}`, '_blank');
        
      setIsGenerating(false)
      localStorage.removeItem('@Gojur:documentText')
    }
    catch (err) {
      setIsGenerating(false)
      addToast({
        type: "error",
        title: "Falha ao gerar documento.",
      })
    }
  },[documentText, documentExtensionId]);


  const colors = [
    {
      color: 'hsl(0, 0%, 60%)',
      label: 'Grey'
    },
    'hsl(0, 0%, 80%)',
    {
      color: 'hsl(0, 0%, 90%)',
      label: 'Light grey'
    },
    {
      color: 'hsl(0, 0%, 100%)',
      label: 'White',
      hasBorder: true
    },
    '#FF0000'
  ]


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

  },[htmlChangeData])


  const handleModelDocumentExtensionValue = (item: any) => {
    
    if (item){
      setDocumentExtensionId(item.id);
    }else{
      setDocumentExtensionId('');
    }
  }


  return (
    <Container>
      <HeaderPage />
      <br />

      <Content>
        <>
          <div id='textElements' style={{height:'2400px', overflow:'auto', width:'850px', margin:'auto'}}>
            <Editor>
              <div className="App">
                <CKEditor
                  editor={DecoupledEditor}
                  data={documentText}
                  config={{
                    language: 'pt-br',
                    removePlugins: [ "TableColumnResize"],
                    toolbar: {
                      items: ["heading", "|", "fontfamily", "fontsize", "fontColor", "fontBackgroundColor", "|", "bold", "italic", "underline", "strikethrough", "link", "|", "alignment", "|", "numberedList", "bulletedList", "|", "outdent", "indent", "|", "uploadImage", "blockquote", "pageBreak", "insertTable", "tableColumn", "tableRow", "mergeTableCells", "|", "undo", "redo", "sourceEditing"],
                      shouldNotGroupWhenFull: true
                    },
                    extraPlugins: [CustomAdapter64],
                    keystrokes: [[ 9, 'doNothing']],
                    image: {
                      insert: {
                        type: 'inline'
                      },
                      resizeUnit: 'px',
                      toolbar: [ 'ImageInline' ]
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
                    const documentImage = localStorage.getItem('@Gojur:documentImage');
                    if (documentImage){
                      setHtmlChangeData(true)
                    }
                  
                    setDocumentText(data);
                  }}
                />
              </div>
            </Editor>

            <div style={{width:'100%', height:'50px'}}><></></div>

            <div style={{float:'right', marginRight:'5%'}}>

              <AutoCompleteSelect style={{marginLeft: 0, width: "265px"}}>
                  <p>Formato</p>  
                  <Select
                    isSearchable   
                    isClearable
                    placeholder="Selecione um formato"
                    onChange={(item) => handleModelDocumentExtensionValue(item)}
                    styles={selectStyles}                 
                    options={documentExtensionsList}
                  />
              </AutoCompleteSelect>

              <div style={{float:'left', width:'160px'}}>
                <button 
                  type='button'
                  className="buttonClick"
                  onClick={() => VisualizeDocument()}
                  style={{width:'150px'}}
                >
                  <FaFileAlt />
                  Gerar Documento
                </button>
              </div>
                        
              <div style={{float:'left', width:'120px'}}>
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

      {isGenerating && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp; Aguarde...
          </div>
        </>
      )}

    </Container>
  );

};

export default DocumentModelVizualize;