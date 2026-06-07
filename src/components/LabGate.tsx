import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, CheckCircle2, XCircle, AlertTriangle, ArrowRight, Beaker, Timer, FlaskConical, Thermometer, Activity, Zap, Component, Square, Droplets, Microscope, Search, Music, Lock, Unlock } from 'lucide-react';

const GENERAL_TEST = [
  { q: "Apa yang harus dilakukan jika bahan kimia tumpah ke kulit?", options: ["Dibiarkan saja", "Dilap dengan tisu kering", "Segera bilas dengan air mengalir", "Ditiup agar kering"], answer: 2 },
  { q: "Jas laboratorium berfungsi untuk?", options: ["Menghangatkan tubuh", "Melindungi tubuh dan pakaian dari percikan bahan kimia", "Agar terlihat seperti ilmuwan", "Menghilangkan bau"], answer: 1 },
  { q: "Apa fungsi utama lemari asam (fume hood)?", options: ["Menyimpan makanan", "Pemanas ruangan", "Mengisolasi uap dan gas beracun", "Tempat cuci tangan"], answer: 2 },
  { q: "Saat mencium bau bahan kimia dari wadah, hal yang tepat adalah...", options: ["Mendekatkan hidung ke mulut tabung", "Mengibaskan uap dengan tangan ke arah hidung", "Mencicipi sedikit", "Menggunakan sedotan"], answer: 1 }
];

const THEME_TESTS = {
  laju_reaksi: [
    { q: "Apa yang dimaksud dengan laju reaksi?", options: ["Bertambahnya produk per satuan waktu", "Perubahan warna larutan", "Kenaikan suhu percobaan", "Pembentukan endapan asam"], answer: 0 },
    { q: "Faktor apa yang TIDAK mempengaruhi laju reaksi?", options: ["Suhu", "Katalis", "Konsentrasi reaktan", "Warna wadah reaksi"], answer: 3 },
    { q: "Bagaimana katalis dapat mempercepat laju reaksi?", options: ["Menambah reaktan", "Menurunkan energi aktivasi", "Meningkatkan suhu", "Menghentikan tumbukan"], answer: 1 },
    { q: "Sesuai teori tumbukan, laju reaksi meningkat jika...", options: ["Frekuensi tumbukan efektif meningkat", "Frekuensi tumbukan menurun", "Wadah reaksi diperbesar", "Energi aktivasi dinaikkan"], answer: 0 }
  ],
  redoks: [
    { q: "Reaksi oksidasi ditandai dengan...", options: ["Pelepasan elektron", "Pengikatan elektron", "Penurunan bilangan oksidasi", "Pembentukan air"], answer: 0 },
    { q: "Pada sel Volta, anoda merupakan kutub...", options: ["Positif (oksidasi)", "Positif (reduksi)", "Negatif (oksidasi)", "Negatif (reduksi)"], answer: 2 },
    { q: "Fungsi utama jembatan garam adalah...", options: ["Meningkatkan tegangan listrik", "Menghantarkan panas dari lingkungan", "Menetralkan kelebihan ion di masing-masing setengah sel", "Mencegah terjadinya reaksi redoks"], answer: 2 },
    { q: "Potensial sel (E° sel) yang positif menunjukkan bahwa...", options: ["Reaksi endotermik", "Reaksi tidak dapat berlangsung", "Reaksi berlangsung spontan", "Reaksi memerlukan baterai luar"], answer: 2 }
  ]
};

