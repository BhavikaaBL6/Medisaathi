export type Language = 'en' | 'hi' | 'ta' | 'te';

export interface Translations {
  appName: string;
  tagline: string;
  myCabinet: string;
  scanNew: string;
  schedule: string;
  medications: string;
  meds: string;
  noMedicationsYet: string;
  scanFirstMedication: string;
  scanMedication: string;
  readyToScan: string;
  aiCanRead: string;
  aiPowered: string;
  accurate: string;
  fast: string;
  chooseImage: string;
  readingLabel: string;
  aiAnalyzing: string;
  medicationDetected: string;
  medicationName: string;
  dosage: string;
  addToCabinet: string;
  scanAnother: string;
  comingSoon: string;
  smartReminders: string;
  dailyReminders: string;
  smartNotifications: string;
  refillTracking: string;
  featureUnderDevelopment: string;
  danger: string;
  caution: string;
  interactionDetected: string;
  notifyCaregiver: string;
  doNotTakeTogether: string;
  added: string;
  warfarinAspirinWarning: string;
  ibuprofenAspirinWarning: string;
  settings: string;
  language: string;
  theme: string;
  darkMode: string;
  lightMode: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'PolyRx',
    tagline: 'Your Medication Safety Partner',
    myCabinet: 'My Cabinet',
    scanNew: 'Scan New',
    schedule: 'Schedule',
    medications: 'medications',
    meds: 'meds',
    noMedicationsYet: 'No medications yet',
    scanFirstMedication: 'Scan your first medication bottle to get started with intelligent safety monitoring',
    scanMedication: 'Scan Medication',
    readyToScan: 'Ready to Scan',
    aiCanRead: 'Our advanced AI can read medication labels, including handwritten prescriptions',
    aiPowered: 'AI Powered',
    accurate: 'Accurate',
    fast: 'Fast',
    chooseImage: 'Choose Image or Take Photo',
    readingLabel: 'Reading Label...',
    aiAnalyzing: 'AI is analyzing the image',
    medicationDetected: 'Medication Detected',
    medicationName: 'Medication Name',
    dosage: 'Dosage',
    addToCabinet: 'Add to My Cabinet',
    scanAnother: 'Scan Another',
    comingSoon: 'Coming Soon',
    smartReminders: 'Smart medication reminders',
    dailyReminders: 'Daily medication reminders',
    smartNotifications: 'Smart notifications',
    refillTracking: 'Refill tracking',
    featureUnderDevelopment: 'This feature is under development and will be available in a future update',
    danger: 'DANGER',
    caution: 'CAUTION',
    interactionDetected: 'Drug Interaction Detected',
    notifyCaregiver: 'Notify Caregiver',
    doNotTakeTogether: 'Do not take these medications together without consulting your doctor immediately.',
    added: 'Added',
    warfarinAspirinWarning: 'Warfarin and Aspirin together significantly increase bleeding risk. Do not take these together without consulting your doctor immediately.',
    ibuprofenAspirinWarning: 'Taking Ibuprofen and Aspirin together may increase stomach bleeding risk. Consult your pharmacist.',
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
  },
  hi: {
    appName: 'पॉलीआरएक्स',
    tagline: 'आपका दवा सुरक्षा साथी',
    myCabinet: 'मेरी कैबिनेट',
    scanNew: 'नया स्कैन',
    schedule: 'समय सारणी',
    medications: 'दवाएं',
    meds: 'दवाएं',
    noMedicationsYet: 'अभी तक कोई दवा नहीं',
    scanFirstMedication: 'बुद्धिमान सुरक्षा निगरानी के साथ शुरू करने के लिए अपनी पहली दवा की बोतल स्कैन करें',
    scanMedication: 'दवा स्कैन करें',
    readyToScan: 'स्कैन के लिए तैयार',
    aiCanRead: 'हमारा उन्नत AI दवा के लेबल पढ़ सकता है, जिसमें हस्तलिखित नुस्खे भी शामिल हैं',
    aiPowered: 'AI संचालित',
    accurate: 'सटीक',
    fast: 'तेज़',
    chooseImage: 'छवि चुनें या फोटो लें',
    readingLabel: 'लेबल पढ़ा जा रहा है...',
    aiAnalyzing: 'AI छवि का विश्लेषण कर रहा है',
    medicationDetected: 'दवा का पता चला',
    medicationName: 'दवा का नाम',
    dosage: 'खुराक',
    addToCabinet: 'मेरी कैबिनेट में जोड़ें',
    scanAnother: 'एक और स्कैन करें',
    comingSoon: 'जल्द आ रहा है',
    smartReminders: 'स्मार्ट दवा अनुस्मारक',
    dailyReminders: 'दैनिक दवा अनुस्मारक',
    smartNotifications: 'स्मार्ट सूचनाएं',
    refillTracking: 'रीफिल ट्रैकिंग',
    featureUnderDevelopment: 'यह सुविधा विकास में है और भविष्य के अपडेट में उपलब्ध होगी',
    danger: 'खतरा',
    caution: 'सावधानी',
    interactionDetected: 'दवा परस्पर क्रिया का पता चला',
    notifyCaregiver: 'देखभालकर्ता को सूचित करें',
    doNotTakeTogether: 'अपने डॉक्टर से परामर्श किए बिना इन दवाओं को एक साथ न लें।',
    added: 'जोड़ा गया',
    warfarinAspirinWarning: 'वारफारिन और एस्पिरिन एक साथ रक्तस्राव का खतरा बढ़ाते हैं। अपने डॉक्टर से तुरंत परामर्श किए बिना इन्हें एक साथ न लें।',
    ibuprofenAspirinWarning: 'आइबुप्रोफेन और एस्पिरिन एक साथ लेने से पेट में रक्तस्राव का खतरा बढ़ सकता है। अपने फार्मासिस्ट से परामर्श करें।',
    settings: 'सेटिंग्स',
    language: 'भाषा',
    theme: 'थीम',
    darkMode: 'डार्क मोड',
    lightMode: 'लाइट मोड',
  },
  ta: {
    appName: 'பாலிஆர்எக்ஸ்',
    tagline: 'உங்கள் மருந்து பாதுகாப்பு துணை',
    myCabinet: 'என் அலமாரி',
    scanNew: 'புதிய ஸ்கேன்',
    schedule: 'அட்டவணை',
    medications: 'மருந்துகள்',
    meds: 'மருந்துகள்',
    noMedicationsYet: 'இன்னும் மருந்துகள் இல்லை',
    scanFirstMedication: 'புத்திசாலித்தனமான பாதுகாப்பு கண்காணிப்புடன் தொடங்க உங்கள் முதல் மருந்து பாட்டிலை ஸ்கேன் செய்யவும்',
    scanMedication: 'மருந்து ஸ்கேன் செய்யவும்',
    readyToScan: 'ஸ்கேன் செய்ய தயார்',
    aiCanRead: 'எங்கள் மேம்பட்ட AI கையெழுத்து மருந்துச்சீட்டுகள் உட்பட மருந்து லேபிள்களை படிக்க முடியும்',
    aiPowered: 'AI இயக்கப்படுகிறது',
    accurate: 'துல்லியமான',
    fast: 'வேகமான',
    chooseImage: 'படத்தைத் தேர்ந்தெடுக்கவும் அல்லது புகைப்படம் எடுக்கவும்',
    readingLabel: 'லேபிள் படிக்கப்படுகிறது...',
    aiAnalyzing: 'AI படத்தை பகுப்பாய்வு செய்கிறது',
    medicationDetected: 'மருந்து கண்டறியப்பட்டது',
    medicationName: 'மருந்தின் பெயர்',
    dosage: 'அளவு',
    addToCabinet: 'என் அலமாரியில் சேர்க்கவும்',
    scanAnother: 'மற்றொன்றை ஸ்கேன் செய்யவும்',
    comingSoon: 'விரைவில் வருகிறது',
    smartReminders: 'ஸ்மார்ட் மருந்து நினைவூட்டல்கள்',
    dailyReminders: 'தினசரி மருந்து நினைவூட்டல்கள்',
    smartNotifications: 'ஸ்மார்ட் அறிவிப்புகள்',
    refillTracking: 'மறுநிரப்பு கண்காணிப்பு',
    featureUnderDevelopment: 'இந்த அம்சம் வளர்ச்சியில் உள்ளது மற்றும் எதிர்கால புதுப்பிப்பில் கிடைக்கும்',
    danger: 'ஆபத்து',
    caution: 'எச்சரிக்கை',
    interactionDetected: 'மருந்து தொடர்பு கண்டறியப்பட்டது',
    notifyCaregiver: 'பராமரிப்பாளருக்கு தெரிவிக்கவும்',
    doNotTakeTogether: 'உங்கள் மருத்துவரை ஆலோசிக்காமல் இந்த மருந்துகளை ஒன்றாக எடுக்க வேண்டாம்.',
    added: 'சேர்க்கப்பட்டது',
    warfarinAspirinWarning: 'வார்பரின் மற்றும் ஆஸ்பிரின் ஒன்றாக இரத்தப்போக்கு அபாயத்தை கணிசமாக அதிகரிக்கின்றன. உங்கள் மருத்துவரை உடனடியாக ஆலோசிக்காமல் இவற்றை ஒன்றாக எடுக்க வேண்டாம்.',
    ibuprofenAspirinWarning: 'இபுபுரூஃபன் மற்றும் ஆஸ்பிரின் ஒன்றாக எடுப்பது வயிற்று இரத்தப்போக்கு அபாயத்தை அதிகரிக்கலாம். உங்கள் மருந்தாளரை ஆலோசிக்கவும்.',
    settings: 'அமைப்புகள்',
    language: 'மொழி',
    theme: 'தீம்',
    darkMode: 'இருண்ட பயன்முறை',
    lightMode: 'ஒளி பயன்முறை',
  },
  te: {
    appName: 'పాలీఆర్ఎక్స్',
    tagline: 'మీ మందుల భద్రతా భాగస్వామి',
    myCabinet: 'నా క్యాబినెట్',
    scanNew: 'కొత్త స్కాన్',
    schedule: 'షెడ్యూల్',
    medications: 'మందులు',
    meds: 'మందులు',
    noMedicationsYet: 'ఇంకా మందులు లేవు',
    scanFirstMedication: 'తెలివైన భద్రత పర్యవేక్షణతో ప్రారంభించడానికి మీ మొదటి మందు బాటిల్‌ను స్కాన్ చేయండి',
    scanMedication: 'మందు స్కాన్ చేయండి',
    readyToScan: 'స్కాన్ చేయడానికి సిద్ధంగా ఉంది',
    aiCanRead: 'మా అధునాతన AI చేతితో రాసిన ప్రిస్క్రిప్షన్‌లతో సహా మందుల లేబుళ్లను చదవగలదు',
    aiPowered: 'AI ఆధారితం',
    accurate: 'ఖచ్చితమైన',
    fast: 'వేగవంతమైన',
    chooseImage: 'చిత్రాన్ని ఎంచుకోండి లేదా ఫోటో తీయండి',
    readingLabel: 'లేబుల్ చదువుతోంది...',
    aiAnalyzing: 'AI చిత్రాన్ని విశ్లేషిస్తోంది',
    medicationDetected: 'మందు గుర్తించబడింది',
    medicationName: 'మందు పేరు',
    dosage: 'మోతాదు',
    addToCabinet: 'నా క్యాబినెట్‌కు జోడించండి',
    scanAnother: 'మరొకటి స్కాన్ చేయండి',
    comingSoon: 'త్వరలో వస్తోంది',
    smartReminders: 'స్మార్ట్ మందు రిమైండర్‌లు',
    dailyReminders: 'రోజువారీ మందు రిమైండర్‌లు',
    smartNotifications: 'స్మార్ట్ నోటిఫికేషన్‌లు',
    refillTracking: 'రీఫిల్ ట్రాకింగ్',
    featureUnderDevelopment: 'ఈ ఫీచర్ అభివృద్ధిలో ఉంది మరియు భవిష్యత్తు అప్‌డేట్‌లో అందుబాటులో ఉంటుంది',
    danger: 'ప్రమాదం',
    caution: 'హెచ్చరిక',
    interactionDetected: 'మందుల పరస్పర చర్య గుర్తించబడింది',
    notifyCaregiver: 'సంరక్షకునికి తెలియజేయండి',
    doNotTakeTogether: 'మీ వైద్యుడిని సంప్రదించకుండా ఈ మందులను కలిపి తీసుకోవద్దు.',
    added: 'జోడించబడింది',
    warfarinAspirinWarning: 'వార్ఫరిన్ మరియు ఆస్పిరిన్ కలిపి రక్తస్రావ ప్రమాదాన్ని గణనీయంగా పెంచుతాయి. మీ వైద్యుడిని వెంటనే సంప్రదించకుండా వీటిని కలిపి తీసుకోవద్దు.',
    ibuprofenAspirinWarning: 'ఇబుప్రోఫెన్ మరియు ఆస్పిరిన్ కలిపి తీసుకోవడం కడుపు రక్తస్రావ ప్రమాదాన్ని పెంచవచ్చు. మీ ఫార్మసిస్ట్‌ను సంప్రదించండి.',
    settings: 'సెట్టింగ్‌లు',
    language: 'భాష',
    theme: 'థీమ్',
    darkMode: 'డార్క్ మోడ్',
    lightMode: 'లైట్ మోడ్',
  },
};
