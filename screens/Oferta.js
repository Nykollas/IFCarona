
import React, { Component } from 'react';
import {
  StyleSheet, 
  Text,
  View,
  ActivityIndicator,
  BackHandler,
  Alert,
  Modal,
  Keyboard,
  Animated,
  PanResponder
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { withNavigation } from 'react-navigation';
import firebase from 'firebase';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Card from "../components/Card";
import Swiper from 'react-native-deck-swiper';
import { ScrollView } from 'react-native-gesture-handler';
//import ModalFilter from "../components/ModalFilter";
import ModalButton from "../components/ModalButton";
import Icon from 'react-native-vector-icons/MaterialIcons';
const _8PT_ = 100 / (hp("100%") / 8);
const _4PT_ = (100 / (hp("100%") / 8)) / 2;

class CustomSwiper extends Swiper {

  isOnSquare = (x0, y0) => {

    if (x0 > 30 && x0 <= 380 && y0 > 350 && y0 < 600) {

      return true;
    } else {

      return false;
    }
  }
  onPanResponderMove = (event, gestureState) => {
    this.props.onSwiping(this._animatedValueX, this._animatedValueY)

    let { overlayOpacityHorizontalThreshold, overlayOpacityVerticalThreshold } = this.props
    if (!overlayOpacityHorizontalThreshold) {
      overlayOpacityHorizontalThreshold = this.props.horizontalThreshold
    }
    if (!overlayOpacityVerticalThreshold) {
      overlayOpacityVerticalThreshold = this.props.verticalThreshold
    }

    let isSwipingLeft,
      isSwipingRight,
      isSwipingTop,
      isSwipingBottom

    if (Math.abs(this._animatedValueX) > Math.abs(this._animatedValueY) && Math.abs(this._animatedValueX) > overlayOpacityHorizontalThreshold) {
      if (this._animatedValueX > 0) isSwipingRight = true
      else isSwipingLeft = true
    } else if (Math.abs(this._animatedValueY) > Math.abs(this._animatedValueX) && Math.abs(this._animatedValueY) > overlayOpacityVerticalThreshold) {
      if (this._animatedValueY > 0) isSwipingBottom = true
      else isSwipingTop = true
    }

    if (isSwipingRight) {
      this.setState({ labelType: LABEL_TYPES.RIGHT })
    } else if (isSwipingLeft) {
      this.setState({ labelType: LABEL_TYPES.LEFT })
    } else if (isSwipingTop) {
      this.setState({ labelType: LABEL_TYPES.TOP })
    } else if (isSwipingBottom) {
      this.setState({ labelType: LABEL_TYPES.BOTTOM })
    } else {
      this.setState({ labelType: LABEL_TYPES.NONE })
    }

    const { onTapCardDeadZone } = this.props
    if (
      this._animatedValueX < -onTapCardDeadZone ||
      this._animatedValueX > onTapCardDeadZone ||
      this._animatedValueY < -onTapCardDeadZone ||
      this._animatedValueY > onTapCardDeadZone
    ) {
      this.setState({
        slideGesture: true
      })
    }
    if (!this.isOnSquare(gestureState.x0, gestureState.y0)) {
      return Animated.event([null, this.createAnimatedEvent()])(
        event,
        gestureState
      );
    } else {
      return 0;
    }
  }
}

class ModalFilter extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    modalVisible: false,
    direction_value: null,
    vehicle_value: null,
    period_value: null,
  };
  data_input = {
    items_direction: [
      { label: 'Ida', value: '1' },
      { label: 'Ida/Volta', value: '2' },
      { label: 'Volta', value: '3' }
    ],
    items_vehicle: [
      { label: 'Carro', value: '2' },
      { label: 'Moto', value: '1' },
      { label: 'Van', value: '3' },
    ],
    items_period: [
      { label: 'Matutino', value: '1' },
      { label: 'Noturno', value: '2' },
      { label: 'Integral', value: '3' },
    ]
  }
  setDirectionValue = (value) => {
    this.setState({ direction_value: value });
  }
  setVehicleValue = (value) => {
    this.setState({ vehicle_value: value });
  }
  setPeriodValue = (value) => {
    this.setState({ period_value: value });
  }
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  _animatedValue = new Animated.Value(hp("40%"));

  _keyboardDidHide = () => {
    Animated.timing(this._animatedValue, {
      toValue: hp('40%'),
      duration: 1000
    }).start();
  }

  _keyboardDidShow = () => {
    Animated.timing(this._animatedValue, {
      toValue: 0,
      duration: 600
    }).start();
  }

  _panResponder = PanResponder.create({
    // Ask to be the responder:
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onShouldBlockNativeResponder: (evt, gestureState) => {
      if(gestureState.y0 < hp("38%")){
        
        this.setModalVisible(false);
      }
      return true;
    },
  });
  
  callFilter = () => {
      let direction_value = this.state.direction_value;
      let vehicle_value = this.state.vehicle_value;
      let period_value = this.state.period_value;
      //Setting states to the default value
      this.setState({
        direction_value: null,
        vehicle_value: null,
        period_value: null
      });
      this.closeModal()
      this.props.ofertaRef.getAllData( vehicle_value, direction_value, period_value);

  }

  handleBackPress = () => {
    this.setModalVisible(false);
  }

  closeModal = () => {
    
    this.setModalVisible(false);
  }

  componentDidMount = () => {
    Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
    Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
  }

  render = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          this.setModalVisible(false)
        }}>
        <Animated.View {...this._panResponder.panHandlers} style={{ backgroundColor: 'rgba(0, 0, 0, 0)', flex: 1, paddingTop: this._animatedValue }}>
          <View style={[styles_modal.modal_body_container]}>
            <View style={styles_modal.modal_body}>
              <View style={styles_modal.modal_row}>
                <View style={styles_modal.modal_col}>
                  <View style={styles_modal.input_container}>
                    <Text style={styles_modal.input_label}>Direção</Text>
                    <RNPickerSelect
                      useNativeAndroidPickerStyle={false}
                      onValueChange={this.setDirectionValue}
                      items={this.data_input.items_direction}
                      style={pickerSelectStyles}

                    />
                  </View>
                </View>
                <View style={styles_modal.modal_col}>
                  <View style={styles_modal.input_container}>
                    <Text style={styles_modal.input_label}>Periodo</Text>
                    <RNPickerSelect
                      useNativeAndroidPickerStyle={false}
                      onValueChange={this.setPeriodValue}
                      items={this.data_input.items_period}
                      style={pickerSelectStyles}
                    />
                  </View>
                </View>
              </View>
              <View style={styles_modal.modal_row}>
                <View style={styles_modal.modal_col}>
                  <View style={styles_modal.text_input_container}>
                    <Text style={styles_modal.input_label}>Veículo</Text>
                    <RNPickerSelect
                      useNativeAndroidPickerStyle={false}
                      onValueChange={this.setVehicleValue}
                      items={this.data_input.items_vehicle}
                      style={pickerSelectStyles}
                    />
                  </View>
                </View>
              </View>
              <View style={styles_modal.modal_row}>
                <View style={styles_modal.modal_col}>
                  {/*<View style={styles_modal.text_input_container}>
                    <Text style={styles_modal.input_label}>Destino</Text>
                    {// A mudança de estado inserida no prop onFocus se faz necessário pois o marginTop do View de estilo modal_body_container possui uma margem que impossibilita que o mesmo desvia do teclado.
                    }
                    <TextInput placeholder={"Ex. Centro, Alfenas"} style={styles_modal.modal_text_input}></TextInput>
                  </View>
                  */}
                </View>
              </View>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ModalButton  modalRef={this} />
              </View>
            </View>
          </View>
        </Animated.View>
      </Modal>
    )
  }

}
class Oferta extends Component {

