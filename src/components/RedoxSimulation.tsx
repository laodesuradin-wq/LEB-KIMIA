import React, { useState, useEffect } from 'react';
import { FlaskConical, Zap, Play, RotateCcw, Activity, ChevronDown, ShieldAlert, ShieldCheck, Beaker } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';

const METALS = [
  { id: 'Zn', name: 'Seng (Zn)', E0: -0.76, color: 'bg-slate-300', Ar: 65.4 },
  { id: 'Fe', name: 'Besi (Fe)', E0: -0.44, color: 'bg-stone-500', Ar: 55.8 },
  { id: 'Pb', name: 'Timbal (Pb)', E0: -0.13, color: 'bg-gray-400', Ar: 207.2 },
  { id: 'Cu', name: 'Tembaga (Cu)', E0: 0.34, color: 'bg-orange-400', Ar: 63.5 },
  { id: 'Ag', name: 'Perak (Ag)', E0: 0.80, color: 'bg-slate-200', Ar: 107.9 },
];

const SOLUTIONS = [
  { id: 'ZnSO4', name: 'Seng Sulfat (Zn²⁺)', ion: 'Zn²⁺', E0: -0.76, color: '#f8fafc', cName: 'Seng' },
  { id: 'FeSO4', name: 'Besi(II) Sulfat (Fe²⁺)', ion: 'Fe²⁺', E0: -0.44, color: '#bbf7d0', cName: 'Besi' },
  { id: 'PbNO32', name: 'Timbal(II) Nitrat (Pb²⁺)', ion: 'Pb²⁺', E0: -0.13, color: '#f1f5f9', cName: 'Timbal' },
  { id: 'CuSO4', name: 'Tembaga(II) Sulfat (Cu²⁺)', ion: 'Cu²⁺', E0: 0.34, color: '#93c5fd', cName: 'Tembaga' },
  { id: 'AgNO3', name: 'Perak Nitrat (Ag⁺)', ion: 'Ag⁺', E0: 0.80, color: '#ffffff', cName: 'Perak' },
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
        bahayaDesc: 'Aman disentuh, namun perak (Ag) mahal dan berat. Cuci bersih setelah digunakan.'
    },
    { 
        nama: `Larutan Garam ${molarity} M`, 
        kuantitas: `${volume} mL / percobaan`,
        desc: 'Sediaan larutan ion transisi (ZnSO₄, FeSO₄, Pb(NO₃)₂, CuSO₄, AgNO₃) sebagai agen pengoksidasi.',
        isHazardous: true,
        bahayaDesc: 'Beracun bagi lingkungan perairan. Ion timbal (Pb²⁺) beracun bila tertelan. Hindari kontak langsung dengan kulit.'
    },
    { 
        nama: 'Aquades (H₂O)', 
        kuantitas: '100 - 250 mL',
        desc: 'Air murni pencuci.',
        isHazardous: false,
        bahayaDesc: 'Aman. Digunakan untuk membilas logam sebelum dan sesudah reaksi.'
    }
];

