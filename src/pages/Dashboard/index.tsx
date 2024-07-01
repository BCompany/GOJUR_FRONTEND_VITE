import React, { useEffect } from 'react';
import Sidebar from 'components/Sidebar';
import { useDefaultSettings } from 'context/defaultSettings';
import { GetPermissionsUser } from 'Shared/utils/commonFunctions';
import MainViewContent from './MainViewContent';
import { Container } from './styles';

// drag ang drop
const Dashboard: React.FC = () => {
  
  const {handleUserPermission} = useDefaultSettings();

  // call function get permissions by user to allow buttons on Side Bar
  useEffect(() => {
   
    // handlePermissions()

  },[])

  // Get permissions and set on context global
  const handlePermissions = async () => {
    const permissionsUser = await GetPermissionsUser();
    handleUserPermission(permissionsUser);
  }
  
  return (
    <Container>
      <Sidebar />
      <MainViewContent />
    </Container>
  );
  
};

export default Dashboard;