  state = { offers: null, 
            theresIsOffer: true,
            firstLoad: false,
            loaded: false,
            previous_index: 0,
            filtered:false,
          }
  emptyOffersText = <View style={{height:hp("75%"), alignItems:'center', justifyContent:'center'}}><Text>Não existem ofertas </Text></View>
  counter_ = 0;

  theresIsOffer = (offer_arr) => {
    
    if (offer_arr.length <= 1) {
      if (offer_arr[0] == undefined) {   
        this.setState({ theresIsOffer: false, loaded:true });
      }else if (offer_arr[0].frequency == undefined
          && offer_arr[0].vehicle == undefined 
            && offer_arr[0].nome == undefined 
              && offer_arr[0].time == undefined) {
                this.setState({theresIsOffer: false });
      } else {
        this.setState({ offers: offer_arr, theresIsOffer: true, loaded: true });
      }
    } else {
      this.setState({ offers: offer_arr, theresIsOffer: true, loaded: true });
    }
  }

isFiltered = (vehicle, direction, time) => {
  if(vehicle != null ||  direction != null  || time != null){
    this.setState({filtered:true});
  }else{
    this.setState({filtered:false});
  }
}

 processData = (snapshot, vehicle, direction, time) => {

    var offer_arr = [];
    if (snapshot.val() == null) {  
      this.setState({ theresIsOffer: false, loaded: true });
    } else {
      snapshot.forEach((user, key) => {
        if((user.val().vehicle === vehicle  || vehicle == null)
           && (user.val().frequency === direction || direction === null)
              && (user.val().time == time || time == null)){
                let url = user.val().avatar;
                var downloader = new XMLHttpRequest();
                downloader.onload = (e) => {  
                  offer_arr.push(
                    {
                      nome: user.val().nome,
                      frequency: user.val().frequency,
                      vehicle: user.val().vehicle,
                      desc: user.val().desc,
                      avatar: downloader.response,
                      end: user.val().end,
                      start: user.val().start,
                      time: user.val().time,
                      vehicle: user.val().vehicle
                    }
                  );
                  this.isFiltered(vehicle, direction,time);
                  this.theresIsOffer(offer_arr);
                }
                downloader.open("GET", url, true);
                downloader.send();
        }else{
          this.isFiltered(vehicle, direction,time);
          this.theresIsOffer(offer_arr);
        }
      });  
    }
  }
 
