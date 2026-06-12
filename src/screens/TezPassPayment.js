import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Modal,
  TextInput,
  FlatList,
  Dimensions,
} from 'react-native';
import { ArrowLeft, X, Search, LocateFixed } from 'lucide-react-native';
import { FONTS } from '../../global';
import { moderateScale, verticalScale, textScale } from '../styles/responsiveSize';
import images from "../assets/index";
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const TezPassPayment = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEVStation, setSelectedEVStation] = useState(null);


  
  const evStations = [
    {
      id: '1',
      name: 'Jaipur',
      address: 'Rajasthan',
      distance: '0.5 km',
      available: true,
      connector: 'CCS2',
      rating: 4.5,
      latitude: 26.9124,
      longitude: 75.7873,
    },
    {
      id: '2',
      name: 'Ajaypur',
      address: 'Rajasthan',
      distance: '1.2 km',
      available: true,
      connector: 'CHAdeMO',
      rating: 4.3,
      latitude: 26.5000,
      longitude: 75.5000,
    },
    {
      id: '3',
      name: 'Lucknow',
      address: 'Uttar Pradesh',
      distance: '2.0 km',
      available: true,
      connector: 'Type 2',
      rating: 4.0,
      latitude: 26.8467,
      longitude: 80.9462,
    },
    {
      id: '4',
      name: 'Patna',
      address: 'Bihar',
      distance: '2.5 km',
      available: false,
      connector: 'CCS2',
      rating: 4.7,
      latitude: 25.5941,
      longitude: 85.1376,
    },
    {
      id: '5',
      name: 'Nagpur',
      address: 'Maharashtra',
      distance: '3.1 km',
      available: true,
      connector: 'CHAdeMO',
      rating: 4.2,
      latitude: 21.1458,
      longitude: 79.0882,
    },
    {
      id: '6',
      name: 'Surat',
      address: 'Gujarat',
      distance: '3.8 km',
      available: true,
      connector: 'Type 2',
      rating: 4.1,
      latitude: 21.1702,
      longitude: 72.8311,
    },
    {
      id: '7',
      name: 'Pune',
      address: 'Maharashtra',
      distance: '4.0 km',
      available: false,
      connector: 'CCS2',
      rating: 4.4,
      latitude: 18.5204,
      longitude: 73.8567,
    },
    {
      id: '8',
      name: 'Bengaluru',
      address: 'Karnataka',
      distance: '5.0 km',
      available: true,
      connector: 'CHAdeMO',
      rating: 4.6,
      latitude: 12.9716,
      longitude: 77.5946,
    },
    {
      id: '9',
      name: 'Thiruvananthapuram',
      address: 'Kerala',
      distance: '6.0 km',
      available: true,
      connector: 'Type 2',
      rating: 4.3,
      latitude: 8.5241,
      longitude: 76.9366,
    },
    {
      id: '10',
      name: 'Chennai',
      address: 'Tamil Nadu',
      distance: '7.0 km',
      available: false,
      connector: 'CCS2',
      rating: 4.1,
      latitude: 13.0827,
      longitude: 80.2707,
    },
  ];

  const filteredStations = evStations.filter((station) =>
    station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStationSelect = (station) => {
    setSelectedEVStation(station);
    setModalVisible(false);
  };

  const handleSeeOnMaps = () => {
  
    navigation.navigate('MapScreen', { stations: evStations });
  };

  const renderStationCard = ({ item }) => (
    <TouchableOpacity
      style={styles.stationCard}
      onPress={() => handleStationSelect(item)}
    >
      <View style={styles.stationHeader}>
        <Image source={images.ev} style={{width: moderateScale(40), height: verticalScale(40), borderRadius: 10}}/>
        <View style={styles.stationInfo}>
          <Text style={styles.stationName}>{item.name}</Text>
          <Text style={styles.stationAddress}>{item.distance}, {item.address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.evPartnerButton} onPress={() => setModalVisible(true)}>
          <Image source={images.ev} style={styles.evIcon} />
          <Text style={styles.headerTitle}>EV PARTNERS</Text>
        </TouchableOpacity>
        
   
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.mainTitle}> TezPass</Text>
       

        <View style={styles.brandsRow}>
          <View style={{flexWrap:"wrap",flexDirection:"column",alignItems:"flex-start"}}>
              <Text style={styles.redeemText}>Redeem at 
        </Text>
        <Text style={styles.brandCount}>10+ Brands</Text>
          </View>
          <View style={{flexDirection:"row",gap:10}}>
             <View style={styles.brandCircle}><Text style={styles.brandText}>voltran</Text></View>
          <View style={styles.brandCircle}><Text style={styles.brandText}>Thunder</Text></View>
          </View>
       
         
          
        </View>

        <View style={styles.chargeContainer}>
<LinearGradient 
  colors={['transparent', '#FFF', 'transparent']} 
  locations={[0,0.2,0.8, 1]}
  style={{height: 1, flex: 1}}
/>
          <Text style={styles.chargeText}>CHARGE SMARTER</Text>
         <View style={{height:1,flex:1,backgroundColor:"#FFF",opacity:0.5}}></View>

        </View>

       <TouchableOpacity style={{paddingHorizontal:10,flex:1,flexDirection:"column",gap:10}}>
        <LinearGradient   colors={['#4A90E2', '#1E3A8A']} style={{borderRadius:10}} // ← ADD THIS
            >
                  <View style={{width:moderateScale('100%'),borderWidth:1,borderColor:"#FFF",padding:10,borderRadius:10,height:verticalScale(250)}}>
                    <View style={{flexDirection:"column",gap:30}}>
                      <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                        <View style={{flexDirection:"column"}}>
                              <Text>TEZPASS</Text>
                              <Text>LITE</Text>
                        </View>
                               <Text>₹1900</Text>
                      </View>
                      <View style={{flexDirection:"row",gap:4}}>
                        <View style={{borderWidth:0.7,borderColor:"#FFF",alignItems:"center",justifyContent:"center",width:'50%',borderRadius:10}}>
                               <Text>100</Text>
                               <Text>Points</Text>

                        </View>
                         <View style={{borderWidth:0.7,borderColor:"#FFF",alignItems:"center",justifyContent:"center",width:'50%',borderRadius:10}}>
                                  <Text>30 days</Text>
                               <Text>Validity</Text>

                        </View>

                      </View>
                      <TouchableOpacity style={{width:moderateScale(300),borderWidth:0.7,borderColor:"#FFF",backgroundColor:"#6d6666",alignSelf:"center",alignItems:"center",height:verticalScale(40),justifyContent:"center",borderRadius:10}}>
                        <Text>Buy now</Text>
                      </TouchableOpacity>
                      
                    </View>
                  </View>
        </LinearGradient >
              

       </TouchableOpacity>

        <Text style={styles.bottomRedeemText}>Redeemable at 10+ Brands</Text>
      </ScrollView>

      {/* EV Station Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={false} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <ArrowLeft color="#333" size={20} />
            </TouchableOpacity>
            <View style={styles.modalHeaderRight}>
              <Text style={styles.modalTitle}>Select EV Station</Text>
              <TouchableOpacity onPress={handleSeeOnMaps}>
                <Text style={styles.seeOnMapsText}>See on Maps</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.searchContainer}>
            <Search color="#999" size={20} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by station name"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X color="#999" size={20} />
              </TouchableOpacity>
            )}
            <LocateFixed size={20} color="#999" />
          </View>

          <FlatList
            data={filteredStations}
            renderItem={renderStationCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No EV stations found</Text>
              </View>
            }
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#072c76' },
  header: { marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: moderateScale(15), paddingVertical: verticalScale(15) },
  backButton: { padding: 5, marginRight: 10 },
  evPartnerButton: { borderWidth: 1, borderColor: '#7975d0', borderRadius: 8, padding: 5, flexDirection: "row", alignItems: "center", gap: 4, justifyContent: "center" },
  evIcon: { width: 20, height: 20, borderRadius: 5, resizeMode: 'contain' },
  headerTitle: { fontSize: textScale(14), fontFamily: FONTS.MetropolicMedium, color: '#fff', letterSpacing: 1 },
  mainTitle: { fontSize: textScale(24), fontFamily: FONTS.MetropolicBold, color: '#fff', marginTop:10,textAlign:"center"  },
  redeemText: { fontSize: textScale(14), fontFamily: FONTS.MetropolicRegular, color: '#ccc', marginTop: verticalScale(5), marginHorizontal: moderateScale(20) },
  brandCount: { fontSize:textScale(14),fontFamily: FONTS.MetropolicRegular, color: '#fff' },
  brandsRow: {flexDirection: 'row',borderTopWidth:1,borderBottomWidth:1,borderColor:"#fff",padding:10 ,alignItems:"center",justifyContent:"space-between"},
  brandCircle: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: moderateScale(15), paddingVertical: verticalScale(8), borderRadius: 20, },
  brandText: { fontSize: textScale(12), fontFamily: FONTS.MetropolicMedium, color: '#fff' },
  chargeContainer: { alignItems: 'center', marginTop: verticalScale(20), marginBottom: verticalScale(20),flexDirection:"row",paddingHorizontal:30,justifyContent:"center",gap:4 },
  chargeText: { fontSize: textScale(12), fontFamily: FONTS.MetropolicMedium, color: '#6f9ec4' },
  underline: { width: 60, height: 3, backgroundColor: '#FF6B35', marginTop: verticalScale(5), borderRadius: 2 },
  passCard: { marginHorizontal: moderateScale(20), marginBottom: verticalScale(20), padding: moderateScale(20), borderRadius: 15, },
  passName: { fontSize: textScale(18), fontFamily: FONTS.MetropolicBold, marginBottom: verticalScale(5) },
  passPrice: { fontSize: textScale(28), fontFamily: FONTS.MetropolicBold, marginBottom: verticalScale(15) },
  featuresContainer: { marginBottom: verticalScale(20) },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: verticalScale(8) },
  bulletPoint: { width: 6, height: 6, borderRadius: 3, marginRight: moderateScale(10) },
  featureText: { fontSize: textScale(14), fontFamily: FONTS.MetropolicRegular, color: '#666' },
  buyButton: { paddingVertical: verticalScale(12), borderRadius: 25, alignItems: 'center' },
  buyButtonText: { color: '#fff', fontSize: textScale(14), fontFamily: FONTS.MetropolicBold },
  bottomRedeemText: { fontSize: textScale(14), fontFamily: FONTS.MetropolicMedium, color: '#ccc', textAlign: 'center', marginVertical: verticalScale(30) },
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  modalHeader: { marginTop: 10, flexDirection: 'row', gap: 4, alignItems: 'center', padding: 10, backgroundColor: '#FFF', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#F0F0F0' },
  modalHeaderRight: { flex: 1, justifyContent: 'space-between', flexDirection: 'row' },
  modalTitle: { fontSize: textScale(14), fontFamily: FONTS.MetropolicBold, color: '#333' },
  seeOnMapsText: { fontSize: textScale(12), fontFamily: FONTS.MetropolicBold, color: "orange" },
  closeButton: { padding: 5 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', margin: moderateScale(15), paddingHorizontal: 5, borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, paddingVertical: verticalScale(12), fontSize: textScale(14), fontFamily: FONTS.MetropolicRegular, color: '#333' },
  stationCard: { backgroundColor: '#FFF', padding: moderateScale(10), borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  stationHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  stationInfo: { flex: 1 },
  stationName: { fontSize: textScale(14), fontFamily: FONTS.MetropolicBold, color: '#333' },
  stationAddress: { fontSize: textScale(12), fontFamily: FONTS.MetropolicRegular, color: '#666', marginTop: 4 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: verticalScale(50) },
  emptyText: { fontSize: textScale(14), fontFamily: FONTS.MetropolicRegular, color: '#999' },
});

export default TezPassPayment;