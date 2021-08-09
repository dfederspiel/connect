import './App.css';
import { AuthProvider } from '../context/AuthenticationContext';
import { ApolloAuthProvider } from '../context/ApolloAuthContext/ApolloAuthContext';
import { SnackBarProvider } from '../context/AlertContext/SnackBarProvider';
import AppView from './AppView';

function App() {
  return (
    <SnackBarProvider>
      <AuthProvider>
        <ApolloAuthProvider>
          <AppView />
        </ApolloAuthProvider>
      </AuthProvider>
    </SnackBarProvider>
  );
}

export default App;
