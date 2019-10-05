import 'react-native-gesture-handler';    
import React from 'react';
import {createAppContainer } from "react-navigation";
import {createBottomTabNavigator}  from 'react-navigation-tabs';
import {createStackNavigator}  from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import {BottomTabBar} from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Login from './screens/Login';
import Register from './screens/Register';
import SideMenu from './screens/SideMenu';
import SideMenuLogado from './screens/SideMenuLogado';
import InserirFoto from './screens/InserirFoto';
import EditarFoto from './screens/EditarFoto';
import EditarUsuario from './screens/EditarUsuario';
import RedefinicaoSenha from './screens/RedefinicaoSenha';
import Procura from './screens/Procura';
import Oferta from './screens/Oferta';
import MinhaPostagem from './screens/MinhaPostagem';
import firebase from 'firebase';
import Geocoder from "react-native-geocoding";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {
  StyleSheet,
  Image,
  View,
  Text,
} from 'react-native';


const config = {
  apiKey: "AIzaSyAPZj3h71if9tP8p8ozynphv6qFhg7S3zU",
  authDomain: "ifride.firebaseapp.com",
  databaseURL: "https://ifride.firebaseio.com/",
  storageBucket: "gs://ifride.appspot.com/"
};          

firebase.initializeApp(config);
Geocoder.init("AIzaSyDNlio27LqraNed4EAIjmjBiuEQ46UjyIg"); 
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#4cb993ff',
    shadowOffset:{  width: 10,  height: 10,  },
    shadowColor: 'black',
    shadowOpacity: 1,
    elevation:3,
  },
});

//------------------------------------------------------------------------
const ProcuraNavigator = createStackNavigator(
  {
      Procura:{screen:Procura}
  },
  {
    defaultNavigationOptions:({navigation}) => ({
      headerTintColor: '#fff',
      headerStyle: styles.header,
      headerTitle:"IFCarona",
      headerTitleStyle:{fontWeight:'bold'},
      headerLeft:<Icon.Button  name="menu" size={30} backgroundColor="#4cb993ff" onPress={navigation.openDrawer}/>,
    }),
  }
);

const OfertaNavigator = createStackNavigator(
  {
    Oferta:{screen:Oferta},
  },
  {
    defaultNavigationOptions:({navigation}) => ({
      headerTintColor: '#fff',
      headerStyle: styles.header,
      headerTitle:"IFCarona",
      headerTitleStyle:{fontWeight:'bold'},
      headerLeft:<Icon.Button  name="menu" size={30} backgroundColor="#4cb993ff" onPress={navigation.openDrawer}/>,
    }),
  }
);


//------------------------------------------------------------------------
const EditarUsuarioNavigator = createStackNavigator(
  {
  EditarUsuario:{screen:EditarUsuario},
  },
  {
    defaultNavigationOptions:({navigation}) => ({
      headerTintColor: '#fff',
      headerStyle: styles.header,
      headerTitle:"IFCarona",
      headerTitleStyle:{fontWeight:'bold'},
      headerLeft:<Icon.Button  name="menu" size={30} backgroundColor="#4cb993ff" onPress={navigation.openDrawer}/>,
    }),
  }
);

//------------------------------------------------------------------------

const LoginNavigator = createStackNavigator(
  {
    Login:{screen:Login},
  },
  {

  //Opções do cabeçalho do tela Login
  defaultNavigationOptions:({navigation}) => ({
    headerTintColor: '#fff',
    headerStyle: styles.header,
    headerTitle:"IFCarona",
    headerTitleStyle:{fontWeight:'bold'},
    headerLeft:<Icon.Button  name="menu" size={30} backgroundColor="#4cb993ff" onPress={navigation.openDrawer}/>,
  }),
}
)

const RegisterNavigator = createStackNavigator(
  {
  Register:{screen:Register},
  },
  {
  //Opções do cabeçalho do tela Login
  defaultNavigationOptions:({navigation}) => ({
    headerTintColor: '#fff',
    headerStyle: styles.header,
    headerTitle:"IFCarona",
    headerTitleStyle:{fontWeight:'bold'},
    headerLeft:<Icon.Button  name="menu" size={30} backgroundColor="#4cb993ff" onPress={navigation.openDrawer}/>,
  }),
})

const RedefinicaoSenhaNavigator = createStackNavigator(
  {
    RedefinicaoSenha:{screen:RedefinicaoSenha},
  },
  {
    defaultNavigationOptions:({navigation}) => ({
      headerTintColor: '#fff',
      headerStyle: styles.header,
      headerTitle:"IFCarona",
      headerTitleStyle:{fontWeight:'bold'},
      headerLeft:<Icon.Button  name="menu" size={30} backgroundColor="#4cb993ff" onPress={navigation.openDrawer}/>,
    }),
  }
)
//-------------------------------------------------------------------------
const MinhaPostagemNavigator = createStackNavigator(
  {
    MinhaPostagem:{screen:MinhaPostagem},
  },
  {
    defaultNavigationOptions:({navigation}) => ({
      headerTintColor: '#fff',
      headerStyle: styles.header,
      headerTitle:"IFCarona",
      headerTitleStyle:{fontWeight:'bold'},
      headerLeft:<Icon.Button  name="menu" size={30} backgroundColor="#4cb993ff" onPress={navigation.openDrawer}/>,
    }),
  }
)

