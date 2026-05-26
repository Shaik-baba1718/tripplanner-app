// src/navigation/BottomNavigator.js

import React from "react";

import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";

import LinearGradient
from "react-native-linear-gradient";

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

import First from "../screens/FirstScreen";
import TripDetailsScreen from "../screens/TripDetailsScreen";

const Tab =
  createBottomTabNavigator();

/* ---------------- DUMMY SCREEN ---------------- */

function DummyScreen() {

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
}

/* ---------------- CUSTOM TAB BAR ---------------- */

function CustomTabBar({
  state,
  descriptors,
  navigation,
}) {

  return (

    <View style={styles.container}>

      <View style={styles.bottomBar}>

        {state.routes.map((route, index) => {

          const isFocused =
            state.index === index;

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
              activeOpacity={0.8}
              style={styles.tabItem}
              onPress={() =>
                navigation.navigate(route.name)
              }
            >

              {isFocused ? (

                <LinearGradient
                  colors={["#FFFFFF", "#FFFFFF"]}
                  style={styles.activeIcon}
                >

                  <IconComponent
                    size={24}
                    color="#ED8701"
                  />

                </LinearGradient>

              ) : (

                <View style={styles.inactiveIcon}>

                  <IconComponent
                    size={22}
                    color="#939393"
                  />

                </View>

              )}

              <Text
                style={[
                  styles.label,
                  {
                    color: isFocused
                      ? "#ED8701"
                      : "#939393",
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
}

/* ---------------- BOTTOM NAVIGATOR ---------------- */

export default function BottomNavigator() {

  return (

    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => (
        <CustomTabBar {...props} />
      )}
    >

      <Tab.Screen
        name="Home"
        component={First}
      />

      <Tab.Screen
        name="Trips"
        component={TripDetailsScreen}
      />

      <Tab.Screen
        name="Services"
        component={DummyScreen}
      />

      <Tab.Screen
        name="Wallet"
        component={DummyScreen}
      />

      <Tab.Screen
        name="Profile"
        component={DummyScreen}
      />

    </Tab.Navigator>

  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({

  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,

    backgroundColor: "transparent",
  },

  bottomBar: {
    width: "100%",
    height: 85,

    backgroundColor: "#FFFFFF",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",

    elevation: 10,
  },

  tabItem: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",
  },

  activeIcon: {
    width: 55,
    height: 55,

    borderRadius: 18,

    justifyContent: "center",
    alignItems: "center",
  },

  inactiveIcon: {
    width: 55,
    height: 55,

    justifyContent: "center",
    alignItems: "center",
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: -5,
  },

});