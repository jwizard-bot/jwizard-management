import * as React from 'react';
import { LoginForm, ValidateMfaForm, ValidateRecoveryMfaForm } from '@/component/login';
import { useMainSlice } from '@/redux/store/main-slice';

const LoginPage: React.FC = (): React.ReactElement => {
  const { requireMfa, mfaRecoveryMode } = useMainSlice();

  if (mfaRecoveryMode) {
    return <ValidateRecoveryMfaForm />;
  }

  if (requireMfa) {
    return <ValidateMfaForm />;
  }

  return <LoginForm />;
};

export default LoginPage;
