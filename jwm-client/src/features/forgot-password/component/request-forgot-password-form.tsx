import * as React from 'react';
import { FormProvider, SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { SystemAlert } from '@/component';
import { AuthCardWrapper } from '@/component/auth';
import { CaptchaChallenge, FormTextInput } from '@/component/input';
import { useSendForgotPasswordRequestMutation } from '@/redux/api/forgot-password/slice';
import { RequestForgotPasswordReqDto } from '@/redux/api/forgot-password/type';
import { setRequestForChangePassword } from '@/redux/store/main-slice';
import { Box, Button, Link } from '@mui/material';
import { useRequestForgotPasswordForm } from '../hook/use-request-forgot-password-form';

const RequestForgotPasswordForm: React.FC = (): React.ReactElement => {
  const [sendForgotPasswordRequest] = useSendForgotPasswordRequestMutation();
  const form = useRequestForgotPasswordForm();
  const dispatch = useDispatch();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<RequestForgotPasswordReqDto> = async (data): Promise<void> => {
    await sendForgotPasswordRequest(data);
  };

  return (
    <AuthCardWrapper caption="Send request for change forgotten password of your account.">
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        gap={2}
        display="flex"
        flexDirection="column">
        <SystemAlert severity="info">
          This method only works, if your account has assigned email address.
        </SystemAlert>
        <FormProvider {...form}>
          <FormTextInput
            label="Login"
            name="login"
            fieldProps={{
              variant: 'outlined',
            }}
          />
          <CaptchaChallenge />
        </FormProvider>
        <Button variant="contained" fullWidth type="submit" loading={isSubmitting}>
          Send request
        </Button>
        <Link
          component="button"
          type="button"
          onClick={() => dispatch(setRequestForChangePassword(true))}
          alignSelf="center">
          Validate OTA token
        </Link>
      </Box>
    </AuthCardWrapper>
  );
};

export { RequestForgotPasswordForm };