const REDOX_KESELAMATAN = [
    "Gunakan jas laboratorium, sarung tangan pelindung, dan kacamata keselamatan (goggles) selama praktikum.",
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

const ExpandableBahan = ({ bahanItem }: { bahanItem: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <li className="flex items-start gap-2.5 cursor-pointer group" onClick={() => setIsOpen(!isOpen)}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5 transition-transform group-hover:scale-125"></span> 
            <div className="flex-1 select-none">
                <div className="flex items-center justify-between">
                    <strong className="text-slate-800 group-hover:text-emerald-600 transition-colors">{bahanItem.nama}</strong>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
                {isOpen && (
                    <div className="mt-1 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-1">
                        {bahanItem.kuantitas && (
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded w-fit">
                                {bahanItem.kuantitas}
                            </span>
                        )}
                        <span className="text-slate-500 text-[11px]">{bahanItem.desc}</span>
                        <div className={`p-2 mt-1 rounded border text-[11px] font-medium leading-relaxed ${bahanItem.isHazardous ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
                            <div className="flex items-center gap-1.5 mb-1.5">
                                {bahanItem.isHazardous ? <ShieldAlert className="w-3.5 h-3.5 text-red-600" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                                <strong className={bahanItem.isHazardous ? "text-red-700" : "text-emerald-700"}>{bahanItem.isHazardous ? 'BAHAYA' : 'AMAN'}</strong>
                            </div>
                            {bahanItem.bahayaDesc}
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

  const selectedMetal = METALS.find(m => m.id === metalId)!;
  const selectedSolution = SOLUTIONS.find(s => s.id === solutionId)!;

  // Reaksi spontan jika E0 reduksi > E0 oksidasi
  // Reduksi: ion dalam larutan -> E0 larutan
  // Oksidasi: logam -> E0 logam
  const willReact = selectedSolution.E0 > selectedMetal.E0;
  const standardCellPotential = selectedSolution.E0 - selectedMetal.E0;
  // Hukum Nernst E = E0 - (0.0592/n)*log(Q)
  // Untuk reaksi reduksi, kita integrasikan perkiraan nilai sesungguhnya
  const n = 2; // asumsi sebagian besar kation bervalensi 2 di simulasi ini
  const realCellPotential = standardCellPotential - (0.0592 / n) * Math.log10(1 / solutionMolarity);

  // Molaritas otomatis disesuaikan dengan M = (m/Ar) * (1000/V)
  useEffect(() => {
    const calculated = (metalMass / selectedMetal.Ar) * (1000 / solutionVolume);
    setSolutionMolarity(calculated);
  }, [metalMass, solutionVolume, selectedMetal.Ar]);

  useEffect(() => {
    let timer: any;
    if (isReacting && willReact && progress < 100) {
      timer = setInterval(() => {
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
    setIsReacting(true);
    setProgress(0);
  };

  const handleReset = () => {
    setIsReacting(false);
    setProgress(0);
  };

  // Potensial Standar Data untuk Chart
  const chartData = [
    { name: `Reduksi (${selectedSolution.ion})`, potensial: selectedSolution.E0, fill: '#3b82f6' },
    { name: `Oksidasi (${selectedMetal.id})`, potensial: selectedMetal.E0, fill: '#ef4444' }
  ];

  return (
    <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 animate-in fade-in duration-500">
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
                            disabled={isReacting}
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
                            disabled={isReacting}
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
                                disabled={isReacting}
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
                                disabled={isReacting}
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
                                disabled={isReacting}
                            />
                            <span className="text-sm font-bold text-indigo-600 w-12">{durasi} s</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex gap-3">
                    {!isReacting || progress === 100 ? (
                        <button 
                            onClick={progress === 100 ? handleReset : handleStart}
                            className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 text-white transition-all ${progress === 100 ? 'bg-slate-700 hover:bg-slate-800 shadow-md' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30'}`}
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
                                        backgroundColor: ['Cu'].includes(selectedSolution.cName) ? '#b45309' : '#94a3b8',
                                        filter: 'contrast(120%) brightness(80%)',
                                        opacity: progress / 100,
                                    }}
                                >
                                    <div className="w-full h-full opacity-80" style={{
                                        backgroundImage: 'radial-gradient(black 1px, transparent 1px)',
                                        backgroundSize: '3px 3px'
                                    }}></div>
                                </div>
                            )}
                        </div>

                        {/* Penanda Endapan pada Katoda */}
                        {willReact && isReacting && progress > 10 && (
                            <div className="absolute right-[-60px] top-[75%] translate-y-[-50%] flex items-center gap-2 z-40 transition-opacity duration-500 opacity-100">
                                <div className="w-12 h-0.5 bg-yellow-400"></div>
                                <div className="bg-slate-800 border border-slate-600 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap">
                                    <span className="text-yellow-400 font-bold">Endapan</span><br/>
                                    {selectedSolution.cName} ({selectedSolution.ion.replace(/[^A-Za-z]/g, '')})
                                </div>
                            </div>
                        )}
                        
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
                                    <span className="font-bold text-rose-600">{selectedMetal.id} → {selectedMetal.id}²⁺ + 2e⁻</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-600 border-b border-slate-200 pb-2">
                                    <span>Reduksi:</span>
                                    <span className="font-bold text-blue-600">{selectedSolution.ion} + 2e⁻ → {selectedSolution.cName === 'Perak' ? 'Ag' : selectedSolution.ion.replace('²⁺','')}</span>
                                </div>
                                <div className="flex justify-between items-center font-bold text-indigo-700 pt-1">
                                    <span>Total:</span>
                                    <span>{selectedMetal.id} + {selectedSolution.ion} → {selectedMetal.id}²⁺ + {selectedSolution.cName === 'Perak' ? 'Ag' : selectedSolution.ion.replace('²⁺','')}</span>
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
                    <ul className="text-[12px] text-red-700 space-y-2.5 font-medium relative z-10">
                        {REDOX_KESELAMATAN.map((rule, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5"></span>
                                <span className="leading-relaxed">{rule}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </div>
  );
}
