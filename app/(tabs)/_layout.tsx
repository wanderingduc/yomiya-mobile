import { View, Text } from 'react-native';
import { Tabs } from 'expo-router';
import React from 'react';

const _layout = () => {
  return (
    <Tabs screenOptions={{headerTitleAlign: 'center'}}>
        <Tabs.Screen name='home' options={{headerShown: true}} />
        <Tabs.Screen name='profile' options={{headerShown: true}} />
    </Tabs>
  )
}

export default _layout