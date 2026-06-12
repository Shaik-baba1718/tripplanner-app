import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { ArrowLeft, Search } from 'lucide-react-native';
import { textScale, moderateScale, verticalScale } from '../styles/responsiveSize';
import { FONTS } from '../../global';

const DTH = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showRechargeScreen, setShowRechargeScreen] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    setShowRechargeScreen(true);
    setErrorMessage('');
    setCustomerId('');
  };

  const handleFetchBill = () => {
    Keyboard.dismiss();
    setErrorMessage('');
    
    if (!customerId.trim()) {
      setErrorMessage('Please enter Customer ID');
      return;
    }
    
    if (customerId.trim().length < 8) {
      setErrorMessage('Invalid Customer ID');
      return;
    }
    
    console.log('Fetching bill for Customer ID:', customerId);
  };

   const providers = [
    { id: 1, name: 'Tata Sky DTH', logo: 'https://logo.clearbit.com/tatasky.com' },
    { id: 2, name: 'Airtel Digital TV', logo: 'https://logo.clearbit.com/airtel.in' },
    { id: 3, name: 'Dish TV', logo: 'https://logo.clearbit.com/dishtv.in' },
    { id: 4, name: 'Sun Direct DTH', logo: 'https://logo.clearbit.com/sundirect.in' },
    { id: 5, name: 'Videocon d2h', logo: 'https://logo.clearbit.com/videocond2h.com' },
    { id: 6, name: 'Jio Fiber TV', logo: 'https://logo.clearbit.com/jio.com' },
    { id: 7, name: 'BIG TV', logo: 'https://logo.clearbit.com/bigtv.co.in' },
  ];
  const filteredProviders = searchQuery
    ? providers.filter(provider => provider.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : providers;

  // Recharge Screen Component
  if (showRechargeScreen && selectedProvider) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => {
            setShowRechargeScreen(false);
            setCustomerId('');
            setErrorMessage('');
          }}>
            <ArrowLeft color="#fff" size={20} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedProvider.name}</Text>
        </View>

        <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'space-between' }}>
          <View style={{ padding: 20, backgroundColor: '#fff' }}>
            <Text style={styles.subtitle}>Customer ID</Text>
            <TextInput
              style={[styles.vehicleInput, errorMessage ? styles.inputError : null]}
              placeholder="Enter Customer ID"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={customerId}
              onChangeText={(text) => {
                setCustomerId(text);
                setErrorMessage('');
              }}
              returnKeyType="done"
              onSubmitEditing={handleFetchBill}
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
        </View>
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
        <Text style={styles.headerTitle}>DTH Recharge</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <Search color="#999" size={20} />
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
                source={provider.logo} 
                style={styles.billerLogo}
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
    marginBottom: 30,
    marginRight: 10,
    marginLeft: 10,
  },
  fetchBillButtonText: {
    fontSize: textScale(16),
    fontFamily: FONTS.Interbold,
    color: '#FFF',
  },
});

export default DTH;