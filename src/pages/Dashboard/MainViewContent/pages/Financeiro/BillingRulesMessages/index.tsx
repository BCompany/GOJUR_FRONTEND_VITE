/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-constant-condition */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-multi-assign */
/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable import/extensions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-lonely-if */
/* eslint-disable react/jsx-one-expression-per-line */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import api from 'services/api';
import { ImMenu3, ImMenu4 } from 'react-icons/im';
import { GoDash, GoPlus } from 'react-icons/go';
import { MdBlock } from 'react-icons/md';
import { FiTrash, FiEdit, FiX, FiMail, FiSave } from 'react-icons/fi';
import { FaRegTimesCircle, FaCheck, FaFileContract, FaFileInvoiceDollar, FaHandshake, FaWhatsapp } from 'react-icons/fa';
import { CgFileDocument } from 'react-icons/cg';
import { RiMoneyDollarBoxFill, RiCloseLine } from 'react-icons/ri';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, AccessibilityHelp, Alignment, AutoImage, Autosave, BlockQuote, Bold, CloudServices, Essentials, FontBackgroundColor, FontColor, FontFamily, FontSize, Heading, ImageBlock, ImageCaption, ImageInline, ImageInsertViaUrl, ImageResize, ImageStyle, ImageTextAlternative, ImageToolbar, ImageUpload, Indent, IndentBlock, Italic, Link, LinkImage, List, ListProperties, PageBreak, Paragraph, SelectAll, SourceEditing, Strikethrough, Table, TableCaption, TableCellProperties, TableColumnResize, TableProperties, TableToolbar, Underline, Undo, LegacyTodoList } from 'ckeditor5';
import { customColorPalette } from 'Shared/dataComponents/graphicsColors';
import Uploader from './Uploader'
import translations from 'ckeditor5/translations/pt-br.js';
import { useDevice } from "react-use-device";
import { useToast } from 'context/toast';
import { envProvider } from 'services/hooks/useEnv';
import { useStateContext } from 'context/statesContext';
import { useHistory } from 'react-router-dom';
import { HeaderPage } from 'components/HeaderPage';
import { useAuth } from 'context/AuthContext';
import { useHeader } from 'context/headerContext';
import { AutoCompleteSelect, Overlay } from 'Shared/styles/GlobalStyle';
import { useMenuHamburguer } from 'context/menuHamburguer'
import MenuHamburguer from 'components/MenuHamburguer';
import Select from 'react-select';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { selectStyles, FormatDate, FormatCurrency, useDelay } from 'Shared/utils/commonFunctions';
import { months, financialYears } from 'Shared/utils/commonListValues';
import { languageGridEmpty, languageGridLoading, languageGridPagination } from 'Shared/utils/commonConfig';
import { DataTypeProvider, PagingState, CustomPaging } from '@devexpress/dx-react-grid';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { format } from 'date-fns';
import { IFinancialTotal, IAccount, ISelectData, IFinancial, IFinancialDeal } from '../Interfaces/IFinancial';
import FinancialDocumentModal from '../DocumentModal';
import FinancialPaymentModal from '../PaymentModal';
import { Container, Content, Editor1,FormCenter, FormCard, FormTitle, FormActions, GridContainerFinancial, ModalDeleteOptions, OverlayFinancial, HamburguerHeader } from './styles';
import DealDefaultModal from '../Category/Modal/DealDefaultModal';
import { trigger } from 'swr';
import { FcAlarmClock, FcCalendar } from "react-icons/fc";
import { IBillingRuler, IBillingRulerWarning } from '../BillingRule/Interfaces/IBillingRuler';

