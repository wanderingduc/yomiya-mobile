import { View, Text } from 'react-native';
import { Tabs, useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import React from 'react';

const _layout = () => {

  const {name, auth} = useGlobalSearchParams()

  return (
    <Tabs screenOptions={{headerTitleAlign: 'center'}} >
        <Tabs.Screen name='home' options={{headerShown: true}} initialParams={{user: name, auth: auth}}/>
        <Tabs.Screen name='libs' options={{headerShown: true}} initialParams={{user: name, auth: auth}}/>
        <Tabs.Screen name='search' options={{headerShown: true}} initialParams={{user: name, auth: auth}}/>
        <Tabs.Screen name='profile' options={{headerShown: true}} initialParams={{user: name, auth: auth}}/>
    </Tabs>
  )
}

export default _layout