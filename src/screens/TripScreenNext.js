import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  Alert
} from "react-native";

import { moderateScale, verticalScale,textScale } from "../styles/responsiveSize";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  Car,
  Bike,
  Train,
  Bus,
  PlaneTakeoff,
  Wallet,
  Ellipsis,
  ShieldEllipsis,
  PencilOff,
  Dot,
  Trash,
  Crown,
  Sparkles,
  X
} from "lucide-react-native";
import RazorpayCheckout from 'react-native-razorpay';
import { FONTS } from "../../global";
import images from "../assets";

const TripTabs = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("ongoing");
  const [tripData, setTripData] = useState([]);
  const [showTripOptions, setShowTripOptions] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedTripIndex, setSelectedTripIndex] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("monthly"); 
  const [selectedTripId, setSelectedTripId] = useState(null);
  // LOAD TRIPS
  const loadTrips = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem("TRIP_DATA");
      const parsed = data ? JSON.parse(data) : [];

      // SAFE ARRAY CHECK
      if (Array.isArray(parsed)) {
        setTripData(parsed);
      } else {
        setTripData([]);
      }
    } catch (error) {
      console.log("LOAD ERROR:", error);
      setTripData([]);
    }
  }, []);

  // SCREEN FOCUS
  useEffect(() => {
    loadTrips();

    const unsubscribe = navigation.addListener("focus", () => {
      loadTrips();
    });

    return unsubscribe;
  }, [navigation, loadTrips]);

  // REFRESH
 

  // FILTER DATA
  const filteredTrips = Array.isArray(tripData)
    ? tripData.filter((item) => item?.status === activeTab)
    : [];

  // ICON
  const renderIcon = (mode) => {
    const size = 14;

    switch (mode) {
      case "car":
        return <Car size={size} color="#ED8701" />;
      case "bike":
        return <Bike size={size} color="#ED8701" />;
      case "train":
        return <Train size={size} color="#ED8701" />;
      case "bus":
        return <Bus size={size} color="#ED8701" />;
      case "plane":
        return <PlaneTakeoff size={size} color="#ED8701" />;
      default:
        return null;
    }
  };
  // End Trip function
const endTrip = async () => {
  try {
    const data = await AsyncStorage.getItem("TRIP_DATA");
    const trips = data ? JSON.parse(data) : [];
    
    const updatedTrips = trips.map((trip) => {
      if (trip.id === selectedTripId) {
        return { ...trip, status: "completed" };
      }
      return trip;
    });
    
    await AsyncStorage.setItem("TRIP_DATA", JSON.stringify(updatedTrips));
    loadTrips();
    setShowTripOptions(false);
    
  } catch (error) {
    console.log("Error ending trip:", error);
  }
};

// Delete Trip function
const deleteTrip = async () => {
  try {
    // Get current trips
    const data = await AsyncStorage.getItem("TRIP_DATA");
    const trips = data ? JSON.parse(data) : [];
    
    // Remove the selected trip
    const updatedTrips = trips.filter((trip) => trip.id!== selectedTripId);
    
    // Save back to storage
    await AsyncStorage.setItem("TRIP_DATA", JSON.stringify(updatedTrips));
    
    // Reload trips
    loadTrips();
    
   
  } catch (error) {
    console.log("Error deleting trip:", error);
    
  }
};
// Payment function for Razorpay
const handlePayment = () => {
  const planAmount = selectedPlan === "monthly" ? 299 : 2499;
  const planName = selectedPlan === "monthly" ? "Monthly" : "Yearly";
  
  var options = {
    description: `Upgrade to ${planName} Plan`,
    image: 'https://your-app-logo-url.com/coins.png', // Replace with your app logo URL
    currency: 'INR',
    key: 'rzp_test_SqkpVJobSPxZ9E', // Replace with your Razorpay test key
    amount: planAmount * 100, // Amount in paisa (multiply by 100)
    name: 'Food Delivery App',
    prefill: {
      email: 'user@example.com',
      contact: '9999999999',
      name: 'User Name'
    },
    theme: {
      color: '#ED8701'
    }
  };
  
  RazorpayCheckout.open(options)
    .then((data) => {
      // Payment success
      console.log('Payment Success:', data);
      alert(`Payment successful! Upgraded to ${planName} plan for ₹${planAmount}`);
      setShowUpgradeModal(false);
      // Save upgrade status to AsyncStorage
      saveUpgradeStatus(planName, planAmount);
    })
    .catch((error) => {
      // Payment failure
      console.log('Payment Error:', error);
      alert('Payment failed. Please try again.');
    });
};

