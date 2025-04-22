import * as React from 'react';
import { FormProvider, SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthCardWrapper } from '@/component/auth';
import { ToggledPasswordFormInput } from '@/component/input';
import { useCheckOtaTokenMutation } from '@/redux/api/forgot-password/slice';
import { setRequestForChangePassword } from '@/redux/store/main-slice';
import { Box, Button, Link } from '@mui/material';
import {
  ValidateOtaTokenFormType,
  useValidateOtaTokenForm,
} from '../hook/use-validate-ota-token-form';

const ValidateOtaTokenForm: React.FC = (): React.ReactElement => {
  const [checkOtaToken, { isError }] = useCheckOtaTokenMutation();
  const form = useValidateOtaTokenForm(isError);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<ValidateOtaTokenFormType> = async (data): Promise<void> => {
    const { error } = await checkOtaToken(data.otaToken);
    if (!error) {
      navigate(`/auth/change-forgot-password/${data.otaToken}`);
    }
  };

  return (
    <AuthCardWrapper caption="Click link in email message or paste OTA token here.">
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        gap={2}
        display="flex"
        flexDirection="column">
        <FormProvider {...form}>
          <ToggledPasswordFormInput
            label="OTA token"
            name="otaToken"
            fieldProps={{
              variant: 'outlined',
            }}
          />
        </FormProvider>
        <Button variant="contained" fullWidth type="submit" loading={isSubmitting}>
          Validate OTA token
        </Button>
        <Link
          component="button"
          type="button"
          onClick={() => dispatch(setRequestForChangePassword(false))}
          alignSelf="center">
          Return to request forgot password page
        </Link>
      </Box>
    </AuthCardWrapper>
  );
};

export { ValidateOtaTokenForm };
