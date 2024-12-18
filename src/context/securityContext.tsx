import { IDefaultsProps } from 'pages/Printers/Interfaces/Common/ICommon';
import React, { createContext, useContext, useState } from 'react'
import api from 'services/api';
import { ISecurityPermissionsData, SecurityModule } from './Interfaces/ISecurity';

interface SecurityData {
  permissionsSecurity: ISecurityPermissionsData[]; 
  handleValidateSecurity(permissions: SecurityModule): Promise<ISecurityPermissionsData[]>;
}

const permissionsSecurityContext = createContext<SecurityData>({} as SecurityData);

const SecurityProvider: React.FC = ({ children }) => {

  const [permissionsSecurity, setPermissionSecurity] = useState<ISecurityPermissionsData[]>([]);
  const token = localStorage.getItem('@GoJur:token');

  const handleValidateSecurity = async (module:SecurityModule): Promise<ISecurityPermissionsData[]> => {
    
    // Get access code string -> by LocalStorage or Database
    const accessCode = await GetAccessCode()??""

    // Get permissions by module
    const permissions = permissionsByModule(module)?.trim().split(',')

    // Foreach on accessCode considerer permission passed by args
    permissions?.map((item) => {
      
      // verify if permission is allowed
      const allowPermission = (accessCode === "adm" || accessCode.includes(item))
      
      // if is permission allowed add to return list
      if (allowPermission){
        addPermission(item)
      }        

      return;
    })  

    setPermissionSecurity(permissionsSecurity)

    return permissionsSecurity;
  }

  // Our team have decide to keep accessCode on localStorage and force user to logout and login to get new privilegies
  // Sidney 04/03/2022
  const GetAccessCode =  async () => { 

    let accessCode = "";
    
    // Try to get access code from local localStorage
    // If someday is necessary to refresh accessCode on every call, commenda line below
    const accessCodeLocal = localStorage.getItem('@GoJur:accessCode')
    if (accessCodeLocal){
      accessCode = accessCodeLocal            
    }
    else {        
      const response = await api.post<IDefaultsProps>('/Defaults/GetAccessCode', { token });
      if (response.data) {
        // set accessCode value and refresh localStorage
        accessCode =  response.data.value;                      
        localStorage.setItem('@GoJur:accessCode', accessCode);  
      }
    }    
      
    return accessCode  
  }
  
  // Add permission name with allowed true or false
  function addPermission (name: string) {

    // avoid duplication
    const hasIncluded = permissionsSecurity.find(item => item.name ===  name)
    if (hasIncluded) return;

    // add to list new permission allowed
    permissionsSecurity.push({
      name
    })
  }  

  // Set permissions by module
  function permissionsByModule(module:SecurityModule) {
    
    // Customer Permissions access Codes
    if (module === SecurityModule.customer){
      return "CFGCHANE,CFGSFUNI,CFGSDASH,CSTMRG,CFGGRCST";
    }

    // Matter Permissions access Codes
    if (module === SecurityModule.matter){
      return "CFGMATPH,CFGLGNAT,CFGMATPB,CFGRIT,CFGMATSL,CFGMATST,CFGMEVTP,CFGCRDEP,CFGMDETP,CFGLGCAU,CFGCONTP,CFGCOURT,CFGPOSIT,CFGTPDOC";
    }

    // Calendar Permissions access Codes
    if (module === SecurityModule.calendar){
      return "CLDRPT,CLDISSUE";
    }

    // Publication Permissions access Codes
    if (module === SecurityModule.publication){
      return "PUBINTEL";
    }

    // Users Permissions access Codes
    if (module === SecurityModule.users){
      return "";
    }

    // Configuration Permissions access Codes
    if (module === SecurityModule.configuration){
      return "CFGLAW,CFGEMP,CFGOPP,CFGTHIRD,CFGGRTHD,CFGSTATE,CFGHOLID,CFGINDEC,CFGDCMIE,CACINFO,CACRPT,CACINFFI,CFGDCMEM,CFGDCMIE";
    }

    // Financial Permissions access Codes
    if (module === SecurityModule.financial){
      return "FINMAIN,FINCARCO,FINCATG,FINCCUST,FINACCO,FINPAYFO,CFGSERTP,FATFINST,FINRPT1,FINRPT2,FINRPT3,FINRPT4,FINRPT5,FATCTTO,FININTEG,FINBXPAG,FINCGINV";
    }
  }

  return ( 
    <permissionsSecurityContext.Provider
      value={{
        handleValidateSecurity,
        permissionsSecurity
      }}
    >
      {children}
    </permissionsSecurityContext.Provider>
  )
}

function useSecurity(): SecurityData {
  const context = useContext(permissionsSecurityContext);

  if (!context){
    throw new Error('nao foi possível carregar o context useMatter')
  }
  
  return context
}

export { SecurityProvider, useSecurity };