import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { CameraKitCameraScreen } from 'react-native-camera-kit';
import { textScale } from '../styles/responsiveSize';
import { FONTS } from '../../global';

const Report1 = ({ navigation, onScan }) => {
  const [scanned, setScanned] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);

  const onScanCode = (event) => {
    if (!scanned && event.barcodes && event.barcodes.length > 0) {
      setScanned(true);
      onScan(event.barcodes[0].data);
      setTimeout(() => {
        navigation.goBack();
      }, 500);
    }
  };

  const toggleFlash = () => {
    setFlashEnabled(current => !current);
  };

  const openGallery = () => {
    Alert.alert('Gallery', 'Coming soon');
  };

  if (!scanned) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft color="#FFF" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan QR</Text>
        </View>

        <View style={styles.scannerBox}>
          <CameraKitCameraScreen
            style={styles.scannerFrame}
            scanBarcode={true}
            onReadCode={onScanCode}
            showFrame={true}
            laserColor="#ED8701"
            frameColor="#ED8701"
            flashMode={flashEnabled ? 'on' : 'off'}
          />
          <View style={styles.cornerOverlay}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
          </View>
        </View>

        <Text style={styles.scannerText}>Scan the New QR</Text>
        <Text style={styles.scannerSubText}>Align the QR code within the frame</Text>
        <Text style={styles.scannerWarning}>Only for Good Samaritan QR codes; non-partner codes may show an error.</Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionButton} onPress={openGallery}>
            <Text style={styles.optionText}>📷 Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.optionButton, flashEnabled && styles.flashActive]} onPress={toggleFlash}>
            <Text style={styles.optionText}>⚡ Flash</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: textScale(16),
    fontFamily: FONTS.InterMedium,
    color: '#FFF',
    marginLeft: 10,
  },
  scannerBox: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: '100%',
    height: '100%',
  },
  cornerOverlay: {
    position: 'absolute',
    width: 280,
    height: 280,
    alignSelf: 'center',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: -140,
    left: -140,
    width: 50,
    height: 50,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopColor: '#ED8701',
    borderLeftColor: '#ED8701',
  },
  cornerTopRight: {
    position: 'absolute',
    top: -140,
    right: -140,
    width: 50,
    height: 50,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopColor: '#ED8701',
    borderRightColor: '#ED8701',
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: -140,
    left: -140,
    width: 50,
    height: 50,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomColor: '#ED8701',
    borderLeftColor: '#ED8701',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: -140,
    right: -140,
    width: 50,
    height: 50,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomColor: '#ED8701',
    borderRightColor: '#ED8701',
  },
  flashActive: {
    backgroundColor: '#ED8701',
  },
  scannerText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 18,
    fontFamily: FONTS.InterMedium,
    marginBottom: 8,
  },
  scannerSubText: {
    color: '#CCC',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: FONTS.MetropolicRegular,
    marginBottom: 8,
  },
  scannerWarning: {
    color: '#888',
    textAlign: 'center',
    fontSize: 12,
    fontFamily: FONTS.MetropolicRegular,
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 75,
    height: 50,
    borderRadius: 10,
  },
  optionText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: FONTS.MetropolicRegular,
  },
});

export default Report1;