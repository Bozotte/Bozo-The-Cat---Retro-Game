import React, { useState, useEffect, useRef } from 'react';
import { audioEngine, KitConfig } from './audioEngine';
import { Square, Download, Sparkles, Volume2, Music, RefreshCw, Zap, Play, Pause, Radio, Globe } from 'lucide-react';
import { PRESET_KITS, PresetKit } from './kits';
import { PixelCat } from './PixelCat';
import { CatSoundboard } from './CatSoundboard';

const PixelGrid = ({ active, padId }: { active: boolean; padId: number }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!active) return;
    let req: number;
    let lastTime = performance.now();
    const animate = (time: number) => {
      if (time - lastTime > 100) { // 10fps
        setFrame(f => f + 1);
        lastTime = time;
      }
      req = requestAnimationFrame(animate);
    };
    req = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(req);
  }, [active]);

  const rows = 8;
  const cols = 20;

  // Color logic based on frame, padId, and row/col
  const getColor = (r: number, c: number) => {
    if (!active) {
      const blockC = Math.floor(c / 2);
      const bHash1 = Math.sin(padId * 12.9898 + blockC * 78.233) * 43758.5453;
      const bHash2 = Math.sin(padId * 39.346 + blockC * 11.233) * 43758.5453;

      const h1 = Math.floor(2 + (bHash1 - Math.floor(bHash1)) * 3);
      const h2 = Math.floor(4 + (bHash2 - Math.floor(bHash2)) * 3);

      if (r >= h2) return 'bg-[#f0a500]'; // orange
      if (r >= h1) return 'bg-[#e649b8]'; // magenta
      return 'bg-[#2a3033]'; // dark gray
    }
    
    const styleType = padId % 4;
    const time = frame * (1 + (padId % 2));
    
    if (styleType === 0) {
      const v = (r - time + c * 3 + padId * 7) % 8;
      if (v === 0) return 'bg-[#00d0e6]';
      if (v === 1) return 'bg-[#e649b8]';
      if (v > 5) return 'bg-[#f0a500]';
      return 'bg-[#2a3033]';
    } else if (styleType === 1) {
      const scrollC = c + time;
      const blockC = Math.floor(scrollC / 2);
      const bHash1 = Math.sin(padId * 12.9898 + blockC * 78.233) * 43758.5453;
      const wave = Math.floor(3 + (bHash1 - Math.floor(bHash1)) * 4);
      
      if (r >= wave + 2) return 'bg-[#f0a500]';
      if (r >= wave) return 'bg-[#e649b8]';
      if (r === wave - 1) return 'bg-[#00d0e6]';
      return 'bg-[#2a3033]';
    } else if (styleType === 2) {
      const dist = Math.abs(r - 4) + Math.abs(c - 10);
      const v = (dist - time + 20) % 8;
      if (v === 0) return 'bg-[#00d0e6]';
      if (v === 1 || v === 2) return 'bg-[#e649b8]';
      if (v === 3 || v === 4) return 'bg-[#f0a500]';
      return 'bg-[#2a3033]';
    } else {
      const noise = (r * 13 + c * 17 + time * 23 + padId * 31) % 100;
      if (noise < 10) return 'bg-[#00d0e6]';
      if (noise < 30) return 'bg-[#e649b8]';
      if (noise < 60) return 'bg-[#f0a500]';
      return 'bg-[#2a3033]';
    }
  };

  return (
    <div className="w-full grid gap-[1px] bg-[#1f2426] p-[1px]" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {Array.from({ length: rows * cols }).map((_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        return (
          <div key={i} className={`w-full aspect-square ${getColor(r, c)}`} />
        );
      })}
    </div>
  );
};

const KEYS = ["Random", "A Minor", "C Major", "C Minor", "D Major", "D Minor", "E Minor", "F Major", "F# Minor", "G Major", "G Minor", "A Major", "Bb Major", "B Minor"];
const VIBES = [
  "Mode Chaton (Miaou Miaou)",
  "Zoomies de Minuit",
  "Sieste au Soleil",
  "Chat de Gouttière Cyberpunk",
  "Chasse au Laser 8-Bit",
  "Boss Battle",
  "Upbeat Platformer",
  "Spooky Dungeon",
  "Chill Village",
  "Space Shooter"
];

