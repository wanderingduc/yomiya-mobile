import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react'
import Request from '@/constants/Request';

const SignUp = () => { // NEEDS TESTING

    const [pword, setPword] = useState('');
    const [cpword, setCPword] = useState('');
    const [uname, setUname] = useState('');
    const [warn, setWarn] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (pword != cpword) {
            setWarn('Password does not match');
        } else {
            setWarn('');
        }
    }, [pword, cpword])

    const signup = async () => {

    const reqBody: Request = {
        user: {
            username: uname,
            password: pword,
            token: null
        },
        book: null,
        lib: null
    }

    const req = {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(reqBody)
    }

    await fetch('http://10.0.2.2:8080/dev/v1/users/create', req)
    .then((res) => {
        if (!res.ok) {
            throw new Error("User already exists")
        }
        return res.json()
    })
    .then((data) => {
        console.log(data.Data.user.token)
        setWarn('')
        router.replace({
            pathname: "/(tabs)/home",
            params: { name: uname, auth: data.Data.user.token },
          });
    })
    .catch((e) => {
        console.error(e)
        setWarn(e)
    })

    }

    return (
      <View style={styles.container}>
        <Text style={styles.logo}>Sign Up</Text>
        <Text style={styles.warning}>{warn}</Text>
        <Text style={styles.inputLbl}>Username:</Text>
        <TextInput
          style={styles.inputObj}
          placeholderTextColor={"hsl(21, 78%, 48%)"}
          underlineColorAndroid={"hsl(21, 78%, 48%)"}
          placeholder="Username"
          autoCapitalize="none"
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
        <Text style={styles.inputLbl}>Confirm Password:</Text>
        <TextInput
          style={styles.inputObj}
          secureTextEntry={true}
          placeholderTextColor={"hsl(21, 78%, 48%)"}
          underlineColorAndroid={"hsl(21, 78%, 48%)"}
          placeholder="Password"
          autoCorrect={false}
          spellCheck={false}
          maxLength={255}
          onChangeText={(text) => setCPword(text)}
        />
        {/* <Text>{creds}</Text> DEBUG */}
        <TouchableOpacity style={styles.inputBtn} onPress={signup}>
          <Text style={styles.inputBtnTxt}>Sign Up</Text>
        </TouchableOpacity>
        <Text style={styles.create}>
            Back to{" "}
            <Link style={styles.link} href="/" replace>
                Login
            </Link>
        </Text>
      </View>
    );
}

export default SignUp

const styles = StyleSheet.create({
  container: {
    backgroundColor: "hsl(21, 100%, 100%)",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    fontSize: 50,
    marginBottom: 10,
    color: "hsl(21, 78%, 48%)",
  },

  warning: {
    marginBottom: 40,
    color: "red",
    fontSize: 15,
  },

  inputLbl: {
    // backgroundColor: "lightblue",
    fontSize: 22,
    width: "75%",
    color: "hsl(21, 78%, 48%)",
    paddingLeft: 3,
  },

  inputObj: {
    // backgroundColor: "lightgray",
    // backgroundColor: "hsl(0, 0%, 100%)",
    width: "75%",
    height: 50,
    marginBottom: 50,
    color: "hsl(21, 78%, 48%)",
    fontSize: 20,
  },

  inputBtn: {
    width: "35%",
    height: 50,
    backgroundColor: "hsl(21, 78%, 48%)",
    borderRadius: 25,
    marginTop: 50,
  },

  inputBtnTxt: {
    margin: "auto",
    textAlign: "center",
    fontSize: 25,
    color: "hsl(21, 100%, 100%)",
  },

  create: {
    marginTop: 35,
    fontSize: 15,
  },

  link: {
    color: "blue",
  },
});
