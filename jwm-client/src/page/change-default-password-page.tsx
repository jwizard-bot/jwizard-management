import * as React from 'react';
import { DialogProvider } from '@/component';
import { ChangeDefaultPasswordForm } from '@/component/change-default-password';

const ChangeDefaultPasswordPage: React.FC = (): React.ReactElement => (
  <DialogProvider>
    <ChangeDefaultPasswordForm />
  </DialogProvider>
);

export default ChangeDefaultPasswordPage;
