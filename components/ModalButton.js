import React,{ Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
const _8PT_ = 100/(hp("100%")/8);
const _4PT_ = (100/(hp("100%")/8))/2;



class ModalButton extends Component{
    constructor(props){
        super(props);
    }
    callFilter = () => {
        this.props.modalRef.callFilter();
    }

    render = () => {
        return(
                <TouchableOpacity onPress={() => { 
                    this.callFilter();
                    } } style={styles.button}>
                    <View style={styles.text_button_container}>
                        <Text style={styles.text_button}>Filtrar</Text>
                    </View>
                </TouchableOpacity>
        );
    }
    
}

const styles = StyleSheet.create({
    button:{
        height:hp(8*_8PT_),
        backgroundColor: '#4cb993ff', 
        width:'100%'
    },
    text_button_container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    text_button:{
        fontSize:hp(2.6*_8PT_),
        fontWeight:'bold',
        color:'white'
    }
})

export default ModalButton;



