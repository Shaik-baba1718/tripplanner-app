import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  TextInput,
  ScrollView,
} from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { ArrowLeft, Search, SlidersHorizontal, ChevronRight } from 'lucide-react-native';
import { FONTS } from '../../global';
import { moderateScale, verticalScale, textScale } from '../styles/responsiveSize';

const { width, height } = Dimensions.get('window');

const MapScreen = ({ navigation, route }) => {
  const { stations } = route.params || {};
  const [selectedCity, setSelectedCity] = useState(null);

  // Complete Indian cities data
  const evStations = stations || [
    { id: '1', name: 'Jaipur', address: 'Rajasthan', latitude: 26.9124, longitude: 75.7873, available: true, region: 'North India' },
    { id: '2', name: 'Ajaypur', address: 'Rajasthan', latitude: 26.5000, longitude: 75.5000, available: true, region: 'North India' },
    { id: '3', name: 'Lucknow', address: 'Uttar Pradesh', latitude: 26.8467, longitude: 80.9462, available: true, region: 'North India' },
    { id: '4', name: 'Patna', address: 'Bihar', latitude: 25.5941, longitude: 85.1376, available: true, region: 'East India' },
    { id: '5', name: 'Madhya Pradesh', address: 'MP', latitude: 23.2599, longitude: 77.4126, available: false, region: 'Central India' },
    { id: '6', name: 'Jharkhand', address: 'Jharkhand', latitude: 23.6102, longitude: 85.2799, available: true, region: 'East India' },
    { id: '7', name: 'Chhattisgarh', address: 'Chhattisgarh', latitude: 21.2787, longitude: 81.8661, available: false, region: 'Central India' },
    { id: '8', name: 'Nagpur', address: 'Maharashtra', latitude: 21.1458, longitude: 79.0882, available: true, region: 'West India' },
    { id: '9', name: 'Surat', address: 'Gujarat', latitude: 21.1702, longitude: 72.8311, available: true, region: 'West India' },
    { id: '10', name: 'Odisha', address: 'Odisha', latitude: 20.9517, longitude: 85.0985, available: true, region: 'East India' },
    { id: '11', name: 'Maharashtra', address: 'Maharashtra', latitude: 19.7515, longitude: 75.7139, available: true, region: 'West India' },
    { id: '12', name: 'Pune', address: 'Maharashtra', latitude: 18.5204, longitude: 73.8567, available: true, region: 'West India' },
    { id: '13', name: 'Goa', address: 'Goa', latitude: 15.2993, longitude: 74.1240, available: true, region: 'West India' },
    { id: '14', name: 'Karnataka', address: 'Karnataka', latitude: 15.3173, longitude: 75.7139, available: true, region: 'South India' },
    { id: '15', name: 'Bengaluru', address: 'Karnataka', latitude: 12.9716, longitude: 77.5946, available: true, region: 'South India' },
    { id: '16', name: 'Tamil Nadu', address: 'Tamil Nadu', latitude: 11.1271, longitude: 78.6569, available: false, region: 'South India' },
    { id: '17', name: 'Kerala', address: 'Kerala', latitude: 10.8505, longitude: 76.2711, available: true, region: 'South India' },
    { id: '18', name: 'Thiruvananthapuram', address: 'Kerala', latitude: 8.5241, longitude: 76.9366, available: true, region: 'South India' },
    { id: '19', name: 'Sri Lanka', address: 'Sri Lanka', latitude: 7.8731, longitude: 80.7718, available: false, region: 'International' },
  ];

  const regions = [
    { name: 'North India', color: '#FF6B35' },
    { name: 'West India', color: '#4A90E2' },
    { name: 'South India', color: '#4CAF50' },
    { name: 'East India', color: '#9C27B0' },
    { name: 'Central India', color: '#FF9800' },
  ];

  const handleCityPress = (city) => {
    setSelectedCity(city);
  };

  const getMarkerColor = (station) => {
    if (station.region === 'North India') return '#FF6B35';
    if (station.region === 'West India') return '#4A90E2';
    if (station.region === 'South India') return '#4CAF50';
    if (station.region === 'East India') return '#9C27B0';
    return '#FF9800';
  };

  const CityList = () => (
    <ScrollView 
      style={styles.cityList}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.cityListContent}
    >
      {evStations.map((city) => (
        <TouchableOpacity
          key={city.id}
          style={[
            styles.cityItem,
            selectedCity?.id === city.id && styles.selectedCityItem
          ]}
          onPress={() => handleCityPress(city)}
        >
          <View style={styles.cityNameContainer}>
            <Text style={[
              styles.cityName,
              selectedCity?.id === city.id && styles.selectedCityName
            ]}>
              {city.name}
            </Text>
            <Text style={styles.cityAddress}>{city.address}</Text>
          </View>
          <ChevronRight size={16} color="#999" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft color="#333" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EV Stations</Text>
        <TouchableOpacity style={styles.filterButton}>
          <SlidersHorizontal color="#333" size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search color="#999" size={20} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for stations..."
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.mainContent}>
        <View style={styles.mapContainer}>
          <MapView
            provider={null}
            style={styles.map}
            initialRegion={{
              latitude: 20.5937,
              longitude: 78.9629,
              latitudeDelta: 25,
              longitudeDelta: 25,
            }}
          >
            <UrlTile
              urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              shouldReplaceMapContent={true}
              maximumZ={19}
            />
            
            {evStations.map((station) => (
              <Marker
                key={station.id}
                coordinate={{
                  latitude: station.latitude,
                  longitude: station.longitude,
                }}
                title={station.name}
                description={station.address}
                pinColor={getMarkerColor(station)}
              />
            ))}
          </MapView>

          <View style={styles.legend}>
            {regions.map((region, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: region.color }]} />
                <Text style={styles.legendText}>{region.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <CityList />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: moderateScale(15), paddingVertical: verticalScale(12), borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  backButton: { padding: 5 },
  headerTitle: { fontSize: textScale(18), fontFamily: FONTS.MetropolicBold, color: '#333' },
  filterButton: { padding: 5 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', marginHorizontal: moderateScale(15), marginTop: verticalScale(10), marginBottom: verticalScale(10), paddingHorizontal: moderateScale(15), borderRadius: 12, height: 45 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: textScale(14), fontFamily: FONTS.MetropolicRegular, color: '#333' },
  mainContent: { flex: 1, flexDirection: 'row' },
  mapContainer: { flex: 2, position: 'relative' },
  map: { width: '100%', height: '100%' },
  legend: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(255,255,255,0.95)', padding: 8, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendText: { fontSize: textScale(10), fontFamily: FONTS.MetropolicMedium, color: '#333' },
  cityList: { flex: 1, backgroundColor: '#fff', borderLeftWidth: 1, borderLeftColor: '#f0f0f0' },
  cityListContent: { paddingVertical: 10 },
  cityItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: moderateScale(15), paddingVertical: verticalScale(12), borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  selectedCityItem: { backgroundColor: '#FFF8F0', borderLeftWidth: 3, borderLeftColor: '#FF6B35' },
  cityNameContainer: { flex: 1 },
  cityName: { fontSize: textScale(14), fontFamily: FONTS.MetropolicBold, color: '#333' },
  selectedCityName: { color: '#FF6B35' },
  cityAddress: { fontSize: textScale(11), fontFamily: FONTS.MetropolicRegular, color: '#999', marginTop: 2 },
});

export default MapScreen;