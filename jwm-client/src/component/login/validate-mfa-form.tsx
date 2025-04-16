import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { GenericMfaForm } from '@/component/login/generic-mfa-form';
import { useValidateMfaMutation } from '@/redux/api/auth/slice';
import { yupResolver } from '@hookform/resolvers/yup';

type ValidateMfaFormType = {
  mfaCode: string;
};

const formSchema = Yup.object().shape({
  mfaCode: Yup.string().required('MFA code is required'),
});

const ValidateMfaForm: React.FC = (): React.ReactElement => {
  const [validateMfa, { isError }] = useValidateMfaMutation();
  const form = useForm<ValidateMfaFormType>({ resolver: yupResolver(formSchema) });

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
