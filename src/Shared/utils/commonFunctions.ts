/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */
import { useCallback, useEffect } from "react";
import api from "services/api";
import { format } from "date-fns";
import { IDefaultsProps } from "pages/Printers/Interfaces/Common/ICommon";
import { AmazonS3Params } from "./interfaces";

let amazonURL = "";
const token = localStorage.getItem("@GoJur:token");

// Amazon S3 Post function
export async function AmazonPost(
  referenceId: number,
  file: any,
  amazonRoot: string,
  fileName = ""
) {
  // Get credentials amazon S3 from server to request upload
  const credentials = await GetCredentialsAmazonS3(
    referenceId,
    file,
    amazonRoot
  );

  // Send file using formData upload request
  const response = await api.post(amazonURL, credentials, {});

  return response;
}

// Get credencials Amazon S3 Post function
async function GetCredentialsAmazonS3(
  referenceId: number,
  file: any,
  amazonRoot: string
) {
  // remove special characters from file name
  const fileName = FormatFileName(file.name);

  const response = await api.post<AmazonS3Params>(
    "/AmazonS3/ObterCredenciaisS3",
    {
      referenceId,
      amazonRoot,
      fileName,
      fileType: file.type,
      token: localStorage.getItem("@GoJur:token"),
    }
  );

  const bodyFormData = new FormData();

  bodyFormData.append("key", response.data.amazonKey);
  bodyFormData.append("acl", response.data.amazonAcl);
  bodyFormData.append("success_action_status", response.data.amazonStatus);
  bodyFormData.append("policy", response.data.amazonPolicy);
  bodyFormData.append("x-amz-algorithm", response.data.amazonAlgoritm);
  bodyFormData.append("x-amz-credential", response.data.amazonCredential);
  bodyFormData.append("x-amz-signature", response.data.amazonSignature);
  bodyFormData.append("Content-Type", response.data.amazonContentType);
  bodyFormData.append("x-amz-date", response.data.amazonDate);
  bodyFormData.append("x-amz-meta-filename", fileName);
  bodyFormData.append("file", file);

  amazonURL = response.data.amazonURL;

  return bodyFormData;
}

// format to currency
export const FormatCurrency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

// format string to date
export const FormatDate = (date: Date, formatString = "dd/MM/yyyy") => {
  return format(date, formatString);
};

