
import React, { Component } from 'react'; import {
    Text,
    View,
    Image,
    Linking,
    TouchableOpacity,
    StyleSheet

} from 'react-native';
import { systemWeights } from 'react-native-typography';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFAS5 from 'react-native-vector-icons/FontAwesome5';
import Map from '../components/MapComponent';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const _8PT_ = 100 / (hp("100%") / 8);
const _4PT_ = (100 / (hp("100%") / 8)) / 2;

class Card extends Component {
    constructor(props) {
        super(props);
    }

    getVehicle = () => {
        if (this.props.vehicle && this.props.vehicle == '1') {

            return (<Text>Moto</Text>);

        } else if (this.props.vehicle && this.props.vehicle == '2') {

            return (<Text>Moto</Text>);

        } else {

            return (<Text>Van</Text>);
        }
    }

    getTime = () => {

        if (this.props.time && this.props.time == '1') {
            return ("Matutino");
        } else if (this.props.time && this.props.time == '2') {
            return ("Noturno");
        } else {
            return ("Integral");
        }
    }
    getFrequency = () => {

        if (this.props.frequency && this.props.frequency == '1') {
            return ("Ida");
        } else if (this.props.frequency && this.props.frequency == '2') {
            return ("Volta");
        } else {
            return ("Ida/Volta");
        }
    }

    render() {
        return (
            <View style={styles.card}>
                <View style={styles.panel_header}>
                    <View style={{ flex: 1 }}>
                        <Image style={styles.profile} source={{ uri: this.props.avatar }} />
                    </View>
                    <View style={styles.name}>
                        <Text style={[systemWeights.bold, { fontSize: hp(3 * _8PT_), color: "#3C3C3C" }]}>
                            {this.props.name}
                        </Text>
                        <Text style={[systemWeights.regular, { marginTop: 30 * _8PT_, fontSize: hp(2.6 * _8PT_), color: "#3C3C3C" }]}>
                            {this.props.label}
                        </Text>
                    </View>
                </View>
                <View style={[styles.line, { width: '100%' }]} />
                <View style={styles.panel_body}>
                    <View style={styles.data_container}>
                        <View style={styles.data}>
                            <View style={[styles.data_title, {alignItems:'center',justifyContent:'center'}, ]}>
                                <Image
                                    resizeMode={'contain'}
                                    style={{ width: 30, height: 24, marginRight:10 }}
                                    source={require("/home/ascencion/IFCarona/assets/images/direction.png")}
                                />  
                            </View>
                            <View style={styles.line} />
                            {// Modificar aqui, ida e volta
                            }
                            <View style={styles.data_value}>
                                <Text style={[systemWeights.semibold, { marginTop: hp(2 * _8PT_), color: '#7A7A7A', fontSize: hp(2 * _8PT_ + _4PT_) }]}>
                                    {this.getFrequency()}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.data}>
                            <View style={[styles.data_title, {alignItems:'center',justifyContent:'center'}]}>
                                <Image
                                    resizeMode={'contain'}
                                    style={{ width: 56, height: 24,marginRight:10 }}
                                    source={require("/home/ascencion/IFCarona/assets/images/carro_moto.png")}
                                />
                            </View>
                            <View style={styles.line} />
                            <View style={[styles.data_value, { alignItems: "center" }]}>
                                <Text style={[systemWeights.semibold, { marginTop: hp(2 * _8PT_), color: '#7A7A7A', fontSize: hp(2 * _8PT_ + _4PT_) }]}>
                                    {this.getVehicle()}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.time_data_container}>
                        <View style={styles.time_data}>
                            <View style={styles.time_data_title}>
                            <Image
                                    resizeMode={'contain'}
                                    style={{ width: 30, height: 24, marginRight:10 }}
                                    source={require("/home/ascencion/IFCarona/assets/images/time.png")}
                                />  
                                
                            </View>
                            <View style={styles.line} />
                            {// Modificar aqui período
                            }
                            <View style={styles.time_data_value}>
                                <Text style={[systemWeights.semibold, { marginTop: hp(2 * _8PT_), color: '#7A7A7A', fontSize: hp(2 * _8PT_ + _4PT_) }]}>
                                    {this.getTime()}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.map_view}>
                        <Map start={this.props.start} end={this.props.end} />
                    </View>
                </View>
                <TouchableOpacity style={styles.card_footer}
                    onPress={() => { var tel = this.props.contato; Linking.openURL("tel://" + tel); }}>
                    <View style={{ padding: 56 }}>
                        <Icon name='call'
                            color='#FFF'
                            size={hp(3 * _8PT_)}
                            style={{ marginRight: 8 }} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    map_view: {
        height: hp(24 * _8PT_),
        borderRadius: 7,
        marginBottom: hp(_8PT_),
        backgroundColor: '#94ddadff',
        width: '90%',
    },
    card: {
        margin: wp("3%"),
        backgroundColor: 'white',
        height: hp(80 * _8PT_),
        borderRadius: 15,
        borderStyle: 'solid',
        borderWidth: 0.3,
        borderColor: '#b7b2b2ff',
        elevation: 3,
    },
    panel_header: {
        height: hp(20 * _8PT_),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    profile: {
        borderRadius: 100,
        margin: 30,
        width: hp(18 * _8PT_),
        height: hp(18 * _8PT_),
    },
    name: {
        alignItems: 'center',
        flex: 1,
        right: 23,
    },
    line: {
        height: 2,
        backgroundColor: '#b7b2b2ff',
    },
    panel_body: {
        height: hp(56 * _8PT_),
        alignItems: 'center',

    },
    data: {
        flex: 1,
    },
    data_value: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'gray',
    },
    time_data: {
        width: '100%',
    },
    time_data_value: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    data_container: {
        height: hp(15 * _8PT_),
        flexDirection: 'row',
        width: '90%',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 0.42 * hp(_8PT_),
    },
    time_data_container: {
        height: hp(15 * _8PT_),
        width: '90%',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 0.42 * hp(_8PT_),
    },
    time_data_title: {
        flexDirection: 'row',
        justifyContent: 'center',
        height: hp(3 * _8PT_),
        width: "100%",
        alignItems: "flex-end",
        marginBottom: hp(_8PT_),
    },
    data_title: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        height: hp(3 * _8PT_),
        width: "100%",
        alignItems: "flex-end",
        marginBottom: hp(_8PT_),
    },
    data_value: {
        height: hp(_8PT_),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp(_8PT_),
        marginTop: hp(2 * _8PT_),
    },
    card_footer: {
        backgroundColor: '#4cb993ff',
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        height: hp(5 * _8PT_),
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5
    },

});

export default Card;