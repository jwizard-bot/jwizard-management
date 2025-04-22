import * as React from 'react';
import { LoginForm, ValidateMfaForm, ValidateRecoveryMfaForm } from '@/features/login';
import { useLazyRenderSection } from '@/hook/use-lazy-render-section';
import { useMainSlice } from '@/redux/store/main-slice';

const AuthLoginPage: React.FC = (): React.ReactElement => {
  const { requireMfa, mfaRecoveryMode, csrf } = useMainSlice();
  const renderer = useLazyRenderSection(!!csrf);

  if (mfaRecoveryMode) {
    return renderer(ValidateRecoveryMfaForm);
  }

  if (requireMfa) {
    return renderer(ValidateMfaForm);
  }

  return <LoginForm />;
};

export default AuthLoginPage;