// Save upgrade status to AsyncStorage
const saveUpgradeStatus = async (planName, amount) => {
  try {
    const upgradeData = {
      isUpgraded: true,
      plan: planName,
      amount: amount,
      date: new Date().toISOString(),
      expiryDate: new Date(Date.now() + (planName === "Yearly" ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString()
    };
    await AsyncStorage.setItem('UPGRADE_STATUS', JSON.stringify(upgradeData));
    console.log('Upgrade status saved:', upgradeData);
  } catch (error) {
    console.log('Error saving upgrade status:', error);
  }
};

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      
    >
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.c}>
          <Text style={styles.title}>My Trips</Text>

          <View style={styles.walletContainer}>
            <Wallet size={14} color="rgba(52, 22, 73, 1)" />
            <Text style={styles.walletText}>250</Text>
            <Image
              source={images.coins}
              style={styles.coinImage}
              resizeMode="contain"
            />
          </View>
        </View>
         

        {/* TABS */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab("ongoing")}
            style={[
              styles.tabButton,
              styles.tabButtonLeft,
              {
                backgroundColor:
                  activeTab === "ongoing" ? "#ED8701" : "#F3F4F6",
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === "ongoing" ? "#FFF" : "rgba(105, 105, 116, 1)",
                },
              ]}
            >
              Ongoing
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("completed")}
            style={[
              styles.tabButton,
              styles.tabButtonRight,
              {
                backgroundColor:
                  activeTab === "completed" ? "#ED8701" : "#F3F4F6",
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === "completed" ? "#FFF" : "rgba(105, 105, 116, 1)",
                },
              ]}
            >
              Completed
            </Text>
          </TouchableOpacity>
        </View>

        {/* TRIPS LIST */}
        {filteredTrips.length > 0 ? (
         [...filteredTrips].reverse().map((item, index) => {// to add trip at top every time
            return (
              <TouchableOpacity
                key={String(index)}
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate("TripDetailView", {
                    trip: item,
                  })
                }
              >
                <View style={styles.tripCard}>
                  {/* IMAGE */}
                  {item?.tripImage ? (
                    <Image
                      source={{
                        uri: item.tripImage,
                      }}
                      style={styles.tripImage}
                    />
                  ) : (
                    <View style={[styles.tripImage, styles.noImageContainer]}>
                      <Text style={styles.noImageText}>No Image</Text>
                    </View>
                  )}

                  {/* CONTENT */}
                  <View style={styles.rightContent}>
                    <View style={styles.topRow}>
                      <Text style={styles.title1}>
                        {typeof item?.destination === "string"
                          ? item.destination
                          : "No Destination"}
                      </Text>
                   <View style={styles.travelMode}> {renderIcon(item?.travelMode)}</View>
                       
                     
                    </View>

                    <Text style={styles.subText}>
                      {typeof item?.tripDate === "string" ? item.tripDate : ""}
                    </Text>

                    {/* TEAM MEMBERS */}
                    {Array.isArray(item?.teamMembers) &&
                      item.teamMembers.length > 0 && (
                        <View style={styles.teamContainer}>
                          {item.teamMembers.slice(0, 3).map((member, i) => (
                            <Image
                              key={String(i)}
                              source={{
                                uri: member?.image || "https://i.pravatar.cc/150",
                              }}
                              style={[
                                styles.memberImage,
                                {
                                  marginLeft: i === 0 ? 0 : -8,
                                },
                              ]}
                            />
                          ))}
                          {item.teamMembers.length > 3 && (
                            <Text style={styles.moreMembers}>
                              +{item.teamMembers.length - 3}
                            </Text>
                          )}
                        </View>
                      )}
                  </View>

                  {/* EDIT BUTTON */}
                  <TouchableOpacity
                    style={styles.editButton}
                     onPress={() => {
                            setSelectedTrip(item);
                              setSelectedTripId(item.id); 
                             setShowTripOptions(true);
                                    }}
                  >
                   <Ellipsis color="rgba(49, 49, 49, 0.7)" size={14} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No {activeTab === "ongoing" ? "Ongoing" : "Completed"} Trips
            </Text>
            <Text style={styles.emptySubText}>
              Tap the button below to create your first trip
            </Text>
          </View>
        )}

        {/* NEW TRIP BUTTON */}
       <TouchableOpacity
          style={styles.newTripButton}
          onPress={() => navigation.navigate("TripDetailsScreen")}
        >
          <Text style={styles.newTripButtonText}>+ New Trip</Text>
        </TouchableOpacity>
      </View>
      {/* Trip Options Modal */}
<Modal
  animationType="fade"
  transparent={true}
  visible={showTripOptions}
  onRequestClose={() => setShowTripOptions(false)}
>
  <TouchableOpacity 
    style={styles.modalOverlay} 
    activeOpacity={1} 
    onPress={() => setShowTripOptions(false)}
  >
    <View style={styles.optionsContainer}>
      
        {/* Upgrade Trip */}
        <TouchableOpacity 
          style={styles.optionItem}
          onPress={() => {
            setShowTripOptions(false);
            setShowUpgradeModal(true);
          }}
        >
          <ShieldEllipsis size={18} color={"#ED8701"}></ShieldEllipsis>
          <Text style={styles.optionText}>Upgrade Trip</Text>
        </TouchableOpacity>
        
        <View style={styles.optionDivider} />
        
        {/* Edit Trip */}
        {/* Edit Trip */}
<TouchableOpacity 
  style={styles.optionItem}
  onPress={() => {
    setShowTripOptions(false);
    // Find the actual index of the trip for editing
    const actualIndex = tripData.findIndex(t => t.id === selectedTripId);
    navigation.navigate("TripDetailsScreen", {
      trip: selectedTrip,
      tripIndex: actualIndex,
    });
  }}
>
  <PencilOff size={18} color={"red"}/>
  <Text style={styles.optionText}>Edit Trip</Text>
</TouchableOpacity>
        
        <View style={styles.optionDivider} />
        
        {/* End Trip */}
       <TouchableOpacity 
  style={styles.optionItem}
  onPress={() => {
    setShowTripOptions(false);
    endTrip();
  }}
>   
  <Dot color={"red"} size={18}/>
  <Text style={styles.optionText}>End Trip</Text>
</TouchableOpacity>
        
        <View style={styles.optionDivider} />
        
        {/* Delete Trip */}
       <TouchableOpacity 
  style={[styles.optionItem, styles.deleteOption]}
  onPress={() => {
    setShowTripOptions(false);
    deleteTrip();
  }}
>
  <Trash color={"red"} size={18}/>
  <Text style={styles.deleteOptionText}>Delete Trip</Text>
</TouchableOpacity>
      
      </View>
  </TouchableOpacity>
</Modal>
{/* Upgrade Trip Modal */}
<Modal
  animationType="slide"
  transparent={true}
  visible={showUpgradeModal}
  onRequestClose={() => setShowUpgradeModal(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.upgradeModalContent}>
      {/* Header */}
      <View style={styles.upgradeModalHeader}>
        <Crown size={24} color="#ED8701" />
        <Text style={styles.upgradeModalTitle}>Upgrade Your Trip</Text>
        <TouchableOpacity onPress={() => setShowUpgradeModal(false)}>
          <X size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Description */}
      <Text style={styles.upgradeDescription}>
        Get more features and enhance your travel experience!
      </Text>

      {/* Premium Features List */}
      <View style={styles.featuresList}>
        <View style={styles.featureItem}>
          <Sparkles size={18} color="#ED8701" />
          <Text style={styles.featureText}>Priority support 24/7</Text>
        </View>
        <View style={styles.featureItem}>
          <Sparkles size={18} color="#ED8701" />
          <Text style={styles.featureText}>Unlimited trip planning</Text>
        </View>
        <View style={styles.featureItem}>
          <Sparkles size={18} color="#ED8701" />
          <Text style={styles.featureText}>Advanced analytics & insights</Text>
        </View>
        <View style={styles.featureItem}>
          <Sparkles size={18} color="#ED8701" />
          <Text style={styles.featureText}>Export trip data</Text>
        </View>
        <View style={styles.featureItem}>
          <Sparkles size={18} color="#ED8701" />
          <Text style={styles.featureText}>Collaborate with team members</Text>
        </View>
      </View>

      {/* Pricing Options */}
      <View style={styles.pricingContainer}>
        <TouchableOpacity style={[styles.pricingCard, styles.monthlyCard,selectedPlan === "monthly" && styles.selectedPlanCard]} onPress={()=> setSelectedPlan("monthly")}>
           {selectedPlan === "monthly" && (
                                               <View style={styles.checkBadge}>
                                                      <Text style={styles.checkText}>✓</Text>
                                                  </View>
                                            )}
          <Text style={styles.pricingPeriod}>Monthly</Text>
          <Text style={styles.pricingPrice}>₹299</Text>
          <Text style={styles.pricingDuration}>/month</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.pricingCard, styles.yearlyCard, selectedPlan === "yearly" && styles.selectedPlanCard]}     onPress={() => setSelectedPlan("yearly")}>
                                    {selectedPlan === "yearly" && (
                                             <View style={styles.checkBadge}>
                                                       <Text style={styles.checkText}>✓</Text>
                                                                   </View>
                                                                   )}
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>POPULAR</Text>
          </View>
          <Text style={styles.pricingPeriod}>Yearly</Text>
          <Text style={styles.pricingPrice}>₹2499</Text>
          <Text style={styles.pricingDuration}>/year (Save 30%)</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.upgradeButtons}>
        <TouchableOpacity 
          style={[styles.upgradeButton, styles.cancelUpgradeButton]}
          onPress={() => setShowUpgradeModal(false)}
        >
          <Text style={styles.cancelUpgradeText}>Maybe Later</Text>
        </TouchableOpacity>
        
                                    <TouchableOpacity 
                                        style={[styles.upgradeButton, styles.confirmUpgradeButton]}
                                        onPress={() => {
                                        handlePayment();
                                             }}
                                        >
                                         <Crown size={16} color="#FFF" />
                                            <Text style={styles.confirmUpgradeText}>Upgrade Now</Text>
                                     </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
 
    </ScrollView>
  );
};

