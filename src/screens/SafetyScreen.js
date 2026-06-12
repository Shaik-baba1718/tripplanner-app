import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  TextInput,
  FlatList,
  PermissionsAndroid,
  Platform,
  Linking
} from 'react-native';
import { ArrowLeft, Phone, Car, Users, Shield, ChevronDown, ChevronUp, Search, X, Check, Trash2 } from 'lucide-react-native';
import { textScale, moderateScale, verticalScale } from '../styles/responsiveSize';
import Contacts from 'react-native-contacts';

const SafetyScreen = ({ navigation }) => {
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isVehiclesOpen, setIsVehiclesOpen] = useState(false);
  const [isFamilyOpen, setIsFamilyOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allContacts, setAllContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState({});
  const [showVehicleDetailsModal, setShowVehicleDetailsModal] = useState(false);
  const [vehicleType, setVehicleType] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [vehicleTypeDropdownVisible, setVehicleTypeDropdownVisible] = useState(false);
  const [averageMileage, setAverageMileage] = useState("");
  const [bankDropdownVisible, setBankDropdownVisible] = useState(false);
  const [tempVehicleNumber, setTempVehicleNumber] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [familyModalVisible, setFamilyModalVisible] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [isAddingForFamily, setIsAddingForFamily] = useState(false);
  const [familyEmergencyContacts, setFamilyEmergencyContacts] = useState([]);
  const [tempFamilyMember, setTempFamilyMember] = useState({
    firstName: '',
    lastName: '',
    age: '',
    height: '',
    relation: '',
    gender: '',
    phone: '',
  });
  const [familyErrors, setFamilyErrors] = useState({
    firstName: '',
    lastName: '',
    age: '',
    height: '',
    relation: '',
    gender: '',
    phone: '',
  });

  const bankOptions = [
    "ICICI Bank", "HDFC Bank", "SBI Bank", "Axis Bank",
    "Paytm Payments Bank", "Kotak Mahindra Bank", "Yes Bank"
  ];

  // Request permission and load contacts
  const loadContacts = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Contacts Permission',
            message: 'This app needs access to your contacts to add emergency contacts',
            buttonPositive: 'Allow',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getContacts();
        }
      } else {
        getContacts();
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getContacts = () => {
    Contacts.getAll()
      .then(contacts => {
        setAllContacts(contacts);
        setFilteredContacts(contacts);
      })
      .catch(e => {
        console.log('Failed to load contacts', e);
      });
  };

  const openContactsModal = () => {
    setModalVisible(true);
    setSelectedContacts({});
    loadContacts();
  };

  const openContactsModalForFamily = () => {
    setIsAddingForFamily(true);
    setModalVisible(true);
    setSelectedContacts({});
    loadContacts();
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredContacts(allContacts);
    } else {
      const filtered = allContacts.filter(contact =>
        contact.displayName.toLowerCase().includes(text.toLowerCase()) ||
        (contact.phoneNumbers[0]?.number || '').includes(text)
      );
      setFilteredContacts(filtered);
    }
  };

  const toggleContactSelection = (contact) => {
    const contactId = contact.recordID;
    if (selectedContacts[contactId]) {
      const newSelected = { ...selectedContacts };
      delete newSelected[contactId];
      setSelectedContacts(newSelected);
    } else {
      setSelectedContacts({
        ...selectedContacts,
        [contactId]: {
          id: contact.recordID,
          name: contact.displayName,
          phone: contact.phoneNumbers[0]?.number || '',
        }
      });
    }
  };

  const addSelectedContacts = () => {
    const newContacts = Object.values(selectedContacts);
    
    if (isAddingForFamily) {
      setFamilyEmergencyContacts([...familyEmergencyContacts, ...newContacts]);
      setIsAddingForFamily(false);
    } else {
      setEmergencyContacts([...emergencyContacts, ...newContacts]);
    }
    
    setModalVisible(false);
    setSearchQuery('');
    setSelectedContacts({});
  };

  const openFamilyMemberModal = () => {
    setFamilyModalVisible(true);
    setTempFamilyMember({
      firstName: '',
      lastName: '',
      age: '',
      height: '',
      relation: '',
      gender: '',
      phone: '',
    });
    setFamilyErrors({
      firstName: '',
      lastName: '',
      age: '',
      height: '',
      relation: '',
      gender: '',
      phone: '',
    });
    setFamilyEmergencyContacts([]);
  };

  const saveFamilyMember = () => {
    let errors = {
      firstName: '',
      lastName: '',
      age: '',
      height: '',
      relation: '',
      gender: '',
      phone: '',
    };
    let isValid = true;

    // Validate First Name
    if (!tempFamilyMember.firstName || tempFamilyMember.firstName.trim() === '') {
      errors.firstName = 'First name is required';
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(tempFamilyMember.firstName)) {
      errors.firstName = 'First name should only contain letters';
      isValid = false;
    }

    // Validate Age
    if (!tempFamilyMember.age) {
      errors.age = 'Age is required';
      isValid = false;
    } else if (isNaN(tempFamilyMember.age) || tempFamilyMember.age < 1 || tempFamilyMember.age > 120) {
      errors.age = 'Please enter a valid age (1-120)';
      isValid = false;
    }

    // Validate Relation
    if (!tempFamilyMember.relation || tempFamilyMember.relation.trim() === '') {
      errors.relation = 'Relation is required';
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(tempFamilyMember.relation)) {
      errors.relation = 'Relation should only contain letters';
      isValid = false;
    }

    // Validate Gender
    if (!tempFamilyMember.gender) {
      errors.gender = 'Gender is required';
      isValid = false;
    }

    // Validate Height (if entered)
    if (tempFamilyMember.height && (isNaN(tempFamilyMember.height) || tempFamilyMember.height < 50 || tempFamilyMember.height > 250)) {
      errors.height = 'Please enter a valid height (50-250 cm)';
      isValid = false;
    }

    setFamilyErrors(errors);

    if (!isValid) {
      return;
    }

    const newMember = {
      id: Date.now().toString(),
      firstName: tempFamilyMember.firstName,
      lastName: tempFamilyMember.lastName,
      fullName: `${tempFamilyMember.firstName} ${tempFamilyMember.lastName}`.trim(),
      age: tempFamilyMember.age,
      height: tempFamilyMember.height,
      relation: tempFamilyMember.relation,
      gender: tempFamilyMember.gender,
      phone: tempFamilyMember.phone,
      emergencyContacts: familyEmergencyContacts,
    };
    
    setFamilyMembers([...familyMembers, newMember]);
    setFamilyModalVisible(false);
    
    setTempFamilyMember({
      firstName: '',
      lastName: '',
      age: '',
      height: '',
      relation: '',
      gender: '',
      phone: '',
    });
    setFamilyErrors({
      firstName: '',
      lastName: '',
      age: '',
      height: '',
      relation: '',
      gender: '',
      phone: '',
    });
    setFamilyEmergencyContacts([]);
  };

  const saveVehicle = () => {
    if (!tempVehicleNumber) {
      return;
    }
    const newVehicle = {
      id: Date.now().toString(),
      vehicleNumber: tempVehicleNumber,
      vehicleType: vehicleType,
      bank: selectedBank,
      averageMileage: averageMileage,
    };
    setVehicles([...vehicles, newVehicle]);
    setShowVehicleDetailsModal(false);
    resetVehicleForm();
  };

  const resetVehicleForm = () => {
    setTempVehicleNumber('');
    setVehicleType('');
    setSelectedBank('');
    setAverageMileage('');
    setVehicleTypeDropdownVisible(false);
    setBankDropdownVisible(false);
  };

  const renderVehicle = ({ item }) => (
    <View style={styles.vehicleCard}>
      <View style={styles.vehicleIconContainer}>
        <Car color="#072c76" size={24} />
      </View>
      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleNumber}>{item.vehicleNumber}</Text>
        <Text style={styles.vehicleTypeText}>{item.vehicleType}</Text>
        {item.averageMileage && (
          <Text style={styles.vehicleMileage}>Mileage: {item.averageMileage} km/l</Text>
        )}
      </View>
      <TouchableOpacity onPress={() => removeVehicle(item.id)}>
        <Trash2 color="#FF4444" size={20} />
      </TouchableOpacity>
    </View>
  );
  
  const removeVehicle = (vehicleId) => {
    const filtered = vehicles.filter(v => v.id !== vehicleId);
    setVehicles(filtered);
  };

  const renderEmergencyContact = ({ item }) => (
    <View style={styles.emergencyContactCard}>
      <View style={styles.emergencyContactAvatar}>
        <Text style={styles.emergencyContactAvatarText}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.emergencyContactInfo}>
        <Text style={styles.emergencyContactName}>{item.name}</Text>
        <Text style={styles.emergencyContactPhone}>{item.phone}</Text>
      </View>
      <TouchableOpacity 
        onPress={() => {
          const filtered = emergencyContacts.filter(c => c.id !== item.id);
          setEmergencyContacts(filtered);
        }}
      >
        <Trash2 color="#FF4444" size={20} />
      </TouchableOpacity>
    </View>
  );

  const renderContactItem = ({ item }) => {
    const isSelected = !!selectedContacts[item.recordID];
    return (
      <View style={styles.contactItem}>
        <TouchableOpacity 
          style={[styles.circleIcon, isSelected && styles.circleIconSelected]}
          onPress={() => toggleContactSelection(item)}
        >
          {isSelected && <Check color="#FFF" size={14} />}
        </TouchableOpacity>
        
        <View style={styles.contactAvatar}>
          <Text style={styles.contactAvatarText}>
            {item.displayName.charAt(0).toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.contactItemInfo}>
          <Text style={styles.contactItemName}>{item.displayName}</Text>
          <Text style={styles.contactItemPhone}>
            {item.phoneNumbers[0]?.number || 'No number'}
          </Text>
        </View>
      </View>
    );
  };

  const renderFamilyMember = ({ item }) => (
    <View style={styles.familyCard}>
      <View style={styles.familyAvatar}>
        <Text style={styles.familyAvatarText}>
          {item.firstName ? item.firstName.charAt(0).toUpperCase() : '?'}
        </Text>
      </View>
      <View style={styles.familyInfo}>
        <Text style={styles.familyName}>{item.fullName || `${item.firstName} ${item.lastName}`}</Text>
        <Text style={styles.familyDetails}>
          {item.age} yrs • {item.gender} • {item.relation}
        </Text>
        {item.emergencyContacts && item.emergencyContacts.length > 0 && (
          <Text style={styles.familyEmergencyCount}>
            📞 {item.emergencyContacts.length} emergency contact(s)
          </Text>
        )}
      </View>
      <TouchableOpacity onPress={() => removeFamilyMember(item.id)}>
        <Trash2 color="#FF4444" size={20} />
      </TouchableOpacity>
    </View>
  );

  const removeFamilyMember = (memberId) => {
    const filtered = familyMembers.filter(m => m.id !== memberId);
    setFamilyMembers(filtered);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <ArrowLeft color="#333" size={20} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Safety</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Emergency Contacts Section */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => setIsEmergencyOpen(!isEmergencyOpen)}
          >
            <Text style={styles.sectionTitle}>Emergency Contacts</Text>
            {isEmergencyOpen ? (
              <ChevronUp color="#072c76" size={20} />
            ) : (
              <ChevronDown color="#072c76" size={20} />
            )}
          </TouchableOpacity>
          
          {isEmergencyOpen && (
            <View style={styles.sectionContent}>
              {emergencyContacts.length > 0 ? (
                <FlatList
                  data={emergencyContacts}
                  renderItem={renderEmergencyContact}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              ) : (
                <Text style={styles.placeholderText}>No emergency contacts added</Text>
              )}
              
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={openContactsModal}
              >
                <Text style={styles.addButtonText}>+ Add from Contacts</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Vehicles Section */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => setIsVehiclesOpen(!isVehiclesOpen)}
          >
            <Text style={styles.sectionTitle}>My Vehicles</Text>
            {isVehiclesOpen ? (
              <ChevronUp color="#072c76" size={20} />
            ) : (
              <ChevronDown color="#072c76" size={20} />
            )}
          </TouchableOpacity>
          
          {isVehiclesOpen && (
            <View style={styles.sectionContent}>
              {vehicles.length > 0 ? (
                <FlatList
                  data={vehicles}
                  renderItem={renderVehicle}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              ) : (
                <Text style={styles.placeholderText}>No vehicles added</Text>
              )}
              
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={() => setShowVehicleDetailsModal(true)}
              >
                <Text style={styles.addButtonText}>+ Add Vehicle</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Family Members Section */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => setIsFamilyOpen(!isFamilyOpen)}
          >
            <Text style={styles.sectionTitle}>Family Members</Text>
            {isFamilyOpen ? (
              <ChevronUp color="#072c76" size={20} />
            ) : (
              <ChevronDown color="#072c76" size={20} />
            )}
          </TouchableOpacity>
          
          {isFamilyOpen && (
            <View style={styles.sectionContent}>
              {familyMembers.length > 0 ? (
                <FlatList
                  data={familyMembers}
                  renderItem={renderFamilyMember}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              ) : (
                <Text style={styles.placeholderText}>No family members added</Text>
              )}
              
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={openFamilyMemberModal}
              >
                <Text style={styles.addButtonText}>+ Add Family Member</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

      </ScrollView>

      {/* Contacts Modal */}
      <Modal 
        visible={modalVisible} 
        animationType="slide" 
        transparent={false}
        onRequestClose={() => {
          setModalVisible(false);
          setSearchQuery('');
          setSelectedContacts({});
          setIsAddingForFamily(false);
        }}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => {
                setModalVisible(false);
                setSearchQuery('');
                setSelectedContacts({});
                setIsAddingForFamily(false);
              }} 
              style={styles.modalBackButton}
            >
              <ArrowLeft color="#333" size={24} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>All Contacts</Text>
            <TouchableOpacity 
              style={styles.doneButton}
              onPress={addSelectedContacts}
            >
              <Text style={styles.doneButtonText}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Search color="#999" size={20} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search contacts..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <X color="#999" size={20} />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={filteredContacts}
            renderItem={renderContactItem}
            keyExtractor={(item) => item.recordID}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No contacts found</Text>
              </View>
            }
          />
        </SafeAreaView>
      </Modal>

      {/* Vehicle Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showVehicleDetailsModal}
        onRequestClose={() => {
          setShowVehicleDetailsModal(false);
          resetVehicleForm();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.vehicleDetailsModalContent}>
            <View style={styles.vehicleModalHeader}>
              <Text style={styles.vehicleModalTitle}>Add Vehicle Details</Text>
              <TouchableOpacity onPress={() => {
                setShowVehicleDetailsModal(false);
                resetVehicleForm();
              }}>
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

              <TouchableOpacity style={styles.saveVehicleBtn} onPress={saveVehicle}>
                <Text style={styles.saveVehicleBtnText}>Save Vehicle</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Family Member Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={familyModalVisible}
        onRequestClose={() => {
          setFamilyModalVisible(false);
          setFamilyEmergencyContacts([]);
          setIsAddingForFamily(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.familyModalContent}>
            <View style={styles.vehicleModalHeader}>
              <Text style={styles.vehicleModalTitle}>Add Family Member</Text>
              <TouchableOpacity onPress={() => {
                setFamilyModalVisible(false);
                setFamilyEmergencyContacts([]);
                setIsAddingForFamily(false);
              }}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* First Name */}
              <Text style={styles.inputLabel}>First Name *</Text>
              <TextInput
                style={[styles.inputField, familyErrors.firstName && styles.inputFieldError]}
                placeholder="Enter first name"
                placeholderTextColor="#999"
                value={tempFamilyMember.firstName}
                onChangeText={(text) => {
                  setTempFamilyMember({...tempFamilyMember, firstName: text});
                  if (familyErrors.firstName) {
                    setFamilyErrors({...familyErrors, firstName: ''});
                  }
                }}
              />
              {familyErrors.firstName ? (
                <Text style={styles.errorText}>{familyErrors.firstName}</Text>
              ) : null}

              {/* Last Name */}
              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Enter last name"
                placeholderTextColor="#999"
                value={tempFamilyMember.lastName}
                onChangeText={(text) => {
                  setTempFamilyMember({...tempFamilyMember, lastName: text});
                }}
              />

              {/* Age */}
              <Text style={styles.inputLabel}>Age *</Text>
              <TextInput
                style={[styles.inputField, familyErrors.age && styles.inputFieldError]}
                placeholder="Enter age"
                placeholderTextColor="#999"
                value={tempFamilyMember.age}
                onChangeText={(text) => {
                  const validatedText = text.replace(/[^0-9]/g, '').slice(0, 3);
                  setTempFamilyMember({...tempFamilyMember, age: validatedText});
                  if (familyErrors.age) {
                    setFamilyErrors({...familyErrors, age: ''});
                  }
                }}
                keyboardType="numeric"
                maxLength={3}
              />
              {familyErrors.age ? (
                <Text style={styles.errorText}>{familyErrors.age}</Text>
              ) : null}

              {/* Height */}
              <Text style={styles.inputLabel}>Height (cm)</Text>
              <TextInput
                style={[styles.inputField, familyErrors.height && styles.inputFieldError]}
                placeholder="Enter height in cm"
                placeholderTextColor="#999"
                value={tempFamilyMember.height}
                onChangeText={(text) => {
                  const validatedText = text.replace(/[^0-9]/g, '').slice(0, 3);
                  setTempFamilyMember({...tempFamilyMember, height: validatedText});
                  if (familyErrors.height) {
                    setFamilyErrors({...familyErrors, height: ''});
                  }
                }}
                keyboardType="numeric"
                maxLength={3}
              />
              {familyErrors.height ? (
                <Text style={styles.errorText}>{familyErrors.height}</Text>
              ) : null}

              {/* Relation */}
              <Text style={styles.inputLabel}>Relation *</Text>
              <TextInput
                style={[styles.inputField, familyErrors.relation && styles.inputFieldError]}
                placeholder="e.g., Father, Mother, Brother"
                placeholderTextColor="#999"
                value={tempFamilyMember.relation}
                onChangeText={(text) => {
                  setTempFamilyMember({...tempFamilyMember, relation: text});
                  if (familyErrors.relation) {
                    setFamilyErrors({...familyErrors, relation: ''});
                  }
                }}
              />
              {familyErrors.relation ? (
                <Text style={styles.errorText}>{familyErrors.relation}</Text>
              ) : null}

              {/* Gender */}
              <Text style={styles.inputLabel}>Gender *</Text>
              <View style={styles.genderContainer}>
                <TouchableOpacity 
                  style={[
                    styles.genderOption,
                    tempFamilyMember.gender === 'Male' && styles.genderOptionSelected,
                    familyErrors.gender && styles.genderOptionError
                  ]}
                  onPress={() => {
                    setTempFamilyMember({...tempFamilyMember, gender: 'Male'});
                    setFamilyErrors({...familyErrors, gender: ''});
                  }}
                >
                  <Text style={[
                    styles.genderOptionText,
                    tempFamilyMember.gender === 'Male' && styles.genderOptionTextSelected
                  ]}>Male</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.genderOption,
                    tempFamilyMember.gender === 'Female' && styles.genderOptionSelected,
                    familyErrors.gender && styles.genderOptionError
                  ]}
                  onPress={() => {
                    setTempFamilyMember({...tempFamilyMember, gender: 'Female'});
                    setFamilyErrors({...familyErrors, gender: ''});
                  }}
                >
                  <Text style={[
                    styles.genderOptionText,
                    tempFamilyMember.gender === 'Female' && styles.genderOptionTextSelected
                  ]}>Female</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.genderOption,
                    tempFamilyMember.gender === 'Other' && styles.genderOptionSelected,
                    familyErrors.gender && styles.genderOptionError
                  ]}
                  onPress={() => {
                    setTempFamilyMember({...tempFamilyMember, gender: 'Other'});
                    setFamilyErrors({...familyErrors, gender: ''});
                  }}
                >
                  <Text style={[
                    styles.genderOptionText,
                    tempFamilyMember.gender === 'Other' && styles.genderOptionTextSelected
                  ]}>Other</Text>
                </TouchableOpacity>
              </View>
              {familyErrors.gender ? (
                <Text style={styles.errorText}>{familyErrors.gender}</Text>
              ) : null}

              {/* Emergency Contacts Section inside Family Modal */}
              <Text style={[styles.inputLabel, { marginTop: 15 }]}>Emergency Contacts</Text>

              {familyEmergencyContacts.length > 0 ? (
                <View style={styles.emergencyContactsList}>
                  {familyEmergencyContacts.map((contact) => (
                    <View key={contact.id} style={styles.selectedEmergencyContact}>
                      <View style={styles.selectedContactAvatar}>
                        <Text style={styles.selectedContactAvatarText}>
                          {contact.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.selectedContactInfo}>
                        <Text style={styles.selectedContactName}>{contact.name}</Text>
                        <Text style={styles.selectedContactPhone}>{contact.phone}</Text>
                      </View>
                      <TouchableOpacity 
                       onPress={() => {
                       // Make a phone call
                         Linking.openURL(`tel:${contact.phone}`);
                               }}
                            >
                      <Phone color="#4CAF50" size={18} style={{left:-10}} />
                        </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => {
                          const filtered = familyEmergencyContacts.filter(c => c.id !== contact.id);
                          setFamilyEmergencyContacts(filtered);
                        }}
                      >
                        <Trash2 color="#FF4444" size={20} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.noContactsText}>No emergency contacts added</Text>
              )}

              <TouchableOpacity 
                style={styles.addEmergencyButton}
                onPress={openContactsModalForFamily}
              >
                <Text style={styles.addEmergencyButtonText}>+ Add Emergency Contact</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveVehicleBtn} onPress={saveFamilyMember}>
                <Text style={styles.saveVehicleBtnText}>Save Family Member</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
    paddingHorizontal: 15,
    paddingVertical: 25,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: textScale(16),
    color: '#333',
  },
  sectionContainer: {
    marginHorizontal: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#072c76',
  },
  sectionContent: {
    padding: 15,
    backgroundColor: '#fff',
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 10,
  },
  addButton: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#072c76',
    fontSize: 14,
    fontWeight: '600',
  },
  emergencyContactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  emergencyContactAvatar: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#072c76',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emergencyContactAvatarText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emergencyContactInfo: {
    flex: 1,
  },
  emergencyContactName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  emergencyContactPhone: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  vehicleIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleNumber: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  vehicleTypeText: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  vehicleMileage: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  modalBackButton: {
    padding: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  doneButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: 'orange',
    borderRadius: 8,
  },
  doneButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  circleIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#072c76',
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  circleIconSelected: {
    backgroundColor: '#072c76',
    borderColor: '#072c76',
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  contactAvatarText: {
    color: '#072c76',
    fontSize: 20,
    fontWeight: 'bold',
  },
  contactItemInfo: {
    flex: 1,
  },
  contactItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  contactItemPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleDetailsModalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  vehicleModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  vehicleModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#072c76',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    marginTop: 15,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#FFF',
  },
  inputFieldError: {
    borderColor: '#FF4444',
    borderWidth: 1,
  },
  dropdownField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFF',
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
  dropdownPlaceholder: {
    fontSize: 14,
    color: '#999',
  },
  vehicleTypeDropdownList: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: '#FFF',
  },
  vehicleTypeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  vehicleTypeOptionText: {
    fontSize: 14,
    color: '#333',
  },
  bankDropdownList: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: '#FFF',
  },
  bankOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  bankOptionText: {
    fontSize: 14,
    color: '#333',
  },
  checkMark: {
    color: '#072c76',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveVehicleBtn: {
    backgroundColor: '#072c76',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 10,
  },
  saveVehicleBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  familyModalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '85%',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 5,
    marginBottom: 10,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  genderOptionSelected: {
    backgroundColor: '#072c76',
    borderColor: '#072c76',
  },
  genderOptionText: {
    fontSize: 14,
    color: '#333',
  },
  genderOptionTextSelected: {
    color: '#FFF',
  },
  genderOptionError: {
    borderColor: '#FF4444',
    borderWidth: 1,
  },
  familyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  familyAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  familyAvatarText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  familyInfo: {
    flex: 1,
  },
  familyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  familyDetails: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  familyEmergencyCount: {
    fontSize: 11,
    color: '#072c76',
    marginTop: 4,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
    marginBottom: 5,
  },
  emergencyContactsList: {
    marginTop: 5,
    marginBottom: 10,
  },
  selectedEmergencyContact: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedContactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#072c76',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedContactAvatarText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedContactInfo: {
    flex: 1,
  },
  selectedContactName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  selectedContactPhone: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  noContactsText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 10,
  },
  addEmergencyButton: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 15,
  },
  addEmergencyButtonText: {
    color: '#072c76',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default SafetyScreen;