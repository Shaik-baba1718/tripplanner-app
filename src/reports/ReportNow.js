import React,{ useState,useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
 
  Image,
  TextInput,Platform
} from 'react-native';
import { ArrowLeft, QrCode, Plus, Car, User, Users, Gift, ShoppingBag, MessageCircle, MapPin, RefreshCw,Camera as CameraIcon,Zap, Landmark } from 'lucide-react-native';
import { textScale, moderateScale, verticalScale } from '../styles/responsiveSize';
import { FONTS } from '../../global';
import images from "../assets/index";
import { Camera } from 'react-native-camera-kit';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { launchImageLibrary } from 'react-native-image-picker';
const ReportNow = ({ navigation }) => {
  const [showScanner, setShowScanner] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [showScanUI, setShowScanUI] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [cameraType, setCameraType] = useState('back'); // 'back' or 'front'
  const [galleryImage, setGalleryImage] = useState(null);
  const [isGalleryMode, setIsGalleryMode] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const handleScanner = () => {
    setShowScanner(true);
  };
  
  const handleScanneri = () => {
    setShowScanUI(true);
  };

  const toggleCamera = () => {
    setCameraType(prev => prev === 'back' ? 'front' : 'back');
  };
  const toggleFlashLight = () => {
  setIsTorchOn(prev => !prev);
};
const toggleGallery = () => {
  launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
    if (response.assets && response.assets[0]) {
      setGalleryImage(response.assets[0].uri);
      setIsGalleryMode(true);
    }
  });
};

  useEffect(() => {
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const result = await request(PERMISSIONS.ANDROID.CAMERA);
      setHasCameraPermission(result === RESULTS.GRANTED);
    } else {
      const result = await request(PERMISSIONS.IOS.CAMERA);
      setHasCameraPermission(result === RESULTS.GRANTED);
    }
  };
  requestCameraPermission();
}, []);

  const menuItems = [
    { id: 1, title: 'Refer & Earn', icon: <Gift color="#ED8701" size={22} /> },
    { id: 2, title: 'Buy Kit', icon: <ShoppingBag color="#ED8701" size={22} /> },
    { id: 3, title: 'Chats', icon: <MessageCircle color="#ED8701" size={22} /> },
    { id: 4, title: 'Find nearest kiosk', icon: <MapPin color="#ED8701" size={22} /> },
  ];

  return (
    <View style={styles.container}>
      {/* New UI when showScanUI is true */}
      {showScanUI ? (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          {/* Header with Back Button */}
          <View style={{ flexDirection: 'row', alignItems: 'center',gap:5, padding: 16, borderBottomWidth: 0.5, borderBottomColor: '#E5E5E5', marginTop: 20 }}>
            <TouchableOpacity onPress={() => setShowScanUI(false)}>
              <ArrowLeft color="#333" size={20} />
            </TouchableOpacity>
            <Text style={{ fontSize: textScale(14), fontFamily: FONTS.InterSemiBold, color: '#333' }}>Report Now</Text>
          
          </View>

          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text style={{ fontSize: textScale(16), fontFamily: FONTS.Interbold, color: '#000' }}>
              Scan Vehicle Number
            </Text>
            <Text style={{ fontSize: textScale(14), fontFamily: FONTS.InterSemiBold, color: '#333' }}>
              To Report an issue
            </Text>
           
          </View>

          {/* Scanner Box */}
          <View style={{ marginTop: 30, alignItems: "center" }}>
            <View style={{ 
              height: verticalScale(150), 
              width: moderateScale(150), 
              backgroundColor: '#000', 
              borderRadius: 20, 
              justifyContent: 'center', 
              alignItems: 'center',
              borderWidth: 0.1,
              
              overflow: 'hidden'
            }}>
             {isGalleryMode && galleryImage ? (
  <Image 
    source={{ uri: galleryImage }} 
    style={{ height: '100%', width: '100%' }}
    resizeMode="cover"
  />
) : hasCameraPermission ? (
  <Camera
    style={{ height: '100%', width: '100%' }}
    flashMode="auto"
    focusMode="on"
    zoomMode="on"
    cameraType={cameraType}
    torchMode={isTorchOn ? 'on' : 'off'} 
  />
) : (
  <Image source={images.ed5} style={{ width: moderateScale(80), height: verticalScale(80) }} />
)}
            </View>
          </View>

          {/* Switch Camera Button Below Scanner */}
          <View 
            
            style={{ 
              flexDirection: 'row', 
               
                gap:15,
                marginTop:10,
                alignSelf:"center"
          
            
            }}
          >
            <TouchableOpacity  style={{width:moderateScale(50),height:(50),alignItems:"center",justifyContent:"center",backgroundColor:"#f3f198",borderRadius:100}}   onPress={toggleCamera}>
            <CameraIcon/>
            </TouchableOpacity>
            <TouchableOpacity  style={{width:moderateScale(50),height:(50),alignItems:"center",justifyContent:"center",backgroundColor:"#f3f198",borderRadius:100}}   onPress={toggleFlashLight}>
            <Zap/>
            </TouchableOpacity>
              <TouchableOpacity  style={{width:moderateScale(50),height:(50),alignItems:"center",justifyContent:"center",backgroundColor:"#f3f198",borderRadius:100}}   onPress={toggleGallery}>
            <Landmark/>
            </TouchableOpacity>
            
          </View>

         
        </View>
      ) : !showScanner ? (
        // ORIGINAL UI - Shows when showScanner is false and showScanUI is false
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowLeft color="#333" size={20} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Good Samaritan</Text>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ overflow: "hidden", borderColor: "orange", height: verticalScale(230) }}>
              <View>
                <Image 
                  source={images.ed11} 
                  style={{ width: moderateScale(100), height: verticalScale(100), alignSelf: "center" }} 
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
                  position: "absolute",
                  left: -35,
                  top: 105
                }} 
              /> 
            </View>

            {/* Report Vehicle Section */}
            <View style={{ flexDirection: "row", paddingHorizontal: 10, gap: 5 }}>
              <TouchableOpacity style={styles.sectionCard} onPress={handleScanner}>
                <Text style={styles.sectionTitle}>Report vehicle</Text>
                <Text style={styles.sectionDescription}>Found issue? alert the owner.</Text>
                <Image source={images.ed3} style={{ width: moderateScale(230), height: verticalScale(90), left: -33, top: 12 }} />
              </TouchableOpacity>

              {/* Found Lost One Section */}
              <TouchableOpacity style={styles.sectionCard} onPress={handleScanner}>
                <Text style={styles.sectionTitle}>Found Lost one?</Text>
                <Text style={styles.sectionDescription}>Found lost people – let the guardian know.</Text>
                <Image source={images.ed4} style={{ width: moderateScale(230), height: verticalScale(90), left: -33, top: 12 }} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.qrButton]}  >
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
        </>
      ) : (
        // SCANNER UI ONLY - Shows when showScanner is true
        <View style={{ flex: 1, paddingTop: 30, paddingHorizontal: 15, backgroundColor: '#fff' }}>
          <TouchableOpacity 
            style={{ marginBottom: 20, flexDirection: 'row', alignItems: 'center' }}
            onPress={() => setShowScanner(false)}
          >
            <ArrowLeft color="#333" size={20} />
            <Text style={{ marginLeft: 40, fontSize: textScale(14), color: '#333', fontFamily: FONTS.sfproRegular }}>Back</Text>
          </TouchableOpacity>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: textScale(16), fontFamily: FONTS.sfprobold, marginBottom: 10 }}>Scan Vehicle Number</Text>
            <View style={{ height: verticalScale(200), borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity onPress={handleScanneri}>
                <Image source={images.ed5} style={{ width: moderateScale(80), height: verticalScale(80) }} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: textScale(14), marginBottom: 5, fontFamily: FONTS.MontMedium }}>Vehicle Number</Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: textScale(12) }}
              placeholder="Enter vehicle number or 6 digit Qr code"
              value={vehicleNumber}
              onChangeText={setVehicleNumber}
            />
          </View>

          <TouchableOpacity 
            style={{ backgroundColor: '#ED8701', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 16 }}
          >
            <Text style={{ color: '#fff', fontFamily: FONTS.MontBold, fontSize: textScale(14) }}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}
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
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 0.6,
    borderBottomWidth: 0.6,
    borderColor: '#cec9c9',
    marginTop: 45,
    marginBottom: 10
  },
  headerTitle: {
    fontSize: textScale(14),
    color: '#333',
    fontFamily: FONTS.InterMedium,
  },
  heroTitle: {
    fontSize: textScale(24),
    textAlign: "center",
    color: '#994c4c',
    fontFamily: FONTS.Interbold,
    top: -8
  },
  heroSubtitle: {
    fontSize: textScale(18),
    color: '#994c4c',
    fontFamily: FONTS.MetropolicMedium,
    textAlign: "center",
  },
  tagText: {
    fontSize: textScale(10),
    color: '#000',
    fontFamily: FONTS.MontBold,
    letterSpacing: 1,
    top: -10,
    textAlign: "center",
  },
  sectionCard: {
    backgroundColor: '#FFF',
    flex: 1,
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
    width: '50%',
    overflow: "hidden",
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
    alignItems: "center",
    marginTop: 10,
    padding: 10,
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