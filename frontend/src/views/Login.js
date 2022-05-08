import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { View, Text, TextInput, StyleSheet, TouchableHighlight, Image } from 'react-native';


export function Login(props) {
    const [nombre, setNombre] = useState("");
    const [password, setPassword] = useState("");
    const[isadmin, setisadmin] =useState(false);
    const[shown, setShown] = useState(false);
    

    function Submit (){
        
        axios.post('http://192.168.1.127:8080/api/auth/signin', {username: nombre,
        password: password})
        .then(res => {  
            props.navigation.navigate("Map")
             
             if(res.data.roles[0]== "ROLE_ADMIN"){
                setisadmin(true)
                props.navigation.navigate("Map")

             }
            
          }
         
          )
          .catch(error=>{
            alert("Usuario no encontrado")
            props.navigation.navigate("Home")

          })
    }

    const switchShown = () => setShown(!shown);


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image style={{ width: 100, height: 100, alignItems: 'center' }} source={require('../assets/def.png')} />
                <Text
                    style={{ color: '#333333', fontWeight: 'bold', fontFamily: 'Baskerville-Bold', fontSize: 30 }}>
                    Hi-Go!
                </Text>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Username..."
                value={nombre}
                onChangeText={(text) => setNombre(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña..."
                value={password}
                onChangeText={(text) =>{ setPassword(text);}}
            />

            <TouchableHighlight style={styles.button} onPress={() => Submit()}>
                <Text style={styles.textButton}>Log in</Text>
            </TouchableHighlight>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3EA9FA',
        // alignItems: 'center',
        justifyContent: 'space-around',
        padding: 15
    },
    header: {
        justifyContent: 'space-around',
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        padding: 15,
        margin: 10,
        backgroundColor: 'white',
        color: 'black',
        borderWidth: 3,
        borderColor: 'black',
        fontSize: 25,
        fontWeight: 'bold',
        fontFamily: 'Times New Roman'
        // textAlign: 'center'
    },
    button: {
        alignSelf:'center',
        width: 242,
        height: 60,
        bottom: 15,
        borderRadius: 50,
        backgroundColor: '#333333',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textButton: {
        color: '#FEFAE0',
        fontWeight: 'bold',
        fontFamily: 'AmericanTypewriter-Bold',
        fontSize: 40
    }
});

export default Login;