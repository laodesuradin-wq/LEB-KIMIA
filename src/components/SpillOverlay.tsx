import React, { useState } from 'react';
import { AlertTriangle, Droplet, Brush, Trash2, CheckCircle2 } from 'lucide-react';

export const SpillOverlay = ({ onCleaned }: { onCleaned: () => void }) => {
    const [step, setStep] = useState(0);

    const handleAction = (expectedStep: number) => {
        if (step === expectedStep) {
            setStep(step + 1);
        }
    };

    return (
        <div className="absolute inset-0 z-50 bg-red-900/40 backdrop-blur-sm flex items-start justify-center p-6 overflow-y-auto pt-10 pb-10 animate-in fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 text-center border-2 border-red-500 relative shrink-0">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500"></div>
                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4 animate-bounce" />
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-2">Tumpahan Darurat!</h3>
                <p className="text-slate-600 font-medium text-sm mb-6">
                    Bahan kimia tumpah ke meja kerja! Lakukan protokol pembersihan darurat secara berurutan untuk mengamankan area.
                </p>

                <div className="space-y-3">
                    <button 
                        onClick={() => handleAction(0)}
                        disabled={step !== 0}
                        className={`w-full py-4 px-4 rounded-xl flex items-center gap-3 font-bold transition-all border-2 ${
                            step > 0 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                                : step === 0 
                                    ? 'bg-rose-50 border-rose-400 text-rose-700 hover:bg-rose-100 shadow-md transform hover:-translate-y-0.5' 
                                    : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                    >
                        {step > 0 ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <Droplet className={`w-6 h-6 ${step === 0 ? 'text-rose-500' : 'text-slate-400'}`} />}
                        1. Netralisasi / Taburi Serbuk Penyerap
                    </button>
                    
                    <button 
                        onClick={() => handleAction(1)}
                        disabled={step !== 1}
                        className={`w-full py-4 px-4 rounded-xl flex items-center gap-3 font-bold transition-all border-2 ${
                            step > 1 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                                : step === 1 
                                    ? 'bg-amber-50 border-amber-400 text-amber-700 hover:bg-amber-100 shadow-md transform hover:-translate-y-0.5' 
                                    : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                    >
                        {step > 1 ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <Brush className={`w-6 h-6 ${step === 1 ? 'text-amber-500' : 'text-slate-400'}`} />}
                        2. Sapu dan Kumpulkan Residu
                    </button>

                    <button 
                        onClick={() => handleAction(2)}
                        disabled={step !== 2}
                        className={`w-full py-4 px-4 rounded-xl flex items-center gap-3 font-bold transition-all border-2 ${
                            step > 2 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                                : step === 2 
                                    ? 'bg-indigo-50 border-indigo-400 text-indigo-700 hover:bg-indigo-100 shadow-md transform hover:-translate-y-0.5' 
                                    : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                    >
                        {step > 2 ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <Trash2 className={`w-6 h-6 ${step === 2 ? 'text-indigo-500' : 'text-slate-400'}`} />}
                        3. Buang ke Limbah B3
                    </button>
                </div>

                {step === 3 && (
                    <div className="mt-6 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex flex-col items-center justify-center gap-3 animate-in fade-in zoom-in">
                        <div className="flex items-center gap-2 font-bold text-lg">
                            <CheckCircle2 className="w-6 h-6 text-emerald-600" /> Area Aman!
                        </div>
                        <p className="text-sm font-medium text-emerald-700 mb-2">
                            Pembersihan selesai. Anda dapat mengulangi percobaan dengan kembali memilih bahan untuk praktikum dan simulasi akan berjalan normal tanpa risiko tumpahan.
                        </p>
                        <button 
                            onClick={onCleaned}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-md w-full transition-all"
                        >
                            Tutup & Mulai Ulang Praktikum
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