export default TripTabs;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    
    backgroundColor: "#FFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  c: {
    width: "100%",
    height: verticalScale(50),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 0.7,
    borderBottomWidth: 0.7,
    borderColor: "#EFEFEF",
    marginBottom: 15,
  },
  title: {
    fontSize: 15,
    fontFamily: FONTS.Interbold,
    color: "#341649",
  },
  walletContainer: {
    width: moderateScale(90),
    height: verticalScale(30),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF7EC",
    borderRadius: 50,
    paddingHorizontal: 8,
    borderWidth: 0.7,
    borderColor: "#FFC170",
  },
  walletText: {
    fontSize: 12,
    fontFamily: FONTS.sfprobold,
    color: "#313131",
  },
  coinImage: {
    width: 13,
    height: 17,
  },
  tabContainer: {
    flexDirection: "row",
    width: "100%",
    height: 42,
    alignSelf: "center",
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabButtonLeft: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  tabButtonRight: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  tabText: {
    fontSize: 12,
    fontFamily: FONTS.MetropolicMedium,
  },
  tripCard: {
   
    height: verticalScale(100),
    borderWidth: 1,
    borderColor: "#F1F1F1",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    marginTop: 15,
    backgroundColor: "#FFF",
  },
  tripImage: {
    width: 80,
    height: 88,
    borderRadius: 8,
    marginLeft: -10,
    marginRight:10,
  },
  noImageContainer: {
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    fontSize: 10,
    color: "#999",
  },
  rightContent: {
    flex: 1,
    justifyContent: "space-between",
    gap:5
  },
  topRow: {
    flexDirection: "row",
     alignItems:"center"
   
    
 
  },
  title1: {
    fontSize: 12,
    fontFamily: FONTS.MetropolicSemibold,
    color: "rgba(49, 49, 49, 1)",
    flex: 1,
  },
  travelMode:
  {
     left:-100,
  },
 
  subText: {
    fontSize: 10,
    fontFamily: FONTS.MetropolicMedium,
    color: "rgba(102, 102, 102, 0.73)",
  },
  teamContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFF",
  },
  moreMembers: {
    fontSize: 10,
    color: "#666",
    marginLeft: 5,
  },
  editButton: {
    width: 30,
    height: 30,
    backgroundColor: "#FFF",
    borderWidth: 0.6,
    borderColor: "rgba(49, 49, 49, 0.24)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  editButtonText: {
    fontSize: 14,
    color: "rgba(49, 49, 49, 0.7)",
    fontFamily: FONTS.MetropolicBold,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: FONTS.MetropolicBold,
    color: "#9CA3AF",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 12,
    fontFamily: FONTS.MetropolicMedium,
    color: "#D1D5DB",
    textAlign: "center",
  },
  newTripButton: {
    width: moderateScale(120),
    height: verticalScale(50),
    backgroundColor: "#ED8701",
    borderRadius: 10,
    alignSelf:"flex-end",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
   
   
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newTripButtonText: {
    color: "#FFF",
    fontSize: 13,
    fontFamily: FONTS.sfprobold,
  },
  // Modal Styles
modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  justifyContent: "center",
  alignItems: "center",
},
optionsContainer: {
  width: moderateScale("80%"),
  backgroundColor: "#FFF",
  borderRadius: 12,
  overflow: "hidden",
},

