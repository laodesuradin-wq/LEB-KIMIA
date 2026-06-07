import React, { useState, useEffect, useRef } from 'react';
import { FlaskConical, Zap, Play, RotateCcw, Activity, ChevronDown, ShieldAlert, ShieldCheck, Beaker, Shirt, Glasses, Hand, Wind, Footprints, Flame, Skull, Droplets, Bomb, AlertTriangle, Leaf, CheckCircle2, Calculator } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { SpillOverlay } from './SpillOverlay';

const METALS = [
  { id: 'Zn', name: 'Seng (Zn)', E0: -0.76, color: 'bg-slate-300', Ar: 65.4, n: 2 },
  { id: 'Fe', name: 'Besi (Fe)', E0: -0.44, color: 'bg-stone-500', Ar: 55.8, n: 2 },
  { id: 'Pb', name: 'Timbal (Pb)', E0: -0.13, color: 'bg-gray-400', Ar: 207.2, n: 2 },
  { id: 'Cu', name: 'Tembaga (Cu)', E0: 0.34, color: 'bg-orange-400', Ar: 63.5, n: 2 },
  { id: 'Ag', name: 'Perak (Ag)', E0: 0.80, color: 'bg-slate-200', Ar: 107.9, n: 1 },
];

const SOLUTIONS = [
  { id: 'ZnSO4', name: 'Seng Sulfat (Zn²⁺)', ion: 'Zn²⁺', E0: -0.76, color: '#f8fafc', cName: 'Seng', n: 2, Ar: 65.4 },
  { id: 'FeSO4', name: 'Besi(II) Sulfat (Fe²⁺)', ion: 'Fe²⁺', E0: -0.44, color: '#bbf7d0', cName: 'Besi', n: 2, Ar: 55.8 },
  { id: 'PbNO32', name: 'Timbal(II) Nitrat (Pb²⁺)', ion: 'Pb²⁺', E0: -0.13, color: '#f1f5f9', cName: 'Timbal', n: 2, Ar: 207.2 },
  { id: 'CuSO4', name: 'Tembaga(II) Sulfat (Cu²⁺)', ion: 'Cu²⁺', E0: 0.34, color: '#93c5fd', cName: 'Tembaga', n: 2, Ar: 63.5 },
  { id: 'AgNO3', name: 'Perak Nitrat (Ag⁺)', ion: 'Ag⁺', E0: 0.80, color: '#ffffff', cName: 'Perak', n: 1, Ar: 107.9 },
];

const REDOX_ALAT = [
    { nama: 'Gelas Kimia 250 mL', desc: 'Wadah reaktor utama untuk menampung larutan uji.' },
    { nama: 'Gelas Ukur 50 mL', desc: 'Untuk mengukur volume larutan pengoksidasi.' },
    { nama: 'Amplas / Kertas Pasir', desc: 'Membersihkan permukaan logam (agen pereduksi) dari oksida sebelum dicelupkan.' },
    { nama: 'Pinset', desc: 'Untuk memegang dan mencelupkan lempeng logam ke dalam larutan tanpa menyentuh langsung.' },
    { nama: 'Kaca Arloji', desc: 'Tempat meletakkan logam setelah dikeluarkan dari larutan untuk diamati.' },
    { nama: 'Tabung Reaksi & Rak', desc: 'Wadah untuk mereaksikan zat-zat skala kecil dan rak untuk meletakkannya secara vertikal.' },
    { nama: 'Pipet Tetes', desc: 'Untuk mengambil dan menambahkan zat cair / indikator secara perlahan.' },
    { nama: 'Stopwatch', desc: 'Untuk mengukur durasi / laju reaksi atau waktu terjadinya perubahan warna.' },
    { nama: 'Termometer', desc: 'Untuk memantau perubahan suhu, karena beberapa reaksi redoks bersifat eksotermik (menghasilkan panas).' },
    { nama: 'Neraca Analitik', desc: 'Untuk menimbang massa logam atau reaktan padat secara presisi.' },
    { nama: 'Buret & Statif', desc: 'Digunakan apabila melakukan titrasi redoks (mis. permanganometri atau iodometri) untuk mengukur volume presisi.' },
    { nama: 'Multimeter / Voltmeter', desc: 'Untuk mengukur beda potensial (E° sel) apabila reaksi redoks dirangkai dalam bentuk sel Volta.' }
];

const getRedoxBahan = (mass: number, volume: number, molarity: number) => [

    { 
        nama: 'Lempeng/Pita Logam (Zn, Fe, Pb, Cu, Ag)', 
        kuantitas: `${mass} gram / lempeng`,
        desc: 'Padatan logam murni yang bertindak sebagai agen pereduksi potensial.',
        isHazardous: false,
        bahayaDesc: 'Aman disentuh, namun perak (Ag) mahal dan berat. Cuci bersih setelah digunakan.',
        symbols: ['safe']
    },
    { 
        nama: `Larutan Garam ${molarity} M`, 
        kuantitas: `${volume} mL / percobaan`,
        desc: 'Sediaan larutan ion transisi (ZnSO₄, FeSO₄, Pb(NO₃)₂, CuSO₄, AgNO₃) sebagai agen pengoksidasi.',
        isHazardous: true,
        bahayaDesc: 'Beracun bagi lingkungan perairan. Ion timbal (Pb²⁺) beracun bila tertelan. Hindari kontak langsung dengan kulit.',
        symbols: ['toxic', 'environment']
    },
    { 
        nama: 'Aquades (H₂O)', 
        kuantitas: '100 - 250 mL',
        desc: 'Air murni pencuci.',
        isHazardous: false,
        bahayaDesc: 'Aman. Digunakan untuk membilas logam sebelum dan sesudah reaksi.',
        symbols: ['safe']
    }
];

