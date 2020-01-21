import React, { Component } from 'react';
import firebase from 'firebase';

import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ActivityIndicator,
  } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-picker';

import { withNavigation } from 'react-navigation';

const _8PT_ = 100/(hp("100%")/8);
const _4PT_ = (100/(hp("100%")/8))/2;

class InserirFoto extends Component{

    state = {image:null, uploading:false};

    
    
    buttonAdd =   <View style={styles.button}>
                            <Text style={{fontSize:hp("3%"), color:'white'}}>Salvar Alteração</Text>
                    </View>
                         
    activityIndicator = <View style={styles.button}>
                            <ActivityIndicator size={hp("5%")} color="white" />
                        </View>

    imagePickerOptions = {
        title: 'Escolher foto',
        storageOptions: {
        skipBackup: true,
        path: 'images',
        },
        allowsEditing:true,
    };

    adicionarImagem =  async () =>{
        ImagePicker.showImagePicker(this.imagePickerOptions, (response) => {
                      if (response.didCancel) {
                console.log('Usuário cancelou a adição de imagem');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
                Alert.alert(
                    '',
                    error.message,
                    [
                        {text: 'OK',},
                    ],
                );
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = 'data:image/jpeg;base64,' + response.data;
                this.setState({
                    image:source
                });
            }
          });
    }

    uploadMonitor =  (snapshot) =>{

        var progress = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
        console.log(progress);

        switch (snapshot.state) {

            case firebase.storage.TaskState.PAUSED: 
              console.log('Upload is paused');
              break;

            case firebase.storage.TaskState.RUNNING:
              console.log('Upload is running');
              this.setState({uploading:true});
              break;
        }
    }

    uploadErrorCallback = (error) =>{
        Alert.alert(
            '',
            error.message,
            [
                {text: 'OK',},
            ],
            {cancelable: false},
        );
    }

    uploadSucessfulCallback = () =>{
        this.setState({uploading:false});
        this.props.navigation.navigate("Home");
    }

    upImagem = () => {
        var uid = firebase.auth().currentUser.uid;
        const imageBlob = new Blob([this.state.image], {type:'image/jpeg'})
        const ref = firebase.storage().ref('avatars/'+uid+'/image.jpeg');
        var uploadTask = ref.put(imageBlob, { contentType: 'image/jpg' });
        uploadTask.on('state_changed', this.uploadMonitor, this.uploadErrorCallback, this.uploadSucessfulCallback);
        ref.getDownloadURL().then(url => {
            firebase.database().ref("ofertas/"+uid+"/avatar").set(url);
        })
            
        
    }
    componentDidMount = () => {
        this.props.navigation.addListener('didFocus', () => {
            var avatar = this.props.navigation.getParam('avatarImage', this.state.image);
            this.setState({image:avatar});
            console.log("Imagem recebida do side menu");
        });
    }
    
    
    render(){
        return(
            <View style = {styles.body}>
                <View style={styles.card}>
                    <View style={styles.title}>
                        <Text style={{fontSize:22, color:'white'}}>Avatar</Text>
                    </View>
                    <View style={styles.form}>
                            <View style={styles.avatar}>
                            {!this.state.image ? <Image resizeMode="contain" style={styles.avatar_image} source={require("../assets/images/profile.png")}/> : <Image style={styles.avatar_image} source={{uri:this.state.image}}/>}
                            </View>           
                            <View style={styles.line}/>
                            <View style={{flex:1, width:'100%', alignItems:"center", justifyContent:"space-evenly", flexDirection:'column', margin:20}}>
                                <TouchableOpacity style={{width:'100%', flex:1, padding:20}} onPress={this.adicionarImagem}>
                                    <View style={styles.button}>
                                        <Text style={{fontSize:hp("3%"), color:'white'}}>Adicionar Imagem</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={{width:'100%',flex:1,padding:20}} onPress={this.upImagem}>
                                    {!this.state.uploading  ?  this.buttonAdd : this.activityIndicator} 
                                </TouchableOpacity>
                            </View> 
                    </View>
                </View>
            </View>
        );
    }
}

export default withNavigation(InserirFoto);

const styles =  StyleSheet.create(
    {
        body:{
            flex:1,
            alignContent:'center',
        },
        card:{
            elevation:3,
            height:hp("75%"),
            alignItems:'center',
            backgroundColor:'#4cb993ff',
            margin:wp("3%"),
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
            
            flex:8,
            width:'100%',
            marginBottom:5,
            alignItems:'center',
            
        },
        button:{
            height:hp("8%"),
            backgroundColor:'red',
            borderRadius:15,
            alignItems:'center',
            justifyContent:'center',
            elevation:2,
            borderStyle:'solid',
            borderWidth:1,
            borderColor:'#b7b2b2ff',
            width:'100%',
        },
        avatar:{
            marginBottom:40,
            width:150,
            height:150,
            borderRadius:100,
            backgroundColor:'gray',
        },
        avatar_image:{
            borderRadius:100,
            width:'100%',
            height:'100%',
        },
        line:{
            width:'100%',
            height:1,
            opacity:0.8,
            backgroundColor:'white',
        }
    }
);