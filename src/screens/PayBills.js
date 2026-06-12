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
} from 'react-native';
import { ArrowLeft, Search, ChevronRight, Wallet, Bell, Zap, Droplet, Building, Wrench, Flame, Home, Receipt, Smartphone,Phone,Wifi,Tag,CreditCard,Landmark,Shield,Repeat ,GraduationCap,Heart,PiggyBank,Briefcase,Tv,Satellite,Monitor} from 'lucide-react-native';
import { textScale, moderateScale, verticalScale } from '../styles/responsiveSize';
import { FONTS } from '../../global';

const PayBills = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const popularBills = [
    { id: 1, name: 'Fastag', icon: '🚗' },
    { id: 2, name: 'DTH', icon: '📺' },
    { id: 3, name: 'Insurances', icon: '🛡️' },
  ];

  const housingUtilities = [
    { id: 1, name: 'Electricity', icon: <Zap color="#ED8701" size={24} /> },
    { id: 2, name: 'LPG', icon: <Flame color="#ED8701" size={24} /> },
    { id: 3, name: 'Water', icon: <Droplet color="#ED8701" size={24} /> },
    { id: 4, name: 'Municipal Taxes', icon: <Building color="#ED8701" size={24} /> },
    { id: 5, name: 'Municipal Services', icon: <Wrench color="#ED8701" size={24} /> },
    { id: 6, name: 'Housing Society', icon: <Home color="#ED8701" size={24} /> },
    { id: 7, name: 'Piped Gas', icon: <Flame color="#ED8701" size={24} /> },
    { id: 8, name: 'Rentals', icon: <Receipt color="#ED8701" size={24} /> },
    { id: 9, name: 'Prepaid',name1:' Meter', icon: <Smartphone color="#ED8701" size={24} /> },
  ];
  
  const communicationBills = [
    { 
      id: 1, 
      name: 'Landline', 
      icon: <Phone color="#ED8701" size={24} /> 
    },
    { 
      id: 2, 
      name: 'Postpaid', 
      icon: <Smartphone color="#ED8701" size={24} /> 
    },
    { 
      id: 3, 
      name: 'Wifi', 
      icon: <Wifi color="#ED8701" size={24} /> 
    },
  ];
  
  const TravelBills = [
    { 
      id: 1, 
      name: 'Fastag', 
      icon: <Tag color="#ED8701" size={24} /> 
    },
    { 
      id: 2, 
      name: 'NCMC Recharge', 
      icon: <CreditCard color="#ED8701" size={24} /> 
    },
  ];
  
  const FinancialServices = [
    { 
      id: 1, 
      name: 'Loan Repayment', 
      icon: <Landmark color="#ED8701" size={24} /> 
    },
    { 
      id: 2, 
      name: 'Credit Card', 
      icon: <CreditCard color="#ED8701" size={24} /> 
    },
    { 
      id: 3, 
      name: 'LIC/Insurance', 
      icon: <Shield color="#ED8701" size={24} /> 
    },
    { 
      id: 4, 
      name: 'Recurring Deposit', 
      icon: <Repeat color="#ED8701" size={24} /> 
    },
    { 
      id: 5, 
      name: 'Education ', 
      name1:'fees',
      icon: <GraduationCap color="#ED8701" size={24} /> 
    },
    { 
      id: 6, 
      name: 'Donate', 
      icon: <Heart color="#ED8701" size={24} /> 
    },
    { 
      id: 7, 
      name: 'NPS', 
      icon: <PiggyBank color="#ED8701" size={24} /> 
    },
    { 
      id: 8, 
      name: 'B2B', 
      icon: <Briefcase color="#ED8701" size={24} /> 
    },
  ];
  
  const Entertainment = [
    { 
      id: 1, 
      name: 'Broadband', 
      icon: <Wifi color="#ED8701" size={24} /> 
    },
    { 
      id: 2, 
      name: 'Cable TV', 
      icon: <Tv color="#ED8701" size={24} /> 
    },
    { 
      id: 3, 
      name: 'DTH', 
      icon: <Satellite color="#ED8701" size={24} /> 
    },
    { 
      id: 4, 
      name: 'Subscription', 
      icon: <Monitor color="#ED8701" size={24} /> 
    },
  ];
  
  const filterBills = (billsArray) => {
    if (searchQuery === '') return billsArray;
    return billsArray.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft color="#000" size={20} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>All Bills</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <TouchableOpacity style={styles.walletButton}>
            <Wallet color={"#000"} size={20} />
            <Text>₹0.0</Text>
          </TouchableOpacity>
          <View style={styles.bellIcon}>
            <Bell color={"#000"} size={20} />
          </View>
        </View>
      </View>

      {/* Saved Bills Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Saved Bills & History</Text>
          <TouchableOpacity onPress={() => navigation.navigate("")}>
            <Text style={styles.viewAllText}>View All &gt;</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search color="#999" size={20} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Popular Section */}
        {filterBills(popularBills).length > 0 && (
          <View style={styles.housingSection}>
            <Text style={styles.housingTitle}>POPULAR</Text>
            <View style={styles.popularContainer}>
              {filterBills(popularBills).map((item) => (
                <View key={item.id} style={styles.popularItemWrapper}>
                  <TouchableOpacity
                    style={styles.housingItem}
                    onPress={() => {
                      if (item.name === "Fastag") {
                        navigation.navigate("FastTag");
                      } else if (item.name === "DTH") {
                        navigation.navigate("DTH");
                      } else if (item.name === "Insurances") {
                        navigation.navigate("Insurance");
                      }
                    }}
                  >
                    <Text style={styles.popularIcon}>{item.icon}</Text>
                  </TouchableOpacity>
                  <Text style={styles.popularName}>{item.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Housing & Utilities Section */}
        {filterBills(housingUtilities).length > 0 && (
          <View style={styles.housingSection}>
            <Text style={styles.housingTitle}>HOUSING & UTILITIES</Text>
            <View style={styles.housingContainer}>
              {filterBills(housingUtilities).map((item) => (
                <View key={item.id} style={styles.housingItemWrapper}>
                  <TouchableOpacity
                    style={styles.housingItem}
                    onPress={() => {
                      if (item.name === "Electricity") {
                        navigation.navigate("ElectricityBill");
                      } else if (item.name === "LPG") {
                        navigation.navigate("LPGBill");
                      } else if (item.name === "Water") {
                        navigation.navigate("WaterBill");
                      } else if (item.name === "Municipal Taxes") {
                        navigation.navigate("MunicipalTaxes");
                      } else if (item.name === "Municipal Services") {
                        navigation.navigate("MunicipalServices");
                      } else if (item.name === "Housing Society") {
                        navigation.navigate("HousingSociety");
                      } else if (item.name === "Piped Gas") {
                        navigation.navigate("PipedGas");
                      } else if (item.name === "Rentals") {
                        navigation.navigate("Rentals");
                      } else if (item.name === "Prepaid Meter") {
                        navigation.navigate("PrepaidMeter");
                      } else {
                        navigation.navigate("PayBills");
                      }
                    }}
                  >
                    {item.icon}
                  </TouchableOpacity>
                  <Text style={styles.housingItemName}>{item.name}</Text>
                    <Text style={styles.housingItemName1}>{item.name1}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Communication Section */}
        {filterBills(communicationBills).length > 0 && (
          <View style={styles.commsection}>
            <Text style={styles.housingTitle}>COMMUNICATION</Text>
            <View style={styles.popularContainer}>
              {filterBills(communicationBills).map((item) => (
                <View key={item.id} style={styles.popularItemWrapper}>
                  <TouchableOpacity
                    style={styles.housingItem}
                    onPress={() => {
                      navigation.navigate("PayBills", { billType: item.name });
                    }}
                  >
                    {item.icon}
                  </TouchableOpacity>
                  <Text style={styles.popularName}>{item.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Travel Section */}
        {filterBills(TravelBills).length > 0 && (
          <View style={styles.commsection}>
            <Text style={styles.housingTitle}>TRAVEL</Text>
            <View style={styles.popularContainer}>
              {filterBills(TravelBills).map((item) => (
                <View key={item.id} style={styles.popularItemWrapper}>
                  <TouchableOpacity
                    style={styles.housingItem}
                    onPress={() => {
                      if (item.name === "Fastag") {
                        navigation.navigate("FastTag");
                      } else if (item.name === "NCMC Recharge") {
                        navigation.navigate("NCMCRecharge");
                      } else {
                        navigation.navigate("PayBills");
                      }
                    }}
                  >
                    {item.icon}
                  </TouchableOpacity>
                  <Text style={styles.popularName}>{item.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Financial Services Section */}
        {filterBills(FinancialServices).length > 0 && (
          <View style={styles.housingSection}>
            <Text style={styles.housingTitle}>FINANCIAL SERVICES</Text>
            <View style={styles.housingContainer}>
              {filterBills(FinancialServices).map((item) => (
                <View key={item.id} style={styles.housingItemWrapper}>
                  <TouchableOpacity
                    style={styles.housingItem}
                    onPress={() => {
                      navigation.navigate("PayBills", { billType: item.name });
                    }}
                  >
                    {item.icon}
                  </TouchableOpacity>
                  <Text style={styles.housingItemName}>{item.name}</Text>
                                    <Text style={styles.housingItemName1}>{item.name1}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Entertainment Section */}
        {filterBills(Entertainment).length > 0 && (
          <View style={styles.commsection}>
            <Text style={styles.housingTitle}>ENTERTAINMENT</Text>
            <View style={styles.popularContainer}>
              {filterBills(Entertainment).map((item) => (
                <View key={item.id} style={styles.popularItemWrapper}>
                  <TouchableOpacity
                    style={styles.housingItem}
                    onPress={() => {
                      navigation.navigate("PayBills", { billType: item.name });
                    }}
                  >
                    {item.icon}
                  </TouchableOpacity>
                  <Text style={styles.popularName}>{item.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* No Results Found */}
        {searchQuery !== '' && filterBills([...popularBills, ...housingUtilities, ...communicationBills, ...TravelBills, ...FinancialServices, ...Entertainment]).length === 0 && (
          <View style={{ padding: 50, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: '#999' }}>No results found for "{searchQuery}"</Text>
          </View>
        )}
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
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: "#debe57",
  },
  headerTitle: {
    fontSize: textScale(16),
    fontFamily: FONTS.Interbold,
    color: '#333',
  },
  walletButton: {
    width: moderateScale(80),
    height: verticalScale(40),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
    backgroundColor: "#FFF",
    borderRadius: 10,
  },
  bellIcon: {
    width: moderateScale(45),
    height: verticalScale(45),
    borderRadius: 100,
    backgroundColor: "#e09046",
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(10),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: textScale(14),
    fontFamily: FONTS.Interbold,
    color: '#333',
  },
  viewAllText: {
    fontSize: textScale(12),
    fontFamily: FONTS.InterMedium,
    color: '#ED8701',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginHorizontal: moderateScale(16),
    marginVertical: verticalScale(10),
    paddingHorizontal: moderateScale(15),
    paddingVertical: verticalScale(5),
    borderRadius: 12,
    gap: 10,
  },
  searchInput: {
    fontSize: textScale(14),
    fontFamily: FONTS.MetropolicRegular,
    color: '#333',
    flex: 1,
  },
  popularContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  popularItemWrapper: {
    alignItems: "center",
  },
  popularIcon: {
    fontSize: textScale(24),
  },
  popularName: {
    fontSize: textScale(10),
    fontFamily: FONTS.MetropolicMedium,
    color: '#333',
    marginTop: 5,
  },
  housingSection: {
    marginHorizontal:15,
    marginTop: 10,
    marginBottom: 20,
  },
  housingTitle: {
    fontSize: textScale(14),
    fontFamily: FONTS.InterSemiBold,
    color: '#a79a9a',
    letterSpacing:2,
    marginBottom: 15,
  },
  housingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: "space-between",
    left:-8
  },
  housingItemWrapper: {
    width: '24%',
    alignItems: "center",
    marginBottom: 15,
  },
  housingItem: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5E8',
    borderWidth: 0.6,
    borderColor: "#edb861",
    borderRadius: 12,
    width: moderateScale(60),
    height: verticalScale(60),
  },
  housingItemName: {
    fontSize: textScale(10),
    fontFamily: FONTS.MetropolicMedium,
    color: "#333",
    marginTop: 5,
    textAlign: "center",
  },
  housingItemName1: {
    fontSize: textScale(10),
    fontFamily: FONTS.MetropolicMedium,
    color: "#333",
    top: -5,
    textAlign: "center",
  },
  commsection: {
    marginHorizontal:15,
    marginTop: 10,
    marginBottom: 20,
  },
});

export default PayBills;