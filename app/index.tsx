import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { StackActions, useNavigation } from '@react-navigation/native';

const Login = () => {

    const navigation = useNavigation();

    const [uname, setUname] = useState('');
    const [pword, setPword] = useState('');
    const [warn, setWarn] = useState('');

    useEffect(() => {
        setWarn('');
    }, [])

    // useEffect(() => {
    //     autoTokenCheck()
    // }, [])

    const storeToken = async (token: string) => {
        await AsyncStorage.setItem('token', token)
    };

    const clearToken = async () => {
        await AsyncStorage.removeItem('token');
    };

    const autoTokenCheck = async () => {
        const token = await AsyncStorage.getItem('token');

        const req = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(token)
        };

        fetch('http://10.0.2.2:8080/dev/v1/authtoken', req)
        .then((res) => {
            if (!res.ok) {
                throw new Error("Fuck you")
            }
            return res.json();
        })
        .then((data) => {
            // console.log(data.Data) // DEBUG
            navigation.dispatch(StackActions.replace('(tabs)'))
        })
        .catch((e) => {
            // console.log(e) // DEBUG
            setWarn('')
            navigation.dispatch(StackActions.replace('index'))
        })
    
    }

    const signin = () => {

        clearToken()

        if (uname == '' || pword == '') {
            setWarn('Invalid username or password');
            return;
        };

        const ob = {
            username: uname,
            password: pword
        };

        const req = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ob)
        };

        fetch('http://10.0.2.2:8080/dev/v1/auth', req)
        .then(res => {
            if (!res.ok) {
                throw new Error("Incorrect username or password");
            }
            return res.json();
        })
        .then(data => {
            setWarn('')
            storeToken(data.Data)
            navigation.dispatch(StackActions.replace('(tabs)'));
        })
        .catch((e) => {
            setWarn('Invalid username or password');
        })
    }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Honbako</Text>
      <Text style={styles.warning}>{warn}</Text>
      <Text style={styles.inputLbl}>Username:</Text>
      <TextInput
        style={styles.inputObj}
        placeholderTextColor={"hsl(21, 78%, 48%)"}
        underlineColorAndroid={"hsl(21, 78%, 48%)"}
        placeholder="Username"
        onChangeText={(text) => setUname(text)}
      />
      <Text style={styles.inputLbl}>Password:</Text>
      <TextInput
        style={styles.inputObj}
        secureTextEntry={true}
        placeholderTextColor={"hsl(21, 78%, 48%)"}
        underlineColorAndroid={"hsl(21, 78%, 48%)"}
        placeholder="Password"
        onChangeText={(text) => setPword(text)}
      />
      {/* <Text>{creds}</Text> DEBUG */}
      <TouchableOpacity 
      style={styles.inputBtn}
      onPress={signin}>
        <Text style={styles.inputBtnTxt}>
          Login
        </Text>
      </TouchableOpacity>
      <Text style={styles.create}>Don't have an account? <Link style={styles.link} href='/'>Create one</Link></Text>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
    container: {
      backgroundColor: "hsl(21, 100%, 100%)",
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  
    logo: {
      fontSize: 50,
      marginBottom: 35,
      color: 'hsl(21, 78%, 48%)'
    },

    warning: {
        marginBottom: 40,
        color: 'red',
        fontSize: 15
    },
  
    inputLbl: {
      // backgroundColor: "lightblue",
      fontSize: 22,
      width: '75%',
      color: 'hsl(21, 78%, 48%)',
      paddingLeft: 3
  
    },
  
    inputObj: {
      // backgroundColor: "lightgray",
      width: "75%",
      height: 50,
      marginBottom: 50,
      color: "hsl(21, 78%, 48%)",
      fontSize: 20,

    },
  
    inputBtn: {
      width: '35%',
      height: 50,
      backgroundColor: 'hsl(21, 78%, 48%)',
      borderRadius: 25,
      marginTop: 50
  
    },
  
    inputBtnTxt: {
      margin: 'auto',
      textAlign: 'center',
      fontSize: 25,
      color: 'hsl(21, 100%, 100%)'
    },

    create: {
        marginTop: 35,
        fontSize: 15
    },

    link: {
        color: 'blue'
    }
  
  });
  