const REDOX_KESELAMATAN = [
    "Gunakan APD Lengkap: Jas Laboratorium, Kacamata Pelindung (Goggles), Sarung Tangan Kimia, Masker Respirator, dan Sepatu Tertutup selama praktikum berpangsung.",
    "Hindari kontak langsung antara kulit dengan zat kimia, terutama larutan garam logam berat (AgNO₃, Pb(NO₃)₂, CuSO₄) yang dapat bersifat racun atau iritan.",
    "Lakukan percobaan yang melibatkan gas beracun atau korosif (jika ada) di dalam lemari asam.",
    "Cuci tangan dengan sabun dan air mengalir setelah selesai melakukan praktikum.",
    "Buang limbah logam berat dan sisa larutan pada wadah pembuangan khusus limbah B3, jangan dibuang langsung ke saluran pembuangan/wastafel.",
    "Apabila terkena percikan zat kimia, segera bilas dengan air mengalir yang banyak dan laporkan kepada asisten/laboran."
];

const ExpandableAlat = ({ alatItem }: { alatItem: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <li className="flex items-start gap-2.5 cursor-pointer group" onClick={() => setIsOpen(!isOpen)}>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5 transition-transform group-hover:scale-125"></span> 
            <div className="flex-1 select-none">
                <div className="flex items-center justify-between">
                    <strong className="text-slate-800 group-hover:text-indigo-600 transition-colors">{alatItem.nama}</strong>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
                {isOpen && (
                    <div className="mt-1 text-slate-500 text-[11px] animate-in fade-in slide-in-from-top-1">
                        {alatItem.desc}
                    </div>
                )}
            </div>
        </li>
    );
};

const getSafetyIcon = (type: string) => {
    switch(type) {
        case 'flammable':
            return <div className="w-5 h-5 bg-white border border-red-600 rotate-45 flex items-center justify-center rounded-[2px] shadow-sm shrink-0" title="Mudah Terbakar"><Flame className="w-3 h-3 text-black -rotate-45" strokeWidth={2} /></div>;
        case 'corrosive':
            return <div className="w-5 h-5 bg-white border border-red-600 rotate-45 flex items-center justify-center rounded-[2px] shadow-sm shrink-0" title="Korosif"><Droplets className="w-3 h-3 text-black -rotate-45" strokeWidth={2} /></div>;
        case 'toxic':
            return <div className="w-5 h-5 bg-white border border-red-600 rotate-45 flex items-center justify-center rounded-[2px] shadow-sm shrink-0" title="Beracun"><Skull className="w-3 h-3 text-black -rotate-45" strokeWidth={2} /></div>;
        case 'explosive':
            return <div className="w-5 h-5 bg-white border border-red-600 rotate-45 flex items-center justify-center rounded-[2px] shadow-sm shrink-0" title="Mudah Meledak"><Bomb className="w-3 h-3 text-black -rotate-45" strokeWidth={2} /></div>;
        case 'irritant':
            return <div className="w-5 h-5 bg-white border border-red-600 rotate-45 flex items-center justify-center rounded-[2px] shadow-sm shrink-0" title="Iritasi/Berbahaya"><AlertTriangle className="w-3 h-3 text-black -rotate-45" strokeWidth={2} /></div>;
        case 'environment':
            return <div className="w-5 h-5 bg-white border border-red-600 rotate-45 flex items-center justify-center rounded-[2px] shadow-sm shrink-0" title="Bahaya Lingkungan"><Leaf className="w-3 h-3 text-black -rotate-45" strokeWidth={2} /></div>;
        case 'safe':
            return <div className="w-5 h-5 bg-white border border-emerald-500 rounded-full flex items-center justify-center shadow-sm shrink-0" title="Aman"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2} /></div>;
        default:
            return null;
    }
};

const getSafetyLabel = (type: string) => {
    switch(type) {
        case 'flammable': return 'Mudah Terbakar';
        case 'corrosive': return 'Korosif';
        case 'toxic': return 'Beracun';
        case 'explosive': return 'Mudah Meledak';
        case 'irritant': return 'Iritasi / Berbahaya';
        case 'environment': return 'Bahaya Lingkungan';
        case 'safe': return 'Aman';
        default: return '';
    }
};

