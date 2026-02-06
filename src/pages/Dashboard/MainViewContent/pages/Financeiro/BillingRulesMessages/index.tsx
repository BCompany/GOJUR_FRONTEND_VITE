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
import { FiTrash, FiEdit, FiX, FiMail, FiSave } from 'react-icons/fi';
import { FaRegTimesCircle, FaCheck, FaFileContract, FaFileInvoiceDollar, FaHandshake, FaWhatsapp } from 'react-icons/fa';
import { CgFileDocument } from 'react-icons/cg';
import { RiMoneyDollarBoxFill } from 'react-icons/ri';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, AccessibilityHelp, Alignment, AutoImage, Autosave, BlockQuote, Bold, CloudServices, Essentials, FontBackgroundColor, FontColor, FontFamily, FontSize, Heading, ImageBlock, ImageCaption, ImageInline, ImageInsertViaUrl, ImageResize, ImageStyle, ImageTextAlternative, ImageToolbar, ImageUpload, Indent, IndentBlock, Italic, Link, LinkImage, List, ListProperties, PageBreak, Paragraph, SelectAll, SourceEditing, Strikethrough, Table, TableCaption, TableCellProperties, TableColumnResize, TableProperties, TableToolbar, Underline, Undo } from 'ckeditor5';
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
import { Container, Content, Editor, GridContainerFinancial, ModalDeleteOptions, OverlayFinancial, HamburguerHeader } from './styles';
import DealDefaultModal from '../Category/Modal/DealDefaultModal';
import { trigger } from 'swr';

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


    return (
        <Container>

            <HeaderPage />


            {!isMOBILE && (
                <Content>

                    <div style={{ height: '300px' }}>

                        <div style={{ float: 'left', width: '50%', height: '280px' }}>

                            <h3>Régua de Cobrança Mensagens</h3><br />


                            <br />
                            <h5>Email</h5>

                            <div className='autoComplete'>

                                <p style={{ height: '27px' }}>Título</p>
                                <input
                                    type="text"
                                    className='inputField'
                                    maxLength={20}
                                />


                            </div>

                            <div className='autoComplete'>

                                <p style={{ height: '27px' }}>Palavras Chave</p>
                                <select
                                    id="financeBilling"
                                    className='inputField'
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

                            </div>

                            <div className="form-row">

                                <Editor>

                                    <CKEditor
                                        id="ckeditor"
                                        ref={editorRef}
                                        editor={ClassicEditor}
                                        data={documentText}
                                        config={editorConfig}
                                      

                                    />
                                </Editor>


                            </div>

                            <br />
                            <h5>Whatsapp</h5>

                            <div className='autoComplete'>

                                <p style={{ height: '27px' }}>Palavras Chave</p>

                                <select
                                    id="financeBilling1"
                                    className='inputField'
                                    onChange={handleComboChange1}
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


                            </div>

                            <div className="form-row">

                                <Editor>

                                    <CKEditor
                                        id="ckeditor1"
                                        ref={editorRef1}
                                        editor={ClassicEditor}
                                        data={documentText1}
                                        config={editorConfig1}

                                    />
                                </Editor>


                            </div>

                            <br />
                            <div className="form-row">
                                <button className="buttonClick" type="submit">
                                    <FiSave />
                                    Salvar
                                </button>

                            </div>

                            <br /><br />

                        </div>



                    </div>





                </Content>
            )}


        </Container>
    );
};

export default BillingRulesMessages;
