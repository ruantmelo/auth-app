import { useContext, useState } from 'react';
import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { Alert } from 'react-native';
import { AuthContext } from '../store/auth-context';
import { login } from '../util/auth';

function LoginScreen() {
  const authCtx = useContext(AuthContext)
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  async function loginHandler({email, password}){
    setIsAuthenticating(true);
    try{
      const token = await login(email, password)
      authCtx.authenticate(token)
    }catch(error){
      console.log(error)
      Alert.alert('Login failed', 'Please check your credentials.')
      setIsAuthenticating(false);
    }
  }

  if(isAuthenticating){
    return <LoadingOverlay  message='Loggin you in...'/>
  }


  return <AuthContent isLogin onAuthenticate={loginHandler} />;
}

export default LoginScreen;
