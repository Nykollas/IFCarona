
import React, { Component } from 'react';

import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
    Switch,
    ActivityIndicator,
} from 'react-native';
import {systemWeights} from 'react-native-typography';
import { Header } from 'react-navigation';
import MapView, { Marker } from "react-native-maps";
import NumericInput from 'react-native-numeric-input';
import Geocoder from 'react-native-geocoding';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapViewDirections from 'react-native-maps-directions';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import firebase from 'firebase';

const API_KEY_GOOGLE_MAPS = "AIzaSyDNlio27LqraNed4EAIjmjBiuEQ46UjyIg";
INCREMENT = Number(Header.HEIGHT / hp('100%') * 100).toFixed(2).concat("%");
export default class MinhaPostagem extends Component {

    state = {
        preco: 3,
        contato: '',
        prev_contato: '',
        desc: '',
        procura: true,
        descr_start: null,
        descr_end: null,
        start: { latitude: -21.6998412, longitude: -45.8928529 },
        end: { latitude: -21.6998412, longitude: -45.8928529 },
        found: false,
        founding: false,
        region: null,
        switch_text: "Ofereço carona",
    }
    erro_in_add = 0;
    initialRegion = {
        latitude: this.state.start.latitude,
        longitude: this.state.start.longitude,
        latitudeDelta: 0.003,
        longitudeDelta: 0.0011,
    }
    deformatContato(string) {
        arr = new Array(200);
        var counter = 0
        for (var y = 0; y < string.length; y++) {
            if (string[y] != '(' && string[y] != ')' && string[y] != '-') {
                arr[counter] = string[y];
                counter++;
            }
        }
        return arr.join('');
    }
    formatContato(string, prev) {

        var counter = 0;

        if (prev.length < string.length) {
            var str_len = string.length;
            var arr = new Array(str_len + 3);
            if (string != '') {
                arr[0] = '(';
                arr[3] = ')';
                arr[9] = '-';
                for (var x = 0; x < str_len + 3; x++) {
                    if (arr[x] == null) {
                        arr[x] = string[counter];
                        counter++;
                    }
                }
                new_str = arr.join('');
                return new_str;
            }
        } else {
            var str_len = string.length;
            var arr_length = 0;

            if (prev != '') {
                if (str_len < 3) {
                    arr_length = str_len + 1;
                    var arr = new Array(arr_length);
                    arr[0] = '(';

                }
                else if (str_len >= 3 && str_len < 8) {
                    arr_length = str_len + 2;
                    var arr = new Array();
                    arr[0] = '(';
                    arr[3] = ')';

                } else {
                    arr_length = str_len + 3
                    var arr = new Array(arr_length);
                    arr[0] = '(';
                    arr[3] = ')';
                    arr[9] = '-';

                }
                for (var x = 0; x < arr_length; x++) {
                    if (arr[x] == null) {
                        arr[x] = string[counter];
                        counter++;
                    }
                }
                new_str = arr.join('');
                return new_str;
            }
        }
    }

    validateDados = () => {
        if (this.state.preco == null) {
            Alert.alert(
                '',
                "Preço indefinido",
                [
                    { text: 'OK', },
                ],
                { cancelable: false },
            );
            return 0;
        } else if (this.state.contato == null) {
            Alert.alert(
                '',
                "WhatsApp inválido",
                [
                    { text: 'OK', },
                ],
                { cancelable: false },
            );
        }

        var con_len = this.state.contato.length;
        var price_len = this.state.preco.length;
        if (con_len != 11) {
            Alert.alert(
                '',
                "WhatsApp inválido",
                [
                    { text: 'OK', },
                ],
                { cancelable: false },
            );
            return 0;
        } else {
            for (var x = 0; x < con_len; x++) {
                if (isNaN(parseInt(this.state.contato[x], 10))) {
                    Alert.alert(
                        '',
                        "WhatsApp inválido",
                        [
                            { text: 'OK' },
                        ],
                        { cancelable: false },
                    );
                    return 0;
                }
            }
        }
        for (var x = 0; x < price_len; x++) {
            if (isNaN(parseInt(this.state.preco[x], 10))) {
                Alert.alert(
                    '',
                    "Whatsapp inválido",
                    [
                        { text: "OK" },
                    ],
                    { cancelable: false },
                );
                return 0;
            }
        }
        if (this.state.preco == '') {
            Alert.alert(
                '',
                "Preço inválido",
                [
                    { text: "OK" },
                ],
                { cancelable: false },
            );
            return 0;

        }

        return 1;
    }

