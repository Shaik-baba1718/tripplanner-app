import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Modal,
  Image,
  processColor
} from 'react-native';
import { 
  ArrowLeft, Plus, CreditCard, Send, Gift, 
  ChevronRight, Eye, EyeOff, Coins, 
  ArrowUp, ArrowDown, ArrowUpDown, UserCircle2,Check
} from 'lucide-react-native';
import { textScale, moderateScale, verticalScale } from '../styles/responsiveSize';
import LinearGradient from 'react-native-linear-gradient';
import { FONTS } from '../../global';
import images from "../assets/index"
import AsyncStorage from '@react-native-async-storage/async-storage';
const WalletScreen = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [loadMoneyModal, setLoadMoneyModal] = useState(false);
  const [amount, setAmount] = useState('');

  const [profileData, setProfileData] =
      useState(null); 
  const [loading, setLoading] = useState(true);
  const [orderNow,setOrderNow] =useState(false);
    // Form states
  const [panNumber, setPanNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [agreeToTerms,setAgreeToTerms] =useState('');
  const handleOrderNow = () => {
    if (!agreeToTerms) {
      alert('Please agree to the terms & conditions');
      return;
    }
    // Handle order submission
    console.log('Order submitted');
    setOrderNow(false);
  };
   const loadProfileData = async () => {

  try {

    const storedData =
      await AsyncStorage.getItem(
        "profileData"
      );
    console.log("Stored Data:", storedData); 


    if (storedData) {

      const parsedData =
        JSON.parse(storedData);
    console.log("Parsed Data:", parsedData);  
      

      setProfileData(parsedData);
    

    }

  } catch (error) {

    console.log(error);

  }

};
useEffect(() => {
    loadProfileData();
  }, []);
useEffect(() => {
  console.log("profileData updated:", profileData);

}, [profileData]);
  const icons = [
    { 
      id: 1, 
      name: 'Pay', 
      icon: ArrowUp, 
     
    },
    { 
      id: 2, 
      name: 'Requests', 
      icon: ArrowDown, 
    
    },
    { 
      id: 3, 
      name: 'History', 
      icon: ArrowUpDown, 
    
    },
    { 
      id: 4, 
      name: 'To Bank &',
      name2:'self A/C', 
      icon: UserCircle2, 
     
    },
  ];

  const handleIconPress = (iconName) => {
    console.log(`Pressed: ${iconName}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Header */}
      

        {/* Cashback Banner */}
        <LinearGradient
          colors={['#FF6B35', '#F7931E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.cashbackBanner}
        >
             <LinearGradient  colors={['#FF8A65', '#FFB74D']}

  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}   
  style={styles.gradiantBox}>
    
          <View style={{borderWidth:1,borderColor:"#fff",padding:30,alignItems:"center",justifyContent:"center",borderRadius:20}}>
         
          <View>
            <Text style={styles.cashbackTitle}>Get huge cashbacks</Text>
            <Text style={styles.cashbackSubtitle}>with your prepaid card</Text>
          </View>
          <TouchableOpacity style={styles.addCardButton}>
            <Plus color="orange" size={15} />
            <Text style={styles.addCardText}>Add card</Text>
          </TouchableOpacity>
       
          </View>
             </LinearGradient>
          
        </LinearGradient>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
              {showBalance ? <Eye color="#666" size={20} /> : <EyeOff color="#666" size={20} />}
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceAmount}>
            {showBalance ? '₹0.0' : '•••••'}
          </Text>
          <TouchableOpacity 
            style={styles.loadMoneyButton}
            onPress={() => setLoadMoneyModal(true)}
          >
            <Text style={styles.loadMoneyText}>Load Money</Text>
          </TouchableOpacity>
        </View>

        {/* Icons Grid Section */}
        <View style={styles.iconsSection}>
       
          <View style={styles.gridContainer}>
            {icons.map((item) => (
              <View style={{alignItems:"center"}}>
              <TouchableOpacity
                key={item.id}
                style={styles.iconBox}
                onPress={() => handleIconPress(item.name)}
                activeOpacity={0.7}
              >
                
                  <item.icon size={28} color="orange" strokeWidth={1.5} />
                
               
                 
              </TouchableOpacity>
              <Text style={styles.iconName}>{item.name}</Text>
               <Text style={styles.iconName2}>{item.name2}</Text>
              </View>
              
            ))}
          </View>

        </View>

      

        {/* Reward Points Section */}
        <View style={styles.rewardSection}>
          <View style={styles.rewardHeader}>
            <Gift color="#FF6B35" size={22} />
            <Text style={styles.rewardTitle}>Reward Points</Text>
          </View>
          <View style={styles.rewardRow}>
            <View style={styles.rewardContent}>
              <Coins color="#FF6B35" size={22} />
              <Text style={styles.rewardAmount}>0</Text>
            </View>
            <TouchableOpacity style={styles.redeemButton}>
              <Text style={styles.redeemButtonText}>Redeem Now</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>

      {/* Load Money Modal */}
      <Modal
      animationType="slide"
      transparent={true}
      visible={loadMoneyModal}
      onRequestClose={() => setLoadMoneyModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader1

          }> 
          <View  style={{
    flexDirection: "row",
    alignSelf: "flex-start",
    justifyContent: "flex-start",
    alignItems: "center",
  }}>
            <Text style={styles.modalTitle}>Get your </Text>
            <Text   style={styles.modalTitle2}> Virtual Super Card</Text>
          </View>
            
            <Text style={styles.subtitle}>available in just 5mins</Text>
          </View>
          <TouchableOpacity style={styles.orderButton}>
            <Text style={styles.orderButtonText}>Order a New card</Text>
          </TouchableOpacity>
          <View style={{padding:20,}}>
             <View style={{padding:10,backgroundColor: "#FFFDE7",width:'100%',borderRadius:20}}>
              {/* Order New Card Button */}
          
            
             <Image  style={{width:'100%',borderRadius:20,}}source={images.cdc}/>
           
         

             <TouchableOpacity style={styles.virtualCardButton}>
            <Text style={styles.virtualCardText}>Virtual card</Text>
            <TouchableOpacity  onPress={()=>{setOrderNow(true)}} style={{backgroundColor:"orange",alignItems:"center",justifyContent:"center",height:verticalScale(40),borderRadius:10,width:moderateScale(80)}}>
              <Text style={styles.orderNowText}>Order Now</Text>
            </TouchableOpacity>
            
          </TouchableOpacity>
         
            </View>
          
          </View>
            
          

         
        </View>
      </View>
      </Modal>
       {/* Order Now Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={orderNow}
        onRequestClose={() => setOrderNow(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.orderModalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Order New Card</Text>
              <TouchableOpacity onPress={() => setOrderNow(false)}>
                <ArrowLeft color="#333" size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* PAN Number */}
              <Text style={styles.inputLabel}>PAN Number *</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Enter PAN Number"
                placeholderTextColor="#999"
                value={panNumber}
                onChangeText={setPanNumber}
                autoCapitalize="characters"
                maxLength={10}
              />

              {/* Full Name as per PAN */}
              <Text style={styles.inputLabel}>Full Name (as per PAN) *</Text>
              <TextInput
                style={styles.inputField}
                 placeholder={profileData?.name || "Enter PAN Number"}
                placeholderTextColor="#999"
                  value={fullName}
                onChangeText={setFullName}
              />

              {/* Gender */}
              <Text style={styles.inputLabel}>Gender *</Text>
              <View style={styles.genderContainer}>
                <TouchableOpacity
                  style={[styles.genderOption, gender === 'Male' && styles.genderOptionSelected]}
                  onPress={() => setGender('Male')}
                >
                  <Text style={[styles.genderText, gender === 'Male' && styles.genderTextSelected]}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.genderOption, gender === 'Female' && styles.genderOptionSelected]}
                  onPress={() => setGender('Female')}
                >
                  <Text style={[styles.genderText, gender === 'Female' && styles.genderTextSelected]}>Female</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.genderOption, gender === 'Other' && styles.genderOptionSelected]}
                  onPress={() => setGender('Other')}
                >
                  <Text style={[styles.genderText, gender === 'Other' && styles.genderTextSelected]}>Other</Text>
                </TouchableOpacity>
              </View>

              {/* Date of Birth */}
              <Text style={styles.inputLabel}>Date of Birth *</Text>
              <TextInput
                style={styles.inputField}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#999"
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
              />

              {/* City */}
              <Text style={styles.inputLabel}>City *</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Enter city"
                placeholderTextColor="#999"
                value={city}
                onChangeText={setCity}
              />

              {/* State */}
              <Text style={styles.inputLabel}>State *</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Enter state"
                placeholderTextColor="#999"
                value={state}
                onChangeText={setState}
              />

              {/* Pincode */}
              <Text style={styles.inputLabel}>Pincode *</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Enter pincode"
                placeholderTextColor="#999"
                value={pincode}
                onChangeText={setPincode}
                keyboardType="numeric"
                maxLength={6}
              />

              {/* Name on Card */}
              <Text style={styles.inputLabel}>Name on Card *</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Enter name on card"
                placeholderTextColor="#999"
                value={nameOnCard}
                onChangeText={setNameOnCard}
              />

              {/* Terms and Conditions */}
              <View style={styles.termsContainer}>
                <TouchableOpacity 
                  style={styles.checkbox} 
                  onPress={() => setAgreeToTerms(!agreeToTerms)}
                >
                  {agreeToTerms && <Check color="#FF6B35" size={16} />}
                </TouchableOpacity>
                <Text style={styles.termsText}>
                  I agree to the issuance and 
                  <Text style={styles.termsLink}> terms & condition</Text> of transport PPI
                </Text>
              </View>

              {/* Submit Button */}
              <LinearGradient
                colors={['#FF6B35', '#F7931E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitButton}
              >
                <TouchableOpacity onPress={handleOrderNow}>
                  <Text style={styles.submitButtonText}>Submit & Order Card</Text>
                </TouchableOpacity>
              </LinearGradient>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: textScale(18),
    fontWeight: 'bold',
    color: '#333',
  },
  cashbackBanner: {
    flexDirection: 'column',
    width: '100%',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: verticalScale(250),
    alignSelf: "center",
    padding: 15,
    marginTop: -10,
    borderRadius: 16,
  },
  gradiantBox: {
    borderRadius: 20,
  },
  bannerInner: {
    borderWidth: 1,
    borderColor: "#fff",
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  cashbackTitle: {
    fontSize: textScale(14),
    fontFamily: FONTS.Interbold,
    color: '#FFF',
    textAlign: 'center',
  },
  cashbackSubtitle: {
    fontSize: textScale(14),
    color: '#FFF',
    fontFamily: FONTS.Interbold,
    textAlign: 'center',
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
    marginTop: 10,
  },
  addCardText: {
    color: 'orange',
    fontSize: textScale(12),
    fontWeight: '500',
  },
  balanceCard: {
    backgroundColor: '#FFF',
    margin: 15,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: textScale(14),
    color: '#666',
  },
  balanceAmount: {
    fontSize: textScale(36),
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 20,
  },
  loadMoneyButton: {
    backgroundColor: '#FF6B35',
    width: moderateScale(120),
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadMoneyText: {
    color: '#FFF',
    fontSize: textScale(12),
    fontFamily: FONTS.sfproMedium,
  },
  iconsSection: {
    margin: 15,
    padding: 15,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: "space-between",
  },
  iconWrapper: {
    alignItems: "center",
  },
  iconBox: {
    width: 50,
    height: 50,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    justifyContent: "center",
    alignItems: 'center',
  },
  iconName: {
    fontSize: textScale(10),
    marginTop: 10,
    color: '#333',
  },
  iconName2: {
    fontSize: textScale(10),
    color: '#333',
  },
  rewardSection: {
    backgroundColor: '#FFF',
    margin: 15,
    padding: 15,
    borderRadius: 16,
    marginBottom: 30,
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  rewardTitle: {
    fontSize: textScale(16),
    fontWeight: 'bold',
    color: '#333',
  },
  rewardRow: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardContent: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  rewardAmount: {
    fontSize: textScale(24),
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  redeemButton: {
    backgroundColor: '#FFF0E6',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
  },
  redeemButtonText: {
    color: '#FF6B35',
    fontSize: textScale(12),
    fontWeight: '600',
  },
  // Modal Styles (single definition)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
 
   
    paddingBottom: moderateScale(30),
  },
  modalHeader1: {
   width:'100%',
   backgroundColor: "#FFFDE7",
    alignItems: 'center',
    top:10,
    paddingHorizontal:10,
    paddingVertical:10,
    marginBottom: verticalScale(5),
  },
  modalTitle: {
    fontSize: textScale(14),
    fontFamily:FONTS.MetropolicMedium,
    color: '#333',
    alignSelf:"flex-start",
  
  
  },
  modalTitle2: {
    fontSize: textScale(18),
   fontFamily:FONTS.MetropolicBold,
    color: 'orange',
    alignSelf:"flex-start",
    
 
  },
  closeButton: {
    fontSize: 20,
    color: '#999',
    padding: 5,
  },
  subtitle: {
    fontSize: textScale(12),
    color: '#333',
   alignSelf:"flex-start",
    fontFamily:FONTS.MetropolicMedium,
  },
  orderButton: {
    padding:10,
    marginTop:20,
    marginBottom: verticalScale(20),
  },
  orderButtonText: {
    color: '#333',
    fontSize: textScale(14),
    fontFamily:FONTS.MontMedium,
  },
  
 
  virtualCardButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
   
    padding: moderateScale(15),
    borderRadius: 12,
    marginTop: verticalScale(5),
  },
  virtualCardText: {
    fontSize: textScale(14),
    color: '#333',
    fontWeight: '500',
  },
  orderNowText: {
    fontSize: textScale(12),
   fontFamily:FONTS.sfproMedium,
   color:"#FFF"
  },
    container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  orderNowMainButton: {
    backgroundColor: '#FF6B35',
    margin: 15,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  orderNowMainButtonText: {
    color: '#FFF',
    fontSize: textScale(16),
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  orderModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: moderateScale(20),
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: textScale(18),
    fontWeight: 'bold',
    color: '#333',
  },
  inputLabel: {
    fontSize: textScale(14),
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    marginTop: 15,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 12,
    fontSize: textScale(14),
    color: '#333',
    backgroundColor: '#FFF',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 5,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  genderOptionSelected: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  genderText: {
    fontSize: textScale(14),
    color: '#333',
  },
  genderTextSelected: {
    color: '#FFF',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#FF6B35',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  termsText: {
    flex: 1,
    fontSize: textScale(12),
    color: '#666',
  },
  termsLink: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  submitButton: {
    borderRadius: 12,
    marginBottom: 30,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: textScale(16),
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 14,
  },
});

export default WalletScreen;