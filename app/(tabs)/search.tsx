import { View, Text, TextInput, FlatList } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useGlobalSearchParams } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BookItem } from './home'

const Search = () => {

    const timer = useRef(0)
    const { name, auth } = useGlobalSearchParams()
    const [search, setSearch] = useState('');
    const [data, setData] = useState(null);

    function debounce(func: Function, debounceTime: number) {


        return () => {
            clearTimeout(timer.current)

            timer.current = setTimeout(func, debounceTime)
        }

    }

    const searchBook = async () => {

        const ob = {
            book_id: search,
            title: '',
            author: '',
        }


        const req = {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${auth}`
            },
            body: JSON.stringify(ob)
        }

        await fetch('http://10.0.2.2:8080/dev/v1/books/search', req)
        .then((res) => {
            if (!res.ok) {
                throw new Error("fuck you")
            }
            return res.json()
        })
        .then((data) => {
            setData(data.Data)
            
        })
        .catch((e) => {
            setData(null)
            console.error(e)
        })


    }

    const searchDebounce = debounce(() => {
        searchBook()
        console.log(data)

    }, 500)

    useEffect(searchDebounce, [search])


  return (
    <View>
        <TextInput placeholder='Search' onChangeText={text => {setSearch(text)}} />
      <FlatList data={data} renderItem={({item}) => <BookItem book_id={item.book_id} title={item.title} author={item.author} />} extraData={data}/>
    </View>
  )
}

export default Search 