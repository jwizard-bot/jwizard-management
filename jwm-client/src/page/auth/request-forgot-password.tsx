import * as React from 'react';
import { RequestForgotPasswordForm, ValidateOtaTokenForm } from '@/features/forgot-password';
import { useMainSlice } from '@/redux/store/main-slice';

const AuthRequestForgotPasswordPage: React.FC = (): React.ReactElement => {
  const { requestForChangePassword } = useMainSlice();

  if (requestForChangePassword) {
    return <ValidateOtaTokenForm />;
  }

  return <RequestForgotPasswordForm />;
};

export default AuthRequestForgotPasswordPage;
