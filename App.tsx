// react-native-gesture-handler should be at the top and there's nothing else before it
import 'react-native-gesture-handler';

// Global Settings
import 'dayjs/locale/id';
import dayjs from 'dayjs';
dayjs.locale('id');

// Sign in with google
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import React, {FC} from 'react';
import {enableScreens} from 'react-native-screens';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import AppRouter from '@routes';
import AppContextProvider from '@context';

// to indicate that inactive screens should be detached from the view hierarchy to save memory
enableScreens();

// Initialization of siginin with google feature
GoogleSignin.configure({
  // webClientId:
  //   '508384095334-uqi7vshb8v3krm2r7bacerjtpdfm82fa.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
  
  // scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
  webClientId:
    '1074207251680-rfbkb2tqe7gchrk8vb1e9802en9rnsba.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  // hostedDomain: '', // specifies a hosted domain restriction
  // loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
  forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  // accountName: '', // [Android] specifies an account name on the device that should be used
  // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  // googleServicePlistPath: '', // [iOS] optional, if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
});

const App: FC = () => {
  return (
    <SafeAreaProvider>
      <AppContextProvider>
        <PaperProvider
          theme={{
            ...DefaultTheme,
            colors: {...DefaultTheme.colors, primary: '#10B981'},
          }}>
          <AppRouter />
        </PaperProvider>
      </AppContextProvider>
    </SafeAreaProvider>
  );
};

export default App;
