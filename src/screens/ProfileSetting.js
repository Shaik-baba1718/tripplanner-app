// src/screens/ProfileSettings.js

import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
  PermissionsAndroid,
  Modal,
} from 'react-native';
import { ArrowLeft, Pencil, Camera, Image as ImageIcon, X, ChevronDown, Calendar } from 'lucide-react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import DatePicker from 'react-native-date-picker';
import { moderateScale, verticalScale, textScale } from '../styles/responsiveSize';
import { FONTS } from '../../global';
import images from "../assets/index";
import AsyncStorage from
'@react-native-async-storage/async-storage';
const ProfileSettings = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  
  // Date picker states
  const [selectedDate, setSelectedDate] = useState(new Date(2000, 0, 1));
  const [stateName, setStateName] =
  useState('');

  const [showStates, setShowStates] =
  useState(false);

  const stateOptions = [
  "Telangana",
  "Andhra Pradesh",
  "Karnataka",
  "Tamil Nadu",
  "Kerala",
  "Maharashtra",
                    ];

  // Format date for display
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Handle date selection
  const handleDateConfirm = () => {
    const formattedDate = formatDate(selectedDate);
    setDob(formattedDate);
    setDatePickerVisible(false);
  };

  // Request permission for Android
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera access to take photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // Pick image from gallery
  const pickFromGallery = () => {
    setModalVisible(false);
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled gallery picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        Alert.alert('Error', 'Something went wrong!');
      } else if (response.assets && response.assets[0]) {
        setProfileImage(response.assets[0].uri);
      }
    });
  };

  // Capture image from camera
  const pickFromCamera = async () => {
    setModalVisible(false);
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera permission is required to take photos');
      return;
    }

    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
      quality: 1,
      saveToPhotos: true,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('Camera Error: ', response.error);
        Alert.alert('Error', 'Something went wrong!');
      } else if (response.assets && response.assets[0]) {
        setProfileImage(response.assets[0].uri);
      }
    });
  };

  // Gender options
  const genderOptions = ['Male', 'Female', 'Other'];
  const saveProfileData = async () => {

  try {

    const profileData = {

      email,
      gender,
      stateName,
      name,
     
      dob,

    };

    await AsyncStorage.setItem(
      "profileData",
      JSON.stringify(profileData)
    );

  } catch (error) {

    console.log(error);

  }

};
const loadProfileData = async () => {

  try {

    const storedData =
      await AsyncStorage.getItem(
        "profileData"
      );

    if (storedData) {

      const parsedData =
        JSON.parse(storedData);
       setName(parsedData.name || "");
      setEmail(parsedData.email || "");

      setGender(parsedData.gender || "");

      setStateName(
        parsedData.stateName || ""
      );

   
      setDate(parsedData.dob || "");

    }

  } catch (error) {

    console.log(error);

  }

};
useEffect(() => {

  saveProfileData();

}, [name,email,gender,stateName,dob]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile Settings</Text>
        </View>
      </View>
  
      <ScrollView style={styles.content}>
        <View style={styles.air}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Image source={images.taj} style={styles.profileImage} />
          )}
          <TouchableOpacity 
            style={styles.changeButton}
            onPress={() => setModalVisible(true)}
          >
            <Pencil size={16} color={"orange"} />
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <TouchableOpacity 
              style={styles.dropdown}
              onPress={() => setGenderModalVisible(true)}
            >
              <Text style={[styles.dropdownText, !gender && styles.placeholderText]}>
                {gender || "Select Gender"}
              </Text>
              <ChevronDown size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity 
              style={styles.dropdown}
              onPress={() => setDatePickerVisible(true)}
            >
              <Text style={[styles.dropdownText, !dob && styles.placeholderText]}>
                {dob || "DD/MM/YYYY"}
              </Text>
              <Calendar size={20} color="#666" />
            </TouchableOpacity>
          </View>
            <View style={styles.inputGroup}>

  <Text style={styles.label}>
    State
  </Text>

  <TouchableOpacity
    style={styles.dropdown}
    onPress={() =>
      setShowStates(!showStates)
    }
  >

    <Text
      style={[
        styles.dropdownText,
        !stateName &&
          styles.placeholderText
      ]}
    >
      {stateName}
    </Text>

    <ChevronDown
      size={20}
      color="#666"
    />

  </TouchableOpacity>

  {showStates && (

    <View
      style={{
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 12,
        marginTop: 5,
        overflow:"scroll",
      }}
    >

     <ScrollView
  nestedScrollEnabled={true}
  showsVerticalScrollIndicator={false}
>

  {stateOptions.map((item, index) => (

    <TouchableOpacity
      key={index}
      onPress={() => {

        setStateName(item);

        setShowStates(false);

      }}
      style={{
        padding: 15,
        borderBottomWidth:
          index !== stateOptions.length - 1
            ? 1
            : 0,
        borderBottomColor: "#F0F0F0",
      }}
     >

      <Text
        style={{
          fontSize: 14,
          color: "#333",
        }}
      >
        {item}
      </Text>

           </TouchableOpacity>

           ))}

           </ScrollView>

    </View>

  )}

<TouchableOpacity
  onPress={async () => {

    await saveProfileData();

    navigation.goBack();

  }}

   style={styles.savebtn}
