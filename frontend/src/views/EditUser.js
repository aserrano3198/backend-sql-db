import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { View, Text, TextInput, TouchableHighlight, StyleSheet, Image } from 'react-native';


export function EditUser({navigation, route}) {
    const user_id = route.params.user_id;
    const isAdmin = route.params.isAdmin;
    const username = route.params.username;
    const [nombre, setNombre] = useState("");

    function Cambiar(){
      axios.put("http://172.20.10.2:8080/api/v2/user/" +user_id+ "/"+nombre)
      .then(
          alert("User modificado"),
          navigation.navigate("Map", {isAdmin: false, id: user_id})   
        )
        .catch(error =>{
            alert("Error" +error)
        })}

    function Borrar(){
      axios.delete("http://172.20.10.2:8080/api/v2/user/delete/" +user_id)
      .then(
        alert("User eliminado"),

          navigation.navigate("Home")   
      )
      .catch(error =>{
        alert("Error" +error)
    })}
    
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image style={{ width: 100, height: 100, alignItems: 'center' }} source={require('../assets/def.png')} />
                <Text
                    style={{ color: '#333333', fontWeight: 'bold', fontFamily: 'Baskerville-Bold', fontSize: 30 }}>
                    Hi-Go!
                </Text>
            </View>
            <View style={styles.user}>
                <Image style={{ top: 20, left: 20, width: 150, height: 150, alignItems: 'center' }} source={require('../assets/Avatar.png')} />
                <View style={styles.info}>
                    <Text style={styles.texto}>Nombre: {username} </Text>
            <TextInput
                style={styles.input}
                placeholder="Username..."
                value={nombre}
                onChangeText={(text) => setNombre(text)}
            />

                <TouchableHighlight style={styles.button} onPress={() => Cambiar()}>
                    <Text style={styles.textButton}>Cambiar</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.button} onPress={() => Borrar()}>
                    <Text style={styles.textButton}>Borrar</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.button} onPress={() => navigation.navigate("Map", {id:user_id, isAdmin: isAdmin})}>
                    <Text style={styles.textButton}>Volver</Text>
                </TouchableHighlight>
                </View>
            </View>
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
    header: {
        justifyContent: 'space-around',
        flexDirection: 'row',
        alignItems: 'center',
    },
    user: {
        backgroundColor: '#FEFAE0',
        height: 700
    },
    info: {
        // left: 70,
        top: 70,
        marginBottom: 20
    },
    texto: {
        marginBottom: 5,
        fontSize: 25,
        fontWeight: 'bold',
        fontFamily: 'Times New Roman'
    },
    button: {
        alignSelf: 'center',
        width: 350,
        height: 60,
        bottom: 15,
        top: 130,
        borderRadius: 50,
        backgroundColor: '#333333',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 25
    },
    textButton: {
        color: '#FEFAE0',
        fontWeight: 'bold',
        fontFamily: 'AmericanTypewriter-Bold',
        fontSize: 40
    }
});
export default EditUser;