
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
import MapView, { Marker } from "react-native-maps";
import Geocoder from 'react-native-geocoding';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapViewDirections from 'react-native-maps-directions';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SwitchSelector from 'react-native-switch-selector';
import firebase from 'firebase';
const _8PT_ = 100/(hp("100%")/8);
const _4PT_ = (100/(hp("100%")/8))/2;
const API_KEY_GOOGLE_MAPS = "AIzaSyDNlio27LqraNed4EAIjmjBiuEQ46UjyIg";
export default class MinhaPostagem extends Component {
    state = {
        vehicle: 1,
        frequency: '1',
        time: '1',
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
        switch_text: "Procuro carona",
    }
    erro_in_add = 0;
    initialRegion = {
        latitude: this.state.start.latitude,
        longitude: this.state.start.longitude,
        latitudeDelta: 0.003,
        longitudeDelta: 0.0011,
    }
    options_vehicle = [
        {activeColor:'red', label: 'Moto', value: '1' },
        {activeColor:'red', label: 'Carro', value: '2' },
        {activeColor:'red', label: 'Van', value: '3' }
    ];
    options_time = [
        {activeColor:'red', label: 'Matutino', value: '1' },
        {activeColor:'red', label: 'Noturno', value: '2' },
        {activeColor:'red', label: 'Integral', value: '3' }
    ];
    options_frequency = [
        {activeColor:'red', label: 'Ida', value: '1' },
        {activeColor:'red', label: 'Volta', value: '2' },
        {activeColor:'red', label: 'Ida/Volta', value: '3' }
    ];
    deformatContato(string) {
        let arr = new Array(200);
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
                let new_str = arr.join('');
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
                let new_str = arr.join('');
                return new_str;
            }
        }
    }

    validateDados = () => {
       if (this.state.contato == null) {
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
                vehicle: snapshot.val().vehicle,
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
                let nome = snapshot.val().nome;
                
                firebase.storage().ref("avatars/"+userId+"/image.jpeg").getDownloadURL().then((url) => {
                    firebase.database().ref('ofertas/' + userId)
                    .set({
                        start: this.state.start,
                        end: this.state.end,
                        vehicle: this.state.vehicle,
                        nome: nome, contato: this.state.contato,
                        time:this.state.time,
                        frequency:this.state.frequency,
                        procura: this.state.procura,
                        descr_start: this.state.descr_start,
                        descr_end: this.state.descr_end,
                        avatar:url
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
                    });
                });
            });
        if (!this.erro_in_add) {
            Alert.alert(
                '',
                'Atualizado com sucesso!',
                [
                    { text: 'OK', },
                ],
                { cancelable: false },
            );
            this.props.navigation.navigate("Procura",{
                                                recentlyUpdate:true
                                                }
                                );
        } else {
            this.erro_in_add = 0;
        }
    }

    getLocation = (descr_start, descr_end) => {
        this.setState({ founding: true })
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
                    }).catch(error => {
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
            }).catch(error => {
                this.setState({ founding: false });
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
        if (this._vehicle_input == null) {


        } else {
            this._vehicle_input.ref._saida_input = this._saida_input
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
                                    <Icon name="whatsapp" size={hp( 3 * _8PT_ )} color='#353535' />
                                </View>
                                <TextInput returnKeyType={"next"}
                                    onSubmitEditing={() => this._vehicle_input.ref.focus()}
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
                            <Text style={{fontWeight:"bold",color:'white', marginBottom:hp(2*_8PT_),fontColor:'white',fontSize:16*_8PT_}}>Veículo</Text>
                            <View style={[{ flexDirection: 'row' }, styles.input_vehicle_container]}>
                                <View style={styles.input_vehicle}>
                                    <SwitchSelector textColor={'#7A7A7A'} fontSize={16} options={this.options_vehicle} initial={this.state.vehicle} onPress={value => {console.log(value); this.setState({vehicle:value})}} />
                                </View>
                            </View>
                            <Text style={{fontWeight:"bold",color:'white', marginBottom:hp(2*_8PT_),fontColor:'white',fontSize:16*_8PT_}}>Período</Text>
                            <View style={[{ flexDirection: 'row' }, styles.input_vehicle_container]}>
                                <View style={styles.input_vehicle}>
                                    <SwitchSelector textColor={'#7A7A7A'} fontSize={16} options={this.options_time} initial={this.state.time-1} onPress={value =>  this.setState({time:value})} />
                                </View>
                            </View>
                            <Text style={{fontWeight:"bold",color:'white', marginBottom:hp(2*_8PT_),fontColor:'white',fontSize:16*_8PT_}}>Frequência</Text>
                            <View style={[{ flexDirection: 'row' }, styles.input_vehicle_container]}>
                                <View style={styles.input_vehicle}>
                                    <SwitchSelector textColor={'#7A7A7A'} fontSize={16} options={this.options_frequency} initial={this.state.frequency-1} onPress={value => {this.setState({frequency:value})} }/>
                                </View>
                            </View>
                            <View style={styles.input_place_saida_container}>
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
                            <View style={styles.input_place_destino_container}>
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
                                            <Icon color="#FFFFFF" name="home-map-marker" size={hp( 3 * _8PT_)} />
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.map_button_dest} onPress={this.goToDestRegion}>
                                        <View >
                                            <Icon color="#FFFFFF" name="map-marker" size={hp(3 * _8PT_ )} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {!this.state.founding ?
                                <TouchableOpacity disabled={!(this.state.descr_start && this.state.descr_end)} onPress={() => { this.getLocation(this.state.descr_start, this.state.descr_end) }}>
                                    <View style={[styles.button, {marginBottom:hp(2*_8PT_)}]}>
                                        <Icon name="map-search" color="white" size={hp(3 *_8PT_ )} style={{ marginHorizontal: wp("4%") }} />
                                        <Text style={{ fontSize:3 * hp(_8PT_) - _4PT_, color: 'white' }}>Localizar</Text>
                                    </View>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => { }}>
                                    <View style={[styles.button, {marginBottom:hp(2*_8PT_)}]}>
                                        <ActivityIndicator color={"white"} size={hp("5%")} />
                                    </View>
                                </TouchableOpacity>
                            }
                            {this.state.found ?
                                <TouchableOpacity disabled={!this.state.found} onPress={this.addOferta}>
                                    <View style={[styles.button, {marginTop:0.14 * hp(_8PT_)} ]}>
                                        <Text style={{ fontSize: 3 * hp(_8PT_) - _4PT_, color: 'white' }}>Salvar</Text>
                                    </View>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity disabled={!this.state.found} onPress={this.addOferta}>
                                    <View style={[styles.button_disabled, {marginBottom:hp(2*_8PT_)} ]}>
                                        <Text style={{  fontSize: 3 * hp(_8PT_) - _4PT_, color: 'white' }}>Salvar</Text>
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
            height: hp( 6 *_8PT_),
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
            height: hp( 6 *_8PT_),
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
        input_vehicle_container: {
            flexDirection:'row',
            backgroundColor: '#dbdbdb',
            width: '100%',
            marginBottom:hp(2*_8PT_),
            borderRadius: 24,
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#b7b2b2ff',
            alignItems:'center',
            justifyContent:'center',
            paddingRight:-1,
        },
        input_vehicle: {
            flex:1,
            backgroundColor: 'white',
            
            borderRadius: 24,

        },
        input_vehicle_text: {
            fontSize:hp(2 * _8PT_ + _4PT_ ),
            color:'#7A7A7A'
        },
        input_vehicle_arrows: {
            color: '#AAAAAA',
        },
        input_vehicle_icon:{
            width: hp(5 * _8PT_),
            alignItems: "center",
            justifyContent: "center"
        },
        input_vehicle_icon_text:{
            alignItems: "center",
            justifyContent: "center",
            fontSize:hp(2 * _8PT_ + _4PT_ ),
            fontWeight:'bold',
            color:'#353535'
        },
        input_tel_container: {
            backgroundColor: '#dbdbdb',
            width: '100%',
            flexDirection:'row',
            paddingRight:3,
            height: hp( 6 *_8PT_),
            marginBottom:hp(2*_8PT_),
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
            width: hp(5 * _8PT_),
            alignItems: "center",
            justifyContent: "center"
        },
        input_tel: {
            backgroundColor: 'white',
            flex:1,
            paddingLeft: 10,
            height: hp( 6 *_8PT_ - _4PT_),
            borderStyle: 'solid',
            borderColor: '#fcfcfc',
            borderWidth: 1,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
            fontSize: hp(2 * _8PT_ + _4PT_),
            color:'#7A7A7A',
        },
        input_place_destino_container: {
            backgroundColor: 'white',
            flexDirection: 'row',
            width: wp("100%") - 6 * hp(2*_8PT_  ),
            height: hp( 6 *_8PT_),
            paddingHorizontal: 3,
            paddingVertical: 3,
            marginBottom:hp(2*_8PT_),
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            borderBottomRightRadius: 15,
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#b7b2b2ff',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex:3,
            left:hp(3 * _8PT_ + 2*_4PT_),
            top: 26 * hp(2* _8PT_ + _4PT_),
            position:'absolute',
        },
        input_place_saida_container: {
            backgroundColor: 'white',
            flexDirection: 'row',
            width: wp("100%") - 6 * hp(2*_8PT_  ),
            height: hp( 6 *_8PT_),
            paddingHorizontal: 3,
            paddingVertical: 3,
            marginBottom:hp(2*_8PT_),
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            borderBottomRightRadius: 15,
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#b7b2b2ff',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex:3,
            left:hp(3 * _8PT_ + 2*_4PT_),
            top:23 * hp(2* _8PT_ + _4PT_),
            position:'absolute',
        },
        input_place: {
            backgroundColor: 'white',
            flex: 6,
            paddingLeft: 10,
            height: hp(6 *_8PT_ - _4PT_),
            borderStyle: 'solid',
            borderColor: '#fcfcfc',
            borderWidth: 1,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
            fontSize: hp(2 * _8PT_ + _4PT_),    
            color:'#7A7A7A',
        },
        map_container: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'flex-end',
            alignItems: 'center',
            zIndex:-1
            
        },
        map_card: {
            height:  hp(40 * _8PT_),
            backgroundColor: 'white',
            borderRadius: 12,
            padding:  hp(_8PT_),
            flexDirection: 'column',
            marginTop:hp(_8PT_),
            marginBottom:hp(2*_8PT_),
            zIndex:-1
            
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
            bottom:hp(_8PT_),
            right:hp(_8PT_)         
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
            bottom:hp(_8PT_),
            left:hp(_8PT_)        
        },
        text: {
            fontSize: hp(2 * _8PT_ + _4PT_ ),
            color: "#353535",
            fontWeight: "bold"
        },
        switch:{
            flexDirection: 'row-reverse',
            marginBottom: hp(_8PT_), 
        },
        text_switch: {
            fontSize:  hp(2 * _8PT_ + _4PT_ ),
            color: "white",
            fontWeight: "bold"
        }

    }
);
