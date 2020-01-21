
import React, { Component } from 'react';
import * as firebase from 'firebase';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    Image,
    KeyboardAvoidingView,
    ActivityIndicator,
    Keyboard,
    Animated

} from 'react-native';
import { Header } from 'react-navigation-stack';
import bcrypt from 'react-native-bcrypt';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const _8PT_ = 100 / (hp("100%") / 8);
const _4PT_ = (100 / (hp("100%") / 8)) / 2;

export default class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            nome: '',
            login_email: '',
            passwd_confirmation: '',
            passwd: '',
            registering: false,
            keyboard_height:undefined
        }
    }

    buttonRegister = <View style={styles.button}>
        <Text style={{ fontSize: 20, color: 'white' }}>Cadastrar</Text>
    </View>

    activityIndicator = <View style={styles.button}>
        <ActivityIndicator size={hp("5%")} color="white" />
    </View>

    _animatedValue = new Animated.Value(0);

    setName = (value) => {
        this.setState({ nome: value });
    }

    setLEmail = (value) => {
        this.setState({ login_email: value });
    }

    setEmail = (value) => {
        this.setState({ email: value });
    }

    setPasswd = (value) => {
        this.setState({ passwd: value });
    }

    setPasswdConfirmation = (value) => {
        this.setState({ passwd_confirmation: value });
    }


    focusLEmail = () => {
        this.lEmailRef.focus();
        Animated.timing(this._animatedValue, {
            toValue: -hp(8*_8PT_),
            duration: 100,
        },).start();
    }

    focusEmail = () => {
        
        this.emailRef.focus();
        Animated.timing(this._animatedValue, {
            toValue: - 2 * hp(8*_8PT_),
            duration: 100,
        },).start();
    }

    focusSenha = () => {
        
        this.senhaRef.focus();
        Animated.timing(this._animatedValue, {
            toValue: - 3 * hp(8*_8PT_),
            duration: 100,
        },).start();
    }

    focusSenhaConf = () => {
        this.senhaRefConf.focus();
        Animated.timing(this._animatedValue, {
            toValue: - 4 * hp(8*_8PT_),
            duration: 100,
        },).start();
    }


    createRefLEmailInput = (component) => {
        this.lEmailRef = component;
    }

    createRefEmailInput = (component) => {
        this.emailRef = component;
    }

    createRefSenhaInput = (component) => {
        this.senhaRef = component;
    }

    createRefSenhaConf = (component) => {
        this.senhaRefConf = component;
    }

    keyboardDidShow = (e) => {

        const { height, screenX, screenY, width } = e.endCoordinates;
        this.setState({keyboard_height:height});
        
           
    }

    keyboardDidHide = (e) => {

        Animated.timing(this._animatedValue, {
            toValue: 0,
            duration: 100,
        }).start();
        
    }



    componentDidMount = () => {
        Keyboard.addListener("keyboardDidShow", this.keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", this.keyboardDidHide);
    }

    register = () => {

        const name = this.state.nome;
        const email = this.state.email;
        const password = this.state.passwd;
        const login_email = this.state.login_email;

        this.setState({ registering: true });
        if (login_email.length == 11) {
            for (var x = 0; x < 11; x++) {
                if (Number(login_email[x]) == NaN) {
                    Alert.alert(
                        '',
                        'Número de matrícula inválido',
                        [
                            { text: 'OK', },
                        ],
                        { cancelable: false },
                    );
                    this.setState({ registering: false });
                    return;
                }
            }
        } else {
            Alert.alert(
                '',
                'Número de matrícula inválido',
                [
                    { text: 'OK', },
                ],
                { cancelable: false },
            );
            this.setState({ registering: false });
            return;
        }

        if (this.state.passwd != this.state.passwd_confirmation) {
            Alert.alert(
                '',
                'Confirmação de senha diferente',
                [
                    { text: 'OK', },
                ],
                { cancelable: false },
            );
            this.setState({ registering: false });
            return;
        }
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
            firebase.auth().createUserWithEmailAndPassword(email, password).catch((error) => {
                if (error.code) {
                    Alert.alert(
                        '',
                        error.message,
                        [
                            { text: 'OK' },
                        ],
                        { cancelable: false },
                    );
                    this.setState({ registering: false });
                }
            }).then(() => {
                if (firebase.auth().currentUser) {
                    var userId = firebase.auth().currentUser.uid;
                    if (userId) {
                        hash = bcrypt.hashSync(password, 8);
                        firebase.database().ref('user/' + userId).set({
                            nome: name,
                            email: email,
                            senha: hash,
                        }).then(() => {
                            firebase.database().ref('emails/' + login_email).set({
                                email: email,
                            }).then(() => {
                                this.props.navigation.navigate('InserirFoto');
                            });
                        });
                    }
                }
            });
            this.setState({ registering: false });
        });
    }
    render() {
        return (

            <Animated.View style={[styles.body, { top: this._animatedValue }]}>
                <View style={styles.card}>
                    <View style={styles.title}>
                        <Text style={{ fontSize: hp('4%'), color: 'white' }}>Cadastro</Text>
                    </View>
                    <View style={styles.form}>
                        <TextInput ref={this.createRefNomeInput}
                            style={styles.input}
                            onChangeText={this.setName}
                            placeholder="Nome"
                            blurOnSubmit={false}
                            returnKeyType={"next"}
                            onSubmitEditing={this.focusLEmail} />
                        <TextInput ref={this.createRefLEmailInput}
                            onTouchStart={this.focusLEmail}
                            keyboardType="number-pad"
                            blurOnSubmit={false}
                            maxLength={11}
                            style={styles.input}
                            onChangeText={this.setLEmail}
                            placeholder="Número de Matrícula"
                            returnKeyType={"next"}
                            onSubmitEditing={this.focusEmail} />
                        <TextInput ref={this.createRefEmailInput}
                            onTouchStart={this.focusEmail}
                            style={styles.input}
                            blurOnSubmit={false}
                            onChangeText={this.setEmail}
                            placeholder="E-mail"
                            returnKeyType={"next"}
                            onSubmitEditing={this.focusSenha} />
                        <TextInput ref={this.createRefSenhaInput}
                            onTouchStart={this.focusSenha}
                            blurOnSubmit={false}
                            secureTextEntry
                            style={styles.input}
                            onChangeText={this.setPasswd}
                            placeholder="Senha"
                            returnKeyType={"next"}
                            onSubmitEditing={this.focusSenhaConf} />
                        <TextInput ref={this.createRefSenhaConf}
                            onTouchStart={this.focusSenhaConf}
                            secureTextEntry
                            style={styles.input}
                            onChangeText={this.setPasswdConfirmation}
                            placeholder="Confirmar Senha"
                            returnKeyType={"next"} />
                        <TouchableOpacity onPress={this.register}>
                            {!this.state.registering ? this.buttonRegister : this.activityIndicator}
                        </TouchableOpacity>
                    </View>

                    {// Mostra o ícone caso o a altura da tela seja maior que 900dpi
                        hp('100%') > 900 ?
                            <View style={this.icon_register_container}>
                                <View style={{ flex: 0.8 }} />
                                <Image style={this.icon_register} source={require('../assets/icon_register.png')} />
                            </View> : <View></View>}
                </View>
            </Animated.View>
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
            height: hp("85%"),
            alignItems: 'center',
            backgroundColor: '#4cb993ff',
            margin: wp("3%"),
            borderRadius: 15,
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#b7b2b2ff'
        },
        title: {
            marginTop: hp("5%"),
            flex: 1,
            justifyContent: 'center',
        },
        form: {
            justifyContent: 'flex-start',
            flex: 5,
            width: '100%',
            paddingHorizontal: wp("5%"),
            paddingVertical: hp("5%"),
        },
        button: {
            height: hp("7.5%"),
            backgroundColor: 'red',
            borderRadius: 15,
            alignItems: 'center',
            marginVertical: hp("3%"),
            justifyContent: 'center',
            elevation: 2,

            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#b7b2b2ff'
        },
        input: {
            backgroundColor: 'white',
            width: '100%',
            height: hp("7.5%"),
            marginVertical: hp("1%"),
            paddingVertical: hp("1%"),
            paddingHorizontal: wp("2%"),
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            borderBottomRightRadius: 15,
            fontSize: hp("3%"),
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#b7b2b2ff'
        },
        icon_register_container: {
            flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'
        },
        icon_register: {
            width: 100, height: 100
        }
    }
);
