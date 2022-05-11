import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, TextInput, TouchableHighlight, Image, StyleSheet, Dimensions, Alert, ScrollView, Touchable } from 'react-native';

export function verifying({ navigation, route }) {
    const pic = route.params.pic;
    const id = route.params.id;
    const userId = route.params.userId;
    const vehId = route.params.vehId;

    const [saldos, setSaldos] = useState(null);

    const deleteFoto = async () => {
        try {
            const res = await axios.delete("http://172.20.10.2:8080/api/v1/fotos/" + id);
            if (res.status === 200) {
                Alert.alert('Foto verificada', ' ', [
                    { text: 'Ok', onPress: () => navigation.navigate("Admin") }
                ])
            }
        } catch (error) {
            console.log("error ", error);
        }
    };


    const addSaldo = async () => {
        try {
            // cambiar veh a mal aparcado
            try {
                console.log("vehiculo es: "+vehId);
                const res = await axios.post("http://172.20.10.2:8080/api/v1/vehiculos/" + vehId);
                if (res.status === 200) {
                    console.log("vehiculo cambiado a mal aparcado")
                }
            } catch (error) {
                console.log("error al cambiar a mal aparcado ", error);
            }

            // obtener saldo
            try {
                const res = await axios.get("http://172.20.10.2:8080/api/v2/user/" + userId);
                if (res.status === 200) {
                    console.log("saldo conseguido");
                    var saldo = res.data.saldo + 1;
                    console.log("saldo es: ", saldo);
                    try {
                        const res2 = await axios.put("http://172.20.10.2:8080/api/v2/user/saldo/" + userId + "/" + saldo);
                        if (res2.status === 200) {
                            console.log("saldo metido al user");
                        }
                    } catch (error) {
                        console.log("Ha habido un error " + error + " al hacer el put al saldo")
                    }
                }
            } catch (error) {
                alert("Ha habido un error " + error + " al hacer el get al saldo");
            }
            deleteFoto();
        } catch (error) {
            console.log("error ", error);
        }
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
            <View style={styles.user}>
                <Text style={styles.texto}>¿Está bien aparcado?</Text>
                <Image style={{ top: 15, height: 500 }} source={{ uri: 'data:image/jpeg;base64,' + pic }} />
                <View style={{ flexDirection: 'row', top: 15 }}>
                    <TouchableHighlight style={styles.button} onPress={() => deleteFoto()}>
                        <Text style={styles.textButton}>Sí</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.button} onPress={() => { deleteFoto(); }}>
                        <Text style={styles.textButton}>No</Text>
                    </TouchableHighlight>
                </View>
            </View>
        </View >
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
        // backgroundColor: '#333333',
        // height: 700
    },
    info: {
        // top: 50,
        marginBottom: 20,
    },
    texto: {
        marginBottom: 5,
        fontSize: 35,
        fontWeight: 'bold',
        fontFamily: 'Times New Roman',
        color: '#fefae0',
        top: 10,
        left: 17,
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
export default verifying;