  getAllData = (vehicle, direction, time) => {

    //Presume se que já existem ofertas e atuva o spinne
    this.setState({loaded:false, theresIsOffer:true, filtered:false});

    firebase.database().ref('ofertas/').orderByChild("procura").equalTo(false).once('value',(snapshot) => {
      this.processData(snapshot, vehicle, direction, time);
    });
  }
  
  formatName = (string) => {
    if (string == "") {
      return string;
    } else {
      var str_arr = string.split(" ");
      var preparated_str_arr = new Array();
      for (var x = 0; x < str_arr.length; x++) {
        if (str_arr[x] != '') {
          preparated_str_arr.push(str_arr[x]);
        }
      }
      str_arr = preparated_str_arr;
      var fn = str_arr[0];
      if (str_arr.length > 1) {
        var ln = str_arr[1];
        var formatted_name = fn + " " + ln[0] + ".";
        return formatted_name;
      } else {
        return fn;
      }
    }
  }


  counter_ = 0;

  renderItem = ({ item }) => {
    var nome = item.nome;
    var frequency = item.frequency;
    var avatar = item.avatar;
    var desc = item.desc;
    var start = item.start;
    var end = item.end;
    var frequency = item.frequency;
    var time = item.time;
    var tel = item.tel;
    var vehicle = item.vehicle;
    if (!this.state.theresIsOffer) {
      return;
    }

    return (<Card name={this.formatName(nome)}
      avatar={avatar}
      frequency={frequency}
      time={time}
      desc={desc}
      start={start}
      end={end}
      vehicle={vehicle} />
    );
  }

