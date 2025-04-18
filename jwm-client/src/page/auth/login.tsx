import * as React from 'react';
import { useCallback } from 'react';
import { SuspenseFallback } from '@/component/suspense';
import { LoginForm, ValidateMfaForm, ValidateRecoveryMfaForm } from '@/features/login';
import { useMainSlice } from '@/redux/store/main-slice';

const LoginPage: React.FC = (): React.ReactElement => {
  const { requireMfa, mfaRecoveryMode, csrf } = useMainSlice();

  const renderSection = useCallback(
    (Section: React.ComponentType) => (!csrf ? <SuspenseFallback /> : <Section />),
    [csrf]
  );

  if (mfaRecoveryMode) {
    return renderSection(ValidateRecoveryMfaForm);
  }

  if (requireMfa) {
    return renderSection(ValidateMfaForm);
  }

  return <LoginForm />;
};

export default LoginPage;