const ExpandableBahan = ({ bahanItem }: { bahanItem: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <li className="flex items-start gap-2.5 cursor-pointer group" onClick={() => setIsOpen(!isOpen)}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5 transition-transform group-hover:scale-125"></span> 
            <div className="flex-1 select-none">
                <div className="flex items-center justify-between">
                    <strong className="text-slate-800 group-hover:text-emerald-600 transition-colors">{bahanItem.nama}</strong>
                    <div className="flex items-center gap-2">
                        {bahanItem.symbols && (
                            <div className="flex items-center gap-1.5 mr-1">
                                {bahanItem.symbols.map((sym: string, i: number) => <React.Fragment key={i}>{getSafetyIcon(sym)}</React.Fragment>)}
                            </div>
                        )}
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </div>
                {isOpen && (
                    <div className="mt-1 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-1">
                        {bahanItem.kuantitas && (
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded w-fit">
                                {bahanItem.kuantitas}
                            </span>
                        )}
                        <span className="text-slate-500 text-[11px]">{bahanItem.desc}</span>
                        <div className={`p-2 mt-2 rounded border text-[11px] font-medium leading-relaxed ${bahanItem.isHazardous ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
                            <div className="flex items-center gap-2 mb-2 pb-1 border-b border-opacity-50 border-slate-300">
                                {bahanItem.isHazardous ? <ShieldAlert className="w-3.5 h-3.5 text-red-600" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                                <strong className={bahanItem.isHazardous ? "text-red-700" : "text-emerald-700"}>{bahanItem.isHazardous ? 'INFORMASI BAHAYA' : 'AMAN'}</strong>
                            </div>
                            {bahanItem.symbols && (
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {bahanItem.symbols.map((sym: string, i: number) => (
                                        <div key={i} className="flex items-center gap-1.5 bg-white/60 px-2 py-1 rounded border border-white/40">
                                            {getSafetyIcon(sym)}
                                            <span className="text-[9px] font-bold uppercase tracking-wider">{getSafetyLabel(sym)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="flex flex-col gap-2">
                                {bahanItem.bahayaDesc}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </li>
    );
};

export function RedoxSimulation() {
  const [metalId, setMetalId] = useState('Zn');
  const [solutionId, setSolutionId] = useState('CuSO4');
  const [metalMass, setMetalMass] = useState(5);
  const [solutionVolume, setSolutionVolume] = useState(50);
  const [solutionMolarity, setSolutionMolarity] = useState(0.1);
  const [durasi, setDurasi] = useState(10);
  const [isReacting, setIsReacting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [spillEvent, setSpillEvent] = useState(false);
  const spillEventRef = useRef(false);
  const sudahPernahTumpahRef = useRef(false);

  const [apdChecklist, setApdChecklist] = useState({
    jasLab: false,
    kacamata: false,
    sarungTangan: false,
    masker: false,
    sepatu: false,
  });
  const isApdComplete = Object.values(apdChecklist).every(Boolean);

  const selectedMetal = METALS.find(m => m.id === metalId)!;
  const selectedSolution = SOLUTIONS.find(s => s.id === solutionId)!;

  // Reaksi spontan jika E0 reduksi > E0 oksidasi
  // Reduksi: ion dalam larutan -> E0 larutan
  // Oksidasi: logam -> E0 logam
  const willReact = selectedSolution.E0 > selectedMetal.E0;
  const standardCellPotential = selectedSolution.E0 - selectedMetal.E0;
  // Hukum Nernst E = E0 - (0.0592/n)*log(Q)
  // Menentukan jumlah mol elektron yang terlibat (KPK dari valensi)
  const nTransfer = Math.max(selectedMetal.n, selectedSolution.n);
  const realCellPotential = standardCellPotential - (0.0592 / nTransfer) * Math.log10(1 / Math.pow(solutionMolarity, nTransfer / selectedSolution.n));

  // Menghitung stoikiometri Faraday
  const molLogam = metalMass / selectedMetal.Ar;
  const molIon = (solutionVolume / 1000) * solutionMolarity;
  
  // Reaksi: (nTransfer/selectedMetal.n) Logam + (nTransfer/selectedSolution.n) Ion -> ...
  // Laju pembentukan endapan berdasarkan reaktan pembatas:
  const koefLogam = nTransfer / selectedMetal.n;
  const koefIon = nTransfer / selectedSolution.n;
  const maxMolReaksi = Math.min(molLogam / koefLogam, molIon / koefIon);
  const massaEndapan = (maxMolReaksi * koefIon) * selectedSolution.Ar;

  // helper format ion
  const formatIon = (n: number) => n === 1 ? '⁺' : n === 2 ? '²⁺' : n === 3 ? '³⁺' : `${n}⁺`;
  const formatKoef = (k: number) => k > 1 ? k.toString() : '';

  const oxLabel = `${formatKoef(koefLogam)}${selectedMetal.id} \u2192 ${formatKoef(koefLogam)}${selectedMetal.id}${formatIon(selectedMetal.n)} + ${koefLogam * selectedMetal.n}e\u207B`;
  const redTarget = selectedSolution.cName === 'Perak' ? 'Ag' : selectedSolution.ion.replace(/[^A-Za-z]/g, '');
  const redLabel = `${formatKoef(koefIon)}${selectedSolution.ion} + ${koefIon * selectedSolution.n}e\u207B \u2192 ${formatKoef(koefIon)}${redTarget}`;
  const totalLabel = `${formatKoef(koefLogam)}${selectedMetal.id} + ${formatKoef(koefIon)}${selectedSolution.ion} \u2192 ${formatKoef(koefLogam)}${selectedMetal.id}${formatIon(selectedMetal.n)} + ${formatKoef(koefIon)}${redTarget}`;

  // Molaritas otomatis disesuaikan berdasarkan stoikiometri reaksi sempurna
  useEffect(() => {
    const koefLogamT = Math.max(selectedMetal.n, selectedSolution.n) / selectedMetal.n;
    const koefIonT = Math.max(selectedMetal.n, selectedSolution.n) / selectedSolution.n;
    const molLogamT = metalMass / selectedMetal.Ar;
    const molIonButuh = molLogamT * (koefIonT / koefLogamT);
    const calculated = molIonButuh * (1000 / solutionVolume);
    setSolutionMolarity(calculated);
  }, [metalMass, solutionVolume, selectedMetal.Ar, selectedMetal.n, selectedSolution.n]);

  useEffect(() => {
    let timer: any;
    if (isReacting && willReact && progress < 100) {
      timer = setInterval(() => {
        if (!spillEventRef.current && !sudahPernahTumpahRef.current && Math.random() < 0.0025) {
            setSpillEvent(true);
            spillEventRef.current = true;
            sudahPernahTumpahRef.current = true;
            setIsReacting(false);
            return;
        }

        setProgress(p => {
          if (p >= 100) {
            clearInterval(timer);
            return 100;
          }
          const progressDelta = durasi > 0 ? (100 / (durasi * 1000 / 50)) : (1 + solutionMolarity * 10);
          return Math.min(100, p + progressDelta);
        });
      }, 50);
    } else if (isReacting && !willReact) {
       setProgress(100);
    }
    return () => clearInterval(timer);
  }, [isReacting, willReact, progress, solutionMolarity, durasi]);

  const handleStart = () => {
    setSpillEvent(false);
    spillEventRef.current = false;
    setIsReacting(true);
    setProgress(0);
  };

  const lanjutkanReaksi = () => {
    setSpillEvent(false);
    spillEventRef.current = false;
    performReset();
  };

  const handleReset = () => {
    if (progress > 0) {
      setShowResetConfirm(true);
    } else {
      performReset();
    }
  };
  
  const performReset = () => {
    setIsReacting(false);
    setProgress(0);
    setSpillEvent(false);
    spillEventRef.current = false;
    setShowResetConfirm(false);
  };

  // Potensial Standar Data untuk Chart
  const chartData = [
    { name: `Reduksi (${selectedSolution.ion})`, potensial: selectedSolution.E0, fill: '#3b82f6' },
    { name: `Oksidasi (${selectedMetal.id})`, potensial: selectedMetal.E0, fill: '#ef4444' }
  ];

  return (
    <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 animate-in fade-in duration-500">
        
        {/* Modal Konfirmasi Reset */}
        {showResetConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
                    <div className="flex items-center gap-3 text-red-500 mb-4">
                        <ShieldAlert className="w-6 h-6" />
                        <h3 className="font-bold text-lg text-slate-800">Konfirmasi Reset</h3>
                    </div>
                    <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                        Apakah Anda yakin ingin menghentikan dan mereset simulasi ini? Data eksperimen yang sedang berjalan mungkin akan hilang.
                    </p>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setShowResetConfirm(false)}
                            className="flex-1 py-2.5 px-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
                        >
                            Batal
                        </button>
                        <button 
                            onClick={performReset}
                            className="flex-1 py-2.5 px-4 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 transition-colors"
                        >
                            Ya, Reset
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Panel Kiri: Kontrol */}
        <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white/70 backdrop-blur-xl border border-slate-200/60 p-6 rounded-3xl shadow-xl shadow-slate-200/40">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-5 flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-indigo-500" /> Pengaturan Sistem
                </h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Logam (Agen Pereduksi)</label>
                        <select 
                            value={metalId} 
                            onChange={(e) => { setMetalId(e.target.value); handleReset(); }}
                            className="w-full p-2.5 border border-slate-300 rounded-xl text-slate-700 bg-white font-medium text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            disabled={isReacting || progress > 0}
                        >
                            {METALS.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="pt-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Larutan (Agen Pengoksidasi)</label>
                        <select 
                            value={solutionId} 
                            onChange={(e) => { setSolutionId(e.target.value); handleReset(); }}
                            className="w-full p-2.5 border border-slate-300 rounded-xl text-slate-700 bg-white font-medium text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            disabled={isReacting || progress > 0}
                        >
                            {SOLUTIONS.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="pt-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Massa Logam (g)</label>
                            <input 
                                type="number" 
                                min="1" max="50" step="1"
                                value={metalMass}
                                onChange={(e) => { setMetalMass(Number(e.target.value)); handleReset(); }}
                                className="w-full p-2 border border-slate-300 rounded-lg text-slate-700 bg-white font-medium text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                disabled={isReacting || progress > 0}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Volume Larutan (mL)</label>
                            <input 
                                type="number" 
                                min="10" max="250" step="10"
                                value={solutionVolume}
                                onChange={(e) => { setSolutionVolume(Number(e.target.value)); handleReset(); }}
                                className="w-full p-2 border border-slate-300 rounded-lg text-slate-700 bg-white font-medium text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                disabled={isReacting || progress > 0}
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Konsentrasi Larutan (Auto)</label>
                        <div className="flex items-center gap-3">
                            <input 
                                type="range" 
                                min="0.1" max="10" step="0.1"
                                value={solutionMolarity}
                                readOnly
                                className="flex-1 opacity-60 cursor-not-allowed"
                                disabled={true}
                            />
                            <span className="text-sm font-bold text-indigo-600 w-16">{solutionMolarity.toFixed(2)} M</span>
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Durasi Simulasi (Custom)</label>
                        <div className="flex items-center gap-3">
                            <input 
                                type="range" 
                                min="1" max="60" step="1"
                                value={durasi}
                                onChange={(e) => { setDurasi(Number(e.target.value)); handleReset(); }}
                                className="flex-1"
                                disabled={isReacting || progress > 0}
                            />
                            <span className="text-sm font-bold text-indigo-600 w-12">{durasi} s</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-3">
                    <div className="space-y-3 mb-2">
                        <div className="flex items-center justify-between mb-2">
                            <label className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-500">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Checklist APD
                            </label>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${isApdComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                {isApdComplete ? 'LENGKAP' : 'BELUM LENGKAP'}
                            </span>
                        </div>
                        <div className="grid grid-cols-5 gap-1.5">
                            {[
                                { id: 'jasLab', label: 'Jas Lab', icon: <Shirt className="w-4 h-4" /> },
                                { id: 'kacamata', label: 'Kacamata', icon: <Glasses className="w-4 h-4" /> },
                                { id: 'sarungTangan', label: 'S. Tangan', icon: <Hand className="w-4 h-4" /> },
                                { id: 'masker', label: 'Masker', icon: <Wind className="w-4 h-4" /> },
                                { id: 'sepatu', label: 'Sepatu', icon: <Footprints className="w-4 h-4" /> },
                            ].map(apd => (
                                <button 
                                    key={apd.id}
                                    onClick={() => setApdChecklist(prev => ({ ...prev, [apd.id]: !prev[apd.id as keyof typeof prev] }))}
                                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all ${apdChecklist[apd.id as keyof typeof apdChecklist] ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`}
                                    title={apd.label}
                                >
                                    {apd.icon}
                                    <span className="text-[8px] font-bold uppercase mt-1 leading-tight text-center">{apd.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {!isReacting || progress === 100 ? (
                            <button 
                                disabled={progress !== 100 && !isApdComplete}
                                onClick={progress === 100 ? () => setShowResetConfirm(true) : handleStart}
                                className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${progress === 100 ? 'bg-slate-700 text-white hover:bg-slate-800 shadow-md' : (isApdComplete ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30' : 'bg-slate-200 text-slate-400 cursor-not-allowed')}`}
                            >
                                {progress === 100 ? <><RotateCcw className="w-5 h-5"/> Reset</> : <><Play className="w-5 h-5"/> Reaksikan</>}
                            </button>
                        ) : (
                            <button 
                                disabled
                                className="flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-slate-200 text-slate-500 cursor-not-allowed"
                            >
                                <span className="w-4 h-4 border-2 border-slate-400 border-r-transparent rounded-full animate-spin"></span>
                                Proses... {Math.round(progress)}%
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl border border-slate-200/60 p-6 rounded-3xl shadow-xl shadow-slate-200/40 flex-1">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500" /> E° Relatif
                </h3>
                <div className="h-40 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" domain={[-1, 1]} hide />
                            <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 10, fill: '#64748b'}} />
                            <Tooltip cursor={{fill: '#f1f5f9'}} formatter={(val) => [`${val} V`, 'Potensial']} />
                            <ReferenceLine x={0} stroke="#94a3b8" />
                            <Bar dataKey="potensial" fill="#8884d8" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Panel Kanan: Visualisasi & Hasil */}
        <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-slate-900 rounded-3xl shadow-xl border border-slate-800 p-8 flex flex-col items-center justify-center relative min-h-[400px] overflow-hidden">
                <button 
                    onClick={() => setShowFormulaModal(true)}
                    className="absolute top-4 right-4 z-40 bg-slate-800/80 backdrop-blur-md border border-slate-700 hover:bg-slate-700/80 text-slate-300 font-bold font-mono text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
                >
                    <Calculator className="w-4 h-4 text-emerald-400" />
                    Rumus
                </button>

                {spillEvent && <SpillOverlay onCleaned={lanjutkanReaksi} />}
                <div className="flex flex-col items-center relative z-20 mt-4">
                    {/* Sirkuit Eksternal: Voltmeter, Baterai & Kabel */}
                    <div className="relative w-56 h-20 flex flex-col items-center justify-center z-30 mb-2">
                        {/* Kabel Atas Penghubung Baterai & Voltmeter */}
                        <div className="absolute top-4 w-32 h-[2px] bg-slate-400"></div>

                        <div className="flex gap-6 items-center z-10">
                            {/* Baterai */}
                            <div className="w-14 h-7 bg-slate-800 border-2 border-slate-500 rounded-md shadow-md flex items-center justify-between px-1 relative">
                                <span className="text-rose-500 font-bold text-[10px] leading-none">+</span>
                                <span className="text-slate-400 font-mono text-[7px] tracking-tighter">BATERAI</span>
                                <span className="text-blue-500 font-bold text-[10px] leading-none">-</span>
                                <div className="absolute -left-1 top-2 w-1 h-2 bg-slate-500 rounded-l-sm"></div>
                                <div className="absolute -right-1 top-2 w-1 h-2 bg-slate-500 rounded-r-sm"></div>
                            </div>

                            {/* Voltmeter */}
                            <div className="w-24 h-12 bg-slate-800 border-2 border-slate-600 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center relative overflow-hidden">
                                <div className="absolute top-0 w-full h-3.5 bg-slate-700 flex justify-between px-2 items-center border-b border-slate-600">
                                    <span className="text-rose-400 font-bold text-[9px] leading-none">+</span>
                                    <span className="text-slate-300 font-mono text-[7px] tracking-widest font-bold">VOLTMETER</span>
                                    <span className="text-blue-400 font-bold text-[9px] leading-none">-</span>
                                </div>
                                <div className="mt-3 bg-[#0a0a0a] px-2 py-0.5 rounded border border-slate-700/50 min-w-[70px] text-center shadow-inner">
                                    <span className={`font-mono text-[14px] font-bold tracking-wider drop-shadow-md ${realCellPotential > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {realCellPotential > 0 ? '+' : ''}{realCellPotential.toFixed(2)} V
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Kabel ke bawah (Elektroda) */}
                        {/* Kabel Kiri (Merah) */}
                        <div className="absolute left-6 top-8 w-[2px] h-12 bg-rose-500 shadow-[0_0_3px_rgba(244,63,94,0.8)]"></div>
                        <div className="absolute left-6 top-8 w-10 h-[2px] bg-rose-500 shadow-[0_0_3px_rgba(244,63,94,0.8)]"></div>
                        
                        {/* Kabel Kanan (Biru) */}
                        <div className="absolute right-6 top-8 w-[2px] h-12 bg-blue-500 shadow-[0_0_3px_rgba(59,130,246,0.8)]"></div>
                        <div className="absolute right-16 top-8 w-10 h-[2px] bg-blue-500 shadow-[0_0_3px_rgba(59,130,246,0.8)]"></div>
                    </div>

                    {/* Visual Beaker */}
                    <div className="relative w-48 h-64 border-l-4 border-r-4 border-b-4 border-white/20 rounded-b-3xl bg-white/5 shadow-inner overflow-hidden">
                        {/* Cairan */}
                        <div 
                            className="absolute bottom-0 w-full transition-all duration-[3000ms] ease-in-out"
                            style={{
                                height: '75%',
                                backgroundColor: (willReact && isReacting) ? 
                                    `color-mix(in srgb, ${selectedSolution.color} ${Math.max(20, 100 - progress)}%, transparent ${progress}%)` 
                                    : selectedSolution.color,
                                opacity: 0.9
                            }}
                        >
                            <div className="w-full h-2 bg-white/30 absolute top-0"></div>
                            
                            {/* Partikel Ion */}
                            {isReacting && progress < 100 && willReact && (
                                <div className="absolute inset-0 overflow-hidden opacity-50">
                                    {Array.from({length: 10}).map((_, i) => (
                                        <div 
                                            key={i} 
                                            className="absolute text-[8px] font-mono font-bold text-white/70 animate-bounce"
                                            style={{
                                                left: `${Math.random() * 80 + 10}%`,
                                                top: `${Math.random() * 80 + 10}%`,
                                                animationDuration: `${Math.random() * 1 + 0.5}s`,
                                                animationDelay: `${Math.random() * 1}s`
                                            }}
                                        >
                                            +
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Strip Logam (Anoda/Kiri) */}
                        <div className="absolute top-0 left-6 w-8 h-56 rounded-sm shadow-xl z-10 border border-black/20 flex justify-center" style={{ backgroundColor: 'transparent' }}>
                            {/* Batang Anoda yang melarut */}
                            <div 
                                className={`w-full ${selectedMetal.color} transition-all duration-300 rounded-sm shadow-xl`}
                                style={{
                                    height: '100%',
                                    clipPath: (willReact && isReacting) ? `polygon(0 0, 100% 0, ${100 - progress*0.3}% 100%, ${progress*0.3}% 100%)` : 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                                }}
                            ></div>
                        </div>

                        {/* Strip Katoda (Kanan - Inert/Logam Pasangan) */}
                        <div className="absolute top-0 right-6 w-8 h-56 rounded-sm shadow-xl z-10 overflow-hidden border border-black/20 bg-slate-700">
                            <div className="w-full h-full opacity-30" style={{
                                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, black 3px, black 4px)'
                            }}></div>
                            
                            {/* Endapan Logam pada Katoda (Jika ini setup sel volta/elektrolisis) */}
                            {willReact && isReacting && (
                                <div 
                                    className="absolute bottom-0 w-full transition-all duration-300"
                                    style={{ 
                                        height: `${progress * 0.7}%`,
                                        opacity: progress / 100,
                                    }}
                                >
                                    <div className="w-full h-full bg-orange-600 opacity-90 shadow-[inset_0px_-5px_10px_rgba(0,0,0,0.5)]" style={{
                                        backgroundImage: 'radial-gradient(#ea580c 2px, transparent 2px), radial-gradient(#9a3412 1.5px, transparent 1.5px)',
                                        backgroundSize: '8px 8px, 6px 6px',
                                        backgroundPosition: '0 0, 3px 3px'
                                    }}></div>
                                </div>
                            )}
                        </div>

                            {/* Transfer Elektron */}
                        {isReacting && progress < 100 && willReact && (
                            <div className="absolute inset-0 z-30 pointer-events-none">
                                {Array.from({length: 12}).map((_, i) => {
                                    const tx = 60 + Math.random() * 20; // Flowing from left to right roughly
                                    const ty = Math.random() * 40 - 20;
                                    return (
                                        <div 
                                            key={i} 
                                            className="absolute w-2 h-2 rounded-full bg-yellow-300 flex items-center justify-center animate-electron shadow-[0_0_8px_rgba(253,224,71,0.8)]"
                                            style={{
                                                left: '20%',
                                                top: `${Math.random() * 30 + 30}%`,
                                                '--tx': `${tx}px`,
                                                '--ty': `${ty}px`,
                                                animationDuration: `${Math.random() * 0.5 + 1}s`,
                                                animationDelay: `${Math.random() * 1.5}s`
                                            } as React.CSSProperties}
                                        >
                                            <span className="text-[6px] font-bold text-yellow-900 leading-none">-</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {/* Penanda Endapan pada Katoda (dalam beaker) */}
                        {willReact && isReacting && progress > 10 && (
                            <div className="absolute right-14 top-[70%] translate-y-[-50%] flex items-center gap-1 z-40 transition-opacity duration-500 opacity-100">
                                <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-600 text-white text-[9px] px-2 py-1 rounded shadow-lg whitespace-nowrap border-l-2 border-l-orange-500">
                                    <span className="text-orange-400 font-bold">Endapan</span><br/>
                                    {selectedSolution.cName} ({selectedSolution.ion.replace(/[^A-Za-z]/g, '')})
                                </div>
                                <div className="w-5 h-0.5 bg-orange-500"></div>
                            </div>
                        )}
                    </div>
                    
                </div>

                <div className="mt-8 text-center z-20">
                    <h2 className="text-xl font-bold text-white mb-2">
                        {selectedMetal.name} dalam {selectedSolution.name}
                    </h2>
                    {isReacting && progress === 100 && (
                        willReact ? (
                            <p className="text-emerald-400 font-medium px-4 py-1.5 bg-emerald-500/10 rounded-full inline-block border border-emerald-500/20">
                                Terjadi endapan {selectedSolution.cName} pada elektroda {selectedMetal.id}.
                            </p>
                        ) : (
                            <p className="text-rose-400 font-medium px-4 py-1.5 bg-rose-500/10 rounded-full inline-block border border-rose-500/20">
                                Tidak ada reaksi. {selectedMetal.id} kurang reaktif (E° reduksi lebih besar).
                            </p>
                        )
                    )}
                </div>

                {/* Decorative background blur */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            </div>

            {/* Panel Hasil & Persamaan Reaksi */}
            <div className="bg-white/70 backdrop-blur-xl border border-slate-200/60 p-6 rounded-3xl shadow-xl shadow-slate-200/40 relative min-h-[140px]">
                 <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" /> Detail Reaksi
                </h3>
                
                {!isReacting ? (
                     <p className="text-sm text-slate-500 italic mt-4 text-center">Tekan tombol "Reaksikan" untuk mensimulasikan percobaan redoks.</p>
                ) : progress < 100 ? (
                     <div className="flex flex-col items-center justify-center p-6 space-y-4">
                         <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
                         <p className="text-sm font-medium text-indigo-600 animate-pulse text-center">Reaksi sedang berlangsung. Menunggu pembentukan endapan selesai...</p>
                     </div>
                ) : (
                    willReact ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2">
                            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex flex-col justify-center">
                                <span className="text-xs font-bold text-emerald-600 uppercase mb-1">Status: Spontan</span>
                                <span className="text-2xl font-bold text-emerald-700">E° <sub className="text-sm">sel</sub> = +{standardCellPotential.toFixed(2)} V</span>
                                <p className="text-xs text-emerald-600 mt-2">Logam <b>{selectedMetal.id}</b> lebih mudah teroksidasi dibandingkan <b>{selectedSolution.cName}</b>. Reaksi berlangsung spontan.</p>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl font-mono text-sm flex flex-col justify-center gap-2">
                                <div className="flex justify-between items-center text-slate-600">
                                    <span>Oksidasi:</span>
                                    <span className="font-bold text-rose-600">{oxLabel}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-600 border-b border-slate-200 pb-2">
                                    <span>Reduksi:</span>
                                    <span className="font-bold text-blue-600">{redLabel}</span>
                                </div>
                                <div className="flex justify-between items-center font-bold text-indigo-700 pt-1">
                                    <span>Total:</span>
                                    <span>{totalLabel}</span>
                                </div>
                            </div>
                            
                            <div className="md:col-span-2 bg-indigo-50 border border-indigo-200 p-4 rounded-2xl flex flex-col justify-center">
                                <span className="text-xs font-bold text-indigo-600 uppercase mb-2">Hukum Faraday & Analisis Massa</span>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-mono items-center">
                                    <div>
                                        <div className="text-slate-500 text-[10px] uppercase">Mol {selectedMetal.id} awal</div>
                                        <div className="font-bold text-slate-700">{molLogam.toFixed(4)} mol</div>
                                    </div>
                                    <div>
                                        <div className="text-slate-500 text-[10px] uppercase">Mol {selectedSolution.ion} awal</div>
                                        <div className="font-bold text-slate-700">{molIon.toFixed(4)} mol</div>
                                    </div>
                                    <div>
                                        <div className="text-slate-500 text-[10px] uppercase">Elektron ({nTransfer}e⁻)</div>
                                        <div className="font-bold text-slate-700">{(maxMolReaksi * nTransfer).toFixed(4)} mol</div>
                                    </div>
                                    <div className="bg-white px-3 py-1.5 rounded-lg border border-indigo-100/50 shadow-sm">
                                        <div className="text-indigo-500 text-[10px] uppercase font-bold">Massa Endapan</div>
                                        <div className="font-bold text-indigo-700">{massaEndapan.toFixed(3)} gr</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                         <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl animate-in fade-in slide-in-from-bottom-2 flex items-center justify-between">
                            <div>
                                <span className="text-xs font-bold text-rose-600 uppercase mb-1 block">Status: Non-Spontan</span>
                                <span className="text-xl font-bold text-rose-700">E° <sub className="text-sm">sel</sub> = {standardCellPotential.toFixed(2)} V</span>
                                <p className="text-sm text-rose-600 mt-1">E° sel bernilai negatif. Logam {selectedMetal.id} tidak dapat mendesak ion {selectedSolution.ion} dari larutannya.</p>
                            </div>
                        </div>
                    )
                )}
            </div>
            
            {/* Panel Alat & Bahan */}
            <div className="bg-white/70 backdrop-blur-xl border border-slate-200/60 p-6 rounded-3xl shadow-xl shadow-slate-200/40 relative">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Beaker className="w-4 h-4 text-indigo-500" /> Alat & Bahan Praktikum
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4">Alat Tersedia</h4>
                        <ul className="text-[12px] text-slate-600 space-y-2.5 font-medium">
                            {REDOX_ALAT.map((item, idx) => <ExpandableAlat key={idx} alatItem={item} />)}
                        </ul>
                    </div>
                    
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4">Bahan Kimia</h4>
                        <ul className="text-[12px] text-slate-600 space-y-2.5 font-medium">
                            {getRedoxBahan(metalMass, solutionVolume, solutionMolarity).map((item, idx) => <ExpandableBahan key={idx} bahanItem={item} />)}
                        </ul>
                    </div>
                </div>

                <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-5 relative z-10 overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                        <ShieldAlert className="w-32 h-32 text-red-500" />
                    </div>
                    <h4 className="text-xs font-bold text-red-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-red-600" /> Panduan Keselamatan Kerja (K3)
                    </h4>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6 relative z-10">
                        <div className="bg-white border border-red-100 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md group">
                            <div className="w-10 h-10 bg-red-50 group-hover:bg-red-100 transition-colors rounded-full flex items-center justify-center">
                                <Shirt className="w-5 h-5 text-red-600" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-700 leading-tight">Jas<br/>Laboratorium</span>
                        </div>
                        <div className="bg-white border border-red-100 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md group">
                            <div className="w-10 h-10 bg-red-50 group-hover:bg-red-100 transition-colors rounded-full flex items-center justify-center">
                                <Glasses className="w-5 h-5 text-red-600" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-700 leading-tight">Kacamata<br/>Pelindung</span>
                        </div>
                        <div className="bg-white border border-red-100 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md group">
                            <div className="w-10 h-10 bg-red-50 group-hover:bg-red-100 transition-colors rounded-full flex items-center justify-center">
                                <Hand className="w-5 h-5 text-red-600" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-700 leading-tight">Sarung<br/>Tangan</span>
                        </div>
                        <div className="bg-white border border-red-100 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md group">
                            <div className="w-10 h-10 bg-red-50 group-hover:bg-red-100 transition-colors rounded-full flex items-center justify-center">
                                <Wind className="w-5 h-5 text-red-600" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-700 leading-tight">Masker<br/>Respirator</span>
                        </div>
                        <div className="bg-white border border-red-100 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md group">
                            <div className="w-10 h-10 bg-red-50 group-hover:bg-red-100 transition-colors rounded-full flex items-center justify-center">
                                <Footprints className="w-5 h-5 text-red-600" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-700 leading-tight">Sepatu<br/>Tertutup</span>
                        </div>
                    </div>

                    <ul className="text-[12px] text-red-700 space-y-2.5 font-medium relative z-10">
                        {REDOX_KESELAMATAN.map((rule, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5"></span>
                                <span className="leading-relaxed">{rule}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-6 border-t border-red-200/60 pt-6 relative z-10">
                        <h4 className="text-[11px] font-bold text-red-800 uppercase tracking-widest mb-5">Simbol Bahaya Global (GHS)</h4>
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                            <div className="flex flex-col items-center gap-3 text-center group">
                                <div className="w-10 h-10 bg-white border-[2.5px] border-red-600 rotate-45 flex items-center justify-center rounded-sm shadow-sm group-hover:-translate-y-1 transition-transform relative">
                                    <Flame className="w-5 h-5 text-black -rotate-45" strokeWidth={1.5} />
                                </div>
                                <span className="text-[9px] font-bold text-slate-700 uppercase mt-2 leading-tight">Mudah<br/>Terbakar</span>
                            </div>
                            <div className="flex flex-col items-center gap-3 text-center group">
                                <div className="w-10 h-10 bg-white border-[2.5px] border-red-600 rotate-45 flex items-center justify-center rounded-sm shadow-sm group-hover:-translate-y-1 transition-transform relative">
                                    <Droplets className="w-5 h-5 text-black -rotate-45" strokeWidth={1.5} />
                                </div>
                                <span className="text-[9px] font-bold text-slate-700 uppercase mt-2 leading-tight">Korosif<br/>(Corrosive)</span>
                            </div>
                            <div className="flex flex-col items-center gap-3 text-center group">
                                <div className="w-10 h-10 bg-white border-[2.5px] border-red-600 rotate-45 flex items-center justify-center rounded-sm shadow-sm group-hover:-translate-y-1 transition-transform relative">
                                    <Skull className="w-5 h-5 text-black -rotate-45" strokeWidth={1.5} />
                                </div>
                                <span className="text-[9px] font-bold text-slate-700 uppercase mt-2 leading-tight">Beracun<br/>(Toxic)</span>
                            </div>
                            <div className="flex flex-col items-center gap-3 text-center group">
                                <div className="w-10 h-10 bg-white border-[2.5px] border-red-600 rotate-45 flex items-center justify-center rounded-sm shadow-sm group-hover:-translate-y-1 transition-transform relative">
                                    <Bomb className="w-5 h-5 text-black -rotate-45" strokeWidth={1.5} />
                                </div>
                                <span className="text-[9px] font-bold text-slate-700 uppercase mt-2 leading-tight">Mudah<br/>Meledak</span>
                            </div>
                            <div className="flex flex-col items-center gap-3 text-center group">
                                <div className="w-10 h-10 bg-white border-[2.5px] border-red-600 rotate-45 flex items-center justify-center rounded-sm shadow-sm group-hover:-translate-y-1 transition-transform relative">
                                    <AlertTriangle className="w-5 h-5 text-black -rotate-45" strokeWidth={1.5} />
                                </div>
                                <span className="text-[9px] font-bold text-slate-700 uppercase mt-2 leading-tight">Iritasi /<br/>Berbahaya</span>
                            </div>
                            <div className="flex flex-col items-center gap-3 text-center group">
                                <div className="w-10 h-10 bg-white border-[2.5px] border-red-600 rotate-45 flex items-center justify-center rounded-sm shadow-sm group-hover:-translate-y-1 transition-transform relative">
                                    <Leaf className="w-5 h-5 text-black -rotate-45" strokeWidth={1.5} />
                                </div>
                                <span className="text-[9px] font-bold text-slate-700 uppercase mt-2 leading-tight">Bahaya<br/>Lingkungan</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {showFormulaModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                <div className="bg-slate-900 px-6 py-6 border-b border-slate-800 flex justify-between items-center relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-10">
                        <Calculator className="w-24 h-24 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-wider relative z-10 flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-emerald-400" />
                            Rumus Sel Volta
                        </h2>
                        <p className="text-xs text-slate-400 font-medium relative z-10 mt-1">Integrasi Matematika Reaksi Redoks</p>
                    </div>
                    <button 
                        onClick={() => setShowFormulaModal(false)}
                        className="text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 p-2 rounded-full transition-colors relative z-10"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                </div>
                
                <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh] bg-slate-50">
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 relative overflow-hidden group">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-2xl transition-all group-hover:w-2"></div>
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-emerald-500" /> Potensial Sel Standar (E°)
                        </h3>
                        <div className="bg-slate-800 rounded-xl p-4 flex items-center justify-center mb-3">
                            <code className="text-xl font-mono text-emerald-400 font-bold tracking-wider">E°<sub className="text-sm">sel</sub> = E°<sub className="text-sm">reduksi</sub> - E°<sub className="text-sm">oksidasi</sub></code>
                        </div>
                        <ul className="text-xs font-medium text-slate-600 space-y-2 font-mono">
                            <li className="flex justify-between"><span className="text-slate-400">E°<sub className="text-[10px]">sel</sub></span> <span className="text-slate-800">Standar Baterai ({standardCellPotential.toFixed(2)} V)</span></li>
                            <li className="flex justify-between"><span className="text-slate-400">E°<sub className="text-[10px]">red</sub></span> <span className="text-slate-800">Katoda / Reduksi ({selectedSolution.E0.toFixed(2)} V)</span></li>
                            <li className="flex justify-between"><span className="text-slate-400">E°<sub className="text-[10px]">oks</sub></span> <span className="text-slate-800">Anoda / Oksidasi ({selectedMetal.E0.toFixed(2)} V)</span></li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 relative overflow-hidden group">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-l-2xl transition-all group-hover:w-2"></div>
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-amber-500" /> Persamaan Nernst (Non-Standar)
                        </h3>
                        <div className="bg-slate-800 rounded-xl p-4 flex flex-col items-center justify-center mb-3">
                            <code className="text-[16px] font-mono text-amber-400 font-bold tracking-wider">E<sub className="text-[10px]">sel</sub> = E°<sub className="text-[10px]">sel</sub> - <span className="border-b-2 border-amber-400">0.0592</span> log Q</code>
                            <code className="text-[16px] font-mono text-amber-400 font-bold tracking-wider mt-1 ml-16">n     </code>
                        </div>
                        <ul className="text-xs font-medium text-slate-600 space-y-2 font-mono">
                            <li className="flex justify-between"><span className="text-slate-400">E<sub className="text-[10px]">sel</sub></span> <span className="text-slate-800">Potensial Aktual ({realCellPotential.toFixed(2)} V)</span></li>
                            <li className="flex justify-between"><span className="text-slate-400">n</span> <span className="text-slate-800">Mol elektron transfer ({nTransfer})</span></li>
                            <li className="flex justify-between"><span className="text-slate-400">Q</span> <span className="text-slate-800">Kuosien Reaksi ([Ion]/1)</span></li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 relative overflow-hidden group">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-2xl transition-all group-hover:w-2"></div>
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <FlaskConical className="w-4 h-4 text-indigo-500" /> Stoikiometri & Elektrolisis
                        </h3>
                        <div className="bg-slate-800 rounded-xl p-4 flex flex-col items-center justify-center mb-3">
                            <code className="text-[14px] font-mono text-indigo-400 font-bold tracking-widest text-center">{koefLogam} {selectedMetal.id} + {koefIon} {selectedSolution.ion} &rarr; <br/>{koefLogam} {selectedMetal.id}{formatIon(selectedMetal.n)} + {koefIon} {redTarget}</code>
                        </div>
                        <ul className="text-xs font-medium text-slate-600 space-y-2 font-mono">
                            <li className="flex justify-between"><span className="text-slate-400">Mol {selectedMetal.id}</span> <span className="text-slate-800">Massa / Ar = {molLogam.toFixed(3)} mol</span></li>
                            <li className="flex justify-between"><span className="text-slate-400">Mol {selectedSolution.ion}</span> <span className="text-slate-800">M V = {molIon.toFixed(3)} mol</span></li>
                            <li className="flex justify-between"><span className="text-slate-400">Massa Endapan</span> <span className="text-slate-800">{massaEndapan.toFixed(2)} g</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        )}
    </div>
  );
}
