// src/navigation/ScreenNavigator.js

import React from "react";

import { createNativeStackNavigator }
from "@react-navigation/native-stack";

import BottomNavigator from "./BottomNavigator";
import TripDetailsScreen from "../screens/TripDetailsScreen"
import TripScreen from "../screens/TripScreenNext"
import TripDetailView from "../screens/TripDetailView"
import ProfileSettings from "../screens/ProfileSetting"
import Mypasses from  "../screens/Mypass"
import TezPassPayment from "../screens/TezPassPayment"
import MapScreen from "../screens/MapScreen"
import SafetyScreen from "../screens/SafetyScreen"
import HelpCenter from "../screens/HelpCenter"
import ReportNow from "../reports/ReportNow"

import PayBills from "../screens/PayBills"
import FastTag from "../Bills/FastTag"
import DTH from "../Bills/DTH"
import Insurance from "../Bills/Insurance"
import DashBoard from "../screens/DashBoardScreen";
const Stack =
  createNativeStackNavigator();

const AppNavigator=()=> {
  return (
       
      <Stack.Navigator
        initialRouteName="Main"
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
                     <Stack.Screen
             name="ProfileSettings"
                   component={ProfileSettings}
                   />
                          <Stack.Screen
             name="Mypass"
                   component={Mypasses}
                   />
                        <Stack.Screen
             name="TezPassPayment"
                   component={TezPassPayment}
                   />
                          <Stack.Screen
             name="MapScreen"
                   component={MapScreen}
                   />
                           <Stack.Screen
             name="SafetyScreen"
                   component={SafetyScreen}
                   />
                             <Stack.Screen
             name="HelpCenter"
                   component={HelpCenter}
                   />
                              <Stack.Screen
             name="ReportNow"
                   component={ReportNow}
                   />
                                <Stack.Screen
          
             name="PayBills"
                   component={PayBills}
                   />    
                          <Stack.Screen
          
             name="FastTag"
                   component={FastTag}
                   />    
                    <Stack.Screen
          
             name="DTH"
                   component={DTH}
                   />
                    <Stack.Screen
          
             name="Insurance"
                   component={Insurance}
                   />
                    
      
      
      </Stack.Navigator>
  
  );
};
export default AppNavigator;