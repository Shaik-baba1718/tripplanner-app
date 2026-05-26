import {Dimensions, Platform, StatusBar} from 'react-native';
import DeviceInfo from 'react-native-device-info';
const {width, height} = Dimensions.get('window');

export const getOrientation = () => {
  const {width, height} = Dimensions.get('window');
  return width > height ? 'landscape' : 'portrait';
};
export let isPhoneLandscape = width < height ? false : true;
export let isAndroid = Platform.OS === 'android' ? true : false;

export let isModernAndroid = isAndroid && Platform.Version >= 35;

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;
export let isTabletDevice =
  DeviceInfo.getDeviceType() == 'Handset' ? false : true;
const scale = size => (width / guidelineBaseWidth) * size;
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;
const moderateScaleVertical = (size, factor = 0.5) =>
  size + (verticalScale(size) - size) * factor;
const textScale = percent => {
  const screenHeight = Dimensions.get('window').height;
  //calculate absolute ratio for bigger screens 18.5:9 requiring smaller scaling
  const ratio =
    Dimensions.get('window').height / Dimensions.get('window').width;
  //Guideline sizes are based on standard ~5″ screen mobile device
  const deviceHeight = 375
    ? screenHeight * (ratio > 1.8 ? 0.126 : 0.15) //Set guideline depending on absolute ratio
    : Platform.OS === 'android'
    ? screenHeight - StatusBar.currentHeight
    : screenHeight;

  const heightPercent = (percent * deviceHeight) / 100;
  return Math.round(heightPercent);
};

export {
  scale,
  verticalScale,
  textScale,
  moderateScale,
  moderateScaleVertical,
  width,
  height,
};