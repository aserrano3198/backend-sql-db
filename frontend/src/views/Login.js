import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { View, Text, TextInput, StyleSheet, TouchableHighlight, Image } from 'react-native';


export function Login(props) {
    const [nombre, setNombre] = useState("");
    const [password, setPassword] = useState("");
    const [isadmin, setisadmin] = useState(false);
    const [id, setId] = useState();
    


    function Submit() {

        axios.post('http://172.20.10.13:8080/api/auth/signin', {
            username: nombre,
            password: password
        })
            .then(res => {

                if (res.data.roles[0] == "ROLE_ADMIN") {
                    setisadmin(true)
                    setId(res.data.id)
                    props.navigation.navigate("User", { id: id }) 
                    props.navigation.navigate("EditUser", { id: id }) 
                    props.navigation.navigate("Map")
                    
                }else {
                    setisadmin(false)
                    var g= res.data.id;
                    setId(g)
                    // props.navigation.navigate("User", { id: id }) 
                    // props.navigation.navigate("EditUser", { id: id })
                    // props.navigation.navigate("Map", { admin: isadmin }) 
                    props.navigation.navigate("EditUser")   
                }
                
            }
            )
            .catch(error => {
                alert(res.data.message)
                props.navigation.navigate("Home")

            })
    }
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
                type="password"
                style={styles.input}
                placeholder="Contraseña..."
                value={password}
                secureTextEntry={true}
                onChangeText={(text) => { setPassword(text); }}
            />
            

            <TouchableHighlight style={styles.button} onPress={() =>
                 Submit()
                 }>
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
        alignSelf: 'center',
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