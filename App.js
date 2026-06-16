import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SystemBars } from 'react-native-edge-to-edge';
import AppNavigator from './src/navigation/ScreenNavigator';

const App = () => {
  return (
    <>
      <SystemBars hidden={{ statusBar: true, navigationBar: true }} />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </>
  );
}

export default App;