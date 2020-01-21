
import React, { Component } from 'react';
import * as firebase from 'firebase';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    Image,
  } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import bcrypt from 'react-native-bcrypt';
import ImagePicker from 'react-native-image-picker';

const _8PT_ = 100/(hp("100%")/8);
const _4PT_ = (100/(hp("100%")/8))/2;

export default class Register extends Component{

    constructor(props){
        super(props);
        this.state = {passwd_atual:'', email:'', nome:'', passwd_confirmation:'', passwd:''}    
    }

    componentWillMount = () => {
        var userID = firebase.auth().currentUser.uid;
        firebase.database().ref('user/' + userID).on('value',(snapshot) => {
                this.setState({nome:snapshot.val().nome, email:snapshot.val().email});
        })
     }
    
    editarSenha = (password_actual, new_password,) => {
        
        var password_actual_hash;
        var new_hash;
        var userId = firebase.auth().currentUser.uid;

        if(this.state.passwd != this.state.passwd_confirmation){
            Alert.alert(
                '',
                'Confirmação de senha diferente',
                [
                    {text: 'OK',},
                ],
                {cancelable: false},
            );
            return;
        }

        firebase.database().ref('user/' + userId).on('value', (snapshot) => {
            password_actual_hash = snapshot.val().senha;
            if(bcrypt.compareSync(password_actual, password_actual_hash)){
                new_hash = bcrypt.hashSync(new_password, 8);
                firebase.auth().currentUser.updatePassword(new_password).then(() =>
                    {
                        firebase.database().ref('user/' + userId).update({senha:new_hash}).catch((error => {
                            Alert.alert(
                                '',
                                error.message,
                                [
                                    {text:'OK'},
                                ],
                                {cancelable:false},
                            )
                        }))
                        console.log("Senha atualizada com sucesso !");
                        
                    }
                ).catch((error) => {
                    Alert.alert(
                        '',
                        error.message,
                        [
                            {text: 'OK',},
                        ],
                        {cancelable: false},
                    );
                });
                
                
            }else{
                Alert.alert(
                    '',
                    ' Senha atual inválida',
                    [
                        {text: 'OK',},
                    ],
                    {cancelable: false},
                );
                return;
            }
        });
   
    }

    editarDados = (name,email) => {
        
        var user = firebase.auth().currentUser;
        var userId = user.uid;

        user.updateEmail(email).then(() => {
            console.log("Email atualizado com sucesso!");
        }).catch((error) => {
            Alert.alert(
                '',
                error.message,
                [
                    {text: 'OK',},
                ],
                {cancelable: false},
            );
        });

        // Necessário usar um catch
        firebase.database().ref('user/' + userId).update({nome:name});
        firebase.database().ref('ofertas/' + userId).update({nome:name}); 
        Alert.alert(
            '',
            'Dados atualizados com sucesso !',
            [
                {text: 'OK',},
            ],
            {cancelable: false},
        );
        this.props.navigation.navigate('Home');
    }

    render(){
        return(
            <View style={styles.body}>  
                <ScrollView style={{flex:1}}>
                    <View style={{height:hp("120%")}}>
                        <View style={styles.card}>
                            <View style={styles.title}>
                                <Text style={{fontSize:hp(2* _8PT_ + 2*_4PT_), color:'white'}}>Editar Usuário</Text>
                            </View>
                            <View style={styles.form}>
                                <View style={styles.section_title}>
                                    <Text style={{color:'white', fontSize:20}}> Edição de Dados</Text>
                                    <View style={styles.line}/>
                                </View>
                                <TextInput style={styles.input} value={this.state.nome} onChangeText={(name)=>{this.setState({nome:name})}} placeholder="Nome"/>
                                <TextInput style={styles.input} value={this.state.email} onChangeText={(email)=>{this.setState({email:email})}} placeholder="E-mail"/>
                                <TouchableOpacity onPress={()=>{
                                                                    this.editarDados(
                                                                            this.state.nome,
                                                                            this.state.email,
                                                                            );
                                                                            }}>
                                    <View style={styles.button}>
                                        <Text style={{fontSize:20, color:'white'}}>Editar Dados</Text>
                                    </View>
                                </TouchableOpacity> 
                                <View style={[styles.section_title, {marginTop:20  }]}>
                                    <Text style={{color:'white', fontSize:20}}> Edição de senha </Text>
                                    <View style={styles.line}/>
                                </View>  
                                <TextInput secureTextEntry style={styles.input} onChangeText={ (passwd) => {this.setState({passwd_atual:passwd})}} placeholder="Senha atual"/>                        
                                <TextInput secureTextEntry style={styles.input} onChangeText={ (passwd) => {this.setState({passwd:passwd})} } placeholder="Nova senha"/>                        
                                <TextInput secureTextEntry style={styles.input} onChangeText={ (passwd_confirmation) => {this.setState({passwd_confirmation:passwd_confirmation})}} placeholder="Confirmar Senha"/>                                              
                                <TouchableOpacity onPress={()=>{       
                                                                    this.editarSenha(
                                                                            this.state.passwd_atual,
                                                                            this.state.passwd,
                                                                            );
                                                                            }}>
                                    <View style={styles.button}>
                                        <Text style={{fontSize:20, color:'white'}}>Editar Senha</Text>
                                    </View>
                                </TouchableOpacity> 
                                <View style={{flex:2,flexDirection:'row', width:'100%'}}>
                                    <View style={{flex:0.8}}/>
                                    <Image style={{flex: 0.2, width: null, height: null, resizeMode: 'contain'}} source={require('../assets/icon_editar_user.png')}/>
                                </View>                 
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
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
            height:hp(100 * _8PT_),
            alignItems:'center',
            backgroundColor:'#4cb993ff',
            margin:wp(2 * _8PT_ + _4PT_),
            borderRadius:15,
            borderStyle:'solid',
            borderWidth:1,
            borderColor:'#b7b2b2ff'      
        },
       title:{
            marginVertical:hp(5*_8PT_+_4PT_),
            justifyContent:'center',
        },
        form:{
            justifyContent:'flex-start',
            flex:5,
            width:'100%',
            paddingHorizontal:hp(2* _8PT_ + _4PT_),
            paddingBottom:hp(2* _8PT_ + _4PT_),
            marginBottom:hp(_4PT_),
            
        },
        button:{
            height:hp(6*_8PT_),
            backgroundColor:'red',
            borderRadius:15,
            alignItems:'center',
            justifyContent:'center',
            elevation:2,
            marginBottom:hp(2*_8PT_ + _4PT_),
            borderStyle:'solid',
            borderWidth:1,
            borderColor:'#b7b2b2ff'
        },  
        input:{
            backgroundColor:'white',
            width:'100%',
            height:hp(6 * _8PT_),
            marginBottom:hp(2*_8PT_ + _4PT_),
            padding:hp(_8PT_ + _4PT_),
            borderTopLeftRadius:15,
            borderTopRightRadius:15,
            borderBottomRightRadius:15,
            fontSize:hp(2*_8PT_+_4PT_),
            borderStyle:'solid',
            borderWidth:1,
            borderColor:'#b7b2b2ff',
            color:'#7A7A7A',
        },
        line:{
            backgroundColor:'white',
            opacity:0.8,
            width:'100%',
            height:1,
            marginVertical:hp(2*_4PT_),
        },
        section_title:{
            marginBottom:hp(_4PT_),
        }
    }
);