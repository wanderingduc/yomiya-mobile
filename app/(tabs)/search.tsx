import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Modal } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useGlobalSearchParams } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BookItem } from './home'
import Request from '@/constants/Request'

const Search = () => {

    const timer = useRef(0)
    const { name, auth } = useGlobalSearchParams()
    const [search, setSearch] = useState('');
    const [data, setData] = useState(null);
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [ISBN, setISBN] = useState('')

    function debounce(func: Function, debounceTime: number) {


        return () => {
            clearTimeout(timer.current)

            timer.current = setTimeout(func, debounceTime)
        }

    }

    const searchBook = async () => {

        const reqBody: Request = {
            user: {
                username: name.toString(),
                password: null,
                created_at: null,
                updated_at: null,
                token: null
            },
            book: {
                book_id: search.toString(),
                title: null,
                author: null
            },
            lib: null
        }


        const req = {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${auth}`
            },
            body: JSON.stringify(reqBody)
        }

        await fetch('http://10.0.2.2:8080/dev/v1/books/search', req)
        .then((res) => {
            if (!res.ok) {
                // console.log(res.status)
                throw new Error("fuck you")
            }
            return res.json()
        })
        .then((data) => {
            // console.log(data.Data.books)
            setData(data.Data.books)
            
        })
        .catch((e) => {
            setData(null)
            console.error(e)
        })


    }

    const searchDebounce = debounce(() => {
        searchBook()
        // console.log(data)

    }, 500)

    const addBook = async () => {

        const reqBody: Request = {
            user: {
                username: name.toString(),
                password: null,
                created_at: null,
                updated_at: null,
                token: null
            },
            book: {
                book_id: ISBN,
                title: title,
                author: author
            },
            lib: null
        }

        const req = {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${auth}`
            },
            body: JSON.stringify(reqBody)
        }

        await fetch('http://10.0.2.2:8080/dev/v1/books/create', req)
        .then((res) => {
            if (!res.ok) {
                throw new Error("addBook error")
            }
            return res.json()
        })
        .then((data) => {
            // console.log(data.Success)
            setVisible(!visible)
        })
        .catch((e) => {
            console.error(e)
        })

    }

    useEffect(() => {
        // console.log(auth) // DEBUG
    })

    useEffect(searchDebounce, [search])


  return (
    <>
    <View>
        <TextInput placeholder='Search' onChangeText={text => {setSearch(text)}} style={styles.searchField} />
      <FlatList data={data} renderItem={({item}) => <BookItem book_id={item.book_id} title={item.title} author={item.author} inverted={false} />} extraData={data}/>
    </View>
    <View style={styles.newButtonContainer} >
        <TouchableOpacity style={styles.newButton} onPress={() => setVisible(!visible)} >
            <Text style={styles.newButtonText} >Can't find your book?</Text>
        </TouchableOpacity>
    </View>
    <Modal visible={visible} style={styles.newBookContainer} animationType='slide' onRequestClose={() => setVisible(!visible)} >
        <View style={styles.inputContainer} >
        <Text style={styles.inputLbl} >Title</Text>
        <TextInput style={styles.inputObj} placeholder='The tale of books'
        placeholderTextColor={"hsla(21, 78%, 48%, 0.8)"}
        underlineColorAndroid={"hsl(21, 78%, 48%)"}
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        maxLength={255}
        onChangeText={(text) => setTitle(text)}
        />
        <Text style={styles.inputLbl} >Author</Text>
        <TextInput style={styles.inputObj} placeholder='James Smith'
        placeholderTextColor={"hsla(21, 78%, 48%, 0.8)"}
        underlineColorAndroid={"hsl(21, 78%, 48%)"}
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        maxLength={255}
        onChangeText={(text) => setAuthor(text)}
        />
        <Text style={styles.inputLbl} >ISBN</Text>
        <TextInput style={styles.inputObj} placeholder='1234567890123'
        placeholderTextColor={"hsla(21, 78%, 48%, 0.8)"}
        underlineColorAndroid={"hsl(21, 78%, 48%)"}
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        maxLength={255}
        keyboardType='number-pad'
        inputMode='numeric'
        onChangeText={(text) => setISBN(text)}
        />
        </View>
        <TouchableOpacity style={styles.newBookButton} onPress={addBook} >
            <Text style={styles.newBookButtonText} >Add Book</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeNewBookButton} onPress={() => setVisible(!visible)} >
            <Text style={styles.closeNewBookButtonText} >Close</Text>
        </TouchableOpacity>

    </Modal>
    </>
  )
}

export default Search 

const styles = StyleSheet.create({

    searchField: {
        fontSize: 22,
        paddingLeft: 10
    },

    newButtonContainer: {
        marginTop: 'auto',
        marginBottom: 20,
        marginHorizontal: 'auto',
        width: '65%',
        height: 60,
        // backgroundColor: 'blue'
    },

    newButton: {
        height: '100%',
        width: '100%',
        backgroundColor: 'hsl(21, 78%, 48%)',
        borderRadius: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    newButtonText: {
        textAlign: 'center',
        color: 'hsl(0, 0%, 100%)',
        fontSize: 22,
        fontWeight: '500'
    },

    newBookContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: 'gray',
    },

    inputContainer: {
        marginTop: 100,
        marginHorizontal: 'auto',
        width: '80%'
    },

    inputLbl: {
        // backgroundColor: "lightblue",
        fontSize: 22,
        width: "100%",
        color: "hsl(21, 78%, 48%)",
        paddingLeft: 3,
      },
    
      inputObj: {
        // backgroundColor: "lightgray",
        // backgroundColor: "hsl(0, 0%, 100%)",
        width: "100%",
        height: 50,
        marginBottom: 50,
        color: "hsl(21, 78%, 48%)",
        fontSize: 20,
      },

    newBookButton: {
        marginTop: 'auto',
        marginBottom: 20,
        marginHorizontal: 'auto',
        width: '40%',
        height: 60,
        backgroundColor: 'hsl(21, 78%, 48%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30
    },

    newBookButtonText: {
        color: 'hsl(0, 0%, 100%)',
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '500'
    },

    closeNewBookButton: {
        padding: 0,
        marginTop: 0,
        marginBottom: 20,
        marginHorizontal: 'auto',
        width: '40%',
        height: 40,
        backgroundColor: 'hsl(0, 0%, 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30
    },

    closeNewBookButtonText: {
        color: 'hsl(21, 78%, 48%)',
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '500'
    }

})