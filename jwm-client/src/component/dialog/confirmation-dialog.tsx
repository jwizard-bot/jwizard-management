import * as React from 'react';
import { useDialogContext } from '@/component/dialog/dialog-context';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

type Props = {
  title: string;
  onSubmit: () => Promise<void>;
  loading?: boolean;
  confirmationText?: string;
  children: React.ReactNode;
};

const ConfirmationDialog: React.FC<Props> = ({
  title,
  onSubmit,
  loading = false,
  confirmationText = 'Confirm',
  children,
}): React.ReactElement => {
  const { isOpen, setClose } = useDialogContext();

  const setSubmit = async (): Promise<void> => {
    await onSubmit();
    setClose();
  };

  return (
    <Dialog open={isOpen} onClose={setClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{children}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={setClose} autoFocus>
          Cancel
        </Button>
        <Button loading={loading} onClick={setSubmit}>
          {confirmationText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { ConfirmationDialog };
