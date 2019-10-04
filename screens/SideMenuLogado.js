
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

dim_scr =  Dimensions.get('screen');
dim_win =  Dimensions.get('window');
if(dim_scr.width < 900){
    if(dim_scr.height > 1350){

    }else{
        margin_over_edit_user = '10%';
    }

}else if(dim_scr.width < 1250){

    if(dim_scr.height < 2450){

    }else{

    }
}else{
    if(dim_scr < 2960){

    }else{

    }
}

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
       console.log(userId);
       firebase.database().ref('user/' + userId).on('value', (snapshot) => {

                var formated_name = this.formatName(snapshot.val().nome);

                this.setState({nome:formated_name, avatar:snapshot.val().avatar});
                console.log("Imagem do side menu lateral recarregada!");
            }
        )  
    }

    componentDidMount(){
        this.props.navigation.addListener("didFocus", (payload) => {
                this.getAvatar();   
            }
        );
        
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
                                        <Text style={{color:'#333333', fontSize:hp("2%")}}>Editar Usuário</Text>
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
                                    <Icon name="home" size={33}/>
                                    <View style={{justifyContent:'flex-end'}}>
                                        <Text style={{fontSize:22,paddingLeft:10}}>Home</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.line}/> 
                        </View>
                        <View style={styles.option}>
                            <TouchableOpacity onPress={() => {navigation.navigate('MinhaPostagem')}}>                  
                                <View style={{flexDirection:'row'}}>
                                    <IconCommunity name="pencil" size={33}/>
                                    <View style={{justifyContent:'flex-end'}}>
                                        <Text style={{fontSize:22,paddingLeft:10}}>Adicionar/Editar</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.line}/>
                        </View>
                        <View style={styles.option}>
                            <TouchableOpacity onPress={()=>{this.logOut(navigation)}}>                  
                                <View style={{flexDirection:'row'}}>
                                    <IconCommunity name="exit-run" size={33}/>
                                    <View style={{justifyContent:'flex-end'}}>
                                        <Text style={{fontSize:22,paddingLeft:10}}>Sair</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.line}/>
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
