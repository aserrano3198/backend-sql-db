import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['expo-permissions is now deprecated']);
LogBox.ignoreLogs(['Failed prop type']);
LogBox.ignoreLogs(['Each child in a list should have a unique']);

import { View, Text, TextInput, TouchableHighlight, Image, Alert } from 'react-native';

// Mapa google maps
import { StyleSheet, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polygon } from 'react-native-maps';
import { mapStyle } from './mapStyle';
import { default as Bici } from '../assets/vmps/BiciDisp.png';
import { default as BiciNo } from '../assets/vmps/BiciNoDisp.png';
import { default as Patinete } from '../assets/vmps/patineteDisp.png';
import { default as PatineteNo } from '../assets/vmps/patineteNoDisp.png';

// Geolocalización usuarios
import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location'

// Marcadores Zonas Recomendadas
import { locations } from './Data';

//FUNCIÓN: MAPA GOOGLE MAPS
export function Map({ navigation, route }) {
    const [loading, setLoading] = useState(true);
    const [MARKERS_DATA, setMarkers] = useState([]);
    const user_id = route.params.id;
    const isAdmin = route.params.isAdmin;
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const state = {
        coordinates: [
            { name: '1', latitude: 40.473985, longitude: -3.738114 },
            { name: '2', latitude: 40.453471, longitude: -3.744472 },
            { name: '3', latitude: 40.413749, longitude: -3.724002 },
            { name: '4', latitude: 40.396803, longitude: -3.708909 },
            { name: '5', latitude: 40.399517, longitude: -3.668575 },
            { name: '6', latitude: 40.418321, longitude: -3.658993 },
            { name: '7', latitude: 40.432926, longitude: -3.660747 },
            { name: '8', latitude: 40.455076, longitude: -3.663402 },
            { name: '9', latitude: 40.479948, longitude: -3.674229 },
            { name: '10', latitude: 40.482495, longitude: -3.685906 }
        ]
    }

    useEffect(() => {
        (async () => {
            console.log("este es el admin: " + isAdmin);
            console.log("este es la id: " + user_id);
            const response = await getCurrentLocation()
            if (response.status) {
                //setLocationMapa(response.location)
                console.log(response.location)
            }
        })()
        let isApiSubscribed = true;
        axios.get("http://172.20.10.2:8080/api/v1/vehiculos").then((response) => {
            if (isApiSubscribed) {
                setMarkers(response.data);
                setLoading(false);
            }
        });
        return () => {
            isApiSubscribed = false;
        }
    }, []);

    async function getVehiculos() {
        const res = await axios.get("http://172.20.10.2:8080/api/v2/user/{id}");
        console.log(res.data);
        return res.data;
    }

    async function getUser() {
        const res = await axios.get("http://172.20.10.2:8080/api/v2/user/" + user_id);
        navigation.navigate("User", { user_id: user_id, isAdmin: isAdmin, username: res.data.username, email: res.data.email, saldo: res.data.saldo })
    }

    if (loading) return (
        <View>
            <Text>Loading...</Text>
        </View>
    )
    else {
        if (isAdmin) {
            return (

                <View style={styles.container}>
                    <View style={styles.header}>
                        <Image style={{ width: 100, height: 100, alignItems: 'center' }} source={require('../assets/def.png')} />
                        <Text
                            style={{ color: '#333333', fontWeight: 'bold', fontFamily: 'Baskerville-Bold', fontSize: 30 }}>
                            Hi-Go!
                        </Text>
                        <View style={styles.profiles}>
                            <TouchableHighlight onPress={() => getUser()}>
                                <Image style={{ width: 50, height: 50, alignItems: 'center' }} source={require('../assets/Avatar.png')} />
                            </TouchableHighlight>
                            <View style={styles.admin}>
                                <TouchableHighlight onPress={() => navigation.navigate("Admin")}>
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
                        showsUserLocation={true}
                    >
                        {
                            locations.map((marker) => (
                                <Marker
                                    coordinate={{
                                        latitude: marker.latitude,
                                        longitude: marker.longitude
                                    }}
                                    title={marker.title}
                                />
                            ))
                        }
                        <Polygon
                            coordinates={state.coordinates}
                        />
                        {MARKERS_DATA.map((marker) => (
                            <Marker
                                key={marker.id}
                                coordinate={{
                                    latitude: marker.latitud,
                                    longitude: marker.longitud,
                                }}
                                // onPress={() => {getDistance(marker.latitud, marker.longitud);
                                onPress={() => {
                                    {
                                        marker.libre ?
                                            (marker.tipo === "bike" ?
                                                navigation.navigate("BikeInfo", { id: marker.id, tipo: marker.tipo, }) :
                                                navigation.navigate("PatineteInfo", { id: marker.id, tipo: marker.tipo })
                                            ) : navigation.navigate("noDisponible")
                                    }
                                }}
                                style={styles.marker}
                            // opacity={marker.libre ? 1.0 : 0.0}
                            >
                                <View style={{ width: 50 }}>
                                    <Image source={
                                        marker.libre ?
                                            marker.tipo === 'bike' ? Bici : Patinete
                                            : marker.tipo === 'bike' ? BiciNo : PatineteNo
                                    } />
                                </View>
                            </Marker>
                        ))}
                        <View>
                            <TouchableHighlight style={styles.button} onPress={() => navigation.navigate("QR", { user_id: user_id, isAdmin: isAdmin })}>
                                <Text style={styles.textButton} >Leer QR</Text>
                            </TouchableHighlight>
                        </View>
                    </MapView>
                </View>
            );

        }
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
                            <TouchableHighlight onPress={() => getUser()}>
                                <Image style={{ width: 50, height: 50, alignItems: 'center' }} source={require('../assets/Avatar.png')} />
                            </TouchableHighlight>
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
                        showsUserLocation={true}
                    >
                        {
                            locations.map((marker) => (
                                <Marker
                                    coordinate={{
                                        latitude: marker.latitude,
                                        longitude: marker.longitude
                                    }}
                                    title={marker.title}
                                />
                            ))
                        }
                        <Polygon
                            coordinates={state.coordinates}
                        />
                        {MARKERS_DATA.map((marker) => (
                            <Marker
                                key={marker.id}
                                coordinate={{
                                    latitude: marker.latitud,
                                    longitude: marker.longitud,
                                }}
                                onPress={() => marker.libre ?
                                    (marker.tipo === "bike" ?
                                        navigation.navigate("BikeInfo", { id: marker.id, tipo: marker.tipo, location: getCurrentLocation() }) :
                                        navigation.navigate("PatineteInfo", { id: marker.id, tipo: marker.tipo, location: getCurrentLocation() })
                                    ) : navigation.navigate("noDisponible")}
                                style={styles.marker}
                            // opacity={marker.libre ? 1.0 : 0.0}
                            >
                                <View style={{ width: 50 }}>
                                    <Image source={
                                        marker.libre ?
                                            marker.tipo === 'bike' ? Bici : Patinete
                                            : marker.tipo === 'bike' ? BiciNo : PatineteNo
                                    } />
                                </View>
                            </Marker>
                        ))}
                        <View>
                            <TouchableHighlight style={styles.button} onPress={() => navigation.navigate("QR", { user_id: user_id })}>
                                <Text style={styles.textButton} >Leer QR</Text>
                            </TouchableHighlight>
                        </View>
                    </MapView>
                </View>
            );
        };
    }
};
//GEOLOCALIZACIÓN DE LOS USUARIOS
export const getCurrentLocation = async () => {
    const response = { status: false, location: null }
    const resultPermissions = await Permissions.askAsync(Permissions.LOCATION)
    if (resultPermissions.status === "denied") {
        alert("Debes dar permisos para la localización.")
        return response
    }
    const position = await Location.getCurrentPositionAsync({})
    const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001
    }
    response.status = true
    response.location = location
    return response
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
    },
    marker: {
        width: 500
    }
});

export default Map;