    getOferta = () => {
        var userId = firebase.auth().currentUser.uid;
        firebase.database().ref("ofertas/" + userId).on("value", (snapshot) => {
            if (!snapshot.val()) {
                console.log("Não existem ofertas");
                return;
            }
            this.setState({
                start: snapshot.val().start,
                end: snapshot.val().end,
                preco: snapshot.val().preco,
                contato: snapshot.val().contato,
                procura: snapshot.val().procura,
                descr_end: snapshot.val().descr_end,
                descr_start: snapshot.val().descr_start,
                found: true,
            })
            this.getLocation(this.state.descr_start, this.state.descr_end);
        });
    }

    addOferta = () => {
        if (!this.validateDados()) {
            return;
        };
        var userId = firebase.auth().currentUser.uid;
        firebase.database().ref('user/' + userId).on('value',
            (snapshot) => {
                nome = snapshot.val().nome;
                avatar = snapshot.val().avatar;
                firebase.database().ref('ofertas/' + userId)
                    .set({
                        start: this.state.start,
                        end: this.state.end,
                        preco: this.state.preco,
                        nome: nome, contato: this.state.contato,
                        avatar: avatar,
                        procura: this.state.procura,
                        descr_start: this.state.descr_start,
                        descr_end: this.state.descr_end,
                    }).catch((error) => {
                        this.erro_in_add = 1;
                        Alert.alert(
                            '',
                            error.message,
                            [
                                { text: 'OK', },
                            ],
                            { cancelable: false },
                        );
                    }
                    );
            }
        );
        if (!this.erro_in_add) {
            Alert.alert(
                '',
                'Oferta adicionada com sucesso!',
                [
                    { text: 'OK', },
                ],
                { cancelable: false },
            );
            this.props.navigation.navigate('Home');
        } else {
            this.erro_in_add = 0;
        }
    }

    getLocation = (descr_start, descr_end) => {
        this.setState({ founding: true })
        console.log(descr_start);
        console.log(descr_end);
        Geocoder.from(descr_start)
            .then(json => {
                var start = { latitude: null, longitude: null };
                start.latitude = json.results[0].geometry.location.lat;
                start.longitude = json.results[0].geometry.location.lng;


                return start;
            }).then((start) => {
                this.setState({ start: start });
                Geocoder.from(descr_end)
                    .then(json => {
                        var end = { latitude: null, longitude: null };
                        end.latitude = json.results[0].geometry.location.lat;
                        end.longitude = json.results[0].geometry.location.lng;
                        this.setState({ end: end, found: true, founding: false });
                        this.goToOriginRegion();
                    })
            })
            .catch(error => {
                this.setState({ founding: false });
                Alert.alert(
                    '',
                    //"Houve um erro ao traçar a rota por favor cheque os dados inseridos",
                    error.error_message,
                    [
                        { text: 'OK', },
                    ],
                    { cancelable: false },
                );
            });


    }

    setStart = (value) => {
        this.setState({ descr_start: value });
    }

    setEnd = (value) => {

        this.setState({ descr_end: value });
    }

    switchProcura = () => {
        if (this.state.procura) {
            this.setState({ procura: false, switch_text: "Ofereço carona" });
        } else {
            this.setState({ procura: true, switch_text: "Procuro carona" });
        }

    }

    goToOriginRegion = () => {
        region = {
            latitude: this.state.start.latitude,
            longitude: this.state.start.longitude,
            latitudeDelta: 0.003,
            longitudeDelta: 0.0011,
        }
        this.setState({ region: region });
    }

