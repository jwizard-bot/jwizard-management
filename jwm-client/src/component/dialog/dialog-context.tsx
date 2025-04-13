import * as React from 'react';
import { createContext, useContext, useState } from 'react';

type DialogContextType = {
  isOpen: boolean;
  setOpen: () => void;
  setClose: () => void;
};

const DialogContext = createContext<DialogContextType>({
  isOpen: false,
  setOpen: () => {},
  setClose: () => {},
});

type Props = {
  children: React.ReactNode;
};

const DialogProvider: React.FC<Props> = ({ children }): React.ReactElement => {
  const [isOpen, setIsOpen] = useState(false);

  const setOpen = (): void => setIsOpen(true);
  const setClose = (): void => setIsOpen(false);

  return (
    <DialogContext.Provider value={{ isOpen, setOpen, setClose }}>
      {children}
    </DialogContext.Provider>
  );
};

const useDialogContext = () => useContext(DialogContext);

export { DialogProvider, useDialogContext };
