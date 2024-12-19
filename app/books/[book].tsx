import { View, Text } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'

const Book = () => {

  const router = useRouter()

    const {book_id, title, author} = useLocalSearchParams()

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