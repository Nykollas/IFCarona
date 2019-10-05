
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    FlatList,
    View,
    Image,
    ActivityIndicator,
    Linking,
    TouchableOpacity,
    BackHandler,
    Alert,
  } from 'react-native';
import {systemWeights} from 'react-native-typography';
import {withNavigation} from 'react-navigation';
import Header from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firebase from 'firebase';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Map from '../components/MapComponent';


const _8PT_ = 100/(hp("100%")/8);
const _4PT_ = (100/(hp("100%")/8))/2;

class Card extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <View style={styles.card}>
                <View style={styles.panel_header}>
                    <View style={{flex:1}}>
                        <Image style={styles.profile} source={{uri:this.props.avatar}}/>
                    </View>
                    <View style={styles.name}>
                        <Text style={[systemWeights.bold, {fontSize:hp(3 * _8PT_), color:"#3C3C3C"}]}>{this.props.name}</Text>
                    </View>
                </View>
                <View style={[styles.line, {width:'100%'}]}/>
                <View style={styles.panel_body}>
                        <View style={styles.data_container}>
                            <View style={styles.data}>
                                <View style={styles.data_title}>
                                        <Icon name='person' color="#3C3C3C" size={ hp( 3 * _8PT_ + _4PT_)} />
                                        <Text adjustsFontSizeToFit style={[systemWeights.semibold,{fontSize:hp(3 * _8PT_), color:"#3C3C3C"}]}>Contato</Text>
                                </View>
                                <View style={styles.line}/>
                                <View style={styles.data_value}>
                                    <Text style={[systemWeights.semibold, {color:'#7A7A7A',fontSize:hp(2 * _8PT_ + _4PT_)}]}>{this.props.contato}</Text>
                                </View>
                            </View>
                            <View style={styles.data}>
                                <View style={styles.data_title}>
                                    <Icon name='attach-money' color='#3C3C3C' size={ hp( 3 * _8PT_ + _4PT_)} />
                                    <Text style={[systemWeights.semibold,{fontSize:hp(3 * _8PT_), color:"#3C3C3C"}]}>Contribuição</Text>
                                </View>
                                <View style={styles.line}/>
                                <View style={[styles.data_value, {alignItems:"center"}]}>
                                    <Text  adjustsFontSizeToFit style={[systemWeights.semibold,{color:'#7A7A7A',fontSize:hp( 2 *_8PT_ + _4PT_)}]}>{this.props.preco}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.map_view}>
                            <Map start={this.props.start} end={this.props.end}/>
                        </View>
                </View>
                <TouchableOpacity  style={styles.card_footer} onPress={ () => {var tel = this.props.contato; Linking.openURL("tel://"+tel);}}>
                    <View style={{padding:56}}>
                        <Icon name='call' color='#FFF' size={hp(3 * _8PT_)} style={{marginRight:8}}/>
                    </View>
                </TouchableOpacity>
            </View>
        );
    } 
}

class Oferta extends Component {
    state = { offers : null,theresIsOffer:true, firstLoad:false, loaded:false}
    
    emptyOffersText = <Text>Não existem ofertas </Text>
    counter_ = 0;

    downloadImage = (url) =>{
          

    }

    getAllData = () => {
        var offer_arr = [];
        console.log("Referenciando lista de ofertas");
        firebase.database().ref('ofertas/').orderByChild("procura").equalTo(false).on('value',
            (snapshot) => {
                console.log("Lista de ofertas refenciada");
                console.log("Iterando dados dos usuários");
                if(snapshot.val() == null){
                    console.log("Sem ofertas");
                    this.setState({theresIsOffer:false, loaded:true});
                }else{
                    snapshot.forEach((user) =>{
                        console.log("Recebendo id de usuário");
                        var uid = firebase.auth().currentUser.uid;
                        console.log("Referenciado imagem de avatar do usuário");
                        firebase.storage().ref("avatars/"+uid+"/image.jpeg").getDownloadURL().then((url) => {
                            console.log("Instanciando classe responsável por fazer o download");
                            var downloader = new XMLHttpRequest(); 
                            console.log("Instanciando classe responsável por fazer o download");
                            downloader.onload = (e) => {
                                console.log("Download concluído");
                                console.log("Adicionando dados na lista de ofertas");
                                offer_arr.push(
                                    {   nome:user.val().nome,
                                        contato:user.val().contato,
                                        preco:user.val().preco,
                                        desc:user.val().desc,
                                        avatar:downloader.response,
                                        end:user.val().end,
                                        start:user.val().start,
                                    }
                                );
                                if(offer_arr.length <= 1){

                                    if(offer_arr[0] == undefined){
                
                                        console.log("Não existem ofertas");
                
                                        this.setState({theresIsOffer:false});
                
                                        return;     
                                    }
                
                                    if(offer_arr[0].contato == undefined && offer_arr[0].preco == undefined  && offer_arr[0].nome == undefined){
                
                                        console.log("Não existem ofertas");
                
                                        this.setState({theresIsOffer:false});
                
                                        return;     
                
                                    }else{
                
                                        this.setState({offers:offer_arr, theresIsOffer:true, loaded:true}); 
                
                                        return;
                                    }
                                }else{
                
                                    this.setState({offers:offer_arr, theresIsOffer:true, loaded:true});
                                    
                                }    
                            }

                            console.log("Informando url de download e método da requisição http");
                            downloader.open("GET", url, true);
                            console.log("Iniciando o download");
                            downloader.send();

                        }).catch((error)=>{
                            console.log("erro");
                        });

                    });
                }
            }
        )
        
    };

