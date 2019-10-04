
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
    Dimensions,
    Image,
  } from 'react-native';

import bcrypt from 'react-native-bcrypt';

    // Responsivity block
    dim_scr =  Dimensions.get('screen');
    dim_win =  Dimensions.get('window');
    if(dim_scr.width < 900){
        if(dim_scr.height > 1350){
            card_height = Math.round(1.4 * this.dim_win.height);
            margin_card = Math.round(0.02 * this.dim_win.width);
            icon_size = Math.round(0.05* this.dim_win.width);
            data_size = Math.round(0.045 * this.dim_win.width);
            login_icon_h = Math.round(0.34 * this.dim_win.height);
            login_icon_w = Math.round(0.5 * this.dim_win.width);
        }else{
            card_height = Math.round(1.4 * this.dim_win.height);
            margin_card = Math.round(0.02 * this.dim_win.width);
            icon_size = Math.round(0.05* this.dim_win.width);
            data_size = Math.round(0.045 * this.dim_win.width);
            login_icon_h = Math.round(0.34 * this.dim_win.height);
            login_icon_w = Math.round(0.5 * this.dim_win.width);
        }

    }else if(dim_scr.width < 1250){

        if(dim_scr.height < 2450){
            card_height = Math.round(0.88 * this.dim_win.height);
            margin_card = Math.round(0.02 * this.dim_win.width);
            icon_size = Math.round(0.05* this.dim_win.width);
            data_size = Math.round(0.045 * this.dim_win.width);
            login_icon_h = Math.round(0.34 * this.dim_win.height);
            login_icon_w = Math.round(0.5 * this.dim_win.width);
        }else{

        }
    }else{
        if(dim_scr < 2960){
            card_height = Math.round(0.88 * this.dim_win.height);
            margin_card = Math.round(0.02 * this.dim_win.width);
            icon_size = Math.round(0.05* this.dim_win.width);
            data_size = Math.round(0.045 * this.dim_win.width);
            login_icon_h = Math.round(0.34 * this.dim_win.height);
            login_icon_w = Math.round(0.5 * this.dim_win.width);
        }else{
            card_height = Math.round(0.88 * this.dim_win.height);
            margin_card = Math.round(0.02 * this.dim_win.width);
            icon_size = Math.round(0.05* this.dim_win.width);
            data_size = Math.round(0.045 * this.dim_win.width);
            login_icon_h = Math.round(0.34 * this.dim_win.height);
            login_icon_w = Math.round(0.5 * this.dim_win.width);
        }
    }



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
            console.log(password_actual);
            console.log(new_password);
            console.log(password_actual_hash);
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
                    <View style={{height:1000}}>
                        <View style={styles.card}>
                            <View style={styles.title}>
                                <Text style={{fontSize:22, color:'white'}}>Editar Usuário</Text>
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
                                <View style={[styles.section_title, {marginTop:40   }]}>
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
            marginTop:30,
            flex:1,
            justifyContent:'center',
        },
        form:{
            justifyContent:'flex-start',
            flex:5,
            width:'100%',
            padding:20,
            marginBottom:5,
            
        },
        button:{
            height:50,
            backgroundColor:'red',
            borderRadius:15,
            alignItems:'center',
            justifyContent:'center',
            elevation:2,
            marginVertical:10,
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
            borderColor:'#b7b2b2ff',
            color:'#7A7A7A',
        },
        line:{
            backgroundColor:'white',
            opacity:0.8,
            width:'100%',
            height:1,
            marginVertical:5,
        },
        section_title:{
            marginVertical:5,
        }


    

    }
);