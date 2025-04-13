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
  onSubmit: () => void;
  children: React.ReactNode;
};

const ConfirmationDialog: React.FC<Props> = ({ title, children, onSubmit }): React.ReactElement => {
  const { isOpen, setClose } = useDialogContext();

  const setSubmit = (): void => {
    setClose();
    onSubmit();
  };

  return (
    <Dialog open={isOpen} onClose={setClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText> {children}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={setClose} autoFocus>
          Cancel
        </Button>
        <Button onClick={setSubmit}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};

export { ConfirmationDialog };