const KEYBOARD_SHORTCUTS = ['Q', 'W', 'E', 'R', 'A', 'S', 'D', 'F'];

const XYPad = ({ title1, title2, initialX = 0.5, initialY = 0.5, onChange }: { title1: string, title2: string, initialX?: number, initialY?: number, onChange: (x: number, y: number) => void }) => {
  const [x, setX] = useState(initialX);
  const [y, setY] = useState(initialY);
  const [isDragging, setIsDragging] = useState(false);
  const padRef = useRef<HTMLDivElement>(null);

  const updatePosition = (e: React.PointerEvent) => {
    if (!padRef.current) return;
    const rect = padRef.current.getBoundingClientRect();
    let newX = (e.clientX - rect.left) / rect.width;
    let newY = 1.0 - ((e.clientY - rect.top) / rect.height);
    newX = Math.max(0, Math.min(1, newX));
    newY = Math.max(0, Math.min(1, newY));
    setX(newX);
    setY(newY);
    onChange(newX, newY);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updatePosition(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updatePosition(e);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="w-full h-full p-4 bg-[#eeeee7] border-2 border-black rounded-xl inline-flex flex-col justify-start items-start gap-3">
      <div 
        ref={padRef}
        className="w-full aspect-square bg-gray-200 border-2 border-black relative cursor-crosshair touch-none rounded"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="absolute w-full h-[1px] bg-black/20" style={{ bottom: `${y * 100}%` }} />
        <div className="absolute h-full w-[1px] bg-black/20" style={{ left: `${x * 100}%` }} />
        <div 
          className="absolute size-4 -ml-2 -mb-2 bg-black rounded-full shadow-md"
          style={{ left: `${x * 100}%`, bottom: `${y * 100}%` }}
        />
      </div>
      <div className="self-stretch h-[1px] bg-black/40"></div>
      <div className="self-stretch inline-flex justify-between items-center gap-2">
        <div className="justify-start text-black text-[13px] font-black font-rose leading-tight uppercase">
          {title1}<br/>{title2}
        </div>
        <div className="text-[11px] font-mono-ibm font-bold text-gray-600">
          {Math.round(x * 100)}% / {Math.round(y * 100)}%
        </div>
      </div>
    </div>
  );
};

const StudioFader = ({ title1, title2, initialValue = 0, onChange }: { title1: string, title2: string, initialValue?: number, onChange: (v: number) => void }) => {
  const [value, setValue] = useState(initialValue);
  const [isDragging, setIsDragging] = useState(false);
  const faderRef = useRef<HTMLDivElement>(null);

  const updatePosition = (e: React.PointerEvent) => {
    if (!faderRef.current) return;
    const rect = faderRef.current.getBoundingClientRect();
    let newValue = 1.0 - ((e.clientY - rect.top) / rect.height);
    newValue = Math.max(0, Math.min(1, newValue));
    setValue(newValue);
    onChange(newValue);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updatePosition(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updatePosition(e);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="w-full h-full p-4 bg-[#eeeee7] border-2 border-black rounded-xl inline-flex flex-col justify-start items-start gap-3">
      <div className="w-full aspect-square flex justify-center py-2">
        <div 
          ref={faderRef}
          className="w-10 h-full bg-gray-200 border-2 border-black relative cursor-ns-resize touch-none rounded"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <div className="absolute w-full h-full flex flex-col justify-between py-1">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-full h-[1px] bg-black/10" />
            ))}
          </div>
          <div 
            className="absolute w-12 h-6 -ml-1 -mb-3 bg-black rounded shadow"
            style={{ bottom: `${value * 100}%` }}
          >
            <div className="w-full h-[2px] bg-white/60 mt-2.5" />
          </div>
        </div>
      </div>
      <div className="self-stretch h-[1px] bg-black/40"></div>
      <div className="self-stretch inline-flex justify-between items-center gap-2">
        <div className="justify-start text-black text-[13px] font-black font-rose leading-tight uppercase">
          {title1}<br/>{title2}
        </div>
        <div className="justify-start text-black text-3xl font-bold font-rose leading-none">
          {Math.floor(value * 99).toString().padStart(2, '0')}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const [currentPresetId, setCurrentPresetId] = useState<string>('chaton-8bit');
  const [kit, setKit] = useState<KitConfig>(PRESET_KITS[0].config);
  const [currentTempo, setCurrentTempo] = useState<number>(PRESET_KITS[0].config.tempo);
  const [loading, setLoading] = useState(false);
  const [activePads, setActivePads] = useState<Set<number>>(new Set());
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [showAiGenerator, setShowAiGenerator] = useState(false);
  const [laserActive, setLaserActive] = useState(false);
  const [laserPos, setLaserPos] = useState<{ x: number; y: number } | null>(null);
  
  const [selectedKey, setSelectedKey] = useState("Random");
  const [selectedVibe, setSelectedVibe] = useState("Mode Chaton (Miaou Miaou)");

  // Tap Tempo state
  const tapTimesRef = useRef<number[]>([]);
  const tapResetTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isTapFlashing, setIsTapFlashing] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  const handleTempoChange = (newTempo: number) => {
    const clamped = Math.max(60, Math.min(200, newTempo));
    setCurrentTempo(clamped);
    audioEngine.setTempo(clamped);
  };

  const handleTapTempo = async () => {
    await initAudio();
    const now = performance.now();
    audioEngine.playTapBlip();

    setIsTapFlashing(true);
    setTimeout(() => setIsTapFlashing(false), 120);

    if (tapResetTimeoutRef.current) clearTimeout(tapResetTimeoutRef.current);
    tapResetTimeoutRef.current = setTimeout(() => {
      tapTimesRef.current = [];
      setTapCount(0);
    }, 2200);

    const prevTaps = tapTimesRef.current;
    if (prevTaps.length > 0 && (now - prevTaps[prevTaps.length - 1] > 2500)) {
      tapTimesRef.current = [now];
      setTapCount(1);
      return;
    }

    const newTaps = [...prevTaps, now].slice(-6);
    tapTimesRef.current = newTaps;
    setTapCount(newTaps.length);

    if (newTaps.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < newTaps.length; i++) {
        intervals.push(newTaps[i] - newTaps[i - 1]);
      }
      const avgInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
      if (avgInterval > 0) {
        const calculatedBpm = Math.round(60000 / avgInterval);
        const clamped = Math.max(60, Math.min(200, calculatedBpm));
        handleTempoChange(clamped);
      }
    }
  };

  // Recording counter
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const initAudio = async () => {
    if (!audioInitialized) {
      await audioEngine.init();
      audioEngine.loadKit(kit);
      setAudioInitialized(true);
    }
    await audioEngine.resume();
  };

  // Keyboard controls for pads (Q, W, E, R, A, S, D, F) and spacebar to stop all
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      // Don't trigger if user is in an input or select
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      
      const keyMap: { [k: string]: number } = {
        'q': 0, 'w': 1, 'e': 2, 'r': 3,
        'a': 4, 's': 5, 'd': 6, 'f': 7,
      };

      const lower = e.key.toLowerCase();
      if (keyMap[lower] !== undefined) {
        e.preventDefault();
        await togglePad(keyMap[lower]);
      } else if (e.code === 'Space') {
        e.preventDefault();
        stopAllPads();
      } else if (lower === 'm') {
        // Quick Meow key!
        audioEngine.playMeow(1.2);
      } else if (lower === 't') {
        // Quick Tap Tempo key!
        e.preventDefault();
        handleTapTempo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePads, kit, audioInitialized]);

  // Load preset kit
  const loadPreset = async (preset: PresetKit) => {
    await initAudio();
    stopAllPads();
    setCurrentPresetId(preset.id);
    setKit(preset.config);
    setCurrentTempo(preset.config.tempo);
    audioEngine.loadKit(preset.config);
  };

  const stopAllPads = () => {
    activePads.forEach(id => audioEngine.stopPad(id));
    setActivePads(new Set());
  };

  const generateKitWithAi = async () => {
    try {
      setLoading(true);
      await initAudio();
      stopAllPads();

      const res = await fetch('/api/generate-kit', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vibe: selectedVibe, musicKey: selectedKey })
      });
      
      if (!res.ok) {
        throw new Error('Failed to generate kit');
      }

      const data = await res.json();
      setCurrentPresetId('custom-ai');
      setKit(data);
      setCurrentTempo(data.tempo || 120);
      audioEngine.loadKit(data);
      setShowAiGenerator(false);
    } catch (err) {
      console.error(err);
      alert(lang === 'fr' 
        ? "Génération AI impossible sans clé API active. Vous pouvez continuer à jouer avec les 4 super kits intégrés !"
        : "AI generation unavailable without active GEMINI_API_KEY. You can enjoy the 4 built-in Miaou kits!");
    } finally {
      setLoading(false);
    }
  };

  const togglePad = async (id: number) => {
    await initAudio();
    const isCurrentlyActive = activePads.has(id);
    if (isCurrentlyActive) {
      audioEngine.stopPad(id);
      setActivePads(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } else {
      audioEngine.playPad(id);
      setActivePads(prev => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
    }
  };

  const toggleRecording = async () => {
    await initAudio();
    if (isRecording) {
      setIsRecording(false);
      const blob = await audioEngine.stopRecording();
      const url = URL.createObjectURL(blob);
      setRecordedBlobUrl(url);
    } else {
      setRecordedBlobUrl(null);
      setIsRecording(true);
      audioEngine.startRecording();
    }
  };

  // Laser Pointer Toy
  const handleContainerClick = (e: React.MouseEvent) => {
    if (!laserActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setLaserPos({ x, y });
    audioEngine.playLaser();
  };

  // Purr-O-Meter calculation
  const getFelineStatus = () => {
    const count = activePads.size;
    if (count === 0) {
      return {
        text: lang === 'fr' ? 'SIESTE DU CHATON' : 'CAT NAP IDLE',
        sub: lang === 'fr' ? 'Touchez les pads pour réveiller le groove' : 'Tap pads to start the groove',
        emoticon: '(-.-)zZ',
        color: 'text-gray-500'
      };
    } else if (count <= 2) {
      return {
        text: lang === 'fr' ? 'OREILLES EN ÉVEIL' : 'EARS PERKED UP',
        sub: lang === 'fr' ? 'Les moustaches s\'accordent au tempo' : 'Whiskers tuning to the beat',
        emoticon: '(^・x・^)',
        color: 'text-amber-600'
      };
    } else if (count <= 5) {
      return {
        text: lang === 'fr' ? 'GROOVE DES COUSSINETS' : 'PAW BEAT GROOVE',
        sub: lang === 'fr' ? 'Danse féline synchronisée' : 'Feline groove in sync',
        emoticon: '(ฅ^•ﻌ•^ฅ) 🎵',
        color: 'text-rose-600'
      };
    } else {
      return {
        text: lang === 'fr' ? 'ZOOMIES DE 3H DU MATIN !' : '3 AM CAT ZOOMIES !',
        sub: lang === 'fr' ? 'Frénésie Miaou absolue !' : 'Unstoppable 8-bit energy!',
        emoticon: '( ✧Д✧)⚡⚡',
        color: 'text-orange-600'
      };
    }
  };

  const status = getFelineStatus();

  return (
    <div 
      className="min-h-screen bg-[#fafaf7] text-black flex flex-col font-sans selection:bg-amber-300 relative"
      onClick={handleContainerClick}
    >
      {/* Floating Laser Dot if active */}
      {laserActive && laserPos && (
        <div 
          className="absolute z-50 pointer-events-none w-5 h-5 -ml-2.5 -mt-2.5 rounded-full bg-red-600 shadow-[0_0_15px_6px_rgba(239,68,68,0.8)] animate-pulse"
          style={{ left: laserPos.x, top: laserPos.y }}
        />
      )}

      {/* Main Container */}
      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        
        {/* Top Bar: Language toggle & Controls */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black text-amber-300 rounded-xl flex items-center justify-center font-black text-xl shadow-sm border border-amber-400">
              🐾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight leading-none text-black">
                  BOZO CAT ARCADE
                </h1>
                <span className="bg-amber-300 border border-black text-black text-[10px] font-bold font-mono-ibm px-2 py-0.5 rounded-full uppercase">
                  Bozo Studio
                </span>
              </div>
              <p className="text-xs font-mono-ibm text-gray-500 uppercase tracking-wider mt-0.5">
                {lang === 'fr' ? 'Le studio Miaou 🐾' : "The Miaou Beatbox Studio 🐾"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Language switch */}
            <button
              onClick={() => setLang(l => l === 'fr' ? 'en' : 'fr')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-black rounded-full text-xs font-bold font-mono-ibm hover:bg-gray-100 transition-colors"
              title="Changer de langue / Change language"
            >
              <Globe size={14} />
              <span>{lang === 'fr' ? 'FR 🇫🇷' : 'EN 🇬🇧'}</span>
            </button>

            {/* Laser pointer toy toggle */}
            <button
              onClick={() => {
                setLaserActive(!laserActive);
                if (!laserActive) audioEngine.playLaser();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold font-mono-ibm border-2 border-black transition-all ${laserActive ? 'bg-red-500 text-white animate-pulse' : 'bg-white hover:bg-red-50 text-black'}`}
              title={lang === 'fr' ? 'Activer le pointeur laser interactif pour chat' : 'Toggle interactive cat laser pointer'}
            >
              <span>🔴</span>
              <span>{lang === 'fr' ? 'Laser Toy' : 'Laser Toy'}</span>
            </button>

            {/* Record Button */}
            <button 
              onClick={toggleRecording}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold font-mono-ibm border-2 border-black transition-all ${isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-black text-white hover:bg-gray-800'}`}
            >
              {isRecording ? <Square size={12} fill="currentColor" /> : <div className="w-2.5 h-2.5 rounded-full bg-red-500" />}
              <span>{isRecording ? `${recordSeconds}s REC` : (lang === 'fr' ? 'Enregistrer' : 'Record')}</span>
            </button>

            {/* Download Recording */}
            {recordedBlobUrl && !isRecording && (
              <a 
                href={recordedBlobUrl} 
                download="chat-retro-jam.webm"
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white border-2 border-black rounded-full text-xs font-bold font-mono-ibm hover:bg-emerald-700 transition-all shadow-sm"
                title={lang === 'fr' ? 'Télécharger l\'enregistrement' : 'Download recording'}
              >
                <Download size={14} />
                <span>{lang === 'fr' ? 'Télécharger' : 'Download'}</span>
              </a>
            )}
          </div>
        </header>

        {/* Hero Section: Interactive Pixel Cat & Status Meter */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white border-2 border-black rounded-3xl p-5 shadow-sm">
          
          {/* Left: Pixel Cat Mascot */}
          <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-black/10 pb-4 md:pb-0 md:pr-4">
            <PixelCat 
              isPlaying={activePads.size > 0}
              activePadCount={activePads.size}
              tempo={currentTempo}
              onPet={() => audioEngine.playPurr()}
              lang={lang}
            />
          </div>

          {/* Right: Kit stats & Purr-o-meter */}
          <div className="md:col-span-8 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`text-sm sm:text-base font-black font-rose uppercase tracking-wider flex items-center gap-2 ${status.color}`}>
                  <span className="text-xl">{status.emoticon}</span>
                  {status.text}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono-ibm font-bold bg-[#fafaf7] px-2.5 py-1 rounded-lg border border-black">
                    {lang === 'fr' ? 'Tonalité :' : 'Key:'} <span className="text-amber-700">{kit.key}</span>
                  </span>
                  <span className="text-xs font-mono-ibm font-bold bg-[#fafaf7] px-2.5 py-1 rounded-lg border border-black">
                    {currentTempo} BPM
                  </span>
                </div>
              </div>
              <p className="text-xs font-mono-ibm text-gray-500">
                {status.sub}
              </p>
            </div>

            {/* Purr-o-meter Bar */}
            <div>
              <div className="flex justify-between items-center text-[10px] font-mono-ibm uppercase font-bold text-gray-500 mb-1">
                <span>{lang === 'fr' ? 'Jauge de Ronronnement' : 'Purr-o-meter'}</span>
                <span>{activePads.size} / 8 {lang === 'fr' ? 'coussinets actifs' : 'pads playing'}</span>
              </div>
              <div className="w-full h-3 bg-gray-100 border-2 border-black rounded-full overflow-hidden flex p-0.5 gap-1">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-full rounded-sm transition-all duration-300 ${
                      i < activePads.size 
                        ? (i < 3 ? 'bg-amber-400' : i < 6 ? 'bg-orange-500' : 'bg-red-500 animate-pulse') 
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Quick Actions & Tempo controller */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-black/10">
              <div className="flex items-center gap-2">
                <button
                  onClick={stopAllPads}
                  disabled={activePads.size === 0}
                  className="px-3 py-1 bg-gray-100 border border-black rounded-lg text-xs font-mono-ibm font-bold hover:bg-gray-200 disabled:opacity-40 transition-colors"
                >
                  {lang === 'fr' ? 'Arrêter tout (Espace)' : 'Stop All (Space)'}
                </button>
                <button
                  onClick={() => {
                    [0, 1, 2, 3].forEach(id => {
                      if (!activePads.has(id)) togglePad(id);
                    });
                  }}
                  className="px-3 py-1 bg-amber-100 border border-black rounded-lg text-xs font-mono-ibm font-bold hover:bg-amber-200 transition-colors"
                >
                  {lang === 'fr' ? 'Activer Groove Félin' : 'Play Feline Groove'}
                </button>
              </div>

              {/* Tempo Slider & Tap Tempo Button */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-[11px] font-mono-ibm font-bold text-gray-600 uppercase">Tempo:</span>
                <input 
                  type="range"
                  min="60"
                  max="190"
                  value={currentTempo}
                  onChange={(e) => handleTempoChange(parseInt(e.target.value, 10))}
                  className="w-20 sm:w-24 accent-black cursor-pointer"
                />
                <span className="text-xs font-mono-ibm font-bold w-14 text-right">
                  {currentTempo} <span className="text-[10px] text-gray-500">BPM</span>
                </span>

                {/* Tap Tempo Button */}
                <button
                  type="button"
                  onClick={handleTapTempo}
                  className={`px-3 py-1.5 rounded-xl border-2 border-black font-mono-ibm font-bold text-xs flex items-center gap-1.5 transition-all select-none active:scale-95 ${
                    isTapFlashing 
                      ? 'bg-amber-400 text-black shadow-inner scale-95 ring-2 ring-black' 
                      : 'bg-white hover:bg-amber-50 text-black shadow-sm hover:shadow'
                  }`}
                  title={lang === 'fr' ? 'Tapez en rythme pour ajuster le tempo (raccourci : touche T)' : 'Tap in time to set beats per minute (shortcut: T key)'}
                >
                  <span className="text-sm">🐾</span>
                  <span className="tracking-wider text-[11px] font-black">TAP TEMPO</span>
                  {tapCount > 1 && (
                    <span className="text-[10px] bg-black text-amber-300 px-1.5 py-0.2 rounded font-mono-ibm font-black animate-pulse">
                      {tapCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Kits Switcher & Gemini AI Generator */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs uppercase font-rose font-black tracking-widest text-black flex items-center gap-1.5">
              <span>🎛️</span>
              <span>{lang === 'fr' ? 'Kits Rétro Miaou & Chat' : 'Retro Miaou & Cat Kits'}</span>
            </span>

            <button
              onClick={() => setShowAiGenerator(!showAiGenerator)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono-ibm border-2 border-black transition-all ${showAiGenerator ? 'bg-amber-400 text-black' : 'bg-white hover:bg-amber-50 text-black'}`}
            >
              <Sparkles size={13} />
              <span>{lang === 'fr' ? 'Générer avec Gemini AI' : 'Generate with Gemini AI'}</span>
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_KITS.map(preset => {
              const isSelected = currentPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => loadPreset(preset)}
                  className={`flex flex-col items-start p-3 rounded-2xl border-2 transition-all text-left ${isSelected ? 'bg-black text-white border-black shadow-md' : 'bg-white text-black border-black/40 hover:border-black hover:bg-gray-50'}`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-lg">{preset.emoji}</span>
                    <span className={`text-[10px] font-mono-ibm uppercase px-1.5 py-0.5 rounded ${isSelected ? 'bg-amber-400 text-black font-bold' : 'bg-gray-100 text-gray-600'}`}>
                      {preset.config.key}
                    </span>
                  </div>
                  <span className="font-rose font-bold text-sm uppercase leading-tight">
                    {preset.name}
                  </span>
                  <span className={`text-[10px] line-clamp-1 mt-0.5 ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                    {lang === 'fr' ? preset.taglineFr : preset.tagline}
                  </span>
                </button>
              );
            })}
          </div>

          {/* AI Generator Drawer */}
          {showAiGenerator && (
            <div className="p-4 bg-amber-50 border-2 border-black rounded-2xl flex flex-col gap-3 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono-ibm uppercase text-black flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-600" />
                  {lang === 'fr' ? 'Création de Kit Félin par IA' : 'AI Miaou Kit Generator'}
                </span>
                <span className="text-[11px] font-mono-ibm text-gray-500">
                  {lang === 'fr' ? 'Alimenté par Gemini 3.1 Flash' : 'Powered by Gemini 3.1 Flash'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono-ibm font-bold uppercase text-gray-700 block mb-1">
                    {lang === 'fr' ? 'Ambiance / Style' : 'Vibe / Style'}
                  </label>
                  <select
                    value={selectedVibe}
                    onChange={(e) => setSelectedVibe(e.target.value)}
                    disabled={loading}
                    className="w-full px-3 py-2 bg-white border-2 border-black rounded-xl text-xs font-bold font-mono-ibm"
                  >
                    {VIBES.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono-ibm font-bold uppercase text-gray-700 block mb-1">
                    {lang === 'fr' ? 'Tonalité musicale' : 'Musical Key'}
                  </label>
                  <select
                    value={selectedKey}
                    onChange={(e) => setSelectedKey(e.target.value)}
                    disabled={loading}
                    className="w-full px-3 py-2 bg-white border-2 border-black rounded-xl text-xs font-bold font-mono-ibm"
                  >
                    {KEYS.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
              </div>

              <button
                onClick={generateKitWithAi}
                disabled={loading}
                className="w-full py-2.5 bg-black hover:bg-gray-800 text-white rounded-xl font-bold font-mono-ibm text-xs uppercase transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>{lang === 'fr' ? 'Synthèse en cours...' : 'Synthesizing Miaou kit...'}</span>
                  </>
                ) : (
                  <>
                    <Zap size={14} className="text-amber-400" />
                    <span>{lang === 'fr' ? 'Générer nouveau Kit Arcade' : 'Generate New Arcade Kit'}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Feline Soundboard / Live SFX Bar */}
        <CatSoundboard lang={lang} />

        {/* 8-Pad Glitch / Jam Grid */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-rose font-black tracking-widest text-black flex items-center gap-1.5">
              <span>🎹</span>
              <span>{lang === 'fr' ? 'Grille des 8 Coussinets (Pads)' : '8-Pad Drum & Synth Grid'}</span>
            </span>
            <span className="text-[11px] font-mono-ibm text-gray-500 uppercase">
              {lang === 'fr' ? 'Raccourcis clavier : Q W E R / A S D F' : 'Shortcuts: Q W E R / A S D F'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {kit.pads.map((pad, idx) => {
              const isActive = activePads.has(pad.id);
              const shortcut = KEYBOARD_SHORTCUTS[idx] || '';

              return (
                <div 
                  key={pad.id}
                  onClick={() => togglePad(pad.id)}
                  className={`flex w-full cursor-pointer transition-all active:scale-[0.99] select-none border-2 border-black rounded-2xl overflow-hidden shadow-sm hover:shadow-md ${isActive ? 'ring-2 ring-amber-400' : ''}`}
                >
                  {/* Left Side: Info & Toggle */}
                  <div className={`relative flex-none w-[42%] flex flex-col justify-between p-3.5 transition-colors ${isActive ? 'bg-[#e5e5dd]' : 'bg-[#eeeee7]'}`}>
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-amber-500" />}
                    
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] font-mono-ibm font-bold px-1.5 py-0.5 rounded bg-black/10 text-black">
                        KEY [{shortcut}]
                      </span>
                      <span className={`text-[10px] font-bold font-mono-ibm uppercase px-2 py-0.5 rounded-full ${isActive ? 'bg-black text-amber-300' : 'bg-gray-300 text-gray-700'}`}>
                        {isActive ? 'ON' : 'OFF'}
                      </span>
                    </div>

                    <div className="my-1">
                      <h2 className="font-rose uppercase font-black text-[15px] sm:text-[17px] leading-tight text-black">
                        {pad.name.split(' ').map((word, i) => (
                          <React.Fragment key={i}>
                            {word}
                            {i < pad.name.split(' ').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </h2>
                      <p className="font-mono-ibm text-gray-600 text-[11px] capitalize mt-0.5">
                        {pad.type}
                      </p>
                    </div>

                    <div className="text-[9px] font-mono-ibm text-gray-500 uppercase">
                      {pad.synthParams?.oscillatorType || 'square'} osc
                    </div>
                  </div>

                  {/* Right Side: Pixel Visualizer */}
                  <div className="w-[58%] flex flex-col justify-center bg-[#1f2426]">
                    <PixelGrid active={isActive} padId={pad.id} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Audio Effects Section (XY Pads & Studio Faders) */}
        <section className="flex flex-col gap-3 pb-8">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-rose font-black tracking-widest text-black flex items-center gap-1.5">
              <span>🎚️</span>
              <span>{lang === 'fr' ? 'Effets Studio Miaou & Filtres' : 'Miaou Effects & Filters'}</span>
            </span>
            <span className="text-[11px] font-mono-ibm text-gray-500 uppercase">
              {lang === 'fr' ? 'Glissez pour sculpter le son en direct' : 'Drag to sculpt sound live'}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <XYPad 
              title1="FILTRE" 
              title2="SWEEP" 
              initialX={1.0} 
              initialY={0.0} 
              onChange={(x, y) => audioEngine.setFilter(x, y)} 
            />
            <XYPad 
              title1="ÉCHO" 
              title2="DELAY" 
              initialX={0.0} 
              initialY={0.0} 
              onChange={(x, y) => audioEngine.setDelay(x, y)} 
            />
            <StudioFader 
              title1="BIT" 
              title2="CRUSH" 
              initialValue={0.0} 
              onChange={(v) => audioEngine.setBitcrush(v)} 
            />
            <StudioFader 
              title1="SALLE" 
              title2="REVERB" 
              initialValue={0.0} 
              onChange={(v) => audioEngine.setReverb(v)} 
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-black/20 pt-4 pb-8 flex flex-wrap items-center justify-between text-xs font-mono-ibm text-gray-500">
          <div className="flex items-center gap-2">
            <span>🐾</span>
            <span>{lang === 'fr' ? 'Spéciale kassdédie à toustes les chat.te.s mélomanes et beatmakeureuses de la street' : 'Special shout-out to all feline music lovers and street beatmakers'}</span>
          </div>
          <div>
            <span>YuzuBoz • Miaou Prod • </span>
          </div>
        </footer>

      </div>
    </div>
  );
}
