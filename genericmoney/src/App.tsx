import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { fontNames, Provider, themes } from 'react95-native';
import * as SplashScreen from 'expo-splash-screen';
//Web3 Imports
import { Web3ReactProvider } from '@web3-react/core'
import Web3 from 'web3'

import MainNavigation from './MainNavigation';
import { NotificationProvider } from './util/notifications';

const App = () => {
  const linking = {
    prefixes: [
      Linking.createURL('/'),
      'https://generic.money',
      'https://app.generic.money',
    ],
    config: {
      screens: {
        home: '',
        slots: 'slots',
        staking: 'staking',
        nft: 'nft',
        admin: 'admin',
      },
    },
  };

  const [theme, setTheme] = useState(themes.original);

  const [fontLoaded] = useFonts({
    [fontNames.normal]: require('./assets/fonts/MS-Sans-Serif.ttf'),
    [fontNames.bold]: require('./assets/fonts/MS-Sans-Serif-Bold.ttf'),
  });

  useEffect(() => {
    if (fontLoaded) {
      SplashScreen.hideAsync();
      return;
    }

    SplashScreen.preventAutoHideAsync();
  }, [fontLoaded]);

  if (!fontLoaded) {
    /* Renders an empty view to avoid errors while the splash screen is visible */
    return <View />;
  }

  function getLibrary(provider) {
    return new Web3(provider)
  }

  return (
    <>
    <Web3ReactProvider getLibrary={getLibrary}>
      <StatusBar style='light' />
      <View style={{ flex: 1, backgroundColor: '#387d80' }}>
      
        <Provider theme={theme}>
          <NavigationContainer linking={linking}>
            <MainNavigation setTheme={setTheme} />
          </NavigationContainer>
          <NotificationProvider />
        </Provider>
      </View>
      </Web3ReactProvider>
    </>
  );
};

export default App;
