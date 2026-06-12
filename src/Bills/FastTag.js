import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  Modal,
} from 'react-native';
import { ArrowLeft, Search } from 'lucide-react-native';
import { textScale, moderateScale, verticalScale } from '../styles/responsiveSize';
import { FONTS } from '../../global';

const FastTag = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBank, setSelectedBank] = useState(null);
  const [showRechargeScreen, setShowRechargeScreen] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  // Function to handle bank selection
  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    setShowRechargeScreen(true);
  };

  // Function to handle fetch bill - MOVED BEFORE THE RETURN
  const handleFetchBill = () => {
    setErrorMessage('');
    
    if (!vehicleNumber.trim()) {
      setPopupMessage('Please enter vehicle number');
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
      return;
    }
    
    const vehicleRegex = /^[A-Z]{2}[ -]?[0-9]{1,2}[ -]?[A-Z]{1,2}[ -]?[0-9]{4}$/i;
    if (!vehicleRegex.test(vehicleNumber.trim().toUpperCase())) 
   {
         console.log("Invalid format");
      setPopupMessage('Invalid VRN (Vehicle Registration Number)');
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
      return;
    }
    
    console.log('Fetching bill for vehicle:', vehicleNumber);
  };

  const billers = [
    { id: 1, name: 'Airtel Payments Bank NETC FASTag', logo: 'https://logo.clearbit.com/airtel.in' },
    { id: 2, name: 'Axis Bank Fastag', logo: 'https://logo.clearbit.com/axisbank.com' },
    { id: 3, name: 'Bank of Baroda FASTag', logo: 'https://logo.clearbit.com/bankofbaroda.in' },
    { id: 4, name: 'Bank of Maharashtra FASTag', logo: 'https://logo.clearbit.com/bankofmaharashtra.in' },
    { id: 5, name: 'Equitas FASTag Recharge', logo: 'https://logo.clearbit.com/equitasbank.com' },
    { id: 6, name: 'HDFC Bank FASTag', logo: 'https://logo.clearbit.com/hdfcbank.com' },
    { id: 7, name: 'IDBI Bank FASTag', logo: 'https://logo.clearbit.com/idbi.com' },
    { id: 8, name: 'IDFC FIRST Bank FASTag', logo: 'https://logo.clearbit.com/idfcfirstbank.com' },
    { id: 9, name: 'Indian Bank Fastag Recharge', logo: 'https://logo.clearbit.com/indianbank.in' },
  ];

  const filteredBillers = searchQuery
    ? billers.filter(biller => biller.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : billers;

  // Recharge Screen Component
  if (showRechargeScreen && selectedBank) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => {
            setShowRechargeScreen(false);
            setVehicleNumber('');
            setErrorMessage('');
          }}>
            <ArrowLeft color="#fff" size={20} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedBank.name}</Text>
        </View>

        <View style={styles.rechargeContent}>
          <Text style={styles.subtitle}>Vehicle Number</Text>
          <TextInput
            style={styles.vehicleInput}
            placeholder="Enter Vehicle Number"
            placeholderTextColor="#999"
            keyboardType="default"
            autoCapitalize="characters"
            value={vehicleNumber}
            onChangeText={(text) => {
              setVehicleNumber(text);
            
            }}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.fetchBillButton}
          onPress={handleFetchBill}
        >
          <Text style={styles.fetchBillButtonText}>Fetch Bill</Text>
        </TouchableOpacity>

        {/* Error Popup Modal */}
        <Modal
          transparent={true}
          visible={showErrorModal}
          animationType="fade"
          onRequestClose={() => setShowErrorModal(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowErrorModal(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.errorIconContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
              </View>
            
              <Text style={styles.modalMessage}>{popupMessage}</Text>
            
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }

  // Main Screen
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color="#fff" size={20} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fastag Recharge</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <Search color="#999" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Biller Name"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <Text style={styles.sectionTitle}>All Billers</Text>

        <View style={styles.billersContainer}>
          {filteredBillers.map((biller) => (
            <TouchableOpacity 
              key={biller.id} 
              style={styles.billerItem}    
              onPress={() => handleBankSelect(biller)}
            >
              <Image 
                source={{ uri: biller.logo }} 
                style={styles.billerLogo}
                defaultSource={require('../assets/images/ed1.png')}
              />
              <Text style={styles.billerName}>{biller.name}</Text>
            </TouchableOpacity>
          ))}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 15,
    paddingTop: 30,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    backgroundColor: "orange",
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: textScale(14),
    fontFamily: FONTS.Interbold,
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginHorizontal: moderateScale(16),
    marginVertical: verticalScale(15),
    paddingHorizontal: moderateScale(15),
    paddingVertical: verticalScale(12),
    borderRadius: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: textScale(14),
    fontFamily: FONTS.MetropolicRegular,
    color: '#333',
    padding: 0,
  },
  sectionTitle: {
    fontSize: textScale(14),
    fontFamily: FONTS.InterMedium,
    color: '#333',
    marginHorizontal: moderateScale(16),
    marginBottom: verticalScale(10),
  },
  billersContainer: {
    paddingHorizontal: moderateScale(16),
  },
  billerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(14),
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  },
  billerLogo: {
    width: moderateScale(40),
    height: verticalScale(40),
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: moderateScale(12),
  },
  billerName: {
    fontSize: textScale(14),
    fontFamily: FONTS.MetropolicRegular,
    color: '#333',
    flex: 1,
  },
  rechargeContent: {
    padding: moderateScale(16),
    flex: 1,
  },
  subtitle: {
    fontSize: textScale(14),
    fontFamily: FONTS.MetropolicMedium,
    color: '#333',
    marginBottom: verticalScale(8),
  },
  vehicleInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    fontSize: textScale(14),
    fontFamily: FONTS.MetropolicRegular,
    color: '#333',
    backgroundColor: '#FFF',
    marginBottom: 20,
  },
  fetchBillButton: {
    backgroundColor: '#ED8701',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginRight: 10,
    marginLeft: 10,
  },
  fetchBillButtonText: {
    fontSize: textScale(16),
    fontFamily: FONTS.Interbold,
    color: '#FFF',
  },
  errorText: {
    fontSize: textScale(12),
    fontFamily: FONTS.MetropolicRegular,
    color: '#FF4444',
    textAlign: 'center',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(5),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: moderateScale(24),
    width: '80%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  errorIconContainer: {
    width: moderateScale(60),
    height: verticalScale(60),
    borderRadius: 30,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(15),
  },
  errorIcon: {
    fontSize: textScale(30),
  },
  modalTitle: {
    fontSize: textScale(18),
    fontFamily: FONTS.Interbold,
    color: '#333',
    marginBottom: 5,
  },
  modalMessage: {
    fontSize: textScale(12),
    fontFamily: FONTS.MetropolicRegular,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  modalButton: {
    backgroundColor: '#ED8701',
    paddingHorizontal: moderateScale(30),
    paddingVertical: verticalScale(10),
    borderRadius: 25,
  },
  modalButtonText: {
    fontSize: textScale(14),
    fontFamily: FONTS.Interbold,
    color: '#FFF',
  },
});

export default FastTag;