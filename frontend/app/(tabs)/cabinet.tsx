import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, Alert, Modal, ScrollView, Platform, ActivityIndicator, StatusBar } from 'react-native';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { BlurView } from 'expo-blur';

// Backend URL Logic
let BACKEND_URL = 'http://localhost:8000';
if (Platform.OS === 'android') {
    // UPDATED for Physical Device: Use your computer's LAN IP
    BACKEND_URL = 'http://10.126.58.127:8000';
}
if (Platform.OS === 'web') {
    BACKEND_URL = 'http://localhost:8000';
}

import { useTheme } from '@/context/ThemeContext';

// ...

export default function CabinetScreen() {
    const insets = useSafeAreaInsets();
    const [medications, setMedications] = useState<any[]>([]);
    const [newDrugName, setNewDrugName] = useState('');
    const [loading, setLoading] = useState(false);
    const [interactionResult, setInteractionResult] = useState<any>(null);
    const [isAdding, setIsAdding] = useState(false);

    const { colorScheme } = useTheme();
    const isDark = colorScheme === 'dark';

    // Load cabinet when screen focuses
    useFocusEffect(
        useCallback(() => {
            loadCabinet();
        }, [])
    );

    const loadCabinet = async () => {
        try {
            const stored = await AsyncStorage.getItem('user_cabinet');
            if (stored) {
                setMedications(JSON.parse(stored));
            }
        } catch (e) {
            console.error("Failed to load cabinet", e);
        }
    };

    const saveCabinet = async (newList: any[]) => {
        try {
            await AsyncStorage.setItem('user_cabinet', JSON.stringify(newList));
            setMedications(newList);
        } catch (e) {
            console.error("Failed to save cabinet", e);
        }
    };

    const addMedication = () => {
        if (!newDrugName.trim()) return;

        const newMed = {
            drug_name: newDrugName.trim(),
            strength: 'Manual Entry',
            frequency: 'N/A'
        };

        const newList = [...medications, newMed];
        saveCabinet(newList);
        setNewDrugName('');
        setIsAdding(false);
    };

    const removeMedication = (index: number) => {
        Alert.alert(
            "Remove Medication",
            "Are you sure you want to remove this medication?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: () => {
                        const newList = [...medications];
                        newList.splice(index, 1);
                        saveCabinet(newList);
                    }
                }
            ]
        );
    };

    const checkInteractions = async () => {
        if (medications.length < 2) {
            Alert.alert("Not enough medications", "Add at least 2 medications to check for interactions.");
            return;
        }

        setLoading(true);
        try {
            const drugs = medications.map(m => m.drug_name);
            const response = await axios.post(`${BACKEND_URL}/interactions`, { drugs });
            setInteractionResult(response.data);
        } catch (error: any) {
            console.error("Interaction check failed:", error);
            Alert.alert("Error", "Failed to check interactions. Ensure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item, index }: { item: any, index: number }) => (
        <View style={[styles.card, isDark && { backgroundColor: '#1e293b' }]}>
            <View style={[styles.cardIcon, isDark && { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                <MaterialCommunityIcons name="pill" size={24} color="#3b82f6" />
            </View>
            <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, isDark && { color: '#f8fafc' }]}>{item.drug_name}</Text>
                <Text style={[styles.cardSubtitle, isDark && { color: '#94a3b8' }]}>{item.strength || 'No strength info'}</Text>
            </View>
            <TouchableOpacity onPress={() => removeMedication(index)} style={styles.deleteButton}>
                <Feather name="trash-2" size={20} color={isDark ? '#ef4444' : '#94a3b8'} />
            </TouchableOpacity>
        </View>
    );

    const renderInteractionModal = () => {
        if (!interactionResult) return null;

        const isRed = interactionResult.risk_level === 'RED';
        const isYellow = interactionResult.risk_level === 'YELLOW';
        const titleColor = isRed ? '#ef4444' : isYellow ? '#f59e0b' : '#22c55e';
        const bgColor = isRed ? '#fef2f2' : isYellow ? '#fffbeb' : '#f0fdf4';
        const textColor = isRed ? '#991b1b' : isYellow ? '#92400e' : '#166534';

        return (
            <Modal animationType="slide" transparent={true} visible={!!interactionResult}>
                <View style={styles.modalOverlay}>
                    <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                    <View style={[styles.modalContent, isDark && { backgroundColor: '#1e293b' }]}>
                        <View style={[styles.resultHeader, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : bgColor }]}>
                            <Feather name="alert-triangle" size={32} color={titleColor} />
                            <Text style={[styles.resultTitle, { color: titleColor }]}>
                                {interactionResult.risk_level} Risk
                            </Text>
                        </View>
                        <ScrollView style={styles.resultBody}>
                            <Text style={[styles.resultText, { color: isDark ? '#e2e8f0' : textColor }]}>
                                {interactionResult.explanation}
                            </Text>
                            {interactionResult.recommendation && (
                                <View style={{ marginTop: 16, padding: 12, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderRadius: 12 }}>
                                    <Text style={{ fontSize: 14, fontWeight: '700', color: isDark ? '#f1f5f9' : textColor, marginBottom: 4 }}>RECOMMENDATION</Text>
                                    <Text style={{ fontSize: 16, color: isDark ? '#cbd5e1' : textColor }}>{interactionResult.recommendation}</Text>
                                </View>
                            )}
                            <Text style={styles.sourceText}>Source: {interactionResult.source}</Text>
                        </ScrollView>
                        <TouchableOpacity
                            style={[styles.closeButton, { backgroundColor: titleColor }]}
                            onPress={() => setInteractionResult(null)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <View style={[styles.container, isDark && { backgroundColor: '#0f172a' }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            <LinearGradient
                colors={isDark ? ['#1e293b', '#0f172a'] : ['#f8fafc', '#e2e8f0']}
                style={StyleSheet.absoluteFill}
            />

            <View style={[styles.header, { paddingTop: insets.top + 20 }, isDark && { backgroundColor: '#1e293b' }]}>
                <Text style={[styles.headerTitle, isDark && { color: '#f8fafc' }]}>Medicine Cabinet</Text>
                <Text style={[styles.headerSubtitle, isDark && { color: '#94a3b8' }]}>{medications.length} Medications Stored</Text>
            </View>

            <FlatList
                data={medications}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Feather name="box" size={48} color={isDark ? '#475569' : '#cbd5e1'} />
                        <Text style={[styles.emptyText, isDark && { color: '#94a3b8' }]}>Your cabinet is empty</Text>
                        <Text style={styles.emptySubText}>Add medications manually or scan them.</Text>
                    </View>
                }
            />

            {/* Manual Add Input */}
            {isAdding && (
                <View style={[styles.addInputContainer, { bottom: insets.bottom + 100 }, isDark && { backgroundColor: '#1e293b', borderColor: '#334155' }]}>
                    <BlurView intensity={80} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
                    <TextInput
                        style={[styles.input, isDark && { backgroundColor: '#334155', color: '#fff', borderColor: '#475569' }]}
                        placeholder="Enter Drug Name (e.g. Ibuprofen)"
                        placeholderTextColor={isDark ? '#94a3b8' : '#9ca3af'}
                        value={newDrugName}
                        onChangeText={setNewDrugName}
                        autoFocus
                    />
                    <View style={styles.addActions}>
                        <TouchableOpacity style={[styles.cancelAddButton, isDark && { backgroundColor: '#334155' }]} onPress={() => setIsAdding(false)}>
                            <Text style={[styles.cancelAddText, isDark && { color: '#94a3b8' }]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmAddButton} onPress={addMedication}>
                            <Text style={styles.confirmAddText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }, isDark && { backgroundColor: '#1e293b', borderTopColor: '#334155', borderWidth: 1 }]}>
                {!isAdding && (
                    <View style={styles.footerRow}>
                        <TouchableOpacity style={styles.addButton} onPress={() => setIsAdding(true)}>
                            <Feather name="plus" size={24} color="white" />
                            <Text style={styles.buttonText}>Add Manual</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.checkButton, medications.length < 2 && styles.disabledButton]}
                            onPress={checkInteractions}
                            disabled={medications.length < 2}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <>
                                    <Feather name="activity" size={24} color="white" />
                                    <Text style={styles.buttonText}>Check Interactions</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {renderInteractionModal()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 24,
        paddingBottom: 24,
        backgroundColor: 'white',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#0f172a',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 4,
    },
    listContent: {
        padding: 24,
        paddingBottom: 150,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#eff6ff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e293b',
    },
    cardSubtitle: {
        fontSize: 13,
        color: '#94a3b8',
    },
    deleteButton: {
        padding: 8,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#64748b',
        marginTop: 16,
    },
    emptySubText: {
        fontSize: 14,
        color: '#94a3b8',
        marginTop: 8,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        paddingTop: 20,
        paddingHorizontal: 24,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    footerRow: {
        flexDirection: 'row',
        gap: 12,
    },
    addButton: {
        flex: 1,
        backgroundColor: '#3b82f6',
        borderRadius: 16,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    checkButton: {
        flex: 1.5,
        backgroundColor: '#22c55e',
        borderRadius: 16,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    disabledButton: {
        backgroundColor: '#94a3b8',
        opacity: 0.7,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },

    // Add Input Styling
    addInputContainer: {
        position: 'absolute',
        left: 20,
        right: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 24,
        padding: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        marginBottom: 16,
    },
    addActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    cancelAddButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: '#f1f5f9',
    },
    confirmAddButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: '#3b82f6',
    },
    cancelAddText: {
        color: '#64748b',
        fontWeight: '600',
    },
    confirmAddText: {
        color: 'white',
        fontWeight: '600',
    },

    // Modal
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 32,
        maxHeight: '85%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 20,
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
        gap: 12,
    },
    resultTitle: {
        fontSize: 20,
        fontWeight: '800',
    },
    resultBody: {
        marginBottom: 24,
    },
    resultText: {
        fontSize: 16,
        lineHeight: 26,
        marginBottom: 16,
    },
    sourceText: {
        fontSize: 13,
        color: '#94a3b8',
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
    },
});
