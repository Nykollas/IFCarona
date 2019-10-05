
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
    BackHandler
  } from 'react-native';     
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const _8PT_ = 100/(hp("100%")/8);
const _4PT_ = (100/(hp("100%")/8))/2;

export default class Login extends Component{

    state = {email:'email',password:'password', logando:false};

    buttonLogin =   <View style={styles.button}>
                         <Text style={{fontSize:hp(2*_8PT_+_4PT_), color:'white'}}>Entrar</Text>
                    </View> 

    activityIndicator = <View style={styles.button}>
                            <ActivityIndicator size={hp(3*_8PT_)} color="white" />
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
    

    onMainScreen = () => {
       if(this.props.navigation.state.routeName =="Login"){
            return true;
        }   
    }

    handleBackPress = ()  => {
        if (this.onMainScreen()) {
            
            BackHandler.exitApp();
          }
          return false;
    }

    componentDidMount = () => {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }
    componentWillUnmount() {
        this.backHandler.remove()
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
                                    <Text style={{fontSize:hp(2*_8PT_+_4PT_), color:'white'}}>Esqueci a minha senha.</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>{this.autenticar(this.state.email, this.state.password);}}>
                                    {!this.state.logando ? this.buttonLogin : this.activityIndicator}
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate("Register")}>
                                    <Text style={{fontSize:hp(2*_8PT_+_4PT_), color:'white'}}>Não possui uma conta ?</Text>
                                    <Text style={{fontSize:hp(2*_8PT_+_4PT_), color:'white'}}>Cadastrar</Text>
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
            height:hp("100%") - (2 * wp(2 * _8PT_ + _4PT_) + 10 * hp(_8PT_)),
            alignItems:'center',
            backgroundColor:'#4cb993ff',
            margin:wp(2 * _8PT_ + _4PT_),
            borderRadius:15,  
            borderStyle:'solid',
            borderWidth:1,
            borderColor:'#b7b2b2ff'    
        },
       
        form:{
            justifyContent:'flex-start',
            flex:8,
            width:'100%',
            paddingVertical:hp(3*_8PT_+_4PT_),
            paddingHorizontal:hp(3*_8PT_+_4PT_),
            marginBottom:5,
            
        },
        button:{
            height:hp(6*_8PT_),
            backgroundColor:'red',
            borderRadius:15,
            alignItems:'center',
            justifyContent:'center',
            elevation:2,
            marginVertical:hp(_8PT_+_4PT_),
            borderStyle:'solid',
            borderWidth:1,
            borderColor:'#b7b2b2ff'
        },
        input:{
            backgroundColor:'white',
            width:'100%',
            height:hp(6*_8PT_),
            marginVertical:hp(_8PT_),
            paddingHorizontal:hp(_8PT_+_4PT_),
            paddingVertical:hp(_8PT_),
            borderTopLeftRadius:15,
            borderTopRightRadius:15,
            borderBottomRightRadius:15,
            fontSize:hp(2*_8PT_+_4PT_),
            borderStyle:'solid',
            borderWidth:1,
            borderColor:'#b7b2b2ff'
        }

    }
);