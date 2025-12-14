import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator, ScrollView, Platform, Dimensions, StatusBar, Modal, Alert, AppState } from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

// REPLACE WITH YOUR COMPUTER'S LOCAL IP ADDRESS if running on physical device
// For Android Emulator, 10.0.2.2 is usually localhost
// For iOS Simulator, localhost is localhost
let BACKEND_URL = 'http://localhost:8000';

if (Platform.OS === 'android') {
    // UPDATED for Physical Device: Use your computer's LAN IP
    BACKEND_URL = 'http://10.126.58.127:8000';
}
// For web, localhost works fine, but we might be running on a different machine if hosting
if (Platform.OS === 'web') {
    BACKEND_URL = 'http://localhost:8000';
}

console.log("Using Backend URL:", BACKEND_URL);

const { width, height } = Dimensions.get('window');

import { useTheme } from '@/context/ThemeContext';

export default function ScanScreen() {
    const { getText } = useLanguage();
    const { colorScheme } = useTheme();
    const isDark = colorScheme === 'dark';
    const [permission, requestPermission] = useCameraPermissions();
    const [cameraType, setCameraType] = useState<CameraType>('back');
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Single scan result
    const [currentScan, setCurrentScan] = useState<any>(null);

    // List of accumulated medications
    const [medicationList, setMedicationList] = useState<any[]>([]);

    // Interaction check result
    const [interactionResult, setInteractionResult] = useState<any>(null);

    const cameraRef = useRef<CameraView>(null);
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const isFocused = useIsFocused();
    const [isAppActive, setIsAppActive] = useState(AppState.currentState === 'active');

    // Monitor AppState
    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            setIsAppActive(nextAppState === 'active');
        });

        return () => {
            subscription.remove();
        };
    }, []);

    // Load cabinet on mount
    useEffect(() => {
        loadCabinet();
    }, []);

    const loadCabinet = async () => {
        try {
            const stored = await AsyncStorage.getItem('user_cabinet');
            if (stored) {
                setMedicationList(JSON.parse(stored));
            }
        } catch (e) {
            console.error("Failed to load cabinet", e);
        }
    };

    const saveToCabinet = async (newList: any[]) => {
        try {
            await AsyncStorage.setItem('user_cabinet', JSON.stringify(newList));
        } catch (e) {
            console.error("Failed to save cabinet", e);
        }
    };

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={[styles.container, styles.permissionContainer, isDark && { backgroundColor: '#0f172a' }]}>
                <LinearGradient
                    colors={isDark ? ['#1e293b', '#0f172a'] : ['#eff6ff', '#ffffff', '#f0fdf4']}
                    style={StyleSheet.absoluteFill}
                />
                <Feather name="camera-off" size={48} color={isDark ? '#94a3b8' : '#64748b'} style={{ marginBottom: 20 }} />
                <Text style={[styles.message, isDark && { color: '#cbd5e1' }]}>{getText('cameraPermission')}</Text>
                <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
                    <LinearGradient
                        colors={['#2563eb', '#22c55e']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientButton}
                    >
                        <Text style={styles.primaryButtonText}>{getText('grantPermission')}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        );
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync();
                if (photo) {
                    setCapturedImage(photo.uri);
                    setInteractionResult(null);
                    analyzeImage(photo.uri);
                }
            } catch (error) {
                console.error("Failed to take picture:", error);
            }
        }
    };

    const resetScan = () => {
        setCapturedImage(null);
        setCurrentScan(null);
        setInteractionResult(null);
    };

    const addToList = () => {
        if (currentScan && currentScan.drug_name) {

            const doAdd = () => {
                const newList = [...medicationList, currentScan];
                setMedicationList(newList);
                saveToCabinet(newList);
                resetScan();
                // Optional: Show a toast or small feedback instead of blocking alert
                if (Platform.OS !== 'web') {
                    Alert.alert("Success", getText('successAdd'));
                } else {
                    console.log("Added to cabinet");
                }
            };

            const confirmMsg = getText('confirmAdd').replace('{med}', currentScan.drug_name);

            if (Platform.OS === 'web') {
                if (window.confirm(confirmMsg)) {
                    doAdd();
                }
            } else {
                Alert.alert(
                    getText('addToCabinet'),
                    confirmMsg,
                    [
                        { text: getText('cancel'), style: "cancel" },
                        { text: getText('add'), onPress: doAdd }
                    ]
                );
            }
        }
    };

    const clearList = async () => {
        setMedicationList([]);
        setInteractionResult(null);
        await AsyncStorage.removeItem('user_cabinet');
    };

    const checkInteractions = async () => {
        if (medicationList.length < 2) {
            alert(getText('interactionsError'));
            return;
        }

        setLoading(true);
        try {
            const drugs = medicationList.map(m => m.drug_name);
            const response = await axios.post(`${BACKEND_URL}/interactions`, { drugs });
            setInteractionResult(response.data);
        } catch (error: any) {
            console.error("Interaction check failed:", error);
            const message = error.response?.data?.detail
                ? JSON.stringify(error.response.data.detail)
                : error.message || JSON.stringify(error);
            alert(`Failed to check interactions: ${message}`);
        } finally {
            setLoading(false);
        }
    };

    const analyzeImage = async (uri?: string) => {
        const imageUri = uri || capturedImage;
        if (!imageUri) return;

        setLoading(true);
        try {
            const formData = new FormData();

            if (Platform.OS === 'web') {
                const response = await fetch(imageUri);
                const blob = await response.blob();
                formData.append('file', blob, 'pill_bottle.jpg');
            } else {
                formData.append('file', {
                    uri: imageUri,
                    name: 'pill_bottle.jpg',
                    type: 'image/jpeg',
                } as any);
            }

            const response = await axios.post(`${BACKEND_URL}/analyze-image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setCurrentScan(response.data);
        } catch (error: any) {
            console.error("Analysis failed:", error);
            const message = error.response?.data?.detail
                ? JSON.stringify(error.response.data.detail)
                : error.message || JSON.stringify(error);
            alert(`Failed to analyze image at ${BACKEND_URL}: ${message}. Check your network connection.`);
            // If analysis fails, maybe go back to camera or let user retry?
        } finally {
            setLoading(false);
        }
    };

    // --- Render Components ---

    const renderHeader = () => (
        <View style={[styles.headerOverlay, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                <Feather name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>{getText('scanMedication')}</Text>
                <View style={styles.headerBadge}>
                    <Ionicons name="sparkles" size={12} color="#fbbf24" />
                    <Text style={styles.headerSubtitle}>AI Powered</Text>
                </View>
            </View>
            <View style={{ width: 40 }} />
        </View>
    );

    const renderCameraControls = () => (
        <View style={[styles.controlsOverlay, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.controlsRow}>
                {medicationList.length >= 2 ? (
                    <TouchableOpacity style={styles.miniButton} onPress={checkInteractions}>
                        <LinearGradient
                            colors={['#ef4444', '#dc2626']}
                            style={styles.miniButtonGradient}
                        >
                            <Feather name="activity" size={20} color="white" />
                        </LinearGradient>
                        <Text style={styles.miniButtonText}>{getText('riskLevel')}</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: 60 }} /> // Spacer
                )}

                <TouchableOpacity style={styles.captureButtonOuter} onPress={takePicture} activeOpacity={0.8}>
                    <BlurView intensity={20} tint="light" style={styles.captureButtonBlur}>
                        <View style={styles.captureButtonInner} />
                    </BlurView>
                </TouchableOpacity>

                <TouchableOpacity style={styles.miniButton} onPress={() => { }}>
                    <BlurView intensity={20} tint="light" style={styles.miniButtonBlur}>
                        <Ionicons name="images-outline" size={24} color="white" />
                    </BlurView>
                    <Text style={styles.miniButtonText}>{getText('gallery')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    // List Overlay on Camera
    const renderListOverlay = () => {
        if (medicationList.length === 0) return null;
        return (
            <BlurView intensity={20} tint="dark" style={[styles.listOverlay, { top: insets.top + 80 }]}>
                <Text style={styles.listTitle}>{getText('myCabinet')} ({medicationList.length})</Text>
                {medicationList.slice(-3).map((med, index) => (
                    <View key={index} style={styles.listItem}>
                        <View style={styles.dot} />
                        <Text style={styles.listText} numberOfLines={1}>{med.drug_name}</Text>
                    </View>
                ))}
            </BlurView>
        )
    }

    const renderProcessing = () => {
        if (!loading) return null;
        return (
            <View style={styles.fullScreenOverlay}>
                <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
                <View style={[styles.processingCard, isDark && { backgroundColor: '#1e293b' }]}>
                    <View style={[styles.spinnerContainer, isDark && { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                        <ActivityIndicator size="large" color="#3b82f6" />
                        <View style={styles.spinnerGlow} />
                    </View>
                    <Text style={[styles.processingTitle, isDark && { color: '#f8fafc' }]}>{getText('loading')}</Text>
                    <Text style={[styles.processingSubtitle, isDark && { color: '#94a3b8' }]}>{getText('analyzing')}</Text>
                </View>
            </View>
        );
    };

    const renderResult = () => {
        if (!currentScan || loading) return null;

        const isFailure = !currentScan.drug_name ||
            currentScan.drug_name.toLowerCase().includes('no text') ||
            currentScan.drug_name.toLowerCase() === 'unknown' ||
            currentScan.drug_name.toLowerCase() === 'error';

        if (isFailure) {
            return (
                <View style={styles.fullScreenOverlay}>
                    <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />

                    <View style={styles.resultCard}>
                        <LinearGradient
                            colors={isDark ? ['#1e293b', '#0f172a'] : ['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
                            style={styles.resultGradient}
                        >
                            {/* Header */}
                            <View style={styles.resultHeader}>
                                <View style={[styles.successIconContainer, { shadowColor: '#ef4444' }]}>
                                    <LinearGradient colors={['#ef4444', '#dc2626']} style={styles.successIcon}>
                                        <Feather name="x" size={32} color="white" />
                                    </LinearGradient>
                                </View>
                                <Text style={[styles.resultTitle, isDark && { color: '#f8fafc' }]}>No Medication Found</Text>
                            </View>

                            {/* Details */}
                            <View style={[styles.resultDetails, isDark && { backgroundColor: '#334155', borderColor: '#475569' }]}>
                                <Text style={[styles.fieldLabel, isDark && { color: '#94a3b8' }]}>STATUS</Text>
                                <Text style={[styles.fieldValue, isDark && { color: '#f8fafc' }]}>Could not identify medication</Text>
                                <Text style={{ color: isDark ? '#cbd5e1' : '#64748b', textAlign: 'center' }}>
                                    Please ensure the text on the label is clear and readable.
                                </Text>
                            </View>

                            {/* Actions */}
                            <View style={styles.resultActions}>
                                <TouchableOpacity style={styles.primaryButton} onPress={resetScan}>
                                    <LinearGradient
                                        colors={['#2563eb', '#22c55e']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.gradientButton}
                                    >
                                        <Text style={styles.primaryButtonText}>Try Again</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>

                        </LinearGradient>
                    </View>
                </View>
            );
        }

        return (
            <View style={styles.fullScreenOverlay}>
                <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />

                <View style={styles.resultCard}>
                    <LinearGradient
                        colors={isDark ? ['#1e293b', '#0f172a'] : ['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
                        style={styles.resultGradient}
                    >
                        {/* Header */}
                        <View style={styles.resultHeader}>
                            <View style={styles.successIconContainer}>
                                <LinearGradient colors={['#22c55e', '#16a34a']} style={styles.successIcon}>
                                    <Feather name="check" size={32} color="white" />
                                </LinearGradient>
                            </View>
                            <Text style={[styles.resultTitle, isDark && { color: '#f8fafc' }]}>{getText('medicationFound')}</Text>
                        </View>

                        {/* Details */}
                        <View style={[styles.resultDetails, isDark && { backgroundColor: '#334155', borderColor: '#475569' }]}>
                            <Text style={[styles.fieldLabel, isDark && { color: '#94a3b8' }]}>{getText('medicationName')}</Text>
                            <Text style={[styles.fieldValue, isDark && { color: '#f8fafc' }]}>{currentScan.drug_name}</Text>

                            <LinearGradient
                                colors={['#4ade80', '#3b82f6']}
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                style={styles.divider}
                            />

                            <Text style={[styles.fieldLabel, isDark && { color: '#94a3b8' }]}>{getText('dosageStrength')}</Text>
                            <Text style={[styles.fieldValueSmall, isDark && { color: '#e2e8f0' }]}>{currentScan.strength || getText('unknown')}</Text>
                        </View>

                        {/* Actions */}
                        <View style={styles.resultActions}>
                            <TouchableOpacity style={styles.primaryButton} onPress={addToList}>
                                <LinearGradient
                                    colors={['#2563eb', '#22c55e']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.gradientButton}
                                >
                                    <Ionicons name="sparkles" size={20} color="white" style={{ marginRight: 8 }} />
                                    <Text style={styles.primaryButtonText}>{getText('addToCabinet')}</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.secondaryButton} onPress={resetScan}>
                                <Text style={[styles.secondaryButtonText, isDark && { color: '#94a3b8' }]}>{getText('scanAnother')}</Text>
                            </TouchableOpacity>
                        </View>

                    </LinearGradient>
                </View>
            </View>
        );
    };

    const renderInteractions = () => {
        if (!interactionResult) return null;

        const isRed = interactionResult.risk_level === 'RED';
        const isYellow = interactionResult.risk_level === 'YELLOW';
        const bgColor = isRed ? '#fef2f2' : isYellow ? '#fffbeb' : '#f0fdf4';
        const borderColor = isRed ? '#fee2e2' : isYellow ? '#fef3c7' : '#dcfce7';
        const textColor = isRed ? '#991b1b' : isYellow ? '#92400e' : '#166534';
        const titleColor = isRed ? '#ef4444' : isYellow ? '#f59e0b' : '#22c55e';

        return (
            <Modal animationType="slide" transparent={true} visible={!!interactionResult}>
                <View style={styles.modalOverlay}>
                    <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                    <View style={[styles.interactionCard, { backgroundColor: isDark ? '#1e293b' : bgColor, borderColor: borderColor }]}>
                        <View style={styles.interactionHeader}>
                            <Feather name="alert-triangle" size={32} color={titleColor} />
                            <Text style={[styles.interactionTitle, { color: titleColor }]}>
                                {interactionResult.risk_level} {getText('riskLevel')}
                            </Text>
                        </View>

                        <ScrollView style={styles.interactionScroll}>
                            <Text style={[styles.interactionText, { color: isDark ? '#e2e8f0' : textColor }]}>
                                {interactionResult.explanation}
                            </Text>
                            {interactionResult.recommendation && (
                                <View style={{ marginTop: 16, padding: 12, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderRadius: 12 }}>
                                    <Text style={{ fontSize: 14, fontWeight: '700', color: isDark ? '#cbd5e1' : textColor, marginBottom: 4 }}>{getText('recommendation')}</Text>
                                    <Text style={{ fontSize: 16, color: isDark ? '#f1f5f9' : textColor }}>{interactionResult.recommendation}</Text>
                                </View>
                            )}
                            <Text style={styles.sourceText}>{getText('source')}: {interactionResult.source}</Text>
                        </ScrollView>

                        <TouchableOpacity
                            style={[styles.closeButton, { backgroundColor: titleColor }]}
                            onPress={() => setInteractionResult(null)}
                        >
                            <Text style={styles.closeButtonText}>{getText('understandClose')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Camera View - Only show when Focused, App Active, NOT loading, NOT viewing interactions, AND NOT viewing result */}
            {isFocused && isAppActive && !loading && !interactionResult && !currentScan && (
                <CameraView style={styles.camera} facing={cameraType} ref={cameraRef}>
                    <LinearGradient
                        colors={['rgba(0,0,0,0.7)', 'transparent']}
                        style={styles.topGradient}
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        style={styles.bottomGradient}
                    />
                </CameraView>
            )}

            {/* Show captured image if camera is hidden but we have a photo (e.g. results/loading) */}
            {(loading || currentScan) && capturedImage && (
                <Image source={{ uri: capturedImage }} style={StyleSheet.absoluteFill} />
            )}


            {/* Black background if camera is hidden but not showing captured image */}
            {(loading || interactionResult) && !capturedImage && (
                <View style={{ flex: 1, backgroundColor: '#000000' }} />
            )}

            {/* UI Overlays */}
            {renderHeader()}
            {renderListOverlay()}
            {!loading && !interactionResult && renderCameraControls()}

            {/* State Overlays */}
            {renderProcessing()}
            {renderResult()}
            {renderInteractions()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    permissionContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        backgroundColor: '#f8fafc',
    },
    camera: {
        flex: 1,
    },
    topGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 150,
    },
    bottomGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 200,
    },
    headerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    headerTitleContainer: {
        alignItems: 'center',
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: '700',
    },
    headerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        marginTop: 4,
        gap: 4,
    },
    headerSubtitle: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 12,
        fontWeight: '600',
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    controlsOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    controlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 40,
    },
    captureButtonOuter: {
        width: 84,
        height: 84,
        borderRadius: 42,
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    captureButtonBlur: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    captureButtonInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'white',
    },
    miniButton: {
        alignItems: 'center',
        gap: 4,
    },
    miniButtonBlur: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    miniButtonGradient: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    miniButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    message: {
        textAlign: 'center',
        fontSize: 16,
        color: '#475569',
        marginBottom: 24,
    },
    primaryButton: {
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#2563eb',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    gradientButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 8,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    listOverlay: {
        position: 'absolute',
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 16,
        borderRadius: 16,
        overflow: 'hidden',
        width: 140,
    },
    listTitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#22c55e',
        marginRight: 6,
    },
    listText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    fullScreenOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        zIndex: 20,
    },
    processingCard: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 32,
        borderRadius: 32,
        alignItems: 'center',
        width: '100%',
        maxWidth: 320,
    },
    spinnerContainer: {
        marginBottom: 24,
        padding: 20,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderRadius: 40,
    },
    spinnerGlow: {
        position: 'absolute',
        inset: 0,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: 'rgba(59, 130, 246, 0.2)',
    },
    processingTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: 8,
    },
    processingSubtitle: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
    },
    resultCard: {
        width: '100%',
        borderRadius: 32,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    resultGradient: {
        padding: 32,
    },
    resultHeader: {
        alignItems: 'center',
        marginBottom: 32,
    },
    successIconContainer: {
        marginBottom: 16,
        shadowColor: '#22c55e',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    successIcon: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    resultTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1e293b',
        textAlign: 'center',
    },
    resultDetails: {
        backgroundColor: '#f8fafc',
        borderRadius: 24,
        padding: 24,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    fieldLabel: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 8,
    },
    fieldValue: {
        fontSize: 24,
        color: '#1e293b',
        fontWeight: '700',
        marginBottom: 16,
    },
    fieldValueSmall: {
        fontSize: 20,
        color: '#334155',
        fontWeight: '600',
    },
    divider: {
        height: 4,
        borderRadius: 2,
        width: 40,
        marginBottom: 16,
        opacity: 0.5,
    },
    resultActions: {
        gap: 16,
    },
    secondaryButton: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#64748b',
        fontSize: 16,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    interactionCard: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 32,
        paddingBottom: 48,
        maxHeight: '80%',
        borderWidth: 1,
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 20,
    },
    interactionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 24,
    },
    interactionTitle: {
        fontSize: 24,
        fontWeight: '800',
    },
    interactionScroll: {
        maxHeight: 300,
        marginBottom: 32,
    },
    interactionText: {
        fontSize: 18,
        lineHeight: 28,
        marginBottom: 16,
    },
    sourceText: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.5)',
        fontStyle: 'italic',
    },
    closeButton: {
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    }
});
