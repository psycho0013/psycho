import DiagnosisStorage from './diagnosisStorage';
import type { Gender } from '@/pages/Diagnosis';
import { symptoms } from '@/data/symptoms';
import { diseases } from '@/data/diseases';

export interface SymptomStat {
    id: string;
    name: string;
    count: number;
}

export interface DiseaseStat {
    id: string;
    name: string;
    count: number;
}

export interface GenderComparison {
    male: number;
    female: number;
    total: number;
}

export interface AgeGroupDisease {
    ageGroup: string;
    topDiseases: DiseaseStat[];
}

export interface ProvinceDiseaseStat {
    provinceId: string;
    provinceName: string;
    topDiseases: DiseaseStat[];
    totalDiagnoses: number;
}

class StatisticsService {
    /**
     * Get top 10 symptoms by gender
     */
    static getTopSymptomsByGender(gender: Gender): SymptomStat[] {
        const records = DiagnosisStorage.getRecordsByGender(gender);
        const symptomCounts = new Map<string, number>();

        // Count all symptoms
        records.forEach(record => {
            record.symptoms.forEach(symptom => {
                const currentCount = symptomCounts.get(symptom.id) || 0;
                symptomCounts.set(symptom.id, currentCount + 1);
            });
        });

        // Convert to array and sort
        const symptomStats: SymptomStat[] = [];
        symptomCounts.forEach((count, id) => {
            const symptomData = symptoms.find(s => s.id === id);
            if (symptomData) {
                symptomStats.push({
                    id,
                    name: symptomData.name,
                    count,
                });
            }
        });

        // Sort descending and take top 10
        return symptomStats
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    }

    /**
     * Get top 10 diagnosed diseases by gender
     */
    static getTopDiseasesByGender(gender: Gender): DiseaseStat[] {
        const records = DiagnosisStorage.getRecordsByGender(gender);
        const diseaseCounts = new Map<string, number>();

        // Count diagnosed diseases (excluding null/no match cases)
        records.forEach(record => {
            if (record.diagnosedDisease) {
                const currentCount = diseaseCounts.get(record.diagnosedDisease) || 0;
                diseaseCounts.set(record.diagnosedDisease, currentCount + 1);
            }
        });

        // Convert to array and sort
        const diseaseStats: DiseaseStat[] = [];
        diseaseCounts.forEach((count, id) => {
            const diseaseData = diseases.find(d => d.id === id);
            if (diseaseData) {
                diseaseStats.push({
                    id,
                    name: diseaseData.name,
                    count,
                });
            }
        });

        // Sort descending and take top 10
        return diseaseStats
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    }

    /**
     * Calculate average match percentage
     */
    static getAverageMatchPercentage(): number {
        const records = DiagnosisStorage.getAllRecords();

        if (records.length === 0) return 0;

        const total = records.reduce((sum, record) => sum + record.matchPercentage, 0);
        return Math.round((total / records.length) * 10) / 10; // Round to 1 decimal
    }

    /**
     * Calculate error rate (percentage of cases with no match)
     */
    static getErrorRate(): number {
        const records = DiagnosisStorage.getAllRecords();

        if (records.length === 0) return 0;

        const noMatchCount = records.filter(record => record.diagnosedDisease === null).length;
        return Math.round((noMatchCount / records.length) * 1000) / 10; // Round to 1 decimal
    }

    /**
     * Calculate medical attention rate (percentage of cases needing immediate care)
     */
    static getMedicalAttentionRate(): number {
        const records = DiagnosisStorage.getAllRecords();

        if (records.length === 0) return 0;

        const medicalAttentionCount = records.filter(record => record.needsMedicalAttention).length;
        return Math.round((medicalAttentionCount / records.length) * 1000) / 10; // Round to 1 decimal
    }

    /**
     * Get total diagnosis count
     */
    static getTotalDiagnosisCount(): number {
        return DiagnosisStorage.getAllRecords().length;
    }

    /**
     * Get today's diagnosis count
     */
    static getTodayDiagnosisCount(): number {
        const records = DiagnosisStorage.getAllRecords();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTimestamp = today.getTime();

        return records.filter(record => record.timestamp >= todayTimestamp).length;
    }

    /**
     * Get gender comparison (male vs female diagnosis counts)
     */
    static getGenderComparison(): GenderComparison {
        const records = DiagnosisStorage.getAllRecords();

        const maleCount = records.filter(r => r.gender === 'male').length;
        const femaleCount = records.filter(r => r.gender === 'female').length;

        return {
            male: maleCount,
            female: femaleCount,
            total: records.length
        };
    }

