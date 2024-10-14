import React, { useCallback, useEffect, useState,useRef } from 'react';
import { HeaderPage } from 'components/HeaderPage';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Container, Content, Editor } from './styles';
import {ClassicEditor, AccessibilityHelp, Alignment, AutoImage, Autosave, BlockQuote, Bold, CloudServices, Essentials, FontBackgroundColor, FontColor, FontFamily, FontSize, Heading, ImageBlock, ImageCaption, ImageInline, ImageInsertViaUrl, ImageResize, ImageStyle, ImageTextAlternative, ImageToolbar, ImageUpload, Indent, IndentBlock, Italic, Link, LinkImage, List, ListProperties, PageBreak, Paragraph, SelectAll, SourceEditing, Strikethrough, Table, TableCaption, TableCellProperties, TableColumnResize, TableProperties, TableToolbar, Underline, Undo} from 'ckeditor5';
import translations from 'ckeditor5/translations/pt-br.js';
import 'ckeditor5/ckeditor5.css';


export default function App() {
	const editorContainerRef = useRef(null);
	const editorRef = useRef(null);
	const [isLayoutReady, setIsLayoutReady] = useState(false);


	useEffect(() => {
		setIsLayoutReady(true);
		return () => setIsLayoutReady(false);
	}, []);


	const editorConfig = {
		toolbar: {
			items: [
				'undo', 'redo',
				'|',
				'sourceEditing',
				'|',
				'heading',
				'|',
				'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor',
				'|',
				'bold', 'italic', 'underline', 'strikethrough',
				'|',
				'pageBreak', 'link', 'insertTable', 'blockQuote',
				'|',
				'alignment',
				'|',
				'bulletedList', 'numberedList', 'outdent', 'indent', 'uploadImage'
			],
			shouldNotGroupWhenFull: true
		},
		plugins: [
			AccessibilityHelp,
			Alignment,
			AutoImage,
			Autosave,
			BlockQuote,
			Bold,
			CloudServices,
			Essentials,
			FontBackgroundColor,
			FontColor,
			FontFamily,
			FontSize,
			Heading,
			ImageBlock,
			ImageCaption,
			ImageInline,
			ImageInsertViaUrl,
			ImageResize,
			ImageStyle,
			ImageTextAlternative,
			ImageToolbar,
			ImageUpload,
			Indent,
			IndentBlock,
			Italic,
			Link,
			LinkImage,
			List,
			ListProperties,
			PageBreak,
			Paragraph,
			SelectAll,
			SourceEditing,
			Strikethrough,
			Table,
			TableCaption,
			TableCellProperties,
			TableColumnResize,
			TableProperties,
			TableToolbar,
			Underline,
			Undo
		],
		fontFamily: {
			supportAllValues: true
		},
		fontSize: {
			options: [10, 12, 14, 'default', 18, 20, 22],
			supportAllValues: true
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
			toolbar: [
				'toggleImageCaption',
				'imageTextAlternative',
				'|',
				'imageStyle:inline',
				'imageStyle:wrapText',
				'imageStyle:breakText',
				'|',
				'resizeImage'
			]
		},
		initialData:
			'TESTE',
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
		placeholder: 'Type or paste your content here!',
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
        <div>
          <div className="main-container">
            <div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
              <div className="editor-container__editor">
                <div ref={editorRef}>{isLayoutReady && <CKEditor editor={ClassicEditor} config={editorConfig} />}</div>
              </div>
            </div>
          </div>
        </div>
      </Content>
    </Container>
		
	);
}
