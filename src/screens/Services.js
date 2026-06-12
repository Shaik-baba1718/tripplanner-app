import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { textScale, moderateScale, verticalScale } from '../styles/responsiveSize';
import { FONTS } from '../../global';
import LinearGradient from 'react-native-linear-gradient';
import images from "../assets/index";
import { ArrowRight } from 'lucide-react-native';

const Services = ({ navigation }) => {
  return (

      <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor:"#FFF"}}>
         <View style={{borderWidth:0.5,borderColor:"#bfb2b2",marginTop:30}}/>
           <SafeAreaView style={styles.container}>
        {/* Card 1 - Plan your trip */}
        <View style={[styles.cardWrapper,{marginTop:20}]}>
          <LinearGradient
            colors={['#e0cbe5', '#e4f5fb']}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0.25 }}
            style={styles.cardGradient}
          >
            <TouchableOpacity style={styles.cardContent} activeOpacity={0.9}>
              <View style={styles.leftSection}>
                <View style={styles.alertRow}>
                  <Image source={images.abd} style={styles.alertIcon} />
                  <Text style={styles.alertText}>alert</Text>
                </View>
                <Text style={styles.mainTitle}>Plan your trip</Text>
                <Text style={styles.subTitle}>with ease.</Text>
                <TouchableOpacity 
                  onPress={() => navigation.navigate("Home")} 
                  style={styles.tryNowButton}
                >
                  <Text style={styles.tryNowText}>Try now</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.promoImageWrapper}>
                {/* Egg shape gradients background */}
                <View style={styles.eggShapesContainer}>
                  <LinearGradient
                     colors={['#FFD54F', '#FFE082', '#FFF9C4']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.eggShape, styles.eggShapeLeft]}
                  />
                    <LinearGradient
                     colors={['#4c07fa','#4c07fa']} 
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.eggShape1, styles.eggShapeMiddle]}
                  />
                  <LinearGradient
                     colors={['#16b6f6', '#8BB8D4', '#4499fa']} 
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0.25, y: 0.25 }}
                    style={[styles.eggShape, styles.eggShapeRight]}
                  />
                </View>
                <View style={{flexDirection:"row"}}>
                    <Image source={images.ed} style={styles.promoImage}/>
                    <Image source={images.ed1} style={styles.promoImage1}/>
                </View>
           
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </View>
         <View style={styles.cardWrapper}>
          <LinearGradient
            colors={['#46aecd', '#85b3c4']}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0.25 }}
            style={styles.cardGradient}
          >
            <TouchableOpacity style={styles.cardContent} activeOpacity={0.9}>
              <View style={styles.leftSection}>
                <View style={styles.alertRow1}>
                
                  <Text style={styles.alertText1}>Good Samaritan</Text>
                  <TouchableOpacity  style={{borderBottomLeftRadius:20,borderTopLeftRadius:20,backgroundColor:"#FFF",alignItems:"center",height:verticalScale(40),width:moderateScale(100),left:50,borderWidth:0.7,borderColor:"#fff",justifyContent:"center"}}>
                    <Text style={{color:'#46aecd',fontSize:textScale(12),fontFamily:FONTS.medium,letterSpacing:0.3}}>Free Now</Text>
              
                  </TouchableOpacity>
                </View>
                <Text style={styles.mainTitle1}>Become a hero in others life</Text>
                <Text style={styles.subTitle1}>by helping them.</Text>
                <TouchableOpacity 
                  onPress={() => navigation.navigate("ReportNow")} 
                  style={styles.tryNowButton1}
                >
                  <Text style={styles.tryNowText}>Report Now</Text>
                  <ArrowRight size={16} color={"#ED8701"}/>
                </TouchableOpacity>
              </View>
            
                {/* Egg shape gradients background */}
               
                <View >
                  <Image source={images.ed2} style={{width:moderateScale(100),height:verticalScale(200),top:30}}/>
                   
                </View>
           
           
            </TouchableOpacity>
          </LinearGradient>
        </View>
       </SafeAreaView>
      </ScrollView>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cardWrapper: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#7cc5e2',
    backgroundColor: '#fff',
    overflow: 'hidden',
    height:verticalScale(180),
    zIndex:1
  },
  
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  leftSection: {
    flex: 1,
    paddingRight: 12,
    zIndex:1
  },
  alertRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginBottom: 8,
  },
   alertRow1: {
    flexDirection: "row",
    justifyContent:"space-between",
    alignItems: "center",
 
  },
  alertIcon: {
    width: moderateScale(25),
    height: verticalScale(25),
    borderRadius: 100,
  },
  alertText: {
    fontSize: textScale(12),
    color: "#333",
    fontFamily: FONTS.MontBold,
  },
  alertText1: {
    fontSize: textScale(20),
    color: "#fff",
    fontFamily: FONTS.bold,
  },
  mainTitle: {
    fontSize: textScale(22),
    color: "#994c4c",
    fontFamily: FONTS.Interbold,
  },
   mainTitle1: {
    fontSize: textScale(12),
    color: "#fff",
    fontFamily: FONTS.InterRegular,
    lineHeight:10,
   },
  subTitle: {
    fontSize: textScale(22),
    color: "#994c4c",
    fontFamily: FONTS.Interbold,
      marginTop: -10,
  },
  subTitle1: {
    fontSize: textScale(12),
    color: "#fff",
    fontFamily: FONTS.InterRegular,
   
  },
  tryNowButton: {
    width: moderateScale(90),
    height: verticalScale(40),
    borderWidth: 0.5,
    borderColor: "#ED8701",
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(12),
  },
    tryNowButton1: {
    width: moderateScale(115),
    height: verticalScale(40),
    padding:8,
    marginTop:10,
    backgroundColor: "#fff",
    borderRadius: 20,
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center"
  },

  tryNowText: {
    fontSize: textScale(12),
    color: "#ED8701",
    fontFamily: FONTS.MontBold,
  },
  promoImageWrapper: {
    position: 'relative',
    width: moderateScale(110),
    height: verticalScale(140),
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  eggShapesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  eggShape: {
    position: 'absolute',
    width: moderateScale(80),
    height: verticalScale(120),
    borderRadius: 50,
    opacity: 0.5,
  },
   eggShape1: {
  
    width: moderateScale(80),
    height: verticalScale(80),
    borderRadius: 100,
    opacity: 0.5,
  },
  eggShapeLeft: {
    left: -30,
   
    transform: [{ rotate: '20deg' }],
  },
  eggShapeRight: {
    right: -7,
    bottom: -18,
    transform: [{ rotate: '20deg' }],
  },
  eggShapeMiddle: {
    right: 30,
    bottom: -18,
    top:50,
    transform: [{ rotate: '20deg' }],
  },
  promoImage: {
    width: moderateScale(100),
    height: verticalScale(200),
    borderRadius: 20,
    top:30,
    left:-40,
   
  },
   promoImage1: {
    width: moderateScale(100),
    height: verticalScale(200),
    borderRadius: 20,
    top:30,
    left:-40,
   
  },
});

export default Services;