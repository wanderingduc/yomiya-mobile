import { View, Text } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'

const _layout = () => {

  return (
    <Stack screenOptions={{
        headerShown: true
    }}/>
  )
}

export default _layout