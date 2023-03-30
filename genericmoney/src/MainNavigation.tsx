import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppBar } from 'react95-native';
import type { Theme } from 'react95-native';
import GenericScreen from './GenericScreen';
import AppScreen from './AppScreen';
import StakingScreen from './StakingScreen';

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
        <Stack.Screen name='app' options={{ title: 'Generic App' }}>
          {() => <AppScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name='staking' options={{ title: 'Generic Staking' }}>
          {() => <StakingScreen {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </>
  );
};

export default MainNavigation;
