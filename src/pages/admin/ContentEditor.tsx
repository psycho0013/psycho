import { useState, useEffect } from 'react';
import { Save, RefreshCw, Check } from 'lucide-react';
import DataManager, { type SiteContent } from '@/services/dataManager';

const ContentEditor = () => {
    const [content, setContent] = useState<SiteContent | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    const [activeTab, setActiveTab] = useState<'home' | 'about' | 'contact'>('home');

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = () => {
        const data = DataManager.getContent();
        setContent(data);
    };

    const handleSave = () => {
        if (!content) return;
        setIsSaving(true);

        // Simulate network delay
        setTimeout(() => {
            DataManager.updateContent(content);
            setLastSaved(new Date());
            setIsSaving(false);
        }, 800);
    };

    const updateField = (path: string, value: any) => {
        if (!content) return;

        // Deep clone to avoid direct mutation
        const newContent = JSON.parse(JSON.stringify(content));

        // Simple path traversal
        const parts = path.split('.');
        let current = newContent;
        for (let i = 0; i < parts.length - 1; i++) {
            current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;

        setContent(newContent);
    };

    if (!content) return <div>Loading...</div>;

    const tabs = [
        { id: 'home', label: 'الرئيسية' },
        { id: 'about', label: 'من نحن' },
        { id: 'contact', label: 'اتصل بنا' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">إدارة المحتوى</h2>
                    <p className="text-slate-500">تعديل نصوص وصور الموقع</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-70"
                >
                    {isSaving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
                    <span>{isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-6 py-3 font-medium text-sm transition-all relative ${activeTab === tab.id
                            ? 'text-primary'
                            : 'text-slate-500 hover:text-slate-800'
                            }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            {lastSaved && (
                <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                    <Check size={16} />
                    تم الحفظ بنجاح في {lastSaved.toLocaleTimeString()}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {activeTab === 'home' && (
                    <>
                        {/* Hero Section */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">القسم الرئيسي (Hero)</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">العنوان الرئيسي</label>
                                    <input
                                        type="text"
                                        value={content.home.hero.title}
                                        onChange={(e) => updateField('home.hero.title', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">النص المميز (Highlight)</label>
                                    <input
                                        type="text"
                                        value={content.home.hero.titleHighlight}
                                        onChange={(e) => updateField('home.hero.titleHighlight', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">الوصف</label>
                                    <textarea
                                        value={content.home.hero.description}
                                        onChange={(e) => updateField('home.hero.description', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none h-24 resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">نص الزر الأساسي</label>
                                    <input
                                        type="text"
                                        value={content.home.hero.primaryButton}
                                        onChange={(e) => updateField('home.hero.primaryButton', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">رابط الصورة</label>
                                    <input
                                        type="text"
                                        value={content.home.hero.image}
                                        onChange={(e) => updateField('home.hero.image', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none text-left"
                                        dir="ltr"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* How It Works Section */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">قسم كيف يعمل النظام</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">عنوان القسم</label>
                                    <input
                                        type="text"
                                        value={content.home.howItWorks.title}
                                        onChange={(e) => updateField('home.howItWorks.title', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">وصف القسم</label>
                                    <textarea
                                        value={content.home.howItWorks.description}
                                        onChange={(e) => updateField('home.howItWorks.description', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none h-24 resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'about' && (
                    <>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">معلومات الصفحة</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">العنوان</label>
                                    <input
                                        type="text"
                                        value={content.about.header.title}
                                        onChange={(e) => updateField('about.header.title', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">الوصف</label>
                                    <textarea
                                        value={content.about.header.description}
                                        onChange={(e) => updateField('about.header.description', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none h-24 resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">معلومات المطور</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">رابط الصورة (Google Drive)</label>
                                    <input
                                        type="text"
                                        value={content.about.developer.image}
                                        onChange={(e) => updateField('about.developer.image', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none text-left"
                                        dir="ltr"
                                        placeholder="https://drive.google.com/..."
                                    />
                                    <p className="text-xs text-slate-400 mt-1">استخدم رابط مباشر للصورة من Google Drive</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">الاسم</label>
                                    <input
                                        type="text"
                                        value={content.about.developer.name}
                                        onChange={(e) => updateField('about.developer.name', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">المسمى الوظيفي</label>
                                    <input
                                        type="text"
                                        value={content.about.developer.role}
                                        onChange={(e) => updateField('about.developer.role', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">نبذة مختصرة</label>
                                    <textarea
                                        value={content.about.developer.bio}
                                        onChange={(e) => updateField('about.developer.bio', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none h-24 resize-none"
                                    />
                                </div>
                                <div className="border-t border-slate-100 pt-4 mt-4">
                                    <h4 className="text-sm font-bold text-slate-700 mb-3">روابط التواصل الاجتماعي</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">رابط Instagram</label>
                                            <input
                                                type="text"
                                                value={content.about.developer.socialLinks?.instagram || ''}
                                                onChange={(e) => updateField('about.developer.socialLinks.instagram', e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none text-left"
                                                dir="ltr"
                                                placeholder="https://instagram.com/..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">رابط Telegram</label>
                                            <input
                                                type="text"
                                                value={content.about.developer.socialLinks?.telegram || ''}
                                                onChange={(e) => updateField('about.developer.socialLinks.telegram', e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none text-left"
                                                dir="ltr"
                                                placeholder="https://t.me/..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'contact' && (
                    <>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">معلومات الاتصال</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">العنوان الرئيسي</label>
                                    <input
                                        type="text"
                                        value={content.contact.header.title}
                                        onChange={(e) => updateField('contact.header.title', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">الوصف</label>
                                    <textarea
                                        value={content.contact.header.description}
                                        onChange={(e) => updateField('contact.header.description', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none h-24 resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">تفاصيل الاتصال</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">البريد الإلكتروني</label>
                                    <input
                                        type="text"
                                        value={content.contact.info.email.value}
                                        onChange={(e) => updateField('contact.info.email.value', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                        dir="ltr"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">الهاتف</label>
                                    <input
                                        type="text"
                                        value={content.contact.info.phone.value}
                                        onChange={(e) => updateField('contact.info.phone.value', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                        dir="ltr"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">الموقع</label>
                                    <input
                                        type="text"
                                        value={content.contact.info.location.value}
                                        onChange={(e) => updateField('contact.info.location.value', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ContentEditor;
