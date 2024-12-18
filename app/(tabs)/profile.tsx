import { View, Text } from 'react-native'
import React from 'react'
import { useGlobalSearchParams, useLocalSearchParams } from 'expo-router'

const Profile = () => {

  const { name } = useGlobalSearchParams();

  return (
    <View>
      <Text>{name}'s profile page</Text>
    </View>
  )
}

export default Profile