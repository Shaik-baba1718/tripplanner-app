import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { ArrowLeft, Search } from 'lucide-react-native';
import { textScale, moderateScale, verticalScale } from '../styles/responsiveSize';
import { FONTS } from '../../global';

const Insurance = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showRechargeScreen, setShowRechargeScreen] = useState(false);
  const [policyNumber, setPolicyNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    setShowRechargeScreen(true);
    setErrorMessage('');
    setPolicyNumber('');
  };

  const handleFetchBill = () => {
    setErrorMessage('');
    
    if (!policyNumber.trim()) {
      setErrorMessage('Please enter Policy Number');
      return;
    }
    
    if (policyNumber.trim().length < 6) {
      setErrorMessage('Invalid Policy Number');
      return;
    }
    
    console.log('Fetching bill for Policy Number:', policyNumber);
  };

  const providers = [
    { id: 1, name: 'LIC India', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/62/Life_Insurance_Corporation_of_India_Logo.svg/150px-Life_Insurance_Corporation_of_India_Logo.svg.png' },
    { id: 2, name: 'HDFC Life', logo: 'https://logo.clearbit.com/hdfclife.com' },
    { id: 3, name: 'ICICI Prudential', logo: 'https://logo.clearbit.com/iciciprulife.com' },
    { id: 4, name: 'SBI Life', logo: 'https://logo.clearbit.com/sbilife.co.in' },
    { id: 5, name: 'Bajaj Allianz', logo: 'https://logo.clearbit.com/bajajallianz.com' },
    { id: 6, name: 'Max Life', logo: 'https://logo.clearbit.com/maxlifeinsurance.com' },
    { id: 7, name: 'Kotak Life', logo: 'https://logo.clearbit.com/kotaklife.com' },
    { id: 8, name: 'Aditya Birla Sun Life', logo: 'https://logo.clearbit.com/adityabirlacapital.com' },
    { id: 9, name: 'Tata AIA Life', logo: 'https://logo.clearbit.com/tataaia.com' },
    { id: 10, name: 'PNB MetLife', logo: 'https://logo.clearbit.com/pnbmetlife.com' },
  ];

  const filteredProviders = searchQuery
    ? providers.filter(provider => provider.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : providers;

  // Recharge Screen Component
  if (showRechargeScreen && selectedProvider) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => {
            setShowRechargeScreen(false);
            setPolicyNumber('');
            setErrorMessage('');
          }}>
            <ArrowLeft color="#fff" size={moderateScale(20)} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedProvider.name}</Text>
        </View>

        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, paddingBottom: verticalScale(20) }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ padding: moderateScale(20) }}>
            <Text style={styles.subtitle}>Policy Number</Text>
            <TextInput
              style={[styles.vehicleInput, errorMessage ? styles.inputError : null]}
              placeholder="Enter Policy Number"
              placeholderTextColor="#999"
              keyboardType="default"
              value={policyNumber}
              onChangeText={(text) => {
                setPolicyNumber(text);
                setErrorMessage('');
              }}
              returnKeyType="done"
              onSubmitEditing={handleFetchBill}
              autoCapitalize="characters"
            />
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
          </View>
          
          <TouchableOpacity 
            style={styles.fetchBillButton}
            onPress={handleFetchBill}
          >
            <Text style={styles.fetchBillButtonText}>Fetch Bill</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // Main Screen
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color="#fff" size={moderateScale(20)} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Insurance</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <Search color="#999" size={moderateScale(20)} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Provider Name"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <Text style={styles.sectionTitle}>All Providers</Text>

        <View style={styles.billersContainer}>
          {filteredProviders.map((provider) => (
            <TouchableOpacity 
              key={provider.id} 
              style={styles.billerItem}    
              onPress={() => handleProviderSelect(provider)}
            >
              <Image 
                source={{ uri: provider.logo }} 
                style={styles.billerLogo}
                defaultSource={require('../assets/images/ed1.png')}
              />
              <Text style={styles.billerName}>{provider.name}</Text>
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
    gap: moderateScale(5),
    paddingHorizontal: moderateScale(15),
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(10),
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
    borderRadius: moderateScale(12),
    gap: moderateScale(10),
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
    borderRadius: moderateScale(20),
    backgroundColor: '#F5F5F5',
    marginRight: moderateScale(12),
  },
  billerName: {
    fontSize: textScale(14),
    fontFamily: FONTS.MetropolicRegular,
    color: '#333',
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
    borderRadius: moderateScale(12),
    padding: moderateScale(12),
    fontSize: textScale(14),
    fontFamily: FONTS.MetropolicRegular,
    color: '#333',
    backgroundColor: '#FFF',
  },
  inputError: {
    borderColor: '#FF4444',
    borderWidth: 1,
  },
  errorText: {
    fontSize: textScale(12),
    fontFamily: FONTS.MetropolicRegular,
    color: '#FF4444',
    marginTop: verticalScale(5),
    marginBottom: verticalScale(10),
  },
  fetchBillButton: {
    backgroundColor: '#ED8701',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
   top:250,
    marginHorizontal: 10,
  },
  fetchBillButtonText: {
    fontSize: textScale(16),
    fontFamily: FONTS.Interbold,
    color: '#FFF',
  },
});

export default Insurance;