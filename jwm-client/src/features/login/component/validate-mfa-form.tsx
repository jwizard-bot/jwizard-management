import * as React from 'react';
import { FormProvider } from 'react-hook-form';
import { useValidateMfaMutation } from '@/redux/api/auth/slice';
import { GenericMfaForm } from '../component/generic-mfa-form';
import { useValidateMfaForm } from '../hook/use-validate-mfa-form';

const ValidateMfaForm: React.FC = (): React.ReactElement => {
  const [validateMfa, { isError }] = useValidateMfaMutation();
  const form = useValidateMfaForm(isError);

  return (
    <FormProvider {...form}>
      <GenericMfaForm
        caption="Your acccount has MFA protection. Pass MFA token from selected MFA token source."
        label="MFA code"
        controlName="mfaCode"
        isError={isError}
        linkContent="I cannot have access to these code"
        submitContent="Check MFA and log in"
        mfaRecoveryMode={true}
        onSubmitCallback={async ({ mfaCode }) => {
          await validateMfa(mfaCode);
        }}
      />
    </FormProvider>
  );
};

export { ValidateMfaForm };
