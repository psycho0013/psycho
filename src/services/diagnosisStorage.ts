import type { Gender } from '@/pages/Diagnosis';

export interface DiagnosisRecord {
    id: string;
    timestamp: number;
    gender: Gender;
    age: number;
    province: string; // Geographic location for province-based statistics
    symptoms: Array<{ id: string; severity: string }>;
    diagnosedDisease: string | null;
    matchPercentage: number;
    needsMedicalAttention: boolean;
}

class DiagnosisStorage {
    private static STORAGE_KEY = 'phy_diagnosis_records';

    /**
     * Save a new diagnosis record
     */
    static saveDiagnosis(record: Omit<DiagnosisRecord, 'id' | 'timestamp'>): void {
        const fullRecord: DiagnosisRecord = {
            ...record,
            id: this.generateId(),
            timestamp: Date.now(),
        };

        const records = this.getAllRecords();
        records.push(fullRecord);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
    }

    /**
     * Get all diagnosis records
     */
    static getAllRecords(): DiagnosisRecord[] {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (!stored) return [];

        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Failed to parse diagnosis records:', e);
            return [];
        }
    }

    /**
     * Get records by gender
     */
    static getRecordsByGender(gender: Gender): DiagnosisRecord[] {
        return this.getAllRecords().filter(record => record.gender === gender);
    }

    /**
     * Clear all records (for testing/admin purposes)
     */
    static clearAllRecords(): void {
        localStorage.removeItem(this.STORAGE_KEY);
    }

    /**
     * Generate a unique ID
     */
    private static generateId(): string {
        return `diag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

export default DiagnosisStorage;
