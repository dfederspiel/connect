import { useAuth } from '../context/AuthenticationContext';
import { Typography, Button } from '@material-ui/core';

const User = (): JSX.Element => {
  const auth = useAuth();

  return (
    <>
      <Typography>
        {auth.user}
        {!auth.user && (
          <Button
            onClick={() => {
              auth.signin();
            }}
          >
            Login
          </Button>
        )}
        {auth.user && (
          <Button
            onClick={() => {
              auth.signout();
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