    goToDestRegion = () => {
        region = {
            latitude: this.state.end.latitude,
            longitude: this.state.end.longitude,
            latitudeDelta: 0.003,
            longitudeDelta: 0.0011,
        }
        this.setState({ region: region });
    }

    componentDidMount = () => {
        this.getOferta();
    }
    setRefForNumericInput = () => {
        if (this._preco_input == null) {


        } else {
            this._preco_input.ref._saida_input = this._saida_input
        }
    }


    render() {
        return (

            <View style={styles.body}>
                <ScrollView ref={(component) => { this.scroll = component }} style={{ flex: 1 }}>
                    <View style={styles.card}>
                        <View style={styles.form}>
                            <View style={styles.switch}>
                                <Switch value={this.state.procura} onValueChange={this.switchProcura} />
                                <Text style={[styles.text_switch, { marginRight: wp("3%") }]}>{this.state.switch_text}</Text>
                            </View>
                            <View style={styles.input_tel_container}>
                                <View style={styles.input_tel_icon}>
                                    <Icon name="whatsapp" size={0.57 * hp(INCREMENT)} color='#353535' />
                                </View>
                                <TextInput returnKeyType={"next"}
                                    onSubmitEditing={() => this._preco_input.ref.focus()}
                                    maxLength={14}
                                    keyboardType='number-pad'
                                    style={styles.input_tel}
                                    placeholder="Contato Ex. (00)91234-56789"
                                    value={this.formatContato(this.state.contato, this.state.prev_contato)}
                                    onChangeText={(tel) => {
                                        var str = this.deformatContato(tel);
                                        this.setState((prevState => {
                                            return {
                                                prev_contato: prevState.contato,
                                                contato: str
                                            }
                                        }))
                                    }} />
                            </View>
                            <View style={[{ flexDirection: 'row' }, styles.input_price_container]}>
                                <View style={styles.input_price_icon}>
                                    <Text style={[styles.input_price_icon_text, systemWeights.semibold]}>R$</Text>
                                </View>
                                <NumericInput
                                    ref={component => this._preco_input = component}
                                    containerStyle={styles.input_price}
                                    stringValue={this.state.preco.toString()}
                                    value={this.state.preco}
                                    onChange={(preco) => { this.setState({ preco: preco }); console.log(this.state.preco) }}
                                    minValue={0}
                                    maxValue={200}
                                    type='up-down'
                                    iconSize={25}
                                    step={0.1}
                                    valueType='real'
                                    rounded
                                    inputStyle={styles.input_price_text}
                                    textColor='#353535'
                                    upDownButtonsBackgroundColor="white"
                                    upDownStyle={{ borderTopRightRadius: 30, borderBottomRightRadius: 12 }}
                                    iconStyle={styles.input_price_arrows}
                                />
                            </View>
                            <View style={styles.input_place_container}>
                                <TextInput
                                    ref={(component) => { this._saida_input = component; this.setRefForNumericInput() }}
                                    onFocus={() => { this.scroll.scrollTo({ y: 100, x: 0 }) }}
                                    style={styles.input_place}
                                    placeholder={"Saída (Endereço, local, etc.)"}
                                    value={this.state.descr_start}
                                    onChangeText={(value) => { this.setStart(value) }}
                                    returnKeyType="next"
                                    onSubmitEditing={() => { this._destino_input.focus() }} />
                            </View>
                            <View style={styles.input_place_container}>
                                <TextInput returnKeyType="done"
                                    ref={component => this._destino_input = component}
                                    style={styles.input_place}
                                    placeholder={"Destino (Endereço, local, etc.)"}
                                    value={this.state.descr_end}
                                    onChangeText={(value) => { this.setEnd(value) }} />
                            </View>
                            <View style={styles.map_card}>
                                <View style={styles.map_container}>
                                    <MapView style={styles.map} initialRegion={this.initialRegion} region={this.state.region}>
                                        {this.state.start ? <Marker coordinate={this.state.start} title={"Saída"} /> : <View></View>}
                                        <MapViewDirections origin={this.state.start}
                                            destination={this.state.end}
                                            apikey={API_KEY_GOOGLE_MAPS}
                                            strokeWidth={3}
                                            strokeColor="red" />
                                        {this.state.start ? <Marker coordinate={this.state.end} title={"Destino"} /> : <View></View>}
                                    </MapView>
                                    <TouchableOpacity style={styles.map_button_origin} onPress={this.goToOriginRegion}>
                                        <View >
                                            <Icon color="#FFFFFF" name="home-map-marker" size={0.57 * hp(INCREMENT)} />
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.map_button_dest} onPress={this.goToDestRegion}>
                                        <View >
                                            <Icon color="#FFFFFF" name="map-marker" size={0.57 * hp(INCREMENT)} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {!this.state.founding ?
                                <TouchableOpacity disabled={!(this.state.descr_start && this.state.descr_end)} onPress={() => { this.getLocation(this.state.descr_start, this.state.descr_end) }}>
                                    <View style={[styles.button, {marginBottom:0.42 * hp(INCREMENT)}]}>
                                        <Icon name="map-search" color="white" size={0.42 * hp(INCREMENT)} style={{ marginHorizontal: wp("4%") }} />
                                        <Text style={{ fontSize: 0.42 * hp(INCREMENT), color: 'white' }}>Localizar</Text>
                                    </View>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => { }}>
                                    <View style={styles.button}>
                                        <ActivityIndicator color={"white"} size={hp("5%")} />
                                    </View>
                                </TouchableOpacity>
                            }
                            {this.state.found ?
                                <TouchableOpacity disabled={!this.state.found} onPress={this.addOferta}>
                                    <View style={[styles.button, {marginTop:0.14 * hp(INCREMENT)} ]}>
                                        <Text style={{ fontSize: 0.42 * hp(INCREMENT), color: 'white' }}>Salvar</Text>
                                    </View>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity disabled={!this.state.found} onPress={this.addOferta}>
                                    <View style={[styles.button_disabled, {marginTop:0.14 * hp(INCREMENT)} ]}>
                                        <Text style={{  fontSize: 0.42 * hp(INCREMENT), color: 'white' }}>Salvar</Text>
                                    </View>
                                </TouchableOpacity>
                            }
                        </View>
                        <View style={{ flex: 1 }} />
                    </View>
                </ScrollView>
            </View>

        );
    }
}

