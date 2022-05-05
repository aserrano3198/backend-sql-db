import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { View, Text, TextInput, TouchableHighlight, Image } from 'react-native';

// Mapa google maps
import { StyleSheet, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { mapStyle } from './mapStyle';
import { default as Bici } from '../assets/vmps/BiciDisp.png';
import { default as BiciNo } from '../assets/vmps/BiciNoDisp.png';
import { default as Patinete } from '../assets/vmps/patineteDisp.png';
import { default as PatineteNo } from '../assets/vmps/patineteNoDisp.png';

export function Map(props) {
    // get todos los vehiculos
    const [loading, setLoading] = useState(true);
    const [MARKERS_DATA, setMarkers] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("http://192.168.31.213:8080/api/v1/vehiculos");
                setMarkers(res.data);
                setLoading(false);
            } catch (error) {
                console.log("error", error);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <View>
            <Text>Loading...</Text>
        </View>
    );
    else {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image style={{ width: 100, height: 100, alignItems: 'center' }} source={require('../assets/def.png')} />
                    <Text
                        style={{ color: '#333333', fontWeight: 'bold', fontFamily: 'Baskerville-Bold', fontSize: 30 }}>
                        Hi-Go!
                    </Text>
                    <View style={styles.profiles}>
                        <TouchableHighlight onPress={() => props.navigation.navigate("User")}>
                            <Image style={{ width: 50, height: 50, alignItems: 'center' }} source={require('../assets/Avatar.png')} />
                        </TouchableHighlight>
                        <View style={styles.admin}>
                            <TouchableHighlight onPress={() => props.navigation.navigate("Admin")}>
                                <View style={styles.admin}>
                                    <Image style={{ width: 50, height: 50, alignItems: 'center' }} source={require('../assets/admin.png')} />
                                    <View style={styles.conTexto}>
                                        <Text style={styles.texto}>Admin</Text>
                                    </View>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>

                <MapView
                    customMapStyle={mapStyle}
                    provider={PROVIDER_GOOGLE}
                    style={styles.mapStyle}
                    initialRegion={{
                        latitude: 40.45315837994751,
                        longitude: -3.7266484767199968,
                        latitudeDelta: 0.003,
                        longitudeDelta: 0.003,
                    }}
                    mapType="standard"
                >
                    {console.log(MARKERS_DATA)}
                    {MARKERS_DATA.map((marker) => (
                        <Marker
                            key={marker.id}
                            coordinate={{
                                latitude: marker.latitud,
                                longitude: marker.longitud,
                            }}
                            onPress={() => marker.libre ? 
                                (marker.tipo === "bike" ? 
                                    props.navigation.navigate("BikeInfo", {id: marker.id, tipo: marker.tipo}) : 
                                    props.navigation.navigate("PatineteInfo", {id: marker.id, tipo: marker.tipo})
                                ) : props.navigation.navigate("noDisponible")}
                            style={styles.marker}
                        >
                            <View style={{ width: 50 }}>
                                <Image source={
                                    marker.libre ?
                                        marker.tipo === "bike" ? Bici : Patinete
                                        : marker.tipo === "bike" ? BiciNo : PatineteNo
                                } />
                            </View>
                        </Marker>
                    ))}
                    <TouchableHighlight style={styles.button} onPress={() => props.navigation.navigate("QR")}>
                        <Text style={styles.textButton} >Leer QR</Text>
                    </TouchableHighlight>

                </MapView>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3EA9FA',
        // alignItems: 'center',
        justifyContent: 'space-around',
        // padding: 15
    },
    header: {
        justifyContent: 'space-around',
        flexDirection: 'row',
        alignItems: 'center',
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        //   height: Dimensions.get('window').height,
        height: 700
    },
    marker: {
        width: 500
    },
    profiles: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    admin: {
        alignItems: 'center',
        flexDirection: 'column'
    },
    conTexto: {
        top: 5,
        borderRadius: 50,
        padding: 5,
        backgroundColor: '#333333',
        alignItems: 'center',
        justifyContent: 'center'
    },
    texto: {
        color: '#FEFAE0',
        fontWeight: 'bold',
        fontFamily: 'AmericanTypewriter-Bold',
        fontSize: 15
    },
    button: {
        alignSelf: 'center',
        width: 250,
        height: 60,
        top: Dimensions.get("window").height * 0.6,
        bottom: 15,
        borderRadius: 50,
        backgroundColor: '#fefae0',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 25
    },
    textButton: {
        color: '#333333',
        fontWeight: 'bold',
        fontFamily: 'AmericanTypewriter-Bold',
        fontSize: 35
    }
});

export default Map;