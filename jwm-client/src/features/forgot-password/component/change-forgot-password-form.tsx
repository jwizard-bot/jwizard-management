import * as React from 'react';
import { FormProvider, SubmitHandler } from 'react-hook-form';
import { Link as RouterLink } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { AuthCardWrapper } from '@/component/auth';
import { ToggledPasswordFormInput } from '@/component/input';
import { useChangeForgotPasswordMutation } from '@/redux/api/forgot-password/slice';
import { Box, Button, Link } from '@mui/material';
import {
  ChangeForgotPasswordFormType,
  useChangeForgotPasswordForm,
} from '../hook/use-change-forgot-password-form';

type Props = {
  otaToken: string;
};

const ChangeForgotPasswordForm: React.FC<Props> = ({ otaToken }): React.ReactElement => {
  const [changeForgottenPassword] = useChangeForgotPasswordMutation();
  const form = useChangeForgotPasswordForm();
  const navigate = useNavigate();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<ChangeForgotPasswordFormType> = async (data): Promise<void> => {
    const { error } = await changeForgottenPassword({ ...data, otaToken });
    if (!error) {
      navigate('/auth/login/');
    }
  };

  return (
    <AuthCardWrapper caption="Change forgotten password for your account.">
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        gap={2}
        display="flex"
        flexDirection="column">
        <FormProvider {...form}>
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
        <Link component={RouterLink} to="/auth/request-forgot-password" alignSelf="center">
          Return to validate OTA token page
        </Link>
      </Box>
    </AuthCardWrapper>
  );
};

export { ChangeForgotPasswordForm };