  backHandlerCallBack = () => {
    Alert.alert(
      '',
      "Deseja sair do aplicativo ?"
      [
      {
        text: 'Sim',
        onPress: () => { BackHandler.exitApp(); },
      },
      {
        text: 'Cancelar',
        onPress: () => { return true },
        style: "cancel",
      }
      ],
      { cancelable: true },
    );
    return true;
  }

  cancelFilter = () => {
    this.setState({filtered:false});
    this.getAllData(null, null, null);
  }


  componentDidMount = () => {

    const { navigation } = this.props;

    //Responsável por baixar os dados quando o componente recarrega pela primeira vez e defini callback do botão voltar
    this.focusListener = navigation.addListener("didFocus", () => {
      //Define o callback a ser executado quando o voltar for pressionado sem que a tela Oferta for acessada
      BackHandler.addEventListener('hardwareBackPress', this.backHandlerCallBack);

      //Atualiza os dados sempre que o componente é montado
      //A condição abaixo previne que os dados sejam baixados duas vezes na primeira vez que o componente é montado
      if (this.state.firstLoad) {
        
        this.getAllData(null,null, null);
      }
    });

    //Responsável por baixar os dados quando o componente é montado pela primeira vez
    
    this.getAllData(null, null, null);

    //Define o estado que indica que os dados já foram baixados uma primeira vez
    this.setState({ firstLoad: true });

    //Define o callback a ser executado quando o componente for desemontado
    navigation.addListener("willBlur", () => {
      this.setState({ loaded: false });
      BackHandler.removeEventListener('hardwareBackPress', this.backHandlerCallBack);
    });

    //Define o callback a ser executado sempre que o botão voltar for pressionado
    BackHandler.addEventListener('hardwareBackPress', this.backHandlerCallBack);

    //Define o callback a ser associado ao teclado quando ele for escondido
    Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentDidUpdate = () => {
    //Recebe parâmetro enviado indicando que os dados foram alterados e a tela precisa ser atualizada
    const param_value = this.props.navigation.getParam('recentlyUpdate');

    //Recebe parâmetro enviado indicando que o modal de filtro deve ser aberto
    const param_value_modal = this.props.navigation.getParam('modalOpen');

    //Condição responsável por atualizar os dados e zerar o parâmetro  com o fim de evitar redundância de execução 
    //quando o componente é atualizado
    if (param_value === true) {
      this.getAllData(null, null, null);
      this.props.navigation.setParams({ recentlyUpdate: null })
    } 
    //Condição responsável por ativar o modal.
    else if (param_value_modal === true) {
      //Impede que a aplicação quebre caso o modal seja chamado antes que o componente esteja completamente montado
      while (!this.modalRef) {
        setTimeout(200, () => {

        });
      }
      this.modalRef.setModalVisible(true);
      this.props.navigation.setParams({ modalOpen:false })
    }

  }

  flatList = (data, renderFunction) => {

    if (!this.state.loaded) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
          <ModalFilter  ofertaRef={this}ref={(component) => this.modalRef = component}></ModalFilter>
          <ActivityIndicator size={60} color="#b7b2b2ff" />
        </View>);
    } else {
      return (

        <ScrollView>
          <ModalFilter ofertaRef={this} ref={(component) => this.modalRef = component}></ModalFilter>
          {this.state.filtered ? 
          <View style={styles.filter_status_container}>
            <View>
                <Text style={styles.filter_status_label}>Dados Filtrados</Text>
            </View>
            <View>
                <Icon.Button onPress={this.cancelFilter} backgroundColor={'#00000000'} color={'gray'} name="close"/>
            </View>
          </View>: <></>}
          <View style={{ height: hp(86 * _8PT_), width: '100%' }}>
            <Swiper backgroundColor={'#f5fcf6ff'}
              ref={(component) => { this.swiperComponentRef = component }}
              cards={data}
              stackSize={2}
              cardHorizontalMargin={0}
              cardVerticalMargin={0}
              infinite
              renderCard={(cardProps) => {
                if (cardProps.nome == undefined) {
                  console.log("UNDEFINED");
                  setTimeout(300, () => {

                  });
                }
                return (
                  <Card name={this.formatName(cardProps.nome)}
                    avatar={cardProps.avatar}
                    frequency={cardProps.frequency}
                    time={cardProps.time}
                    desc={cardProps.desc}
                    start={cardProps.start}
                    end={cardProps.end}
                    vehicle={cardProps.vehicle} />
                );
              }}
              inputRotationRange={[0, 0, 0]}
              outputRotationRange={["0deg", "0deg", "0deg"]}
              disableTopSwipe
              disableBottomSwipe
              verticalSwipe={false}


            />
          </View>
        </ScrollView>

      );
    }
  }

  render() {
    return (
      <View style={styles.body}>
        <ModalFilter ofertaRef={this} ref={(component) => this.modalRef = component}></ModalFilter>
        {this.state.filtered ? 
          <View style={styles.filter_status_container}>
            <View>
                <Text style={{color:'gray', fontSize:hp(2*_8PT_), fontWeight:'bold'}}>
                  Dados filtrados
                </Text>
            </View>
            <View>
                <Icon.Button onPress={this.modalRef.callFilter} backgroundColor={'#00000000'} color={'gray'} name="close"/>
            </View>
          </View>: <></>}
        {this.state.theresIsOffer ? this.flatList(this.state.offers, this.renderItem) : this.emptyOffersText}
      </View>
    );
  }
}
export default withNavigation(Oferta);



