import * as React from 'react';
import { useEffect } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useDialogContext } from '@/component';
import { AuthCardWrapper } from '@/component/auth/auth-card-wrapper';
import { ConfirmationDialog } from '@/component/dialog/confirmation-dialog';
import { CaptchaChallenge } from '@/component/input/captcha-challenge';
import { ToggledPasswordFormInput } from '@/component/input/toggled-password-form-input';
import { useChangeDefaultPasswordMutation } from '@/redux/api/auth/slice';
import { ChangeDefaultPasswordReqDto } from '@/redux/api/auth/type';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button } from '@mui/material';

const formSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Old password is required'),
  newPassword: Yup.string()
    .required('New password is required')
    .min(10, 'Password must be at least 10 characters long')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*]/, 'Password must contain at least one special character'),
  confirmedNewPassword: Yup.string()
    .required('Confirmed new password is required')
    .oneOf([Yup.ref('newPassword')], 'Passwords do not match'),
  cfToken: Yup.string().required('Verification is required'),
});

const ChangeDefaultPasswordForm: React.FC = (): React.ReactElement => {
  const [changeDefaultPassword, { isError }] = useChangeDefaultPasswordMutation();
  const { setOpen } = useDialogContext();
  const navigate = useNavigate();
  const form = useForm<ChangeDefaultPasswordReqDto>({ resolver: yupResolver(formSchema) });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<ChangeDefaultPasswordReqDto> = async data => {
    await changeDefaultPassword(data);
  };

  useEffect(() => {
    if (isError) {
      reset();
    }
  }, [isError]);

  return (
    <AuthCardWrapper caption="Change your default account password (or skip and go to dashbord page).">
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        gap={2}
        display="flex"
        flexDirection="column">
        <FormProvider {...form}>
          <ToggledPasswordFormInput
            label="Old password"
            name="oldPassword"
            fieldProps={{
              variant: 'outlined',
            }}
          />
          <ToggledPasswordFormInput
            label="New password"
            name="newPassword"
            fieldProps={{
              variant: 'outlined',
            }}
          />
          <ToggledPasswordFormInput
            label="Confirmed new password"
            name="confirmedNewPassword"
            fieldProps={{
              variant: 'outlined',
            }}
          />
          <CaptchaChallenge />
        </FormProvider>
        <Button variant="contained" fullWidth type="submit" loading={isSubmitting}>
          Change default password
        </Button>
        <Button variant="outlined" fullWidth onClick={setOpen}>
          Skip and go to dashboard
        </Button>
      </Box>
      <ConfirmationDialog title="Skipping change default password" onSubmit={() => navigate('/')}>
        Are you sure to skip change default account password? Password can also might be changed at
        your account settings.
      </ConfirmationDialog>
    </AuthCardWrapper>
  );
};

export { ChangeDefaultPasswordForm };
