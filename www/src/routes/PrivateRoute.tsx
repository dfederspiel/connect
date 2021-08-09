import React from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { useAuth } from '../context/AuthenticationContext';

const PrivateRoute = ({ children, ...rest }: RouteProps): JSX.Element => {
  const auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) => (auth.user ? children : <h1>Not Authorized</h1>)}
    />
  );
};

export default PrivateRoute;