>
 <Text style={styles.savebtnText}>
  Save
</Text>
</TouchableOpacity>
</View>
        </View>    
      </ScrollView>

      {/* Modal for Image Options */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
               <TouchableOpacity onPress={() => setModalVisible(false)}>
                <ArrowLeft size={18} color="#333" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Choose Option</Text>
             
            </View>

            <TouchableOpacity 
              style={styles.modalOption}
              onPress={pickFromCamera}
            >
              <Camera size={20} color="#ED8701" />
              <Text style={styles.modalOptionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalOption}
              onPress={pickFromGallery}
            >
              <ImageIcon size={20} color="#ED8701" />
              <Text style={styles.modalOptionText}>From Gallery</Text>
            </TouchableOpacity>


           
          </View>
        </View>
      </Modal>

      {/* Modal for Gender Selection */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={genderModalVisible}
        onRequestClose={() => setGenderModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Gender</Text>
              <TouchableOpacity onPress={() => setGenderModalVisible(false)}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {genderOptions.map((option, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.modalOption}
                onPress={() => {
                  setGender(option);
                  setGenderModalVisible(false);
                }}
              >
                <Text style={styles.modalOptionText}>{option}</Text>
                {gender === option && (
                  <View style={styles.selectedDot} />
                )}
              </TouchableOpacity>
            ))}

           
          </View>
        </View>
      </Modal>

      {/* Wheel Date Picker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={datePickerVisible}
        onRequestClose={() => setDatePickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.datePickerModalContainer}>
            <Text style={styles.pickerTitle}>Select Date of Birth</Text>
            
            <DatePicker
              date={selectedDate}
              onDateChange={setSelectedDate}
              mode="date"
              theme="auto"
              textColor="#ED8701"
              fadeToColor="none"
              style={styles.wheelPicker}
              maximumDate={new Date()}
              minimumDate={new Date(1950, 0, 1)}
              locale="en"
            />
            
            <View style={styles.pickerButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setDatePickerVisible(false)}>
                <Text style={styles.cancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleDateConfirm}>
                <Text style={styles.confirmText}>CONFIRM</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 10,
  
    backgroundColor: '#fff',
  },
  headerContent: {
    flexDirection: 'row',
    gap: 40,
    alignItems: 'center',
    borderBottomWidth: 3,
    padding: 10,
    borderBottomColor: "#e9dede",
  },
  backButton: { 
    padding: 5 
  },
  headerTitle: {
    fontSize: 16,
    color: 'black',
    fontFamily: FONTS.MetropolicBold,
  },
  content: { 
    padding: 20 
  },
  air: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: 100,
  },
  changeButton: {
    flexDirection: "row",
    gap: 2,
    padding: 5,
    alignItems: "center",
    width: moderateScale(100),
    height: verticalScale(40),
    borderColor: "orange",
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
  },
  changeButtonText: {
    fontSize: textScale(14),
    fontFamily: FONTS.InterRegular,
    color: "orange",
  },
  formContainer: {
    top: 30,
  },
  inputGroup: { 
    marginBottom: 20 
  },
  label: {
    fontSize: textScale(14),
    color: '#333',
    fontFamily: FONTS.MetropolicMedium,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    fontSize: textScale(14),
    fontFamily: FONTS.MetropolicRegular,
    backgroundColor: '#FFFFFF',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  dropdownText: {
    fontSize: textScale(14),
    fontFamily: FONTS.MetropolicRegular,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
     
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
     width: moderateScale(350),
     
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: textScale(16),
    
    color: '#333',
    fontFamily: FONTS.MetropolicSemibold,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalOptionText: {
    fontSize: textScale(12),
    color: '#333',
    fontFamily: FONTS.MetropolicMedium,
  },
  selectedDot: {
    width: moderateScale(10),
    height: verticalScale(10),
    borderRadius: 5,
    backgroundColor: '#ED8701',
  },
  modalCancelButton: {
    marginTop: 10,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },
  modalCancelText: {
    fontSize: textScale(14),
    color: '#666',
    fontFamily: FONTS.MetropolicMedium,
  },
  datePickerModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    width: moderateScale('90%'),
    alignItems: 'center',
  },
  pickerTitle: {
    fontSize: textScale(20),
   
    color: '#333',
    fontFamily: FONTS.MetropolicBold,
    textAlign: 'center',
    marginBottom: 20,
  },
  wheelPicker: {
     width: moderateScale(300),
    height: verticalScale(200),
  },
  pickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
   
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ED8701',
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 10,
    borderRadius: 10,
    backgroundColor: '#ED8701',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: textScale(14),
    color: '#ED8701',
    fontFamily: FONTS.MetropolicMedium,
  },
  confirmText: {
    fontSize: textScale(14),
    color: '#FFFFFF',
  
    fontFamily: FONTS.MetropolicBold,
  },
  savebtn: {

  backgroundColor: "#ED8701",

  height: 50,

  borderRadius: 12,

  justifyContent: "center",

  alignItems: "center",

  marginTop: 20,

  marginBottom: 40,

},
savebtnText: {

  color: "#fff",

  fontSize: textScale(14),

fontFamily:FONTS.MontMedium,

},
});

export default ProfileSettings;