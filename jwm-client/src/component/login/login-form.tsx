import * as React from 'react';
import { useEffect } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { AuthCardWrapper } from '@/component/auth-card-wrapper';
import { CaptchaChallenge } from '@/component/input/captcha-challenge';
import { FormTextInput } from '@/component/input/form-text-input';
import { ToggledPasswordFormInput } from '@/component/input/toggled-password-form-input';
import { useLoginMutation } from '@/redux/api/auth/slice';
import { LoginReqDto } from '@/redux/api/auth/type';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button } from '@mui/material';

const formSchema = Yup.object().shape({
  login: Yup.string().required('Login is required'),
  password: Yup.string().required('Password is required'),
  cfToken: Yup.string().required('Verification is required'),
});

const LoginForm: React.FC = (): React.ReactElement => {
  const [login, { isError }] = useLoginMutation();
  const form = useForm<LoginReqDto>({ resolver: yupResolver(formSchema) });

  const {
    resetField,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<LoginReqDto> = async data => {
    await login(data);
  };

  useEffect(() => {
    if (isError) {
      resetField('password');
    }
  }, [isError]);

  return (
    <AuthCardWrapper caption="Log in to system via username and password.">
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        gap={2}
        display="flex"
        flexDirection="column">
        <FormProvider {...form}>
          <FormTextInput
            label="Login"
            name="login"
            fieldProps={{
              variant: 'outlined',
            }}
          />
          <ToggledPasswordFormInput
            label="Password"
            name="password"
            fieldProps={{
              variant: 'outlined',
            }}
          />
          <CaptchaChallenge />
        </FormProvider>
        <Button variant="contained" fullWidth type="submit" loading={isSubmitting}>
          Log in
        </Button>
      </Box>
    </AuthCardWrapper>
  );
};

export { LoginForm };
