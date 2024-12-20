import { View, Text } from 'react-native'
import React from 'react'
import { Stack, useGlobalSearchParams, useLocalSearchParams, useRouter } from 'expo-router'

const Book = () => {

  const router = useRouter()

    const {book_id, title, author} = useLocalSearchParams()

    const { user, auth } = useGlobalSearchParams()

  return (
    <View>
      <Stack.Screen options={{
        title: title.toString()
      }} />
        <Text>The page of {title} with id: {book_id} written by {author}</Text>
    </View>
  )
}

export default Book