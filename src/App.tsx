import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Play, RotateCcw, Thermometer, FlaskConical, Zap, Activity, MessageSquare, Menu, ClipboardList, ShieldAlert, ShieldCheck, Beaker, TrendingUp, Timer, ChevronDown, Table, CheckCircle2, Rotate3D, MousePointer2, Square, Compass, Shirt, Glasses, Hand, Wind, Footprints, Flame, Skull, Droplets, Bomb, AlertTriangle, Leaf } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Particles3D } from './components/Particles3D';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceDot } from 'recharts';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  color: string;
  flashTimer?: number;
}

const BAHAN_KIMIA = [
    { 
        id: 'H2O2', 
        nama: 'Hidrogen Peroksida (H₂O₂)', 
        desc: 'Penguraian Peroksida', 
        symbols: ['corrosive', 'irritant'],
        colorA: '#38bdf8', 
        colorB: '#0ea5e9', 
        Ea: 50000, 
        catEa: 30000,
        kalkulasi: (konsentrasi: number) => `${((konsentrasi * 100) / 9.8).toFixed(2)} mL larutan H₂O₂ pekat (30% / 9.8 M) untuk 100 mL larutan`,
        alat: [

            { nama: 'Labu Erlenmeyer 250 mL', desc: 'Wadah reaktor utama untuk mencampur larutan.' },
            { nama: 'Gelas Ukur 50 mL', desc: 'Mengukur volume H₂O₂.' },
            { nama: 'Spatula', desc: 'Mengambil serbuk katalis (mis. KI atau MnO₂).' },
            { nama: 'Stopwatch', desc: 'Mencatat waktu durasi reaksi.' },
            { nama: 'Sumbat Karet & Pipa Kaca', desc: 'Bila perlu menangkap gas O₂ yang dihasilkan.' }
        ],
        bahan: [
            { nama: 'Hidrogen Peroksida (H₂O₂)', desc: 'Bahan reaktan utama yang akan terdekomposisi.', isHazardous: true, bahayaDesc: 'Korosif dan oksidator kuat. Jika terkena kulit menyebabkan sel memutih, iritasi parah, dan luka bakar.', symbols: ['corrosive', 'irritant'] },
            { nama: 'Serbuk KI atau MnO₂', desc: 'Katalis untuk mempercepat reaksi penguraian.', isHazardous: true, bahayaDesc: 'Dapat menyebabkan iritasi pada kulit, mata, dan saluran pernapasan jika dihirup.', symbols: ['irritant'] },
            { nama: 'Aquades', desc: 'Pelarut universal.', isHazardous: false, bahayaDesc: 'Aman untuk bersentuhan langsung dengan kulit.', symbols: ['safe'] }
        ]
    },
    { 
        id: 'Na2S2O3', 
        nama: 'Natrium Tiosulfat + HCl', 
        desc: 'Pembentukan Endapan Belerang', 
        symbols: ['corrosive', 'toxic', 'irritant'],
        colorA: '#facc15', 
        colorB: '#94a3b8', 
        Ea: 55000, 
        catEa: 35000,
        kalkulasi: (konsentrasi: number) => `${(konsentrasi * 0.1 * 158.11).toFixed(2)} gram padatan Na₂S₂O₃ dilarutkan hingga 100 mL`,
        alat: [
            { nama: 'Gelas Kimia 100 mL', desc: 'Wadah observasi untuk reaksi pengendapan.' },
            { nama: 'Gelas Ukur 50 mL', desc: 'Mengukur Na₂S₂O₃ dan HCl secara presisi.' },
            { nama: 'Kertas Tanda Silang (X)', desc: 'Sebagai indikator kekeruhan dari endapan belerang.' },
            { nama: 'Stopwatch', desc: 'Menghitung waktu dari pencampuran hingga tanda (X) tidak terlihat.' },
            { nama: 'Termometer', desc: 'Memantau suhu awal larutan sebelum direaksikan.' }
        ],
        bahan: [
            { nama: 'Natrium Tiosulfat (Na₂S₂O₃)', desc: 'Reaktan utama pemberi ion tiosulfat.', isHazardous: false, bahayaDesc: 'Secara umum aman, namun dapat menyebabkan iritasi ringan pada kulit sensitif.', symbols: ['safe', 'irritant'] },
            { nama: 'Asam Klorida (HCl)', desc: 'Reaktan utama pemberi ion H+.', isHazardous: true, bahayaDesc: 'Sangat korosif. Jika mengenai kulit dapat menyebabkan luka bakar kimia yang parah dan rasa perih yang kuat.', symbols: ['corrosive', 'toxic'] },
            { nama: 'Aquades', desc: 'Bahan pengencer.', isHazardous: false, bahayaDesc: 'Aman dan tidak memberikan dampak pada tubuh.', symbols: ['safe'] }
        ]
    },
    { 
        id: 'Mg', 
        nama: 'Pita Magnesium + HCl', 
        desc: 'Produksi Gas Hidrogen', 
        symbols: ['flammable', 'corrosive', 'toxic'],
        colorA: '#cbd5e1', 
        colorB: '#94a3b8', 
        Ea: 45000, 
        catEa: 25000,
        kalkulasi: (konsentrasi: number) => `${((konsentrasi * 100) / 12).toFixed(2)} mL pekat HCl (12 M) dilarutkan hingga 100 mL`,
        alat: [
            { nama: 'Labu Erlenmeyer', desc: 'Wadah untuk mereaksikan padatan dan asam.' },
            { nama: 'Gelas Ukur 25 mL', desc: 'Untuk mengukur volume HCl.' },
            { nama: 'Amplas', desc: 'Membersihkan permukaan pita magnesium.' },
            { nama: 'Gunting', desc: 'Memotong pita magnesium sesuai ukuran tertentu.' },
            { nama: 'Stopwatch', desc: 'Mengukur durasi reaksi hingga pita magnesium habis.' }
        ],
        bahan: [
            { nama: 'Pita Magnesium (Mg)', desc: 'Logam reaktif yang memberikan luas permukaan.', isHazardous: true, bahayaDesc: 'Padatan logam ringan. Dalam bentuk serbuk sangat mudah terbakar dan nyalanya sangat terang (merusak retina). Cukup aman disentuh jika dalam bentuk pita, namun jangan sampai tertelan.', symbols: ['flammable', 'irritant'] },
            { nama: 'Asam Klorida (HCl)', desc: 'Larutan asam yang akan bereaksi dengan logam Mg.', isHazardous: true, bahayaDesc: 'Asam kuat yang bersifat korosif. Mengakibatkan luka bakar jika tersiram ke kulit atau mata.', symbols: ['corrosive', 'toxic'] },
            { nama: 'Aquades', desc: 'Pelarut.', isHazardous: false, bahayaDesc: 'Tidak berbahaya.', symbols: ['safe'] }
        ]
    },
    { 
        id: 'CaCO3', 
        nama: 'Kalsium Karbonat + HCl', 
        desc: 'Kalsium Klorida dan CO₂',
        symbols: ['corrosive', 'toxic'], 
        colorA: '#e2e8f0', 
        colorB: '#94a3b8', 
        Ea: 48000, 
        catEa: 28000,
        kalkulasi: (konsentrasi: number) => `${((konsentrasi * 100) / 12).toFixed(2)} mL pekat HCl (12 M) dilarutkan hingga 100 mL`,
        alat: [
            { nama: 'Labu Erlenmeyer 250 mL', desc: 'Wadah reaktor utama untuk melarutkan serbuk/keping.' },
            { nama: 'Gelas Ukur 50 mL', desc: 'Mengambil volume HCl.' },
            { nama: 'Spatula', desc: 'Mengambil pualam/CaCO₃ bentuk serbuk.' },
            { nama: 'Neraca Analitik', desc: 'Menimbang massa CaCO₃ keping / serbuk agar sama.' },
            { nama: 'Stopwatch', desc: 'Mencatat durasi hingga seluruh zat larut / gelembung berhenti.' }
        ],
        bahan: [
            { nama: 'Keping pualam / CaCO₃ padat', desc: 'Sumber Kalsium Karbonat (Bentuk kasar).', isHazardous: false, bahayaDesc: 'Aman untuk disentuh. Menghirup debu secara berlebihan dapat menyebabkan iritasi saluran pernapasan ringan.', symbols: ['safe'] },
            { nama: 'Serbuk pualam / CaCO₃', desc: 'Sumber Kalsium Karbonat (Bentuk halus).', isHazardous: false, bahayaDesc: 'Debu berlebih dapat mengiritasi mata dan saluran pernapasan.', symbols: ['irritant'] },
            { nama: 'Asam Klorida (HCl)', desc: 'Reaktan utama.', isHazardous: true, bahayaDesc: 'Bahan kimia korosif. Berpotensi menimbulkan iritasi kulit hingga luka bakar jika tidak dibilas.', symbols: ['corrosive', 'toxic'] }
        ]
    },
    { 
        id: 'KMnO4', 
        nama: 'KMnO₄ + H₂C₂O₄', 
        desc: 'Reaksi Redoks Autokatalitik', 
        symbols: ['toxic', 'environment', 'corrosive'],
        colorA: '#d946ef', 
        colorB: '#e879f9', 
        Ea: 60000, 
        catEa: 38000,
        kalkulasi: (konsentrasi: number) => `${(konsentrasi * 0.1 * 158.034).toFixed(2)} gram padatan KMnO₄ dilarutkan hingga 100 mL`,
        alat: [
            { nama: 'Labu Erlenmeyer 250 mL', desc: 'Tempat pelarutan dan proses goyangan.' },
            { nama: 'Buret & Statif', desc: 'Agar penambahan volume titran dapat terukur.' },
            { nama: 'Hot Plate', desc: 'Memanaskan larutan karena reaksi di suhu kamar lambat.' },
            { nama: 'Termometer', desc: 'Memastikan suhu yang tepat untuk awal reaksi.' },
            { nama: 'Stopwatch', desc: 'Waktu yang diukur sejauh mana reaksi autokatalitik berjalan.' }
        ],
        bahan: [
            { nama: 'Kalium Permanganat (KMnO₄)', desc: 'Titran & indikator auto-oksidasi.', isHazardous: true, bahayaDesc: 'Zat pengoksidasi kuat. Berbahaya apabila tertelan. Bila terkena kulit akan meninggalkan noda coklat/ungu pekat dan menyebabkan iritasi.', symbols: ['toxic', 'environment'] },
            { nama: 'Asam Oksalat (H₂C₂O₄)', desc: 'Reduktor.', isHazardous: true, bahayaDesc: 'Beracun dan korosif. Kontak dengan kulit menyebabkan luka bakar; terabsorpsi dalam kulit bisa merusak ginjal.', symbols: ['toxic', 'corrosive'] },
            { nama: 'Asam Sulfat (H₂SO₄)', desc: 'Penyesuai suasana asam.', isHazardous: true, bahayaDesc: 'Sangat amat korosif. Menghancurkan jaringan tubuh secara cepat dan menghasilkan panas ekstrem bila kena air (luka bakar termal dan kimiawi).', symbols: ['corrosive'] }
        ]
    }
];

interface ExplosionDebris {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  color: string;
  life: number;
  maxLife: number;
}

interface EnergyPopup {
  id: number;
  x: number;
  y: number;
  z: number;
  energy: number;
  life: number;
}

const AnomalyDot = (props: any) => {
    const { cx, cy, payload, dataKey } = props;
    
    const isAnomaly = dataKey === 'rate' ? payload.isRateAnomaly : payload.isSimRateAnomaly;
    
    if (isAnomaly) {
        return (
            <circle cx={cx} cy={cy} r={4} stroke="#ef4444" strokeWidth={2} fill="#fee2e2" className="animate-pulse" />
        );
    }
    return null;
};

import { RedoxSimulation } from './components/RedoxSimulation';

