import * as React from 'react';
import { useEffect } from 'react';
import { FormProvider, SubmitHandler } from 'react-hook-form';
import { AuthCardWrapper } from '@/component/auth/auth-card-wrapper';
import { CaptchaChallenge } from '@/component/input/captcha-challenge';
import { FormTextInput } from '@/component/input/form-text-input';
import { ToggledPasswordFormInput } from '@/component/input/toggled-password-form-input';
import { useLoginMutation } from '@/redux/api/auth/slice';
import { LoginReqDto } from '@/redux/api/auth/type';
import { Box, Button } from '@mui/material';
import { useLoginForm } from '../hook/use-login-form';

const LoginForm: React.FC = (): React.ReactElement => {
  const [login, { isError }] = useLoginMutation();
  const form = useLoginForm();

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
