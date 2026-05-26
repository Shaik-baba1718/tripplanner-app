// src/navigation/ScreenNavigator.js

import React from "react";

import { createNativeStackNavigator }
from "@react-navigation/native-stack";



import BottomNavigator from "./BottomNavigator";
import TripDetailsScreen from "../screens/TripDetailsScreen"
import TripScreen from "../screens/TripScreenNext"
import TripDetailView from "../screens/TripDetailView"
const Stack =
  createNativeStackNavigator();

export default function AppNavigator() {
  return (
       
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        
           <Stack.Screen
            name="Main"
            component={BottomNavigator}
           />

       
         <Stack.Screen
             name="TripDetailsScreen"
                   component={TripDetailsScreen}
                   />
          <Stack.Screen
             name="TripScreen"
                   component={TripScreen}
                   />
                   <Stack.Screen
             name="TripDetailView"
                   component={TripDetailView}
                   />
      
      </Stack.Navigator>
  
  );
}