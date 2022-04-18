import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppBar } from 'react95-native';
import type { Theme } from 'react95-native';
import GenericScreen from './GenericScreen';

const Stack = createStackNavigator();

type Props = {
  setTheme: (theme: Theme) => void;
};

const MainNavigation = (props: Props) => {
  return (
    <>
      <Stack.Navigator
        headerMode='screen'
        screenOptions={{
          header: ({ navigation, scene, previous }) =>
            scene.descriptor.options.title !== 'Examples' && (
              <AppBar style={{display: 'none'}}>
                {previous && (
                  <AppBar.BackAction onPress={() => navigation.goBack()} />
                )}
                {/* <AppBar.Content title={scene.descriptor.options.title} /> */}
              </AppBar>
            ),
        }}
      >
        <Stack.Screen name='Home' options={{ title: 'Generic Coin' }}>
          {() => <GenericScreen {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </>
  );
};

export default MainNavigation;
