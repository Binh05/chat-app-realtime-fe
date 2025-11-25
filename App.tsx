import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import MessageScreen from './screens/messagePage';
import DetailChat from './screens/chatUI';
import ChatDesc from './screens/chatDesc';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={MessageScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Detail" component={DetailChat} options={{ headerShown: false }}/>
        <Stack.Screen name="ChatDesc" component={ChatDesc} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}