export default function App() {
  const [suhu, setSuhu] = useState<number>(298);
  const [konsentrasi, setKonsentrasi] = useState<number>(0.5);
  const [katalis, setKatalis] = useState<boolean>(false);
  const [isReacting, setIsReacting] = useState<boolean>(false);
  const [collisionsPerSecond, setCollisionsPerSecond] = useState<number>(0);
  const [durasi, setDurasi] = useState<number>(0);
  const [ordoB, setOrdoB] = useState<number>(0);
  const [bahanKimia, setBahanKimia] = useState<string>('H2O2');
  const [customEa, setCustomEa] = useState<number | null>(null);
  
  const [apdChecklist, setApdChecklist] = useState({
    jasLab: false,
    kacamata: false,
    sarungTangan: false,
    masker: false,
    sepatu: false,
  });
  const isApdComplete = Object.values(apdChecklist).every(Boolean);

  const [is3D, setIs3D] = useState<boolean>(false);
  const [autoRotate3D, setAutoRotate3D] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const durationRef = useRef<number>(0);
  
  useEffect(() => {
    durationRef.current = durasi;
  }, [durasi]);
  const particlesRef = useRef<Particle[]>([]);
  const debrisRef = useRef<ExplosionDebris[]>([]);
  const popupsRef = useRef<EnergyPopup[]>([]);
  const popupIdCounterRef = useRef<number>(0);
  const keBarRef = useRef<HTMLDivElement>(null);
  const keTextRef = useRef<HTMLSpanElement>(null);
  const lastKeUpdateTimeRef = useRef<number>(0);
  const collisionCountRef = useRef<number>(0);
  const effectiveCollisionCountRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const lastPlayTimeRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const [rateHistory, setRateHistory] = useState<{time: number, rate: number, simulatedRate: number}[]>([]);
  const timeStepRef = useRef<number>(0);
  const totalCollisionsRef = useRef<number>(0);
  const lajuReaksiRef = useRef<number>(0);

  const processedHistory = React.useMemo(() => {
      return rateHistory.map((point, index, arr) => {
          let isRateAnomaly = false;
          let isSimRateAnomaly = false;
          if (index > 0) {
              const prev = arr[index - 1];
              if (prev.rate > 0 && point.rate > prev.rate * 1.5) {
                  isRateAnomaly = true;
              } else if (prev.rate === 0 && point.rate > 0) {
                  isRateAnomaly = true;
              }
              
              if (prev.simulatedRate > 0 && point.simulatedRate > prev.simulatedRate * 1.5 && (point.simulatedRate - prev.simulatedRate) > 2) {
                  isSimRateAnomaly = true;
              } else if (prev.simulatedRate === 0 && point.simulatedRate > 2) {
                  isSimRateAnomaly = true;
              }
          }
          return { ...point, isRateAnomaly, isSimRateAnomaly };
      });
  }, [rateHistory]);

  const currentCalibrationRef = useRef<number>(1);
  const galatPercentage = React.useMemo(() => {
      if (processedHistory.length < 2) return 0;
      const latest = processedHistory[processedHistory.length - 1];
      
      if (latest.rate > 0 && latest.simulatedRate > 0) {
          const currentRatio = latest.simulatedRate / latest.rate;
          currentCalibrationRef.current = currentCalibrationRef.current * 0.9 + currentRatio * 0.1;
      }
      
      const expectedSim = latest.rate * currentCalibrationRef.current;
      if (expectedSim === 0) return 0;
      const error = Math.abs(latest.simulatedRate - expectedSim) / expectedSim * 100;
      return Math.min(error, 99.9);
  }, [processedHistory]);

  const activeBahanData = React.useMemo(() => BAHAN_KIMIA.find(b => b.id === bahanKimia) || BAHAN_KIMIA[0], [bahanKimia]);

  const currentPH = React.useMemo(() => {
    switch (bahanKimia) {
      case 'H2O2': return Math.max(0, 5.5 - konsentrasi * 0.5);
      case 'Na2S2O3': 
      case 'Mg':
      case 'CaCO3': return Math.max(0.1, -Math.log10(konsentrasi)); 
      case 'KMnO4': return Math.max(0.1, -Math.log10(konsentrasi * 2)); 
      default: return 7.0;
    }
  }, [bahanKimia, konsentrasi]);

  const getPHColor = (pH: number) => {
    if (pH < 2) return 'bg-red-500 from-red-600 to-red-400 text-white shadow-red-500/30';
    if (pH < 4) return 'bg-orange-500 from-orange-600 to-orange-400 text-white shadow-orange-500/30';
    if (pH < 6) return 'bg-yellow-400 from-yellow-500 to-yellow-300 text-slate-800 shadow-yellow-500/30';
    if (pH <= 8) return 'bg-emerald-500 from-emerald-600 to-emerald-400 text-white shadow-emerald-500/30';
    if (pH < 11) return 'bg-blue-500 from-blue-600 to-blue-400 text-white shadow-blue-500/30';
    return 'bg-purple-500 from-purple-600 to-purple-400 text-white shadow-purple-500/30';
  };

  useEffect(() => {
      const handleResize = () => {
          if (isReacting && canvasRef.current) {
              const rect = canvasRef.current.getBoundingClientRect();
              canvasRef.current.width = rect.width;
              canvasRef.current.height = rect.height;
          }
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, [isReacting]);

  // Chat state
  const [chatInput, setChatInput] = useState('');
  
  // Mobile UI state
  const [activeMobileControl, setActiveMobileControl] = useState<'suhu' | 'konsentrasi' | 'katalis' | 'waktu' | 'ordo' | 'preset' | 'bahan' | 'ea'>('suhu');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSOP, setShowSOP] = useState(true);
  const [showDataModal, setShowDataModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState<'laju_reaksi' | 'redoks'>('laju_reaksi');
  
  const startTour = () => {
    localStorage.setItem('hasSeenTour', 'true');
    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: false,
      overlayColor: 'rgba(15, 23, 42, 0.8)',
      nextBtnText: 'Lanjut',
      prevBtnText: 'Kembali',
      doneBtnText: 'Selesai',
      steps: [
        { popover: { title: 'Selamat Datang!', description: 'Mari kita mulai tur singkat untuk mengenali Virtual Lab ini.', side: 'bottom' } },
        { element: '#tour-control-panel', popover: { title: 'Control Panel', description: 'Di sini Anda dapat mengatur Suhu, Konsentrasi, Katalis, Bahan Kimia, dan lain-lain sebelum memulai simulasi.', side: 'right', align: 'start' } },
        { element: '#tour-simulation-view', popover: { title: 'Tumbukan Visual', description: 'Reaksi kimia disimulasikan secara real-time. Anda bisa memilih mode 2D atau 3D untuk melihat pergerakan partikel.', side: 'bottom' } },
        { element: '#tour-chart-energy', popover: { title: 'Grafik Energi', description: 'Melihat distribusi energi kinetik Maxwell-Boltzmann secara real-time berdasarkan suhu (T).', side: 'top' } },
        { element: '#tour-chart-rate', popover: { title: 'Laju Reaksi (v)', description: 'Memonitor laju reaksi teoretis vs hasil simulasi stokastik. Anda bisa melihat lonjakan data jika ada perubahan ekstrem.', side: 'top' } },
        { element: '#tour-chart-temp', popover: { title: 'Korelasi Suhu & Laju', description: 'Memvisualisasikan pengaruh suhu terhadap laju reaksi secara teoretis.', side: 'top' } },
        { element: '#tour-chembot', popover: { title: 'ChemBot', description: 'Asisten cerdas yang siap membantu Anda dalam menganalisis data atau sekadar tanya jawab mengenai konsep kimia!', side: 'left', align: 'start' } },
      ]
    });
    driverObj.drive();
  };

  // Algorithmic Logic for Reaction Rate (as per user Python code)
  const hitungLajuReaksi = (k: number, cA: number, m: number, cB: number, n: number) => {
      const v = k * Math.pow(cA, m) * Math.pow(cB, n);
      return v;
  };

  const getKValue = (T: number, isCatalyzed: boolean, bahanId: string, customEaVal: number | null) => {
      const bahan = BAHAN_KIMIA.find(b => b.id === bahanId) || BAHAN_KIMIA[0];
      let baseEa = customEaVal !== null ? customEaVal : bahan.Ea;
      let finalEa = isCatalyzed ? (customEaVal !== null ? Math.max(1000, baseEa - 20000) : bahan.catEa) : baseEa;
      
      const R = 8.314; // Gas constant 
      const A = 1e6; // Pre-exponential factor
      return A * Math.exp(-finalEa / (R * T));
  };

  const k_val = getKValue(suhu, katalis, bahanKimia, customEa);
  const lajuReaksi = hitungLajuReaksi(k_val, konsentrasi, 1, konsentrasi, ordoB); // using cB=konsentrasi, n=ordoB

  const temperatureRateData = useMemo(() => {
      const data = [];
      const R = 8.314;
      const A = 1e6;
      const bahan = BAHAN_KIMIA.find(b => b.id === bahanKimia) || BAHAN_KIMIA[0];
      
      let baseEa = customEa !== null ? customEa : bahan.Ea;
      let finalEa = katalis ? (customEa !== null ? Math.max(1000, baseEa - 20000) : bahan.catEa) : baseEa;
          
      for(let t = 273; t <= 373; t += 5) {
          let kTemp = A * Math.exp(-finalEa / (R * t));
          let rateTemp = hitungLajuReaksi(kTemp, konsentrasi, 1, konsentrasi, ordoB);
          
          data.push({
              suhu: t,
              laju: rateTemp
          });
      }
      
      if (suhu % 5 !== 0 && suhu >= 273 && suhu <= 373) {
          data.push({
              suhu: suhu,
              laju: lajuReaksi
          });
          data.sort((a, b) => a.suhu - b.suhu);
      }
      return data;
  }, [katalis, bahanKimia, customEa, konsentrasi, ordoB, suhu, lajuReaksi]);

  useEffect(() => {
      lajuReaksiRef.current = lajuReaksi;
  }, [lajuReaksi]);

  const initAudio = () => {
      if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
      }
  };

  const playClick = (intensity: number) => {
      if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
      
      const time = audioCtxRef.current.currentTime;
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(400 + Math.random() * 200, time);
      osc.frequency.exponentialRampToValueAtTime(100, time + 0.02);

      const volume = Math.min(intensity * 0.05, 0.2); // Cap volume
      gain.gain.setValueAtTime(volume, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.02);
      
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      
      osc.start(time);
      osc.stop(time + 0.02);
  };

  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'Halo! Saya Sandra, asisten virtual kamu. Mari mulai bereksperimen, apa yang ingin kita amati hari ini?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const suhuRef = useRef<number>(suhu);
  const konsentrasiRef = useRef<number>(konsentrasi);
  const katalisRef = useRef<boolean>(katalis);
  const bahanRef = useRef<string>(bahanKimia);

  useEffect(() => {
      suhuRef.current = suhu;
  }, [suhu]);

  useEffect(() => {
      konsentrasiRef.current = konsentrasi;
  }, [konsentrasi]);

  useEffect(() => {
      katalisRef.current = katalis;
  }, [katalis]);

  useEffect(() => {
      bahanRef.current = bahanKimia;
  }, [bahanKimia]);

  // Focus effect to keep chat at bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const initParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const numParticles = Math.floor(konsentrasiRef.current * 150);
    const particles: Particle[] = [];
    const bahan = BAHAN_KIMIA.find(b => b.id === bahanRef.current) || BAHAN_KIMIA[0];
    const colors = [bahan.colorA, bahan.colorB];

    for (let i = 0; i < numParticles; i++) {
        let speedMultiplier = suhuRef.current / 150; 
        
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            z: (Math.random() - 0.5) * canvas.width,
            vx: (Math.random() - 0.5) * speedMultiplier * 4,
            vy: (Math.random() - 0.5) * speedMultiplier * 4,
            vz: (Math.random() - 0.5) * speedMultiplier * 4,
            radius: 4 + Math.random() * 6,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }

    particlesRef.current = particles;
  };

  const updateParticles = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      let collisions = 0;
      const particles = particlesRef.current;

      const targetCount = Math.floor(konsentrasiRef.current * 150);
      const currentCount = particles.length;

      // Adjust particle count smoothly
      if (targetCount > currentCount && Math.random() < 0.2) {
          const bahan = BAHAN_KIMIA.find(b => b.id === bahanRef.current) || BAHAN_KIMIA[0];
          const colors = [bahan.colorA, bahan.colorB];
          const speedMultiplier = suhuRef.current / 150;
          particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              z: (Math.random() - 0.5) * canvas.width,
              vx: (Math.random() - 0.5) * speedMultiplier * 4,
              vy: (Math.random() - 0.5) * speedMultiplier * 4,
              vz: (Math.random() - 0.5) * speedMultiplier * 4,
              radius: 4 + Math.random() * 6,
              color: colors[Math.floor(Math.random() * colors.length)]
          });
      } else if (targetCount < currentCount) {
          particles.pop();
      }

      const targetSpeedMultiplier = suhuRef.current / 150;

      for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];

          // Slowly adjust speed towards target temperature
          const currentSpeedSq = p1.vx * p1.vx + p1.vy * p1.vy + p1.vz * p1.vz;
          const targetAvgSpeedSq = (targetSpeedMultiplier * 2) ** 2;
          
          if (currentSpeedSq < targetAvgSpeedSq) {
              p1.vx *= 1.02;
              p1.vy *= 1.02;
              p1.vz *= 1.02;
          } else if (currentSpeedSq > targetAvgSpeedSq) {
              p1.vx *= 0.98;
              p1.vy *= 0.98;
              p1.vz *= 0.98;
          }

          p1.x += p1.vx;
          p1.y += p1.vy;
          p1.z += p1.vz;

          if (p1.x - p1.radius < 0 || p1.x + p1.radius > canvas.width) p1.vx *= -1;
          if (p1.y - p1.radius < 0 || p1.y + p1.radius > canvas.height) p1.vy *= -1;
          if (p1.z - p1.radius < -canvas.width/2 || p1.z + p1.radius > canvas.width/2) p1.vz *= -1;

          for (let j = i + 1; j < particles.length; j++) {
              const p2 = particles[j];
              const dx = p2.x - p1.x;
              const dy = p2.y - p1.y;
              const dz = p2.z - p1.z;
              const distSq = dx * dx + dy * dy + dz * dz;
              const radSum = p1.radius + p2.radius;
              
              if (distSq < radSum * radSum) {
                  collisions++;
                  
                  // Calculate relative collision energy
                  const relativeVx = p1.vx - p2.vx;
                  const relativeVy = p1.vy - p2.vy;
                  const relativeVz = p1.vz - p2.vz;
                  const collisionEnergySq = relativeVx * relativeVx + relativeVy * relativeVy + relativeVz * relativeVz;
                  
                  // Expected energy range at 300K is ~21, at 1000K is ~230
                  // Tumbukan efektif (reaksi) jika energi mengatasi energi aktivasi
                  const bahan = BAHAN_KIMIA.find(b => b.id === bahanRef.current) || BAHAN_KIMIA[0];
                  const eaValue = katalisRef.current ? bahan.catEa : bahan.Ea;
                  const eaThreshold = (eaValue / 50000) * 45.0;
                  
                  if (collisionEnergySq > eaThreshold) {
                      effectiveCollisionCountRef.current++;
                      p1.flashTimer = 20; // frames to glow
                      p2.flashTimer = 20;
                      
                      const centerX = (p1.x + p2.x) / 2;
                      const centerY = (p1.y + p2.y) / 2;
                      const centerZ = (p1.z + p2.z) / 2;
                      
                      popupsRef.current.push({
                          id: popupIdCounterRef.current++,
                          x: centerX,
                          y: centerY,
                          z: centerZ,
                          energy: collisionEnergySq,
                          life: 1.0
                      });
                      
                      // Generate small explosion debris
                      for (let k = 0; k < 5; k++) {
                          debrisRef.current.push({
                              x: centerX,
                              y: centerY,
                              z: centerZ,
                              vx: (Math.random() - 0.5) * 6,
                              vy: (Math.random() - 0.5) * 6,
                              vz: (Math.random() - 0.5) * 6,
                              radius: Math.random() * 2 + 1,
                              color: '#fbbf24', // Amber explosion
                              life: 25 + Math.random() * 15,
                              maxLife: 40
                          });
                      }
                  }

                  const tempVx = p1.vx;
                  const tempVy = p1.vy;
                  const tempVz = p1.vz;
                  p1.vx = p2.vx;
                  p1.vy = p2.vy;
                  p1.vz = p2.vz;
                  p2.vx = tempVx;
                  p2.vy = tempVy;
                  p2.vz = tempVz;
                  
                  const dist = Math.sqrt(distSq) || 1;
                  const overlap = (radSum - dist) / 2;
                  p1.x -= (dx/dist) * overlap;
                  p1.y -= (dy/dist) * overlap;
                  p1.z -= (dz/dist) * overlap;
                  p2.x += (dx/dist) * overlap;
                  p2.y += (dy/dist) * overlap;
                  p2.z += (dz/dist) * overlap;
              }
          }
      }
      
      if (collisions > 0) {
          const now = performance.now();
          // Rate-limit audio feedback to keep the UI lightweight and avoid audio distortion
          if (now - lastPlayTimeRef.current > Math.max(30, 200 - collisions * 5)) {
              playClick(collisions);
              lastPlayTimeRef.current = now;
          }
      }
      collisionCountRef.current += collisions;
  }

  const drawParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background color shifts based on temperature
    const currentSuhu = suhuRef.current;
    const heatRatio = Math.max(0, Math.min(1, (currentSuhu - 200) / 800));
    const bgR = Math.floor(15 + heatRatio * 60);
    const bgG = Math.floor(23 + heatRatio * 10);
    const bgB = Math.floor(42 - heatRatio * 15);
    
    // Add a trailing effect for visual flair based on temperature
    // Semakin tinggi suhu, partikel makin cepat, jejak makin blur (alpha lebih rendah)
    const trailAlpha = Math.max(0.1, 0.4 - (currentSuhu / 2000));
    ctx.fillStyle = `rgba(${bgR}, ${bgG}, ${bgB}, ${trailAlpha})`; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const jitter = Math.max(0, (currentSuhu - 400) / 200);

    particlesRef.current.forEach(p => {
        ctx.beginPath();
        const jx = p.x + (Math.random() - 0.5) * jitter;
        const jy = p.y + (Math.random() - 0.5) * jitter;
        
        let currentRadius = p.radius;
        const speedSq = p.vx * p.vx + p.vy * p.vy;
        const speed = Math.sqrt(speedSq);
        const stretch = Math.max(1, 1 + speed * 0.15); // Semakin cepat, semakin lonjong
        const angle = Math.atan2(p.vy, p.vx);

        if (p.flashTimer && p.flashTimer > 0) {
           const flashRatio = p.flashTimer / 20;
           // Tambah ukuran (swell) sesaat sebelum meledak
           currentRadius = p.radius * (1 + flashRatio * 1.5);
           ctx.shadowBlur = 20;
           ctx.shadowColor = '#ffffff'; // White/Amber glow
           
           ctx.ellipse(jx, jy, currentRadius * stretch, currentRadius, angle, 0, Math.PI * 2);
           ctx.fillStyle = `rgba(255, 255, 255, ${0.8 + flashRatio * 0.2})`;
           ctx.fill();

           ctx.fillStyle = p.color;
           ctx.globalAlpha = 1 - flashRatio;
           p.flashTimer--;
        } else if (heatRatio > 0.6) {
           ctx.ellipse(jx, jy, currentRadius * stretch, currentRadius, angle, 0, Math.PI * 2);
           ctx.shadowBlur = 10 * heatRatio;
           ctx.shadowColor = '#ef4444';
           ctx.fillStyle = p.color;
           ctx.globalAlpha = 1.0;
        } else {
           ctx.ellipse(jx, jy, currentRadius * stretch, currentRadius, angle, 0, Math.PI * 2);
           ctx.shadowBlur = 0;
           ctx.fillStyle = p.color;
           ctx.globalAlpha = 1.0;
        }

        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.closePath();
    });

    // Handle explosion debris
    for (let i = debrisRef.current.length - 1; i >= 0; i--) {
        const d = debrisRef.current[i];
        
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        
        const alpha = Math.max(0, d.life / d.maxLife);
        ctx.fillStyle = d.color;
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = 10 * alpha;
        ctx.shadowColor = d.color;
        
        ctx.fill();
        ctx.closePath();
        
        // Reset global settings
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;

        // Update position & life
        d.x += d.vx;
        d.y += d.vy;
        d.life--;

        // Remove if life is over
        if (d.life <= 0) {
            debrisRef.current.splice(i, 1);
        }
    }
    
    // Handle energy popups
    for (let i = popupsRef.current.length - 1; i >= 0; i--) {
        const popup = popupsRef.current[i];
        popup.life -= 0.02; // Fade out speed
        popup.y -= 0.5; // Float up
        
        if (popup.life <= 0) {
            popupsRef.current.splice(i, 1);
            continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, popup.life);
        ctx.fillStyle = '#f43f5e'; // Rose 500
        const scale = 1 + (1 - popup.life) * 0.5;
        const fontSize = 12 * Math.max(1, scale * 0.8);
        ctx.font = `bold ${fontSize}px monospace`;
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.fillText(`+${(popup.energy * 10).toFixed(2)} kJ`, popup.x, popup.y);
        ctx.restore();
    }
  }

  const hentikanSimulasi = () => {
    setIsReacting(false);
    if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
    }
    if (timeStepRef.current > 0) {
        setShowSummaryModal(true);
    }
  };

  const animate = (time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const delta = time - lastTimeRef.current;
    
    if (delta >= 1000) {
        setCollisionsPerSecond(collisionCountRef.current);
        
        timeStepRef.current += 1;
        totalCollisionsRef.current += effectiveCollisionCountRef.current;
        setRateHistory(prev => {
            const newHistory = [...prev, { 
                time: timeStepRef.current, 
                rate: lajuReaksiRef.current,
                simulatedRate: effectiveCollisionCountRef.current
            }];
            if (newHistory.length > 25) {
                return newHistory.slice(newHistory.length - 25);
            }
            return newHistory;
        });

        collisionCountRef.current = 0;
        effectiveCollisionCountRef.current = 0;
        lastTimeRef.current = time;

        if (durationRef.current > 0 && timeStepRef.current >= durationRef.current) {
            hentikanSimulasi();
            return;
        }
    }

    updateParticles();
    
    // Update KE Bar every ~100ms
    if (time - lastKeUpdateTimeRef.current > 100) {
        lastKeUpdateTimeRef.current = time;
        if (keBarRef.current && keTextRef.current && particlesRef.current.length > 0) {
            let totalSq = 0;
            for(let i=0; i < particlesRef.current.length; i++) {
               const p = particlesRef.current[i];
               totalSq += p.vx*p.vx + p.vy*p.vy + (p.vz !== undefined ? p.vz*p.vz : 0);
            }
            const avgSq = totalSq / particlesRef.current.length;
            const avgCollisionEnergy = avgSq * 2; // Approximated average relative collision energy

            const bahan = BAHAN_KIMIA.find(b => b.id === bahanRef.current) || BAHAN_KIMIA[0];
            const eaValue = katalisRef.current ? bahan.catEa : bahan.Ea;
            const eaThreshold = (eaValue / 50000) * 45.0;

            const ratio = Math.min(1, avgCollisionEnergy / eaThreshold);
            keBarRef.current.style.height = `${ratio * 100}%`;
            
            // Color mapping: Blue -> Amber -> Emerald (when it exceeds threshold)
            let color = '#3b82f6'; // Blue for cold/low energy
            if (ratio > 0.8 && ratio < 1) color = '#f59e0b'; // Amber when nearing threshold
            else if (ratio >= 1) color = '#10b981'; // Emerald when crossing

            keBarRef.current.style.backgroundColor = color;
            keTextRef.current.innerText = `${avgCollisionEnergy.toFixed(2)} / ${eaThreshold.toFixed(2)}`;
        }
    }
    
    drawParticles();
    animationRef.current = requestAnimationFrame(animate);
  }

  const jalankanReaksi = () => {
    initAudio();
    setIsReacting(true);
    if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
    }
    
    collisionCountRef.current = 0;
    effectiveCollisionCountRef.current = 0;
    setCollisionsPerSecond(0);
    lastTimeRef.current = performance.now();
    setRateHistory([]);
    timeStepRef.current = 0;
    totalCollisionsRef.current = 0;
    debrisRef.current = [];
    popupsRef.current = [];
    
    // Slight delay to allow layout shifts if any
    setTimeout(() => {
        initParticles();
        animationRef.current = requestAnimationFrame(animate);
    }, 50);
  };

  const resetSimulasi = () => {
    setIsReacting(false);
    if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
    }
    setCollisionsPerSecond(0);
    collisionCountRef.current = 0;
    effectiveCollisionCountRef.current = 0;
    particlesRef.current = [];
    setRateHistory([]);
    timeStepRef.current = 0;
    debrisRef.current = [];
    popupsRef.current = [];
    
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const unduhLaporan = () => {
    const bahan = BAHAN_KIMIA.find(b => b.id === bahanKimia) || BAHAN_KIMIA[0];
    const isKatalis = katalisRef.current;
    const eaUsed = isKatalis 
        ? (customEa !== null ? Math.max(1000, customEa - 20000) : bahan.catEa)
        : (customEa !== null ? customEa : bahan.Ea);

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("HASIL PRAKTIKUM LAJU REAKSI", 105, 20, { align: "center" });
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Reaksi: ${bahan.nama} - ${bahan.desc}`, 15, 35);
    doc.text(`Suhu: ${suhu} K`, 15, 42);
    doc.text(`Konsentrasi Awal: ${konsentrasi} M`, 15, 49);
    doc.text(`Katalis: ${isKatalis ? 'Aktif' : 'Tidak Aktif'}`, 15, 56);
    doc.text(`Energi Aktivasi (Ea): ${(eaUsed / 1000).toFixed(2)} kJ/mol`, 15, 63);

    doc.setFont("helvetica", "bold");
    doc.text("RINGKASAN HASIL:", 15, 75);
    doc.setFont("helvetica", "normal");
    doc.text(`Durasi Total: ${timeStepRef.current} s`, 15, 82);
    doc.text(`Tumbukan Efektif: ${totalCollisionsRef.current}`, 15, 89);
    
    const avgGalat = rateHistory.length > 0 ? rateHistory.reduce((acc, curr) => {
        const expected = hitungLajuReaksi(k_val, konsentrasi, 1, konsentrasi, ordoB);
        const actual = curr.rate;
        let g = Math.abs((actual - expected) / expected) * 100;
        if (isNaN(g) || !isFinite(g)) g = 0;
        return acc + g;
    }, 0) / rateHistory.length : 0;
    
    doc.text(`Rata-rata Galat: ${avgGalat.toFixed(2)}%`, 15, 96);
    doc.text(`Efisiensi Reaksi: ${Math.max(0, 100 - avgGalat).toFixed(2)}%`, 15, 103);

    doc.setFont("helvetica", "bold");
    doc.text("PENJELASAN PRAKTIKUM:", 15, 115);
    doc.setFont("helvetica", "normal");
    
    let yPos = 122;
    const splitExplanation = doc.splitTextToSize("Praktikum ini mensimulasikan teori tumbukan (collision theory) dalam kinetika kimia. Laju reaksi (M/s) sebanding dengan frekuensi tumbukan efektif antar partikel reaktan. Sebuah tumbukan dikatakan 'efektif' apabila partikel bertumbukan dengan energi kinetik yang lebih besar atau sama dengan Energi Aktivasi (Ea). Kenaikan suhu akan meningkatkan energi kinetik rata-rata partikel, sehingga lebih banyak tumbukan yang mampu melampaui Ea.", 180);
    doc.text(splitExplanation, 15, yPos);
    
    yPos += splitExplanation.length * 5 + 5;
    
    if (isKatalis) {
        const splitCatalyst = doc.splitTextToSize("Penambahan katalis terlihat menurunkan hambatan Energi Aktivasi (Ea), sehingga jumlah tumbukan efektif dan laju reaksi meningkat drastis dibandingkan tanpa katalis.", 180);
        doc.text(splitCatalyst, 15, yPos);
        yPos += splitCatalyst.length * 5 + 5;
    }

    doc.setFont("helvetica", "bold");
    doc.text("DATA TABULASI WAKTU vs LAJU:", 15, yPos + 5);
    
    const tableData = rateHistory.map(item => {
        const tRate = hitungLajuReaksi(k_val, konsentrasi, 1, konsentrasi, ordoB);
        return [
            item.time.toString(), 
            tRate.toExponential(3), 
            item.rate.toExponential(3)
        ];
    });

    autoTable(doc, {
        startY: yPos + 10,
        head: [['Waktu (s)', 'Laju Teoretis (M/s)', 'Laju Simulasi (M/s)']],
        body: tableData,
    });

    try {
        doc.save(`Hasil_Praktikum_Laju_Reaksi_${bahan.id}.pdf`);
    } catch (err) {
        // Fallback for iframe restrictions
        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        window.open(url, '_blank');
    }
  };

  const handleSendMessage = async (textOverride?: string | React.MouseEvent) => {
    const userMessage = typeof textOverride === 'string' ? textOverride : chatInput;
    if (!userMessage.trim()) return;

    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
        const historyForApi = chatHistory.slice(1).map(msg => ({
            role: msg.role === 'model' ? 'model' : 'user',
            parts: [{ text: msg.text }]
        }));

        const activeBahan = BAHAN_KIMIA.find(b => b.id === bahanKimia) || BAHAN_KIMIA[0];
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage, history: historyForApi, simulationState: { suhu, konsentrasi, katalis, lajuReaksi, bahanKimia: activeBahan.nama, ordoB, customEa, k_val } })
        });
        
        if (response.ok) {
            const data = await response.json();
             setChatHistory(prev => [...prev, { role: 'model', text: data.reply }]);
        } else {
             setChatHistory(prev => [...prev, { role: 'model', text: 'Maaf, terjadi kesalahan pada server.' }]);
        }

    } catch (e) {
         setChatHistory(prev => [...prev, { role: 'model', text: 'Maaf, koneksi gagal.' }]);
    } finally {
        setIsTyping(false);
    }
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 p-4 lg:p-6 font-sans text-slate-900 flex flex-col gap-4 overflow-y-auto select-none relative sm:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] sm:from-slate-50 sm:via-slate-100 sm:to-indigo-50/20">
        {/* Background ambient shapes */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10 translate-x-1/2 -translate-y-1/2 opacity-50"></div>
        <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10 -translate-x-1/2 translate-y-1/2 opacity-50"></div>
        
        {/* Header Section */}
        <header className="shrink-0 flex justify-between items-center bg-white/70 backdrop-blur-xl border border-slate-200/60 p-4 px-6 rounded-3xl shadow-lg shadow-slate-200/40 relative z-10 transition-all duration-300">
            <div id="header-title" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-inner">
                    <FlaskConical className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-800 leading-tight">Lab Kimia <span className="text-indigo-600">v2.4</span></h1>
                    <p className="text-xs text-slate-500 font-medium">Virtual Reaction Simulator</p>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <div id="menu-tabs" className="hidden lg:flex p-1 bg-slate-100 rounded-xl gap-1">
                    <button 
                      onClick={() => setActiveMenu('laju_reaksi')}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeMenu === 'laju_reaksi' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                    >
                      Laju Reaksi
                    </button>
                    <button 
                      onClick={() => setActiveMenu('redoks')}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeMenu === 'redoks' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                    >
                      Reaksi Redoks
                    </button>
                </div>
                
                <button
                    onClick={startTour}
                    className="hidden lg:flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold border border-indigo-200 hover:bg-indigo-100 transition-colors shadow-sm"
                >
                    <Compass className="w-4 h-4" /> Mulai Tur
                </button>

                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors active:scale-95"
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>
        </header>

        {isMobileMenuOpen && (
            <div className="lg:hidden bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col gap-3 shrink-0 animate-in fade-in slide-in-from-top-2">
                <button 
                  onClick={() => { setActiveMenu('laju_reaksi'); setIsMobileMenuOpen(false); }}
                  className={`flex items-center justify-between p-3 rounded-xl text-sm font-bold transition-all border ${activeMenu === 'laju_reaksi' ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm' : 'border-slate-100 text-slate-600 hover:bg-slate-50'}`}
                >
                  <span>Laju Reaksi</span>
                  {activeMenu === 'laju_reaksi' && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                </button>
                <button 
                  onClick={() => { setActiveMenu('redoks'); setIsMobileMenuOpen(false); }}
                  className={`flex items-center justify-between p-3 rounded-xl text-sm font-bold transition-all border ${activeMenu === 'redoks' ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm' : 'border-slate-100 text-slate-600 hover:bg-slate-50'}`}
                >
                  <span>Reaksi Redoks</span>
                  {activeMenu === 'redoks' && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                </button>
            </div>
        )}

        {activeMenu === 'laju_reaksi' ? (
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-6 gap-4 lg:min-h-[700px] relative z-10">
            {/* Left: Control Panel */}
            <section id="tour-control-panel" className="lg:col-span-3 lg:row-span-6 bg-white/70 backdrop-blur-xl border border-slate-200/60 p-6 rounded-3xl shadow-xl shadow-slate-200/40 flex flex-col gap-6 overflow-y-auto transition-all duration-300 hover:shadow-indigo-100/40">
                <div className="flex items-center justify-between mb-2 pb-4 border-b border-slate-100/50">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800">Control Panel</h2>
                    </div>
                    <button onClick={() => setShowSOP(true)} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-[10px] font-bold uppercase hover:bg-amber-100 transition-colors">
                        <ClipboardList className="w-3.5 h-3.5" /> SOP Alat
                    </button>
                </div>
                
                <div className="grid grid-cols-4 bg-slate-100 p-1.5 rounded-xl gap-1.5 border border-slate-200">
                    <button 
                        onClick={() => setActiveMobileControl('suhu')}
                        className={`py-2 px-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-1.5 transition-all ${activeMobileControl === 'suhu' ? 'bg-white text-amber-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:bg-white/50'}`}
                    >
                        <Thermometer className="w-4 h-4" /> Suhu
                    </button>
                    <button 
                        onClick={() => setActiveMobileControl('konsentrasi')}
                        className={`py-2 px-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-1.5 transition-all ${activeMobileControl === 'konsentrasi' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:bg-white/50'}`}
                    >
                        <FlaskConical className="w-4 h-4" /> Reaktan
                    </button>
                    <button 
                        onClick={() => setActiveMobileControl('katalis')}
                        className={`py-2 px-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-1.5 transition-all ${activeMobileControl === 'katalis' ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:bg-white/50'}`}
                    >
                        <Zap className="w-4 h-4" /> Katalis
                    </button>
                    <button 
                        onClick={() => setActiveMobileControl('ea')}
                        className={`py-2 px-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-1.5 transition-all ${activeMobileControl === 'ea' ? 'bg-white text-rose-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:bg-white/50'}`}
                    >
                        <TrendingUp className="w-4 h-4" /> Ea
                    </button>
                    <button 
                        onClick={() => setActiveMobileControl('waktu')}
                        className={`py-2 px-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-1.5 transition-all ${activeMobileControl === 'waktu' ? 'bg-white text-pink-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:bg-white/50'}`}
                    >
                        <Timer className="w-4 h-4" /> Waktu
                    </button>
                    <button 
                        onClick={() => setActiveMobileControl('ordo')}
                        className={`py-2 px-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-1.5 transition-all ${activeMobileControl === 'ordo' ? 'bg-white text-purple-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:bg-white/50'}`}
                    >
                        <Activity className="w-4 h-4" /> Ordo B
                    </button>
                    <button 
                        onClick={() => setActiveMobileControl('bahan')}
                        className={`py-2 px-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-1.5 transition-all ${activeMobileControl === 'bahan' ? 'bg-white text-indigo-500 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:bg-white/50'}`}
                    >
                        <FlaskConical className="w-4 h-4" /> Bahan
                    </button>
                    <button 
                        onClick={() => setActiveMobileControl('preset')}
                        className={`py-2 px-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-1.5 transition-all ${activeMobileControl === 'preset' ? 'bg-white text-cyan-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:bg-white/50'}`}
                    >
                        <Beaker className="w-4 h-4" /> Preset
                    </button>
                </div>
                
                <div className="space-y-8 flex-grow">
                    <div className={activeMobileControl === 'suhu' ? 'block space-y-3' : 'hidden'}>
                        <div className="flex justify-between items-end">
                            <label className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-500">
                                <Thermometer className="w-4 h-4 text-amber-500" /> Hot Plate (K)
                            </label>
                            <span className="font-mono font-bold text-lg text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">{suhu}K</span>
                        </div>
                        <input 
                            type="range" 
                            min="273" 
                            max="373" 
                            step="1"
                            value={suhu}
                            onChange={(e) => setSuhu(Number(e.target.value))}
                            className="w-full h-2.5 bg-slate-100 rounded-full appearance-none cursor-pointer border border-slate-200 accent-amber-500" 
                        />
                         <div className="flex justify-between text-xs font-medium text-slate-400 font-mono">
                            <span>200K (Batas Bawah)</span>
                            <span>1000K (Maks)</span>
                        </div>
                    </div>

                    <div className={activeMobileControl === 'konsentrasi' ? 'block space-y-3' : 'hidden'}>
                        <div className="flex justify-between items-end">
                            <label className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-500">
                                <FlaskConical className="w-4 h-4 text-indigo-500" /> Pipet Reaktan (M)
                            </label>
                            <span className="font-mono font-bold text-lg text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">{konsentrasi.toFixed(2)}M</span>
                        </div>
                         <input 
                            type="range" 
                            min="0.1" 
                            max="3.0" 
                            step="0.1" 
                            value={konsentrasi}
                            onChange={(e) => setKonsentrasi(Number(e.target.value))}
                            className="w-full h-2.5 bg-slate-100 rounded-full appearance-none cursor-pointer border border-slate-200 accent-indigo-600" 
                        />
                         <div className="flex justify-between text-xs font-medium text-slate-400 font-mono">
                            <span>0.1M</span>
                            <span>2.0M</span>
                        </div>
                        {activeBahanData.kalkulasi && (
                            <div className="text-[11px] bg-slate-50 border border-slate-200 text-slate-600 px-3 py-2 rounded-lg leading-relaxed flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1 shrink-0"></span>
                                <div><strong className="text-slate-800">Dibutuhkan:</strong> {activeBahanData.kalkulasi(konsentrasi)}</div>
                            </div>
                        )}
                    </div>

                    <div className={activeMobileControl === 'katalis' ? 'block space-y-3 pt-2' : 'hidden'}>
                        <div className="flex justify-between items-center">
                            <label className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-500">
                                <Zap className="w-4 h-4 text-emerald-500" /> Serbuk Katalis
                            </label>
                            <span className={`font-mono text-[10px] font-bold px-2 py-1 rounded-md border ${katalis ? 'border-emerald-200 text-emerald-600 bg-emerald-50' : 'border-slate-200 text-slate-400 bg-slate-50'}`}>
                                {katalis ? 'AKTIF' : 'NON-AKTIF'}
                            </span>
                        </div>
                        <button 
                            onClick={() => setKatalis(!katalis)}
                            className={`w-full h-11 border transition-all font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] ${katalis ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 shadow-sm' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}
                        >
                            {katalis ? 'Matikan Katalis' : 'Gunakan Katalis'}
                        </button>
                    </div>

                    <div className={activeMobileControl === 'ea' ? 'block space-y-3 pt-2' : 'hidden'}>
                        <div className="flex justify-between items-end">
                            <label className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-500">
                                <TrendingUp className="w-4 h-4 text-rose-500" /> Energi Aktivasi (Ea)
                            </label>
                            <span className="font-mono font-bold text-lg text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100">{((customEa !== null ? customEa : activeBahanData.Ea) / 1000).toFixed(2)} kJ</span>
                        </div>
                        <input 
                            type="range" 
                            min="20000" 
                            max="100000" 
                            step="1000" 
                            value={customEa !== null ? customEa : activeBahanData.Ea} 
                            onChange={(e) => setCustomEa(Number(e.target.value))}
                            disabled={isReacting}
                            className="w-full h-2.5 bg-slate-100 rounded-full appearance-none cursor-pointer border border-slate-200 accent-rose-500 disabled:opacity-50" 
                        />
                         <div className="flex justify-between text-xs font-medium text-slate-400 font-mono">
                            <span>20 kJ (Min)</span>
                            <span>100 kJ (Maks)</span>
                        </div>
                        <button 
                            disabled={isReacting || customEa === null}
                            onClick={() => setCustomEa(null)}
                            className="w-full py-2 border rounded-xl font-bold uppercase text-[10px] text-slate-500 hover:bg-slate-50 disabled:opacity-50 mt-1"
                        >
                            Reset ke Default Bahan ({ (activeBahanData.Ea / 1000).toFixed(2) } kJ)
                        </button>
                    </div>

                    <div className={activeMobileControl === 'waktu' ? 'block space-y-3 pt-2' : 'hidden'}>
                        <div className="flex justify-between items-end">
                            <label className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-500">
                                <Timer className="w-4 h-4 text-pink-500" /> Durasi Simulasi (s)
                            </label>
                            <span className="font-mono font-bold text-lg text-pink-600 bg-pink-50 px-2 py-0.5 rounded-lg border border-pink-100">{durasi === 0 ? '∞' : `${durasi}s`}</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="60" 
                            step="1" 
                            value={durasi} 
                            onChange={(e) => setDurasi(Number(e.target.value))}
                            disabled={isReacting}
                            className="w-full h-2.5 bg-slate-100 rounded-full appearance-none cursor-pointer border border-slate-200 accent-pink-500 disabled:opacity-50" 
                        />
                         <div className="flex justify-between text-xs font-medium text-slate-400 font-mono">
                            <span>0s (Tanpa Batas)</span>
                            <span>60s (Maks)</span>
                        </div>
                    </div>

                    <div className={activeMobileControl === 'ordo' ? 'block space-y-3 pt-2' : 'hidden'}>
                        <div className="flex justify-between items-center">
                            <label className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-500">
                                <Activity className="w-4 h-4 text-purple-500" /> Ordo Reaktan B
                            </label>
                            <span className="font-mono text-[10px] font-bold px-2 py-1 rounded-md border border-slate-200 text-slate-500 bg-slate-50">
                                ORDO {ordoB}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-1">
                            {[0, 1, 2].map(val => (
                                <button
                                    key={`ordo-${val}`}
                                    onClick={() => setOrdoB(val)}
                                    className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${
                                        ordoB === val 
                                        ? 'bg-purple-50 text-purple-600 border-purple-200 shadow-sm' 
                                        : 'bg-white text-slate-500 border-slate-200 hover:border-purple-300'
                                    }`}
                                >
                                    Ordo {val}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={activeMobileControl === 'bahan' ? 'block space-y-3 pt-4 border-t border-slate-100' : 'hidden'}>
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-500 mb-2">
                            <FlaskConical className="w-4 h-4 text-indigo-500" /> Bahan Kimia
                        </div>
                        <div className="flex flex-col gap-2">
                            {BAHAN_KIMIA.map(bahan => (
                                <button 
                                    key={bahan.id}
                                    onClick={() => {
                                        setBahanKimia(bahan.id);
                                        setCustomEa(null);
                                        setShowSOP(true);
                                    }}
                                    className={`w-full text-left p-2.5 rounded-xl border transition-all group ${
                                        bahanKimia === bahan.id 
                                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm' 
                                        : 'bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className={`text-xs font-bold ${bahanKimia === bahan.id ? 'text-indigo-700' : 'text-slate-700 group-hover:text-indigo-600'}`}>{bahan.nama}</div>
                                        {bahan.symbols && (
                                            <div className="flex items-center gap-1">
                                                {bahan.symbols.map((sym: string, i: number) => <React.Fragment key={i}>{getSafetyIcon(sym)}</React.Fragment>)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-[10px] text-slate-500 mt-0.5">{bahan.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={activeMobileControl === 'preset' ? 'block space-y-3 pt-4 border-t border-slate-100' : 'hidden'}>
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-500 mb-2">
                            <Beaker className="w-4 h-4 text-cyan-500" /> Eksperimen Cepat
                        </div>
                        <div className="flex flex-col gap-2">
                            <button 
                                onClick={() => { setSuhu(298); setKonsentrasi(0.5); setKatalis(false); setOrdoB(0); setBahanKimia('Na2S2O3'); setCustomEa(null); }}
                                className="w-full text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-cyan-50 hover:border-cyan-200 hover:text-cyan-700 transition-all group"
                            >
                                <div className="text-xs font-bold text-slate-700 group-hover:text-cyan-700">Lambat (Natrium Tiosulfat)</div>
                                <div className="text-[10px] text-slate-500 font-mono mt-1">298K | 0.5M | No Cat | Ordo 0</div>
                            </button>
                            <button 
                                onClick={() => { setSuhu(323); setKonsentrasi(1.5); setKatalis(true); setOrdoB(1); setBahanKimia('H2O2'); setCustomEa(null); }}
                                className="w-full text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 transition-all group"
                            >
                                <div className="text-xs font-bold text-slate-700 group-hover:text-orange-700">Dekomposisi Cepat H₂O₂</div>
                                <div className="text-[10px] text-slate-500 font-mono mt-1">323K | 1.5M | +Catalyst | Ordo 1</div>
                            </button>
                            <button 
                                onClick={() => { setSuhu(343); setKonsentrasi(1.0); setKatalis(true); setOrdoB(2); setBahanKimia('KMnO4'); setCustomEa(null); }}
                                className="w-full text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all group"
                            >
                                <div className="text-xs font-bold text-slate-700 group-hover:text-emerald-700">Autokatalitik (KMnO₄)</div>
                                <div className="text-[10px] text-slate-500 font-mono mt-1">343K | 1.0M | +Catalyst | Ordo 2</div>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-slate-100">
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
                    <div className="flex gap-2">
                        <button 
                            disabled={!isApdComplete}
                            onClick={jalankanReaksi}
                            className={`${isApdComplete ? 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg hover:-translate-y-0.5' : 'bg-slate-200 text-slate-400 cursor-not-allowed'} flex flex-1 items-center justify-center gap-2 font-bold py-3.5 rounded-xl transition-all shadow-md active:translate-y-0 active:scale-[0.98] uppercase tracking-wide text-sm`}
                        >
                            <Play className="w-5 h-5 fill-current" />
                            {isReacting ? 'Ulang' : 'Mulai Reaksi'}
                        </button>
                        {isReacting && (
                            <button
                                onClick={hentikanSimulasi}
                                className="bg-rose-500 hover:bg-rose-600 flex flex-1 items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] uppercase tracking-wide text-sm"
                            >
                                <Square className="w-4 h-4 fill-current" />
                                Stop
                            </button>
                        )}
                    </div>
                    <button 
                        onClick={resetSimulasi}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] uppercase tracking-wide text-sm"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset Simulasi
                    </button>
                </div>
            </section>

            {/* Center: Simulation View */}
            <section id="tour-simulation-view" className="lg:col-span-6 lg:row-span-4 bg-[#0f172a] border border-slate-800/80 rounded-3xl shadow-[inset_0_2px_20px_rgba(0,0,0,0.5),0_10px_30px_rgba(0,0,0,0.15)] flex flex-col min-h-[300px] relative overflow-hidden group hover:ring-1 hover:ring-indigo-500/30 transition-all duration-500">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
                
                {/* Waktu Overlay & 3D button */}
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                    <button 
                        onClick={() => setIs3D(!is3D)}
                        className={`border rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs font-mono font-bold shadow-lg transition-colors ${is3D ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800/80 border-slate-700/50 text-slate-300 backdrop-blur-md hover:bg-slate-700/80'}`}
                    >
                        3D View
                    </button>
                    {(isReacting || rateHistory.length > 0) && (
                    <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs font-mono font-bold text-slate-300 shadow-lg animate-in fade-in duration-500">
                        <Timer className="w-3.5 h-3.5 text-pink-400" />
                        <span>{rateHistory.length > 0 ? rateHistory[rateHistory.length - 1].time : 0}s {durasi > 0 && <span className="text-slate-500 font-normal">/ {durasi}s</span>}</span>
                    </div>
                    )}
                </div>

                <div className="w-full h-full flex items-center justify-center relative">
                    <div 
                        className={`absolute bottom-0 inset-x-0 w-full rounded-2xl transition-all duration-[2000ms] ease-in-out z-0`}
                        style={{
                            height: isReacting || rateHistory.length > 0 ? '100%' : '0%',
                            opacity: isReacting || rateHistory.length > 0 ? 0.3 : 0,
                            background: `linear-gradient(to top, ${activeBahanData.colorA}, transparent)`
                        }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-pulse border-t border-white/40"></div>
                        <div className="absolute inset-0 overflow-hidden rounded-2xl">
                            <div className="absolute bottom-0 left-0 w-[200%] h-12 bg-gradient-to-t from-transparent to-white/10 opacity-50 animate-[wave_4s_linear_infinite] [mask-image:linear-gradient(to_bottom,black,transparent)]"></div>
                        </div>
                    </div>

                    {/* Falling Powder (Serbuk Padatan) */}
                    {(isReacting || rateHistory.length > 0) && (
                        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-10">
                            {Array.from({ length: 40 }).map((_, i) => (
                                <div
                                    key={`powder-${i}`}
                                    className="absolute bottom-0 opacity-0 bg-slate-600 rounded-sm"
                                    style={{
                                        left: `${10 + Math.random() * 80}%`,
                                        width: `${Math.random() * 4 + 2}px`,
                                        height: `${Math.random() * 4 + 2}px`,
                                        bottom: `${Math.random() * 15 + 5}px`,
                                        animation: `fall 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${Math.random() * 0.5}s forwards${isReacting ? `, dissolve 4s ease-in ${1 + Math.random() * 8}s forwards` : ''}`
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    <canvas 
                        ref={canvasRef} 

                        className={`w-full h-full object-cover z-0 rounded-2xl transition-opacity ${is3D ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    />
                    
                    {is3D && (
                        <div className="absolute inset-0 z-0">
                            <Particles3D 
                                particlesRef={particlesRef} 
                                debrisRef={debrisRef}
                                popupsRef={popupsRef}
                                width={canvasRef.current?.width || 500} 
                                height={canvasRef.current?.height || 300} 
                                autoRotate={autoRotate3D}
                            />
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700 shadow-xl z-30 animate-in slide-in-from-bottom-4">
                                <div className="flex items-center gap-2 text-xs font-mono text-slate-300 border-r border-slate-600 pr-3">
                                    <MousePointer2 className="w-3.5 h-3.5 text-indigo-400" />
                                    <span>Drag: Rotate • Scroll: Zoom</span>
                                </div>
                                <button
                                    onClick={() => setAutoRotate3D(!autoRotate3D)}
                                    className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md transition-colors ${autoRotate3D ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                                >
                                    <Rotate3D className={`w-3.5 h-3.5 ${autoRotate3D ? 'animate-spin-slow' : ''}`} />
                                    Auto
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {(!isReacting && rateHistory.length === 0) && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 font-mono bg-slate-900/60 z-10 transition-opacity rounded-2xl backdrop-blur-sm">
                            <p className="text-sm px-6 py-3 rounded-xl border border-slate-700 bg-slate-800/80 shadow-xl flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-slate-500 animate-pulse"></span>
                                WAITING_FOR_INPUT
                            </p>
                        </div>
                    )}

                    {/* pH Indicator & KE Bar */}
                    {(isReacting || rateHistory.length > 0) && (
                    <div className="absolute bottom-5 left-5 z-20 flex items-end gap-3 animate-in fade-in zoom-in-95 duration-500">
                        {/* pH part */}
                        <div className="flex items-end gap-2 group/ph">
                            <div className={`p-0.5 rounded-lg bg-gradient-to-br shadow-lg flex flex-col items-center justify-center transition-all duration-500 border border-white/20 hover:scale-105 cursor-default ${getPHColor(currentPH)}`}>
                                <div className="px-2 py-1.5 flex flex-col items-center justify-center min-w-[36px]">
                                    <span className="text-[9px] font-bold opacity-80 mb-0.5">pH</span>
                                    <span className="font-mono text-sm font-black tracking-tighter leading-none">{currentPH.toFixed(2)}</span>
                                </div>
                            </div>
                            {/* Tooltip on Hover */}
                            <div className="mb-1 pointer-events-none opacity-0 group-hover/ph:opacity-100 transition-opacity bg-slate-900/80 backdrop-blur-md px-2 py-1.5 rounded-md border border-slate-700/50 flex flex-col">
                                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-none mb-1">Tingkat Keasaman</span>
                                <span className="text-[10px] text-slate-400 leading-tight">Berubah dipengaruhi oleh<br/>jenis bahan & konsentrasi</span>
                            </div>
                        </div>

                        {/* KE Bar part */}
                        <div className="flex items-end gap-2 group/ke">
                            <div className="h-[46px] w-4 bg-slate-800/80 rounded border border-slate-700 overflow-hidden relative flex flex-col justify-end shadow-lg transition-transform hover:scale-105">
                                <div ref={keBarRef} className="w-full bg-blue-500 transition-all duration-100 ease-linear shadow-[0_0_8px_rgba(59,130,246,0.6)]" style={{ height: '0%' }}></div>
                            </div>
                            <div className="mb-1 pointer-events-none opacity-0 group-hover/ke:opacity-100 transition-opacity bg-slate-900/80 backdrop-blur-md px-2 py-1.5 rounded-md border border-slate-700/50 flex flex-col min-w-[100px]">
                                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-none mb-1">Kinetic Energy vs Ea</span>
                                <span ref={keTextRef} className="text-[10px] text-emerald-400 font-mono tracking-tighter shadow-sm">0.0 / 0.0</span>
                            </div>
                        </div>
                    </div>
                    )}

                    {/* Overlay Stats */}
                    {(isReacting || rateHistory.length > 0) && (
                    <div className="absolute top-5 left-5 font-mono text-[10px] text-emerald-400 space-y-1.5 pointer-events-none z-20 bg-slate-900/40 p-3 rounded-lg backdrop-blur-md border border-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity animate-in fade-in duration-500">
                        <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>{`STATE: ${isReacting ? 'ACTIVE' : 'IDLE'}`}</p>
                        <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>{`Ea   : ${((katalis ? (customEa !== null ? Math.max(1000, customEa - 20000) : activeBahanData.catEa) : (customEa !== null ? customEa : activeBahanData.Ea)) / 1000).toFixed(2)} kJ/mol`}</p>
                        <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>{`k    : ${k_val.toExponential(2)}`}</p>
                        <p className="flex items-center gap-2 text-amber-300 font-bold"><span className="w-1.5 h-1.5 rounded-full bg-amber-300"></span>{`RATE : ${lajuReaksi.toExponential(3)} M/s`}</p>
                        <p className="flex items-center gap-2 text-cyan-400 font-bold"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>{`COLL : ${collisionsPerSecond} /s`}</p>
                        {katalis && <p className="text-emerald-400 font-bold mt-2 pt-2 border-t border-emerald-900/50">✓ CATALYST ENGAGED</p>}
                    </div>
                    )}
                </div>
            </section>

            {/* Bottom Center Left: Energy Graph */}
            <section id="tour-chart-energy" className="lg:col-span-2 lg:row-span-2 bg-white/70 backdrop-blur-xl border border-slate-200/60 p-5 rounded-3xl shadow-lg shadow-slate-200/40 flex flex-col min-h-[150px] relative transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100/40 hover:-translate-y-0.5">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Grafik Energi
                    </h3>
                    <motion.div 
                        layout
                        className="text-[10px] font-mono font-bold flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200/60 shadow-sm overflow-hidden"
                    >
                        <span className="text-slate-400 capitalize whitespace-nowrap">Ea Saat Ini:</span>
                        <AnimatePresence mode="popLayout">
                            {katalis && (
                                <motion.span 
                                    initial={{ opacity: 0, width: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, width: "auto", scale: 1 }}
                                    exit={{ opacity: 0, width: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-slate-400 line-through text-[9px] origin-right"
                                >
                                    {activeBahanData.Ea / 1000}
                                </motion.span>
                            )}
                        </AnimatePresence>
                        <motion.span 
                            key={katalis ? 'cat' : 'no-cat'}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={katalis ? "text-emerald-600" : "text-slate-700"}
                        >
                            {katalis ? activeBahanData.catEa / 1000 : activeBahanData.Ea / 1000} kJ/mol
                        </motion.span>
                    </motion.div>
                </div>
                <div className="flex-1 relative flex items-end ml-4 mb-4">
                    {/* Y-Axis Label */}
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Energi</div>
                    
                    {/* X-Axis Label */}
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Jalan Reaksi</div>

                    {/* Chart Area */}
                    <div className="w-full h-full border-l border-b border-slate-200 relative">
                        <svg className="absolute inset-0 w-full h-full overflow-visible drop-shadow-md" viewBox="0 0 100 50" preserveAspectRatio="none">
                            {/* Reference Path (Without Catalyst) */}
                            <path 
                                d="M 0 35 C 20 35, 30 5, 50 5 C 70 5, 80 25, 100 25" 
                                fill="none" 
                                stroke="#cbd5e1" 
                                strokeWidth="2" 
                                strokeDasharray="4 4" 
                            />
                            {/* Active Path (Changes with Catalyst) */}
                            <motion.path 
                                animate={{
                                    d: `M 0 35 C 20 35, 30 ${katalis ? 20 : 5}, 50 ${katalis ? 20 : 5} C 70 ${katalis ? 20 : 5}, 80 25, 100 25`,
                                    stroke: katalis ? "#10b981" : "#4f46e5"
                                }}
                                transition={{ duration: 0.7, ease: "easeOut" }}
                                fill="none" 
                                strokeWidth="3" 
                                strokeLinecap="round"
                            />
                        </svg>
                        
                        {/* Graph Labels */}
                        <motion.div 
                            className="absolute left-[50%] -translate-x-1/2 pointer-events-none text-center"
                            animate={{
                                top: katalis ? "25%" : "10%"
                            }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            style={{ translateY: "-50%" }}
                        >
                            <span className="text-[9px] font-bold text-slate-500 bg-white/80 px-1 backdrop-blur-sm rounded block">Kompleks</span>
                            <AnimatePresence>
                                {katalis && (
                                    <motion.span 
                                        initial={{ opacity: 0, scale: 0.8, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                        className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100 mt-1 shadow-sm inline-flex items-center gap-1"
                                    >
                                        ↓ Ea Turun
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.div>
                        <div className="absolute bottom-[40%] right-2 text-[9px] font-bold text-slate-500 bg-white/80 px-1 backdrop-blur-sm rounded pointer-events-none">Produk</div>
                        <div className="absolute top-[60%] left-2 text-[9px] font-bold text-slate-500 bg-white/80 px-1 backdrop-blur-sm rounded pointer-events-none">Reaktan</div>
                    </div>
                </div>
            </section>

            {/* Bottom Center Right: Rate Time Chart */}
            <section id="tour-chart-rate" className="lg:col-span-2 lg:row-span-2 bg-white/70 backdrop-blur-xl border border-slate-200/60 p-5 rounded-3xl shadow-lg shadow-slate-200/40 flex flex-col min-h-[150px] relative transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100/40 hover:-translate-y-0.5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-amber-500" /> Laju Reaksi (v)
                    </h3>
                    <div className="flex items-center gap-3">
                        {isReacting && processedHistory.length > 1 && (
                            <div className="flex flex-col items-end" title="Persentase Galat Simulasi Stokastik thd Teori">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Persentase Galat</span>
                                <span className={`text-sm font-mono font-bold ${galatPercentage > 20 ? 'text-red-500' : galatPercentage > 10 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                    ±{galatPercentage.toFixed(2)}%
                                </span>
                            </div>
                        )}
                        <button 
                            onClick={() => setShowDataModal(true)} 
                            className="bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 p-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                            title="Tampilkan Data Hasil Praktikum"
                        >
                            <Table className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Data</span>
                        </button>
                    </div>
                </div>
                <div className="flex-1 w-full h-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={processedHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis 
                                dataKey="time" 
                                type="number"
                                domain={['dataMin', 'dataMax']}
                                tick={{ fontSize: 9, fill: '#94a3b8' }} 
                                tickLine={false} 
                                axisLine={{ stroke: '#cbd5e1' }}
                                tickFormatter={(val) => `${val}s`}
                            />
                            <YAxis 
                                yAxisId="left"
                                label={{ value: 'Teoretis (M/s)', angle: -90, position: 'insideLeft', fontSize: 9, fill: '#94a3b8' }}
                                tick={{ fontSize: 9, fill: '#94a3b8' }} 
                                tickLine={false} 
                                axisLine={{ stroke: '#cbd5e1' }}
                                tickFormatter={(val) => val.toExponential(1)}
                            />
                            <YAxis 
                                yAxisId="right" orientation="right"
                                label={{ value: 'Simulasi (Reaksi/s)', angle: 90, position: 'insideRight', fontSize: 9, fill: '#10b981' }}
                                tick={{ fontSize: 9, fill: '#10b981' }} 
                                tickLine={false} 
                                axisLine={{ stroke: '#cbd5e1' }}
                            />
                            <Tooltip 
                                labelFormatter={(val) => `Waktu: ${val}s`}
                                contentStyle={{ borderRadius: '8px', fontSize: '11px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                                formatter={(val: number, name: string) => {
                                    if (name === 'rate') return [val.toExponential(3) + ' M/s', 'Teoretis'];
                                    return [val + ' /s', 'Simulasi'];
                                }}
                            />
                            <Legend wrapperStyle={{ fontSize: '10px' }} />
                            <Line 
                                yAxisId="left"
                                type="monotone" 
                                dataKey="rate" 
                                name="Teoretis"
                                stroke="#f59e0b" 
                                strokeWidth={2}
                                dot={<AnomalyDot />}
                                isAnimationActive={false}
                            />
                            <Line 
                                yAxisId="right"
                                type="monotone" 
                                dataKey="simulatedRate" 
                                name="Simulasi"
                                stroke="#10b981" 
                                strokeWidth={2}
                                dot={<AnomalyDot />}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* Bottom Center Right 2: Rate vs Temp Chart */}
            <section id="tour-chart-temp" className="lg:col-span-2 lg:row-span-2 bg-white/70 backdrop-blur-xl border border-slate-200/60 p-5 rounded-3xl shadow-lg shadow-slate-200/40 flex flex-col min-h-[150px] relative transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100/40 hover:-translate-y-0.5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-rose-500" /> Korelasi Suhu & Laju
                    </h3>
                </div>
                <div className="flex gap-3 text-[9px] font-bold uppercase tracking-widest text-slate-400 z-10 px-1">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Teori</span>
                    {(isReacting || rateHistory.length > 0) && (
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-600"></span> Simulasi</span>
                    )}
                </div>
                <div className="absolute inset-0 top-16 left-2 pb-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={temperatureRateData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis 
                                dataKey="suhu" 
                                type="number"
                                domain={['dataMin - 5', 'dataMax + 5']}
                                tick={{ fontSize: 10, fill: '#64748B' }} 
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis 
                                tickFormatter={(val) => val.toExponential(1)}
                                tick={{ fontSize: 10, fill: '#64748B' }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip 
                                labelFormatter={(val) => `${val} K`}
                                formatter={(val: number) => [val.toExponential(3) + ' M/s', 'Laju Teoretis']}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="laju" 
                                stroke="#f43f5e" 
                                strokeWidth={2}
                                dot={false}
                                isAnimationActive={false}
                            />
                            <ReferenceDot x={suhu} y={lajuReaksi} r={4} fill="#f43f5e" stroke="#fff" strokeWidth={2} />
                            {(isReacting || rateHistory.length > 0) && rateHistory.length > 0 && (
                                <ReferenceDot 
                                    x={suhu} 
                                    y={rateHistory[rateHistory.length - 1].rate} 
                                    r={5} 
                                    fill="#4f46e5" 
                                    stroke="#fff" 
                                    strokeWidth={2} 
                                />
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* Right: ChemBot Assistant */}
            <section id="tour-chembot" className="lg:col-span-3 lg:row-span-6 bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/40 flex flex-col min-h-[400px] overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-100/50">
                <div className="flex items-center gap-3 p-5 shrink-0 border-b border-slate-100/50 bg-gradient-to-r from-indigo-50/30 to-white/30 backdrop-blur-sm">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center border border-indigo-200">
                        <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-800">Sandra (Asisten Virtual)</h2>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[10px] font-medium text-slate-500 uppercase">Online</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex-1 space-y-4 overflow-y-auto p-5 pb-4">
                    {chatHistory.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`text-[12px] leading-relaxed p-3.5 max-w-[90%] ${
                                msg.role === 'user' 
                                ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm shadow-sm' 
                                : 'bg-slate-100 text-slate-800 rounded-2xl rounded-tl-sm border border-slate-200 shadow-sm'
                            }`}>
                                {msg.role === 'model' ? (
                                    <div className="prose prose-sm prose-slate max-w-none prose-p:my-1 prose-a:text-indigo-600 font-sans text-xs">
                                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                                    </div>
                                ) : (
                                    msg.text
                                )}
                            </div>
                        </div>
                    ))}
                    
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-slate-100 border border-slate-200 p-3.5 rounded-2xl rounded-tl-sm shadow-sm">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={chatBottomRef} />
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-col gap-3">
                    <div className="flex flex-col gap-2 pb-1">
                        <button onClick={() => handleSendMessage("Mohon analisis pengaruh suhu terhadap laju reaksi saat ini.")} className="w-full text-left px-3 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-colors shadow-sm">🔥 Efek Suhu</button>
                        <button onClick={() => handleSendMessage("Tolong jelaskan secara mendalam fungsi spesifik katalis pada grafik energi di atas.")} className="w-full text-left px-3 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 transition-colors shadow-sm">⚡ Fungsi Katalis</button>
                        <button onClick={() => handleSendMessage("Berdasarkan angka k dan v saat ini, apa kesimpulan konkrit yang bisa ditarik?")} className="w-full text-left px-3 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors shadow-sm">📊 Analisis Data</button>
                    </div>
                    <div className="relative flex items-center bg-white rounded-xl shadow-sm border border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all overflow-hidden">
                        <input 
                            type="text" 
                            value={chatInput}
                            onChange={e => setChatInput(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            placeholder="Tanya Asisten..." 
                            className="w-full p-3 pl-4 text-sm focus:outline-none placeholder:text-slate-400"
                        />
                        <button 
                            onClick={handleSendMessage}
                            disabled={!chatInput.trim() || isTyping}
                            className="p-2 mr-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </section>

            {/* View Alat & Bahan (Full Width / Row 7) */}
            <section className="lg:col-span-12 bg-white/70 backdrop-blur-xl border border-slate-200/60 p-6 rounded-3xl shadow-xl shadow-slate-200/40 relative flex flex-col mt-4 lg:mt-0">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Beaker className="w-4 h-4 text-indigo-500" /> Alat & Bahan Praktikum
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4">Alat Tersedia</h4>
                        <ul className="text-[12px] text-slate-600 space-y-2.5 font-medium">
                            {activeBahanData.alat.map((alatItem, idx) => (
                                <ExpandableAlat key={idx} alatItem={alatItem} />
                            ))}
                        </ul>
                    </div>
                    
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Bahan Kimia</h4>
                            <button 
                                onClick={() => setShowSOP(true)}
                                className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-100/50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                <ShieldAlert className="w-3 h-3" />
                                Safety Brief
                            </button>
                        </div>
                        <ul className="text-[12px] text-slate-600 space-y-2.5 font-medium">
                            {activeBahanData.bahan.map((bahanItem, idx) => (
                                <ExpandableBahan key={idx} bahanItem={bahanItem} />
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
        </main>
        ) : (
            <RedoxSimulation />
        )}

        {showSummaryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
                <div className="bg-slate-900 px-6 py-6 flex flex-col items-center justify-center text-center shrink-0 relative overflow-hidden">
                    <button 
                        onClick={() => setShowSummaryModal(false)}
                        className="absolute top-4 right-4 z-20 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 p-2 rounded-full transition-colors"
                        title="Tutup"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <CheckCircle2 className="w-32 h-32 text-indigo-100" />
                    </div>
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/50 mb-4 z-10 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-widest z-10">Simulasi Selesai</h2>
                    <p className="text-sm text-slate-300 font-medium z-10 mt-1">Ringkasan Hasil Praktikum</p>
                </div>
                
                <div className="p-6 bg-slate-50 flex flex-col gap-4 overflow-y-auto">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                                <Timer className="w-5 h-5 text-pink-600" />
                            </div>
                            <span className="text-sm font-bold text-slate-700 uppercase">Durasi Total</span>
                        </div>
                        <span className="text-xl font-black text-slate-900 font-mono">{timeStepRef.current}s</span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                                <Activity className="w-5 h-5 text-cyan-600" />
                            </div>
                            <span className="text-sm font-bold text-slate-700 uppercase">Tumbukan Efektif</span>
                        </div>
                        <span className="text-xl font-black text-slate-900 font-mono">{totalCollisionsRef.current}</span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-amber-600" />
                            </div>
                            <span className="text-sm font-bold text-slate-700 uppercase">Efisiensi Reaksi</span>
                        </div>
                        <span className="text-xl font-black text-slate-900 font-mono pl-3">{Math.max(0, 100 - galatPercentage).toFixed(2)}%</span>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl mt-1 text-left">
                        <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                            <span className="font-bold flex items-center gap-1.5 mb-1"><CheckCircle2 className="w-4 h-4" /> Kesimpulan Eksperimen</span>
                            Berdasarkan simulasi ini, Anda dapat melihat bahwa laju reaksi sangat bergantung pada frekuensi <strong>tumbukan efektif</strong>. Semakin sering partikel bertumbukan dengan energi yang melampaui hambatan aktivasi, semakin cepat produk terbentuk.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                        <button 
                            onClick={unduhLaporan}
                            className="w-full py-3.5 bg-white border border-indigo-200 hover:border-indigo-600 hover:bg-indigo-50 text-indigo-700 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2 text-sm"
                        >
                            <ClipboardList className="w-4 h-4" />
                            Unduh Laporan PDF
                        </button>
                        <button 
                            onClick={() => setShowSummaryModal(false)}
                            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold uppercase tracking-wider transition-colors shadow-lg shadow-indigo-200 text-sm"
                        >
                            Tutup & Lanjutkan Analisis
                        </button>
                    </div>
                </div>
            </div>
        </div>
        )}

        {showDataModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="bg-slate-900 px-6 py-5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
                            <Table className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-wider">Hasil Praktikum</h2>
                            <p className="text-sm text-slate-400 font-medium">Data Laju Reaksi: Teori vs Praktik</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={unduhLaporan}
                            className="px-4 py-2 flex items-center gap-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors"
                        >
                            <ClipboardList className="w-4 h-4" />
                            Unduh PDF
                        </button>
                        <button 
                            onClick={() => setShowDataModal(false)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
                
                <div className="flex-1 overflow-auto p-6 bg-slate-50">
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-100/50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                                        <th className="px-4 py-3 font-bold">Waktu (s)</th>
                                        <th className="px-4 py-3 font-bold">Laju Teoretis (M/s)</th>
                                        <th className="px-4 py-3 font-bold">Laju Simulasi (M/s)</th>
                                        <th className="px-4 py-3 font-bold">Galat (%)</th>
                                        <th className="px-4 py-3 font-bold">Keterangan</th>
                                    </tr>
                                </thead>
                                <tbody className="text-xs font-mono text-slate-600 divide-y divide-slate-100">
                                    {processedHistory.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-slate-400 font-sans">
                                                Belum ada data praktikum. Silakan mulai reaksi.
                                            </td>
                                        </tr>
                                    ) : (
                                        processedHistory.map((row, i) => {
                                            const error = row.rate > 0 ? (Math.abs(row.simulatedRate - row.rate) / row.rate * 100) : 0;
                                            return (
                                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-4 py-3 font-bold text-slate-700">{row.time}</td>
                                                    <td className="px-4 py-3 text-emerald-600">{row.rate.toExponential(3)}</td>
                                                    <td className="px-4 py-3 text-indigo-600">{row.simulatedRate.toExponential(3)}</td>
                                                    <td className={`px-4 py-3 font-bold ${error > 20 ? 'text-red-500' : error > 10 ? 'text-amber-500' : 'text-slate-500'}`}>
                                                        {error.toFixed(2)}%
                                                    </td>
                                                    <td className="px-4 py-3 text-xs font-sans text-slate-500">
                                                        {row.isSimRateAnomaly ? (
                                                            <span className="text-red-500 flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> Anomali Simulasi</span>
                                                        ) : (
                                                            <span className="text-emerald-500 flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> Normal</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )}

        {showSOP && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="bg-slate-900 px-6 py-5 flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
                        <ShieldAlert className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold tracking-tight text-white leading-tight">Panduan Keselamatan Kerja & SOP Laboratorium</h2>
                        <p className="text-xs text-slate-400 font-medium">Harap pahami seluruh panduan keselamatan dan prosedur di bawah ini sebelum memulai eksperimen.</p>
                    </div>
                </div>
                
                <div className="p-6 overflow-y-auto space-y-8 flex-1">
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 animate-in fade-in slide-in-from-bottom-4">
                        <h3 className="text-xs font-bold text-indigo-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <FlaskConical className="w-4 h-4 text-indigo-600" /> Safety Brief Khusus: {activeBahanData.nama}
                        </h3>
                        <div className="flex flex-col gap-3 mt-2">
                            {activeBahanData.bahan.map((bahan, idx) => (
                                <div key={idx} className={`p-4 rounded-xl border ${bahan.isHazardous ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'} shadow-sm`}>
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 flex flex-wrap gap-1.5 w-12 justify-center shrink-0">
                                            {bahan.symbols ? (
                                                bahan.symbols.map((sym: string, i: number) => <React.Fragment key={i}>{getSafetyIcon(sym)}</React.Fragment>)
                                            ) : (
                                                bahan.isHazardous ? <ShieldAlert className="w-5 h-5 text-red-600" /> : <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className={`text-sm font-bold ${bahan.isHazardous ? 'text-red-900' : 'text-emerald-900'}`}>{bahan.nama}</h4>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${bahan.isHazardous ? 'bg-red-200 text-red-800' : 'bg-emerald-200 text-emerald-800'}`}>
                                                    {bahan.isHazardous ? 'Berbahaya' : 'Aman'}
                                                </span>
                                            </div>
                                            <p className={`text-xs font-medium ${bahan.isHazardous ? 'text-red-800/80' : 'text-emerald-800/80'} mb-3`}>{bahan.desc}</p>
                                            <div className={`p-3 rounded-lg border text-xs font-medium leading-relaxed shadow-sm ${bahan.isHazardous ? 'bg-white border-red-100 text-red-800' : 'bg-white border-emerald-100 text-emerald-800'}`}>
                                                <strong className="block mb-1 opacity-70">INFORMASI KESELAMATAN:</strong>
                                                {bahan.bahayaDesc}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                        <h3 className="text-xs font-bold text-red-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-red-600" /> Panduan Keselamatan Kerja di Laboratorium
                        </h3>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
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

                        <ul className="text-[13px] text-slate-700 space-y-2.5 list-disc list-inside marker:text-red-500 font-medium">
                            <li><strong className="text-slate-800">Kenali Bahan Kimia:</strong> Baca petunjuk bahaya (simbol keselamatan) dan pahami sifat fisik serta kimia bahan yang digunakan.</li>
                            <li><strong className="text-slate-800">Aturan Dasar:</strong> Dilarang keras makan, minum, atau menghirup dan mencicipi zat kimia apa pun secara langsung.</li>
                            <li><strong className="text-slate-800">Kondisi Darurat:</strong> Ketahui letak dan penggunaan kotak P3K, alat pemadam api (APAR), serta wastafel cuci mata.</li>
                            <li><strong className="text-slate-800">Pengelolaan Limbah:</strong> Buang limbah sisa eksperimen ke pembuangan spesifik, jangan langsung ke saluran air umum.</li>
                            <li><strong className="text-slate-800">Kebersihan Akhir:</strong> Bersihkan seluruh meja dan alat setelah digunakan serta cuci tangan dengan sabun dan air mengalir.</li>
                        </ul>

                        <div className="mt-8 border-t border-red-200 pt-6">
                            <h4 className="text-[11px] font-bold text-red-800 uppercase tracking-widest mb-5">Simbol Bahaya Global (GHS)</h4>
                            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                                <div className="flex flex-col items-center gap-3 text-center group">
                                    <div className="w-12 h-12 bg-white border-[3px] border-red-600 rotate-45 flex items-center justify-center rounded-sm shadow-sm group-hover:-translate-y-1 transition-transform relative">
                                        <Flame className="w-6 h-6 text-black -rotate-45" strokeWidth={1.5} />
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-700 uppercase mt-2 leading-tight">Mudah<br/>Terbakar</span>
                                </div>
                                <div className="flex flex-col items-center gap-3 text-center group">
                                    <div className="w-12 h-12 bg-white border-[3px] border-red-600 rotate-45 flex items-center justify-center rounded-sm shadow-sm group-hover:-translate-y-1 transition-transform relative">
                                        <Droplets className="w-6 h-6 text-black -rotate-45" strokeWidth={1.5} />
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-700 uppercase mt-2 leading-tight">Korosif<br/>(Corrosive)</span>
                                </div>
                                <div className="flex flex-col items-center gap-3 text-center group">
                                    <div className="w-12 h-12 bg-white border-[3px] border-red-600 rotate-45 flex items-center justify-center rounded-sm shadow-sm group-hover:-translate-y-1 transition-transform relative">
                                        <Skull className="w-6 h-6 text-black -rotate-45" strokeWidth={1.5} />
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-700 uppercase mt-2 leading-tight">Beracun<br/>(Toxic)</span>
                                </div>
                                <div className="flex flex-col items-center gap-3 text-center group">
                                    <div className="w-12 h-12 bg-white border-[3px] border-red-600 rotate-45 flex items-center justify-center rounded-sm shadow-sm group-hover:-translate-y-1 transition-transform relative">
                                        <Bomb className="w-6 h-6 text-black -rotate-45" strokeWidth={1.5} />
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-700 uppercase mt-2 leading-tight">Mudah<br/>Meledak</span>
                                </div>
                                <div className="flex flex-col items-center gap-3 text-center group">
                                    <div className="w-12 h-12 bg-white border-[3px] border-red-600 rotate-45 flex items-center justify-center rounded-sm shadow-sm group-hover:-translate-y-1 transition-transform relative">
                                        <AlertTriangle className="w-6 h-6 text-black -rotate-45" strokeWidth={1.5} />
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-700 uppercase mt-2 leading-tight">Iritasi /<br/>Berbahaya</span>
                                </div>
                                <div className="flex flex-col items-center gap-3 text-center group">
                                    <div className="w-12 h-12 bg-white border-[3px] border-red-600 rotate-45 flex items-center justify-center rounded-sm shadow-sm group-hover:-translate-y-1 transition-transform relative">
                                        <Leaf className="w-6 h-6 text-black -rotate-45" strokeWidth={1.5} />
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-700 uppercase mt-2 leading-tight">Bahaya<br/>Lingkungan</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                        <h3 className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <ClipboardList className="w-4 h-4 text-amber-600" /> Tahapan SOP Praktikum
                        </h3>
                        <ol className="text-[13px] text-slate-700 space-y-2.5 list-decimal list-inside marker:text-amber-600 marker:font-bold font-medium">
                            <li><strong className="text-slate-800">Persiapan APD:</strong> Kenakan Jas Lab, Kacamata Pelindung, Sarung Tangan, Masker, dan Sepatu Tertutup sebelum memulai praktikum.</li>
                            <li><strong className="text-slate-800">Penyesuaian Konsentrasi:</strong> Gunakan pipet kontrol untuk menetapkan tingkat konsentrasi reaktan yang tepat.</li>
                            <li><strong className="text-slate-800">Kalibrasi Suhu:</strong> Atur suhu pada <em>Hot Plate</em> mulai dari rentang aman sebelum memulai pemanasan ekstrim.</li>
                            <li><strong className="text-slate-800">Penambahan Katalis:</strong> Klik tombol aktivasi <em>Katalis</em> jika bereksperimen dengan jalur alternatif rendah energi.</li>
                            <li><strong className="text-slate-800">Reaksi & Observasi:</strong> Klik "Mulai Reaksi", lalu pantau visualisasi tumbukan, laju (v), dan suhu.</li>
                            <li><strong className="text-slate-800">Sterilisasi Siklus:</strong> Selalu gunakan "Reset Simulasi" sebelum melakukan eksperimen ulang.</li>
                        </ol>
                    </div>
                </div>
                
                <div className="p-5 border-t border-slate-200 bg-white flex justify-end shrink-0">
                    <button 
                        onClick={() => {
                            setShowSOP(false);
                            if (!localStorage.getItem('hasSeenTour')) {
                                setTimeout(() => startTour(), 500); // Wait for modal to close
                            }
                        }} 
                        className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm uppercase tracking-wide flex items-center gap-2"
                    >
                        Saya Mengerti SOP Praktikum <Play className="w-4 h-4 fill-white" />
                    </button>
                </div>
            </div>
        </div>
        )}
    </div>
  );
}
