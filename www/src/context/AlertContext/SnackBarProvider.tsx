import React, { useState, useEffect, createContext, useContext } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { SnackBarType } from './SnackBarType';

const snackBarContext = createContext<SnackBarType>(null as unknown as SnackBarType);
interface SnackBarProviderProps {
  children: JSX.Element;
  timeout: number;
}

// export const snackBarContext = createContext<SnackBarType>({message: '', updateMessage: () => {}});
export const SnackBarProvider = ({
  children,
  timeout,
}: SnackBarProviderProps): JSX.Element => {
  const [message, setMessage] = useState('');
  const updateMessage = (m: string) => {
    setMessage(m);
    setOpen(true);
  };
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (message.length > 0 && open) {
      const timer = setTimeout(() => setOpen(false), timeout);
      return () => clearTimeout(timer);
    }
  });

  return (
    <snackBarContext.Provider value={{ open, message, updateMessage }}>
      {children}
      {message.length > 0 && (
        <Snackbar
          open={open}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          message={message}
        />
      )}
    </snackBarContext.Provider>
  );
};
// Hook for child components to get the snack object ...
// ... and re-render when it changes.
export const useSnacks = (): SnackBarType => useContext(snackBarContext);