const INVENTORY = [
  { id: 'i1', name: 'Stopwatch', themes: ['laju_reaksi'], icon: <Timer className="w-8 h-8" /> },
  { id: 'i2', name: 'Labu Erlenmeyer', themes: ['laju_reaksi'], icon: <FlaskConical className="w-8 h-8" /> },
  { id: 'i3', name: 'Gelas Kimia', themes: ['laju_reaksi', 'redoks'], icon: <Beaker className="w-8 h-8" /> },
  { id: 'i4', name: 'Termometer', themes: ['laju_reaksi'], icon: <Thermometer className="w-8 h-8" /> },
  { id: 'i5', name: 'Voltmeter', themes: ['redoks'], icon: <Activity className="w-8 h-8" /> },
  { id: 'i6', name: 'Kabel & Capit Buaya', themes: ['redoks'], icon: <Zap className="w-8 h-8" /> },
  { id: 'i7', name: 'Jembatan Garam', themes: ['redoks'], icon: <Component className="w-8 h-8" /> },
  { id: 'i8', name: 'Elektroda Logam', themes: ['redoks'], icon: <Square className="w-8 h-8" /> },
  { id: 'i9', name: 'Larutan Ion', themes: ['redoks'], icon: <Droplets className="w-8 h-8" /> },
  { id: 'i10', name: 'H₂O₂ / HCl', themes: ['laju_reaksi'], icon: <Droplets className="w-8 h-8" /> },
  { id: 'i12', name: 'Mikroskop', themes: [], icon: <Microscope className="w-8 h-8" /> },
  { id: 'i13', name: 'Kaca Pembesar', themes: [], icon: <Search className="w-8 h-8" /> },
  { id: 'i14', name: 'Garpu Tala', themes: [], icon: <Music className="w-8 h-8" /> },
];

