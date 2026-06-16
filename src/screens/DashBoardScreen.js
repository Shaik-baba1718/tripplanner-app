// src/screens/DashboardScreen.js

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  ImageBackground, Modal
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Wallet, MapPin, Bell, ArrowRight, ChevronRight } from 'lucide-react-native';
import { moderateScale, verticalScale, textScale, moderateScaleVertical } from '../styles/responsiveSize';
import { FONTS } from '../../global';
import images from "../assets/index"

const { width: screenWidth } = Dimensions.get('window');

const DashBoard = ({ navigation }) => {
  const flatListRef1 = useRef(null);
  const flatListRef2 = useRef(null);
  const [currentIndex1, setCurrentIndex1] = useState(0);
  const [currentIndex2, setCurrentIndex2] = useState(0);
  const autoScrollRef1 = useRef(true);
  const autoScrollRef2 = useRef(true);
  const intervalRef1 = useRef(null);
  const intervalRef2 = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const sections = [
    { id: '1', type: 'type1' },
    { id: '2', type: 'type2' },
  ];

  const sections1 = [
    { id: '1', type: 'type3' },
    { id: '2', type: 'type4' },
    { id: '3', type: 'type5' },
  ];

  const places = {
    CHARMINAR_HYD: {
      id: 1,
      name: 'Charminar',
      city: 'Hyderabad',
      state: 'Telangana',
      rating: 4.7,
      image: images.Ab
    },
    GOLCONDA_HYD: {
      id: 2,
      name: 'Golconda Fort',
      city: 'Hyderabad',
      state: 'Telangana',
      rating: 4.6,
      image: images.Ab1
    },
    GATEWAY_MUM: {
      id: 3,
      name: 'Gateway of India',
      city: 'Mumbai',
      state: 'Maharashtra',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da'
    },
    MARINE_MUM: {
      id: 4,
      name: 'Marine Drive',
      city: 'Mumbai',
      state: 'Maharashtra',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445'
    },
    BAGA_GOA: {
      id: 5,
      name: 'Baga Beach',
      city: 'Goa',
      state: 'Goa',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206'
    },
    MYSORE_PALACE_KAR: {
      id: 6,
      name: 'Mysore Palace',
      city: 'Mysuru',
      state: 'Karnataka',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7'
    },
    OOTY_LAKE_TN: {
      id: 7,
      name: 'Ooty Lake',
      city: 'Ooty',
      state: 'Tamil Nadu',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'
    },
    MUNNAR_KER: {
      id: 8,
      name: 'Munnar Hills',
      city: 'Munnar',
      state: 'Kerala',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee'
    },
    INDIA_GATE_DEL: {
      id: 9,
      name: 'India Gate',
      city: 'New Delhi',
      state: 'Delhi',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5'
    },
    DAL_LAKE_JK: {
      id: 10,
      name: 'Dal Lake',
      city: 'Srinagar',
      state: 'Jammu and Kashmir',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963'
    }
  };
  const placesArray = Object.values(places);

  // Auto scroll for first sections
  useEffect(() => {
    if (intervalRef1.current) {
      clearInterval(intervalRef1.current);
    }

    if (autoScrollRef1.current && sections.length > 0) {
      intervalRef1.current = setInterval(() => {
        if (flatListRef1.current && autoScrollRef1.current) {
          let nextIndex = currentIndex1 + 1;
          if (nextIndex >= sections.length) {
            nextIndex = 0;
          }
          flatListRef1.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
          setCurrentIndex1(nextIndex);
        }
      }, 3000);
    }

    return () => {
      if (intervalRef1.current) {
        clearInterval(intervalRef1.current);
      }
    };
  }, [currentIndex1, sections.length]);

  // Auto scroll for second sections
  useEffect(() => {
    if (intervalRef2.current) {
      clearInterval(intervalRef2.current);
    }

    if (autoScrollRef2.current && sections1.length > 0) {
      intervalRef2.current = setInterval(() => {
        if (flatListRef2.current && autoScrollRef2.current) {
          let nextIndex = currentIndex2 + 1;
          if (nextIndex >= sections1.length) {
            nextIndex = 0;
          }
          flatListRef2.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
          setCurrentIndex2(nextIndex);
        }
      }, 3000);
    }

    return () => {
      if (intervalRef2.current) {
        clearInterval(intervalRef2.current);
      }
    };
  }, [currentIndex2, sections1.length]);

  // Memoized render functions to prevent unnecessary re-renders
  const renderSection1 = useCallback(({ item }) => (
    <TouchableOpacity style={styles.section} onPress={() => navigation.navigate("Trips")}>
      <ImageBackground
        source={images.ed6}
        style={styles.planContainer}
        imageStyle={{ borderRadius: 12 }}
      >
        <Text style={styles.planTitle}>Plan smart.</Text>
        <Text style={styles.planTitle}>Travel better.</Text>
        <View style={styles.planSubtitleContainer}>
          <Text style={styles.planSubtitle}>Plan your first trip with ease</Text>
          <Text style={styles.planSubtitle}>just great experiences!</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  ), [navigation]);

  const renderSection2 = useCallback(({ item }) => (
    <View style={styles.section}>
      <View style={{ backgroundColor: "#0648ac", height: verticalScale(150), width: "100%", borderRadius: 20, flexDirection: "row", overflow: "hidden" }}>
        <View style={{ padding: 8, zIndex: 1 }}>
          <Text style={{ fontSize: textScale(18), fontFamily: FONTS.Interbold, color: "#FFF" }}>Tez Pass</Text>
          <Text style={{ fontSize: textScale(14), fontFamily: FONTS.MontBold, color: "#FFF", marginTop: 5 }}>One pass.Multiple</Text>
          <Text style={{ fontSize: textScale(14), fontFamily: FONTS.MontBold, color: "#FFF", marginBottom: 5 }}>EV Networks.Real sa..</Text>
          <TouchableOpacity style={{ width: moderateScale(100), padding: 8, alignItems: "center", justifyContent: "center", backgroundColor: "#fff", borderRadius: 20, flexDirection: "row" }}>
            <Text style={{ fontSize: textScale(10), fontFamily: FONTS.InterMedium, color: "#394895" }}>Buy Now</Text>
            <ChevronRight size={14} color="#394895" />
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: "#0f66e9", height: verticalScale(190), width: moderateScale(190), borderRadius: 100, alignItems: "center", justifyContent: "center", right: 22, top: -30 }}>
          <Image source={images.ed3} style={{ width: moderateScale(100), height: verticalScale(100) }} />
        </View>
      </View>
    </View>
  ), []);

  const renderSection3 = useCallback(({ item }) => (
    <TouchableOpacity style={styles.section1} onPress={() => navigation.navigate("Trips")}>
      <LinearGradient
        colors={['#FFEDD5', '#FFFFFF']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={{ flex: 1, borderRadius: 20, padding: 20 }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <View style={{ flexDirection: "row", gap: 1, alignItems: "center" }}>
              <View style={{ backgroundColor: "orange", alignItems: "center", justifyContent: "center", width: moderateScale(30), height: verticalScale(30), borderRadius: 100 }}>
                <Image source={images.ed14} style={{ width: moderateScale(25), height: verticalScale(25) }} />
              </View>
              <Text style={{ fontSize: textScale(20), fontFamily: FONTS.sfprobold, color: "#000" }}>alert</Text>
            </View>
            <View style={{ marginTop: 8 }}>
              <Text style={{ fontSize: textScale(22), fontFamily: FONTS.sfprobold, color: "brown" }}>Travel Smarter.</Text>
              <Text style={{ fontSize: textScale(22), fontFamily: FONTS.sfprobold, color: "brown", top: -11 }}>Live Better.</Text>
            </View>
            <TouchableOpacity style={{ width: moderateScale(100), padding: 8, alignItems: "center", backgroundColor: "#fff", borderRadius: 10 }} onPress={() => navigation.navigate("Wallet")}>
              <Text style={{ fontFamily: FONTS.InterSemiBold, fontSize: textScale(12), color: "#000" }}>Apply Now</Text>
            </TouchableOpacity>
          </View>
          <Image style={{ width: moderateScale(180), height: verticalScale(150), top: 10 }} source={images.ed9} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  ), [navigation]);

  const renderSection4 = useCallback(({ item }) => (
    <View style={styles.section}>
      <View style={{ backgroundColor: "#0648ac", height: verticalScale(150), width: "100%", borderRadius: 20, flexDirection: "row", overflow: "hidden" }}>
        <View style={{ padding: 8, zIndex: 1 }}>
          <Text style={{ fontSize: textScale(18), fontFamily: FONTS.Interbold, color: "#FFF" }}>Tez Pass</Text>
          <Text style={{ fontSize: textScale(14), fontFamily: FONTS.MontBold, color: "#FFF", marginTop: 5 }}>One pass.Multiple</Text>
          <Text style={{ fontSize: textScale(14), fontFamily: FONTS.MontBold, color: "#FFF", marginBottom: 5 }}>EV Networks.Real sa..</Text>
          <TouchableOpacity style={{ width: moderateScale(100), padding: 8, alignItems: "center", justifyContent: "center", backgroundColor: "#fff", borderRadius: 20, flexDirection: "row" }}>
            <Text style={{ fontSize: textScale(10), fontFamily: FONTS.InterMedium, color: "#394895" }}>Buy Now</Text>
            <ChevronRight size={14} color="#394895" />
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: "#0f66e9", height: verticalScale(190), width: moderateScale(190), borderRadius: 100, alignItems: "center", justifyContent: "center", right: 22, top: -30 }}>
          <Image source={images.ed3} style={{ width: moderateScale(100), height: verticalScale(100) }} />
        </View>
      </View>
    </View>
  ), []);

  const renderSection5 = useCallback(({ item }) => (
    <View style={styles.section}>
      <View style={{ backgroundColor: "#0648ac", height: verticalScale(150), width: "100%", borderRadius: 20, flexDirection: "row", overflow: "hidden" }}>
        <View style={{ padding: 8, zIndex: 1 }}>
          <Text style={{ fontSize: textScale(18), fontFamily: FONTS.Interbold, color: "#FFF" }}>Tez Pass</Text>
          <Text style={{ fontSize: textScale(14), fontFamily: FONTS.MontBold, color: "#FFF", marginTop: 5 }}>One pass.Multiple</Text>
          <Text style={{ fontSize: textScale(14), fontFamily: FONTS.MontBold, color: "#FFF", marginBottom: 5 }}>EV Networks.Real sa..</Text>
          <TouchableOpacity style={{ width: moderateScale(100), padding: 8, alignItems: "center", justifyContent: "center", backgroundColor: "#fff", borderRadius: 20, flexDirection: "row" }}>
            <Text style={{ fontSize: textScale(10), fontFamily: FONTS.InterMedium, color: "#394895" }}>Buy Now</Text>
            <ChevronRight size={14} color="#394895" />
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: "#0f66e9", height: verticalScale(190), width: moderateScale(190), borderRadius: 100, alignItems: "center", justifyContent: "center", right: 22, top: -30 }}>
          <Image source={images.ed3} style={{ width: moderateScale(100), height: verticalScale(100) }} />
        </View>
      </View>
    </View>
  ), []);

  const renderSection = useCallback(({ item }) => {
    if (item.type === 'type1') {
      return renderSection1({ item });
    } else {
      return renderSection2({ item });
    }
  }, [renderSection1, renderSection2]);

  const renderSections = useCallback(({ item }) => {
    if (item.type === 'type3') {
      return renderSection3({ item });
    } else if (item.type === 'type4') {
      return renderSection4({ item });
    } else {
      return renderSection5({ item });
    }
  }, [renderSection3, renderSection4, renderSection5]);

  const onScrollEnd1 = useCallback((event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    if (index < sections.length && index >= 0) {
      setCurrentIndex1(index);
      autoScrollRef1.current = true;
    }
  }, [sections.length]);

  const onScrollEnd2 = useCallback((event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    if (index < sections1.length && index >= 0) {
      setCurrentIndex2(index);
      autoScrollRef2.current = true;
    }
  }, [sections1.length]);

  const onScrollBegin1 = useCallback(() => {
    autoScrollRef1.current = false;
  }, []);

  const onScrollBegin2 = useCallback(() => {
    autoScrollRef2.current = false;
  }, []);

  const keyExtractor1 = useCallback((item) => item.id, []);
  const keyExtractor2 = useCallback((item) => item.id, []);

  // Memoized pagination dots
  const PaginationDots1 = useCallback(() => (
    <View style={styles.paginationContainer}>
      {sections.map((_, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            if (flatListRef1.current) {
              autoScrollRef1.current = false;
              flatListRef1.current.scrollToIndex({ index, animated: true });
              setCurrentIndex1(index);
              setTimeout(() => {
                autoScrollRef1.current = true;
              }, 5000);
            }
          }}
        >
          <View
            style={[
              styles.paginationDot,
              currentIndex1 === index && styles.paginationDotActive,
            ]}
          />
        </TouchableOpacity>
      ))}
    </View>
  ), [currentIndex1, sections]);

  // Add this useEffect after your other useEffects
  useEffect(() => {
    // Show modal when screen opens (after 1 second)
    const timer = setTimeout(() => {
      setModalVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {!selectedPlace ? (
        // MAIN DASHBOARD VIEW (when no place is selected)
        <>
          <LinearGradient
            colors={['#ED8701', '#FF6B00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.welcomeText}>Welcome Shaik</Text>
                <View style={styles.locationContainer}>
                  <MapPin size={14} color="#FFFFFF" />
                  <Text style={styles.location}>Kamareddy, Telangana</Text>
                </View>
              </View>
              <View style={styles.rightSection}>
                <View style={styles.statsRow}>
                  <Wallet size={16} color="#b6afaf" />
                  <Text style={styles.statValue}>₹0.0</Text>
                </View>
                <View style={styles.statRow1}>
                  <Bell color={"#e07e0e"} size={14} />
                </View>
              </View>
            </View>
          </LinearGradient>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {/* First Sections with Pager Effect */}
            <View style={styles.sliderContainer}>
              <FlatList
                ref={flatListRef1}
                data={sections}
                renderItem={renderSection}
                keyExtractor={keyExtractor1}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={onScrollEnd1}
                onScrollBeginDrag={onScrollBegin1}
                getItemLayout={(data, index) => ({
                  length: screenWidth,
                  offset: screenWidth * index,
                  index,
                })}
                windowSize={2}
                maxToRenderPerBatch={2}
                removeClippedSubviews={true}
                initialNumToRender={2}
              />
              <PaginationDots1 />
            </View>

            {/* Other content */}
            <View style={{ padding: 10, flexDirection: "row", justifyContent: "space-between", gap: 4 }}>
              <View style={{ gap: 10, flex: 1 }}>
                <LinearGradient
                  colors={['#FFFFFF', '#FFEDD5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={{ borderWidth: 0.6, borderColor: "orange", height: verticalScale(160), borderRadius: 20 }}
                >
                  <View style={{ alignItems: "center" }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Image source={images.ed7} style={{ width: moderateScale(50), height: verticalScale(50), resizeMode: "contain" }} />
                      <View style={{ flexDirection: "row", left: -15 }}>
                        <Text style={{ fontSize: textScale(20), fontFamily: FONTS.Interbold, color: "#152acc" }}>Tez</Text>
                        <Text style={{ fontSize: textScale(20), fontFamily: FONTS.Interbold, color: "#595b68" }}>Pass</Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: textScale(12), fontFamily: FONTS.Interbold, color: "#000", marginTop: -10 }}>Avbl.Points: 0.00</Text>
                    <Image source={images.ed8} style={{ width: moderateScale(200), height: verticalScale(100), resizeMode: "contain", top: -10 }} />
                  </View>
                </LinearGradient>

                <LinearGradient
                  colors={['#FFEDD5', '#FFE4B5', '#FFD699']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={{ borderWidth: 0.6, borderColor: "orange", height: verticalScale(150), borderRadius: 20, overflow: "hidden" }}
                >
                  <TouchableOpacity style={{ padding: 10, alignItems: "center" }} onPress={() => navigation.navigate("Trips")}>
                    <Text style={{ fontSize: textScale(18), fontFamily: FONTS.Interbold, color: "#000" }}>Plan your Trip</Text>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={{ fontSize: textScale(14), fontFamily: FONTS.Interbold, color: "#da4a4a" }}>EffortLess</Text>
                      <Text style={{ fontSize: textScale(14), fontFamily: FONTS.Interbold, color: "#ED8701" }}> Travel</Text>
                    </View>
                    <Image source={images.ed} style={{ width: moderateScale(80), height: verticalScale(80) }} />
                  </TouchableOpacity>
                </LinearGradient>
              </View>

              <View style={{ gap: 10, width: "50%" }}>
                <LinearGradient
                  colors={['#FFFFFF', '#FFF5E8', '#FFEDD5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={{ width: "100%", height: verticalScale(70), borderWidth: 0.6, borderColor: "orange", borderRadius: 20, overflow: "hidden" }}
                >
                  <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }} onPress={() => navigation.navigate("Wallet")}>
                    <Image source={images.ed9} style={{ width: moderateScale(100), height: verticalScale(70), resizeMode: "contain", top: 10 }} />
                    <View style={{ left: -30 }}>
                      <Text style={{ fontSize: textScale(14), fontFamily: FONTS.Interbold, color: "#000" }}>GET YOUR</Text>
                      <Text style={{ fontSize: textScale(10), fontFamily: FONTS.Interbold, color: "#ED8701" }}>PREPAID CARD</Text>
                    </View>
                  </TouchableOpacity>
                </LinearGradient>

                <LinearGradient
                  colors={['#FFFFFF', '#FFF5E8', '#FFEDD5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={{ width: "100%", height: verticalScale(100), borderWidth: 0.6, borderColor: "orange", borderRadius: 20, overflow: "hidden" }}
                >
                  <TouchableOpacity style={{ padding: 8 }} onPress={() => navigation.navigate("PayBills")}>
                    <Text style={{ fontSize: textScale(14), fontFamily: FONTS.Interbold, color: "#000" }}>BILL PAY</Text>
                    <View style={{ flexDirection: "row", gap: 6 }}>
                      <Text style={{ fontSize: textScale(10), fontFamily: FONTS.Interbold, color: "#ED8701" }}>PAY BILLS.</Text>
                      <Text style={{ fontSize: textScale(10), fontFamily: FONTS.Interbold, color: "#d79238" }}>EARN TIME</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", top: -10 }}>
                      <View>
                        <Text style={{ fontSize: textScale(10), fontFamily: FONTS.InterSemiBold, color: "#ED8701" }}>Bharat</Text>
                        <Text style={{ fontSize: textScale(10), fontFamily: FONTS.InterSemiBold, color: "#ED8701", top: -7 }}>Connect</Text>
                      </View>
                      <Image source={images.ed10} style={{ width: moderateScale(80), height: verticalScale(80), resizeMode: "contain", marginLeft: 55 }} />
                    </View>
                  </TouchableOpacity>
                </LinearGradient>

                <LinearGradient
                  colors={['#FFFFFF', '#FFF9F0', '#FFEDD5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={{ width: "100%", height: verticalScale(128), borderWidth: 0.6, borderColor: "orange", borderRadius: 20, overflow: "hidden" }}
                >
                  <TouchableOpacity style={{ padding: 5 }} onPress={() => navigation.navigate("ReportNow")}>
                    <View>
                      <Text style={{ fontSize: textScale(14), fontFamily: FONTS.Interbold, color: "#000" }}>GOOD SAMARITAN</Text>
                      <Text style={{ fontSize: textScale(14), fontFamily: FONTS.Interbold, color: "#ED8701" }}>BE A NEW HERO</Text>
                    </View>
                    <Image source={images.ed11} style={{ width: moderateScale(100), height: verticalScale(140), top: -30, left: 50 }} />
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>

            <View style={{ paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: textScale(14), fontFamily: FONTS.semiBold, color: "#333", letterSpacing: 2 }}>Explore</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Services")}>
                <Text style={{ fontSize: textScale(14), fontFamily: FONTS.semiBold, color: "#333" }}>See all</Text>
              </TouchableOpacity>
            </View>

            {/* Second Sections with Pager Effect */}
            <View style={styles.sliderContainer}>
              <FlatList
                ref={flatListRef2}
                data={sections1}
                renderItem={renderSections}
                keyExtractor={keyExtractor2}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={onScrollEnd2}
                onScrollBeginDrag={onScrollBegin2}
                style={{ top: moderateScale(-10) }}
              />
            </View>

            {/* Popular Destinations */}
            <View style={{ paddingHorizontal: 10, marginTop: moderateScale(-10) }}>
              <Text style={{ fontSize: textScale(18), fontFamily: FONTS.Interbold, color: "#333", marginVertical: 10 }}>Popular Destinations</Text>
              <FlatList
                data={placesArray}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      margin: moderateScale(10),
                      gap: moderateScale(10),
                      borderRadius: 10,
                    }}
                    onPress={() => setSelectedPlace(item)}
                  >
                    <View style={{ width: moderateScale(150), height: verticalScale(200), borderRadius: 20, overflow: 'hidden' }}>
                      <ImageBackground
                        source={item.image}
                        style={{ flex: 1 }}
                      >
                        <Text style={{ fontSize: textScale(18), fontFamily: FONTS.Interbold, color: "#fff", top: moderateScale(80), textAlign: "center" }}>{item.name}</Text>
                      </ImageBackground>
                    </View>
                    <View style={{ alignSelf: "center" }}>
                      <Text style={{ fontSize: textScale(12), fontFamily: FONTS.MetropolicMedium, color: '#666' }}>{item.city}, {item.state}</Text>
                      <Text style={{ fontSize: textScale(14), fontFamily: FONTS.MontBold, color: '#ED8701' }}>⭐ {item.rating}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>

            <View style={{ padding: 15, top: 29 }}>
              <View style={{ top: -30 }}>
                <Text style={{ fontSize: 50, fontFamily: FONTS.sfprobold, color: "rgba(52, 22, 73, 0.21)" }}>Truly </Text>
                <Text style={{ fontSize: 50, fontFamily: FONTS.sfprobold, color: "rgba(52, 22, 73, 0.21)", top: -15 }}>Indian App!</Text>
                <Text style={{ fontSize: 14, fontFamily: FONTS.sfproMedium, color: "rgba(52, 22, 73, 1)" }}>Crafted with ❤️ in Hyderabad, India</Text>
              </View>

              <View style={{ flexDirection: "row", gap: 10, left: 15 }}>
                <Image source={images.ed17} />
                <Image source={images.ed18} style={{ width: moderateScale(50), height: verticalScale(40) }} />
                <Image source={images.ed18} style={{ width: moderateScale(40), height: verticalScale(40), left: 30 }} />
              </View>
              <Image source={images.ed19} style={{ left: -13, top: -15 }} />
            </View>

            {/* Modal Popup */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Tez Pass</Text>
                  <Text style={styles.modalMessage}>starting at 450</Text>
                  <Image source={images.ed13} style={{ width: moderateScale(300), height: verticalScale(300), top: -50 }} />
                  <TouchableOpacity
                    style={[styles.modalButton]}
                    onPress={() => {
                      setModalVisible(false);
                      navigation.navigate("Trips");
                    }}
                  >
                    <Text style={styles.applyModalButtonText}>Buy Now</Text>
                  </TouchableOpacity>
                  <View style={{ flexDirection: "row", gap: 2, top: -80 }}>
                    <Text style={{ fontSize: textScale(12), fontFamily: FONTS.InterRegular, color: "#fff" }}>Redeem at</Text>
                    <Text style={{ fontSize: textScale(12), fontFamily: FONTS.Interbold, color: "#fff" }}>10+ </Text>
                    <Text style={{ fontSize: textScale(12), fontFamily: FONTS.InterRegular, color: "#fff" }}>Brands</Text>
                  </View>
                </View>
              </View>
            </Modal>
          </ScrollView>
        </>
      ) : (
        // SELECTED PLACE DETAIL VIEW
        <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
          <TouchableOpacity onPress={() => setSelectedPlace(null)} style={{ marginBottom: 20 }}>

          </TouchableOpacity>
          <View style={{ 
            backgroundColor: '#FFF', 
            borderRadius: 20, 
            padding: 20,
            borderWidth: 1,
            borderColor: '#ED8701'
          }}>
            <Image
              source={selectedPlace.image}
              style={{ width: '100%', height: 200, borderRadius: 15 }}
            />
            <Text style={{ fontSize: textScale(24), fontFamily: FONTS.Interbold, marginTop: 15, color: '#333' }}>{selectedPlace.name}</Text>
            <Text style={{ fontSize: textScale(16), fontFamily: FONTS.MetropolicMedium, color: '#666' }}>{selectedPlace.city}, {selectedPlace.state}</Text>
            <Text style={{ fontSize: textScale(18), fontFamily: FONTS.MontBold, color: '#ED8701', marginTop: 5 }}>⭐ {selectedPlace.rating}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  welcomeText: {
    fontSize: textScale(14),
    color: '#FFFFFF',
    fontFamily: FONTS.MetropolicSemibold,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  location: {
    fontSize: textScale(12),
    color: '#FFFFFF',
    fontFamily: FONTS.MetropolicMedium,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: "#FFF",
    gap: 4,
    borderRadius: 15,
    width: moderateScale(80),
    height: verticalScale(40),
  },
  statRow1: {
    width: moderateScale(40),
    height: verticalScale(40),
    borderRadius: 100,
    backgroundColor: "#f09d7c",
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: textScale(12),
    fontFamily: FONTS.MetropolicBold,
    color: '#131212',
  },
  sliderContainer: {
    marginTop: 10,
  },
  section: {
    width: screenWidth,
    padding: 15,
  },
  section1: {
    width: screenWidth,
    padding: 15,
  },
  planContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    width: "100%",
    height: verticalScale(150),
    borderRadius: 20,
  },
  planTitle: {
    fontSize: textScale(18),
    color: '#ED8701',
    fontFamily: FONTS.MetropolicBold,
  },
  planSubtitleContainer: {
    marginTop: 10,
  },
  planSubtitle: {
    fontSize: textScale(12),
    color: '#000',
    fontFamily: FONTS.MetropolicMedium,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    gap: 4,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
  },
  paginationDotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ED8701',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end"
  },
  modalContainer: {
    height: verticalScale(600),
    backgroundColor: '#146ce9',
    borderRadius: 20,
    padding: 20,
    alignItems: "center"
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 15,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#999',
    fontWeight: 'bold',
  },
  modalImage: {
    width: 100,
    height: 100,
    marginTop: 20,
    marginBottom: 15,
    borderRadius: 50,
  },
  modalTitle: {
    fontSize: textScale(30),
    fontFamily: FONTS.bold,
    color: '#fff',
    letterSpacing: 0.2,
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: textScale(20),
    fontFamily: FONTS.MetropolicBold,
    color: '#1beeab',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  modalButton: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: moderateScale(200),
    backgroundColor: "#fff",
    top: moderateScaleVertical(-110)
  },
  applyModalButtonText: {
    fontSize: textScale(14),
    fontFamily: FONTS.MetropolicBold,
    color: '#333',
  },
});

export default DashBoard;