const BillingRulesMessages: React.FC = () => {
const { addToast } = useToast();
const { signOut } = useAuth();
const baseUrl = envProvider.redirectUrl;
const { handleJsonStateObject, handleStateType, jsonStateObject, stateType } = useStateContext();
const history = useHistory();
const { isMOBILE } = useDevice();
const token = localStorage.getItem('@GoJur:token');
const MDLFAT = localStorage.getItem('@GoJur:moduleCode');
const [documentText, setDocumentText] = useState<string>('');
const [documentText1, setDocumentText1] = useState<string>('');
const editorRef = useRef(null);
const editorRef1 = useRef(null);
const editorContainerRef = useRef(null);
const [htmlChangeData, setHtmlChangeData] = useState(false);
const [ message, setMessage ] = useState<string>('');
const [emailTitle, setEmailTitle] = useState('');
const [emailBody, setEmailBody] = useState('');
const [whatsBody, setWhatsBody] = useState('');
const [warningType, setWarningType] = useState('');
const [daysOfWarning, setDaysOfWarning] = useState('');
const [notificationType, setNotificationType] = useState('');



    const handleComboChange = (e: any) => {
        
        if (editorRef.current) {

            const { editor } = editorRef.current;

            editor.model.change(writer => {
                writer.insertText(e.target.value, editor.model.document.selection.getFirstPosition());
            });
        }
    }


    const handleComboChange1 = (e: any) => {

        if (editorRef1.current) {

            const { editor } = editorRef1.current;

            editor.model.change(writer => {
                writer.insertText(e.target.value, editor.model.document.selection.getFirstPosition());
            });
        }
    }


    function CustomAdapter(editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return new Uploader(loader);
        };
    }

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
        fontFamily: { supportAllValues: true },
        fontSize: {
            options: [9, 10, 11, 12, 13, 14, 15, 17, 19, 21],
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
            insert: { type: 'inline' },
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
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties'],
            tableProperties: {
                tableAlignment: 'center', borderColors: customColorPalette, backgroundColors: customColorPalette,
                defaultProperties: { borderColor: '#000000' },
            },
            tableCellProperties: {
                borderColors: customColorPalette, backgroundColors: customColorPalette,
                defaultProperties: { borderColor: '#000000' },
            }
        },
        translations: [translations]
    }



    const editorConfig1 = {
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
        fontFamily: { supportAllValues: true },
        fontSize: {
            options: [9, 10, 11, 12, 13, 14, 15, 17, 19, 21],
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
            insert: { type: 'inline' },
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
            documentText1,
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
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties'],
            tableProperties: {
                tableAlignment: 'center', borderColors: customColorPalette, backgroundColors: customColorPalette,
                defaultProperties: { borderColor: '#000000' },
            },
            tableCellProperties: {
                borderColors: customColorPalette, backgroundColors: customColorPalette,
                defaultProperties: { borderColor: '#000000' },
            }
        },
        translations: [translations]
    }


    // Initialization
    useEffect(() => {
    
        LoadMessages()
    
    }, [])
    


const LoadMessages = useCallback(async () => {

    try {
            const params = new URLSearchParams(location.search)
            let parambillingRulerWarningId= params.get('billingRulerWarningId') 
    
            const response = await api.get<IBillingRulerWarning>('/Financeiro/ReguaCobranca/SelecionarAviso', {
                                    params: {
                                        id: Number(parambillingRulerWarningId),
                                        token
                                    }
                                })

            setMessage(response.data.warningType == 'PREVIO' ? response.data.daysOfWarning + " dia(s) antes do vencimento" : response.data.warningType == 'VENCIMENTO' ? "no vencimento" : response.data.daysOfWarning + " dia(s) após o vencimento" )
             //alert(response.data.daysOfWarning);    
            setWarningType(response.data.warningType || '');
            setDaysOfWarning(response.data.daysOfWarning ? response.data.daysOfWarning.toString() : '');
            setEmailTitle(response.data.emailNotificationTitle || '');
            setEmailBody(response.data.emailNotificationDescription || '');
            setWhatsBody(response.data.whatsAppNotificationDescription || '');
            setNotificationType(response.data.notificationType || '');    

    }catch (err) {
    
    console.log(err)
    }
    
}, [location.search, token ]);



const handleSaveMessage = async () => {
  try {
    const params = new URLSearchParams(location.search);
    const billingRulerWarningId = Number(params.get('billingRulerWarningId'));
    const billingRulerId = Number(params.get('billingRulerId'));
    //const notificationType = params.get('notificationType');
   
    await api.post('/Financeiro/ReguaCobranca/SalvarAviso', {
      billingRulerWarningId,
      billingRulerId,
      warningType,
      notificationType,
      daysOfWarning,
      emailNotificationTitle: emailTitle,
      emailNotificationDescription: emailBody,
      whatsAppNotificationDescription: whatsBody,
      token
    });

    addToast({
      type: "success",
      title: "Mensagem salva",
      description: "Mensagem atualizada com sucesso"
    });

  } catch (err) {
    addToast({
      type: "error",
      title: "Erro",
      description: err.response?.data?.message || "Ocorreu um erro ao salvar a mensagem"
    });
  }
};



 
const handleClose = () => {

    const params = new URLSearchParams(location.search);
    const billingRulerId = Number(params.get('billingRulerId'));

    history.push(
        `BillingRule?billingRulerId=${billingRulerId}`
    );

};



