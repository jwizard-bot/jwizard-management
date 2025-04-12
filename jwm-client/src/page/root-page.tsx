import * as React from 'react';
import { useLogoutMutation } from '@/redux/api/slice/auth-api-slice';
import { Button } from '@mui/material';

const RootPage: React.FC = (): React.ReactElement => {
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async (): Promise<void> => {
    await logout();
  };

  return (
    <div>
      ROOT PAGE
      <Button onClick={handleLogout} loading={isLoading} variant="contained">
        LOGOUT
      </Button>
    </div>
  );
};

export default RootPage;
