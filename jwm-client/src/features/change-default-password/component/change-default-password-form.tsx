import * as React from 'react';
import { useEffect } from 'react';
import { FormProvider, SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { AuthCardWrapper } from '@/component/auth';
import { ConfirmationDialog, useDialogContext } from '@/component/dialog';
import { CaptchaChallenge, ToggledPasswordFormInput } from '@/component/input';
import { useChangeDefaultPasswordMutation } from '@/redux/api/auth/slice';
import { ChangeDefaultPasswordReqDto } from '@/redux/api/auth/type';
import { setSkippedChangeDefaultPassword } from '@/redux/store/main-slice';
import { Box, Button } from '@mui/material';
import { useChangeDefaultPasswordForm } from '../hook/use-change-default-password-form';

const ChangeDefaultPasswordForm: React.FC = (): React.ReactElement => {
  const [changeDefaultPassword, { isError }] = useChangeDefaultPasswordMutation();
  const { setOpen } = useDialogContext();
  const dispatch = useDispatch();
  const form = useChangeDefaultPasswordForm();

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
      <ConfirmationDialog
        title="Skipping change default password"
        onSubmit={async (): Promise<void> => {
          dispatch(setSkippedChangeDefaultPassword(true));
        }}>
        Are you sure to skip change default account password? Password can also might be changed at
        your account settings.
      </ConfirmationDialog>
    </AuthCardWrapper>
  );
};

export { ChangeDefaultPasswordForm };
