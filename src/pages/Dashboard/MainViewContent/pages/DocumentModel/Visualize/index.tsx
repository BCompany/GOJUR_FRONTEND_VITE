/* eslint-disable no-param-reassign */
/* eslint-disable radix */

import React, { useCallback, useEffect, useState, useRef } from 'react';
import {useHistory, useLocation} from 'react-router-dom'
import {FaRegTimesCircle, FaFileAlt} from 'react-icons/fa'
import {useToast} from 'context/toast';
import {HeaderPage} from 'components/HeaderPage';
import LoaderWaiting from 'react-spinners/ClipLoader';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import {ClassicEditor, AccessibilityHelp, Alignment, AutoImage, Autosave, BlockQuote, Bold, CloudServices, Essentials, FontBackgroundColor, FontColor, FontFamily, FontSize, Heading, ImageBlock, ImageCaption, ImageInline, ImageInsertViaUrl, ImageResize, ImageStyle, ImageTextAlternative, ImageToolbar, ImageUpload, Indent, IndentBlock, Italic, Link, LinkImage, List, ListProperties, PageBreak, Paragraph, SelectAll, SourceEditing, Strikethrough, Table, TableCaption, TableCellProperties, TableColumnResize, TableProperties, TableToolbar, Underline, Undo} from 'ckeditor5';
import {customColorPalette} from 'Shared/dataComponents/graphicsColors';
import translations from 'ckeditor5/translations/pt-br.js';
import {Overlay} from 'Shared/styles/GlobalStyle';
import api from 'services/api';

import Uploader from '../Edit/Uploader';
import { Container, Content, Editor } from './styles';

const DocumentModelVizualize: React.FC = () => {
  const { addToast } = useToast()
  const token = localStorage.getItem('@GoJur:token')
  const history = useHistory()
  const { pathname  } = useLocation()
  const [documentText, setDocumentText] = useState<string>(localStorage.getItem('@GoJur:documentText')??"")
  const [keyWord, setKeyWord] = useState<string>('')
  const [htmlChangeData, setHtmlChangeData] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const editorContainerRef = useRef(null);
	const editorRef = useRef(null);

  
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


  const VisualizeDocument = useCallback(async() => {
    try {
      setIsGenerating(true)
      const id = pathname.substr(25)

      const response = await api.post('/DocumentosModelo/GerarDocumento', {
        id,
        text: documentText,
        token
      })
      
      if (response.data.id == "OK")
      {
        window.open(`${response.data.value}`, '_blank');
      }
      
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
  },[documentText]);


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


  useEffect(() => {
    if (htmlChangeData){
      const documentImage = localStorage.getItem('@Gojur:documentImage')

      if (documentImage){
        const newDocumentText = documentText.replaceAll('<img>', `<img src=${documentImage} />`)
        setDocumentText(newDocumentText)
        localStorage.removeItem('@Gojur:documentImage')
      }

      setHtmlChangeData(false)
    }
  }, [htmlChangeData])


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
		placeholder: '',
		table: {
			contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
		},
		translations: [translations]
	};


  return (
    <Container>
      <HeaderPage />
      <br />

      <Content>
        <>
          <div id='textElements' style={{height:'2400px', overflow:'auto', width:'850px', margin:'auto'}}>

            <Editor>
              <div className="main-container">
                <div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
                  <div className="editor-container__editor">
                    <div>
                      <CKEditor
                        editor={ClassicEditor}
                        ref={editorRef}
                        config={editorConfig}
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

            <div style={{width:'100%', height:'50px'}}><></></div>

            <div id='Buttons' style={{float:'right', marginRight:'5%'}}>
              <div style={{float:'left', width:'160px'}}>
                <button type='button' className="buttonClick" onClick={() => VisualizeDocument()} style={{width:'150px'}}>
                  <FaFileAlt />
                  Gerar Documento
                </button>
              </div>

              <div style={{float:'left', width:'120px'}}>
                <button type='button' className="buttonClick" onClick={() => handleEditClose()} style={{width:'100px'}}>
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