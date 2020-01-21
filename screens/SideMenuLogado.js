
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    BackHandler,
  } from 'react-native';
import { withNavigation } from 'react-navigation';

import Icon from 'react-native-vector-icons/MaterialIcons';
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from 'firebase';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const _8PT_ = 100/(hp("100%")/8);
const _4PT_ = (100/(hp("100%")/8))/2;

class SideMenuLogado extends Component{

    state = {avatar:null,nome:null}

    logOut = (navigation) => { 
        firebase.auth().signOut().then(() => {
            console.log("Saindo!!");
            navigation.navigate('home');
        });
    }

    sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    formatName = (string) => {    
        if(string == ""){
            return string;
        }else{
            var str_arr = string.split(" ");
            var preparated_str_arr = new Array();
            for(var x = 0; x < str_arr.length; x++){
                if(str_arr[x] != ''){
                       preparated_str_arr.push(str_arr[x]);
                }
            }
            str_arr = preparated_str_arr;
            var fn = str_arr[0];
            if(str_arr.length > 1){
                var ln  = str_arr[1];
                var formatted_name = fn + " " + ln[0]+".";
                return formatted_name;
            }else{
                return fn;
            }
        }
    }

    getAvatar = () => {
       var user = null;
       while(user == null){
           user = firebase.auth().currentUser;
           if(user == null){
              this.sleep(500);
           }
       }
       var userId = user.uid;
       firebase.database().ref('user/' + userId).once('value', (snapshot) => {
               
                var formated_name = this.formatName(snapshot.val().nome);
                const ref = firebase.storage().ref('avatars/'+userId+'/image.jpeg');
                ref.getDownloadURL().then(url  => {
                    const downloader = new XMLHttpRequest();
                    downloader.onload = () => {
                        this.setState({avatar: downloader.response});
                    }
                    downloader.onerror = (error) => {
                        Alert.alert(
                            '',
                            //error.error_message,
                            "Houve um erro",
                            [
                                {text:'Ok'}
                            ]
                        );
                    }
                    downloader.open("GET", url, true);
                    downloader.send();
                })
                this.setState({nome:formated_name});
                console.log("Imagem do side menu lateral recarregada!");
            }
        )  
    }

    componentDidMount = () => {
        this.props.navigation.addListener("didFocus", (payload) => {
                this.getAvatar();   
            }
        );
    }

    componentDidUpdate = (prevProps) => {
        //Atualiza a foto do side Menu quando ele é aberto
        //Implementar cache e checagem de atualização
        const isDrawerOpen = this.props.navigation.state.isDrawerOpen;
        const wasDrawerOpen = prevProps.navigation.state.isDrawerOpen;
        if(!wasDrawerOpen && isDrawerOpen){
            this.getAvatar();   
          }
          else if(wasDrawerOpen && !isDrawerOpen){
            
          }
    }
    render(){
        const navigation = this.props.navigation;
        return(
            <View style={{flex:1}}>
                <View style={styles.header}>
                    
                        <View style={{  flex:1, alignItems:"center", justifyContetn:"space-evenly",flexDirection:"column"}}>
                            <TouchableOpacity onPress={()=>{navigation.navigate("EditarFoto",{}, {typeName:'Navigate',routeName:'EditarFoto', params:{avatarImage:this.state.avatar}})}}>
                                <Image style = {styles.profile} source={{uri:this.state.avatar}}/>
                            </TouchableOpacity>
                            <View style = {styles.name}>
                                <Text style={{fontSize:hp("3%"), color:'#333333', fontWeight:'bold'}}>{this.state.nome}</Text>
                            </View>
                            <View style={styles.editar_usuario}>
                                <TouchableOpacity onPress={()=>{this.props.navigation.navigate("EditarUsuario")}}>
                                        <Text style={{color:"#333333", fontSize:hp("2%")}}>Editar Usuário</Text>
                                </TouchableOpacity>
                            </View>     
                        </View>
                </View>
                <View style={styles.line}></View>
                <View style = {styles.body}> 
                    <View style={styles.options_container}>
                        <View style={styles.option}>
                            <TouchableOpacity onPress={() => {navigation.navigate('Home')}}>                  
                                <View style={{flexDirection:'row'}}>
                                    <Icon name="home" color="#333333" size={33}/>
                                    <View style={{justifyContent:'flex-end'}}>
                                        <Text style={{color:"#333333", fontWeight:"bold", fontSize:22,paddingLeft:10}}>Home</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            
                        </View>
                        <View style={styles.option}>
                            <TouchableOpacity onPress={() => {navigation.navigate('MinhaPostagem')}}>                  
                                <View style={{flexDirection:'row'}}>
                                    <IconCommunity name="pencil" color="#333333" size={33}/>
                                    <View style={{justifyContent:'flex-end'}}>
                                        <Text style={{ fontWeight:"bold",color:"#333333",fontSize:22,paddingLeft:10}}>Adicionar/Editar</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            
                        </View>
                        <View style={styles.option}>
                            <TouchableOpacity onPress={()=>{this.logOut(navigation)}}>                  
                                <View style={{flexDirection:'row'}}>
                                    <IconCommunity color="#333333" name="exit-run" size={33}/>
                                    <View style={{justifyContent:'flex-end'}}>
                                        <Text style={{color:"#333333", fontWeight:"bold",fontSize:22,paddingLeft:10}}>Sair</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            
                        </View>
                    </View>
                    <View style={{flex:1}}/>
                </View>
                <View style={styles.footer}>
                    <Text style={{fontSize:17, color:'white'}}>Copyright © 2019 </Text>
                </View>
            </View>
        );
    }
}

export default withNavigation(SideMenuLogado);

const styles = StyleSheet.create({
    header:{
        flex:3,
        flexDirection:'row',
        backgroundColor:'#FCFCFC',
        alignItems:'center',
        paddingVertical:hp("3%"),
    },
    body:{
        flex:4.5,
        alignItems:'center',
        
    },
    footer:{
        flex:2,
        backgroundColor:'#4cb993ff',
        justifyContent:'flex-end',
        alignItems:'center',
    },
    line:{
        height:2,
        backgroundColor:'#b7b2b2ff',
        marginTop:10    
    },
    option:{
        flex:1,
        marginHorizontal:35,
        marginVertical:15,   
    },
    options_container:{
        flex:3,
        width:'100%',
        marginTop:15,
        
    },
    profile:{
        height:125,
        width:125,
        borderRadius:100,
        backgroundColor:'gray',
        shadowColor:'gray',
        shadowOpacity:1.0,
        shadowOffset:{width:10, height:10}


    },
    name:{
        flex:1,
        flexDirection:'column',
        alignItems:"center",
        justifyContent:"center",
        color:'white',  
        elevation:15,
    }
})