return (
  <Container>
    <HeaderPage />

    {!isMOBILE && (
      <Content>
        <FormCenter>
          <FormCard>

            <FormTitle>Personalizar Mensagem</FormTitle>

            <p className='align-Icon' style={{ height: '27px' }}><FcCalendar />Essa mensagem será enviada <strong>{message}</strong> </p>


{(notificationType === 'EMAILWHATS' || notificationType === 'EMAIL') && (
                <div className="section">
                  <div className="section-title">
                    <FiMail/>Email
                  </div>

                  <div className="row">
                    <div className="autoComplete">
                    <p style={{ height: '27px' }}>Título</p>
                    <input
                        type="text"
                        className="inputField"
                        maxLength={20}
                        value={emailTitle}
                        onChange={(e) => setEmailTitle(e.target.value)}
                    />
                    </div>
                  </div>

                <div className="row">
                    <div className="autoComplete">
                    <p style={{ height: '27px' }}>Palavras Chave</p>
                    <select
                        id="financeBilling"
                        className="inputField"
                        onChange={handleComboChange}
                    >
                        <option value="">Selecione...</option>
                        <optgroup label="📄 Dados da Fatura">
                        <option value="#data">Data do Dia</option>
                        <option value="#vencimento">Vencimento</option>
                        <option value="#valor">Valor</option>
                        <option value="#descricao">Descrição</option>
                        <option value="#numeroParcela">Número Parcela</option>
                        <option value="#numeroTotalParcela">Total de Parcelas</option>
                        <option value="#notaFiscal">Número Nota Fiscal</option>
                        <option value="#formaPagto">Forma de Pagamento</option>
                        <option value="#numeroFatura">Número da Fatura</option>
                        <option value="#totalFatura">Total Fatura</option>
                        </optgroup>
                        <optgroup label="📄 Dados do Cliente">
                        <option value="#nomeCliente">Nome</option>
                        <option value="#cpfcnpjCliente">CPF/CNPJ</option>
                        <option value="#enderecoCliente">Endereço</option>
                        </optgroup>
                    </select>
                    </div>
 
                </div>

                <div className="row">
                    <div className="form-row">
                    <Editor1>
                       <CKEditor
                        ref={editorRef}
                        editor={ClassicEditor}
                        data={emailBody}
                        config={editorConfig}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setEmailBody(data);
                        }}
                        />
                    </Editor1>
                    </div>

                </div>
            </div>

    )}

 
    {(notificationType === 'EMAILWHATS' || notificationType === 'WHATS') && (
            <div className="section">
                <div className="section-title">
                    <FaWhatsapp/>WhatsApp
                  </div>

                   <div className="row">
                    <div className="autoComplete">
                    <p style={{ height: '27px' }}>Palavras Chave</p>
                    <select
                        id="financeBilling1"
                        className="inputField"
                        onChange={handleComboChange1}
                    >
                        <option value="">Selecione...</option>
                        <optgroup label="📄 Dados da Fatura">
                        <option value="#data">Data do Dia</option>
                        <option value="#vencimento">Vencimento</option>
                        <option value="#valor">Valor</option>
                        <option value="#descricao">Descrição</option>
                        <option value="#numeroParcela">Número Parcela</option>
                        <option value="#numeroTotalParcela">Total de Parcelas</option>
                        <option value="#notaFiscal">Número Nota Fiscal</option>
                        <option value="#formaPagto">Forma de Pagamento</option>
                        <option value="#numeroFatura">Número da Fatura</option>
                        <option value="#totalFatura">Total Fatura</option>
                        </optgroup>
                        <optgroup label="📄 Dados do Cliente">
                        <option value="#nomeCliente">Nome</option>
                        <option value="#cpfcnpjCliente">CPF/CNPJ</option>
                        <option value="#enderecoCliente">Endereço</option>
                        </optgroup>
                    </select>
                    </div>
                </div>
            
                <div className="row">
                    <div className="form-row">
                    <Editor1>
                        <CKEditor
                         ref={editorRef1}
                        editor={ClassicEditor}
                        data={whatsBody}
                        config={editorConfig1}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setWhatsBody(data);
                        }}
                        />
                    </Editor1>
                    </div>
                    
                </div>


            </div>
                
            )}

            <FormActions>
              <button className="buttonClick" type="button" onClick={handleSaveMessage}>
                <FiSave />
                Salvar
              </button>

              <button className="buttonClick" type="submit" onClick={handleClose}>
               <MdBlock />
                Fechar
              </button>

            </FormActions>

          </FormCard>
        </FormCenter>
      </Content>
    )}
  </Container>
);
};

export default BillingRulesMessages;
