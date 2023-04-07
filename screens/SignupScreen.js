import AuthContent from '../components/Auth/AuthContent';
import { createUser } from '../util/auth';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { useContext, useState } from 'react';
import { Alert } from 'react-native';
import { AuthContext } from '../store/auth-context';

function SignupScreen() {
  const authCtx = useContext(AuthContext)
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  async function signupHandler({email, password}){
    setIsAuthenticating(true);
    try{
      const token = await createUser(email, password)
      authCtx.authenticate(token)
    }
    catch(error){
      Alert.alert('Signup failed', 'Please check your credentials.')
      setIsAuthenticating(false);
    }
  }

  if(isAuthenticating){
    return <LoadingOverlay  message='Creating user...'/>
  }

  return <AuthContent onAuthenticate={signupHandler}/>;
}

export default SignupScreen;