const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: hp(2.4 * _8PT_),
    paddingVertical: 8,
    color: '#666666',
    paddingRight: 30, // to ensure the text is never behind the icon
  },

});


const styles_modal = StyleSheet.create(
  {
    keyboard_view: {
      flex: 1,
    },
    modal_body_container: {
      flex: 1,
      height: hp("40%"),
      backgroundColor: '#4cb993ff',
      borderTopRightRadius: 12,
      borderTopLeftRadius: 12,
      elevation: 8

    },
    modal_body: {
      marginTop: 8,
      backgroundColor: "#FDFDFD",
      height: "100%",
      borderTopRightRadius: 12,
      borderTopLeftRadius: 12,
    },
    modal_text_input: {
      height: hp(6 * _8PT_),
      width: '100%',
      backgroundColor: 'white',

      paddingLeft: hp(2 * _8PT_),
      paddingRight: hp(2 * _8PT_),
    },
    modal_row: {
      flex: 1,
      flexDirection: 'row',
    },
    modal_col: {
      flex: 1,
      margin: 3,
      flexDirection: 'column'
    },
    input_container: {
      flex: 1,
      alignItems: "flex-start",
      justifyContent: "flex-start",
      width: '100%',
      margin: 2,
      flexDirection: 'column',
      paddingTop: hp(2 * _8PT_),
      paddingLeft: hp(2 * _8PT_),
    },
    text_input_container: {
      paddingTop: hp(2 * _8PT_),
      paddingLeft: hp(2 * _8PT_),
      paddingRight: hp(2 * _8PT_),
    },
    input_label: {
      fontSize: hp(2.4 * _8PT_),
      fontWeight: 'bold',
      color: '#555555'
    }
  }
)


const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#f5fcf6ff",
  },
  filter_status_container:{height:hp("10%"),marginTop:hp(_8PT_), marginBottom:hp(_8PT_),  alignItems:'center', flexDirection:'row', justifyContent:'space-around'},
  filter_status_label:{color:'gray', fontSize:hp(2*_8PT_), fontWeight:'bold'}
});