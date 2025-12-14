import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useLanguage } from '@/context/LanguageContext';

export interface Medication {
    id: string;
    name: string;
    dosage: string;
    addedAt: Date;
    [key: string]: any; // Allow dynamic properties from API scan
}

interface MedicationCardProps {
    medication: Medication;
    onRemove: (id: string) => void;
}

export default function MedicationCard({ medication, onRemove }: MedicationCardProps) {
    const { getText } = useLanguage();

    // Handle date (which might be lost in JSON serialization or simple storage)
    const dateString = medication.addedAt
        ? new Date(medication.addedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
        : null;

    const displayText = dateString
        ? getText('addedOn').replace('{date}', dateString)
        : getText('recently');

    return (
        <View style={styles.container}>
            {/* Decorative Blur and Border */}
            <BlurView intensity={30} tint="light" style={styles.glassContainer}>
                <View style={styles.contentContainer}>
                    {/* Icon and Name */}
                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <LinearGradient
                                colors={['#3b82f6', '#2563eb']}
                                style={styles.iconGradient}
                            >
                                <MaterialCommunityIcons name="pill" size={32} color="white" />
                            </LinearGradient>
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{medication.drug_name || medication.name}</Text>
                        </View>
                    </View>

                    {/* Details */}
                    <View style={styles.details}>
                        <View style={styles.dosageRow}>
                            <View style={styles.dot} />
                            <Text style={styles.dosageText}>{medication.strength || medication.dosage}</Text>
                        </View>
                        <Text style={styles.dateText}>
                            {displayText}
                        </Text>
                    </View>

                    {/* Remove Button (Generic implementation, specific positioning) */}
                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => onRemove(medication.drug_name || medication.name)}
                        activeOpacity={0.7}
                    >
                        <Feather name="trash-2" size={24} color="#ef4444" />
                    </TouchableOpacity>
                </View>
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        backgroundColor: 'rgba(255,255,255,0.6)', // Fallback
    },
    glassContainer: {
        borderRadius: 24,
        padding: 24,
        backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.8)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        marginRight: 16,
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    iconGradient: {
        padding: 12,
        borderRadius: 16,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1f2937', // gray-800
    },
    details: {
        position: 'absolute',
        top: 60,
        left: 72, // Aligned with text
    },
    dosageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#3b82f6',
        marginRight: 8,
    },
    dosageText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151', // gray-700
    },
    dateText: {
        fontSize: 14,
        color: '#6b7280', // gray-500
    },
    removeButton: {
        padding: 12,
        backgroundColor: '#fef2f2', // red-50
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.1)',
    }
});
