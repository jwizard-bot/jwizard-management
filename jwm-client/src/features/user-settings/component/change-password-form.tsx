import * as React from 'react';
import { FormProvider, SubmitHandler } from 'react-hook-form';
import { SafetyFormWrapper } from '@/component';
import { ToggledPasswordFormInput } from '@/component/input';
import { useChangePasswordMutation } from '@/redux/api/user-account/slice';
import { ChangePasswordReqDto } from '@/redux/api/user-account/type';
import { Button } from '@mui/material';
import { useChangePasswordForm } from '../hook/use-change-password-form';

const ChangePasswordForm: React.FC = (): React.ReactElement => {
  const [changePassword, { isError }] = useChangePasswordMutation();
  const form = useChangePasswordForm(isError);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<ChangePasswordReqDto> = async data => {
    await changePassword(data);
  };

  return (
    <SafetyFormWrapper
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      gap={1}
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
      </FormProvider>
      <Button variant="contained" fullWidth type="submit" loading={isSubmitting}>
        Change password
      </Button>
    </SafetyFormWrapper>
  );
};

export { ChangePasswordForm };
