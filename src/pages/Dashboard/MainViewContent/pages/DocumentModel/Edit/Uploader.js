import { envProvider } from 'services/hooks/useEnv';
import { useModal } from 'context/modal';

// Custom uploader adapter get from official site CKEditor
// https://ckeditor.com/docs/ckeditor5/latest/framework/guides/deep-dive/upload-adapter.html#the-complete-implementation
// Sidney 07/04/2022

export default class Uploader {

  // LOAD CONSTRUCTOR
  constructor( loader ) {
      this.loader = loader;
  }

  // CONFIGURE UPLOAD PROCESS
  upload() {
      return this.loader.file
          .then( file => new Promise( ( resolve, reject ) => {
              this._initRequest();
              this._initListeners( resolve, reject, file );
              this._sendRequest( file );
          } ) );
  }

  // ERROR ABORT
  abort() {
      if ( this.xhr ) {
          this.xhr.abort();
      }
  }

  // INIT REQUEST TO ENDPOINT BASE URL
  _initRequest() {
        const xhr = this.xhr = new XMLHttpRequest();
        
        const baseURL = envProvider.ApiBaseUrl
        xhr.open( 'POST', baseURL + "/Arquivos/UploadDocumentImage/", true );
        xhr.responseType = 'json';
  }

  // LISTENERS FOR CURRENT UPLOAD
  _initListeners( resolve, reject, file ) {
      const xhr = this.xhr;
      const loader = this.loader;
      const genericErrorText = `Couldn't upload file: ${ file.name }.`;

      xhr.addEventListener( 'error', () => reject( genericErrorText ) );
      xhr.addEventListener( 'abort', () => reject() );
      xhr.addEventListener( 'load', () => {

          const response = xhr.response;

          // save amazon S3 path
          localStorage.setItem('@Gojur:documentImage', response)

          if ( !response || response.error ) {
              return reject( response && response.error ? response.error.message : genericErrorText );
          }

          resolve({
              default: response.url
          });
      } );

      // PROGRESS UPLOAD 
      if ( xhr.upload ) {
          xhr.upload.addEventListener( 'progress', evt => {
              if ( evt.lengthComputable ) {
                  loader.uploadTotal = evt.total;
                  loader.uploaded = evt.loaded;
              }
          } );
      }
  }

  // SEND REQUEST - GOJUR API
  _sendRequest( file ) {
      const data = new FormData();
      
      const token = localStorage.getItem('@GoJur:token');

      data.append('upload', file )
      data.append('token',  token)  

      this.xhr.send(data);
  }
}