    formatPreco = (preco) => {
        var preco = Number(preco);
        var cifrao = "R$ ";
        preco = preco.toString();
        preco = preco.replace(".", ",");
        var index = preco.indexOf(",");
        if(index != -1){
            preco = preco.concat("0");
        }else{
            preco = preco.concat(",00");
        }

        return cifrao + preco;
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

    counter_ = 0;

    renderItem = ({item}) => {
       var nome = item.nome;
       var contato =  item.contato;
       var avatar =  item.avatar;
       var preco =  item.preco;
       var desc =  item.desc;
       var start = item.start;
       var end = item.end;
       if(!this.state.theresIsOffer){
            return;
       }
       if(this.counter_ == 0) {
            var string = contato.toString();
            var counter  = 0;
            var str_len = string.length;  
            var arr = new Array(str_len + 3);
            new_str = '';  
            if(string != ''){
                arr[0] = '(';
                arr[3] = ')';
                arr[9] = '-';
                for(var x = 0; x < str_len + 3; x++ ){
                    if(arr[x] == null){
                        arr[x] = string[counter];
                        counter++;
                    }
                }
                new_str = arr.join('');  
            }
            this.counter_ = 1;
       }

       return (<Card name={this.formatName(nome)}
                     avatar={avatar}
                     preco={this.formatPreco(preco)}
                     contato={new_str} 
                     desc={desc} 
                     start={start}
                     end = {end}/>
               );
    }

    backHandlerCallBack = () => {
        Alert.alert(
            '',
            "Deseja sair do aplicativo ?"
            [
                { 
                  text: 'Sim',
                  onPress:() => {BackHandler.exitApp();},
                },
                { 
                  text: 'Cancelar',
                  onPress:() => {return true},
                  style:"cancel",
                }
            ],
            { cancelable: true },
        );
        return true;
    }


    componentDidMount = () => {        

        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", () => {          
            BackHandler.addEventListener('hardwareBackPress', this.backHandlerCallBack);
            if(this.state.firstLoad){
                this.getAllData();
            }
        });
        this.getAllData();
        this.setState({firstLoad:true});
        navigation.addListener("willBlur", () => {
            this.setState({loaded:false});
            BackHandler.removeEventListener('hardwareBackPress',this.backHandlerCallBack);  
        });
        BackHandler.addEventListener('hardwareBackPress', this.backHandlerCallBack);
    }

    flatList = (data, renderFunction) => {
        
        if(!this.state.loaded){
                return(<View style={{flex:1, alignItems:'center',justifyContent:'center', flexDirection:'row'}}>
                        <ActivityIndicator size={60} color="#b7b2b2ff" />
                       </View>);
        }else{
            return(<FlatList data={data} 
                showsVerticalScrollIndicator={false}
                renderItem={renderFunction}
                keyExtractor={(item, index) => index.toString()}
                />);
        }   
    }

    render(){                                
        return(
            <View style={styles.body}>
                {this.state.theresIsOffer  ? this.flatList(this.state.offers, this.renderItem) : this.emptyOffersText}
            </View>
        );
    }
}
export default withNavigation(Oferta);

const styles = StyleSheet.create({
    map_view:{
        height:hp(20 * _8PT_),
        borderRadius:7,
        marginBottom:hp(_8PT_),
        backgroundColor:'#94ddadff',
        width:'90%',
    },
    body:{
        flex:1,
        backgroundColor:"#f5fcf6ff",
    },
    card:{
        margin:wp("3%"),
        backgroundColor:'white',
        height:hp(65 * _8PT_),
        borderRadius:15,
        borderStyle:'solid',
        borderWidth:0.3,
        borderColor:'#b7b2b2ff',
        elevation:3,
    },
    panel_header:{
        height:hp(20 * _8PT_),
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row',
    },
    profile:{
        borderRadius:100,
        margin:30,   
        width:hp(18* _8PT_), 
        height:hp(18  * _8PT_), 
    },
    name:{
        alignItems:'center',
        flex:1,
        right:23,
    },
    line:{
        height:2,
        backgroundColor:'#b7b2b2ff',
    },
    panel_body:{
        height:hp(40* _8PT_),
        alignItems:'center',
    },
    data:{
        flex:1,
    },
    data_container:{
        height:hp( 15 * _8PT_),
        flexDirection:'row',    
        width:'90%',
        alignItems:'center',
        justifyContent:'space-between',
        marginTop:0.42* hp(_8PT_),      
    },
    data_title:{
        flexDirection:'row',
        justifyContent:'flex-start',
        height:hp(3* _8PT_),
        width:"100%", 
        alignItems:"flex-end",
        marginBottom:hp(_8PT_),
    },
    data_value:{
        height:hp(_8PT_),
        alignItems:'flex-start',
        justifyContent:'center',
        marginBottom:hp(_8PT_),
        marginTop:hp(2 * _8PT_),
    },
    card_footer:{
        backgroundColor:'#4cb993ff',
        borderBottomRightRadius:15,
        borderBottomLeftRadius:15,
        height:hp(5 * _8PT_),
        alignItems:'center', 
        justifyContent:'center',
        elevation:5
    },
});