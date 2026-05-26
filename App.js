import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
// Remove: import { StatusBar } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import AppNavigator from './src/navigation/ScreenNavigator';

export default function App() {
  return (
    <>
      {/* This replaces the old StatusBar */}
      <SystemBars hidden={{ statusBar: true, navigationBar: true }} />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </>
  );
}