optionItem: {
  paddingVertical: 14,
  paddingHorizontal: 20,
  alignItems: "center",
  flexDirection:"row",
  gap:4,
},
optionText: {
  fontSize: 15,
  fontFamily: FONTS.MetropolicMedium,
  color: "#333",
},
optionDivider: {
  height: 1,
  backgroundColor: "#F0F0F0",
},
deleteOption: {
  backgroundColor: "#FFF",
},
deleteOptionText: {
  fontSize: 15,
  fontFamily: FONTS.MetropolicMedium,
  color: "#FF4444",
},
// Upgrade Modal Styles
upgradeModalContent: {
  backgroundColor: "#FFF",
  borderRadius: 24,
  width: moderateScale("90%"),
  padding: 15,
  maxHeight: verticalScale("85%"),
  bottom:-150,
},
upgradeModalHeader: {
  flexDirection: "row",
  alignItems: "center",
 justifyContent:"space-between",
  marginBottom: 15,
},
upgradeModalTitle: {
  fontSize: textScale(14),
  fontFamily: FONTS.MetropolicBold,
  color: "#341649",


},
upgradeDescription: {
  fontSize: textScale(12),
  fontFamily: FONTS.MetropolicMedium,
  color: "#666",
  marginBottom: 15,
  lineHeight: 15,
},
featuresList: {
  marginBottom: 24,
},
featureItem: {
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
  paddingVertical: 8,
  borderBottomWidth: 1,
  borderBottomColor: "#F0F0F0",
},
featureText: {
  fontSize: 12,
  fontFamily: FONTS.MetropolicSemibold,
  color: "#333",
},
pricingContainer: {
  flexDirection: "row",
  gap: 12,
  marginBottom: 24,
},
pricingCard: {
  flex: 1,
  padding: 16,
  borderRadius: 12,
  alignItems: "center",
  position: "relative",
},
monthlyCard: {
  backgroundColor: "#F5F5F5",
  borderWidth: 1,
  borderColor: "#E0E0E0",
},
yearlyCard: {
  backgroundColor: "#F5F5F5",
  borderWidth: 1,
  borderColor: "#E0E0E0",
},
popularBadge: {
  position: "absolute",
  top: -10,
  backgroundColor: "#ED8701",
  paddingHorizontal: 10,
  paddingVertical: 2,
  borderRadius: 12,
},
popularText: {
  fontSize: textScale(8),
  fontFamily: FONTS.MetropolicBold,
  color: "#FFF",
},
pricingPeriod: {
  fontSize: textScale(12),
  fontFamily: FONTS.MetropolicMedium,
  color: "#666",

},
pricingPrice: {
  fontSize: textScale(14),
  fontFamily: FONTS.MetropolicBold,
  color: "#ED8701",
},
pricingDuration: {
  fontSize: 10,
  fontFamily: FONTS.MetropolicMedium,
  color: "#999",

},
upgradeButtons: {
  flexDirection: "row",
  gap: 12,
},
upgradeButton: {
  flex: 1,
  paddingVertical: 12,
  borderRadius: 10,
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "row",
  gap: 8,
},
cancelUpgradeButton: {
  backgroundColor: "#F5F5F5",
  borderWidth: 1,
  borderColor: "#E0E0E0",
},
cancelUpgradeText: {
  fontSize: textScale(12),
  fontFamily: FONTS.MetropolicMedium,
  color: "#666",
},
confirmUpgradeButton: {
  backgroundColor: "#ED8701",
},
confirmUpgradeText: {
  fontSize: textScale(10),
  fontFamily: FONTS.MetropolicBold,
  color: "#FFF",
},

checkBadge: {
  position: "absolute",
  top: -10,
  right: -10,
  width: 24,
  height: 24,
  borderRadius: 12,
  backgroundColor: "#4CAF50",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1,
},
checkText: {
  fontSize: 14,
  color: "#FFF",
  fontWeight: "bold",
},
});