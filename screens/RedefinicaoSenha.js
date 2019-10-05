
import React, { Component } from 'react';
import firebase from 'firebase';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    Dimensions,
    Image,
    ScrollView,
  } from 'react-native';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const _8PT_ = 100/(hp("100%")/8);
const _4PT_ = (100/(hp("100%")/8))/2;

export default class Login extends Component{

    state = {userid:'', ok:1};
    date = new Date();
    t = 0;

    componentDidMount() {
        setInterval( () => {
          this.setState({
            ok :1,
          })
        },20000)
    }

    enviar = (userid) => {
        firebase.auth().signInAnonymously().catch(function(error) {

            Alert.alert(
                '',
                error.message,
                [
                    {text: 'OK',},
                ],
                {cancelable: false},
            );

        });

        firebase.database().ref('emails/'+userid).on('value', (snapshot) => {
            if(snapshot.exists()){
                var email = snapshot.val().email;

            firebase.auth().sendPasswordResetEmail(email).then(function() {

                var email_with_occulted_chars = Array(email.length);

                for(var x = 0; x < email.length;x++){

                    if(x<5){

                        email_with_occulted_chars[x] = email[x];

                    }else{

                        email_with_occulted_chars[x] = '*';

                    }
                }

                Alert.alert(
                    '',
                    "E-mail enviado para " + email_with_occulted_chars.join(''),
                    [
                        {text: 'OK',},
                    ],
                    {cancelable: false},
                );



              }).catch(function(error) {

                Alert.alert(
                    '',
                    error.message,
                    [
                        {text: 'OK',},
                    ],
                    {cancelable: false},
                );
    
              });          
            }
            
        })
    }
    render(){
            return(
            <View style={styles.body}>
            <ScrollView style={{flex:1}}>
                <View style={{height:750}}>
                <View style={styles.card}>
                    <View style={styles.title}>
                        <Text style={{fontSize:22, color:'white'}}>Redefinição de Senha</Text>
                    </View>
                    <View style={styles.form}>
                        <Text style={{fontSize:22, color:'white', marginVertical:10, marginBottom:20}}>Insira seu número de matrícula para recuperar sua senha</Text>
                        <TextInput maxLength={11} style={styles.input} keyboardType={'number-pad'} onChangeText={
                        (userid)=>{
                            this.setState({userid:userid});
                        }} placeholder="Número de Matrícula"/>

                        <TouchableOpacity onPress={

                                        ()=>{   
                                                if(this.state.ok){

                                                    this.enviar(this.state.userid)
                                                    this.setState({ok:0});
                                                }
                                                else{
                                                    Alert.alert(
                                                        '',
                                                        "Aguarde 20 segundos para reenviar a solicitação!",
                                                        [
                                                            {text: 'OK',},
                                                        ],
                                                        {cancelable: false},
                                                    );
                                                }
                                        }}>
                            <View style={styles.button}>
                                <Text style={{fontSize:20, color:'white'}}>Enviar</Text>
                               </View>
                        </TouchableOpacity>                       
                    </View>
                    <View style={{flex:5.8,width:'100%'}}>
                        <Image style={{flex: 1, marginVertical:'10%', width: null, height: null, resizeMode: 'contain'}} source={require('../assets/pass_recovery.png')}/>
                    </View>
                </View>
                </View>
                </ScrollView>
            </View>
        );
    }
}

dim =  Dimensions.get('window');
card_height = Math.round(0.84 * this.dim.height);
margin_card= Math.round(0.02 * this.dim.width);
icon_size = Math.round(0.05* this.dim.width);
data_size = Math.round(0.045 * this.dim.width);

const styles =  StyleSheet.create(
    {
        body:{
            flex:1,
            alignContent:'center',
        },
        card:{
            elevation:3,
            height:card_height,
            alignItems:'center',
            backgroundColor:'#4cb993ff',
            margin:margin_card,
            borderRadius:15,  
            borderStyle:'solid',
            borderWidth:1,
            borderColor:'#b7b2b2ff'    
        },
       title:{
            marginTop:5,
            flex:1,
            justifyContent:'center',
        },
        form:{
            justifyContent:'flex-start',
            flex:8,
            width:'100%',
            padding:20,
            
            
        },
        button:{
            height:50,
            backgroundColor:'red',
            borderRadius:15,
            alignItems:'center',
            justifyContent:'center',
            elevation:2,
            marginTop:10,
            borderStyle:'solid',
            borderWidth:1,
            borderColor:'#b7b2b2ff'
        },
        input:{
            backgroundColor:'white',
            width:'100%',
            height:50,
            marginVertical:10,
            padding:10,
            borderTopLeftRadius:15,
            borderTopRightRadius:15,
            borderBottomRightRadius:15,
            fontSize:22,
            borderStyle:'solid',
            borderWidth:1,
            borderColor:'#b7b2b2ff'
        }

    }
);