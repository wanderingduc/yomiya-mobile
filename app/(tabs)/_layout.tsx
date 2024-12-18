import { View, Text } from 'react-native';
import { Tabs, useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import React from 'react';

const _layout = () => {

  const name = useGlobalSearchParams()

  return (
    <Tabs screenOptions={{headerTitleAlign: 'center'}} >
        <Tabs.Screen name='home' options={{headerShown: true}} initialParams={{user: name}}/>
        <Tabs.Screen name='profile' options={{headerShown: true}} initialParams={{user: name}}/>
    </Tabs>
  )
}

export default _layout