//--------------------------------------------------------------------------
const InserirFotoNavigator = createStackNavigator(
    {
      InserirFoto:{screen:InserirFoto},
    },
    {
      //Opções do cabeçalho da Home
      defaultNavigationOptions:({navigation}) => ({
        headerTintColor: '#fff',
        headerStyle: styles.header,
        headerTitle:"IFCarona",
        headerTitleStyle:{fontWeight:'bold'},
        headerLeft:<Icon.Button  name="menu" size={30} backgroundColor="#4cb993ff" />,
      }),
    }
);
const EditarFotoNavigator = createStackNavigator(
  {
    EditarFoto:{screen:EditarFoto},
  },
  {
    //Opções do cabeçalho da Home
    defaultNavigationOptions:({navigation}) => ({
      headerTintColor: '#fff',
      headerStyle: styles.header,
      headerTitle:"IFCarona",
      headerTitleStyle:{fontWeight:'bold'},
      headerLeft:<Icon.Button  name="menu" size={30} backgroundColor="#4cb993ff" onPress={navigation.openDrawer}/>,
    }),
  }
);

const TabNavigator = createBottomTabNavigator(
  {
    Procura: {screen:ProcuraNavigator},
    Oferta: {screen:OfertaNavigator},
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Procura') {
          if(tintColor=="#4cb993ff"){
            return  <View style={{height:"100%", width:"100%", padding:hp("0.5%")}}>
                        <Image style={{height:"100%", width:"100%"}} resizeMode={"contain"}  source={require("./assets/ride.png")}/>
                    </View>;  
          }else{
            return <View style={{height:"100%", width:"100%", padding:hp("0.5%")}}>
                      <Image resizeMode={"contain"} style={{height:"100%", width:"100%", }} source={require("./assets/ride_unactive.png")}/>
                    </View>;  
          }
        } else if (routeName === 'Oferta') {
          iconName = `directions-car`;
          return <View style={{height:"100%", width:"100%", padding:hp("0.5%")}}> 
                    <Text style={{width:"100%", height:"100%", textAlignVertical:'center', textAlign:'center'}}>
                      <Icon size={hp("5%")} name={iconName} color={tintColor} />;  
                    </Text> 
                  </View>
        }else{
          return <View></View>;
        }        
      },
      tabBarComponent: props => {
        return <BottomTabBar style={{borderTopColor:'#AAAAAA',
                                        borderRightWidth:1, 
                                        borderRightColor:"#AAAAAA", 
                                        elevation:3, 
                                        padding:wp("1%")}
                                      } 
                                      showLabel={false}
                                      onTabPress={(route) => console.log(route)}            
                                      {...props}/>
      }
    }),
    tabBarOptions: {
      activeTintColor: '#4cb993ff',
      inactiveTintColor: 'gray',
    },
  }
);


const LoggedDrawerNavigator = createDrawerNavigator(
  {
    Home:TabNavigator,
    MinhaPostagem:MinhaPostagemNavigator,
    InserirFoto:InserirFotoNavigator,
    EditarFoto:EditarFotoNavigator,
    EditarUsuario:EditarUsuarioNavigator,
  },
  {
    //Opções do cabeçalho da Home
    initialRouteName: "Home",
    contentComponent: SideMenuLogado,
    defaultNavigationOptions:({navigation}) => ({
      headerTintColor: '#fff',
      headerStyle: styles.header,
      headerTitle:"IFCarona",
      headerLeft:<Icon.Button  name="menu" size={30} backgroundColor="#4cb993ff" onPress={navigation.openDrawer}/>,
    }),
  }
);
//--------------------------------------------------------------------------
var DrawerNavigator = createDrawerNavigator(
  {
    Home:{screen:LoginNavigator},
    Login:{screen: LoginNavigator},
    Register:{screen:RegisterNavigator},
    HomeLogado: {screen:LoggedDrawerNavigator},
    RedefinicaoSenha:{screen:RedefinicaoSenhaNavigator},
    
  },
  {
    //Opções do cabeçalho da Home
    initialRouteName: "Home",
    defaultNavigationOptions:({navigation}) => ({
      headerTintColor: '#fff',
      headerStyle: styles.header,
      headerTitle:"IFCarona",
      headerLeft:<Icon.Button  name="menu" size={30} backgroundColor="#315e43" onPress={navigation.openDrawer}/>,
    }),
    contentComponent: SideMenu,
  }
);


const MainNavigator = createStackNavigator(
  {
    home: { 
      screen: DrawerNavigator,
    },
    logged: {
      screen: LoggedDrawerNavigator,
    }
  },
  { 
    headerMode:"none",
    navigationOptions:{
      headerVisible:false,
    }
  }

);



AppContainer = createAppContainer(MainNavigator);



export default AppContainer;

