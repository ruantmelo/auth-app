import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import IconButton from './components/ui/IconButton';
import * as SplashScreen from 'expo-splash-screen';

import { Colors } from './constants/styles';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import { useCallback, useContext, useEffect, useState } from 'react';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  const authCtx = useContext(AuthContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{
        headerRight: ({tintColor}) => <IconButton icon='exit' size={24} color={tintColor} onPress={authCtx.logout}/>
      }} />
    </Stack.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);
  return (
      <NavigationContainer>
        {!authCtx.isAuthenticated && <AuthStack />}
        {authCtx.isAuthenticated && <AuthenticatedStack />}
      </NavigationContainer>
  );
}

function Root(){
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        authCtx.authenticate(token);
      }
      setIsTryingLogin(false);
    }
    fetchToken();
  }, []);

  if (isTryingLogin) {
    return null;
  }

  return <Navigation />

}

export default function App() {
 
  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
    </>
  );
}
