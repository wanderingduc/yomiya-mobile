import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Link,
  useGlobalSearchParams,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const { name } = useGlobalSearchParams();

  const deleteToken = async () => { // ONLY FOR DEV
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
  };

  const [token, setToken] = useState();

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
      const body: [] = data.Data;
      for (let i=0; i<body.length; i++) {
        console.log(body[i])
      }
    })
    .catch((e) => {
      console.error(e)
    })

  }

  return (
    <View>
      <Text onPress={getBooks}>{name}'s home page</Text>
      <Link href="/" replace>
        homme
      </Link>
    </View>
  );
};

export default Home;
