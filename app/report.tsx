import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Request from '@/constants/Request';

const report = () => {

    const [bug, setBug] = useState('');
    const [user, setUser] = useState('');

    const report = async () => {

        const reqBody: Request = {
            user: {
                username: user,
                password: null,
                created_at: null,
                updated_at: null,
                token: bug
            },
            book: null,
            lib: null
        }

        const req = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reqBody)
        }

        await fetch('http://10.0.2.2:8080/dev/v1/bug/report', req)
        .then((res) => {
            if (!res.ok) {
                console.log(res.status)
                throw new Error("Error report")
            }
            return res.json()
        })
        .catch((e) => {
            console.error(e)
        })

    }

    const getCreds = async () => {
        await AsyncStorage.getItem("user").then((u) => !u ? setUser('testuser') : setUser(u))
    }

    useEffect(() => {
        getCreds()
    })

  return (
    <View style={styles.container} >
      <Text style={styles.title} >Description:</Text>
      <TextInput 
        multiline={true}
        placeholder='Description of bug...'
        style={styles.input}
        onChangeText={(text) => setBug(text)}
      />
      <TouchableOpacity style={styles.subButton} onPress={report} ><Text style={styles.subButtonText} >Submit</Text></TouchableOpacity>
    </View>
  )
}

export default report


const styles = StyleSheet.create({

    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },

    title: {
        marginTop: 50,
        width: '80%',
        height: 50,
        fontSize: 30,
    },

    input: {
        width: '80%',
        height: 250,
        textAlignVertical: 'top',
        backgroundColor: 'hsl(0, 0%, 100%)',
        borderColor: 'hsl(21, 78%, 48%)',
        borderWidth: 1,
        borderRadius: 5
    },

    subButton: {
        marginTop: 'auto',
        marginBottom: 25,
        width: '65%',
        height: 60,
        backgroundColor: 'hsl(21, 78%, 48%)',
        borderRadius: 30,
    },

    subButtonText: {
        marginVertical: 'auto',
        marginHorizontal: 'auto',
        textAlign: 'center',
        color: 'hsl(0, 0%, 100%)',
        fontSize: 22,
        fontWeight: '500'
    }

})