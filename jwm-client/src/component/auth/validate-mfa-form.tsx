import * as React from 'react';
import { useEffect } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { AuthCardWrapper } from '@/component/auth/auth-card-wrapper';
import { ToggledPasswordFormInput } from '@/component/input/toggled-password-form-input';
import { useCancelMfaMutation, useValidateMfaMutation } from '@/redux/api/auth/slice';
import { ValidateMfaReqDto } from '@/redux/api/auth/type';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button } from '@mui/material';

const formSchema = Yup.object().shape({
  mfaCode: Yup.string().required('MFA code is required'),
});

const ValidateMfaForm: React.FC = (): React.ReactElement => {
  const [validateMfa, { isError }] = useValidateMfaMutation();
  const [cancelMfa] = useCancelMfaMutation();
  const form = useForm<ValidateMfaReqDto>({ resolver: yupResolver(formSchema) });

  const {
    resetField,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<ValidateMfaReqDto> = async data => {
    await validateMfa(data);
  };

  const onCancel = async (): Promise<void> => {
    await cancelMfa();
  };

  useEffect(() => {
    if (isError) {
      resetField('mfaCode');
    }
  }, [isError]);

  return (
    <AuthCardWrapper caption="Your acccount has MFA protection. Pass MFA token from authenticator app.">
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        gap={2}
        display="flex"
        flexDirection="column">
        <FormProvider {...form}>
          <ToggledPasswordFormInput
            label="MFA code"
            name="mfaCode"
            fieldProps={{
              variant: 'outlined',
            }}
          />
        </FormProvider>
        <Button variant="contained" fullWidth type="submit" loading={isSubmitting}>
          Check MFA and log in
        </Button>
        <Button variant="outlined" fullWidth onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </AuthCardWrapper>
  );
};

export { ValidateMfaForm };