export const LabGate = ({ 
    theme, 
    passedGeneralSafety, 
    setPassedGeneralSafety, 
    onUnlock 
}: { 
    theme: 'laju_reaksi' | 'redoks', 
    passedGeneralSafety: boolean, 
    setPassedGeneralSafety: (val: boolean) => void,
    onUnlock: () => void 
}) => {
    
    // Steps: 'sop' -> 'general_test' -> 'theme_test' -> 'prep' -> done
    const [step, setStep] = useState(!passedGeneralSafety ? 'sop' : 'theme_test');
    
    // Quiz state
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [quizResult, setQuizResult] = useState<{score: number, passed: boolean} | null>(null);
    const [showErrors, setShowErrors] = useState(false);

    // Prep state
    const [pickedItems, setPickedItems] = useState<string[]>([]);
    const [prepFeedback, setPrepFeedback] = useState<{message: string, isError: boolean} | null>(null);

    // Reset quiz when step changes
    useEffect(() => {
        setAnswers({});
        setQuizResult(null);
        setShowErrors(false);
        setPickedItems([]);
        setPrepFeedback(null);
    }, [step, theme]);

    const activeQuiz = step === 'general_test' ? GENERAL_TEST : THEME_TESTS[theme];

    const handleSubmitQuiz = () => {
        let correctCount = 0;
        activeQuiz.forEach((q, i) => {
            if (answers[i] === q.answer) correctCount++;
        });
        const score = (correctCount / activeQuiz.length) * 100;
        const passed = score >= 75;
        
        setQuizResult({ score, passed });
        setShowErrors(!passed);

        if (passed) {
            setTimeout(() => {
                if (step === 'general_test') {
                    setPassedGeneralSafety(true);
                    setStep('theme_test');
                } else if (step === 'theme_test') {
                    setStep('prep');
                }
            }, 2000);
        }
    };

    const handlePickItem = (item: typeof INVENTORY[0]) => {
        // Prevent clicking already picked items
        if (pickedItems.includes(item.id)) return;

        const isCorrect = item.themes.includes(theme);
        
        if (isCorrect) {
            setPickedItems(prev => [...prev, item.id]);
            setPrepFeedback({ message: `Benar! ${item.name} dibutuhkan.`, isError: false });
        } else {
            setPrepFeedback({ message: `Salah! ${item.name} tidak dibutuhkan untuk praktikum ini.`, isError: true });
        }

        // Check if prep is fully completed
        const requiredItems = INVENTORY.filter(i => i.themes.includes(theme));
        if (isCorrect && pickedItems.length + 1 === requiredItems.length) {
            setPrepFeedback({ message: 'Selamat! Semua alat dan bahan berhasil disiapkan.', isError: false });
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 sm:p-8">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh]">
                
                {/* Header Sequence */}
                <div className="bg-indigo-900 px-6 py-4 rounded-t-3xl flex items-center justify-between text-white shrink-0">
                    <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-indigo-400" />
                        <h2 className="font-bold tracking-wide uppercase text-sm">Gerbang Laboratorium Virtual</h2>
                    </div>
                    <div className="text-xs font-bold text-indigo-300 uppercase tracking-widest flex items-center gap-2">
                        <span>{step === 'sop' ? '1/4 : SOP SOP' : step === 'general_test' ? '2/4 : Safety' : step === 'theme_test' ? '3/4 : Teori Dasar' : '4/4 : Persiapan'}</span>
                    </div>
                </div>

                <div className="p-6 md:p-8 flex-1 overflow-y-auto flex flex-col">
                    
                    {step === 'sop' && (
                        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="text-center mb-4">
                                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                                <h3 className="text-2xl font-black text-slate-800">Panduan Keselamatan Kerja</h3>
                                <p className="text-slate-500 font-medium mt-1">Harap baca SOP keselamatan laboratorium sebelum memulai praktikum apa pun.</p>
                            </div>
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-slate-700 space-y-3">
                                <p><strong className="text-slate-900">1. Penggunaan APD:</strong> Kenakan jas lab, sarung tangan, kacamata pelindung, dan masker setiap saat.</p>
                                <p><strong className="text-slate-900">2. Makanan & Minuman:</strong> Dilarang keras makan dan minum di dalam area laboratorium untuk menghindari kontaminasi silang.</p>
                                <p><strong className="text-slate-900">3. Penanganan Bahan:</strong> Dilarang mencium bahan kimia secara langsung. Kibaskan tangan ke arah hidung jika perlu mencium bau.</p>
                                <p><strong className="text-slate-900">4. Penanganan Tumpahan:</strong> Segera laporkan tumpahan, dan jika terkena kulit bilas dengan air mengalir selama minimal 15 menit.</p>
                            </div>
                            <button 
                                onClick={() => setStep('general_test')}
                                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all w-full md:w-auto self-center uppercase tracking-wide text-sm shadow-md"
                            >
                                Saya Mengerti, Lanjut Tes <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {(step === 'general_test' || step === 'theme_test') && (
                        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex items-center gap-3 mb-2">
                                <ShieldCheck className="w-8 h-8 text-indigo-500" />
                                <div>
                                    <h3 className="text-xl font-black text-slate-800">{step === 'general_test' ? 'Tes Pengenalan Laboratorium' : `Tes Awal Praktikum: ${theme === 'laju_reaksi' ? 'Laju Reaksi' : 'Reaksi Redoks'}`}</h3>
                                    <p className="text-slate-500 font-medium text-sm">Jawab dengan benar untuk membuka kunci laboratorium. (Batas Kelulusan: 75)</p>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                {activeQuiz.map((q, qIndex) => (
                                    <div key={qIndex} className={`bg-slate-50 border ${showErrors && answers[qIndex] !== q.answer ? 'border-red-300 bg-red-50/30' : 'border-slate-200'} rounded-xl p-5`}>
                                        <p className="font-bold text-slate-800 mb-4 text-sm">{qIndex + 1}. {q.q}</p>
                                        <div className="space-y-2">
                                            {q.options.map((opt, oIndex) => {
                                                const isSelected = answers[qIndex] === oIndex;
                                                const isCorrectAns = showErrors && q.answer === oIndex;
                                                return (
                                                    <button
                                                        key={oIndex}
                                                        onClick={() => setAnswers(prev => ({...prev, [qIndex]: oIndex}))}
                                                        className={`w-full text-left p-3 rounded-lg border text-sm font-medium transition-colors flex items-center justify-between ${
                                                            isSelected ? 'bg-indigo-100 border-indigo-400 text-indigo-800' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-200'
                                                        } ${isCorrectAns ? 'bg-emerald-100 border-emerald-400 text-emerald-800' : ''}`}
                                                    >
                                                        <span>{opt}</span>
                                                        {isCorrectAns && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {quizResult ? (
                                <div className={`p-5 rounded-xl border flex items-center justify-between ${quizResult.passed ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                                    <div className="flex items-center gap-3">
                                        {quizResult.passed ? <CheckCircle2 className="w-8 h-8 text-emerald-600" /> : <XCircle className="w-8 h-8 text-red-600" />}
                                        <div>
                                            <h4 className={`font-bold ${quizResult.passed ? 'text-emerald-800' : 'text-red-800'}`}>Nilai Anda: {quizResult.score} / 100</h4>
                                            <p className={`text-xs font-medium ${quizResult.passed ? 'text-emerald-600' : 'text-red-600'}`}>{quizResult.passed ? 'Lulus! Melanjutkan ke tahap berikutnya...' : 'Belum lulus. Silakan perbaiki jawaban Anda.'}</p>
                                        </div>
                                    </div>
                                    {!quizResult.passed && (
                                        <button 
                                            onClick={() => { setQuizResult(null); setShowErrors(false); }}
                                            className="px-4 py-2 bg-white rounded-lg border border-red-200 text-red-700 font-bold text-xs hover:bg-red-50"
                                        >
                                            Coba Lagi
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <button 
                                    onClick={handleSubmitQuiz}
                                    disabled={Object.keys(answers).length < activeQuiz.length}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all uppercase tracking-wide text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Kirim Jawaban
                                </button>
                            )}
                        </div>
                    )}

                    {step === 'prep' && (() => {
                        const requiredItems = INVENTORY.filter(i => i.themes.includes(theme));
                        const isDone = pickedItems.length === requiredItems.length;

                        return (
                            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 h-full">
                                <div className="text-center mb-2">
                                    <h3 className="text-2xl font-black text-slate-800">Persiapan Alat & Bahan</h3>
                                    <p className="text-slate-500 font-medium mt-1">Pilih perlengkapan yang TEPAT untuk praktikum <strong className="text-slate-700">{theme === 'laju_reaksi' ? 'Laju Reaksi' : 'Reaksi Redoks'}</strong>.</p>
                                </div>

                                {prepFeedback && (
                                    <div className={`p-4 rounded-xl border flex items-center shadow-sm gap-3 ${prepFeedback.isError ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
                                        {prepFeedback.isError ? <XCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
                                        <span className="font-bold text-sm">{prepFeedback.message}</span>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-500 bg-slate-100 p-3 rounded-lg justify-between items-center">
                                    <span>Terkumpul: {pickedItems.length} / {requiredItems.length} alat & bahan wajib</span>
                                    {isDone && <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> LENGKAP</span>}
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 lg:gap-4 flex-1">
                                    {INVENTORY.map(item => {
                                        const isPicked = pickedItems.includes(item.id);
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => handlePickItem(item)}
                                                disabled={isPicked || isDone}
                                                className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-3 transition-all relative ${
                                                    isPicked 
                                                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700 opacity-60' 
                                                        : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600'
                                                }`}
                                            >
                                                {isPicked && <CheckCircle2 className="w-6 h-6 text-emerald-500 absolute top-2 right-2" />}
                                                <div className={isPicked ? 'text-emerald-600' : ''}>
                                                    {item.icon}
                                                </div>
                                                <span className="text-xs font-bold text-center leading-tight">{item.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <button 
                                    onClick={onUnlock}
                                    disabled={!isDone}
                                    className={`mt-4 py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all uppercase tracking-wider text-sm shadow-md ${
                                        isDone ? 'bg-indigo-600 hover:bg-indigo-700 text-white hover:-translate-y-0.5' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    }`}
                                >
                                    <Unlock className="w-5 h-5" /> Buka Laboratorium
                                </button>
                            </div>
                        );
                    })()}

                </div>
            </div>
        </div>
    );
};
