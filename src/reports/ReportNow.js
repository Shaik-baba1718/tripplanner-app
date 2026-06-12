import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { ArrowLeft, QrCode, Plus, Car, User, Users, Gift, ShoppingBag, MessageCircle, MapPin } from 'lucide-react-native';
import { textScale, moderateScale, verticalScale } from '../styles/responsiveSize';
import { FONTS } from '../../global';
import LinearGradient from 'react-native-linear-gradient';
import images from "../assets/index";

const ReportNow = ({ navigation }) => {
  const menuItems = [
    { id: 1, title: 'Refer & Earn', icon: <Gift color="#ED8701" size={22} /> },
    { id: 2, title: 'Buy Kit', icon: <ShoppingBag color="#ED8701" size={22} /> },
    { id: 3, title: 'Chats', icon: <MessageCircle color="#ED8701" size={22} /> },
    { id: 4, title: 'Find nearest kiosk', icon: <MapPin color="#ED8701" size={22} /> },
  ];

  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} >
            <ArrowLeft color="#333" size={20} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Good Samaritan</Text>
          
        </View>
      <ScrollView showsVerticalScrollIndicator={false}>
       <View style={{ overflow: "hidden",  borderColor: "orange", height: verticalScale(230) }}>
  {/* Background Image - Under everything */}
 
  
  {/* Content View - On top of background image */}
  <View style={{ 
   
   
  
   
  }}>
    <Image 
      source={images.ed11} 
      style={{ width: moderateScale(100), height: verticalScale(100),alignSelf:"center" }} 
    />
    <Text style={styles.heroSubtitle}>Kindness on the go</Text>
    <Text style={styles.heroTitle}>Help anonymously.</Text>
    <Text style={styles.tagText}>WITH GOOD SAMARITAN</Text>
  </View>
   <Image 
  source={images.ed12} 
  style={{ 
    width: "120%", 
    height: verticalScale(150),
    resizeMode:"",
    position: "absolute",
    left:-35,
    top: 105
  }} 
/> 
</View>
      
     

       
        
          

        {/* Report Vehicle Section */}
        <View style={{flexDirection:"row",paddingHorizontal:10,gap:5}}>
          <TouchableOpacity style={styles.sectionCard} onPress={()=>navigation.navigate("Report1")}>

            
            <Text style={styles.sectionTitle}>Report vehicle</Text>
        
          <Text style={styles.sectionDescription}>
            Found issue? alert the owner.
          </Text>
          <Image source={images.ed3} style={{width:moderateScale(230),height:verticalScale(90),left:-33,top:12}}/>
        </TouchableOpacity>

        {/* Found Lost One Section */}
        <TouchableOpacity style={styles.sectionCard}>
          
           
            <Text style={styles.sectionTitle}>Found Lost one?</Text>
        
          <Text style={styles.sectionDescription}>
            Found lost people – let the guardian know.
          </Text>
          <Image source={images.ed4} style={{width:moderateScale(230),height:verticalScale(90),left:-33,top:12}}/>
        </TouchableOpacity>
        </View>
      

        
         
          <TouchableOpacity style={[styles.qrButton]}>
            <Plus color="#ED8701" size={16} />
            <Text style={styles.qrButtonText}>Add New QR</Text>
          </TouchableOpacity>
        

        {/* START & EARN Section */}
        <View style={styles.earnSection}>
          <Text style={styles.earnTitle}>START & EARN</Text>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem}>
              <View style={styles.menuIconContainer}>
                {item.icon}
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
              <View style={styles.arrowIcon} />
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
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
    gap:5,
    padding:10,
    backgroundColor: '#fff',
    borderTopWidth: 0.6,
      borderBottomWidth: 0.6,
    borderColor: '#cec9c9',
    marginTop:45,
    marginBottom:10
  },
 
  headerTitle: {
    fontSize: textScale(14),
    
    color: '#333',
    fontFamily: FONTS.InterMedium,
  },
  heroSection: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: verticalScale(30),
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroTitle: {
    fontSize: textScale(24),
    textAlign:"center",
    color: '#994c4c',
    fontFamily: FONTS.Interbold,
  top:-8

  },
  heroSubtitle: {
    fontSize: textScale(18),
    color: '#994c4c',
    fontFamily: FONTS.MetropolicMedium,
    textAlign:"center",
   
  },
 
  tagText: {
    fontSize: textScale(10),
    color: '#000',
    fontFamily: FONTS.MontBold,
    letterSpacing: 1,
    top:-10,
    textAlign:"center",
  },
  sectionCard: {
    backgroundColor: '#FFF',
    flex:1,
    marginTop: 15,
    padding: 10,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#ED8701',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  
    width:'50%',
    overflow:"hidden",
  },
 
  sectionTitle: {
    fontSize: textScale(14),
   
    color: '#4b718b',
    fontFamily: FONTS.MontBold,
  },
  sectionDescription: {
    fontSize: textScale(12),
    color: '#666',
    fontFamily: FONTS.MetropolicRegular,
   
  },
 
  qrButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems:"center",
    marginTop:10,
    padding:10,
    gap: 4,
  },
  
  qrButtonText: {
    fontSize: textScale(14),
    color: '#ED8701',
    fontFamily: FONTS.MetropolicMedium,
  },
  earnSection: {
    backgroundColor: '#FFF',
    marginHorizontal: moderateScale(16),
    marginTop: verticalScale(16),
    marginBottom: verticalScale(30),
    padding: moderateScale(16),
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#ED8701',
  },
  earnTitle: {
    fontSize: textScale(16),
    fontWeight: 'bold',
    color: '#ED8701',
    fontFamily: FONTS.Interbold,
    marginBottom: verticalScale(12),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  },
  menuIconContainer: {
    width: moderateScale(35),
    alignItems: 'center',
    marginRight: moderateScale(12),
  },
  menuText: {
    flex: 1,
    fontSize: textScale(14),
    color: '#333',
    fontFamily: FONTS.MetropolicMedium,
  },
  arrowIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    marginLeft: moderateScale(8),
  },
});

export default ReportNow;