import * as React from 'react';
import { FormProvider } from 'react-hook-form';
import { SafetyFormWrapper } from '@/component';
import { FormTextInput } from '@/component/input';
import { SectionDataSuspense } from '@/component/suspense';
import { useMultipleFormSubmissions } from '@/hook/use-multiple-form-submissions';
import {
  useSendTestEmailMutation,
  useUpdateAccountEmailMutation,
} from '@/redux/api/user-account/slice';
import { UpdateAccountEmailReqDto } from '@/redux/api/user-account/type';
import { Button } from '@mui/material';
import { useAccountEmailForm } from '../hook/use-account-email-form';

const AccountEmailForm: React.FC = (): React.ReactElement => {
  const [updateAccountEmail] = useUpdateAccountEmailMutation();
  const [sendTestEmail] = useSendTestEmailMutation();
  const [form, isFetching] = useAccountEmailForm();

  const [{ onUpdateEmail, onSendTestEmail }, isSubmitting] = useMultipleFormSubmissions<
    UpdateAccountEmailReqDto,
    'updateEmail' | 'sendTestEmail'
  >(form, {
    updateEmail: async (data: UpdateAccountEmailReqDto): Promise<void> => {
      await updateAccountEmail(data);
    },
    sendTestEmail: async (data: UpdateAccountEmailReqDto): Promise<void> => {
      if (data.email) {
        await sendTestEmail({ email: data.email });
      }
    },
  });

  const { handleSubmit } = form;

  if (!isFetching) {
    return <SectionDataSuspense />;
  }

  return (
    <SafetyFormWrapper
      component="form"
      onSubmit={handleSubmit(onUpdateEmail)}
      gap={1}
      display="flex"
      flexDirection="column">
      <FormProvider {...form}>
        <FormTextInput
          label="Account email"
          name="email"
          fieldProps={{
            variant: 'outlined',
          }}
        />
      </FormProvider>
      <Button variant="contained" fullWidth type="submit" loading={isSubmitting('updateEmail')}>
        Update account email
      </Button>
      <Button
        variant="outlined"
        type="button"
        loading={isSubmitting('sendTestEmail')}
        onClick={handleSubmit(onSendTestEmail)}>
        Send test email
      </Button>
    </SafetyFormWrapper>
  );
};

export { AccountEmailForm };
