
import React, { Component } from 'react';
import firebase from 'firebase';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Image,    
    KeyboardAvoidingView,
  } from 'react-native';     
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


export default class Login extends Component{

    state = {email:'email',password:'password', logando:false};

    buttonLogin =   <View style={styles.button}>
                         <Text style={{fontSize:hp("3%"), color:'white'}}>Entrar</Text>
                    </View> 

    activityIndicator = <View style={styles.button}>
                            <ActivityIndicator size={hp("5%")} color="white" />
                        </View>
    


    componentWillMount = () =>{
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.props.navigation.navigate("logged");
            } else {
              console.log("Sem usuário persistido");
            }
        });
    }
    
    autenticar = (email, passwd) => {
        var login_email = email;
        this.setState({logando:true});
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
            firebase.database().ref('emails/'+login_email).on('value', (snapshot) => {
                    var email = '';
                    if(snapshot.val() == null){
                        Alert.alert(
                            '',
                            "Usuário não cadastrado",
                            [
                                {text: 'OK',},
                            ],
                            {cancelable: false},
                        );
                        this.setState({logando:false});
                        return;
                    }else{
                    email = snapshot.val().email;
                    }
                    firebase.auth().signInWithEmailAndPassword(email, passwd).then(()=>{
                        this.setState({logando:false});
                        this.props.navigation.navigate("logged");
                            
                    }).catch((error) => {        
                    
                        Alert.alert(
                            '',
                            error.message,
                            [
                                {text: 'OK',},
                            ],
                            {cancelable: false},
                        );
                        this.setState({logando:false});
                    });
                });                             
            });
    }

    render(){
            return(

            <KeyboardAvoidingView style={styles.keyboard_view} behavior="position" enabled>
                <View style={styles.body}>
                        <View style={styles.card}>
                            <View style={{flex:2}}/>
                            <View style={{flex:5, width:'100%'}}>
                                <Image style={{flex: 1, width: null, height: null, resizeMode: 'contain'}} source={require('../assets/login_icon.png')}/>
                            </View>
                            <View style={styles.form}>
                                <TextInput keyboardType={'number-pad'} maxLength={11} style={styles.input} text='' onChangeText={(email)=>{this.setState({email:email})}} placeholder="Número de Matrícula"/>
                                <TextInput secureTextEntry style={styles.input} text='' onChangeText={(passwd)=>{this.setState({password:passwd})}} placeholder="Senha"/>                        
                                <TouchableOpacity onPress={()=>{this.props.navigation.navigate("RedefinicaoSenha")}}>
                                    <Text style={{fontSize:hp("3%"), color:'white'}}>Esqueci a minha senha.</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>{this.autenticar(this.state.email, this.state.password);}}>
                                    {!this.state.logando ? this.buttonLogin : this.activityIndicator}
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate("Register")}>
                                    <Text style={{fontSize:hp("3%"), color:'white'}}>Não possui uma conta ?</Text>
                                    <Text style={{fontSize:hp("3%"), color:'white'}}>Cadastrar</Text>
                                </TouchableOpacity>                        
                            </View>
                        </View>
                </View>
            </KeyboardAvoidingView>
            
        );
    }
}




const styles =  StyleSheet.create(
    {
        keyboard_view:{
            flex:1,
        },
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
       
        form:{
            justifyContent:'flex-start',
            flex:8,
            width:'100%',
            paddingVertical:hp("5%"),
            paddingHorizontal:hp("5%"), 
            marginBottom:5,
            
        },
        button:{
            height:hp("7%"),
            backgroundColor:'red',
            borderRadius:15,
            alignItems:'center',
            justifyContent:'center',
            elevation:2,
            marginVertical:hp("1%"),
            borderStyle:'solid',
            borderWidth:1,
            borderColor:'#b7b2b2ff'
        },
        input:{
            backgroundColor:'white',
            width:'100%',
            height:hp("7%"),
            marginVertical:hp("1%"),
            paddingHorizontal:wp("2%"),
            paddingVertical:hp("1%"),
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