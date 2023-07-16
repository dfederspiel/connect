import { AuthProvider } from '../context/AuthenticationContext';
import { ApolloAuthProvider } from '../context/ApolloAuthContext/ApolloAuthContext';
import { SnackBarProvider } from '../context/AlertContext/SnackBarProvider';
import AppView from './AppView';

const App = (): JSX.Element => {
  return (
    <AuthProvider>
      <ApolloAuthProvider>
        <SnackBarProvider timeout={5000}>
          <AppView />
        </SnackBarProvider>
      </ApolloAuthProvider>
    </AuthProvider>
  );
};

export default App;
