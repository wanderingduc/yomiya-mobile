import { View, Text } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'

const _layout = () => {
  return (
    <Stack>
        <Stack.Screen name='index' options={{headerShown: false}} />
        <Stack.Screen name='signup' options={{headerShown: false}} />
        <Stack.Screen name='(tabs)' options={{headerShown: false}} />
        <Stack.Screen name='books' options={{headerShown: false}} />
        <Stack.Screen name='libs' options={{headerShown: false}} />
        <Stack.Screen name='report' options={{headerTitleAlign: 'center', title: 'Report bug'}} />
        <Stack.Screen name='signout' />
    </Stack>
  )
}

export default _layout