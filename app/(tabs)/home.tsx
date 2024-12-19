import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import {
  ExternalPathString,
  Link,
  Router,
  useGlobalSearchParams,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";


type Book = {
  book_id: string
  title: string
  author: string
}

export const BookItem = ({book_id, title, author}: Book) => {

  const router = useRouter()

  const nav = () => {
    router.push({pathname: `/books/[book]`, params: {book: title,id: book_id, title: title, author: author}})
  }

  return (
  <TouchableOpacity style={styles.bookItemContainer} onPress={nav}>
    <Text style={styles.bookItemTitle}>{title}</Text>
    <Text style={styles.bookItemAuthor}>{author}</Text>
    <Text style={styles.bookItemId}>{book_id}</Text>
  </TouchableOpacity>
  )
}




const Home = () => {
  const { name, auth } = useGlobalSearchParams();

  const router = useRouter();

  const deleteToken = async () => { // ONLY FOR DEV
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
  };

  const [token, setToken] = useState();
  const [books, setBooks] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBooks()
  }, [])

  const loadToken = async () => { // MBY NOT NEEDED
    const t = await AsyncStorage.getItem("token");
    return t;
  };

  const getBook = async () => { // NOT FINISHED

    const token = await AsyncStorage.getItem('token')

    const ob = {
      book_id: "1234567890123",
      title: "",
      author: ""
    };

    console.log(`Bearer ${token}`)

    const req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(ob),
    };

    fetch("http://10.0.2.2:8080/dev/v1/books/bookid", req)
      .then((res) => {
        if (!res.ok) {
          console.error("Fuck");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data.Data);
        
      });
  };

  const getBooks = async () => {

    const ob = {
      username: name,
      password: ""
    }

    const req = {
      method: "POST",
      headers: {
        "Content-Type":"application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(ob)
    }

    await fetch('http://10.0.2.2:8080/dev/v1/books/get', req)
    .then((res) => {
      if (!res.ok) {
        throw new Error("FUck you")
      }
      return res.json()
    })
    .then((data) => {
      // const body: [] = data.Data; // DEBUG
      // for (let i=0; i<body.length; i++) {
      //   console.log(body[i])
      // }
      setBooks(data.Data)
      setLoading(false)
    })
    .catch((e) => {
      console.error(e)
    })

  }

  return (
    <>
    <ActivityIndicator style={styles.loadingWheel} animating={loading} size='large' />

    <View>
      {/* <Text onPress={getBooks}>{name}'s home page</Text> */}
      <View style={styles.bookListHeaderContainer}>
        <Text style={styles.bookListHeader}>Books</Text>
      </View>
      {/* <Link href="/" replace>
        homme
      </Link> */}
      <FlatList 
        data={books}
        renderItem={({item}) => <BookItem book_id={item.book_id} title={item.title} author={item.author}/>}
      />
    </View>
    </>
  );
};

export default Home;


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

  loadingWheel: {
    position: 'absolute',
    zIndex: 2,
    left: '45%',
    top: '45%',
    height: '10%',
    width: '10%'
  }

})
