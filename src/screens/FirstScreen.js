import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  StatusBar,
  Platform,
} from "react-native";
import { Wallet } from "lucide-react-native";
import { FONTS } from "../../global";
import images from "../assets/index";
import { textScale,moderateScale,verticalScale } from "../styles/responsiveSize";
const { width, height } = Dimensions.get("window");

const First = ({ navigation }) => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
    }
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" hidden={true} />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerText}>My Trips</Text>

        <View style={styles.coinContainer}>
          <Wallet size={15} color="#000" />
          <Text style={styles.coinText}>250</Text>
          <Image source={images.coins} style={styles.coinImage} resizeMode="contain" />
        </View>
      </View>

      {/* BODY */}
      <View style={styles.body}>
        <Image source={images.car} style={styles.carImage} resizeMode="contain" />
        <Text style={styles.title}>Start creating your trip</Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("TripDetailsScreen")}
          style={styles.button}
        >
          <Text style={styles.plus}>+</Text>
          <Text style={styles.buttonText}>New Trip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
   
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    padding:10,
   
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFF",
  },
  headerText: {
    fontSize:textScale(14),
    color: "#111827",
    fontFamily: FONTS.Interbold,
  },
  coinContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding:10,
    borderWidth: 1,
    justifyContent:"space-between",
    gap:5,
    borderColor: "#ECAE56",
    backgroundColor: "#FFF7EC",
    borderRadius: 50,
  },
  coinText: {
    fontSize: textScale(12),
    color: "#313131",
  
    fontFamily: FONTS.sfprobold,
  },
  coinImage: {
    width: moderateScale(15),
    height: verticalScale(15),
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  carImage: {
    width: width * 0.75,
    height: height * 0.25,
  },
  title: {
    marginTop: 10,
    fontSize: textScale(14),
    color: "#111827",
    textAlign: "center",
    fontFamily: FONTS.semiBold,
  },
  button: {
    marginTop: 10,
    width: moderateScale(120),
    height: verticalScale(50),
    borderRadius: 15,
    backgroundColor: "#ED8701",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  plus: {
    fontSize: textScale(20),
    color: "#FFF",
      fontFamily: FONTS.sfprobold,
    marginRight: 6,
  },
  buttonText: {
    fontSize: textScale(14),
    color: "#FFF",
    fontFamily: FONTS.sfprobold,
  },
});

export default First;