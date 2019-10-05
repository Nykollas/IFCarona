import {
    View,
    TouchableOpacity,
    StyleSheet,
  } from 'react-native';
import React ,{ Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import  API_KEY_GOOGLE_MAPS  from "../const/MapsKey";
import MapViewDirections from 'react-native-maps-directions';
import MapView, { Marker } from "react-native-maps";
import {Header} from 'react-navigation-stack';

_8PT_ = Number(Header.HEIGHT/hp('100%')*100).toFixed(2).concat("%");

class MapComponent extends Component{

    constructor(props){
        super(props);
        console.log(API_KEY_GOOGLE_MAPS);        
    }

    state = {
        start:{latitude:-21.6998412, longitude:-45.8928529}, 
        end:{latitude:-21.6998412, longitude:-45.8928529},
        region:null,
    }

    goToOriginRegion = () =>{
        region = {
            latitude: this.state.start.latitude,
            longitude: this.state.start.longitude,
            latitudeDelta: 0.003,
            longitudeDelta: 0.0011,
        }
       this.setState({region:region});
    }

    goToDestRegion = () =>{
        region = {
            latitude: this.state.end.latitude,
            longitude: this.state.end.longitude,
            latitudeDelta: 0.003,
            longitudeDelta: 0.0011,
        }
       this.setState({region:region});
    }

    componentDidMount = () => {

        this.setState({
            start:this.props.start,
            end:this.props.end,
        });
        initialRegion = {
            latitude: this.state.start.latitude,
            longitude: this.state.start.longitude,
            latitudeDelta: 0.003,
            longitudeDelta: 0.0011,
        }
        this.goToOriginRegion();
    }

    render = () =>{
        return(
            <View style={styles.map_card}>
            <View style={styles.map_container}>
                    <MapView style={styles.map} initialRegion={this.initialRegion} region={this.state.region}>
                        {this.state.start ? <Marker coordinate={this.state.start} title={"Saída"} /> : <View></View>}

                        {this.state.start && this.state.end ? 
                        <MapViewDirections origin={this.state.start} 
                                        destination={this.state.end} 
                                        apikey={API_KEY_GOOGLE_MAPS} 
                                        strokeWidth={3}
                                        strokeColor="red"/> : 
                        <ActivityIndicator size={hp("8%")} color="#AAAAAA"/>}

                        {this.state.start ? <Marker coordinate={this.state.end} title={"Destino"} /> : <View></View>}

                    </MapView>
                    <TouchableOpacity style={styles.map_button_origin} onPress={this.goToOriginRegion}>
                        <View >
                            <Icon color="#FFFFFF" name="home-map-marker" size={hp("5%")}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.map_button_dest} onPress={this.goToDestRegion}>
                        <View >
                            <Icon color="#FFFFFF" name="map-marker" size={hp("5%")}/>
                        </View>
                    </TouchableOpacity>
            </View>
        </View>
        );
    }

}

const styles = StyleSheet.create({
    map_container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
        
    },
    map_card:{
        flex:1,
        backgroundColor:'white',
        borderRadius:12, 
        elevation:5, 
        flexDirection:'column',
        zIndex:-1
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    map_button_dest:{
        backgroundColor:"red",
        height:hp("5%"),
        width:wp("15%"),
        borderRadius:8,
        elevation:1,
        alignItems:"center",
        justifyContent:"center",
        position:"absolute",
        bottom:0.14*hp(_8PT_),
        right:0.14*hp(_8PT_)         
    },
    map_button_origin:{
        backgroundColor:"red",
        height:hp("5%"),
        width:wp("15%"),
        borderRadius:8,
        elevation:1,
        alignItems:"center",
        justifyContent:"center",
        position:"absolute",
        bottom:0.14*hp(_8PT_),
        left:0.14*hp(_8PT_)        
    }
});

export default MapComponent;