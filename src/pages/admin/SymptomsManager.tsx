import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit2, X } from 'lucide-react';
import { symptoms, type Symptom, symptomCategories, type Severity } from '@/data/symptoms';

const SymptomsManager = () => {
    const [symptomsList, setSymptomsList] = useState<Symptom[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Symptom>>({
        name: '',
        category: 'General',
        severities: []
    });

    useEffect(() => {
        // Load from localStorage or use default data
        const stored = localStorage.getItem('phy_symptoms');
        if (stored) {
            setSymptomsList(JSON.parse(stored));
        } else {
            setSymptomsList(symptoms);
        }
    }, []);

    const saveData = (data: Symptom[]) => {
        localStorage.setItem('phy_symptoms', JSON.stringify(data));
        setSymptomsList(data);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId) {
            // Update existing
            const updated = symptomsList.map(s =>
                s.id === editingId ? { ...formData as Symptom } : s
            );
            saveData(updated);
        } else {
            // Add new
            const newSymptom: Symptom = {
                ...formData as Symptom,
                id: `symptom_${Date.now()}`
            };
            saveData([...symptomsList, newSymptom]);
        }

        resetForm();
    };

    const handleEdit = (symptom: Symptom) => {
        setFormData(symptom);
        setEditingId(symptom.id);
        setIsEditing(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('هل أنت متأكد من حذف هذا العرض؟')) {
            saveData(symptomsList.filter(s => s.id !== id));
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            category: 'General',
            severities: []
        });
        setIsEditing(false);
        setEditingId(null);
    };

    const toggleSeverity = (severity: Severity) => {
        const currentSeverities = formData.severities || [];
        if (currentSeverities.includes(severity)) {
            setFormData({
                ...formData,
                severities: currentSeverities.filter(s => s !== severity)
            });
        } else {
            setFormData({
                ...formData,
                severities: [...currentSeverities, severity]
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">إدارة الأعراض</h2>
                    <p className="text-slate-500">إضافة، تعديل، وحذف الأعراض</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all"
                    >
                        <Plus size={20} />
                        إضافة عرض جديد
                    </button>
                )}
            </div>

            {isEditing && (
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-800">
                            {editingId ? 'تعديل العرض' : 'إضافة عرض جديد'}
                        </h3>
                        <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">اسم العرض</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                required
                                placeholder="مثال: صداع"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">التصنيف</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                            >
                                {symptomCategories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">درجات الشدة</label>
                            <div className="flex gap-4">
                                {(['mild', 'moderate', 'severe'] as Severity[]).map((severity) => (
                                    <label key={severity} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.severities?.includes(severity)}
                                            onChange={() => toggleSeverity(severity)}
                                            className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary/20"
                                        />
                                        <span className="text-slate-700">
                                            {severity === 'mild' ? 'خفيف' :
                                                severity === 'moderate' ? 'متوسط' :
                                                    'شديد'}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            {formData.severities && formData.severities.length === 0 && (
                                <p className="text-xs text-red-500 mt-1">يجب اختيار درجة شدة واحدة على الأقل</p>
                            )}
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={!formData.severities || formData.severities.length === 0}
                                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save size={20} />
                                حفظ
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                            >
                                إلغاء
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {symptomsList.map((symptom) => (
                    <div key={symptom.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg font-bold text-slate-800">{symptom.name}</h3>
                                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                                        {symptomCategories.find(c => c.id === symptom.category)?.name}
                                    </span>
                                </div>
                                <div className="flex gap-2 text-xs">
                                    {symptom.severities.map((severity) => (
                                        <span
                                            key={severity}
                                            className={`px-2 py-1 rounded ${severity === 'mild' ? 'bg-green-100 text-green-700' :
                                                    severity === 'moderate' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}
                                        >
                                            {severity === 'mild' ? 'خفيف' :
                                                severity === 'moderate' ? 'متوسط' :
                                                    'شديد'}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(symptom)}
                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(symptom.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SymptomsManager;
