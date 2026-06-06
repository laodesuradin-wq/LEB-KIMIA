import React, { useState, useRef, useEffect } from 'react';
import { Send, Play, RotateCcw, Thermometer, FlaskConical, Zap, Activity, MessageSquare, Menu, ClipboardList, ShieldAlert, ShieldCheck, Beaker, TrendingUp, Timer, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Particles3D } from './components/Particles3D';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { motion, AnimatePresence } from 'motion/react';

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
        colorA: '#38bdf8', 
        colorB: '#0ea5e9', 
        Ea: 50000, 
        catEa: 30000,
        kalkulasi: (konsentrasi: number) => `${((konsentrasi * 100) / 9.8).toFixed(1)} mL larutan H₂O₂ pekat (30% / 9.8 M) untuk 100 mL larutan`,
        alat: [

            { nama: 'Labu Erlenmeyer 250 mL', desc: 'Wadah reaktor utama untuk mencampur larutan.' },
            { nama: 'Gelas Ukur 50 mL', desc: 'Mengukur volume H₂O₂.' },
            { nama: 'Spatula', desc: 'Mengambil serbuk katalis (mis. KI atau MnO₂).' },
            { nama: 'Stopwatch', desc: 'Mencatat waktu durasi reaksi.' },
            { nama: 'Sumbat Karet & Pipa Kaca', desc: 'Bila perlu menangkap gas O₂ yang dihasilkan.' }
        ],
        bahan: [
            { nama: 'Hidrogen Peroksida (H₂O₂)', desc: 'Bahan reaktan utama yang akan terdekomposisi.', isHazardous: true, bahayaDesc: 'Korosif dan oksidator kuat. Jika terkena kulit menyebabkan sel memutih, iritasi parah, dan luka bakar.' },
            { nama: 'Serbuk KI atau MnO₂', desc: 'Katalis untuk mempercepat reaksi penguraian.', isHazardous: true, bahayaDesc: 'Dapat menyebabkan iritasi pada kulit, mata, dan saluran pernapasan jika dihirup.' },
            { nama: 'Aquades', desc: 'Pelarut universal.', isHazardous: false, bahayaDesc: 'Aman untuk bersentuhan langsung dengan kulit.' }
        ]
    },
    { 
        id: 'Na2S2O3', 
        nama: 'Natrium Tiosulfat + HCl', 
        desc: 'Pembentukan Endapan Belerang', 
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
            { nama: 'Natrium Tiosulfat (Na₂S₂O₃)', desc: 'Reaktan utama pemberi ion tiosulfat.', isHazardous: false, bahayaDesc: 'Secara umum aman, namun dapat menyebabkan iritasi ringan pada kulit sensitif.' },
            { nama: 'Asam Klorida (HCl)', desc: 'Reaktan utama pemberi ion H+.', isHazardous: true, bahayaDesc: 'Sangat korosif. Jika mengenai kulit dapat menyebabkan luka bakar kimia yang parah dan rasa perih yang kuat.' },
            { nama: 'Aquades', desc: 'Bahan pengencer.', isHazardous: false, bahayaDesc: 'Aman dan tidak memberikan dampak pada tubuh.' }
        ]
    },
    { 
        id: 'Mg', 
        nama: 'Pita Magnesium + HCl', 
        desc: 'Produksi Gas Hidrogen', 
        colorA: '#cbd5e1', 
        colorB: '#94a3b8', 
        Ea: 45000, 
        catEa: 25000,
        kalkulasi: (konsentrasi: number) => `${((konsentrasi * 100) / 12).toFixed(1)} mL pekat HCl (12 M) dilarutkan hingga 100 mL`,
        alat: [
            { nama: 'Labu Erlenmeyer', desc: 'Wadah untuk mereaksikan padatan dan asam.' },
            { nama: 'Gelas Ukur 25 mL', desc: 'Untuk mengukur volume HCl.' },
            { nama: 'Amplas', desc: 'Membersihkan permukaan pita magnesium.' },
            { nama: 'Gunting', desc: 'Memotong pita magnesium sesuai ukuran tertentu.' },
            { nama: 'Stopwatch', desc: 'Mengukur durasi reaksi hingga pita magnesium habis.' }
        ],
        bahan: [
            { nama: 'Pita Magnesium (Mg)', desc: 'Logam reaktif yang memberikan luas permukaan.', isHazardous: true, bahayaDesc: 'Padatan logam ringan. Dalam bentuk serbuk sangat mudah terbakar dan nyalanya sangat terang (merusak retina). Cukup aman disentuh jika dalam bentuk pita, namun jangan sampai tertelan.' },
            { nama: 'Asam Klorida (HCl)', desc: 'Larutan asam yang akan bereaksi dengan logam Mg.', isHazardous: true, bahayaDesc: 'Asam kuat yang bersifat korosif. Mengakibatkan luka bakar jika tersiram ke kulit atau mata.' },
            { nama: 'Aquades', desc: 'Pelarut.', isHazardous: false, bahayaDesc: 'Tidak berbahaya.' }
        ]
    },
    { 
        id: 'CaCO3', 
        nama: 'Kalsium Karbonat + HCl', 
        desc: 'Kalsium Klorida dan CO₂', 
        colorA: '#e2e8f0', 
        colorB: '#94a3b8', 
        Ea: 48000, 
        catEa: 28000,
        kalkulasi: (konsentrasi: number) => `${((konsentrasi * 100) / 12).toFixed(1)} mL pekat HCl (12 M) dilarutkan hingga 100 mL`,
        alat: [
            { nama: 'Labu Erlenmeyer 250 mL', desc: 'Wadah reaktor utama untuk melarutkan serbuk/keping.' },
            { nama: 'Gelas Ukur 50 mL', desc: 'Mengambil volume HCl.' },
            { nama: 'Spatula', desc: 'Mengambil pualam/CaCO₃ bentuk serbuk.' },
            { nama: 'Neraca Analitik', desc: 'Menimbang massa CaCO₃ keping / serbuk agar sama.' },
            { nama: 'Stopwatch', desc: 'Mencatat durasi hingga seluruh zat larut / gelembung berhenti.' }
        ],
        bahan: [
            { nama: 'Keping pualam / CaCO₃ padat', desc: 'Sumber Kalsium Karbonat (Bentuk kasar).', isHazardous: false, bahayaDesc: 'Aman untuk disentuh. Menghirup debu secara berlebihan dapat menyebabkan iritasi saluran pernapasan ringan.' },
            { nama: 'Serbuk pualam / CaCO₃', desc: 'Sumber Kalsium Karbonat (Bentuk halus).', isHazardous: false, bahayaDesc: 'Debu berlebih dapat mengiritasi mata dan saluran pernapasan.' },
            { nama: 'Asam Klorida (HCl)', desc: 'Reaktan utama.', isHazardous: true, bahayaDesc: 'Bahan kimia korosif. Berpotensi menimbulkan iritasi kulit hingga luka bakar jika tidak dibilas.' }
        ]
    },
    { 
        id: 'KMnO4', 
        nama: 'KMnO₄ + H₂C₂O₄', 
        desc: 'Reaksi Redoks Autokatalitik', 
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
            { nama: 'Kalium Permanganat (KMnO₄)', desc: 'Titran & indikator auto-oksidasi.', isHazardous: true, bahayaDesc: 'Zat pengoksidasi kuat. Berbahaya apabila tertelan. Bila terkena kulit akan meninggalkan noda coklat/ungu pekat dan menyebabkan iritasi.' },
            { nama: 'Asam Oksalat (H₂C₂O₄)', desc: 'Reduktor.', isHazardous: true, bahayaDesc: 'Beracun dan korosif. Kontak dengan kulit menyebabkan luka bakar; terabsorpsi dalam kulit bisa merusak ginjal.' },
            { nama: 'Asam Sulfat (H₂SO₄)', desc: 'Penyesuai suasana asam.', isHazardous: true, bahayaDesc: 'Sangat amat korosif. Menghancurkan jaringan tubuh secara cepat dan menghasilkan panas ekstrem bila kena air (luka bakar termal dan kimiawi).' }
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

export default function App() {
  const [suhu, setSuhu] = useState<number>(300);
  const [konsentrasi, setKonsentrasi] = useState<number>(0.5);
  const [katalis, setKatalis] = useState<boolean>(false);
  const [isReacting, setIsReacting] = useState<boolean>(false);
  const [collisionsPerSecond, setCollisionsPerSecond] = useState<number>(0);
  const [durasi, setDurasi] = useState<number>(0);
  const [ordoB, setOrdoB] = useState<number>(0);
  const [bahanKimia, setBahanKimia] = useState<string>('H2O2');
  
  const [is3D, setIs3D] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const durationRef = useRef<number>(0);
  
  useEffect(() => {
    durationRef.current = durasi;
  }, [durasi]);
  const particlesRef = useRef<Particle[]>([]);
  const debrisRef = useRef<ExplosionDebris[]>([]);
  const collisionCountRef = useRef<number>(0);
  const effectiveCollisionCountRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const lastPlayTimeRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const [rateHistory, setRateHistory] = useState<{time: number, rate: number, simulatedRate: number}[]>([]);
  const timeStepRef = useRef<number>(0);
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
  const [activeMobileControl, setActiveMobileControl] = useState<'suhu' | 'konsentrasi' | 'katalis' | 'waktu' | 'ordo' | 'preset' | 'bahan'>('suhu');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSOP, setShowSOP] = useState(true);
  
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

  const getKValue = (T: number, isCatalyzed: boolean, bahanId: string) => {
      const bahan = BAHAN_KIMIA.find(b => b.id === bahanId) || BAHAN_KIMIA[0];
      const Ea = isCatalyzed ? bahan.catEa : bahan.Ea; // Activation energy (J/mol)
      const R = 8.314; // Gas constant 
      const A = 1e6; // Pre-exponential factor
      return A * Math.exp(-Ea / (R * T));
  };

  const k_val = getKValue(suhu, katalis, bahanKimia);
  const lajuReaksi = hitungLajuReaksi(k_val, konsentrasi, 1, konsentrasi, ordoB); // using cB=konsentrasi, n=ordoB

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
                      
                      // Generate small explosion debris
                      const centerX = (p1.x + p2.x) / 2;
                      const centerY = (p1.y + p2.y) / 2;
                      const centerZ = (p1.z + p2.z) / 2;
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background color shifts based on temperature
    const currentSuhu = suhuRef.current;
    const heatRatio = Math.max(0, Math.min(1, (currentSuhu - 200) / 800));
    const bgR = Math.floor(15 + heatRatio * 60);
    const bgG = Math.floor(23 + heatRatio * 10);
    const bgB = Math.floor(42 - heatRatio * 15);
    
    // Add a trailing effect for visual flair based on temperature
    ctx.fillStyle = `rgba(${bgR}, ${bgG}, ${bgB}, ${Math.max(0.2, 1 - (currentSuhu / 1000))})`; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const jitter = Math.max(0, (currentSuhu - 400) / 200);

    particlesRef.current.forEach(p => {
        ctx.beginPath();
        const jx = p.x + (Math.random() - 0.5) * jitter;
        const jy = p.y + (Math.random() - 0.5) * jitter;
        ctx.arc(jx, jy, p.radius, 0, Math.PI * 2);
        
        if (p.flashTimer && p.flashTimer > 0) {
           ctx.shadowBlur = 15;
           ctx.shadowColor = '#fbbf24'; // Amber glow
           // Interpolate color from white/amber back to original color based on timer
           const flashRatio = p.flashTimer / 20;
           ctx.fillStyle = `rgba(255, 255, 255, ${flashRatio})`;
           ctx.fill(); // Fill white core

           ctx.fillStyle = p.color;
           ctx.globalAlpha = 1 - flashRatio;
           p.flashTimer--;
        } else if (heatRatio > 0.6) {
           ctx.shadowBlur = 10 * heatRatio;
           ctx.shadowColor = '#ef4444';
           ctx.fillStyle = p.color;
           ctx.globalAlpha = 1.0;
        } else {
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
  }

  const hentikanSimulasi = () => {
    setIsReacting(false);
    if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
    }
  };

  const animate = (time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const delta = time - lastTimeRef.current;
    
    if (delta >= 1000) {
        setCollisionsPerSecond(collisionCountRef.current);
        
        timeStepRef.current += 1;
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
    debrisRef.current = [];
    
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
    
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
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
            body: JSON.stringify({ message: userMessage, history: historyForApi, simulationState: { suhu, konsentrasi, katalis, lajuReaksi, bahanKimia: activeBahan.nama } })
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
    <div className="w-full min-h-screen bg-slate-50 p-4 lg:p-6 font-sans text-slate-900 flex flex-col gap-4 overflow-y-auto select-none">
        {/* Header Section */}
        <header className="shrink-0 flex justify-between items-center bg-white border border-slate-200 p-4 px-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-inner">
                    <FlaskConical className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-800 leading-tight">Lab Kimia <span className="text-indigo-600">v2.4</span></h1>
                    <p className="text-xs text-slate-500 font-medium">Virtual Reaction Simulator</p>
                </div>
            </div>
            <div className="hidden lg:flex gap-8 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-emerald-500" /> System Nominal</span>
                <span>Session: <span className="font-mono text-slate-700">#7721-X</span></span>
            </div>
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors active:scale-95"
            >
                <Menu className="w-5 h-5" />
            </button>
        </header>

        {isMobileMenuOpen && (
            <div className="lg:hidden bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col gap-3 shrink-0 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status Sistem</span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600"><Activity className="w-4 h-4" /> NOMINAL</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sesi Aktif</span>
                    <span className="font-mono text-xs text-slate-700 font-bold bg-slate-100 px-2 py-1 rounded-md border border-slate-200">#7721-X</span>
                </div>
            </div>
        )}

        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-6 gap-4 lg:min-h-[700px]">
            {/* Left: Control Panel */}
            <section id="tour-control-panel" className="lg:col-span-3 lg:row-span-6 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col gap-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-2 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800">Control Panel</h2>
                    </div>
                    <button onClick={() => setShowSOP(true)} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-[10px] font-bold uppercase hover:bg-amber-100 transition-colors">
                        <ClipboardList className="w-3.5 h-3.5" /> SOP Alat
                    </button>
                </div>
                
                <div className="grid grid-cols-3 bg-slate-100 p-1.5 rounded-xl gap-1.5 border border-slate-200">
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
                        className={`col-span-3 py-2 px-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-1.5 transition-all ${activeMobileControl === 'preset' ? 'bg-white text-cyan-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:bg-white/50'}`}
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
                            min="200" 
                            max="1000" 
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
                            <span className="font-mono font-bold text-lg text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">{konsentrasi.toFixed(1)}M</span>
                        </div>
                         <input 
                            type="range" 
                            min="0.1" 
                            max="2.0" 
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

                    <div className={activeMobileControl === 'waktu' ? 'block space-y-3 pt-2' : 'hidden'}>
                        <div className="flex justify-between items-center">
                            <label className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-500">
                                <Timer className="w-4 h-4 text-pink-500" /> Durasi Simulasi
                            </label>
                            <span className="font-mono text-[10px] font-bold px-2 py-1 rounded-md border border-slate-200 text-slate-500 bg-slate-50">
                                {durasi === 0 ? 'TANPA BATAS' : `${durasi}s`}
                            </span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 pt-1">
                            {[0, 10, 30, 60].map(val => (
                                <button
                                    key={val}
                                    disabled={isReacting}
                                    onClick={() => setDurasi(val)}
                                    className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${
                                        durasi === val 
                                        ? 'bg-pink-50 text-pink-600 border-pink-200 shadow-sm' 
                                        : 'bg-white text-slate-500 border-slate-200 hover:border-pink-300 disabled:opacity-50'
                                    }`}
                                >
                                    {val === 0 ? '∞' : `${val}s`}
                                </button>
                            ))}
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
                                        setShowSOP(true);
                                    }}
                                    className={`w-full text-left p-2.5 rounded-xl border transition-all group ${
                                        bahanKimia === bahan.id 
                                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm' 
                                        : 'bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className={`text-xs font-bold ${bahanKimia === bahan.id ? 'text-indigo-700' : 'text-slate-700 group-hover:text-indigo-600'}`}>{bahan.nama}</div>
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
                                onClick={() => { setSuhu(300); setKonsentrasi(0.5); setKatalis(false); setOrdoB(0); setBahanKimia('Na2S2O3'); }}
                                className="w-full text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-cyan-50 hover:border-cyan-200 hover:text-cyan-700 transition-all group"
                            >
                                <div className="text-xs font-bold text-slate-700 group-hover:text-cyan-700">Lambat (Natrium Tiosulfat)</div>
                                <div className="text-[10px] text-slate-500 font-mono mt-1">300K | 0.5M | No Cat | Ordo 0</div>
                            </button>
                            <button 
                                onClick={() => { setSuhu(800); setKonsentrasi(1.5); setKatalis(true); setOrdoB(1); setBahanKimia('H2O2'); }}
                                className="w-full text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 transition-all group"
                            >
                                <div className="text-xs font-bold text-slate-700 group-hover:text-orange-700">Dekomposisi Cepat H₂O₂</div>
                                <div className="text-[10px] text-slate-500 font-mono mt-1">800K | 1.5M | +Catalyst | Ordo 1</div>
                            </button>
                            <button 
                                onClick={() => { setSuhu(400); setKonsentrasi(1.0); setKatalis(true); setOrdoB(2); setBahanKimia('KMnO4'); }}
                                className="w-full text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all group"
                            >
                                <div className="text-xs font-bold text-slate-700 group-hover:text-emerald-700">Autokatalitik (KMnO₄)</div>
                                <div className="text-[10px] text-slate-500 font-mono mt-1">400K | 1.0M | +Catalyst | Ordo 2</div>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-slate-100">
                    <button 
                        onClick={jalankanReaksi}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] uppercase tracking-wide text-sm"
                    >
                        <Play className="w-5 h-5 fill-current" />
                        {isReacting ? 'Mulai Ulang' : 'Mulai Reaksi'}
                    </button>
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
            <section id="tour-simulation-view" className="lg:col-span-6 lg:row-span-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-inner flex flex-col min-h-[300px] relative overflow-hidden group">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
                
                {/* Waktu Overlay */}
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                    <button 
                        onClick={() => setIs3D(!is3D)}
                        className={`border rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs font-mono font-bold shadow-lg transition-colors ${is3D ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800/80 border-slate-700/50 text-slate-300 backdrop-blur-md hover:bg-slate-700/80'}`}
                    >
                        3D View
                    </button>
                    <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs font-mono font-bold text-slate-300 shadow-lg">
                        <Timer className="w-3.5 h-3.5 text-pink-400" />
                        <span>{rateHistory.length > 0 ? rateHistory[rateHistory.length - 1].time : 0}s {durasi > 0 && <span className="text-slate-500 font-normal">/ {durasi}s</span>}</span>
                    </div>
                </div>

                <div className="w-full h-full flex items-center justify-center relative">
                    <canvas 
                        ref={canvasRef} 
                        className={`w-full h-full object-cover z-0 rounded-2xl transition-opacity ${is3D ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    />
                    
                    {is3D && (
                        <div className="absolute inset-0 z-0">
                            <Particles3D 
                                particlesRef={particlesRef} 
                                debrisRef={debrisRef} 
                                width={canvasRef.current?.width || 500} 
                                height={canvasRef.current?.height || 300} 
                            />
                        </div>
                    )}
                    
                    {!isReacting && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 font-mono bg-slate-900/60 z-10 transition-opacity rounded-2xl backdrop-blur-sm">
                            <p className="text-sm px-6 py-3 rounded-xl border border-slate-700 bg-slate-800/80 shadow-xl flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-slate-500 animate-pulse"></span>
                                WAITING_FOR_INPUT
                            </p>
                        </div>
                    )}

                    {/* pH Indicator */}
                    <div className="absolute bottom-5 left-5 z-20 flex items-end gap-2 group/ph">
                        <div className={`p-0.5 rounded-lg bg-gradient-to-br shadow-lg flex flex-col items-center justify-center transition-all duration-500 border border-white/20 hover:scale-105 cursor-default ${getPHColor(currentPH)}`}>
                            <div className="px-2 py-1.5 flex flex-col items-center justify-center min-w-[36px]">
                                <span className="text-[9px] font-bold opacity-80 mb-0.5">pH</span>
                                <span className="font-mono text-sm font-black tracking-tighter leading-none">{currentPH.toFixed(1)}</span>
                            </div>
                        </div>
                        {/* Tooltip on Hover */}
                        <div className="mb-1 pointer-events-none opacity-0 group-hover/ph:opacity-100 transition-opacity bg-slate-900/80 backdrop-blur-md px-2 py-1.5 rounded-md border border-slate-700/50 flex flex-col">
                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-none mb-1">Tingkat Keasaman</span>
                            <span className="text-[10px] text-slate-400 leading-tight">Berubah dipengaruhi oleh<br/>jenis bahan & konsentrasi</span>
                        </div>
                    </div>

                    {/* Overlay Stats */}
                    <div className="absolute top-5 left-5 font-mono text-[10px] text-emerald-400 space-y-1.5 pointer-events-none z-20 bg-slate-900/40 p-3 rounded-lg backdrop-blur-md border border-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>{`STATE: ${isReacting ? 'ACTIVE' : 'IDLE'}`}</p>
                        <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>{`Ea   : ${katalis ? '30.0' : '50.0'} kJ/mol`}</p>
                        <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>{`k    : ${k_val.toExponential(2)}`}</p>
                        <p className="flex items-center gap-2 text-amber-300 font-bold"><span className="w-1.5 h-1.5 rounded-full bg-amber-300"></span>{`RATE : ${lajuReaksi.toExponential(3)} M/s`}</p>
                        <p className="flex items-center gap-2 text-cyan-400 font-bold"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>{`COLL : ${collisionsPerSecond} /s`}</p>
                        {katalis && <p className="text-emerald-400 font-bold mt-2 pt-2 border-t border-emerald-900/50">✓ CATALYST ENGAGED</p>}
                    </div>
                </div>
            </section>

            {/* Bottom Center Left: Energy Graph */}
            <section id="tour-chart-energy" className="lg:col-span-3 lg:row-span-2 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col min-h-[150px] relative">
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
            <section id="tour-chart-rate" className="lg:col-span-3 lg:row-span-2 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col min-h-[150px] relative">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-amber-500" /> Laju Reaksi (v)
                    </h3>
                    {isReacting && processedHistory.length > 1 && (
                        <div className="flex flex-col items-end" title="Persentase Galat Simulasi Stokastik thd Teori">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Persentase Galat</span>
                            <span className={`text-sm font-mono font-bold ${galatPercentage > 20 ? 'text-red-500' : galatPercentage > 10 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                ±{galatPercentage.toFixed(1)}%
                            </span>
                        </div>
                    )}
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

            {/* Right: ChemBot Assistant */}
            <section id="tour-chembot" className="lg:col-span-3 lg:row-span-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col min-h-[400px] overflow-hidden">
                <div className="flex items-center gap-3 p-5 shrink-0 border-b border-slate-100 bg-gradient-to-r from-indigo-50/50 to-white">
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
        </main>

        {showSOP && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="bg-slate-900 px-6 py-5 flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
                        <ShieldAlert className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold tracking-tight text-white leading-tight">Standar Operasional Laboratorium</h2>
                        <p className="text-xs text-slate-400 font-medium">Klik pada nama alat atau bahan untuk melihat fungsi dan bahayanya.</p>
                    </div>
                </div>
                
                <div className="p-6 overflow-y-auto space-y-8 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Beaker className="w-4 h-4 text-indigo-500" /> Alat Tersedia
                            </h3>
                            <ul className="text-[12px] text-slate-600 space-y-2.5 font-medium">
                                {activeBahanData.alat.map((alatItem, idx) => (
                                    <ExpandableAlat key={idx} alatItem={alatItem} />
                                ))}
                            </ul>
                        </div>
                        
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <FlaskConical className="w-4 h-4 text-emerald-500" /> Bahan Kimia
                            </h3>
                            <ul className="text-[12px] text-slate-600 space-y-2.5 font-medium">
                                {activeBahanData.bahan.map((bahanItem, idx) => (
                                    <ExpandableBahan key={idx} bahanItem={bahanItem} />
                                ))}
                            </ul>
                        </div>
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                        <h3 className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <ClipboardList className="w-4 h-4 text-amber-600" /> Tahapan SOP Praktikum
                        </h3>
                        <ol className="text-[13px] text-slate-700 space-y-2.5 list-decimal list-inside marker:text-amber-600 marker:font-bold font-medium">
                            <li><strong className="text-slate-800">Persiapan APD:</strong> Asumsikan Anda menggunakan Jas Lab dan Kacamata Pelindung (Goggles) secara virtual.</li>
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
