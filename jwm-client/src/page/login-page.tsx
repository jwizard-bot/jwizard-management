import * as React from 'react';
import { LoginForm, ValidateMfaForm } from '@/component/login';
import { useMainSlice } from '@/redux/store/main-slice';

const LoginPage: React.FC = (): React.ReactElement => {
  const { requireMfa } = useMainSlice();

  if (requireMfa) {
    return <ValidateMfaForm />;
  }

  return <LoginForm />;
};

export default LoginPage;
