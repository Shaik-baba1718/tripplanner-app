import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FONTS } from '../../global';
import { ArrowLeft } from 'lucide-react-native';
import { moderateScale, verticalScale, textScale } from '../styles/responsiveSize';

const MyPasses = ({ navigation }) => {
  const passes = [
    { 
      id: '1', 
      name: 'TezPass', 
      image: 'https://picsum.photos/id/111/300/200',
      navigateTo: 'TezPassPayment'
    },
    { 
      id: '2', 
      name: 'Plan Your Trip', 
      image: 'https://picsum.photos/id/15/300/200',
      navigateTo: 'Main'
    },
  ];

  const handleBuyNow = (pass) => {
    switch(pass.name) {
      case 'TezPass':
        navigation.navigate('TezPassPayment', { passData: pass });
        break;
      case 'Plan Your Trip':
        navigation.navigate('Main', { passData: pass });
        break;
      default:
        console.log('Unknown pass');
    }
  };

  const getButtonStyle = (item) => {
    switch(item.name) {
      case 'TezPass':
        return [styles.buyNowButton, styles.tezPassButton];
      case 'Plan Your Trip':
        return [styles.buyNowButton, styles.planTripButton];
      default:
        return styles.buyNowButton;
    }
  };

  const renderPass = ({ item }) => {
    const getCardStyle = () => {
      switch(item.name) {
        case 'TezPass':
          return [styles.passCard, styles.tezPassCard];
        case 'Plan Your Trip':
          return [styles.passCard, styles.planTripCard];
        default:
          return styles.passCard;
      }
    };

    const getNameStyle = () => {
      switch(item.name) {
        case 'TezPass':
          return [styles.passName, styles.tezPassName];
        case 'Plan Your Trip':
          return [styles.passName, styles.planTripName];
        default:
          return styles.passName;
      }
    };

    const getDotColor = () => {
      return item.name === 'TezPass' ? '#fff' : '#ED8701';
    };

    const getLineColor = () => {
      return item.name === 'TezPass' ? '#fff' : '#ED8701';
    };

    return (
      <View style={getCardStyle()}>
        {/* Name */}
        <View style={styles.cardContent}>
          <Text style={getNameStyle()}>{item.name}</Text>
        </View>

        {/* Border line with dots */}
        <View style={{ 
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 12,
          marginVertical: 8,
        }}>
          <View style={{
            width: moderateScale(8),
            height: verticalScale(8),
            borderRadius: 100,
            backgroundColor: getDotColor(),
            borderWidth: item.name === 'Plan Your Trip' ? 1 : 0,
            borderColor: item.name === 'Plan Your Trip' ? '#ED8701' : 'transparent',
            marginRight: -2,
          }} />
          
          <View style={{ 
            flex: 1, 
            height: 1, 
            backgroundColor: getLineColor()
          }} />
          
          <View style={{
            width: moderateScale(8),
            height: verticalScale(8),
            borderRadius: 100,
            backgroundColor: getDotColor(),
            borderWidth: item.name === 'Plan Your Trip' ? 1 : 0,
            borderColor: item.name === 'Plan Your Trip' ? '#ED8701' : 'transparent',
            marginLeft: -2,
          }} />
        </View>
        
        {/* Image */}
        <Image 
          source={{ uri: item.image }} 
          style={styles.passImage}
          resizeMode="cover"
        />
               
        {/* Buy Now button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={getButtonStyle(item)}
            onPress={() => handleBuyNow(item)}
          >
            <Text style={styles.buyNowText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={{ padding: 5, marginRight: 10 }}
        >
          <ArrowLeft color="#333" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>My Passes</Text>
      </View>
      
      <FlatList
        data={passes}
        renderItem={renderPass}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    top: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: textScale(16),
    fontFamily: FONTS.MetropolicBold,
    color: '#333',
    flex: 1,
  },
  list: {
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  passCard: {
    flex: 1,
    borderRadius: 12,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 12,
    paddingBottom: 8,
  },
  passImage: {
    width: '60%',
    height: 100,
    backgroundColor: '#f0f0f0',
    alignSelf: "center",
    borderRadius: 20,
    resizeMode: 'cover',
  },
  buttonContainer: {
    padding: 12,
    paddingTop: 8,
  },
  passName: {
    fontSize: textScale(16),
    fontFamily: FONTS.MetropolicSemibold,
    textAlign: 'center',
  },
  buyNowButton: {
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  buyNowText: {
    color: '#fff',
    fontSize: textScale(12),
    fontFamily: FONTS.MetropolicRegular,
  },
  tezPassCard: {
    backgroundColor: '#3511a3',
    borderWidth: 1,
    borderColor:'#3511a3'
  },
  tezPassName: {
    color: '#FFF',
    fontSize: textScale(14),
    fontFamily: FONTS.MetropolicBold,
  },
  tezPassButton: {
    backgroundColor: '#ED8701',
  },
  planTripCard: {
    backgroundColor: '#FFF8F0',
    borderWidth: 1,
    borderColor: '#FFF8F0',
  },
  planTripName: {
    color: '#333',
    fontSize: textScale(14),
    fontFamily: FONTS.MetropolicBold,
  },
  planTripButton: {
    backgroundColor: '#4CAF50',
  },
});

export default MyPasses;