import { View, Text, TouchableOpacity, FlatList, StyleSheet, Button } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Stack,
  useGlobalSearchParams,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import Request from "@/constants/Request";
import { LibItem } from "../(tabs)/libs";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Lib = {
  name: string
}

const Book = () => {
  const router = useRouter();

  const { book_id, title, author } = useLocalSearchParams();

  // const { user, auth } = useGlobalSearchParams();

  const [lib, setLib] = useState("");
  const [data, setData] = useState(null);
  const [show, setShow] = useState(false);
  const [select, setSelect] = useState({lib_id: '', lib_name: ''});
  const [user, setUser] = useState('');
  const [auth, setAuth] = useState('');

  const getLibs = async () => {

    const reqBody = {
      user: {
        username: "testuser",
        password: null,
        jwt: null
      },
      book: null,
      lib: {
        lib_id: "testuserlib1",
        lib_name: "lib1"
      }
    }
    
    const req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody)
    }

    await fetch("http://10.0.2.2:8080/dev/v1/libs/get", req)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Fuck")
      }
      return res.json()
    })
    .then((data) => {
      console.log(data.Data.libs)
      setSelect({lib_id: data.Data.libs[0].lib_id, lib_name: data.Data.libs[0].lib_name})
      setData(data.Data.libs)
    })
    .catch((e) => {
      console.error(e)
    })

  }

  const getCreds = async () => {
    const token = await AsyncStorage.getItem("token")
    const user = await AsyncStorage.getItem("user")
    if (!token || !user) {
      console.error("Error fetching token or user")
    } else {
      setAuth(token)
      setUser(user)
    }
    console.log(token, user)
  }

  const showLibs = () => {
    setShow(!show)
  }

  const addBook = async () => {
    const reqBody: Request = {
      user: {
        username: user.toString(),
        password: null,
        token: null,
      },
      book: {
        book_id: book_id.toString(),
        title: title.toString(),
        author: author.toString(),
      },
      lib: {
        lib_id: lib,
        lib_name: null,
      },
    };

    const req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.toString()}`,
      },
      body: JSON.stringify(reqBody),
    };

    await fetch("http://10.0.2.2:8080/dev/v1/libs/addbook", req)
      .then((res) => {
        if (!res.ok) {
          throw new Error("addBook");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data.Success);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const chooseLib = (lib: string) => {
    setLib(lib)
    setShow(!show)
  }

  useEffect(() => {
    getLibs();
    getCreds();
  }, []);

  useEffect(() => { // DEBUG
    console.log(lib)
  }, [lib])

  return (
    <View>
      <Stack.Screen
        options={{
          title: title.toString(),
        }}
      />
      <Text>
        The page of {title} with id: {book_id} written by {author}
      </Text>
      <View>
        <Text>{select.lib_name}</Text>
        <Button onPress={showLibs} title="choose lib" />
        <FlatList
        style={show ? styles.visible : styles.invisible}
        data={data}
        renderItem={({ item }) => <TouchableOpacity onPress={() => {chooseLib(item.lib_id)}} ><Text>{item.lib_name}</Text></TouchableOpacity> }
        extraData={data}
        contentContainerStyle={styles.flex}
      />
      </View>
      
      <TouchableOpacity onPress={addBook} >
        <Text>Add book</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Book;

const styles = StyleSheet.create({
  list: {

  },

  flex: {
        alignItems: 'center',
    justifyContent: 'center'
  },

  text: {
    width: 50,
    height: 20,
    backgroundColor: 'yellow'
  },

  visible: {
    width: '100%',
    backgroundColor: 'blue',
    display: 'flex',
  },

  invisible: {
    display: 'none'
  }

})
