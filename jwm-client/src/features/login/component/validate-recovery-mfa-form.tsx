import * as React from 'react';
import { FormProvider } from 'react-hook-form';
import { useValidateRecoveryMfaMutation } from '@/redux/api/auth/slice';
import { GenericMfaForm } from '../component/generic-mfa-form';
import { useValidateRecoveryMfaForm } from '../hook/use-validate-recovery-mfa-form';

const ValidateRecoveryMfaForm: React.FC = (): React.ReactElement => {
  const [validateRecoveryMfa, { isError }] = useValidateRecoveryMfaMutation();
  const form = useValidateRecoveryMfaForm();

  return (
    <FormProvider {...form}>
      <GenericMfaForm
        caption="If you do not have access to 2FA authenticator provider, insert one of the recovery codes."
        label="MFA recovery code"
        controlName="mfaRecoveryCode"
        isError={isError}
        linkContent="Return to MFA code form"
        submitContent="Check MFA recovery code and log in"
        mfaRecoveryMode={false}
        onSubmitCallback={async ({ mfaRecoveryCode }) => {
          await validateRecoveryMfa(mfaRecoveryCode);
        }}
      />
    </FormProvider>
  );
};

export { ValidateRecoveryMfaForm };