    /**
     * Get disease distribution by age groups
     */
    static getDiseasesByAgeGroup(): AgeGroupDisease[] {
        const records = DiagnosisStorage.getAllRecords();

        // Define age groups
        const ageGroups = [
            { label: '13-17 سنة', min: 13, max: 17 },
            { label: '18-24 سنة', min: 18, max: 24 },
            { label: '25-34 سنة', min: 25, max: 34 },
            { label: '35-44 سنة', min: 35, max: 44 },
            { label: '45-54 سنة', min: 45, max: 54 },
            { label: '55-64 سنة', min: 55, max: 64 },
            { label: '65+ سنة', min: 65, max: 150 },
        ];

        const ageGroupResults: AgeGroupDisease[] = [];

        ageGroups.forEach(group => {
            // Filter records for this age group
            const groupRecords = records.filter(
                r => r.age >= group.min && r.age <= group.max
            );

            // Count diseases in this age group
            const diseaseCounts = new Map<string, number>();
            groupRecords.forEach(record => {
                if (record.diagnosedDisease) {
                    const currentCount = diseaseCounts.get(record.diagnosedDisease) || 0;
                    diseaseCounts.set(record.diagnosedDisease, currentCount + 1);
                }
            });

            // Convert to array and sort
            const diseaseStats: DiseaseStat[] = [];

            // Load diseases from localStorage
            const storedDiseases = localStorage.getItem('phy_diseases');
            const diseasesData = storedDiseases ? JSON.parse(storedDiseases) : diseases;

            diseaseCounts.forEach((count, id) => {
                const diseaseData = diseasesData.find((d: any) => d.id === id);
                if (diseaseData) {
                    diseaseStats.push({
                        id,
                        name: diseaseData.name,
                        count,
                    });
                }
            });

            // Sort and take top 3 per age group
            const topDiseases = diseaseStats
                .sort((a, b) => b.count - a.count)
                .slice(0, 3);

            ageGroupResults.push({
                ageGroup: group.label,
                topDiseases,
            });
        });

        return ageGroupResults;
    }

    /**
     * Get disease distribution by province
     */
    static getDiseasesByProvince(): ProvinceDiseaseStat[] {
        const records = DiagnosisStorage.getAllRecords();

        // Import provinces dynamically
        const provinces = [
            { id: 'baghdad', name: 'بغداد' },
            { id: 'basra', name: 'البصرة' },
            { id: 'nineveh', name: 'نينوى' },
            { id: 'dhi_qar', name: 'ذي قار' },
            { id: 'najaf', name: 'النجف' },
            { id: 'karbala', name: 'كربلاء' },
            { id: 'babil', name: 'بابل' },
            { id: 'anbar', name: 'الأنبار' },
            { id: 'diyala', name: 'ديالى' },
            { id: 'wasit', name: 'واسط' },
            { id: 'salah_ad_din', name: 'صلاح الدين' },
            { id: 'kirkuk', name: 'كركوك' },
            { id: 'maysan', name: 'ميسان' },
            { id: 'qadisiyyah', name: 'القادسية' },
            { id: 'muthanna', name: 'المثنى' },
            { id: 'dohuk', name: 'دهوك' },
            { id: 'erbil', name: 'أربيل' },
            { id: 'sulaymaniyah', name: 'السليمانية' },
        ];

        const provinceResults: ProvinceDiseaseStat[] = [];

        // Load diseases from localStorage
        const storedDiseases = localStorage.getItem('phy_diseases');
        const diseasesData = storedDiseases ? JSON.parse(storedDiseases) : diseases;

        provinces.forEach(province => {
            // Filter records for this province
            const provinceRecords = records.filter(r => r.province === province.id);

            // Count diseases in this province
            const diseaseCounts = new Map<string, number>();
            provinceRecords.forEach(record => {
                if (record.diagnosedDisease) {
                    const currentCount = diseaseCounts.get(record.diagnosedDisease) || 0;
                    diseaseCounts.set(record.diagnosedDisease, currentCount + 1);
                }
            });

            // Convert to array and sort
            const diseaseStats: DiseaseStat[] = [];
            diseaseCounts.forEach((count, id) => {
                const diseaseData = diseasesData.find((d: any) => d.id === id);
                if (diseaseData) {
                    diseaseStats.push({
                        id,
                        name: diseaseData.name,
                        count,
                    });
                }
            });

            // Sort and take top 3 per province
            const topDiseases = diseaseStats
                .sort((a, b) => b.count - a.count)
                .slice(0, 3);

            provinceResults.push({
                provinceId: province.id,
                provinceName: province.name,
                topDiseases,
                totalDiagnoses: provinceRecords.length,
            });
        });

        // Sort provinces by total diagnoses (most active first)
        return provinceResults.sort((a, b) => b.totalDiagnoses - a.totalDiagnoses);
    }
}

export default StatisticsService;
