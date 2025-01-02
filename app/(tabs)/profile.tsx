import { View, Text, FlatList, StyleSheet, SectionList, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { useGlobalSearchParams, useLocalSearchParams, useRouter,  } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";



type itemO = {
  title: string
  action: any
};

const Item = ({ title, action }: itemO) => {
  return (
    <TouchableOpacity style={styles.listItem} onPress={action}>
      <Text style={styles.listItemText}>{title}</Text>
    </TouchableOpacity>
  );
};

const ProfileItem = () => {
  return (
    <View style={styles.listProfile}>
      <Text style={styles.listProfileName}>Profile</Text>
      <Text style={styles.listProfileInfo}>user@service.com</Text>
    </View>
  );
};

const Profile = () => {
  const { name, auth } = useGlobalSearchParams();

  const router = useRouter()

  useEffect(() => {
    // console.log(auth) // DEBUG 
  }, [])

  const reload = () => {}
  const home = () => {router.navigate('/(tabs)/home')}
  const testtoken = () => {router.replace('/signout')}
  const signout = async () => {
    await AsyncStorage.removeItem('token')
    await AsyncStorage.removeItem('user')
    router.replace('/signout')
  }
  const adminmsg = () => {}

  const Data = [
    {
      title: "Settings",
      data: [
        {
          id: "profile",
          content: "Profile",
          action: reload
        },
        {
          id: "home",
          content: "Home",
          action: home
        },
        {
          id: "general",
          content: "General",
          action: testtoken
        },
        {
          id: "adminmsg",
          content: "Messages from admin",
          action: adminmsg
        },
        {
          id: "signout",
          content: "Sign out",
          action: signout
        }
      ],
    },
    // {
    //   title: "System",
    //   data: [
    //     {
    //       id: "new",
    //       content: "New book",
    //     },
    //     {
    //       id: "something",
    //       content: "Something",
    //     },
    //   ],
    // },
    // {
    //   title: "User",
    //   data: [
    //     {
    //       id: "signout",
    //       content: "Sign out",
    //     },
    //   ],
    // },
  ];

  return (
    <View>
      {/* <Text>{name}'s profile  </Text> */}
      <ProfileItem />
      {/* <FlatList style={styles.list} data={Data} renderItem={({item}) => <Item title={item.title} />} keyExtractor={item => item.id}/> */}
      <SectionList
        style={styles.list}
        sections={Data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          // <View style={styles.listItem}>
          //   <Text style={styles.listItemText} onPress={router.push(item.action)}>{item.content}</Text>
          // </View>
          <Item title={item.content} action={item.action} />
        )}
        renderSectionHeader={({ section }) => (
          <View style={styles.listItemHeader}>
            <Text style={styles.listItemHeaderText}>{section.title}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({


  list: {
    width: "100%",
    backgroundColor: "hsl(0, 100%, 100%)",
  },

  listProfile: {
    width: "100%",
    height: 125,
    backgroundColor: "hsl(0, 100%, 100%)",
    display: 'flex',
    justifyContent: "center",
  },

  listProfileName: {
    marginLeft: 10,
    fontSize: 30,
    fontWeight: "500",
    color: "hsl(0, 0%, 10%)",
  },

  listProfileInfo: {
    marginLeft: 10,
    fontSize: 20,
    color: "hsl(0, 0%, 30%)",
  },

  listItemHeader: {
    backgroundColor: "hsl(0, 0%, 100%)",
    width: "100%",
    paddingBottom: 5,
    paddingTop: 5,
    borderTopColor: 'hsl(0, 0%, 90%)',
    borderTopWidth: 5
  },

  listItemHeaderText: {
    marginTop: "auto",
    marginBottom: "auto",
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "700",
    color: 'hsl(0, 0%, 30%)'
  },

  listItem: {
    width: "100%",
    height: 75,
    // backgroundColor: 'lightgray',
    // borderTopColor: "hsl(21, 78%, 48%)",
    // borderBottomColor: "hsl(21, 78%, 48%)",
    // borderTopWidth: 1,
    flex: 1,
    // alignItems: 'center',
    justifyContent: "center",
  },

  listItemText: {
    marginLeft: 10,
    fontSize: 25,
    fontWeight: '400',
    color: "hsl(0, 0%, 10%)"
  }
});