export const FormatFileName = (fileName: string, toLower = true) => {
  // '[' and ']' are special char and a reservad char used by regex, so we can't add this character on scape rules
  // to avoid it, ®1 represents [ and ®2 represents ] on the string
  fileName = fileName.replaceAll("[", "®1").replaceAll("]", "®2");

  // Execute Regex to remove all character special and keep only scapes Pt-Br as defined below
  fileName = fileName.replace(
    /[^a-zA-Z0-9 .()~çãõîiéáóúñõêäôâüéâäàåíïîìôúûñý+?&¨®_,*ÄÁÀÂÊÔÛÎÇÃÉÁÓÚÍÑÕÔÇÑÊËÈÍÎÏÚÛÙÝÑÛ^-{}`´$<>+®|:;#%@'-/!+.º]/g,
    ""
  );

  // replace '®' for '[' or ']' if exists on file name string
  fileName = fileName.replaceAll("®1", "[").replaceAll("®2", "]");

  // when is true (default) turn string as lower
  if (toLower) fileName = fileName.toLowerCase();

  return fileName;
};

// Validate dates
export const ValidateDates = (startDate: string, endDate: string) => {
  try {
    format(new Date(startDate), "yyyy-MM-dd");
    format(new Date(endDate), "yyyy-MM-dd");

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

// Verify free plan to block access in some features of Gojur
// DeadLine calculation | Legal calculation
export const VerifyCompanyPlanAccess = async (forceBlock = false) => {
  try {
    const response = await api.get<string>("PlanoComercial/ValidarAcesso", {
      params: {
        token: localStorage.getItem("@GoJur:token"),
        alwaysBlockWhenFree: forceBlock,
      },
    });

    return response.data;
  } catch (err: any) {
    return "error";
  }
};

export const currencyConfig = {
  locale: "pt-BR",
  formats: {
    number: {
      BRL: {
        // style: "currency",   // remove to now show R$
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    },
  },
};

export function ConvertDayOfWeekToPtBr(dayOfWeek: string, complete = false) {
  if (dayOfWeek.toLowerCase() === "monday" || dayOfWeek.toLowerCase() === "mon")
    return !complete ? "Seg" : "Segunda-Feira";

  if (
    dayOfWeek.toLowerCase() === "tuesday" ||
    dayOfWeek.toLowerCase() === "tue"
  )
    return !complete ? "Ter" : "Terça-Feira";

  if (
    dayOfWeek.toLowerCase() === "wednesday" ||
    dayOfWeek.toLowerCase() === "wed"
  )
    return !complete ? "Qua" : "Quarta-Feira";

  if (
    dayOfWeek.toLowerCase() === "thursday" ||
    dayOfWeek.toLowerCase() === "thu"
  )
    return !complete ? "Qui" : "Quinta-Feira";

  if (dayOfWeek.toLowerCase() === "friday" || dayOfWeek.toLowerCase() === "fri")
    return !complete ? "Sex" : "Sexta-Feira";

  if (
    dayOfWeek.toLowerCase() === "saturday" ||
    dayOfWeek.toLowerCase() === "sat"
  )
    return !complete ? "Sab" : "Sábado-Feira";

  if (dayOfWeek.toLowerCase() === "sunday" || dayOfWeek.toLowerCase() === "sun")
    return !complete ? "Dom" : "Domingo-Feira";
}

export function ConvertMonthToPtBr(month: number, complete = false) {
  if (month === 1) return !complete ? "Jan" : "Janeiro";

  if (month === 2) return !complete ? "Fev" : "Fevereiro";

  if (month === 3) return !complete ? "Mar" : "Março";

  if (month === 4) return !complete ? "Abr" : "Abril";

  if (month === 5) return !complete ? "Mai" : "Maio";

  if (month === 6) return !complete ? "Jun" : "Junho";

  if (month === 7) return !complete ? "Jul" : "Julho";

  if (month === 8) return !complete ? "Ago" : "Agosto";

  if (month === 9) return !complete ? "Set" : "Setembro";

  if (month === 10) return !complete ? "Out" : "Outubro";

  if (month === 11) return !complete ? "Nov" : "Novembro";

  if (month === 12) return !complete ? "Dez" : "Dezembro";
}

export function ConvertMonthToPtBr2(month: string, complete = false) {
  if (month === "Jan") return !complete ? "Jan" : "Janeiro";

  if (month === "Feb") return !complete ? "Fev" : "Fevereiro";

  if (month === "Mar") return !complete ? "Mar" : "Março";

  if (month === "Apr") return !complete ? "Abr" : "Abril";

  if (month === "May") return !complete ? "Mai" : "Maio";

  if (month === "Jun") return !complete ? "Jun" : "Junho";

  if (month === "Jul") return !complete ? "Jul" : "Julho";

  if (month === "Aug") return !complete ? "Ago" : "Agosto";

  if (month === "Sep") return !complete ? "Set" : "Setembro";

  if (month === "Oct") return !complete ? "Out" : "Outubro";

  if (month === "Nov") return !complete ? "Nov" : "Novembro";

  if (month === "Dec") return !complete ? "Dez" : "Dezembro";
}

// remove all special characters
export function RemoveSpecialCharacters(text: string) {
  return text?.replaceAll("(", "").replaceAll(")", "").replaceAll("/", "");
}

// format field global
export function formatField(
  value: string,
  type: "rg" | "cpf" | "cnpj" | "cep" | "pis"
) {
  if (type === "rg") {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d{3})(\d{3})(\d{1})$/, "$1.$2.$3-$4");
  }
  if (type === "cpf") {
    return value
      .replace(/\D+/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  }
  if (type === "cnpj") {
    return value
      .replace(/\D+/g, "")
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  }
  if (type === "cep") {
    return value
      .replace(/\D+/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{3})\d+?$/, "$1");
  }
  if (type === "pis") {
    return value
      .replace(/\D+/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{5})(\d)/, "$1.$2")
      .replace(/(\d{5}\.)(\d{2})(\d)/, "$1$2-$3")
      .replace(/(-\d)\d+?$/, "$1");
  }
  return;
}

export const isValidCPF = (cpf: any) => {
  if (cpf === null) return false;
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf === "" || cpf == null) return false;
  // Elimina CPFs invalidos conhecidos
  if (
    cpf.length !== 11 ||
    cpf === "00000000000" ||
    cpf === "11111111111" ||
    cpf === "22222222222" ||
    cpf === "33333333333" ||
    cpf === "44444444444" ||
    cpf === "55555555555" ||
    cpf === "66666666666" ||
    cpf === "77777777777" ||
    cpf === "88888888888" ||
    cpf === "99999999999"
  )
    return false;
  // Valida 1o digito
  let add = 0;
  for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i), 10) * (10 - i);
  let rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(9), 10)) return false;
  // Valida 2o digito
  add = 0;
  for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i), 10) * (11 - i);
  rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(10), 10)) return false;
  return true;
};

export const isValidCNPJ = (cnpj: any) => {
  if (cnpj === null) return false;
  cnpj = cnpj.replace(/[^\d]+/g, "");

  if (cnpj === "") return false;

  if (cnpj.length !== 14) return false;

  // Elimina CNPJs invalidos conhecidos
  if (
    cnpj === "00000000000000" ||
    cnpj === "11111111111111" ||
    cnpj === "22222222222222" ||
    cnpj === "33333333333333" ||
    cnpj === "44444444444444" ||
    cnpj === "55555555555555" ||
    cnpj === "66666666666666" ||
    cnpj === "77777777777777" ||
    cnpj === "88888888888888" ||
    cnpj === "99999999999999"
  )
    return false;

  // Valida DVs
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0), 10)) return false;

  const teste = tamanho;
  tamanho = teste + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1), 10)) return false;

  return true;
};

// style default for react select
export const selectStyles = {
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isFocused ? "#d0e7fd" : null,
      color: "#333333",
    };
  },
};

// Used to perform react-select when is necessary use delay
// We start using this package in customer module, but now this will be our pattern auto-select
// Sidney 10/08
export const useDelay = (effect, dependencies, delay) => {
  // store the provided effect in a `useCallback` hook to avoid having the callback function execute on each render
  const callback = useCallback(effect, dependencies);

  // wrap our callback function in a `setTimeout` function and clear the tim out when completed
  useEffect(() => {
    const timeout = setTimeout(callback, delay);
    return () => clearTimeout(timeout);
  }, [callback, delay]);
};

export const GetPermissionsUser = async (): Promise<string[]> => {
  try {
    // get defaults list
    const response = await api.post<IDefaultsProps[]>("/Defaults/Listar", {
      token,
    });

    // get permission user module
    const userPermissions = response.data.filter(
      (item) => item.id === "defaultModulePermissions"
    );
    return userPermissions[0].value.split("|");
  } catch (error: any) {
    console.log(error);
  }

  return [];
};

export const ValidateAuthenticationError = (err: any) => {
  const error = err.response.data;

  // Code 1002 -> Invalid Token - Redirect to Login Page
  if (error.statusCode === 1002) {
    SignOut();
  }
};


function SignOut() {
  localStorage.removeItem("@GoJur:token");
  window.location.reload();
}

export const customStyles = {
  menu: (provided) => ({
    ...provided,
    zIndex: 999999,
    backgroundColor: 'white',
    color: 'black',
    fontSize: '12px'
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: 'white',
    color: 'black',
    '&:hover': {
      backgroundColor: '#d4e4fc',
    },
  }),
  control: (provided) => ({
    ...provided,
    borderColor: 'gray',
    '&:hover': {
      borderColor: 'darkgray',
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'black',
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 999999999,
  }),
};

