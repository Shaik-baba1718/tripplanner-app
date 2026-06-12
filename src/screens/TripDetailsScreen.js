import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import images from "../assets";
import {
  moderateScale,
  verticalScale,
  textScale
} from "../styles/responsiveSize";
import {
  ArrowLeft,
  Car,
  LocateFixed,
  Bike,
  Train,
  Bus,
  PlaneTakeoff,
  ChevronDown,
  CalendarDays,
  Navigation,
  Image as ImageIcon,
  X,
  MapPin,
  Trash2,
  Circle,
  CheckCircle,
  Images,
  Camera,
} from "lucide-react-native";
import { Calendar } from "react-native-calendars";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Contacts from "react-native-contacts";
import { FONTS } from "../../global";
import { PermissionsAndroid, Platform } from 'react-native';
const TripDetailsScreen = ({ navigation, route }) => {

  const editTrip = route?.params?.trip || null;
  const editIndex = route?.params?.tripIndex ?? null;
  const isEditMode = !!editTrip;

  const [destination, setDestination] = useState("");
  const [from, setFrom] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [budget, setBudget] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState("car");
  const [tripImage, setTripImage] = useState(null);
  
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedMode, setSelectedMode] = useState("from");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [pnrNumber, setPnrNumber] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showVehicleDetailsModal, setShowVehicleDetailsModal] = useState(false);
  const [newVehicleNumber, setNewVehicleNumber] = useState("");
  const [tempVehicleNumber, setTempVehicleNumber] = useState("");
  const [savedVehicles, setSavedVehicles] = useState([]);
  
  const [vehicleType, setVehicleType] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [vehicleTypeDropdownVisible, setVehicleTypeDropdownVisible] = useState(false);
  const [averageMileage, setAverageMileage] = useState("");
  const [bankDropdownVisible, setBankDropdownVisible] = useState(false);

  const [combinedDate, setCombinedDate] = useState("");
  const [showImageOptions, setShowImageOptions] = useState(false);

  const bankOptions = [
    "ICICI Bank", "HDFC Bank", "SBI Bank", "Axis Bank",
    "Paytm Payments Bank", "Kotak Mahindra Bank", "Yes Bank"
  ];
  
  const [fromSearchQuery, setFromSearchQuery] = useState("");
  const [destSearchQuery, setDestSearchQuery] = useState("");
  const [showFromResults, setShowFromResults] = useState(false);
  const [showDestResults, setShowDestResults] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  
  const locations = [
    { name: "Hyderabad", state: "Telangana", country: "India" },
    { name: "Bangalore", state: "Karnataka", country: "India" },
    { name: "Chennai", state: "Tamil Nadu", country: "India" },
    { name: "Mumbai", state: "Maharashtra", country: "India" },
    { name: "Delhi", state: "Delhi", country: "India" },
    { name: "Goa", state: "Goa", country: "India" },
    { name: "Pune", state: "Maharashtra", country: "India" },
    { name: "Kerala", state: "Kerala", country: "India" },
    { name: "Kolkata", state: "West Bengal", country: "India" },
    { name: "Ahmedabad", state: "Gujarat", country: "India" },
    { name: "Jaipur", state: "Rajasthan", country: "India" },
    { name: "Lucknow", state: "Uttar Pradesh", country: "India" },
    { name: "Patna", state: "Bihar", country: "India" },
    { name: "Bhopal", state: "Madhya Pradesh", country: "India" },
    { name: "Chandigarh", state: "Chandigarh", country: "India" },
    { name: "Nagpur", state: "Maharashtra", country: "India" },
    { name: "Indore", state: "Madhya Pradesh", country: "India" },
    { name: "Coimbatore", state: "Tamil Nadu", country: "India" },
  ];

  const filteredFromLocations = locations.filter(location =>
    location.name.toLowerCase().includes(fromSearchQuery.toLowerCase())
  );
  const filteredDestLocations = locations.filter(location =>
    location.name.toLowerCase().includes(destSearchQuery.toLowerCase())
  );

  useEffect(() => {
    loadSavedVehicles();
  }, []);

  useEffect(() => {
    if (fromDate && toDate) {
      setCombinedDate(`${formatDisplayDate(fromDate)} - ${formatDisplayDate(toDate)}`);
    } else if (fromDate && !toDate) {
      setCombinedDate(`${formatDisplayDate(fromDate)} - Select End Date`);
    } else if (!fromDate && toDate) {
      setCombinedDate(`Select Start Date - ${formatDisplayDate(toDate)}`);
    } else {
      setCombinedDate("Select Date Range");
    }
  }, [fromDate, toDate]);

  const loadSavedVehicles = async () => {
    try {
      const vehicles = await AsyncStorage.getItem("SAVED_VEHICLES");
      if (vehicles) {
        setSavedVehicles(JSON.parse(vehicles));
      }
    } catch (error) {
      console.log("Error loading vehicles:", error);
    }
  };

  const saveVehiclesToStorage = async (vehicles) => {
    try {
      await AsyncStorage.setItem("SAVED_VEHICLES", JSON.stringify(vehicles));
    } catch (error) {
      console.log("Error saving vehicles:", error);
    }
  };

  useEffect(() => {
    if (editTrip) {
      setFrom(editTrip.from || "");
      setFromSearchQuery(editTrip.from || "");
      setDestination(editTrip.destination || "");
      setDestSearchQuery(editTrip.destination || "");
      setSelected(editTrip.travelMode || "car");
      setSelectedVehicle(editTrip.vehicle || "");
      setVehicleNumber(editTrip.vehicleNumber || "");
      setPnrNumber(editTrip.pnrNumber || "");
      setBudget(editTrip.budget || "");
      setTripImage(editTrip.tripImage || null);
      setTeamMembers(editTrip.teamMembers || []);
      if (editTrip.fromDate) setFromDate(editTrip.fromDate);
      if (editTrip.toDate) setToDate(editTrip.toDate);
    }
  }, [editTrip]);

  const transportData = [
    { id: "car", icon: Car },
    { id: "bike", icon: Bike },
    { id: "train", icon: Train },
    { id: "bus", icon: Bus },
    { id: "plane", icon: PlaneTakeoff },
  ];

  const formatDisplayDate = (date) => {
    if (!date) return "Select Date";
    const d = new Date(date);
    return d.toDateString();
  };

  const formatDateForSave = (date) => {
    if (!date) return null;
    if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return date;
    }
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const generateAllDatesArray = (from, to) => {
    if (!from || !to) return [];
    const dates = [];
    let currentDate = new Date(from);
    const endDate = new Date(to);
    currentDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const handleDateSelect = (day) => {
    const selectedDate = day.dateString;
    if (selectedMode === "from") {
      setFromDate(selectedDate);
      setToDate(null);
      setTimeout(() => {
        setSelectedMode("to");
      }, 100);
    } else {
      if (fromDate && selectedDate >= fromDate) {
        setToDate(selectedDate);
        setTimeout(() => {
          setShowCalendar(false);
        }, 200);
      }
    }
  };

  const getMarkedDates = () => {
    const marked = {};
    if (fromDate) {
      marked[fromDate] = { startingDay: true, color: "#ED8701", textColor: "#FFF" };
    }
    if (toDate) {
      marked[toDate] = { endingDay: true, color: "#ED8701", textColor: "#FFF" };
    }
    if (fromDate && toDate) {
      let currentDate = new Date(fromDate);
      const endDate = new Date(toDate);
      while (currentDate < endDate) {
        const dateString = currentDate.toISOString().split("T")[0];
        if (dateString !== fromDate && dateString !== toDate) {
          marked[dateString] = { color: "#FFF5E8", textColor: "#ED8701" };
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    return marked;
  };

  const resetDates = () => {
    setFromDate(null);
    setToDate(null);
  };

  const addNewVehicle = () => {
    setShowVehicleModal(false);
    setTimeout(() => {
      setShowVehicleDetailsModal(true);
    }, 100);
  };

  const saveVehicleDetails = () => {
    if (tempVehicleNumber && vehicleType) {
      const newVehicle = {
        id: Date.now().toString(),
        number: tempVehicleNumber.toUpperCase(),
        type: vehicleType,
        bank: vehicleType === "4 Wheeler" ? selectedBank : "",
        mileage: averageMileage,
      };
      
      const updatedVehicles = [...savedVehicles, newVehicle];
      setSavedVehicles(updatedVehicles);
      saveVehiclesToStorage(updatedVehicles);
      setVehicleNumber(tempVehicleNumber.toUpperCase());
      setShowVehicleDetailsModal(false);
      setTempVehicleNumber("");
      setNewVehicleNumber("");
      setVehicleType("");
      setSelectedBank("");
      setAverageMileage("");
      setTimeout(() => {
        setShowVehicleModal(true);
      }, 200);
    }
  };

  // Remove vehicle from saved list
const removeVehicle = async (vehicleId) => {
  try {
    const updatedVehicles = savedVehicles.filter(vehicle => vehicle.id !== vehicleId);
    setSavedVehicles(updatedVehicles);
    await AsyncStorage.setItem("SAVED_VEHICLES", JSON.stringify(updatedVehicles));
  } catch (error) {
    console.log("Error removing vehicle:", error);
  }
};

 // Open camera directly
const openCamera = async () => {
  // Request camera permission for Android
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "Camera Permission",
        message: "App needs camera access to take photos",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      return;
    }
  }

  launchCamera({ mediaType: "photo", quality: 1 }, (response) => {
    if (response.didCancel) {
      return;
    } else if (response.assets && response.assets.length > 0) {
      setTripImage(response.assets[0].uri);
    }
  });
};

// Open gallery directly
const openGallery = () => {
  launchImageLibrary({ mediaType: "photo", quality: 1 }, (response) => {
    if (response.didCancel) return;
    if (response.assets && response.assets.length > 0) {
      setTripImage(response.assets[0].uri);
    }
  });
};

  const pickContact = async () => {
    try {
      const permission = await Contacts.requestPermission();
      if (permission === "authorized") {
        const contactList = await Contacts.getAll();
        setContacts(contactList);
        setShowContacts(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addTeamMember = (contact) => {
    const alreadyExists = teamMembers.find((m) => m.id === contact.recordID);
    if (!alreadyExists) {
      setTeamMembers((prev) => [
        ...prev,
        {
          id: contact.recordID,
          name: contact.displayName,
          image: contact.thumbnailPath || "https://i.pravatar.cc/150",
        },
      ]);
    }
  };

  const removeTeamMember = (memberId) => {
    setTeamMembers((prev) => prev.filter((member) => member.id !== memberId));
  };

  const saveTripData = async () => {
    try {
      if (!from || !destination || !fromDate || !toDate) return;

      const formattedFromDate = formatDateForSave(fromDate);
      const formattedToDate = formatDateForSave(toDate);
      const allDatesArray = generateAllDatesArray(formattedFromDate, formattedToDate);

      const newTrip = {
        id: editTrip?.id || Date.now().toString(),
        from: from,
        destination: destination,
        travelMode: selected || "car",
        vehicle: selectedVehicle,
        vehicleNumber: vehicleNumber,
        pnrNumber: pnrNumber,
        fromDate: formattedFromDate,
        toDate: formattedToDate,
        allDates: allDatesArray,
        tripDate: `${formatDisplayDate(fromDate)} - ${formatDisplayDate(toDate)}`,
        budget: budget,
        tripImage: tripImage,
        status: editTrip?.status || "ongoing",
        teamMembers: teamMembers.map((member) => ({
          id: member.id,
          name: member.name,
          image: member.image || "",
        })),
      };

      const oldData = await AsyncStorage.getItem("TRIP_DATA");
      let parsedData = oldData ? JSON.parse(oldData) : [];
      
      if (isEditMode && editIndex !== null) {
        parsedData[editIndex] = newTrip;
      } else {
        parsedData = [...parsedData, newTrip];
      }
      
      await AsyncStorage.setItem("TRIP_DATA", JSON.stringify(parsedData));
      navigation.replace("TripScreen");
    } catch (error) {
      console.log("SAVE ERROR:", error);
    }
  };

  const selectFromLocation = (location) => {
    setFrom(location.name);
    setFromSearchQuery(location.name);
    setShowFromResults(false);
  };

  const selectDestinationLocation = (location) => {
    setDestination(location.name);
    setDestSearchQuery(location.name);
    setShowDestResults(false);
  };

  const handleFromTextChange = (text) => {
    setFromSearchQuery(text);
    setShowFromResults(text.length > 0);
    if (text === "") setFrom("");
  };

  const handleDestTextChange = (text) => {
    setDestSearchQuery(text);
    setShowDestResults(text.length > 0);
    if (text === "") setDestination("");
  };
return (
  <View style={{ backgroundColor: "#fff", flex: 1 }}>
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color="#341649" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditMode ? "Edit Trip" : "New Trip"}</Text>
      </View>

      <Text style={styles.trip}>TRIP DETAILS</Text>
      <Text style={styles.sectionTitle}>Choose Destination</Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ backgroundColor: "#fff", paddingBottom: 20 }}>
        <View style={styles.box}>
          <View style={styles.inner}>
            <View style={styles.column}>
              <LocateFixed color={"rgba(179, 173, 173, 0.7)"} size={15} />
              <View style={styles.iconSeparator} />
              <Navigation color={"rgba(179, 173, 173, 0.7)"} size={15} />
            </View>
            <View style={styles.column2}>
              <TextInput
                style={styles.input}
                placeholder="Enter Source"
                placeholderTextColor="#999"
                value={fromSearchQuery}
                onChangeText={handleFromTextChange}
              />
              <View style={styles.divider} />
              <TextInput
                style={styles.input}
                placeholder="Enter Destination"
                placeholderTextColor="#999"
                value={destSearchQuery}
                onChangeText={handleDestTextChange}
              />
            </View>
          </View>
        </View>

        {showFromResults && fromSearchQuery.length > 0 && (
          <View style={styles.searchResultsContainer}>
            <ScrollView style={{ maxHeight: 100 }} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={true}>
              {filteredFromLocations.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.searchResultItem}
                  onPress={() => selectFromLocation(item)}
                >
                  <MapPin size={16} color="#81817f" />
                  <View style={styles.searchResultTextContainer}>
                    <Text style={styles.searchResultText}>{item.name}</Text>
                    <Text style={styles.searchResultSubText}>{item.state}, {item.country}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {showDestResults && destSearchQuery.length > 0 && (
          <View style={styles.searchResultsContainer}>
            <ScrollView style={{ maxHeight: 100 }} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={true}>
              {filteredDestLocations.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.searchResultItem}
                  onPress={() => selectDestinationLocation(item)}
                >
                  <MapPin size={16} color="#81817f" />
                  <View style={styles.searchResultTextContainer}>
                    <Text style={styles.searchResultText}>{item.name}</Text>
                    <Text style={styles.searchResultSubText}>{item.state}, {item.country}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <Text style={styles.subTitle}>Travel Mode</Text>
        <View style={styles.modeBox}>
          {transportData.map((item) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelected(item.id)}
                style={[styles.iconButton, selected === item.id && { backgroundColor: "#FFECCF" }]}
              >
                <Icon size={22} color={selected === item.id ? "#ED8701" : "#999"} />
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.subTitle}>
          {selected === "car" && "Enter Car Number"}
          {selected === "bike" && "Enter Bike Number"}
          {selected === "train" && "Train PNR Number"}
          {selected === "bus" && "Bus Booking ID"}
          {selected === "plane" && "Flight PNR Number"}
        </Text>

        {(selected === "car" || selected === "bike") && (
          <TouchableOpacity
            style={styles.commonBox}
            onPress={() => setShowVehicleModal(true)}
            activeOpacity={0.7}
          >
            <TextInput
              placeholder={`Select or Add ${selected === "car" ? "Car" : "Bike"}`}
              placeholderTextColor="#999"
              value={vehicleNumber}
              editable={false}
              pointerEvents="none"
              style={styles.input}
            />
            <ChevronDown size={20} color="#ED8701" />
          </TouchableOpacity>
        )}

        {selected === "train" && (
          <View style={styles.commonBox}>
            <TextInput
              placeholder="Enter Train PNR Number"
              placeholderTextColor="#999"
              value={pnrNumber}
              onChangeText={setPnrNumber}
              keyboardType="numeric"
              style={styles.commonInput}
            />
          </View>
        )}

        {selected === "bus" && (
          <View style={styles.commonBox}>
            <TextInput
              placeholder="Enter Bus Booking ID"
              placeholderTextColor="#999"
              value={pnrNumber}
              onChangeText={setPnrNumber}
              style={styles.commonInput}
            />
          </View>
        )}

        {selected === "plane" && (
          <View style={styles.commonBox}>
            <TextInput
              placeholder="Enter Flight PNR Number"
              placeholderTextColor="#999"
              value={pnrNumber}
              onChangeText={setPnrNumber}
              keyboardType="numeric"
              style={styles.commonInput}
            />
          </View>
        )}

        <Text style={styles.subTitle}>Trip Date Range</Text>
        <TouchableOpacity
          style={styles.commonBox}
          onPress={() => {
            if (!fromDate || (fromDate && toDate)) {
              setSelectedMode("from");
            } else if (fromDate && !toDate) {
              setSelectedMode("to");
            }
            setShowCalendar(true);
          }}
        >
          <Text style={combinedDate !== "Select Date Range" ? styles.dateText : styles.placeholderText}>
            {combinedDate}
          </Text>
          <CalendarDays size={20} color="#ED8701" />
        </TouchableOpacity>

        {fromDate && toDate && (
          <View style={styles.rangeContainer}>
            <Text style={styles.rangeText}>Trip Duration: {formatDisplayDate(fromDate)} to {formatDisplayDate(toDate)}</Text>
            <TouchableOpacity onPress={resetDates} style={styles.resetButton}>
              <X size={16} color="#ff4444" />
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.subTitle}>Trip Budget</Text>
        <View style={styles.commonBox}>
          <TextInput
            placeholder="Enter Budget"
            value={budget}
            onChangeText={setBudget}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <Text style={styles.subTitle}>Trip Image</Text>
        <TouchableOpacity style={styles.imageUploadBox} onPress={() => setShowImageOptions(true)}>
          {tripImage ? (
            <Image source={{ uri: tripImage }} style={styles.uploadedImage} />
          ) : (
            <>
              <ImageIcon size={26} color="#999" />
              <Text style={{ marginTop: 8, color: "#999" }}>Upload Image</Text>
            </>
          )}
        </TouchableOpacity>
        <Modal
  animationType="slide"
  transparent={true}
  visible={showImageOptions}
  onRequestClose={() => setShowImageOptions(false)}
>
<View style={{ flex:1, justifyContent: "flex-end" }}>
  <View style={{ backgroundColor: "#c9c0c0", borderRadius: 20, width: "100%", flexDirection: "row", padding: 20, alignItems: "center", justifyContent: "space-around",height:verticalScale(150) }}>
    <TouchableOpacity 
      onPress={() => {
        setShowImageOptions(false);
        openCamera();
      }}
    >
      <Camera size={50} color={"#be2323"} />
    </TouchableOpacity>

    <TouchableOpacity 
      onPress={() => {
        setShowImageOptions(false);
        openGallery();
      }}
    >
      <Images size={50} color={"#be2323"} />
    </TouchableOpacity>
  </View>
</View>
   

</Modal>

        <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", marginTop: 10 }}>
          {teamMembers.map((member, index) => (
            <Image
              key={member.id || index}
              source={member.image ? { uri: member.image } : images.profile}
              style={{ width: 40, height: 40, borderRadius: 20, marginLeft: index === 0 ? 0 : -10, borderWidth: 1, borderColor: "#FFF" }}
            />
          ))}
        </View>

        <TouchableOpacity onPress={pickContact} style={styles.inviteBox}>
          <Text style={styles.inviteText}>INVITE TEAM MEMBERS</Text>
        </TouchableOpacity>

        {showContacts && contacts.length > 0 && (
          <View style={styles.contactsContainer}>
            <View style={styles.contactsHeader}>
              <Text style={styles.contactsTitle}>Select Contacts</Text>
              <TouchableOpacity onPress={() => setShowContacts(false)}><X size={20} color="#333" /></TouchableOpacity>
            </View>
            <FlatList
              data={contacts.slice(0, 15)}
              keyExtractor={(item, index) => item.recordID || index.toString()}
              renderItem={({ item }) => {
                const alreadyExists = teamMembers.some((m) => m.id === item.recordID);
                return (
                  <TouchableOpacity
                    onPress={() => { if (!alreadyExists) addTeamMember(item); }}
                    style={[styles.contactItem, alreadyExists && styles.contactItemDisabled]}
                    disabled={alreadyExists}
                  >
                    <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                      <Image source={item?.thumbnailPath ? { uri: item.thumbnailPath } : images.thumbnailPath} style={{ width: 28, height: 28, borderRadius: 14, marginLeft: 5 }} />
                      <Text style={styles.contactName}>{item.displayName}</Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}

        <TouchableOpacity onPress={saveTripData} style={styles.saveBtn}>
          <Text style={{ color: "#FFF" }}>{isEditMode ? "Update Trip" : "Create Trip"}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Calendar Modal */}
      <Modal animationType="slide" transparent={true} visible={showCalendar} onRequestClose={() => setShowCalendar(false)}>
        <TouchableWithoutFeedback onPress={() => setShowCalendar(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select {selectedMode === "from" ? "Start" : "End"} Date</Text>
                  <TouchableOpacity onPress={() => setShowCalendar(false)}><X size={24} color="#333" /></TouchableOpacity>
                </View>
                <Calendar onDayPress={handleDateSelect} markedDates={getMarkedDates()} markingType={"period"} />
                <View style={styles.modalButtons}>
                  <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowCalendar(false)}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={() => setShowCalendar(false)}>
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Vehicle Modal */}
      <Modal animationType="slide" transparent={true} visible={showVehicleModal} onRequestClose={() => setShowVehicleModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.vehicleModalContent}>
            <View style={styles.vehicleModalHeader}>
              <Text style={styles.vehicleModalTitle}>Select Vehicle</Text>
              <TouchableOpacity onPress={() => setShowVehicleModal(false)}><X size={24} color="#333" /></TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.addVehicleBtn} onPress={addNewVehicle}>
              <Text style={styles.addVehicleBtnText}>+ Add New Vehicle</Text>
            </TouchableOpacity>

            {tempVehicleNumber ? (
              <View style={styles.pendingVehicleContainer}>
                <Text style={styles.pendingVehicleLabel}>New Vehicle Pending:</Text>
                <Text style={styles.pendingVehicleNumber}>{tempVehicleNumber}</Text>
              </View>
            ) : null}

            {savedVehicles.length > 0 && (
              <>
                <Text style={styles.savedVehiclesTitle}>Your Vehicles</Text>
                {savedVehicles.map((vehicle) => (
                  <View key={vehicle.id} style={styles.savedVehicleItem}>
                    <View style={styles.savedVehicleSelect}>
                      <TouchableOpacity
                        style={styles.savedVehicleRadio}
                        onPress={() => {
                          setVehicleNumber(vehicle.number);
                          setSelectedVehicleId(vehicle.id);
                          setShowVehicleModal(false);
                        }}
                      >
                        {selectedVehicleId === vehicle.id ? (
                          <CheckCircle size={18} color="#f08f10" />
                        ) : (
                          <Circle size={18} color="#999" />
                        )}
                      </TouchableOpacity>
                      <Text style={styles.savedVehicleNumber}>{vehicle.number}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteVehicleBtn}
                      onPress={() => removeVehicle(vehicle.id)}
                    >
                      <Trash2 size={18} color="#ff4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Vehicle Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showVehicleDetailsModal}
        onRequestClose={() => setShowVehicleDetailsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.vehicleDetailsModalContent}>
            <View style={styles.vehicleModalHeader}>
              <Text style={styles.vehicleModalTitle}>Add Vehicle Details</Text>
              <TouchableOpacity onPress={() => setShowVehicleDetailsModal(false)}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Vehicle Number *</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Enter Vehicle Number"
                placeholderTextColor="#999"
                value={tempVehicleNumber}
                onChangeText={setTempVehicleNumber}
                autoCapitalize="characters"
              />

              <Text style={styles.inputLabel}>Vehicle Type *</Text>
              <TouchableOpacity
                style={styles.dropdownField}
                onPress={() => setVehicleTypeDropdownVisible(!vehicleTypeDropdownVisible)}
              >
                <Text style={vehicleType ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {vehicleType || "Select Vehicle Type"}
                </Text>
                <ChevronDown size={20} color={vehicleTypeDropdownVisible ? "#ED8701" : "#999"} />
              </TouchableOpacity>

              {vehicleTypeDropdownVisible && (
                <View style={styles.vehicleTypeDropdownList}>
                  <TouchableOpacity
                    style={styles.vehicleTypeOption}
                    onPress={() => {
                      setVehicleType("2 Wheeler");
                      setVehicleTypeDropdownVisible(false);
                    }}
                  >
                    <Text style={styles.vehicleTypeOptionText}>🏍️ 2 Wheeler</Text>
                    {vehicleType === "2 Wheeler" && (
                      <Text style={styles.checkMark}>✓</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.vehicleTypeOption}
                    onPress={() => {
                      setVehicleType("4 Wheeler");
                      setVehicleTypeDropdownVisible(false);
                    }}
                  >
                    <Text style={styles.vehicleTypeOptionText}>🚗 4 Wheeler</Text>
                    {vehicleType === "4 Wheeler" && (
                      <Text style={styles.checkMark}>✓</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}

              {vehicleType === "4 Wheeler" && (
                <>
                  <Text style={styles.inputLabel}>Fastag Banking Partner</Text>
                  <TouchableOpacity
                    style={styles.dropdownField}
                    onPress={() => setBankDropdownVisible(!bankDropdownVisible)}
                  >
                    <Text style={selectedBank ? styles.dropdownText : styles.dropdownPlaceholder}>
                      {selectedBank || "Select Fastag Banking Partner"}
                    </Text>
                    <ChevronDown size={20} color={bankDropdownVisible ? "#ED8701" : "#999"} />
                  </TouchableOpacity>

                  {bankDropdownVisible && (
                    <View style={styles.bankDropdownList}>
                      <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 200 }}>
                        {bankOptions.map((bank) => (
                          <TouchableOpacity
                            key={bank}
                            style={styles.bankOption}
                            onPress={() => {
                              setSelectedBank(bank);
                              setBankDropdownVisible(false);
                            }}
                          >
                            <Text style={styles.bankOptionText}>{bank}</Text>
                            {selectedBank === bank && (
                              <Text style={styles.checkMark}>✓</Text>
                            )}
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </>
              )}

              <Text style={styles.inputLabel}>Average Mileage (km/l)</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Enter Average Mileage"
                placeholderTextColor="#999"
                value={averageMileage}
                onChangeText={setAverageMileage}
                keyboardType="numeric"
              />

              <TouchableOpacity style={styles.saveVehicleBtn} onPress={saveVehicleDetails}>
                <Text style={styles.saveVehicleBtnText}>Save Vehicle</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  </View>
);}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF",padding:15 },
  header: { flexDirection: "row", alignItems: "center", borderTopWidth: 0.8, borderBottomWidth: 0.8, borderColor: "#EFEFEF", paddingVertical: 10 },
  headerTitle: { fontSize: textScale(15), fontFamily: FONTS.Interbold, color: "#341649", marginLeft: 10 },
  trip: { fontSize: textScale(10), letterSpacing: 2, marginVertical: 10, color: "#341649" },
  sectionTitle: { fontSize: 13, marginBottom: 10, fontFamily: FONTS.MetropolicMedium },
  box: { width: "100%", height: "auto", minHeight: verticalScale(110), borderWidth: 1, borderColor: "#DDD", borderRadius: 12 },
  inner: { padding: 10, flexDirection: "row" },
  column: { justifyContent: "space-evenly" },
  column2: { marginLeft: 10, flex: 1 },
  input: { fontSize: textScale(12), paddingVertical: 10, paddingHorizontal: 5 },
  divider: { borderBottomWidth: 0.8, width: "100%", borderColor: "rgba(244, 244, 244, 1)", marginVertical: 5 },
  iconSeparator: { borderLeftWidth: 0.7, borderColor: "rgba(179, 173, 173, 0.7)", height: 20, alignSelf: "center", marginVertical: 3 },
  searchResultsContainer: { backgroundColor: "#FFF", borderRadius: 12, borderWidth: 1, borderColor: "#E5E5E5", marginTop: 15, marginBottom: 15, padding: 10, elevation: 2 },
  searchResultItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 5, borderBottomWidth: 1, borderBottomColor: "#F5F5F5", gap: 12 },
  searchResultTextContainer: { flex: 1, marginLeft: 8 },
  searchResultText: { fontSize: textScale(12), fontFamily: FONTS.MetropolicMedium, color: "#333" },
  searchResultSubText: { fontSize: textScale(10), fontFamily: FONTS.MetropolicRegular, color: "#999", marginTop: 2 },
  noResultsText: { textAlign: "center", paddingVertical: 20, color: "#999", fontSize: 14 },
  subTitle: { marginTop: 20, marginBottom: 10, fontSize: textScale(12), fontFamily: FONTS.MetropolicMedium, color: "rgba(16, 16, 16, 1)" },
  modeBox: { flexDirection: "row", justifyContent: "space-between", borderWidth: 1, borderColor: "#DDD", borderRadius: 10, padding: 5 },
  iconButton: { padding: 10, borderRadius: 10 },
  commonBox: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 0.7, backgroundColor: "#FFF", borderColor: "rgba(237, 237, 237, 1)", borderRadius: 10, height: 55, paddingHorizontal: 10 },
  commonInput: { flex: 1 },
  imageUploadBox: { height: 120, borderWidth: 1, borderStyle: "dashed", borderRadius: 10, justifyContent: "center", alignItems: "center" },
  uploadedImage: { width: "100%", height: "100%", borderRadius: 10 },
  imageOptionsContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
},
imageOptionsCard: {
  backgroundColor: "#FFF",
  borderRadius: 12,
  width: "80%",
  overflow: "hidden",
},
imageOption: {
  paddingVertical: 16,
  alignItems: "center",
},
imageOptionText: {
  fontSize: 16,
  fontFamily: FONTS.MetropolicMedium,
  color: "#333",
},
cancelOptionText: {
  fontSize: 16,
  fontFamily: FONTS.MetropolicMedium,
  color: "#FF4444",
},
optionDivider: {
  height: 1,
  backgroundColor: "#F0F0F0",
},
  inviteBox: { marginTop: 20, height: 60, backgroundColor: "rgba(239, 239, 239, 1)", justifyContent: "center", alignItems: "center", borderRadius: 10 },
  inviteText: { color: "rgba(52, 22, 73, 0.8)", fontSize: textScale(12), fontFamily: FONTS.MetropolicBold, letterSpacing: 2 },
  contactsContainer: { marginTop: 15, backgroundColor: "#FFF", borderRadius: 12, borderWidth: 1, borderColor: "#EFEFEF", maxHeight: 400 },
  contactsHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 15, borderBottomWidth: 1, borderBottomColor: "#EFEFEF" },
  contactsTitle: { fontSize: textScale(12), fontFamily: FONTS.MetropolicBold, color: "#341649" },
  contactItem: { flexDirection: "row", alignItems: "center", padding: 15, borderBottomWidth: 1, borderBottomColor: "#EEE" },
  contactItemDisabled: { opacity: 0.5 },
  contactName: { flex: 1, fontSize: textScale(12), color: "#333" },
  saveBtn: { height: verticalScale(50), backgroundColor: "#ED8701", justifyContent: "center", alignItems: "center", borderRadius: 10, marginTop: 10, width:'100%' },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#FFF", borderRadius: 20, padding: 20, width: "90%", maxHeight: "80%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 18, fontFamily: FONTS.MetropolicBold, color: "#341649" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", gap: 10, marginTop: 20 },
  modalButton: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  cancelButton: { backgroundColor: "#F5F5F5" },
  cancelButtonText: { fontSize: 14, color: "#666", fontFamily: FONTS.MetropolicMedium },
  confirmButton: { backgroundColor: "#ED8701" },
  confirmButtonText: { fontSize: 14, color: "#FFF", fontFamily: FONTS.MetropolicBold },
  dateText: { fontSize: textScale(12), color: "#333", fontFamily: FONTS.MetropolicMedium },
  placeholderText: { fontSize: textScale(12), color: "#999", fontFamily: FONTS.MetropolicMedium },
  rangeContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#FFF5E8", borderRadius: 10, padding: 12, marginTop: 15 },
  rangeText: { fontSize: textScale(12), color: "#ED8701", fontFamily: FONTS.MetropolicMedium, flex: 1 },
  resetButton: { flexDirection: "row", alignItems: "center", gap: 4 },
  resetText: { fontSize: textScale(12), color: "#ff4444", fontFamily: FONTS.MetropolicMedium },
  
  pendingVehicleContainer: { backgroundColor: "#FFF5E8", borderRadius: 10, padding: 12, marginTop: 15, marginBottom: 15, borderWidth: 1, borderColor: "#ED8701" },
  pendingVehicleLabel: { fontSize: 12, fontFamily: FONTS.MetropolicMedium, color: "#666", marginBottom: 4 },
  pendingVehicleNumber: { fontSize: 16, fontFamily: FONTS.MetropolicBold, color: "#ED8701" },
  
  vehicleModalContent: { backgroundColor: "#FFF", borderRadius: 20, padding: 20, width: "90%" },
  vehicleModalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: "#EFEFEF" },
  vehicleModalTitle: { fontSize: textScale(14), fontFamily: FONTS.MetropolicBold, color: "#341649" },
  addVehicleBtn: { borderWidth: 1, borderColor: "#aba0a0", paddingVertical: 14, borderRadius: 10, alignItems: "center", marginBottom: 20 },
  addVehicleBtnText: { fontSize: textScale(13), fontFamily: FONTS.MetropolicBold, color: "#ED8701" },
  savedVehiclesTitle: { fontSize: textScale(13), fontFamily: FONTS.MetropolicBold, color: "#341649", marginTop: 10, marginBottom: 10 },
  
  savedVehicleItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#F9F9F9", borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: "#EFEFEF", paddingHorizontal: 12, paddingVertical: 10 },
  savedVehicleSelect: { flexDirection: "row", alignItems: "center", flex: 1 },
  savedVehicleRadio: { marginRight: 12 },
  savedVehicleNumber: { fontSize: 14, fontFamily: FONTS.MetropolicSemibold, color: "#333", flex: 1 },
  deleteVehicleBtn: { padding: 8 },
  
  vehicleDetailsModalContent: { backgroundColor: "#FFF", borderRadius: 20, padding: 20, width: "90%", maxHeight: "85%" },
  inputLabel: { fontSize: 13, fontFamily: FONTS.MetropolicMedium, color: "#333", marginBottom: 8, marginTop: 12 },
  inputField: { borderWidth: 1, borderColor: "#EFEFEF", borderRadius: 10, paddingHorizontal: 15, paddingVertical: 12, fontSize: 14, fontFamily: FONTS.MetropolicMedium, color: "#333", backgroundColor: "#F9F9F9" },
  dropdownField: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#EFEFEF", borderRadius: 10, paddingHorizontal: 15, paddingVertical: 12, backgroundColor: "#F9F9F9" },
  dropdownText: { fontSize: 14, fontFamily: FONTS.MetropolicMedium, color: "#333" },
  dropdownPlaceholder: { fontSize: 14, fontFamily: FONTS.MetropolicMedium, color: "#999" },
  bankDropdownList: { backgroundColor: "#FFF", borderRadius: 10, borderWidth: 1, borderColor: "#EFEFEF", marginTop: 5, maxHeight: 200 },
  bankOption: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: "#F5F5F5" },
  bankOptionText: { fontSize: 14, fontFamily: FONTS.MetropolicMedium, color: "#333" },
  checkMark: { fontSize: 14, color: "#ED8701", fontWeight: "bold" },
  saveVehicleBtn: { backgroundColor: "#ED8701", paddingVertical: 14, borderRadius: 10, alignItems: "center", marginTop: 20, marginBottom: 10 },
  saveVehicleBtnText: { fontSize: 14, fontFamily: FONTS.MetropolicBold, color: "#FFF" },
  
  vehicleTypeDropdownList: { backgroundColor: "#FFF", borderRadius: 10, borderWidth: 1, borderColor: "#EFEFEF", marginTop: 5, maxHeight: 150, overflow: "hidden" },
  vehicleTypeOption: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: "#F5F5F5" },
  vehicleTypeOptionText: { fontSize: 14, fontFamily: FONTS.MetropolicMedium, color: "#333" },
});

export default TripDetailsScreen;