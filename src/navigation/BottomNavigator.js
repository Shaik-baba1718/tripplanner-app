// src/navigation/BottomNavigator.js

import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {
  House,
  Map,
  Briefcase,
  Wallet,
  User,
} from "lucide-react-native";
import {
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import DashBoard from "../screens/DashBoardScreen";
import First from "../screens/FirstScreen";
import Services from "../screens/Services"
import WalletScreen from "../screens/WalletScreen";
import ProfileScreen from "../screens/Profile"
import { moderateScale,textScale,verticalScale } from "../styles/responsiveSize";
import { FONTS } from "../../global";


const Tab = createBottomTabNavigator();

/* ---------------- DUMMY SCREEN ---------------- */

const DummyScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFF",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Coming Soon</Text>
    </View>
  );
};

/* ---------------- CUSTOM TAB BAR ---------------- */

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.bottomBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          let IconComponent;

          switch (route.name) {
            case "Home":
              IconComponent = House;
              break;
            case "Trips":
              IconComponent = Map;
              break;
            case "Services":
              IconComponent = Briefcase;
              break;
            case "Wallet":
              IconComponent = Wallet;
              break;
            case "Profile":
              IconComponent = User;
              break;
            default:
              IconComponent = House;
          }

          return (
            <TouchableOpacity
              key={index}
              
             style={{justifyContent:"space-between",flex:1,alignItems:"center"}}
              onPress={() => navigation.navigate(route.name)}
            >
              {isFocused ? (
                <LinearGradient
                   colors={['rgba(255,215,0,0.2)', 'transparent']}  // Gold/yellow sunlight from top
    style={styles.tabItem}
     start={{ x: 0.5, y: 0 }}    // Start at top
    end={{ x: 0.5, y: 0.6 }}  
    
                  
                >
                  <IconComponent size={20} color="#ED8701"   style={{
                              
                                  }} />
                </LinearGradient>
              ) : (
                <View style={styles.inactiveIcon}>
                  <IconComponent size={20} color="#939393" />
                </View>
              )}
              <Text
                style={[
                  styles.label,
                  {
                    color: isFocused ? "#ED8701" : "#939393",
                  },
                ]}
              >
                {route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

/* ---------------- BOTTOM NAVIGATOR ---------------- */

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={DashBoard} />
      <Tab.Screen name="Trips" component={First} />
      <Tab.Screen name="Services" component={Services} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  
  bottomBar: {
    width: "100%",
    height: verticalScale(70),
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    
    elevation: 10,
  },
  tabItem: {
  flex: 1,
  width:"100%",
  justifyContent: "center",
  alignItems: "center",
   backgroundColor: '#fff',
  borderTopWidth: 1,
  borderTopColor: "#ED8701",
   
   
  
                 // For Android
},
 
  inactiveIcon: {
    width: moderateScale(55),
    height:verticalScale(55),
   
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: textScale(12),
    fontFamily:FONTS.Interbold,
   
    marginTop: -12,
  },
});

export default BottomNavigator;