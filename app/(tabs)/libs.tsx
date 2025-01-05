import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button,
  Modal
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Stack,
  useGlobalSearchParams,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import Request from "@/constants/Request";

type LibO = {
  libName: string;
  libId: string
  user: string
  token: string
};

export const LibItem = ({ libName, libId, user, token }: LibO) => {

  const router = useRouter()

  const nav = () => {
    router.push({pathname: `/libs/[lib]`, params: {lib: libId, libName: libName, user: user, auth: token}})
  }

  return (
    <TouchableOpacity style={styles.libItemContainer} onPress={nav}>
      <Text style={styles.libItemTitle}>{libName}</Text>
    </TouchableOpacity>
  );
};

const Libs = () => {

  const router = useRouter()

  const { user, auth } = useGlobalSearchParams();
  const [data, setData] = useState(null);
  const [newData, setNewData] = useState();
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(false);
  const [libName, setLibName] = useState('');
  const timer = useRef(0);

  const newLib = () => {
    router.push('/newlib')
  }

  const addLib = async () => {

    const reqBody: Request = {
      user: {
        username: user.toString(),
        password: null,
        created_at: null,
        updated_at: null,
        token: null
      },
      book: null,
      lib: {
        lib_id: null,
        lib_name: libName
      }
    }

    const req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`
      },
      body: JSON.stringify(reqBody)
    }

    await fetch('http://10.0.2.2:8080/dev/v1/libs/lib', req)
    .then((res) => {
      if (!res.ok) {
        // console.log(res.status)
        throw new Error("Error addLib")
      }
      getLibs()
      setVisible(!visible)
      return res.json()
    })
    .catch((e) => {
      console.error(e)
    })

  }

  const getLibs = async () => {
    const reqBody: Request = {
      user: {
        username: user.toString(),
        password: null,
        created_at: null,
        updated_at: null,
        token: null
      },
      book: null,
      lib: null
    }

    const req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`,
      },
      body: JSON.stringify(reqBody),
    };

    await fetch("http://10.0.2.2:8080/dev/v1/libs/get", req)
      .then((res) => {
        if (!res.ok) {
          throw new Error("failed getLibs");
        }
        return res.json();
      })
      .then((data) => {
        // console.error(data.Data.libs); // DEBUG
        setData(data.Data.libs);
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

  const searchLib = async () => {
    const reqBody: Request = {
      user: {
        username: user.toString(),
        password: null,
        created_at: null,
        updated_at: null,
        token: null
      },
      book: null,
      lib: {
        lib_id: null,
        lib_name: search
      }
    }

    const req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`,
      },
      body: JSON.stringify(reqBody),
    };

    await fetch("http://10.0.2.2:8080/dev/v1/libs/search", req)
      .then((res) => {
        if (!res.ok) {
          throw new Error("failed searchLib");
        }
        return res.json();
      })
      .then((data) => {
        // console.log(data.Data.libs)
        setNewData(data.Data.libs);
      })
      .catch((e) => {
        setData(null);
        console.error(e);
      });
  };

  // useEffect(() => {
  //   console.log(data)
  // }, [data])

  const searchDebounce = debounce(() => {
    searchLib();
    // console.log(data);
  }, 500);

  useEffect(searchDebounce, [search]);

  useEffect(() => {
    // console.log(auth) // DEBUG
    getLibs();
  }, []);

  return (
    <>
    <View>
      <Stack.Screen
        options={{
          title: "Libraries",
        }}
      />
      <Modal visible={visible} style={styles.newBookContainer} animationType='slide' onRequestClose={() => setVisible(!visible)} >
              <View style={styles.inputContainer} >
              <Text style={styles.inputLbl} >Name</Text>
              <TextInput style={styles.inputObj} placeholder='The library of books'
              placeholderTextColor={"hsla(21, 78%, 48%, 0.8)"}
              underlineColorAndroid={"hsl(21, 78%, 48%)"}
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              maxLength={255}
              onChangeText={(text) => setLibName(text)}
              />
              </View>
              <TouchableOpacity style={styles.newBookButton} onPress={addLib} >
                  <Text style={styles.newBookButtonText} >Add Lib</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeNewBookButton} onPress={() => setVisible(!visible)} >
                  <Text style={styles.closeNewBookButtonText} >Close</Text>
              </TouchableOpacity>
      
          </Modal>
      <TextInput onChangeText={text => setSearch(text)} placeholder="Search libraries"/>
      <View style={newData ? styles.libListHeaderContainer : styles.hidden}>
        <Text style={styles.libListHeader}>Search Result</Text>
      </View>
      <FlatList
        data={newData}
        renderItem={({ item }) => <LibItem libName={item.lib_name} libId={item.lib_id} user={user.toString()} token={auth.toString()} />}
        extraData={newData}
      />
      <View style={styles.libListHeaderContainer}>
        <Text style={styles.libListHeader}>My Libraries</Text>
      </View>
      {(user != null && auth != null) ?
      <FlatList
        data={data}
        renderItem={({ item }) => <LibItem libName={item.lib_name} libId={item.lib_id} user={user.toString()} token={auth.toString()}  />}
        extraData={user}
      /> : null}
    </View>
    <View style={styles.newButtonContainer} >
    <TouchableOpacity style={styles.newButton} onPress={() => setVisible(!visible)}><Text style={styles.newButtonText} >NewLib</Text></TouchableOpacity>
    </View>
    </>
  );
};

export default Libs;

const styles = StyleSheet.create({

  hidden: {
    display: 'none'
  },

  libListHeaderContainer: {
    backgroundColor: 'hsl(0, 0%, 90%)',
    width: '100%',
    height: 50,
  },

  libListHeader: {
    height: '100%',
    paddingTop: 'auto',
    paddingBottom: 'auto',
    marginLeft: 10,
    fontSize: 35,
    fontWeight: '500'
  },

  libItemContainer: {
    width: "100%",
    height: 100,
    backgroundColor: "hsl(0, 0%, 100%)",
    paddingLeft: 10,
    flex: 1,
    justifyContent: "center",
    borderTopColor: "hsl(0, 0%, 90%)",
    borderBottomColor: "hsl(0, 0%, 100%)",
    borderRightColor: "hsl(0, 0%, 100%)",
    borderLeftColor: "hsl(0, 0%, 100%)",
    borderWidth: 2,
  },

  libItemTitle: {
    fontSize: 25,
    fontWeight: "500",
  },

  newButtonContainer: {
    marginTop: 'auto',
    marginBottom: 20,
    marginHorizontal: 'auto',
    width: '65%',
    height: 60,
    elevation: 2
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

});
