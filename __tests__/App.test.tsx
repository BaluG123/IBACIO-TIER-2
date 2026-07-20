/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

// Navigation + native modules are heavy for unit smoke tests.
jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    NavigationContainer: ({children}: {children: React.ReactNode}) =>
      children,
    DefaultTheme: {colors: {}},
    useNavigation: () => ({navigate: jest.fn(), replace: jest.fn(), goBack: jest.fn(), openDrawer: jest.fn()}),
    useRoute: () => ({params: {}}),
    useFocusEffect: jest.fn(),
  };
});

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({children}: {children: React.ReactNode}) => children,
    Screen: () => null,
  }),
}));

jest.mock('@react-navigation/drawer', () => ({
  createDrawerNavigator: () => ({
    Navigator: ({children}: {children: React.ReactNode}) => children,
    Screen: () => null,
  }),
  DrawerContentScrollView: ({children}: {children: React.ReactNode}) =>
    children,
  DrawerItemList: () => null,
}));

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

import App from '../App';

test('renders App without crashing', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
