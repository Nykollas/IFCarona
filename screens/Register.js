
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
    
  } from 'react-native';
import {Header} from 'react-navigation';
import bcrypt from 'react-native-bcrypt';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class Register extends Component{

    constructor(props){
        super(props);
        this.state = {
                        v_offset: -( Header.HEIGHT + 30 ), 
                        email:'', 
                        nome:'',
                        login_email:'', 
                        passwd_confirmation:'',
                        passwd:'', 
                        registering:false
                    }
    }

    buttonRegister = <View style={styles.button}>
                        <Text style={{fontSize:20, color:'white'}}>Cadastrar</Text>
                    </View>

    activityIndicator = <View style={styles.button}>
                                <ActivityIndicator size={hp("5%")} color="white" />
                        </View>


    register = function alert(name,email,password,login_email){
        this.setState({registering:true});
        if(login_email.length == 11){
            for(var x = 0; x < 11;x++){
                if(Number(login_email[x])== NaN){
                    Alert.alert(
                        '',
                        'Número de matrícula inválido',
                        [
                            {text: 'OK',},
                        ],
                        {cancelable: false},
                    );
                    this.setState({registering:false});
                    return;
                }
            }
        }else{
            Alert.alert(
                '',
                'Número de matrícula inválido',
                [
                    {text: 'OK',},
                ],
                {cancelable: false},
            );
            this.setState({registering:false});
            return;
        }
         
        if(this.state.passwd != this.state.passwd_confirmation){
            Alert.alert(
                '',
                'Confirmação de senha diferente',
                [
                    {text: 'OK',},
                ],
                {cancelable: false},
            );
            this.setState({registering:false});
            return;

        }
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
            firebase.auth().createUserWithEmailAndPassword(email, password).catch((error) => {        
                if(error.code){
                    Alert.alert(
                        '',
                        error.message,
                        [
                        {text: 'OK'},
                        ],
                        {cancelable: false},
                    );
                    this.setState({registering:false});
                }
            }).then(()=>{
            if(firebase.auth().currentUser){
                var userId = firebase.auth().currentUser.uid;
                if(userId){
                    hash = bcrypt.hashSync(password, 8);
                    firebase.database().ref('user/' + userId).set({
                        nome:name,
                        email:email,
                        senha:hash,        
                    });  
                    firebase.database().ref('emails/' + login_email).set({
                        email:email,
                    });  
                    this.props.navigation.navigate('InserirFoto');
                }
            }});
            this.setState({registering:false});
        });
    }
    render(){
        return(
                <KeyboardAvoidingView style={{flex:1}} behavior="position" keyboardVerticalOffset={ this.state.v_offset} enabled>  
                    <View style={styles.body}>  
                            <View style={styles.card}>
                                <View style={styles.title}>
                                    <Text style={{fontSize:hp('4%'), color:'white'}}>Cadastro</Text>
                                </View>
                                <View style={styles.form}>
                                    <TextInput style={styles.input} onFocus = {() => { this.setState({v_offset:-(Header.HEIGHT+30)})}} onChangeText={(name)=>{this.setState({nome:name})}} placeholder = "Nome"/>
                                    <TextInput keyboardType="number-pad" style = {styles.input} onFocus={() => { this.setState({v_offset:-(Header.HEIGHT)})}} onChangeText={(l_email)=>{this.setState({login_email:l_email})}} placeholder = "Número de Matrícula"/>
                                    <TextInput style={styles.input} onFocus = {() => { this.setState({v_offset:Header.HEIGHT+30})}} onChangeText={(email)=>{this.setState({email:email})}} placeholder = "E-mail"/>
                                    <TextInput style={styles.input} onFocus = {() => { this.setState({v_offset:Header.HEIGHT+30})}} onChangeText={(passwd)=>{this.setState({passwd:passwd})}} placeholder = "Senha"/>                        
                                    <TextInput style={styles.input} onFocus = {() => { this.setState({v_offset:Header.HEIGHT+30})}} onChangeText={(passwd_confirmation)=>{this.setState({passwd_confirmation:passwd_confirmation})}} placeholder = "Confirmar Senha"/>                                              
                                    <TouchableOpacity onPress = { () => {this.register(this.state.nome, this.state.email, this.state.passwd, this.state.login_email);}}>
                                        {!this.state.registering ? this.buttonRegister : this.activityIndicator}
                                    </TouchableOpacity>                  
                                </View>
                                    {dim_scr.height > 900 ?  
                                        <View style={{flex:2,flexDirection:'row', alignItems:'center', justifyContent:'flex-end' }}>
                                             <View style={{flex:0.8}}/>
                                            <Image style={{width:100,height:100}}source={require('../assets/icon_register.png')}/>
                                        </View>:<View></View>}
                            </View>     
                        </View>
                </KeyboardAvoidingView>
        );
    }
}


const styles =  StyleSheet.create(
    {
        body:{
            flex:1,
            alignContent:'center',
        },
        card:{
            elevation:3,
            height:hp("85%"),
            alignItems:'center',
            backgroundColor:'#4cb993ff',
            margin:wp("3%"),
            borderRadius:15,
            borderStyle:'solid',
            borderWidth:1,
            borderColor:'#b7b2b2ff'      
        },
       title:{
            marginTop:hp("5%"),
            flex:1,
            justifyContent:'center',
        },
        form:{
            justifyContent:'flex-start',
            flex:5,
            width:'100%',
            paddingHorizontal:wp("5%"),
            paddingVertical:hp("5%"),
        },
        button:{
            height:hp("7.5%"),
            backgroundColor:'red',
            borderRadius:15,
            alignItems:'center',
            marginVertical:hp("3%"),
            justifyContent:'center',
            elevation:2,

            borderStyle:'solid',
            borderWidth:1,
            borderColor:'#b7b2b2ff'
        },
        input:{
            backgroundColor:'white',
            width:'100%',
            height:hp("7.5%"),
            marginVertical:hp("1%"),
            paddingVertical:hp("1%"),
            paddingHorizontal:wp("2%"),
            borderTopLeftRadius:15,
            borderTopRightRadius:15,
            borderBottomRightRadius:15,
            fontSize:hp("3%"),
            borderStyle:'solid',
            borderWidth:1,
            borderColor:'#b7b2b2ff'
        }
    }
);
