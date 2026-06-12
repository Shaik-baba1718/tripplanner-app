import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Linking,
} from 'react-native';
import { ArrowLeft, Phone, MessageCircle, Mail, ChevronRight, Ticket, HelpCircle ,ChevronDown,ChevronUp} from 'lucide-react-native';
import { textScale, moderateScale, verticalScale } from '../styles/responsiveSize';
import { FONTS } from '../../global';

const HelpCenter = ({ navigation }) => {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedHelpOption, setSelectedHelpOption] = useState(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
const helpOptions = [
  { id: 1, line1: 'Payment', line2: 'related', line3: 'Queries', icon: '💰' },
  { id: 2, line1: 'Card', line2: 'related', line3: 'Queries', icon: '💳' },
  { id: 3, line1: 'Trip', line2: 'related', line3: 'Queries', icon: '🚗' },
  { id: 4, line1: 'Bill', line2: 'Payments', line3: 'issues', icon: '📄' },
  { id: 5, line1: 'Good', line2: 'samaritan', line3: 'issues', icon: '🤝' },
  { id: 6, line1: 'Tez', line2: 'Pass', line3: 'issues', icon: '🎫' },
  { id: 7, line1: 'Any', line2: 'other', line3: 'issues', icon: '📝' },
];
const helpQuestions = {
  1: { // Payment related Queries
    title: "Payment related Queries",
    questions: [
      { 
        id: 1, 
        question: "Why did my payment fail?", 
        answer: "Payment may fail due to insufficient balance, network issues, or bank server problems. Please try again after checking your balance." 
      },
      { 
        id: 2, 
        question: "How long does refund take?", 
        answer: "Refunds typically take 5-7 business days to reflect in your account, depending on your bank." 
      },
      { 
        id: 3, 
        question: "Is my payment secure?", 
        answer: "Yes, all payments are encrypted and processed through secure payment gateways." 
      },
    ]
  },
  2: { // Card related Queries
    title: "Card related Queries",
    questions: [
      { 
        id: 1, 
        question: "How to add a new card?", 
        answer: "Go to Payment Methods → Add New Card → Enter card details → Save." 
      },
      { 
        id: 2, 
        question: "Why is my card being declined?", 
        answer: "Card may be declined due to insufficient funds, expired card, or bank restrictions." 
      },
    ]
  },
  3: { // Trip related Queries
    title: "Trip related Queries",
    questions: [
      { 
        id: 1, 
        question: "How to cancel a trip?", 
        answer: "Go to My Trips → Select Trip → Cancel Trip → Confirm cancellation." 
      },
      { 
        id: 2, 
        question: "How to change travel date?", 
        answer: "Contact support at least 24 hours before departure to modify your trip date." 
      },
    ]
  },
  4: { // Bill Payments issues
    title: "Bill Payments issues",
    questions: [
      { 
        id: 1, 
        question: "Bill payment failed but amount deducted?", 
        answer: "The amount will be auto-refunded within 3-5 business days. Contact support if not received." 
      },
      { 
        id: 2, 
        question: "How to view bill payment history?", 
        answer: "Go to Bills → Payment History to view all your past payments." 
      },
    ]
  },
  5: { // Good samaritan issues
    title: "Good samaritan issues",
    questions: [
      { 
        id: 1, 
        question: "How to report an incident?", 
        answer: "Tap on Safety → Report Incident → Fill details → Submit." 
      },
      { 
        id: 2, 
        question: "What is emergency assistance?", 
        answer: "Emergency assistance connects you to local authorities and emergency services." 
      },
    ]
  },
  6: { // Tez Pass issues
    title: "Tez Pass issues",
    questions: [
      { 
        id: 1, 
        question: "How to activate Tez Pass?", 
        answer: "Go to My Passes → Select Tez Pass → Activate → Make payment." 
      },
      { 
        id: 2, 
        question: "Tez Pass not working?", 
        answer: "Restart app, check pass validity, or contact support for assistance." 
      },
    ]
  },
  7: { // Any other issues
    title: "Any other issues",
    questions: [
      { 
        id: 1, 
        question: "App is crashing frequently?", 
        answer: "Clear app cache, update to latest version, or reinstall the app." 
      },
      { 
        id: 2, 
        question: "How to contact support?", 
        answer: "Email us at support@balert.in or call our helpline." 
      },
    ]
  },
};

  const handleCallPress = () => {
    Linking.openURL('tel:+919876543210');
  };

  const handleChatPress = () => {
    // Navigate to chat screen or open chat
    navigation.navigate('ChatSupport');
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:support@balert.in');
  };
  const handleOptionPress = (optionId) => {
  setSelectedHelpOption(optionId);
  setShowQuestions(true);
};
// If showing questions, render questions screen instead of main screen
if (showQuestions && selectedHelpOption) {
  const AccordionItem = ({ item, index }) => {
    const isExpanded = expandedId === item.id;
    
    return (
      <View style={styles.accordionContainer}>
        <TouchableOpacity 
          style={styles.questionHeader}
          onPress={() => setExpandedId(isExpanded ? null : item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.questionNumberContainer}>
            <Text style={styles.questionNumber}>{index + 1}</Text>
          </View>
          <Text style={styles.questionText}>{item.question}</Text>
          {isExpanded ? (
            <ChevronUp color="#ED8701" size={20} />
          ) : (
            <ChevronDown color="#999" size={20} />
          )}
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.answerContainer}>
            <Text style={styles.answerText}>{item.answer}</Text>
          </View>
        )}
         <View style={styles.shortBorder} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.questionsHeader}>
        <TouchableOpacity 
          onPress={() => {
            setShowQuestions(false);
            setSelectedHelpOption(null);
            setExpandedId(null);
          }} 
          style={styles.backButton}
        >
          <ArrowLeft color="#333" size={24} />
        </TouchableOpacity>
        <Text style={styles.questionsTitle}>
          {helpQuestions[selectedHelpOption]?.title}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.questionsList}
        contentContainerStyle={styles.questionsListContent}
      >
        {helpQuestions[selectedHelpOption]?.questions.map((item, index) => (
          <AccordionItem key={item.id} item={item} index={index} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

  return (
    <SafeAreaView >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <ArrowLeft color="#333" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Centre</Text>
        <View style={styles.sectionHeader}>
            <Ticket color="#072c76" size={20} />
            <Text style={styles.sectionTitle}>Tickets</Text>
          </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Tickets Section */}
        <View style={styles.section}>
         

          <Text style={styles.sectionSubtitle}>How can we help you?</Text>

          {/* Help Options Grid */}
         
           <View style={styles.optionsGrid}>
  {helpOptions.map((option) => (
    <TouchableOpacity
      key={option.id}
      style={styles.optionCard}
      onPress={() => handleOptionPress(option.id)}
    > 
     <Text style={styles.optionIcon}>{option.icon}</Text>
  <View style={styles.optionTextContainer}>
    <Text style={styles.optionTextLine1}>{option.line1}</Text>
    <Text style={styles.optionTextLine2}>{option.line2}</Text>
    <Text style={styles.optionTextLine3}>{option.line3}</Text>
  </View>
     
      
    </TouchableOpacity>
  ))}
</View>
          </View>
 

        {/* Divider */}
        <View style={styles.divider} />

        {/* Talk to Us Section */}
        <View style={styles.section}>
          <Text style={styles.talkTitle}>Talk to us</Text>
          <Text style={styles.talkSubtitle}>
            Chat or call our support team for real-time assistance and a smooth app experience!
          </Text>

          <View style={styles.contactRow}>
            {/* Call Us */}
            <TouchableOpacity style={styles.contactCard} onPress={handleCallPress}>
              <View style={[styles.contactIconBg]}>
                <Phone color="#da8c26" size={20} />
              </View>
              <Text style={styles.contactTitle}>Call us</Text>
             
            </TouchableOpacity>

            {/* Chat with Us */}
            <TouchableOpacity style={styles.contactCard} onPress={handleChatPress}>
              <View style={[styles.contactIconBg]}>
                <MessageCircle color="#4dc033" size={20} />
              </View>
              <Text style={styles.contactTitle}>Chat with us</Text>
           
            </TouchableOpacity>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Suggestions Section */}
        <View style={styles.section}>
          <Text style={styles.suggestTitle}>Have suggestions in your mind</Text>
          <Text style={styles.suggestSubtitle}>
            Email those to us at for quick assistance with your queries or feedbacks!
          </Text>

          <TouchableOpacity style={styles.emailCard} onPress={handleEmailPress}>
            <Mail color="#072c76" size={22} />
            <Text style={styles.emailText}>support@balert.in</Text>
            <ChevronRight color="#072c76" size={18} />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: textScale(16),
  fontFamily:FONTS.MetropolicBold,
    color: '#333',
  },
  scrollContent: {
    paddingBottom: verticalScale(70),
  },
  section: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: verticalScale(20),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
 
  },
  sectionTitle: {
    fontSize: textScale(16),
     fontFamily:FONTS.MetropolicMedium,
    color: '#072c76',
    marginLeft: moderateScale(10),
  },
  sectionSubtitle: {
    fontSize: textScale(16),
    fontWeight: '600',
    color: '#333',
    marginBottom: verticalScale(15),
    marginTop: verticalScale(5),
  },
  optionsGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
       
  columnGap:10,
  marginTop: verticalScale(5),
  

},
optionCard: {
  // Approximately 3 items per row with spacing
  width:'48%',
 flexDirection: 'row',
  alignItems: 'center',

paddingVertical:10,
paddingHorizontal:10,
  gap:2,
  backgroundColor: '#FFF',
marginBottom:10,
  borderRadius: 12,

  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 1,
},
optionIcon: {
  fontSize: textScale(30),
 
},



