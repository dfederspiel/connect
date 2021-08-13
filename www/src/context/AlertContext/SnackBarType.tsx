export type SnackBarType = {
  open: boolean;
  message: string;
  updateMessage: (m: string) => void;
};