const styles = StyleSheet.create(
    {
        body: {
            flex: 1,
            alignContent: 'center',
        },
        card: {
            elevation: 3,
            flex: 0,
            alignItems: 'center',
            backgroundColor: '#4cb993ff',
            margin: wp("3%"),
            borderRadius: 15,
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#b7b2b2ff',
        },
        title: {
            marginTop: hp("3%"),
            marginBottom: hp("3%"),
            flex: 1,
            justifyContent: 'center',
        },
        form: {
            justifyContent: 'center',
            flex: 0,
            width: '100%',
            paddingHorizontal: wp("5%"),
            paddingVertical: hp("5%"),
            marginBottom: 5,
        },
        button: {
            height: 0.875 * hp(INCREMENT),
            backgroundColor: 'red',
            borderRadius: 15,
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 2,
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#b7b2b2ff',
            flexDirection: 'row',
        },
        button_disabled: {
            height: 50,
            backgroundColor: 'red',
            borderRadius: 15,
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 2,
            marginVertical: hp("1%"),
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#b7b2b2ff',
            opacity: 0.7,
            flexDirection: 'row',
        },
        input_price_container: {
            flexDirection:'row',
            backgroundColor: '#dbdbdb',
            width: '50%',
            height: 0.892 * hp(INCREMENT),
            marginBottom:0.42 * hp(INCREMENT),
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            borderBottomRightRadius: 15,
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#b7b2b2ff',
            alignItems:'center',
            justifyContent:'center',
            paddingRight:3,
        },
        input_price: {
            flex:1,
            backgroundColor: 'white',
            height: 0.78 * hp(INCREMENT),
            borderBottomLeftRadius: 0,
        },
        input_price_text: {
            fontSize:0.375*hp(INCREMENT),
            color:'#7A7A7A'
        },
        input_price_arrows: {
            color: '#AAAAAA',
            
        },
        input_price_icon:{
            width: 0.71* hp(INCREMENT),
            alignItems: "center",
            justifyContent: "center"
        },
        input_price_icon_text:{
            alignItems: "center",
            justifyContent: "center",
            fontSize: 0.375 * hp(INCREMENT), 
            fontWeight:'bold',
            color:'#353535'
        },
        input_tel_container: {
            flexDirection:'row',
            backgroundColor: '#dbdbdb',
            width: '100%',
            paddingRight:3,
            height: 0.892 * hp(INCREMENT),
            marginBottom:0.42 * hp(INCREMENT),
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            borderBottomRightRadius: 15,
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#b7b2b2ff',
            alignItems:'center',
            justifyContent:'center',
        },
        input_tel_icon: {
            width: 0.71* hp(INCREMENT), 
            alignItems: "center",
            justifyContent: "center"
        },
        input_tel: {
            backgroundColor: 'white',
            flex:1,
            paddingLeft: 10,
            height: 0.78 * hp(INCREMENT),
            borderStyle: 'solid',
            borderColor: '#fcfcfc',
            borderWidth: 1,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
            fontSize: 0.375 * hp(INCREMENT),
            color:'#7A7A7A',
        },
        input_place_container: {
            backgroundColor: 'white',
            flexDirection: 'row',
            width: '100%',
            height: 0.892 * hp(INCREMENT),
            paddingHorizontal: 3,
            paddingVertical: 3,
            marginBottom:0.42 * hp(INCREMENT),
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            borderBottomRightRadius: 15,
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#b7b2b2ff',
            justifyContent: 'center',
            alignItems: 'center',
        },
        input_place: {
            backgroundColor: 'white',
            flex: 6,
            paddingLeft: 10,
            height: 0.78 * hp(INCREMENT),
            borderStyle: 'solid',
            borderColor: '#fcfcfc',
            borderWidth: 1,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
            fontSize: 0.375 * hp(INCREMENT),
            color:'#7A7A7A'
        },
        map_container: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'flex-end',
            alignItems: 'center',
            
        },
        map_card: {
            height:  3.5 * hp(INCREMENT),
            backgroundColor: 'white',
            borderRadius: 12,
            elevation: 2,
            padding: 0.14 * hp(INCREMENT),
            flexDirection: 'column',
            marginTop:0.14 * hp(INCREMENT),
            marginBottom:0.42 * hp(INCREMENT)
        },
        map: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        },
        map_button_dest:{
            backgroundColor:"red",
            height:hp("5%"),
            width:wp("15%"),
            borderRadius:8,
            elevation:1,
            alignItems:"center",
            justifyContent:"center",
            position:"absolute",
            bottom:0.14*hp(INCREMENT),
            right:0.14*hp(INCREMENT)         
        },
        map_button_origin:{
            backgroundColor:"red",
            height:hp("5%"),
            width:wp("15%"),
            borderRadius:8,
            elevation:1,
            alignItems:"center",
            justifyContent:"center",
            position:"absolute",
            bottom:0.14*hp(INCREMENT),
            left:0.14*hp(INCREMENT)        
        },
        text: {
            fontSize: 0.42 * hp(INCREMENT),
            color: "#353535",
            fontWeight: "bold"
        },
        switch:{
            flexDirection: 'row-reverse',
            marginBottom:0.42 * hp(INCREMENT), 
        },
        text_switch: {
            fontSize: 0.42 * hp(INCREMENT),
            color: "white",
            fontWeight: "bold"
        }

    }
);
