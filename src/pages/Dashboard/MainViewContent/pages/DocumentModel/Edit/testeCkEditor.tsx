// /* eslint-disable dot-notation */
// /* eslint-disable no-param-reassign */
// /* eslint-disable radix */

// import React, { useCallback, useEffect, useState, ChangeEvent, useRef } from 'react';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo } from 'ckeditor5/src/main';
// import {customColorPalette} from 'Shared/dataComponents/graphicsColors';
// import Uploader from './Uploader'
// import { Container, Content, Editor } from './styles';
// import 'ckeditor5/src/App.css';

// const TestCkEditor: React.FC = () => {
//   const token = localStorage.getItem('@GoJur:token');
//   const [htmlChangeData, setHtmlChangeData] = useState(false);
//   const [documentText, setDocumentText] = useState<string>(localStorage.getItem('@GoJur:documentText')??"");  

//   function CustomAdapter( editor ) {

//     editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
//         return new Uploader( loader );
//     };
//   }
  
//   return (
//     <Container>
//       <h1>TESTE CkEditor</h1>
//           <br />

//         <Content>
//           <>
//             <div id='textElements' style={{height:'2400px', overflow:'auto', width:'850px', margin:'auto'}}>
//               <Editor>

//                 <div className="App">

//                   <CKEditor
//                     editor={ClassicEditor}
//                     data={documentText}
//                     config={{
//                       language: 'pt-br',
//                       removePlugins: [ "TableColumnResize"],
//                       toolbar: {
//                         items: ["heading", "|", "fontfamily", "fontsize", "fontColor", "fontBackgroundColor", "|", "bold", "italic", "underline", "strikethrough", "link", "|", "alignment", "|", "numberedList", "bulletedList", "|", "outdent", "indent", "|", "uploadImage", "blockquote", "pageBreak", "insertTable", "tableColumn", "tableRow", "mergeTableCells", "|", "undo", "redo", "sourceEditing"],
//                         shouldNotGroupWhenFull: true
//                       },
//                       extraPlugins: [CustomAdapter],
//                       keystrokes: [[ 9, 'doNothing']],
//                       image: {
//                         insert: {
//                           type: 'inline'
//                         },
//                         resizeUnit: 'px',
//                         toolbar: [ 'ImageInline' ]
//                       },
//                       fontSize: {
//                         options: [ 9, 10, 11, 12, 13, 14, 15, 17, 19, 21 ]
//                       },
//                       fontColor: {
//                         colors: customColorPalette
//                       },
//                       fontBackgroundColor: {
//                         colors: customColorPalette
//                       },
//                       table: {   
//                         tableAlignment: 'center',
//                         contentToolbar: [
//                             'tableColumn', 'tableRow', 'mergeTableCells',
//                             'tableProperties', 'tableCellProperties'
//                         ],
            
//                         tableProperties: {
//                           borderColors: customColorPalette,
//                           backgroundColors: customColorPalette
//                       },
          
//                       // Set the palettes for table cells.
//                       tableCellProperties: {
//                           borderColors: customColorPalette,
//                           backgroundColors: customColorPalette
//                       }

//                       }
//                     }}
//                     onReady={(editor) => {
//                       editor.ui.getEditableElement().parentElement.prepend(editor.ui.view.toolbar.element);
              
//                       editor.keystrokes.set( 'Tab', ( data, cancel ) => {
//                         editor.model.change(writer => {
//                           writer.insertText("            ", editor.model.document.selection.getFirstPosition() );
//                         });
//                         cancel();
//                       });
//                     }}
//                     onChange={(event, editor) => {
//                       const data = editor.getData();
//                       const documentImage = localStorage.getItem('@Gojur:documentImage');
//                       if (documentImage){
//                         setHtmlChangeData(true)
//                       }
                    
//                       setDocumentText(data);
//                     }}
//                   />
//                 </div>
//               </Editor>

//               <div style={{width:'100%', height:'50px'}}><></></div>

//               <div style={{float:'right', marginRight:'5%'}}>

              
//               </div>
//             </div>

//           </>
//         </Content>
//     </Container>
//   );

// };

// export default TestCkEditor;