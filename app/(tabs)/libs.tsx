import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button
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
  const timer = useRef(0);

  const newLib = () => {
    router.push('/newlib')
  }

  const getLibs = async () => {
    const reqBody: Request = {
      user: {
        username: user.toString(),
        password: null,
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
    <TouchableOpacity style={styles.newButton} onPress={newLib}><Text style={styles.newButtonText} >New</Text></TouchableOpacity>
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

  newButton: {
    backgroundColor: "hsl(21, 78%, 48%)",
    width: 80,
    height: 80,
    borderRadius: 40,
    position: 'absolute',
    bottom: 25,
    right: 25,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2
  },

  newButtonText: {
    color: "hsl(0, 0%, 100%)",
    textAlign: 'center',
    fontSize: 22
  }

});
