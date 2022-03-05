import { RouteProps } from 'react-router-dom';
import { useAuth } from '../context/AuthenticationContext';

const PrivateRoute = ({ children }: RouteProps) => {
  const auth = useAuth();
  return <>{auth.user ? children : <h1>Not Authorized</h1>}</>;
};

export default PrivateRoute;
