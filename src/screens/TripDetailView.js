import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Modal,
  TextInput,
  PanResponder,
  Animated,
  Alert,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Calendar } from 'react-native-calendars';
import {
  Car,
  Bike,
  Train,
  Bus,
  PlaneTakeoff,
  X,
  UserCheck,
  Search,
  Trash2,
  Wallet,
  CalendarDays,
  ChevronDown
} from 'lucide-react-native';
import images from '../assets/index';
import { FONTS } from '../../global';
import {
  moderateScale,
  textScale,
  verticalScale,
  ratio
} from '../styles/responsiveSize';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const DRAG_CARD_WIDTH = SCREEN_WIDTH - 80;
const DRAG_CARD_HEIGHT = 62;
const DROP_ZONE_Y_OFFSET = 0; // adjust if needed

const TripDetailView = ({ route, navigation }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [expenseTab, setExpenseTab] = useState('Summary');
  const [showPlacesModal, setShowPlacesModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [placesByDate, setPlacesByDate] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [addedPlaces, setAddedPlaces] = useState({});
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [settleAmount, setSettleAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [modalTranslateY] = useState(new Animated.Value(0));
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date());
  const [showExpenseCalendar, setShowExpenseCalendar] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('INR');
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [itemName,setItemName] = useState('');
  const [itemsList, setItemsList] = useState([]);
  const [friendsList, setFriendsList] = useState([
  { id: 1, name: 'Miss Teri Kunde', lent: 100, borrowed: 0 },
  { id: 2, name: 'Gilberto Terry', lent: 0, borrowed: 2500 },
   ]);
  const [showFriendModal, setShowFriendModal] = useState(false);
  const [editingFriend, setEditingFriend] = useState(null);
  const [friendName, setFriendName] = useState('');
  const [friendLent, setFriendLent] = useState('');
  const [friendBorrowed, setFriendBorrowed] = useState('');
  
  // Drag and drop states
  const [isDragging, setIsDragging] = useState(false);
  const [draggedPlace, setDraggedPlace] = useState(null);
  const [sourceDateKey, setSourceDateKey] = useState(null);
  const [targetDateKey, setTargetDateKey] = useState(null);
  const [dropZoneLayouts, setDropZoneLayouts] = useState({});
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  
  
  const dragValue = useRef(new Animated.ValueXY()).current;
  const longPressTimer = useRef(null);
  const scrollViewRef = useRef(null);
  const dropZoneRefs = useRef({});
  const { trip } = route.params || {};

  // ========== Helper functions ==========
  const formatDate = dateString => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toDateString();
  };

  const fromDate = trip?.fromDate;
  const toDate = trip?.toDate;
  const duration =
    fromDate && toDate
      ? Math.ceil((new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24))
      : 0;

  const savedDates = trip?.allDates || [];

  const getDisplayDates = () => {
    if (savedDates.length > 0) {
      return savedDates.map(dateStr => new Date(dateStr));
    }
    if (!fromDate || !toDate) return [];
    const dates = [];
    let startDate = new Date(fromDate);
    let endDate = new Date(toDate);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    while (startDate <= endDate) {
      dates.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 1);
    }
    return dates;
  };

  const displayDates = getDisplayDates();

  const addPlaceToDate = (date, place) => {
    const dateKey = date.toDateString();
    const existingPlaces = placesByDate[dateKey] || [];
    setPlacesByDate({
      ...placesByDate,
      [dateKey]: [...existingPlaces, { ...place, addedAt: new Date().toISOString() }],
    });
    setShowPlacesModal(false);
    setAddedPlaces({ ...addedPlaces, [place.id]: true });
  };

  const removePlaceFromDate = (date, placeId) => {
    const dateKey = date.toDateString();
    const existingPlaces = placesByDate[dateKey] || [];
    setPlacesByDate({
      ...placesByDate,
      [dateKey]: existingPlaces.filter(place => place.id !== placeId),
    });
  };

  // ========== Drag & drop core ==========
  const onDropZoneLayout = (dateKey) => {
  const ref = dropZoneRefs.current[dateKey];

  if (ref) {
    ref.measureInWindow((x, y, width, height) => {
      setDropZoneLayouts(prev => ({
        ...prev,
        [dateKey]: {
          x,
          y,
          width,
          height,
        },
      }));
    });
  }
};
  const getDateKeyUnderFinger = (fingerX, fingerY) => {
  for (const [dateKey, layout] of Object.entries(dropZoneLayouts)) {

    const insideX =
      fingerX >= layout.x &&
      fingerX <= layout.x + layout.width;

    const insideY =
      fingerY >= layout.y &&
      fingerY <= layout.y + layout.height;

    if (insideX && insideY) {
      return dateKey;
    }
  }

  return null;
};

  const executeDrop = (targetKey) => {
    if (!draggedPlace || !sourceDateKey) {
      cancelDrag();
      return false;
    }
    if (sourceDateKey === targetKey) {
      cancelDrag();
      return false;
    }
    const newPlacesByDate = { ...placesByDate };
    if (newPlacesByDate[sourceDateKey]) {
      newPlacesByDate[sourceDateKey] = newPlacesByDate[sourceDateKey].filter(
        p => p.id !== draggedPlace.id
      );
    }
    if (!newPlacesByDate[targetKey]) {
      newPlacesByDate[targetKey] = [];
    }
    newPlacesByDate[targetKey].push({ ...draggedPlace });
    setPlacesByDate(newPlacesByDate);
    cancelDrag();
    return true;
  };

  const cancelDrag = () => {
    setIsDragging(false);
    setDraggedPlace(null);
    setSourceDateKey(null);
    setTargetDateKey(null);
    dragValue.setValue({ x: 0, y: 0 });
    setDragPosition({ x: 0, y: 0 });
  };

  const startDrag = (place, dateKey, pageX, pageY) => {
    setIsDragging(true);
    setDraggedPlace(place);
    setSourceDateKey(dateKey);
    dragValue.setValue({ x: 0, y: 0 });
    setDragPosition({ x: pageX - DRAG_CARD_WIDTH / 2, y: pageY - DRAG_CARD_HEIGHT / 2 });
  };

  // ========== Touch handlers ==========
  const handlePlaceTouchStart = (place, dateKey, event) => {
    const touch = event.nativeEvent.touches[0];
    if (!touch) return;
    const { pageX, pageY } = touch;
    longPressTimer.current = setTimeout(() => {
      startDrag(place, dateKey, pageX, pageY);
    }, 100);
  };

  const handlePlaceTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleTouchMove = (evt) => {
    if (isDragging) {
      const touch = evt.nativeEvent.touches[0];
      if (!touch) return;
      const { pageX, pageY } = touch;

      setDragPosition({ x: pageX - DRAG_CARD_WIDTH / 2, y: pageY - DRAG_CARD_HEIGHT / 2 });
      const dropZone = (pageX, pageY);
      setTargetDateKey(dropZone || null);
    }
  };

  const handleTouchEnd = (evt) => {
  if (isDragging) {

    const touch = evt.nativeEvent.changedTouches[0];

    if (touch) {

      const dropKey = getDateKeyUnderFinger(
        touch.pageX,
        touch.pageY
      );

      if (dropKey && dropKey !== sourceDateKey) {
        executeDrop(dropKey);
      } else {
        cancelDrag();
      }

    } else {
      cancelDrag();
    }
  }

  handlePlaceTouchEnd();
};

  // ========== Dummy data ==========
  const dummyPlaces = [
    { id: 1, name: 'Lalbagh Botanical Garden', rating: 4.4, reviews: 96.1, entryFee: '₹100', image: images.taj },
    { id: 2, name: 'Mysore Palace', rating: 4.7, reviews: 45.2, entryFee: '₹70', image: images.taj },
    { id: 3, name: 'Bannerghatta Park', rating: 4.3, reviews: 32.5, entryFee: '₹80', image: images.taj },
    { id: 4, name: 'Wonderla Amusement', rating: 4.5, reviews: 28.7, entryFee: '₹1200', image: images.taj },
    { id: 5, name: 'Kerala Backwaters', rating: 4.9, reviews: 52.3, entryFee: '₹500', image: images.taj },
  ];

  const splitFriends = [
    { id: 1, name: 'Miss Teri Kunde', selected: false },
    { id: 2, name: 'Gilberto Terry', selected: false },
    { id: 3, name: 'Manuel Hudson', selected: false },
    { id: 4, name: 'Kelly Senger', selected: false },
  ];
  
  const countries = [
    { code: 'INR', symbol: '₹', name: 'India' },
    { code: 'USD', symbol: '$', name: 'United States' },
    { code: 'EUR', symbol: '€', name: 'Eurozone' },
    { code: 'GBP', symbol: '£', name: 'United Kingdom' },
    { code: 'JPY', symbol: '¥', name: 'Japan' },
    { code: 'CAD', symbol: 'C$', name: 'Canada' },
    { code: 'AUD', symbol: 'A$', name: 'Australia' },
    { code: 'CNY', symbol: '¥', name: 'China' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE' },
  ];
  
  const expenseCategories = [
    { icon: images.abd },
    { icon: images.coins },
    { icon: images.shopping },
    { icon: images.petrol },
    { icon: images.petrol },
    { icon: images.activity },
    { icon: images.taj },
    { icon: images.other },
  ];

  const filteredPlaces = dummyPlaces.filter(place =>
    place.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
    country.code.toLowerCase().includes(countrySearchQuery.toLowerCase())
  );

  const selectCountry = (country) => {
    setSelectedCountry(country.code);
    setShowCountryPicker(false);
    setCountrySearchQuery('');
  };

  const renderIcon = mode => {
    const size = 14;
    const color = '#ED8701';
    switch (mode) {
      case 'car': return <Car size={size} color={color} />;
      case 'bike': return <Bike size={size} color={color} />;
      case 'train': return <Train size={size} color={color} />;
      case 'bus': return <Bus size={size} color={color} />;
      case 'plane': return <PlaneTakeoff size={size} color={color} />;
      default: return null;
    }
  };

  const friendsData = [
    { id: 1, name: 'Miss Teri Kunde', amount: 100, type: 'lent' },
    { id: 2, name: 'Gilberto Terry', amount: 2500, type: 'borrowed' },
    { id: 3, name: 'Manuel Hudson', amount: 600, type: 'lent' },
    { id: 4, name: 'Kelly Senger', amount: 1700, type: 'borrowed' },
  ];

  const settlePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 5,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) modalTranslateY.setValue(gestureState.dy);
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 100) {
        Animated.spring(modalTranslateY, { toValue: 0, useNativeDriver: true }).start();
        setShowSettleModal(false);
        modalTranslateY.setValue(0);
        setSelectedFriend(null);
        setSettleAmount('');
      } else {
        Animated.spring(modalTranslateY, { toValue: 0, useNativeDriver: true }).start();
      }
    },
  });

  const toggleMemberSelection = memberId => {
    const updatedMembers = selectedMembers.includes(memberId)
      ? selectedMembers.filter(id => id !== memberId)
      : [...selectedMembers, memberId];
    setSelectedMembers(updatedMembers);
  };

  const addExpense = () => {
    if (expenseName && expenseAmount) {
      console.log('Expense added:', { expenseName, expenseAmount, expenseDate, selectedMembers });
      setShowExpenseModal(false);
      setExpenseName('');
      setExpenseAmount('');
      setExpenseDate(new Date());
      setSelectedMembers([]);
      setSelectedCategory(null);
    }
  };

  // ========== Main render ==========
  return (
    <View 
      style={{ flex: 1 }}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

        <Image source={images.taj} style={styles.headerImage} resizeMode="cover" />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.cardWrapper}>
          <LinearGradient colors={['#FFEED8', '#FFD59E']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={styles.tripCard}>
            <View style={styles.tripInfoRow}>
              <Image source={{ uri: trip?.tripImage || 'https://via.placeholder.com/50' }} style={styles.tripImage} />
              <View style={{ flexDirection: 'column', gap: 4 }}>
                <View style={styles.titleRow}>
                  <Text style={styles.title}>{trip?.destination || 'No Destination'}</Text>
                  <View style={styles.iconWrapper}>{renderIcon(trip?.travelMode)}</View>
                </View>
                <Text style={styles.dateText}>
                  {fromDate && toDate ? `${formatDate(fromDate)} - ${formatDate(toDate)} (${duration} days)` : trip?.tripDate || 'N/A'}
                </Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.teamRow}>
              {trip?.teamMembers?.length > 0 ? (
                trip.teamMembers.map((member, index) => (
                  <Image key={index} source={{ uri: member.image || 'https://i.pravatar.cc/150' }} style={styles.memberImage} />
                ))
              ) : (
                <Text style={styles.noDataText}>No Members</Text>
              )}
            </View>
          </LinearGradient>
        </View>

        <View style={styles.container2}>
          <View style={styles.tabsContainer}>
            {['Expenses', 'Trip Plan', 'Overview'].map(item => (
              <TouchableOpacity key={item} style={styles.tabButton} onPress={() => setActiveTab(item)}>
                <Text style={[styles.tabText, activeTab === item && styles.activeTabText]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ✅ Fixed ScrollView: added onScroll and onLayout */}
          <ScrollView 
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            scrollEnabled={!isDragging}
            
          >
            {activeTab === 'Overview' && (
              <>
                <View style={styles.giftCardContainer}>
                  <View style={styles.giftCard}>
                    <View style={styles.giftTextContainer}>
                      <Text style={styles.giftText}>This 1 trip credit is gifted by</Text>
                      <Text style={styles.giftSender}>Orange Tour and travels</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.budgetSection}>
                  <Text style={styles.sectionHeaderText}>TRIP BUDGET</Text>
                  <View style={styles.budgetCardsRow}>
                    <View style={[styles.budgetCard, styles.totalBudgetCard]}>
                      <Text style={styles.budgetCardLabel}>Total Budget</Text>
                      <Text style={styles.totalBudgetAmount}>₹{trip?.budget || 1000}</Text>
                    </View>
                    <View style={[styles.budgetCard, styles.spentBudgetCard]}>
                      <Text style={styles.budgetCardLabel}>Budget Spent</Text>
                      <Text style={styles.spentBudgetAmount}>₹20000</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.vehicleSection}>
                  <Text style={styles.sectionHeaderText}>VEHICLE DETAILS</Text>
                  <View style={styles.addVehicleRow}>
                    <View style={styles.addIconContainer}>
                      <Image source={images.plus} style={styles.plusIcon} />
                    </View>
                    <Text style={styles.addVehicleText}>Add New Vehicle</Text>
                  </View>

                  <View style={styles.vehicleItem}>
                    <View style={styles.vehicleIconContainer}>
                      <Image source={images.pp} style={styles.vehicleIcon} />
                    </View>
                    <View style={styles.vehicleDetails}>
                      <Text style={styles.vehicleTitle}>Petrol estimate:1500-1800</Text>
                      <Text style={styles.vehicleSubtitle}>125Km 8.5Hrs</Text>
                    </View>
                  </View>

                  <View style={styles.vehicleItem}>
                    <View style={styles.fastagIconContainer}>
                      <Image source={images.ft} style={styles.vehicleIcon} />
                    </View>
                    <View style={styles.vehicleDetails}>
                      <Text style={styles.vehicleTitle}>Fastag estimate:415</Text>
                      <Text style={styles.vehicleSubtitle}>Add vehicle to fetch balance</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.thingsToCarrySection}>
                  <Text style={styles.thingsToCarryTitle}>THINGS TO CARRY</Text>
                  {/* Render added items */}
                                        {itemsList.length > 0 && (
                                                   <View style={styles.itemsContainer}>
                                                        {itemsList.map((item, index) => (
                                                               <View key={index} style={styles.itemTag}>
                                                                      <Text style={styles.itemTagText}>{item}</Text>
                                                                          <TouchableOpacity onPress={() => {
                                                                             const newList = itemsList.filter((_, i) => i !== index);
                                                                            setItemsList(newList);
                                                                                       }}>
                                                                               <X size={14} color="#999" />
                                                                                       </TouchableOpacity>
                                                                                      </View>
                                                                                            ))}
                                                                                           </View>
                                                                                                         )}
                  <TouchableOpacity style={styles.addItemRow} onPress={()=>{setShowAddItemModal(true)}}>
                    <View style={styles.addIconContainer}>
                      <Image source={images.plus} style={styles.plusIcon} />
                    </View>
                    <Text style={styles.addItemText}>Add item</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.add}>
                  <Text style={styles.addtitle}>ADDITIONAL INFORMATION</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.addrow}>
                      <View style={styles.adddetail}><Text style={styles.t}>Total Tolls</Text><Text style={{ fontSize: 15, fontFamily: FONTS.sfprobold, color: 'rgba(52, 22, 73, 1)' }}>7</Text></View>
                      <View style={styles.adddetail}><Text style={styles.t}>Total KM</Text><Text style={{ fontSize: 15, fontFamily: FONTS.sfprobold, color: 'rgba(52, 22, 73, 1)' }}>125</Text></View>
                      <View style={styles.adddetail}><Text style={styles.t}>Est Time</Text><Text style={{ fontSize: 15, fontFamily: FONTS.sfprobold, color: 'rgba(52, 22, 73, 1)' }}>8.5Hrs</Text></View>
                      <View style={styles.adddetail}><Text style={styles.t}>Fuel Cost</Text><Text style={{ fontSize: 15, fontFamily: FONTS.sfprobold, color: 'rgba(52, 22, 73, 1)' }}>₹1800</Text></View>
                    </View>
                  </ScrollView>
                </View>

                <View style={styles.gt}>
                  <Text style={styles.gd}>GET DIRECTION</Text>
                  <Image source={images.direction} style={styles.id} />
                  <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'center', gap: 50 }}>
                    <Text style={styles.sg}>Start: {trip?.from}</Text>
                    <Text style={styles.sg}>End: {trip?.destination}</Text>
                  </View>
                </View>

                <Image source={images.ycar} style={{ width: '100%', height: 200, top: 30, marginBottom: 50 }} />
              </>
            )}

            {activeTab === 'Trip Plan' && (
              <View style={{ flex: 1 }}>
                {displayDates.length > 0 ? (
                  displayDates.map((date, index) => {
                    const dateKey = date.toDateString();
                    const placesForDate = placesByDate[dateKey] || [];
                    const isDropTarget = isDragging && targetDateKey === dateKey;
                    
                    return (
                      <View
                        key={index}
                          ref={(ref) => {
                                               if (ref) {
                                                         dropZoneRefs.current[dateKey] = ref;
                                                   }
                                                     }}

                                      onLayout={() => onDropZoneLayout(dateKey)}  
                        style={[
                          styles.dateCard,
                          isDropTarget && styles.dateCardDropTarget,
                        ]}
                      >
                        <TouchableOpacity
                          activeOpacity={0.9}
                          onPress={() => {
                            if (!isDragging) {
                              setSelectedDate(date);
                              setShowPlacesModal(true);
                            }
                          }}
                        >
                          <View style={styles.dateLeft}>
                            <View style={styles.date}>
                              <Text style={styles.d}>
                                {date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                              </Text>
                              <Text style={styles.d}>{date.getDate()}</Text>
                              <Text style={styles.d}>{date.getFullYear()}</Text>
                            </View>
                            <Text style={styles.placesCount}>
                              {placesForDate.length} {placesForDate.length === 1 ? 'place' : 'places'}
                            </Text>
                          </View>
                        </TouchableOpacity>

                        {placesForDate.length > 0 && (
                          <View style={styles.placesList}>
                            {placesForDate.map((place, placeIndex) => (
                              <View
                                key={placeIndex}
                                onTouchStart={(event) => handlePlaceTouchStart(place, dateKey, event)}
                                onTouchEnd={handlePlaceTouchEnd}
                                style={[
                                  styles.placeCardSmall,
                                  isDragging && draggedPlace?.id === place.id && styles.placeCardDragging,
                                ]}
                              >
                                <Image source={place.image} style={styles.placeImageSmall} />
                                <View style={styles.rc}>
                                  <Text style={styles.placeNameSmall}>{place.name}</Text>
                                  <View style={styles.placeDetailsRowSmall}>
                                    <Text style={styles.ratingSmall}>★ {place.rating}</Text>
                                    <Text style={styles.entryFeeSmall}>Entry: {place.entryFee}</Text>
                                  </View>
                                </View>
                                <TouchableOpacity
                                  style={styles.removePlaceBtn}
                                  onPress={() => removePlaceFromDate(date, place.id)}
                                >
                                  <Trash2 size={18} color="rgba(135, 135, 135, 1)" />
                                </TouchableOpacity>
                              </View>
                            ))}
                          </View>
                        )}
                      </View>
                    );
                  })
                ) : (
                  <View style={styles.noDatesContainer}>
                    <Text style={styles.noDatesText}>No dates selected</Text>
                    <Text style={styles.noDatesSubText}>
                      Please select from and to dates while creating the trip
                    </Text>
                  </View>
                )}

                {!isDragging && (
                  <TouchableOpacity
                    style={styles.addPlaceButtonMain}
                    onPress={() => {
                      if (displayDates.length > 0) {
                        setSelectedDate(displayDates[0]);
                        setShowPlacesModal(true);
                      }
                    }}
                  >
                    <Text style={styles.addPlaceTextMain}>+ Add places to visit</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {activeTab === 'Expenses' && (
              <>
                <View style={styles.expenseSubTabsContainer}>
                  {['Expenses', 'Group', 'Summary'].map(item => (
                    <TouchableOpacity key={item} style={styles.expenseSubTabButton} onPress={() => setExpenseTab(item)}>
                      <Text style={[styles.expenseSubTabText, expenseTab === item && styles.activeExpenseSubTabText]}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {expenseTab === 'Group' && (
                  <View style={styles.egc}>
                    <View style={styles.youBorrowedC}>
                      <View style={styles.bc}>
                        <View style={styles.brc}>
                          <View style={{ width: moderateScale(40), height: verticalScale(40), backgroundColor: 'rgba(255, 238, 217, 0.7)', alignSelf: 'center', padding: 10, borderRadius: 8 }}>
                            <Image source={images.upper} style={{ alignSelf: 'center' }} />
                          </View>
                          <View style={{ flexDirection: 'column', alignSelf: 'center' }}>
                            <Text style={styles.youBorrowed}>You borrowed</Text>
                            <Text style={styles.youBorrowedA}>₹4,200</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.bc}>
                        <View style={styles.brc}>
                          <View style={{ width: moderateScale(40), height: verticalScale(40), backgroundColor: 'rgba(5, 136, 53, 0.12)', alignSelf: 'center', padding: 10, borderRadius: 8 }}>
                            <Image source={images.lower} style={{ alignSelf: 'center' }} />
                          </View>
                          <View style={{ flexDirection: 'column', alignSelf: 'center' }}>
                            <Text style={styles.youBorrowed}>You owe</Text>
                            <Text style={styles.youOwedA}>₹1000</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <Text style={styles.allFriendsT}>ALL FRIENDS</Text>
                        {/* Dynamic Friends List */}
{friendsList.map((friend) => (
 <TouchableOpacity 
  key={friend.id} 
  style={styles.fr}
  onPress={() => {
    setEditingFriend(friend);
    setFriendName(friend.name);
    setFriendLent(friend.lent.toString());
    setFriendBorrowed(friend.borrowed.toString());
    setShowFriendModal(true);
  }}
>
  <Image source={images.abd} style={styles.imr} />
  <View style={styles.fr1}>
    <View style={styles.friendInfoContainer}>
      <Text style={styles.friendName}>{friend.name}</Text>
    </View>
    <View style={styles.frc}>
      {friend.lent > 0 && (
        <View style={styles.amountRow}>
          <Text style={styles.friendL}>Your lent </Text>
          <Text style={styles.friendLl}>₹{friend.lent}</Text>
        </View>
      )}
      {friend.borrowed > 0 && (
        <View style={styles.amountRow}>
          <Text style={styles.friendB}>Your borrowed </Text>
          <Text style={styles.friendL2}>₹{friend.borrowed}</Text>
        </View>
      )}
    </View>
  </View>
</TouchableOpacity>
))}

{/* Add Friend Button */}
<TouchableOpacity 
  style={styles.addFriendButton}
  onPress={() => {
    setEditingFriend(null);
    setFriendName('');
    setFriendLent('');
    setFriendBorrowed('');
    setShowFriendModal(true);
  }}
>
  <Text style={styles.addFriendText}>+ Add Friend</Text>
</TouchableOpacity> 
                    <TouchableOpacity style={styles.settleUp} onPress={() => setShowSettleModal(true)}>
                      <Text style={styles.settleUpT}>Settle up</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {expenseTab === 'Expenses' && (
                  <View>
                    <View style={styles.expenseR}>
                      <View style={styles.expenseIconContainer}><Image source={images.spoon} style={styles.expenseIcon} /></View>
                      <View style={styles.expenseR1}>
                        <View style={styles.expenseC}>
                          <Text style={styles.expenseTitle}>Restaurant</Text>
                          <View style={styles.expensePaidRow}><Text style={styles.expensePaidBy}>John paid</Text><Text style={styles.expenseAmount}>₹4,500</Text></View>
                        </View>
                        <View style={styles.expenseC1}><Text style={styles.expenseBorrowedText}>you borrowed</Text><Text style={styles.expenseBorrowedAmount}>₹1,500</Text></View>
                      </View>
                    </View>
                    <View style={styles.expenseR}>
                      <View style={[styles.expenseIconContainer, { backgroundColor: 'rgba(52, 199, 89, 0.15)' }]}><Image source={images.petrol} style={styles.expenseIcon} /></View>
                      <View style={styles.expenseR1}>
                        <View style={styles.expenseC}>
                          <Text style={styles.expenseTitle}>Fuel / Petrol</Text>
                          <View style={styles.expensePaidRow}><Text style={styles.expensePaidBy}>Sarah paid</Text><Text style={styles.expenseAmount}>₹2,800</Text></View>
                        </View>
                        <View style={styles.expenseC1}><Text style={styles.expenseOwedText}>you lent</Text><Text style={styles.expenseOwedAmount}>₹700</Text></View>
                      </View>
                    </View>
                    <View style={styles.expenseR}>
                      <View style={[styles.expenseIconContainer, { backgroundColor: 'rgba(64, 107, 239, 0.15)' }]}><Image source={images.shopping} style={styles.expenseIcon} /></View>
                      <View style={styles.expenseR1}>
                        <View style={styles.expenseC}>
                          <Text style={styles.expenseTitle}>Shopping</Text>
                          <View style={styles.expensePaidRow}><Text style={styles.expensePaidBy}>Mike paid</Text><Text style={styles.expenseAmount}>₹3,200</Text></View>
                        </View>
                        <View style={styles.expenseC1}><Text style={styles.expenseBorrowedText}>you borrowed</Text><Text style={styles.expenseBorrowedAmount}>₹1,600</Text></View>
                      </View>
                    </View>
                    <View style={styles.expenseR}>
                      <View style={[styles.expenseIconContainer, { backgroundColor: 'rgba(156, 39, 176, 0.15)' }]}><Image source={images.hotel} style={styles.expenseIcon} /></View>
                      <View style={styles.expenseR1}>
                        <View style={styles.expenseC}>
                          <Text style={styles.expenseTitle}>Hotel / Stay</Text>
                          <View style={styles.expensePaidRow}><Text style={styles.expensePaidBy}>Emma paid</Text><Text style={styles.expenseAmount}>₹6,800</Text></View>
                        </View>
                        <View style={styles.expenseC1}><Text style={styles.expenseOwedText}>you lent</Text><Text style={styles.expenseOwedAmount}>₹2,200</Text></View>
                      </View>
                    </View>
                    <View style={styles.expenseR}>
                      <View style={[styles.expenseIconContainer, { backgroundColor: 'rgba(237, 135, 1, 0.15)' }]}><Car size={18} color="#ED8701" /></View>
                      <View style={styles.expenseR1}>
                        <View style={styles.expenseC}>
                          <Text style={styles.expenseTitle}>Transport / Taxi</Text>
                          <View style={styles.expensePaidRow}><Text style={styles.expensePaidBy}>Alex paid</Text><Text style={styles.expenseAmount}>₹950</Text></View>
                        </View>
                        <View style={styles.expenseC1}><Text style={styles.expenseBorrowedText}>you borrowed</Text><Text style={styles.expenseBorrowedAmount}>₹300</Text></View>
                      </View>
                    </View>
                    <View style={styles.expenseR}>
                      <View style={styles.expenseIconContainer}><Image source={images.activity} style={styles.expenseIcon} /></View>
                      <View style={styles.expenseR1}>
                        <View style={styles.expenseC}>
                          <Text style={styles.expenseTitle}>Activities / Tour</Text>
                          <View style={styles.expensePaidRow}><Text style={styles.expensePaidBy}>Lisa paid</Text><Text style={styles.expenseAmount}>₹1,200</Text></View>
                        </View>
                        <View style={styles.expenseC1}><Text style={styles.expenseOwedText}>you lent</Text><Text style={styles.expenseOwedAmount}>₹400</Text></View>
                      </View>
                    </View>
                    <TouchableOpacity style={styles.expensebt} onPress={() => setShowExpenseModal(true)}>
                      <Text style={styles.expensebtText}>+ Add new</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {expenseTab === 'Summary' && (
                  <View>
                    <Text style={styles.sectionHeaderText}>TRIP BUDGET</Text>
                    <View style={styles.budgetCardsRow}>
                      <View style={[styles.budgetCard, styles.totalBudgetCard]}>
                        <Text style={styles.budgetCardLabel}>Total Budget</Text>
                        <Text style={styles.totalBudgetAmount}>₹30,0000</Text>
                      </View>
                      <View style={[styles.budgetCard, styles.spentBudgetCard]}>
                        <Text style={styles.budgetCardLabel}>Budget Spent</Text>
                        <Text style={styles.spentBudgetAmount}>₹1000</Text>
                      </View>
                    </View>
                    <Text style={styles.categoriesTitle}>Categories money spent</Text>
                    <View style={styles.categoriesRow}>
                      <View style={styles.categoryItem}><Image source={images.petrol} style={styles.categoryIcon} /><Text style={styles.categoryAmount}>₹1548</Text><Text style={styles.categoryName}>Fuel</Text></View>
                      <View style={styles.categoryItem}><Image source={images.spoon} style={styles.categoryIcon} /><Text style={styles.categoryAmount}>₹1691</Text><Text style={styles.categoryName}>Food</Text></View>
                      <View style={styles.categoryItem}><Image source={images.taj} style={styles.categoryIcon} /><Text style={styles.categoryAmount}>₹1790</Text><Text style={styles.categoryName}>Stay</Text></View>
                    </View>
                    <View style={styles.categoriesRow}>
                      <View style={styles.categoryItem}><Image source={images.taj} style={styles.categoryIcon} /><Text style={styles.categoryAmount}>₹1691</Text><Text style={styles.categoryName}>Food</Text></View>
                      <View style={styles.categoryItem}><Image source={images.ycar} style={styles.categoryIcon} /><Text style={styles.categoryAmount}>₹1790</Text><Text style={styles.categoryName}>Stay</Text></View>
                      <View style={styles.categoryItem}><Image source={images.abd} style={styles.categoryIcon} /><Text style={styles.categoryAmount}>₹808</Text><Text style={styles.categoryName}>Others</Text></View>
                    </View>
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </View>

        {/* Dragging Overlay */}
        {isDragging && draggedPlace && (
          <Animated.View
            style={[
              styles.draggingOverlay,
              {
                transform: dragValue.getTranslateTransform(),
                position: 'absolute',
                top: dragPosition.y,
                left: dragPosition.x,
                zIndex: 9999,
              }
            ]}
            pointerEvents="none"
          >
            <Image source={draggedPlace.image} style={styles.draggingImage} />
            <Text style={styles.draggingText}>{draggedPlace.name}</Text>
          </Animated.View>
        )}

        {/* Modals – unchanged, but included for completeness */}
        <Modal animationType="slide" transparent visible={showPlacesModal} onRequestClose={() => setShowPlacesModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.searchInputContainer}>
                <Search size={15} color="rgba(135, 135, 135, 1)" />
                <TextInput 
                  style={styles.searchInput} 
                  placeholder="Search places..." 
                  placeholderTextColor="#999" 
                  value={searchQuery} 
                  onChangeText={setSearchQuery} 
                />
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                {filteredPlaces.map(place => {
                  const isAdded = addedPlaces[place.id];
                  return (
                    <View key={place.id} style={styles.placeCardRow}>
                      <Image source={place.image} style={styles.placeImageRow} />
                      <View style={styles.placeInfoRow}>
                        <Text style={styles.placeNameRow}>{place.name}</Text>
                        <View style={styles.placeDetailsRow}>
                          <Text style={styles.ratingRow}>★ {place.rating}</Text>
                          <Text style={styles.reviewsRow}> ({place.reviews}K)</Text>
                          <Text style={styles.entryFeeRow}> Entry: {place.entryFee}</Text>
                        </View>
                      </View>
                      {!isAdded ? (
                        <TouchableOpacity 
                          style={styles.addButtonRow} 
                          onPress={() => { 
                            setAddedPlaces({ ...addedPlaces, [place.id]: true }); 
                            addPlaceToDate(selectedDate, place); 
                          }}
                        >
                          <Text style={styles.addButtonTextRow}>+ Add</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity 
                          style={styles.removeButtonRow} 
                          onPress={() => setAddedPlaces({ ...addedPlaces, [place.id]: false })}
                        >
                          <Text style={styles.removeButtonTextRow}>Remove</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Modal>

        <Modal animationType="none" transparent visible={showSettleModal} onRequestClose={() => setShowSettleModal(false)}>
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.settleModalContent, { transform: [{ translateY: modalTranslateY }] }]} {...settlePanResponder.panHandlers}>
              <View style={styles.dragHandleContainer}><View style={styles.dragHandle} /></View>
              <View style={styles.settleModalHeader}>
                <Text style={styles.settleModalTitle}>Settle Up</Text>
                <TouchableOpacity onPress={() => setShowSettleModal(false)}><X size={24} color="#333" /></TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.settleTotalCard}><Wallet size={24} color="#ED8701" /><Text style={styles.settleTotalLabel}>Total to Pay</Text><Text style={styles.settleTotalAmount}>₹2,800</Text></View>
                <Text style={styles.settleSectionTitle}>Select Friend</Text>
                {friendsData.map(friend => (
                  <TouchableOpacity key={friend.id} style={[styles.settleFriendItem, selectedFriend?.id === friend.id && styles.settleSelectedFriend]} onPress={() => setSelectedFriend(friend)}>
                    <View><Text style={styles.settleFriendName}>{friend.name}</Text><Text style={styles.settleFriendAmount}>{friend.type === 'lent' ? 'You lent' : 'You borrowed'} ₹{friend.amount}</Text></View>
                    {selectedFriend?.id === friend.id && <UserCheck size={20} color="#4CAF50" />}
                  </TouchableOpacity>
                ))}
                <Text style={styles.settleSectionTitle}>Enter Amount</Text>
                <View style={styles.settleAmountContainer}><Text style={styles.settleCurrencySymbol}>₹</Text><TextInput style={styles.settleAmountInput} placeholder="0" placeholderTextColor="#999" keyboardType="numeric" value={settleAmount} onChangeText={setSettleAmount} /></View>
                <Text style={styles.settleSectionTitle}>Payment Method</Text>
                <View style={styles.settlePaymentContainer}>
                  {['UPI', 'Card', 'Net Banking'].map(method => (
                    <TouchableOpacity key={method} style={[styles.settlePaymentOption, paymentMethod === method && styles.settleSelectedPayment]} onPress={() => setPaymentMethod(method)}>
                      <Text style={[styles.settlePaymentText, paymentMethod === method && styles.settleSelectedPaymentText]}>{method}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity style={styles.settleProceedButton} onPress={() => { if (!selectedFriend) { Alert.alert('Please select a friend'); return; } if (!settleAmount || parseFloat(settleAmount) <= 0) { Alert.alert('Please enter a valid amount'); return; } Alert.alert(`Payment of ₹${settleAmount} sent to ${selectedFriend.name}`); setShowSettleModal(false); setSelectedFriend(null); setSettleAmount(''); }}>
                  <Text style={styles.settleProceedText}>Proceed to Pay</Text>
                </TouchableOpacity>
              </ScrollView>
            </Animated.View>
          </View>
        </Modal>

        <Modal animationType="slide" transparent visible={showExpenseModal} onRequestClose={() => setShowExpenseModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.expenseModalContent}>
              <View style={styles.expenseModalHeader}>
                <Text style={styles.expenseModalTitle}>Add New Expense</Text>
                <TouchableOpacity onPress={() => setShowExpenseModal(false)}><X size={24} color="#333" /></TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.expenseInputLabel}>Expense Name</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <TouchableOpacity 
                    style={{
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 45,
                      height: 45,
                      borderWidth: 1,
                      borderColor: selectedCategory !== null ? '#ED8701' : '#EFEFEF',
                      borderRadius: 10,
                      backgroundColor: selectedCategory !== null ? '#FFF5E8' : '#F9F9F9',
                      gap: 4,
                    }}
                    onPress={() => setShowCategoryModal(true)}
                    activeOpacity={0.7}
                  >
                    {selectedCategory !== null ? (
                      <>
                        <Image 
                          source={expenseCategories[selectedCategory].icon} 
                          style={{
                            width: moderateScale(20),
                            height: verticalScale(20),
                            borderRadius: 100,
                            resizeMode: 'contain',
                            tintColor: '#ED8701',
                          }} 
                        />
                        <ChevronDown size={12} color="#ED8701" strokeWidth={2} />
                      </>
                    ) : (
                      <>
                        <ChevronDown size={20} color="#999" />
                      </>
                    )}
                  </TouchableOpacity>

                  <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#EFEFEF',
                    borderRadius: 10,
                    backgroundColor: '#F9F9F9',
                    paddingHorizontal: 12,
                  }}>
                    <TextInput 
                      style={{
                        flex: 1,
                        fontSize: textScale(14),
                        fontFamily: FONTS.MetropolicMedium,
                        color: '#333',
                        paddingVertical: 12,
                      }} 
                      placeholder="Enter expense name" 
                      placeholderTextColor="#999" 
                      value={expenseName} 
                      onChangeText={setExpenseName} 
                    />
                  </View>
                </View>

                <Text style={styles.expenseInputLabel}>Amount</Text>
                <View style={styles.expenseAmountContainer}>
                  <TouchableOpacity 
                    style={styles.currencySelector}
                    onPress={() => setShowCountryPicker(true)}
                  >
                    <Text style={styles.expenseCurrencySymbol}>
                      {countries.find(c => c.code === selectedCountry)?.symbol || '₹'}
                    </Text>
                    <ChevronDown size={16} color="#999" />
                  </TouchableOpacity>
                  <TextInput 
                    style={styles.expenseAmountInput} 
                    placeholder="0.00" 
                    placeholderTextColor="#999" 
                    keyboardType="numeric" 
                    value={expenseAmount} 
                    onChangeText={setExpenseAmount} 
                  />
                </View>
                
                <Text style={styles.expenseInputLabel}>Paid on</Text>
                <TouchableOpacity style={styles.expenseDateBox} onPress={() => setShowExpenseCalendar(true)}>
                  <Text style={styles.expenseDateText}>{expenseDate.toDateString()}</Text>
                  <CalendarDays size={20} color="#ED8701" />
                </TouchableOpacity>
                
                <Text style={styles.expenseInputLabel}>Split</Text>
                <Text style={styles.splitSubtitle}>Select members to split with</Text>
                {splitFriends.map(friend => (
                  <TouchableOpacity key={friend.id} style={styles.splitMemberItem} onPress={() => toggleMemberSelection(friend.id)}>
                    <View style={styles.splitMemberInfo}>
                      <Image source={images.abd} style={styles.splitMemberImage} />
                      <Text style={styles.splitMemberName}>{friend.name}</Text>
                    </View>
                    <View style={[styles.checkbox, selectedMembers.includes(friend.id) && styles.checkboxSelected]}>
                      {selectedMembers.includes(friend.id) && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                  </TouchableOpacity>
                ))}
                
                <TouchableOpacity style={styles.addExpenseBtn} onPress={addExpense}>
                  <Text style={styles.addExpenseBtnText}>Add Expense</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        <Modal animationType="slide" transparent visible={showExpenseCalendar} onRequestClose={() => setShowExpenseCalendar(false)}>
          <TouchableWithoutFeedback onPress={() => setShowExpenseCalendar(false)}>
            <View style={styles.calendarModalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.calendarModalContent}>
                  <View style={styles.calendarModalHeader}>
                    <Text style={styles.calendarModalTitle}>Select Date</Text>
                    <TouchableOpacity onPress={() => setShowExpenseCalendar(false)}><X size={24} color="#333" /></TouchableOpacity>
                  </View>
                  <Calendar
                    onDayPress={(day) => { 
                      setExpenseDate(new Date(day.dateString)); 
                      setShowExpenseCalendar(false); 
                    }}
                    markedDates={{ 
                      [expenseDate.toISOString().split('T')[0]]: { 
                        selected: true, 
                        selectedColor: '#ED8701' 
                      } 
                    }}
                    theme={{
                      backgroundColor: '#FFF',
                      calendarBackground: '#FFF',
                      textSectionTitleColor: '#666',
                      selectedDayBackgroundColor: '#ED8701',
                      selectedDayTextColor: '#FFF',
                      todayTextColor: '#ED8701',
                      dayTextColor: '#333',
                      monthTextColor: '#341649',
                      textDayFontFamily: FONTS.MetropolicMedium,
                      textMonthFontFamily: FONTS.MetropolicBold,
                      textDayHeaderFontFamily: FONTS.MetropolicMedium,
                      textDayFontSize: textScale(14),
                      textMonthFontSize: textScale(16),
                      textDayHeaderFontSize: textScale(12),
                    }}
                  />
                  <TouchableOpacity style={styles.calendarConfirmBtn} onPress={() => setShowExpenseCalendar(false)}>
                    <Text style={styles.calendarConfirmBtnText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Modal animationType="slide" transparent={true} visible={showCountryPicker} onRequestClose={() => setShowCountryPicker(false)}>
          <View style={styles.countryPickerOverlay}>
            <View style={styles.countryPickerContent}>
              <View style={styles.countryPickerHeader}>
                <Text style={styles.countryPickerTitle}>Select Currency</Text>
                <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                  <X size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <View style={styles.countrySearchContainer}>
                <Search size={18} color="#999" />
                <TextInput
                  style={styles.countrySearchInput}
                  placeholder="Search country..."
                  placeholderTextColor="#999"
                  value={countrySearchQuery}
                  onChangeText={setCountrySearchQuery}
                  autoFocus={true}
                />
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={styles.countryList}>
                {filteredCountries.map((country) => (
                  <TouchableOpacity
                    key={country.code}
                    style={styles.countryItem}
                    onPress={() => selectCountry(country)}
                  >
                    <View style={styles.countryInfo}>
                      <Text style={styles.countrySymbol}>{country.symbol}</Text>
                      <Text style={styles.countryName}>{country.name}</Text>
                      <Text style={styles.countryCode}>({country.code})</Text>
                    </View>
                    {selectedCountry === country.code && (
                      <Text style={styles.checkMark}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        <Modal animationType="slide" transparent={true} visible={showCategoryModal} onRequestClose={() => setShowCategoryModal(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#FFF', borderRadius: 20, padding: 20, width: moderateScale('90%'), maxHeight: verticalScale('80%') }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#EFEFEF' }}>
                <Text style={{ fontSize: textScale(16), fontFamily: FONTS.MetropolicBold, color: '#341649' }}>Select Category</Text>
                <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                  <X size={textScale(24)} color="#333" />
                </TouchableOpacity>
              </View>

              <ScrollView>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 5 }}>
                  {expenseCategories.map((category, index) => (
                    <TouchableOpacity
                      key={index}
                      style={{
                        width: moderateScale('23%'),
                        alignItems: 'center',
                        paddingVertical: 15,
                        marginBottom: 10,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: selectedCategory === index ? '#ED8701' : '#EFEFEF',
                        backgroundColor: selectedCategory === index ? '#FFF5E8' : '#FFF',
                        position: 'relative',
                      }}
                      onPress={() => {
                        setSelectedCategory(index);
                        setShowCategoryModal(false);
                      }}
                    >
                      <View style={{ width: moderateScale(55), height: verticalScale(55), borderRadius: 28, alignItems: 'center', justifyContent: 'center' }}>
                        <Image 
                          source={category.icon} 
                          style={{ width: moderateScale(40), height: verticalScale(40), resizeMode: 'contain', borderRadius: 20 }} 
                        />
                      </View>
                      {selectedCategory === index && (
                        <View style={{ position: 'absolute', top: 5, right: 5, width: moderateScale(20), height: verticalScale(20), borderRadius: 10, backgroundColor: '#ED8701', alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ color: '#FFF', fontSize: textScale(12), fontFamily: FONTS.sfprobold }}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
        {/* Add Item Modal */}
<Modal
  animationType="slide"
  transparent={true}
  visible={showAddItemModal}
  onRequestClose={() => setShowAddItemModal(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      {/* Header with title and close button */}
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Add Item</Text>
        <TouchableOpacity onPress={() => setShowAddItemModal(false)}>
          <X size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      {/* Text Input */}
      <TextInput
        style={styles.modalInput}
        placeholder="Enter item name"
        placeholderTextColor="#999"
        value={itemName}
        onChangeText={setItemName}
      />
      
      {/* Add Button */}
      <TouchableOpacity 
        style={styles.modalButton}
        onPress={() => {
          if(itemName.trim()){ setItemsList([...itemsList,itemName])};
          setItemName('');
          setShowAddItemModal(false);
        }}
      >
        <Text style={styles.modalButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
           {/* Friend Modal - Add/Edit Friend */}
<Modal
  animationType="slide"
  transparent={true}
  visible={showFriendModal}
  onRequestClose={() => setShowFriendModal(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <View style={styles.modalHeader}>
       
        <TouchableOpacity onPress={() => setShowFriendModal(false)}>
          <X size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      <TextInput
        style={styles.modalInput}
        placeholder="Friend Name"
        placeholderTextColor="#999"
        value={friendName}
        onChangeText={setFriendName}
      />
      
      <TextInput
        style={styles.modalInput}
        placeholder="Amount Lent (you lent to friend)"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={friendLent}
        onChangeText={setFriendLent}
      />
      
      <TextInput
        style={styles.modalInput}
        placeholder="Amount Borrowed (friend lent to you)"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={friendBorrowed}
        onChangeText={setFriendBorrowed}
      />
      
      <TouchableOpacity 
        style={styles.modalButton}
        onPress={() => {
          if (friendName.trim()) {
            if (editingFriend) {
              // Update existing friend
              setFriendsList(friendsList.map(f => 
                f.id === editingFriend.id 
                  ? { 
                      ...f, 
                      name: friendName, 
                      lent: parseInt(friendLent) || 0, 
                      borrowed: parseInt(friendBorrowed) || 0 
                    }
                  : f
              ));
            } else {
              // Add new friend
              setFriendsList([
                ...friendsList,
                {
                  id: Date.now(),
                  name: friendName,
                  lent: parseInt(friendLent) || 0,
                  borrowed: parseInt(friendBorrowed) || 0,
                }
              ]);
            }
            setShowFriendModal(false);
          }
        }}
      >
        <Text style={styles.modalButtonText}>
          {editingFriend ? 'Update' : 'Add'} Friend
        </Text>
      </TouchableOpacity>
      
      {editingFriend && (
        <TouchableOpacity 
          style={[styles.modalButton, { backgroundColor: '#EF4020', marginTop: 10 }]}
          onPress={() => {
            Alert.alert(
              'Delete Friend',
              `Delete ${friendName}?`,
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Delete', 
                  onPress: () => {
                    setFriendsList(friendsList.filter(f => f.id !== editingFriend.id));
                    setShowFriendModal(false);
                  },
                  style: 'destructive'
                }
              ]
            );
          }}
        >
          <Text style={styles.modalButtonText}>Delete Friend</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
</Modal>           
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  container2: { flex: 1, backgroundColor: '#FFF', paddingVertical: 10, paddingHorizontal: 10 },
  headerImage: { width: moderateScale('100%'), height: verticalScale(150) },
  backButton: {position:'absolute',  left: 20, width: moderateScale(30), height: verticalScale(30), alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', borderRadius: 20, top: 40 },
  backButtonText: { fontSize: textScale(14), top: -3, color: 'rgba(49, 49, 49, 1)' },
  cardWrapper: { alignSelf: 'center' },
  tripCard: { width: moderateScale(330), height: verticalScale(130), padding: 10, borderRadius: 20, marginTop: -60, borderWidth: 1, flexDirection: 'column', borderColor: 'rgba(217, 135, 28, 0.4)' },
  tripInfoRow: { flexDirection: 'row', gap: 10 },
  tripImage: { width: moderateScale(50), height: verticalScale(50), borderRadius: 10 },
  titleRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  title: { fontSize: textScale(14), fontFamily: FONTS.MetropolicBold, color: 'rgba(52, 22, 73, 1)' },
  iconWrapper: { marginLeft: 5 },
  dateText: { fontSize: textScale(10), color: '#374151', fontFamily: FONTS.MetropolicMedium },
  divider: { width: moderateScale('100%'), borderColor: 'rgba(107, 61, 1, 0.1)', borderWidth: 1, top: 10 },
  teamRow: { flexDirection: 'row', marginTop: 14, width: moderateScale(147), height: 34 },
  memberImage: { width: moderateScale(30), height: verticalScale(30), borderRadius: 25, marginRight: -10, marginTop: 10 },
  noDataText: { color: '#9CA3AF', marginTop: 10 },
  tabsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10,paddingHorizontal:30 },
  tabButton: { alignItems: 'center', width: moderateScale('33%'), paddingVertical: 10 },
  tabText: { fontSize: textScale(12), color: 'rgba(49, 49, 49, 1)', fontFamily: FONTS.MetropolicSemibold },
  activeTabText: { color: '#ED8701', borderBottomWidth: 2, borderBottomColor: '#ED8701', paddingBottom: 5 },
  
  dateCard: { 
    backgroundColor: '#FFF', 
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    overflow: 'hidden',
  },
  dateCardDropTarget: { 
    backgroundColor: '#FFF9E6', 
    borderWidth: 2, 
    borderColor: '#ED8701', 
    borderStyle: 'dashed',
  },
  dateLeft: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingVertical: 12, 
    paddingHorizontal: 16,
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  date: { flexDirection: 'row', gap: 4, alignItems: 'center' },
  d: { 
    fontFamily: FONTS.MetropolicBold, 
    fontSize: textScale(12), 
    color: '#ED8701', 
    letterSpacing: 1 
  },
  placesCount: { 
    fontSize: textScale(10), 
    fontFamily: FONTS.MetropolicMedium, 
    color: '#999',
  },
  placesList: { padding: 12, gap: 10 },
  placeCardSmall: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F8F8F8', 
    borderRadius: 10,
    padding: 10,
    gap: 10,
    marginBottom: 8,
  },
  placeCardDragging: {
    opacity: 0.3,
  },
  placeImageSmall: { width: 45, height: 45, borderRadius: 8 },
  rc: { flexDirection: 'column', gap: 4, flex: 1 },
  placeNameSmall: { 
    fontSize: textScale(12), 
    fontFamily: FONTS.MetropolicSemibold, 
    color: '#333' 
  },
  placeDetailsRowSmall: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ratingSmall: { 
    fontSize: textScale(10), 
    fontFamily: FONTS.MetropolicMedium, 
    color: '#FFB800' 
  },
  entryFeeSmall: { 
    fontSize: textScale(10), 
    fontFamily: FONTS.MetropolicMedium, 
    color: '#666' 
  },
  removePlaceBtn: { 
    padding: 6,
  },
  addPlaceButtonMain: { 
    marginTop: 20, 
    marginBottom: 40,
    paddingVertical: 14, 
    alignItems: 'center', 
    borderWidth: 1.5, 
    borderColor: '#ED8701', 
    borderRadius: 12, 
    borderStyle: 'dashed' 
  },
  addPlaceTextMain: { 
    fontSize: textScale(13), 
    fontFamily: FONTS.MetropolicSemibold, 
    color: '#ED8701' 
  },
  noDatesContainer: { paddingVertical: 60, alignItems: 'center' },
  noDatesText: { 
    fontSize: textScale(14), 
    fontFamily: FONTS.MetropolicSemibold, 
    color: '#999', 
    marginBottom: 8 
  },
  noDatesSubText: { 
    fontSize: textScale(12), 
    fontFamily: FONTS.MetropolicMedium, 
    color: '#CCC', 
    textAlign: 'center' 
  },
  draggingOverlay: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: DRAG_CARD_WIDTH,
    minHeight: DRAG_CARD_HEIGHT,
  },
  draggingImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  draggingText: {
    fontSize: textScale(12),
    fontWeight: '500',
    color: '#333',
    fontFamily: FONTS.MetropolicMedium,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContent: { 
    backgroundColor: '#FFF', 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    padding: 20, 
    maxHeight: verticalScale('80%') 
  },
  searchInputContainer: { 
    backgroundColor: '#F5F5F5', 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: '#EFEFEF', 
    paddingHorizontal: 12, 
    marginBottom: 20, 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  searchInput: { 
    fontSize: textScale(12), 
    fontFamily: FONTS.MetropolicMedium, 
    color: '#333', 
    paddingVertical: 12, 
    flex: 1,
    marginLeft: 8,
  },
  placeCardRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12, 
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  placeImageRow: { width: 50, height: 50, borderRadius: 8 },
  placeInfoRow: { flex: 1 },
  placeNameRow: { fontSize: textScale(13), fontFamily: FONTS.MetropolicSemibold, color: '#313131' },
  placeDetailsRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: 4 },
  ratingRow: { fontSize: textScale(11), fontFamily: FONTS.MetropolicMedium, color: '#FFB800' },
  reviewsRow: { fontSize: textScale(10), fontFamily: FONTS.MetropolicMedium, color: '#666' },
  entryFeeRow: { fontSize: textScale(11), fontFamily: FONTS.MetropolicMedium, color: '#999' },
  addButtonRow: { 
    backgroundColor: '#ED8701', 
    paddingHorizontal: 14, 
    paddingVertical: 6, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  addButtonTextRow: { fontSize: textScale(11), fontFamily: FONTS.MetropolicMedium, color: '#FFF' },
  removeButtonRow: { 
    backgroundColor: '#F5F5F5', 
    paddingHorizontal: 14, 
    paddingVertical: 6, 
    borderWidth: 0.7, 
    borderColor: '#DDD', 
    alignItems: 'center', 
    borderRadius: 8 
  },
  removeButtonTextRow: { fontSize: textScale(11), color: '#999', fontFamily: FONTS.MetropolicMedium },

  // Additional styles – keep your existing styles unchanged
  giftCardContainer: { height: verticalScale(90), paddingHorizontal: 18, paddingVertical: 18, backgroundColor: '#FFF9F1', marginTop: 20, borderRadius: 12 },
  giftCard: { height: verticalScale(57), borderRadius: 12, borderWidth: 1, paddingVertical: 8, paddingHorizontal: 8, backgroundColor: '#FFF', borderColor: '#31313133' },
  giftTextContainer: { flexDirection: 'column', gap: 2 },
  giftText: { fontSize: textScale(10), fontFamily: FONTS.MetropolicMedium, left: 45, color: '#171725' },
  giftSender: { fontSize: textScale(10), fontFamily: FONTS.MetropolicSemibold, left: 65, color: '#171725' },
  budgetSection: { borderBottomWidth: 4, borderColor: '#f4f3f3', marginTop: 10, paddingBottom: 15 },
  sectionHeaderText: { fontSize: textScale(10), letterSpacing: 2, fontFamily: FONTS.MetropolicBold, color: 'rgba(52, 22, 73, 0.8)', marginBottom: 10 },
  budgetCardsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  budgetCard: { flex: 1, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center' },
  totalBudgetCard: { backgroundColor: 'rgba(255, 250, 244, 1)', borderWidth: 1, borderColor: 'rgba(239, 216, 188, 1)' },
  spentBudgetCard: { backgroundColor: 'rgba(236, 255, 243, 1)', borderWidth: 1, borderColor: 'rgba(200, 239, 214, 1)' },
  budgetCardLabel: { fontSize: textScale(10), fontFamily: FONTS.MetropolicSemibold, color: 'rgba(23, 23, 37, 1)' },
  totalBudgetAmount: { fontSize: textScale(12), fontFamily: FONTS.MetropolicBold, color: '#ED8701', letterSpacing: 0.1 },
  spentBudgetAmount: { fontSize: textScale(12), fontFamily: FONTS.MetropolicBold, color: '#058835', letterSpacing: 0.1 },
  vehicleSection: { flexDirection: 'column', gap: 2, paddingVertical: 8, borderBottomWidth: 4, borderBottomColor: '#EFEFEF', top: 20 },
  addVehicleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  addIconContainer: { width: moderateScale(40), height: verticalScale(40), alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFEED94D', borderRadius: 10 },
  plusIcon: { width: moderateScale(20), height: verticalScale(20) },
  addVehicleText: { fontSize: verticalScale(12), fontFamily: FONTS.MetropolicSemibold, color: '#ED8701' },
  vehicleItem: { flexDirection: 'row', gap: 12, marginTop: 10 },
  vehicleIconContainer: { width: moderateScale(40), height: verticalScale(40), backgroundColor: 'rgba(237, 135, 1, 0.08)', alignItems: 'center', justifyContent: 'center', borderRadius: 13 },
  fastagIconContainer: { backgroundColor: '#DBFAE9', width: moderateScale(40), height: verticalScale(40), alignItems: 'center', justifyContent: 'center', borderRadius: 13 },
  vehicleIcon: { width: moderateScale(22), height: verticalScale(22), borderRadius: 12 },
  vehicleDetails: { flexDirection: 'column' },
  vehicleTitle: { fontSize: textScale(13), fontFamily: FONTS.sfprobold, color: '#341649' },
  vehicleSubtitle: { fontSize: textScale(11), fontFamily: FONTS.MetropolicMedium, color: 'rgba(52, 22, 73, 0.8)' },
  thingsToCarrySection: { borderBottomWidth: 4, borderBottomColor: '#EFEFEF', top: 30, flexDirection: 'column', gap: 10, paddingVertical: 8 },
  thingsToCarryTitle: { fontSize: textScale(12), fontFamily: FONTS.MetropolicBold, letterSpacing: 2, color: 'rgba(52, 22, 73, 0.8)' },
  addItemRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  addItemText: { fontSize: textScale(12), fontFamily: FONTS.MetropolicSemibold, color: '#ED8701' },
  add: { flexDirection: 'column', gap: 20, borderBottomWidth: 4, borderBottomColor: '#EFEFEF', top: 40, paddingVertical: 8 },
  addtitle: { fontSize: textScale(10), fontFamily: FONTS.MetropolicBold, letterSpacing: 2, color: 'rgba(52, 22, 73, 0.8)' },
  addrow: { flexDirection: 'row', gap: 10 },
  adddetail: { width: moderateScale(80), height: verticalScale(60), borderWidth: 1, borderColor: 'rgba(49, 49, 49, 0.2)', borderRadius: 10, paddingVertical: 5, alignItems: 'center' },
  t: { fontSize: textScale(11), fontFamily: FONTS.regular, color: '#341649' },
  gt: { flexDirection: 'column', paddingVertical: 8, gap: 6, top: 50 },
  gd: { fontSize: textScale(10), fontFamily: FONTS.MetropolicBold, letterSpacing: 2, color: 'rgba(52, 22, 73, 0.8)' },
  id: { width: '100%', height: verticalScale(150), borderRadius: 10 },
  sg: { fontSize: textScale(12), fontFamily: FONTS.MetropolicSemibold, color: '#ED8701' },
  expenseSubTabsContainer: { flexDirection: 'row', marginTop: 20, marginBottom: 10, borderWidth: 1, backgroundColor: '#FFF', borderRadius: 8, borderColor: '#F1F1F5', width: moderateScale(300), alignSelf: 'center' },
  expenseSubTabButton: { flex: 1, alignItems: 'center', justifyContent: 'center'},
  expenseSubTabText: { fontSize: textScale(12), fontFamily: FONTS.MetropolicMedium, letterSpacing: 0.2, color: 'rgba(105, 105, 116, 1)' },
  activeExpenseSubTabText: { color: '#FFF', backgroundColor: '#de8f27', borderRadius: 8, paddingHorizontal: 18, paddingVertical: 6 },
  expenseR: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, padding: 10, marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#EFEFEF' },
  expenseIconContainer: { width: moderateScale(30), height: verticalScale(30), borderRadius: 100, backgroundColor: 'rgba(255, 173, 41, 0.17)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  expenseIcon: { width: moderateScale(14), height: verticalScale(14) },
  expenseR1: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  expenseC: { flex: 1 },
  expenseTitle: { fontSize: textScale(12), fontFamily: FONTS.MetropolicSemibold, color: 'rgba(49, 49, 49, 1)' },
  expensePaidRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  expensePaidBy: { fontSize: textScale(9), fontFamily: FONTS.MetropolicRegular, color: '#999' },
  expenseAmount: { fontSize: textScale(10), fontFamily: FONTS.MetropolicMedium, color: '#333' },
  expenseC1: { alignItems: 'flex-end' },
  expenseBorrowedText: { fontSize: textScale(10), fontFamily: FONTS.MontRegular, color: '#EF4020' },
  expenseBorrowedAmount: { fontSize: textScale(10), fontFamily: FONTS.MetropolicSemibold, color: '#EF4020' },
  expenseOwedText: { fontSize: textScale(10), fontFamily: FONTS.MontRegular, color: '#0DA305' },
  expenseOwedAmount: { fontSize: textScale(10), fontFamily: FONTS.MetropolicSemibold, color: '#0DA305' },
  expensebt: { alignSelf: 'flex-end', width: moderateScale(110), height: verticalScale(40), alignItems: 'center', justifyContent: 'center', backgroundColor: '#ED8701', borderRadius: 8 },
  expensebtText: { color: '#FFF', fontSize: textScale(14), fontFamily: FONTS.sfprosemibold },
  egc: { flexDirection: 'column', gap: 8 },
  youBorrowedC: { flexDirection: 'row', justifyContent: 'space-between' },
  bc: { backgroundColor: 'rgba(250, 250, 250, 0.2)', width: moderateScale(160), borderRadius: 10, borderWidth: 1, borderColor: 'rgba(210, 210, 210, 0.4)', alignItems: 'center' },
  brc: { flexDirection: 'row', gap: 4, padding: 10 },
  youBorrowed: { fontSize: textScale(10), letterSpacing: 0.1, fontFamily: FONTS.MetropolicSemibold, color: '#171725' },
  youBorrowedA: { fontSize: textScale(8), fontFamily: FONTS.MetropolicBold, color: '#ED8701', letterSpacing: 0.1 },
  youOwedA: { fontSize: textScale(8), fontFamily: FONTS.MetropolicBold, color: '#058835', letterSpacing: 0.1 },
  allFriendsT: { fontSize: textScale(10), fontFamily: FONTS.MetropolicBold, color: 'rgba(52, 22, 73, 0.8)', marginBottom: 10, alignSelf: 'flex-start', letterSpacing: 2, marginTop: 10 },
  fr: { 
  flexDirection: 'row', 
  gap: 12, 
  alignItems: 'center',
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: '#EFEFEF',
},
imr: { 
  width: moderateScale(45), 
  height: verticalScale(45), 
  borderRadius: 25,
  backgroundColor: '#F0F0F0',
},
fr1: { 
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
friendInfoContainer: {
  flex: 1,
},
friendName: { 
  fontSize: textScale(14), 
  fontFamily: FONTS.MetropolicSemibold, 
  color: '#313131',
  marginBottom: 4,
},
frc: { 
  flexDirection: 'column', 
  alignItems: 'flex-end',
},
amountRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
},
friendL: { 
  fontSize: textScale(12), 
  fontFamily: FONTS.MetropolicRegular, 
  color: '#0DA305' 
},
friendLl: { 
  color: '#0DA305', 
  fontSize: textScale(12), 
  fontFamily: FONTS.MetropolicSemibold 
},
friendB: { 
  fontSize: textScale(12), 
  fontFamily: FONTS.MetropolicRegular, 
  color: '#EF4020' 
},
friendL2: { 
  color: '#EF4020', 
  fontSize: textScale(12), 
  fontFamily: FONTS.MetropolicSemibold 
},
  settleUp: { backgroundColor: '#ED8701', width: moderateScale(200), borderRadius: 12, paddingVertical: 14, alignSelf: 'center', alignItems: 'center', marginTop: 16 },
  settleUpT: { fontSize: textScale(14), fontFamily: FONTS.MetropolicSemibold, color: '#FFF' },
  categoriesTitle: { fontSize: textScale(12), fontFamily: FONTS.MetropolicMedium, color: 'rgba(52, 22, 73, 0.7)', marginBottom: 16 },
  categoriesRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  categoryItem: { alignItems: 'center', width: moderateScale(90), height: verticalScale(100), borderWidth: 1, borderColor: '#EAEAEA', paddingVertical: 5, borderRadius: 10 },
  categoryIcon: { width: moderateScale(50), height: verticalScale(50), borderRadius: 25 },
  categoryAmount: { fontSize: textScale(10), fontFamily: FONTS.Interbold, color: '#171725', letterSpacing: 0.1 },
  categoryName: { fontSize: textScale(10), fontFamily: FONTS.InterRegular, color: '#696974', letterSpacing: 0.08 },
  dragHandleContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 10 },
  dragHandle: { width: moderateScale(40), height: 4, backgroundColor: '#DDD', borderRadius: 2 },
  settleModalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '90%', width: '100%', position: 'absolute', bottom: 0 },
  settleModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#EFEFEF' },
  settleModalTitle: { fontSize: textScale(18), fontFamily: FONTS.MetropolicBold, color: '#341649' },
  settleTotalCard: { backgroundColor: '#FFF9F1', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#EFD8BC', marginBottom: 24 },
  settleTotalLabel: { fontSize: textScale(12), fontFamily: FONTS.MetropolicMedium, color: '#666', marginTop: 4 },
  settleTotalAmount: { fontSize: textScale(24), fontFamily: FONTS.MetropolicBold, color: '#ED8701' },
  settleSectionTitle: { fontSize: textScale(14), fontFamily: FONTS.MetropolicBold, color: '#341649', marginBottom: 12 },
  settleFriendItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#F9F9F9', borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#EFEFEF' },
  settleSelectedFriend: { backgroundColor: '#FFF5E8', borderColor: '#ED8701' },
  settleFriendName: { fontSize: textScale(14), fontFamily: FONTS.MetropolicSemibold, color: '#333' },
  settleFriendAmount: { fontSize: textScale(12), fontFamily: FONTS.MetropolicMedium, color: '#666', marginTop: 2 },
  settleAmountContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EFEFEF', borderRadius: 12, paddingHorizontal: 16, backgroundColor: '#F9F9F9', marginBottom: 24 },
  settleCurrencySymbol: { fontSize: textScale(18), fontFamily: FONTS.MetropolicBold, color: '#ED8701', marginRight: 8 },
  settleAmountInput: { flex: 1, fontSize: textScale(18), fontFamily: FONTS.MetropolicBold, color: '#333', paddingVertical: 12 },
  settlePaymentContainer: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  settlePaymentOption: { flex: 1, paddingVertical: 10, alignItems: 'center', backgroundColor: '#F9F9F9', borderRadius: 10, borderWidth: 1, borderColor: '#EFEFEF' },
  settleSelectedPayment: { backgroundColor: '#ED8701', borderColor: '#ED8701' },
  settlePaymentText: { fontSize: textScale(13), fontFamily: FONTS.MetropolicMedium, color: '#666' },
  settleSelectedPaymentText: { color: '#FFF' },
  settleProceedButton: { backgroundColor: '#ED8701', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 8, marginBottom: 20 },
  settleProceedText: { fontSize: textScale(14), fontFamily: FONTS.sfprosemibold, color: '#FFF' },
  expenseModalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '90%', width: '100%', position: 'absolute', bottom: 0 },
  expenseModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#EFEFEF' },
  expenseModalTitle: { fontSize: textScale(16), fontFamily: FONTS.MetropolicBold, color: '#341649' },
  expenseInputLabel: { fontSize: textScale(14), fontFamily: FONTS.MetropolicMedium, color: '#333', marginBottom: 8, marginTop: 16 },
  expenseInput: { borderWidth: 1, borderColor: '#EFEFEF', borderRadius: 10, paddingHorizontal: 15, paddingVertical: 12, fontSize: 14, fontFamily: FONTS.MetropolicMedium, color: '#333', backgroundColor: '#F9F9F9' },
  expenseAmountContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EFEFEF', borderRadius: 10, paddingHorizontal: 15, backgroundColor: '#F9F9F9' },
  expenseCurrencySymbol: { fontSize: textScale(16), fontFamily: FONTS.MetropolicBold, color: '#ED8701', marginRight: 8 },
  expenseAmountInput: { flex: 1, fontSize: textScale(14), fontFamily: FONTS.MetropolicBold, color: '#333', paddingVertical: 12 },
  expenseDateBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#EFEFEF', borderRadius: 10, paddingHorizontal: 15, paddingVertical: 12, backgroundColor: '#F9F9F9' },
  expenseDateText: { fontSize: textScale(12), fontFamily: FONTS.MetropolicMedium, color: '#333' },
  splitSubtitle: { fontSize: textScale(10), fontFamily: FONTS.MetropolicMedium, color: '#999', marginBottom: 12 },
  splitMemberItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  splitMemberInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  splitMemberImage: { width: moderateScale(40), height: verticalScale(40), borderRadius: 20 },
  splitMemberName: { fontSize: textScale(12), fontFamily: FONTS.MetropolicMedium, color: '#333' },
  checkbox: { width: moderateScale(22), height: verticalScale(22), borderRadius: 6, borderWidth: 2, borderColor: '#DDD', alignItems: 'center', justifyContent: 'center' },
  checkboxSelected: { backgroundColor: '#ED8701', borderColor: '#ED8701' },
  checkmark: { color: '#FFF', fontSize: textScale(12), fontWeight: 'bold' },
  addExpenseBtn: { backgroundColor: '#ED8701', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 24, marginBottom: 20 },
  addExpenseBtnText: { fontSize: textScale(14), fontFamily: FONTS.MetropolicBold, color: '#FFF' },
  calendarModalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  calendarModalContent: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, width: moderateScale('90%'), maxHeight: verticalScale('80%') },
  calendarModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#EFEFEF' },
  calendarModalTitle: { fontSize: textScale(16), fontFamily: FONTS.MetropolicBold, color: '#341649' },
  calendarConfirmBtn: { backgroundColor: '#ED8701', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  calendarConfirmBtnText: { fontSize: textScale(12), fontFamily: FONTS.MetropolicBold, color: '#FFF' },
  countryPickerOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  countryPickerContent: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, width: moderateScale('90%'), maxHeight: verticalScale('80%') },
  countryPickerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#EFEFEF' },
  countryPickerTitle: { fontSize: textScale(16), fontFamily: FONTS.MetropolicBold, color: '#341649' },
  countrySearchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 10, paddingHorizontal: 15, marginBottom: 15 },
  countrySearchInput: { flex: 1, fontSize: textScale(12), fontFamily: FONTS.MetropolicMedium, color: '#333', paddingVertical: 10, marginLeft: 8 },
  countryList: { maxHeight: verticalScale(400) },
  countryItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  countryInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  countrySymbol: { fontSize: textScale(16), fontFamily: FONTS.MetropolicBold, color: '#ED8701', width: moderateScale(40) },
  countryName: { fontSize: textScale(12), fontFamily: FONTS.MetropolicMedium, color: '#333' },
  countryCode: { fontSize: textScale(10), fontFamily: FONTS.MetropolicRegular, color: '#999' },
  currencySelector: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingRight: 12, borderRightWidth: 1, borderRightColor: '#EFEFEF', marginRight: 12 },
  checkMark: { fontSize: textScale(16), color: '#ED8701', fontWeight: 'bold' },
  modalHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
  paddingBottom: 15,
  borderBottomWidth: 1,
  borderBottomColor: '#EFEFEF',
},
modalTitle: {
  fontSize: textScale(16),
  fontFamily: FONTS.MetropolicBold,
  color: '#341649',
},
modalInput: {
  borderWidth: 1,
  borderColor: '#EFEFEF',
  borderRadius: 10,
  paddingHorizontal: 15,
  paddingVertical: 12,
  fontSize: textScale(14),
  fontFamily: FONTS.MetropolicMedium,
  color: '#333',
  backgroundColor: '#F9F9F9',
  marginBottom: 20,
},
modalButton: {
  backgroundColor: '#ED8701',
  paddingVertical: 14,
  borderRadius: 10,
  alignItems: 'center',
},
modalButtonText: {
  fontSize: textScale(14),
  fontFamily: FONTS.MetropolicBold,
  color: '#FFF',

},
itemsContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 10,
  marginBottom: 15,
},
itemTag: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#F5F5F5',
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 20,
  gap: 8,
},
itemTagText: {
  fontSize: textScale(12),
  fontFamily: FONTS.MetropolicMedium,
  color: '#333',
},
addFriendButton: {
  marginTop: 10,
  paddingVertical: 12,
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#ED8701',
  borderRadius: 10,
  borderStyle: 'dashed',
  marginBottom: 20,
},
addFriendText: {
  fontSize: textScale(13),
  fontFamily: FONTS.MetropolicSemibold,
  color: '#ED8701',
},
modalHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
  paddingBottom: 15,
  borderBottomWidth: 1,
  borderBottomColor: '#EFEFEF',
},
modalTitle: {
  fontSize: textScale(16),
  fontFamily: FONTS.MetropolicBold,
  color: '#341649',
},
modalInput: {
  borderWidth: 1,
  borderColor: '#EFEFEF',
  borderRadius: 10,
  paddingHorizontal: 15,
  paddingVertical: 12,
  fontSize: textScale(14),
  fontFamily: FONTS.MetropolicMedium,
  color: '#333',
  backgroundColor: '#F9F9F9',
  marginBottom: 20,
},
modalButton: {
  backgroundColor: '#ED8701',
  paddingVertical: 14,
  borderRadius: 10,
  alignItems: 'center',
},
modalButtonText: {
  fontSize: textScale(14),
  fontFamily: FONTS.MetropolicBold,
  color: '#FFF',
},
});

export default TripDetailView;