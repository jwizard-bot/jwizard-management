import * as React from 'react';
import { DialogProvider } from '@/component/dialog';
import { ChangeDefaultPasswordForm } from '@/features/change-default-password';

const ChangeDefaultPasswordPage: React.FC = (): React.ReactElement => (
  <DialogProvider>
    <ChangeDefaultPasswordForm />
  </DialogProvider>
);

export default ChangeDefaultPasswordPage;
