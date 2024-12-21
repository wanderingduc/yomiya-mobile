import { View, Text, FlatList, StyleSheet, TextInput } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Stack,
  useGlobalSearchParams,
  useLocalSearchParams,
} from "expo-router";
import Request from "@/constants/Request";
import { BookItem } from "../(tabs)/home";

const Lib = () => {
  const { lib, libName, user, token } = useLocalSearchParams();

  const [books, setBooks] = useState(null);
  const [searchBooks, setSearchBooks] = useState(null);
  const [search, setSearch] = useState("");
  const timer = useRef(0);

  const getBooks = async () => {
    const reqBody: Request = {
      user: {
        username: user.toString(),
        password: null,
        token: null,
      },
      book: null,
      lib: {
        lib_id: lib.toString(),
        lib_name: libName.toString(),
      },
    };

    const req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.toString()}`,
      },
      body: JSON.stringify(reqBody),
    };

    await fetch("http://10.0.2.2:8080/dev/v1/libs/libid", req)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error getBooks");
        }
        return res.json();
      })
      .then((data) => {
        // console.log(data.Data.books) // DEBUG
        setBooks(data.Data.books);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  function debounce(func: Function, debounceTime: number) {
    return () => {
      clearTimeout(timer.current);

      timer.current = setTimeout(func, debounceTime);
    };
  }

  const searchBook = async () => {
    if (search == "") {
      return;
    }

    const reqBody: Request = {
      user: {
        username: user.toString(),
        password: null,
        token: null,
      },
      book: {
        book_id: search,
        title: null,
        author: null,
      },
      lib: {
        lib_id: lib.toString(),
        lib_name: libName.toString(),
      },
    };

    const req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.toString()}`,
      },
      body: JSON.stringify(reqBody),
    };

    await fetch("http://10.0.2.2:8080/dev/v1/books/lib", req)
      .then((res) => {
        if (!res.ok) {
          console.error(res.status);
          throw new Error("fuck you");
        }
        return res.json();
      })
      .then((data) => {
        setSearchBooks(data.Data.books);
      })
      .catch((e) => {
        setSearchBooks(null);
        console.error(e);
      });
  };

  const searchDebounce = debounce(() => {
    searchBook();
  }, 500);

  useEffect(() => {
    getBooks();
  }, []);

  useEffect(() => {
    if (search == "") {
      setSearchBooks(null);
    }
    searchDebounce();
  }, [search]);

  return (
    <View>
      <Stack.Screen
        options={{
          title: libName.toString(),
        }}
      />
      <TextInput
        style={styles.search}
        onChangeText={(text) => setSearch(text)}
        placeholder="Search library"
      />
      <View style={searchBooks ? styles.shown : styles.hidden}>
        <FlatList
          data={searchBooks}
          renderItem={({ item }) => (
            <BookItem
              book_id={item.book_id}
              title={item.title}
              author={item.author}
            />
          )}
          extraData={searchBooks}
        />
      </View>
      <View style={styles.bookListHeaderContainer}>
        <Text style={styles.bookListHeader}>{libName}</Text>
      </View>
      <FlatList
        data={books}
        renderItem={({ item }) => (
          <BookItem
            book_id={item.book_id}
            title={item.title}
            author={item.author}
          />
        )}
        extraData={books}
      />
    </View>
  );
};

export default Lib;

const styles = StyleSheet.create({
  search: {
    margin: 0,
    paddingLeft: 10,
    fontSize: 20,
    height: 60,
    display: "flex",
    backgroundColor: "hsl(0, 0%, 100%)",
    color: "hsl(21, 78%, 48%)",
  },

  hidden: {
    display: "none",
    position: "absolute",
    zIndex: 5,
    overflow: "hidden",
  },

  shown: {
    zIndex: 5,
    position: "absolute",
    top: 60,
  },

  bookListHeaderContainer: {
    backgroundColor: "hsl(0, 0%, 90%)",
    width: "100%",
    height: 50,
  },

  bookListHeader: {
    height: "100%",
    paddingTop: "auto",
    paddingBottom: "auto",
    marginLeft: 10,
    fontSize: 35,
    fontWeight: "500",
  },

  // bookItemContainer: {
  //   width: "100%",
  //   // height: 100,
  //   backgroundColor: "hsl(0, 0%, 100%)",
  //   // paddingLeft: 10,
  //   // flex: 1,
  //   display: "flex",
  //   // justifyContent: 'center',
  //   borderTopColor: "hsl(0, 0%, 90%)",
  //   borderBottomColor: "hsl(0, 0%, 100%)",
  //   borderRightColor: "hsl(0, 0%, 100%)",
  //   borderLeftColor: "hsl(0, 0%, 100%)",
  //   borderWidth: 2,
  // },

  // bookItemTitle: {
  //   fontSize: 25,
  //   fontWeight: "500",
  // },

  // bookItemAuthor: {
  //   fontSize: 15,
  //   fontWeight: "500",
  // },

  // bookItemId: {
  //   fontSize: 15,
  //   color: "hsl(0, 0%, 45%)",
  // },
});
