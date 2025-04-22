import * as React from 'react';
import { Navigate, useParams } from 'react-router';
import { SuspenseFallback } from '@/component/suspense';
import { ChangeForgotPasswordForm } from '@/features/forgot-password';
import { useValidateOtaTokenQuery } from '@/redux/api/forgot-password/slice';

const AuthChangeForgotPasswordPage: React.FC = (): React.ReactElement => {
  const { otaToken = '' } = useParams<{ otaToken: string }>();
  const { isLoading, isError } = useValidateOtaTokenQuery(otaToken);

  if (isLoading) {
    return <SuspenseFallback />;
  }

  if (isError) {
    return <Navigate to="/auth/request-forgot-password" replace />;
  }

  return <ChangeForgotPasswordForm otaToken={otaToken} />;
};

export default AuthChangeForgotPasswordPage;
