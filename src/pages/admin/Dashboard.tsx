import { useState, useEffect } from 'react';
import { Users, FileText, Activity, TrendingUp, Target, AlertTriangle, Siren } from 'lucide-react';
import StatisticsService from '@/services/statisticsService';
import type { SymptomStat, DiseaseStat, GenderComparison, AgeGroupDisease, ProvinceDiseaseStat } from '@/services/statisticsService';

const Dashboard = () => {
    const [maleTopSymptoms, setMaleTopSymptoms] = useState<SymptomStat[]>([]);
    const [femaleTopSymptoms, setFemaleTopSymptoms] = useState<SymptomStat[]>([]);
    const [maleTopDiseases, setMaleTopDiseases] = useState<DiseaseStat[]>([]);
    const [femaleTopDiseases, setFemaleTopDiseases] = useState<DiseaseStat[]>([]);
    const [avgMatchPercentage, setAvgMatchPercentage] = useState(0);
    const [errorRate, setErrorRate] = useState(0);
    const [medicalAttentionRate, setMedicalAttentionRate] = useState(0);
    const [totalDiagnoses, setTotalDiagnoses] = useState(0);
    const [todayDiagnoses, setTodayDiagnoses] = useState(0);
    const [genderComparison, setGenderComparison] = useState<GenderComparison>({ male: 0, female: 0, total: 0 });
    const [ageDistribution, setAgeDistribution] = useState<AgeGroupDisease[]>([]);
    const [provinceDistribution, setProvinceDistribution] = useState<ProvinceDiseaseStat[]>([]);

    useEffect(() => {
        loadStatistics();
    }, []);

    const loadStatistics = () => {
        // Load top symptoms by gender
        setMaleTopSymptoms(StatisticsService.getTopSymptomsByGender('male'));
        setFemaleTopSymptoms(StatisticsService.getTopSymptomsByGender('female'));

        // Load top diseases by gender
        setMaleTopDiseases(StatisticsService.getTopDiseasesByGender('male'));
        setFemaleTopDiseases(StatisticsService.getTopDiseasesByGender('female'));

        // Load percentages
        setAvgMatchPercentage(StatisticsService.getAverageMatchPercentage());
        setErrorRate(StatisticsService.getErrorRate());
        setMedicalAttentionRate(StatisticsService.getMedicalAttentionRate());

        // Load counts
        setTotalDiagnoses(StatisticsService.getTotalDiagnosisCount());
        setTodayDiagnoses(StatisticsService.getTodayDiagnosisCount());

        // Load new statistics
        setGenderComparison(StatisticsService.getGenderComparison());
        setAgeDistribution(StatisticsService.getDiseasesByAgeGroup());
        setProvinceDistribution(StatisticsService.getDiseasesByProvince());
    };

    const stats = [
        { label: 'إجمالي التشخيصات', value: totalDiagnoses.toString(), change: '+12%', icon: Users, color: 'bg-blue-500' },
        { label: 'تشخيصات اليوم', value: todayDiagnoses.toString(), change: '+5%', icon: Activity, color: 'bg-emerald-500' },
        { label: 'صفحات المحتوى', value: '12', change: '0%', icon: FileText, color: 'bg-purple-500' },
        { label: 'معدل التحويل', value: '3.2%', change: '+0.4%', icon: TrendingUp, color: 'bg-orange-500' },
    ];

    const accuracyStats = [
        {
            label: 'نسبة التطابق المتوسطة',
            value: `${avgMatchPercentage}%`,
            icon: Target,
            color: 'bg-green-500',
            description: 'متوسط التطابق بين الأعراض والمرض المتوقع'
        },
        {
            label: 'معدل الخطأ',
            value: `${errorRate}%`,
            icon: AlertTriangle,
            color: 'bg-amber-500',
            description: 'نسبة الحالات التي لم يُعثر فيها على تطابق'
        },
        {
            label: 'الحالات الطارئة',
            value: `${medicalAttentionRate}%`,
            icon: Siren,
            color: 'bg-red-500',
            description: 'نسبة الحالات التي تحتاج مراجعة طبية فورية'
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">نظرة عامة</h2>
                <p className="text-slate-500">ملخص لأداء المنصة اليوم</p>
            </div>

            {/* Main Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-white shadow-lg shadow-current/30`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{stat.change}</span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.label}</h3>
                        <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Accuracy Statistics */}
            <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">إحصائيات الدقة</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {accuracyStats.map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-3">
                                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-white shadow-lg shadow-current/30`}>
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <h4 className="text-slate-500 text-sm font-medium">{stat.label}</h4>
                                    <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                                </div>
                            </div>
                            <p className="text-xs text-slate-400">{stat.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Symptoms by Gender */}
            <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">أكثر الأعراض اختياراً</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Males */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="bg-blue-50 border-b border-blue-100 px-6 py-4">
                            <h4 className="font-bold text-blue-900">الذكور</h4>
                        </div>
                        <div className="p-4">
                            {maleTopSymptoms.length > 0 ? (
                                <div className="space-y-2">
                                    {maleTopSymptoms.map((symptom, index) => (
                                        <div key={symptom.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className="w-6 h-6 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                    {index + 1}
                                                </span>
                                                <span className="text-slate-700 font-medium">{symptom.name}</span>
                                            </div>
                                            <span className="text-blue-600 font-bold">{symptom.count}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-slate-400 py-8">لا توجد بيانات كافية</p>
                            )}
                        </div>
                    </div>

                    {/* Females */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="bg-pink-50 border-b border-pink-100 px-6 py-4">
                            <h4 className="font-bold text-pink-900">الإناث</h4>
                        </div>
                        <div className="p-4">
                            {femaleTopSymptoms.length > 0 ? (
                                <div className="space-y-2">
                                    {femaleTopSymptoms.map((symptom, index) => (
                                        <div key={symptom.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className="w-6 h-6 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                    {index + 1}
                                                </span>
                                                <span className="text-slate-700 font-medium">{symptom.name}</span>
                                            </div>
                                            <span className="text-pink-600 font-bold">{symptom.count}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-slate-400 py-8">لا توجد بيانات كافية</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Diseases by Gender */}
            <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">أكثر الأمراض تشخيصاً</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Males */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4">
                            <h4 className="font-bold text-emerald-900">الذكور</h4>
                        </div>
                        <div className="p-4">
                            {maleTopDiseases.length > 0 ? (
                                <div className="space-y-2">
                                    {maleTopDiseases.map((disease, index) => (
                                        <div key={disease.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className="w-6 h-6 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                    {index + 1}
                                                </span>
                                                <span className="text-slate-700 font-medium">{disease.name}</span>
                                            </div>
                                            <span className="text-emerald-600 font-bold">{disease.count}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-slate-400 py-8">لا توجد بيانات كافية</p>
                            )}
                        </div>
                    </div>

                    {/* Females */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="bg-purple-50 border-b border-purple-100 px-6 py-4">
                            <h4 className="font-bold text-purple-900">الإناث</h4>
                        </div>
                        <div className="p-4">
                            {femaleTopDiseases.length > 0 ? (
                                <div className="space-y-2">
                                    {femaleTopDiseases.map((disease, index) => (
                                        <div key={disease.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className="w-6 h-6 bg-purple-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                    {index + 1}
                                                </span>
                                                <span className="text-slate-700 font-medium">{disease.name}</span>
                                            </div>
                                            <span className="text-purple-600 font-bold">{disease.count}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-slate-400 py-8">لا توجد بيانات كافية</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Gender Comparison */}
            <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">مقارنة الجنسين</h3>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    {genderComparison.total > 0 ? (
                        <div className="space-y-4">
                            {/* Male */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        <span className="font-bold text-slate-700">الذكور</span>
                                    </div>
                                    <span className="text-2xl font-bold text-blue-600">{genderComparison.male}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-3">
                                    <div
                                        className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                                        style={{ width: `${(genderComparison.male / genderComparison.total) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                    {((genderComparison.male / genderComparison.total) * 100).toFixed(1)}% من إجمالي التشخيصات
                                </p>
                            </div>

                            {/* Female */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                                        <span className="font-bold text-slate-700">الإناث</span>
                                    </div>
                                    <span className="text-2xl font-bold text-pink-600">{genderComparison.female}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-3">
                                    <div
                                        className="bg-pink-500 h-3 rounded-full transition-all duration-500"
                                        style={{ width: `${(genderComparison.female / genderComparison.total) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                    {((genderComparison.female / genderComparison.total) * 100).toFixed(1)}% من إجمالي التشخيصات
                                </p>
                            </div>

                            {/* Total */}
                            <div className="pt-4 border-t border-slate-100">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 font-medium">إجمالي التشخيصات</span>
                                    <span className="text-2xl font-bold text-slate-800">{genderComparison.total}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-slate-400 py-8">لا توجد بيانات كافية</p>
                    )}
                </div>
            </div>

            {/* Disease Distribution by Age */}
            <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">توزيع الأمراض حسب الفئات العمرية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {ageDistribution.map((group, index) => (
                        <div key={index} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-3 border-b border-slate-100">
                                <h4 className="font-bold text-slate-800">{group.ageGroup}</h4>
                            </div>
                            <div className="p-4">
                                {group.topDiseases.length > 0 ? (
                                    <div className="space-y-3">
                                        {group.topDiseases.map((disease, idx) => (
                                            <div key={disease.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${idx === 0 ? 'bg-amber-500' :
                                                        idx === 1 ? 'bg-slate-400' :
                                                            'bg-orange-600'
                                                        }`}>
                                                        {idx + 1}
                                                    </span>
                                                    <span className="text-slate-700 text-sm font-medium">{disease.name}</span>
                                                </div>
                                                <span className="text-primary font-bold text-sm">{disease.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-slate-400 text-sm py-4">لا توجد بيانات</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Disease Distribution by Province */}
            <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">توزيع الأمراض حسب المحافظات</h3>
                <p className="text-slate-500 text-sm mb-6">أكثر 3 أمراض انتشاراً في كل محافظة</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {provinceDistribution.map((province) => (
                        <div key={province.provinceId} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 px-4 py-3 border-b border-slate-100">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-slate-800">{province.provinceName}</h4>
                                    <span className="text-xs px-2 py-1 bg-white rounded-full text-slate-600 font-medium">
                                        {province.totalDiagnoses} تشخيص
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                {province.topDiseases.length > 0 ? (
                                    <div className="space-y-3">
                                        {province.topDiseases.map((disease, idx) => (
                                            <div key={disease.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 flex-1">
                                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${idx === 0 ? 'bg-amber-500' :
                                                            idx === 1 ? 'bg-slate-400' :
                                                                'bg-orange-600'
                                                        }`}>
                                                        {idx + 1}
                                                    </span>
                                                    <span className="text-slate-700 text-sm font-medium truncate">{disease.name}</span>
                                                </div>
                                                <span className="text-indigo-600 font-bold text-sm ml-2">{disease.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-slate-400 text-sm py-4">لا توجد بيانات</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

