import { View, Text, FlatList, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Stack, useGlobalSearchParams, useLocalSearchParams } from 'expo-router'
import Request from '@/constants/Request'
import { BookItem } from '../(tabs)/home'

const Lib = () => {

    const { lib, libName } = useLocalSearchParams()
    const { user, token } = useGlobalSearchParams()

    const [books, setBooks] = useState(null)
    const [searcBooks, setSearchBooks] = useState(null)

  const getBooks = async () => {

    const reqBody: Request = {
      user: {
        username: user.toString(),
        password: null,
        token: null
      },
      book: null,
      lib: {
        lib_id: lib.toString(),
        lib_name: libName.toString()
      }
    }

    const req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token.toString()
      },
      body: JSON.stringify(reqBody)
    }

    await fetch('http://10.0.2.2:8080/dev/v1/libs/libid', req)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Error getBooks")
      }
      return res.json()
    })
    .then((data) => {
      console.log(data.Data.Books)
      setBooks(data.Data.Books)
    })
    .catch((e) => {
      console.error(e)
    })

  }
    




  return (
    <View>
      <Stack.Screen options={{
        title: libName.toString()
      }} />
      <View>
        <Text>{libName}</Text>
      </View>
      <FlatList data={books} renderItem={({item}) => <BookItem book_id={item.book_id} title={item.title} author={item.author} />} />
    </View>
  )
}

export default Lib

const styles = StyleSheet.create({
  bookListHeaderContainer: {
    backgroundColor: 'hsl(0, 0%, 90%)',
    width: '100%',
    height: 50,
  },

  bookListHeader: {
    height: '100%',
    paddingTop: 'auto',
    paddingBottom: 'auto',
    marginLeft: 10,
    fontSize: 35,
    fontWeight: '500'
  },

  bookItemContainer: {
    width: '100%',
    height: 100,
    backgroundColor: 'hsl(0, 0%, 100%)',
    paddingLeft: 10,
    flex: 1,
    justifyContent: 'center',
    borderTopColor: 'hsl(0, 0%, 90%)',
    borderBottomColor: 'hsl(0, 0%, 100%)',
    borderRightColor: 'hsl(0, 0%, 100%)',
    borderLeftColor: 'hsl(0, 0%, 100%)',
    borderWidth: 2
  },

  bookItemTitle: {
    fontSize: 25,
    fontWeight: '500'
  },

  bookItemAuthor: {
    fontSize: 15,
    fontWeight: '500'
  },

  bookItemId: {
    fontSize: 15,
    color: 'hsl(0, 0%, 45%)'
  },
})