optionTextLine1: {
  fontSize: textScale(12),
   fontFamily:FONTS.InterMedium,
  color: '#333',
},
optionTextLine2: {
  fontSize: textScale(12),
  color: '#333',
  fontFamily:FONTS.InterMedium,

},
optionTextLine3: {
  fontSize: textScale(12),
  color: '#333',
  fontFamily:FONTS.InterMedium,

},

  
 
  talkTitle: {
    fontSize: textScale(16),
    fontFamily:FONTS.sfprobold,
    color: '#333',
    marginBottom: 5,
  },
  talkSubtitle: {
    fontSize: textScale(12),
    color: '#666',
    lineHeight: 15,
    marginBottom:20,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  contactCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    gap:2,
    flexDirection:"row",
    borderWidth:1,
    borderColor:"#705656",
    width:moderateScale('50%')
  },
  
  contactTitle: {
    fontSize: textScale(12),
    fontFamily:FONTS.sfproRegular,
    color: '#333',
  
  },
  contactDesc: {
    fontSize: textScale(12),
    color: '#666',
    textAlign: 'center',
  },
  suggestTitle: {
    fontSize: textScale(18),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: verticalScale(8),
  },
  suggestSubtitle: {
    fontSize: textScale(14),
    color: '#666',
    lineHeight: 20,
    marginBottom: verticalScale(15),
  },
  emailCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: moderateScale(15),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  emailText: {
    flex: 1,
    fontSize: textScale(14),
    color: '#072c76',
    fontWeight: '500',
    marginLeft: moderateScale(12),
  },
 // Questions Screen Styles
questionsHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 15,
  paddingVertical: 15,
  backgroundColor: '#fff',
  borderBottomWidth: 1,
  
  borderBottomColor: '#E0E0E0',
},
questionNumberContainer: {
 
  
  alignItems: 'center',
  justifyContent: 'center', 
  marginRight: 12,
},
questionNumber: {
  fontSize: textScale(12),
 fontFamily:FONTS.MetropolicMedium,
  color: '#333',
},
questionsTitle: {
  fontSize: textScale(14),
  
  color: '#333',

  textAlign: 'center',
},
questionsList: {
  flex: 1,
  backgroundColor: '#fff',
},
questionsListContent: {
  padding: 15,
},
accordionContainer: {
  backgroundColor: '#fff',
  width:"100%",
  marginBottom: 12,

},
shortBorder: {
  height: 0.5,
  width: '93.8%',           // 80% of container width (shorter)
  backgroundColor: '#8d8787',
  alignSelf: 'center',    // Centers the border
    marginTop: 8, 
},
questionHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
   alignItems: 'center', 
  padding:10,
  
  backgroundColor: '#fff',
},
questionText: {
  flex: 1,
  fontSize: textScale(12),
  fontFamily:FONTS.MetropolicMedium,
  color: '#333',
 
},
answerContainer: {
  padding: 10,
  backgroundColor: '#fff',
 
},
answerText: {
  fontSize: textScale(12),
  color: '#333',
  lineHeight: 15,
}, 

});

export default HelpCenter;