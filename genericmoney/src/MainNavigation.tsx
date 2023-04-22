import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppBar } from 'react95-native';
import type { Theme } from 'react95-native';
import GenericScreen from './GenericScreen';
import AppScreen from './AppScreen';
import StakingScreen from './StakingScreen';
import NFTScreen from './NFTScreen';
import AdminScreen from './AdminScreen';

const Stack = createStackNavigator();

type Props = {
  setTheme: (theme: Theme) => void;
};

const MainNavigation = (props: Props) => {
  return (
    <>
      <Stack.Navigator
        initialRouteName='GenericScreen'
        headerMode='screen'
        screenOptions={{
          header: ({ navigation, scene, previous }) =>
            scene.descriptor.options.title !== 'Examples' && (
              <AppBar style={{ display: 'none' }}>
                {previous && (
                  <AppBar.BackAction onPress={() => navigation.goBack()} />
                )}
                {/* <AppBar.Content title={scene.descriptor.options.title} /> */}
              </AppBar>
            ),
        }}
      >
        <Stack.Screen name='home' options={{ title: 'Generic Coin' }}>
          {() => <GenericScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name='slots' options={{ title: 'Generic Slots' }}>
          {() => <AppScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name='staking' options={{ title: 'Generic Staking' }}>
          {() => <StakingScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name='nft' options={{ title: 'Generic NFT' }}>
          {() => <NFTScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name='admin' options={{ title: 'Generic NFT' }}>
          {() => <AdminScreen {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </>
  );
};

export default MainNavigation;
