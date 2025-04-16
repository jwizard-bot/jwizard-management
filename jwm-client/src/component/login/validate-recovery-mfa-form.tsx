import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { GenericMfaForm } from '@/component/login/generic-mfa-form';
import { useValidateRecoveryMfaMutation } from '@/redux/api/auth/slice';
import { yupResolver } from '@hookform/resolvers/yup';

type ValidateRecoveryMfaFormType = {
  mfaRecoveryCode: string;
};

const formSchema = Yup.object().shape({
  mfaRecoveryCode: Yup.string().required('MFA recovery code is required'),
});

const ValidateRecoveryMfaForm: React.FC = (): React.ReactElement => {
  const [validateRecoveryMfa, { isError }] = useValidateRecoveryMfaMutation();
  const form = useForm<ValidateRecoveryMfaFormType>({ resolver: yupResolver(formSchema) });

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
