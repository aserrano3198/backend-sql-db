import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, TextInput, TouchableHighlight, Image, StyleSheet, Dimensions, Alert, ScrollView, Touchable } from 'react-native';
import { getPermissionsAsync } from 'expo-camera';

export function verify({navigation, route}) {
    const [loading, setLoading] = useState(true);
    const [fotos, setFotos] = useState([]);

    useEffect(() => {
        let isApiSubscribed = true;
        axios.get("http://172.20.10.2:8080/api/v1/fotos").then((response) => {
            if (isApiSubscribed) {
                // console.log(response.data)
                setFotos(response.data);
                setLoading(false);
            }
        });
        return () => {
            isApiSubscribed = false;
        }
    }, []);

    const getPic = (im, id, userId, vehId) => {
        var pic = im.slice(11,-2);
        // console.log(pic);
        navigation.navigate("verifying", {pic:pic, id:id, userId: userId, vehId: vehId})
    }

    if (loading) return (
        <View>
            <Text>Loading...</Text>
        </View>
    )
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image style={{ width: 100, height: 100, alignItems: 'center' }} source={require('../assets/def.png')} />
                <Text
                    style={{ color: '#333333', fontWeight: 'bold', fontFamily: 'Baskerville-Bold', fontSize: 30 }}>
                    Hi-Go!
                </Text>
            </View>
            <ScrollView style={styles.user}>
                <Image style={{ top: 20, left: 20, width: 150, height: 150, alignItems: 'center' }} source={require('../assets/admin.png')} />
                <View style={styles.info}>
                    <Text style={styles.texto}>Fotos en total: {fotos.length}</Text>
                    {fotos.map((pic) => (
                        <TouchableHighlight onPress={() => getPic(pic.imagen, pic.id, pic.user_id, pic.vehiculo_id)}>
                            <View style={{ height: 60, }}>
                                
                                <Text style={styles.texto2}>Foto </Text>
                            </View>
                        </TouchableHighlight>
                    ))}
                </View>
            </ScrollView>
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
    user: {
        backgroundColor: '#333333',
        // height: 700
    },
    info: {
        top: 50,
        marginBottom: 20,
    },
    texto: {
        marginBottom: 5,
        fontSize: 25,
        fontWeight: 'bold',
        fontFamily: 'Times New Roman',
        color: '#fefae0',
        top: 10,
        left: 17
    },
    texto2: {
        marginBottom: 5,
        fontSize: 25,
        fontWeight: 'bold',
        fontFamily: 'Times New Roman',
        color: '#fefae0',
        top: 10,
        marginLeft: 30
        // left: Dimensions.get('window').width * 0.3,
    },
    button: {
        alignSelf: 'center',
        // width: 150,
        width: Dimensions.get('window').width * 0.45,
        left: 5,
        height: 60,
        bottom: 15,
        borderRadius: 50,
        backgroundColor: '#fefae0',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 25,
        top: 15
    },
    textButton: {
        color: '#333333',
        fontWeight: 'bold',
        fontFamily: 'AmericanTypewriter-Bold',
        fontSize: 35
    },
    buttonSubmit: {
        alignSelf: 'center',
        // width: 150,
        // width: Dimensions.get('window').width * 0.45,
        left: 5,
        height: 60,
        bottom: 15,
        borderRadius: 50,
        backgroundColor: '#fefae0',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 25,
        top: 15
    },
    mal: {
        // marginBottom: 5,
        fontSize: 15,
        fontWeight: 'bold',
        fontFamily: 'Times New Roman',
        color: '#F9C74F',
        left: 10,
        alignItems: 'center'
    }
});
export default verify;