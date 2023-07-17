import { Button, Typography } from '@mui/material';
import { useAuth } from '../context/AuthenticationContext';

const User = (): JSX.Element => {
  const auth = useAuth();

  return (
    <>
      <Typography>
        {auth.user}
        {!auth.user && (
          <Button
            onClick={() => {
              auth.login();
            }}
          >
            Login
          </Button>
        )}
        {auth.user && (
          <Button
            onClick={() => {
              auth.logout();
            }}
          >
            Logout
          </Button>
        )}
      </Typography>
    </>
  );
};

export default User;
