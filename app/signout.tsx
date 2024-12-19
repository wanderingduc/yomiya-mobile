import { View, Text } from 'react-native'
import React, {useEffect} from 'react'
import { Redirect, useRouter } from 'expo-router'

const signout = () => {

    const router = useRouter()

    useEffect(() => {
        setTimeout(redirect, 1000)
    })

    const redirect = () => {
        router.replace('/')
    }


  return (
    <View>
      <Text>signout</Text>
    </View>
  )
}

export default signout