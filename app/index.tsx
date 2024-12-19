import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';

const Login = () => {

  const router = useRouter()


    const [uname, setUname] = useState('');
    const [pword, setPword] = useState('');
    const [warn, setWarn] = useState('');

    useEffect(() => {
        setWarn('');
    }, [])

    useEffect(() => {
        autoTokenCheck()
    }, [])

    const storeToken = async (token: string, user: string) => {
        await AsyncStorage.setItem('token', token)
        await AsyncStorage.setItem('user', user)
    };

    const clearToken = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user')
    };

    const autoTokenCheck = async () => {
        const token = await AsyncStorage.getItem('token');
        const user = await AsyncStorage.getItem('user')

        const req = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(token)
        };

        fetch('http://10.0.2.2:8080/dev/v1/users/authtoken', req)
        .then((res) => {
            if (!res.ok) {
                throw new Error("Fuck you")
            }
            return res.json();
        })
        .then((data) => {
            // console.log(data.Data) // DEBUG
            router.replace({ pathname: '/(tabs)/home', params: { name: user, auth: token }})
        })
        .catch((e) => {
            setWarn('')
            clearToken()
        })
    
    }

    const signin = () => {

        clearToken()

        if (uname == '' || pword == '') {
            setWarn('Invalid username or aqpassword');
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

        fetch('http://10.0.2.2:8080/dev/v1/users/auth', req)
        .then(res => {
            if (!res.ok) {
                throw new Error("Incorrect username or password");
            }
            return res.json();
        })
        .then(data => {
            setWarn('')
            storeToken(data.Data, uname)
            router.replace({ pathname: '/(tabs)/home', params: { name: uname, auth: data.Data }})
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
        autoCapitalize='none'
        autoCorrect={false}
        spellCheck={false}
        maxLength={255}
        onChangeText={(text) => setUname(text)}
      />
      <Text style={styles.inputLbl}>Password:</Text>
      <TextInput
        style={styles.inputObj}
        secureTextEntry={true}
        placeholderTextColor={"hsl(21, 78%, 48%)"}
        underlineColorAndroid={"hsl(21, 78%, 48%)"}
        placeholder="Password"
        autoCorrect={false}
        spellCheck={false}
        maxLength={255}
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
      backgroundColor: 'hsl(0, 0%, 100%)',
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
  