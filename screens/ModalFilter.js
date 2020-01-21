import React,{ Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Modal
} from "react-native";
import { TouchableOpacity } from 'react-native-gesture-handler';
import ModalButton from "../components/ModalButton";

import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const _8PT_ = 100/(hp("100%")/8);
const _4PT_ = (100/(hp("100%")/8))/2;


class ModalFilter extends Component{
    constructor(props){
        super(props);
    }

    state = {
        modalVisible: false,
      };
    
    setModalVisible = (visible) => {
        this.setState({modalVisible: visible});
    }

    render = () => {
        return(
            <Modal style={styles.modal_body}
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
                <View style={styles.modal_row}>
                    <View style={styles.modal_col}>
                                <View styles={styles.input_container}>

                                </View>
                    </View>
                    <View style={styles.modal_col}>
                                <View styles={styles.input_container}>

                                </View>
                    </View>
                </View>
                <View style={styles.modal_row}>
                    <View style={styles.modal_col}>
                        <TextInput></TextInput>
                    </View>

                </View>
                <View style={styles.modal_row}>
                    <View style={styles.modal_col}>
                    </View>
                </View>
                <View>
                    <ModalButton/>
                </View>
            </Modal>
        )
    }
}


const styles  = StyleSheet.create({
    modal_body:{
        height:hp("70%"),
        width:wp("90%"),
        backgroundColor:"white",
        elevation:5,
    },
    modal_col:{

    },
    modal_row:{

    },
    input_container:{

    },
});

export default ModalFilter;