import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ChatContextProvider from '../context/ChatContext';
import { LogBox } from 'react-native';



LogBox.ignoreLogs(['Warning:TNodeChildrenRenderer','Warning: TRenderEngineProvider','Warning: MemoizedTNodeRenderer'])
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [loaded] = useFonts({
 
    'Cbold':require('../assets/fonts/Caudex-Bold.ttf'),
    'CboldItalic':require('./../assets/fonts/Caudex-BoldItalic.ttf'),
    'Citalic':require('./../assets/fonts/Caudex-Italic.ttf'),
    'Cregular':require('./../assets/fonts/Caudex-Regular.ttf'),
  });



  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <ChatContextProvider>
     
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="index" />
          <Stack.Screen name="editProfile" />
          <Stack.Screen name="chat"  />
        </Stack>
      
    </ChatContextProvider>
  </GestureHandlerRootView>

  );
}
