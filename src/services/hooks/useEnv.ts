interface envProps {
  ApiBaseUrl: string;
  enviroment: string;
  redirectUrl: string;
  mainUrl: string;
  version: string;
}

const webConfig = (window as { [key: string]: any })['web.config'] as string;
const envProvider: envProps = Object(webConfig);

// save base URL API on local storage
if (envProvider.ApiBaseUrl != undefined) { 
  localStorage.setItem('@GoJur:ApiBaseURL', envProvider.ApiBaseUrl )
}

// save base URL redirect to localstorage
if (envProvider.redirectUrl != undefined) { 
  localStorage.setItem('@GoJur:UrlRedirect', envProvider.redirectUrl)
}

if (envProvider.mainUrl != undefined) { 
  localStorage.setItem('@GoJur:mainUrl', envProvider.mainUrl)
}

// get value saved in storade if is not possible take from web.config
if (envProvider.ApiBaseUrl === undefined){
  const baseUrlStorage = localStorage.getItem('@GoJur:ApiBaseURL')?.toString()
  if (baseUrlStorage){
    envProvider.ApiBaseUrl = baseUrlStorage;
  }
}

// get value saved in storade if is not possible take from web.config
if (envProvider.redirectUrl === undefined){
  const redirectUrlStorage = localStorage.getItem('@GoJur:UrlRedirect')?.toString()
  if (redirectUrlStorage){
    envProvider.redirectUrl = redirectUrlStorage;
  }
}

// get value saved in storade if is not possible take from web.config
if (envProvider.mainUrl === undefined){
  const mainUrlStorage = localStorage.getItem('@GoJur:mainUrl')?.toString()
  if (mainUrlStorage){
    envProvider.mainUrl = mainUrlStorage;
  }
}

console.log(envProvider)

export { envProvider };
