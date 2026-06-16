// src/screens/ProfileScreen.js
import React,
{
  useState,
  useEffect
}
from "react";

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Bell, Shield, HelpCircle, LogOut, ChevronRight, User, Ticket, LifeBuoy, Trash2,Lock } from 'lucide-react-native';
import { moderateScale, textScale, verticalScale } from '../styles/responsiveSize';
import { FONTS } from '../../global';
import images from "../assets/index";
import AsyncStorage from
'@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) =>
   {
    const [profileData, setProfileData] =
    useState(null); 
  const MenuItem = ({ icon, title, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        {icon}
        <Text style={styles.menuTitle}>{title}</Text>
      </View>
   <ChevronRight></ChevronRight>
    </TouchableOpacity>
  );
  const loadProfileData = async () => {

  try {

    const storedData =
      await AsyncStorage.getItem(
        "profileData"
      );

    if (storedData) {

      const parsedData =
        JSON.parse(storedData);

      setProfileData(parsedData);

    }

  } catch (error) {

    console.log(error);

  }

};
useEffect(() => {

  loadProfileData();

}, []);
const removeAccount = () => {
  handleDeleteAccount();
};
const handleDeleteAccount = async () => {
  try {
    await AsyncStorage.clear();
    setProfileData(null);
   
  } catch (error) {
    console.log('Error removing account:', error);
  }
};

  return (
    <View style={styles.container}>
      {/* Header with Gradient Background */}
      <LinearGradient
        colors={['#ED8701', '#FF6B00']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar & User Info */}
     <View style={styles.avatarContainer}>
  <Image
    style={styles.avatarImage}
    source={images.taj}
  />

  <View style={{ flex: 1 }}>
    <View style={styles.avatarrow}>
      <Text style={styles.userNameText}>
        {profileData?.name || "No Name"}
      </Text>

      <View style={styles.avatarrow1}>
        <Image source={images.coins} />

        <Text
          style={{
            fontSize: textScale(10),
            marginLeft: 4,
          }}
        >
          Unverified
        </Text>
      </View>
    </View>

    <Text style={styles.userEmailText}>
      {profileData?.email || "No Email"}
    </Text>
  </View>
</View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <MenuItem
            icon={<User size={20} color="#ED8701" />}
            title="Profile Settings"
            onPress={() => navigation.navigate("ProfileSettings")}
          />
          <MenuItem
            icon={<Ticket size={20} color="#ED8701" />}
            title="My Passes"
            onPress={() => navigation.navigate("Mypass")}
          />
          <MenuItem
            icon={<Lock size={20} color="#ED8701" />}
            title="App Lock"
            onPress={() => {}}
          />
          <MenuItem
            icon={<Shield size={20} color="#ED8701" />}
            title="Safety"
            onPress={() => navigation.navigate("SafetyScreen")}
          />
           <MenuItem
            icon={<LifeBuoy size={20} color="#ED8701" />}
            title="Help Centre"
            onPress={() => navigation.navigate("HelpCenter")}
          />
          <MenuItem
            icon={<Trash2 size={20} color="#ED8701" />}
            title="Remove My Account"
            onPress={removeAccount}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: FONTS.MetropolicBold,
  },
  avatarContainer: {

  flexDirection: "row",
  alignItems: "center",
  padding: 10,
  borderBottomWidth: 1,
  borderBottomColor: "#dbd8d8",
},
avatarImage:
{
   width:moderateScale(50),
   height:verticalScale(50),
   borderRadius:100,
   marginRight:10,
},
avatarrow: {
  flexDirection: "row",
  alignItems: "center",
},
userNameText:
{
    fontSize:textScale(12),
    fontFamily:FONTS.MetropolicBold,
    color:"#000"
},
userEmailText:
{
    fontSize:textScale(12),
    fontFamily:FONTS.MetropolicMedium,
    color:"#000"
},

avatarrow1: {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 8,
  paddingVertical: 4,
  marginLeft: 8,
  backgroundColor: "#FFE0B2",
  borderRadius: 10,
},
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 15,
    padding: 15,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuTitle: {
    fontSize: 14,
    color: '#333',
    fontFamily: FONTS.MetropolicMedium,
  },
  menuArrow: {
    fontSize: 20,
    color: '#CCC',
  },
});

export default ProfileScreen;