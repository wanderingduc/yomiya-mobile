import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Button,
  Modal,
  Alert,
  ImageComponent,
  Image
} from "react-native";
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
  name: string;
};

const Book = () => {
  const router = useRouter();

  const { book_id, title, author } = useLocalSearchParams();

  // const { user, auth } = useGlobalSearchParams();

  const [lib, setLib] = useState("");
  const [data, setData] = useState(null);
  const [show, setShow] = useState(false);
  const [select, setSelect] = useState({ lib_id: "", lib_name: "" });
  const [user, setUser] = useState("");
  const [auth, setAuth] = useState("");

  const getLibs = async () => {
    const reqBody = {
      user: {
        username: "testuser",
        password: null,
        created_at: null,
        updated_at: null,
        jwt: null,
      },
      book: null,
      lib: {
        lib_id: "testuserlib1",
        lib_name: "lib1",
      },
    };

    const req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`
      },
      body: JSON.stringify(reqBody),
    };

    await fetch("http://10.0.2.2:8080/dev/v1/libs/get", req)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Fuck");
        }
        return res.json();
      })
      .then((data) => {
        // console.log(data.Data.libs);
        setSelect({
          lib_id: data.Data.libs[0].lib_id,
          lib_name: data.Data.libs[0].lib_name,
        });
        setData(data.Data.libs);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const getCreds = async () => {
    const token = await AsyncStorage.getItem("token");
    const user = await AsyncStorage.getItem("user");
    if (!token || !user) {
      console.error("Error fetching token or user");
    } else {
      setAuth(token);
      setUser(user);
    }
    // console.log(token, user);
  };

  const showLibs = async () => {
    await getLibs()
    setShow(!show);
  };

  const addBook = async () => {
    const reqBody: Request = {
      user: {
        username: user.toString(),
        password: null,
        created_at: null,
        updated_at: null,
        token: null,
      },
      book: {
        book_id: book_id.toString(),
        title: title.toString(),
        author: author.toString(),
      },
      lib: {
        lib_id: select.lib_id,
        lib_name: select.lib_name,
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
          console.log(res.status)
          throw new Error("addBook");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data.Success);
        setShow(!show)
      })
      .catch((e) => {
        Alert.alert("Error", "Book already in library")
        console.error(e);
      });
  };

  const chooseLib = (lib: string) => {
    setLib(lib);
    setShow(!show);
  };

  useEffect(() => {
    // getLibs();
    getCreds();
    // console.log(auth) // DEBUG
  }, []);

  // useEffect(() => {
  //   // DEBUG
  //   // console.log(lib);
  // }, [lib]);

  return (
    <>
    <Stack.Screen
        options={{
          title: title.toString(),
        }}
      />
    <View>

      <Image source={require('../../assets/images/bookplaceholder.png')} style={styles.bookImage} /> {/* Make hook to fetch correct image from s3 bucket (after implementing bucket) */}
      
      <Text style={styles.bookTitle} >
        {title}
      </Text>
      <Text style={styles.bookAuthor} >
        {author}
      </Text>

    </View>
    <Modal
        visible={show}
        // transparent={true}
        animationType="slide"
        onRequestClose={() => setShow(!show)}
      >
        <View style={styles.addLib}>
          <View style={styles.addLibHeader}>
            <Text style={styles.addLibTitle}>Choose Library</Text>
            <TouchableOpacity 
            style={styles.addLibClose}
            onPress={() => setShow(!show)}
            >
              <Text style={styles.addLibCloseText} >Close</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            style={show ? styles.visible : styles.invisible}
            data={data}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setLib(item.lib_id);
                }}
                style={styles.addLibItemContainer}
              >
                <Text style={styles.addLibItem}>{item.lib_name}</Text>
              </TouchableOpacity>
            )}
            extraData={data}
            contentContainerStyle={styles.flex}
          />
        </View>
        <View style={styles.constant}>
          <Text style={styles.chosenLib}>{select.lib_name}</Text>
          <TouchableOpacity style={styles.addButton} onPress={addBook}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    <View style={styles.constant}>
    <TouchableOpacity onPress={showLibs} style={styles.addButton} >
      <Text style={styles.addButtonText}>Add Book</Text>
    </TouchableOpacity>
    </View>
    </>
  );
};

export default Book;

const styles = StyleSheet.create({
  list: {},

  flex: {
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    width: 50,
    height: 20,
    backgroundColor: "yellow",
  },

  bookImage: {
    width: 400,
    height: 500,
    marginTop: 10,
    marginHorizontal: 'auto'
  },

  bookTitle: {
    fontSize: 30,
    fontWeight: '600',
    marginLeft: 10,
    marginTop: 20,
    marginBottom: 5
  },

  bookAuthor: {
    fontSize: 20,
    fontWeight: '500',
    marginLeft: 15,
    marginTop: 5
  },

  visible: {
    width: "100%",
    // backgroundColor: "blue",
    display: "flex",
    overflowX: 'hidden'
  },

  invisible: {
    display: "none",
  },

  addLib: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  addLibHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: '100%'
    // justifyContent: 'center'
  },

  addLibTitle: {
    margin: 10,
    fontSize: 25,
    textAlign: "center",
  },

  addLibClose: {
    marginLeft: "auto",
    backgroundColor: "hsl(21, 78%, 48%)",
    width: 100,
    height: 55,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addLibCloseText: {
    color: 'hsl(0, 0%, 100%)',
    textAlign: 'center',
    fontSize: 20
  },

  chosenLib: {
    fontSize: 25,
    // marginRight: 'auto',
    // marginLeft: 25
    marginHorizontal: "auto",
  },

  addLibItemContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 500,
    borderColor: 'hsl(21, 78%, 48%)',
    borderTopWidth: 1,
    borderBottomWidth: 1
  },

  addLibItem: {
    fontSize: 25,
    textAlign: "center",
    // backgroundColor: 'yellow'
  },

  addButton: {
    backgroundColor: "hsl(21, 78%, 48%)",
    width: 200,
    height: 60,
    borderRadius: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 25,
  },

  addButtonText: {
    textAlign: "center",
    fontSize: 22,
    color: "hsl(0, 0%, 100%)",
  },

  constant: {
    marginTop: "auto",
    marginBottom: 25,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
