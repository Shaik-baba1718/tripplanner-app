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
  ImageBackground
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Wallet, MapPin, Bell, ArrowRight, ChevronRight } from 'lucide-react-native'; 
import { moderateScale, verticalScale, textScale } from '../styles/responsiveSize';
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
  
  const sections = [
    { id: '1', type: 'type1' },
    { id: '2', type: 'type2' },
  ];
  
  const sections1 = [
    { id: '1', type: 'type3' },
    { id: '2', type: 'type4' },
    { id: '3', type: 'type5' },
  ];

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
         return setCurrentIndex1;
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
      <View style={{backgroundColor:"#0648ac",height:verticalScale(150),width:"100%",borderRadius:20,flexDirection:"row",overflow:"hidden"}}>
        <View style={{padding:8, zIndex: 1}}>
          <Text style={{fontSize:textScale(18),fontFamily:FONTS.Interbold,color:"#FFF"}}>Tez Pass</Text>
          <Text style={{fontSize:textScale(14),fontFamily:FONTS.MontBold,color:"#FFF",marginTop:5}}>One pass.Multiple</Text>
          <Text style={{fontSize:textScale(14),fontFamily:FONTS.MontBold,color:"#FFF",marginBottom:5}}>EV Networks.Real sa..</Text>
          <TouchableOpacity style={{width:moderateScale(100),padding:8,alignItems:"center",justifyContent:"center",backgroundColor:"#fff",borderRadius:20,flexDirection:"row"}}>
            <Text style={{fontSize:textScale(10),fontFamily:FONTS.InterMedium,color:"#394895"}}>Buy Now</Text>
            <ChevronRight size={14} color="#394895"/>
          </TouchableOpacity>
        </View>
        <View style={{backgroundColor:"#0f66e9",height:verticalScale(190),width:moderateScale(190),borderRadius:100,alignItems:"center",justifyContent:"center",right:22,top:-30}}>
          <Image source={images.ed3} style={{width:moderateScale(100),height:verticalScale(100)}}/>
        </View>
      </View>
    </View>
  ), []);

  const renderSection3 = useCallback(({ item }) => (
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

  const renderSection4 = useCallback(({ item }) => (
    <View style={styles.section}>
      <View style={{backgroundColor:"#0648ac",height:verticalScale(150),width:"100%",borderRadius:20,flexDirection:"row",overflow:"hidden"}}>
        <View style={{padding:8, zIndex: 1}}>
          <Text style={{fontSize:textScale(18),fontFamily:FONTS.Interbold,color:"#FFF"}}>Tez Pass</Text>
          <Text style={{fontSize:textScale(14),fontFamily:FONTS.MontBold,color:"#FFF",marginTop:5}}>One pass.Multiple</Text>
          <Text style={{fontSize:textScale(14),fontFamily:FONTS.MontBold,color:"#FFF",marginBottom:5}}>EV Networks.Real sa..</Text>
          <TouchableOpacity style={{width:moderateScale(100),padding:8,alignItems:"center",justifyContent:"center",backgroundColor:"#fff",borderRadius:20,flexDirection:"row"}}>
            <Text style={{fontSize:textScale(10),fontFamily:FONTS.InterMedium,color:"#394895"}}>Buy Now</Text>
            <ChevronRight size={14} color="#394895"/>
          </TouchableOpacity>
        </View>
        <View style={{backgroundColor:"#0f66e9",height:verticalScale(190),width:moderateScale(190),borderRadius:100,alignItems:"center",justifyContent:"center",right:22,top:-30}}>
          <Image source={images.ed3} style={{width:moderateScale(100),height:verticalScale(100)}}/>
        </View>
      </View>
    </View>
  ), []);

  const renderSection5 = useCallback(({ item }) => (
    <View style={styles.section}>
      <View style={{backgroundColor:"#0648ac",height:verticalScale(150),width:"100%",borderRadius:20,flexDirection:"row",overflow:"hidden"}}>
        <View style={{padding:8, zIndex: 1}}>
          <Text style={{fontSize:textScale(18),fontFamily:FONTS.Interbold,color:"#FFF"}}>Tez Pass</Text>
          <Text style={{fontSize:textScale(14),fontFamily:FONTS.MontBold,color:"#FFF",marginTop:5}}>One pass.Multiple</Text>
          <Text style={{fontSize:textScale(14),fontFamily:FONTS.MontBold,color:"#FFF",marginBottom:5}}>EV Networks.Real sa..</Text>
          <TouchableOpacity style={{width:moderateScale(100),padding:8,alignItems:"center",justifyContent:"center",backgroundColor:"#fff",borderRadius:20,flexDirection:"row"}}>
            <Text style={{fontSize:textScale(10),fontFamily:FONTS.InterMedium,color:"#394895"}}>Buy Now</Text>
            <ChevronRight size={14} color="#394895"/>
          </TouchableOpacity>
        </View>
        <View style={{backgroundColor:"#0f66e9",height:verticalScale(190),width:moderateScale(190),borderRadius:100,alignItems:"center",justifyContent:"center",right:22,top:-30}}>
          <Image source={images.ed3} style={{width:moderateScale(100),height:verticalScale(100)}}/>
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

  const PaginationDots2 = useCallback(() => (
    <View style={styles.paginationContainer}>
      {sections1.map((_, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            if (flatListRef2.current) {
              autoScrollRef2.current = false;
              flatListRef2.current.scrollToIndex({ index, animated: true });
              setCurrentIndex2(index);
              setTimeout(() => {
                autoScrollRef2.current = true;
              }, 5000);
            }
          }}
        >
          <View
            style={[
              styles.paginationDot,
              currentIndex2 === index && styles.paginationDotActive,
            ]}
          />
        </TouchableOpacity>
      ))}
    </View>
  ), [currentIndex2, sections1]);

  return (
    <View style={styles.container}>
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
              <Bell color={"#e07e0e"} size={14}/>
            </View>
          </View>
        </View>
      </LinearGradient>
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{paddingBottom:40}}
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
          <PaginationDots2 />
        </View>
      </ScrollView>
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
    fontSize: 14,
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
    fontSize: 12,
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
    fontSize: 12,
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
  planContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    width: "100%",
    height: verticalScale(150),
    borderRadius: 20,
  },
  planTitle: {
    fontSize: 18,
    color: '#ED8701',
    fontFamily: FONTS.MetropolicBold,
  },
  planSubtitleContainer: {
    marginTop: 10,
  },
  planSubtitle: {
    fontSize: 12,
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
});

export default DashBoard;