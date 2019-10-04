
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
  } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationActions } from "react-navigation";
import { heightPercentageToDP } from 'react-native-responsive-screen';

export default class SideMenu extends Component{

    constructor(props){
        super(props);
    }

    render(){
        const navigation = this.props.navigation;
        return(
            <View style={{flex:1}}>
                
            <View style={styles.header} >
                <View style={{flex:1,width:'100%', alignItems:'center', justifyContent:'center'}}>
                        <Image style={{width: heightPercentageToDP("23%"), height: heightPercentageToDP("23%"), resizeMode: 'contain'}} source={require('../assets/logo.png')}/>    
                </View>
              </View>
                <View style={styles.body}> 
                    <View style={styles.options_container}>
                        <View style={styles.option}>
                            <TouchableOpacity onPress={() => navigation.navigate("Login")}>                  
                                <View style={{flexDirection:'row'}}>
                                    <Icon name="person" size={33}/>
                                    <View style={{justifyContent:'flex-end'}}>
                                        <Text style={{fontSize:22, paddingLeft:10,}}>Login</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.line}/> 
                        </View>
                        <View style={styles.option}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>                  
                                <View style={{flexDirection:'row'}}>
                                    <Icon name="person-add" size={33}/>
                                    <View style={{justifyContent:'flex-end'}}>
                                        <Text style={{fontSize:22,paddingLeft:10}}>Cadastrar</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.line}/>
                        </View>
                    </View>
                    <View style={{flex:1}}/>
                </View>
                <View  style={styles.footer}>
                    <Text style={{fontSize:17, color:'white'}}>Copyright © 2019 </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header:{
        flex:3,
        backgroundColor:'#4cb993ff',
        justifyContent:'center',
        alignItems:'center',
        paddingBottom:30
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
        padding:10,

    },
    line:{
        height:1,
        backgroundColor:'#b7b2b2ff',
        marginTop:15,
    },
    line_header:{
        height:1,
        backgroundColor:'#b7b2b2ff',
        
    },
    option:{
        flex:1,
        marginHorizontal:35,
        marginVertical:15,
        
    },
    options_container:{
        flex:1,
        width:'100%',
        marginTop:15,
        
    }
})