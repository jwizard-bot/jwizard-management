import * as React from 'react';
import { ChangeDefaultPasswordForm, DialogProvider } from '@/component';

const ChangeDefaultPasswordPage: React.FC = (): React.ReactElement => (
  <DialogProvider>
    <ChangeDefaultPasswordForm />
  </DialogProvider>
);

export default ChangeDefaultPasswordPage;
