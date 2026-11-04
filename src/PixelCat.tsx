import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Heart } from 'lucide-react';

interface PixelCatProps {
  isPlaying: boolean;
  activePadCount: number;
  tempo: number;
  onPet: () => void;
  lang: 'fr' | 'en';
}

export type CatColorTheme = 'ginger' | 'black' | 'white' | 'calico' | 'cyber';

export const PixelCat: React.FC<PixelCatProps> = ({
  isPlaying,
  activePadCount,
  tempo,
  onPet,
  lang
}) => {
  const [catColor, setCatColor] = useState<CatColorTheme>('ginger');
  const [frame, setFrame] = useState(0);
  const [isPetted, setIsPetted] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [speech, setSpeech] = useState<string>('');
  const [isBlinking, setIsBlinking] = useState(false);
  const petTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Animation cycle driven by tempo if playing, or gentle 2Hz idle
  useEffect(() => {
    const fps = isPlaying ? Math.max(4, Math.min(12, Math.floor(tempo / 15))) : 3;
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % 8);
    }, 1000 / fps);
    return () => clearInterval(interval);
  }, [isPlaying, tempo]);

  // Periodic random blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 3200 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Playful speech bubble changes based on activity
  useEffect(() => {
    const frPhrasesIdle = [
      "Moi c'est Bozo le chat ! 🐾",
      "Touche les pads pour faire danser Bozo !",
      "Ronron... Bozo est prêt pour le show !",
      "Tape le tempo en rythme avec Bozo !",
      "Miaou ! Gratte l'oreille de Bozo !",
    ];
    const enPhrasesIdle = [
      "I'm Bozo the Cat! 🐾",
      "Tap the pads to make Bozo dance!",
      "Purrr... Bozo is ready to jam!",
      "Tap the tempo to match Bozo's groove!",
      "Meow! Scratch Bozo's ears!",
    ];
    const frPhrasesJam = [
      "Bozo adore ce son Miaou ! 🎵",
      "Groove de Bozo activé !",
      "Miaou ! Les zoomies de Bozo arrivent !",
      "Bozo sent le rythme dans ses moustaches !",
      "Bozo Cat Arcade en folie !",
    ];
    const enPhrasesJam = [
      "Bozo loves this Miaou beat! 🎵",
      "Bozo's feline groove activated!",
      "Meow! Bozo's 3 AM zoomies are here!",
      "Bozo's whiskers are vibrating!",
      "Bozo Cat Arcade in full flow!",
    ];

    const pool = activePadCount > 0 
      ? (lang === 'fr' ? frPhrasesJam : enPhrasesJam)
      : (lang === 'fr' ? frPhrasesIdle : enPhrasesIdle);
    
    setSpeech(pool[Math.floor(Math.random() * pool.length)]);
  }, [activePadCount, lang]);

  const handleCatClick = (e: React.MouseEvent) => {
    onPet();
    setIsPetted(true);
    if (petTimeoutRef.current) clearTimeout(petTimeoutRef.current);
    petTimeoutRef.current = setTimeout(() => setIsPetted(false), 1200);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newHeart = { id: Date.now() + Math.random(), x, y };
    setHearts(prev => [...prev.slice(-4), newHeart]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 900);

    setSpeech(lang === 'fr' ? "Ronron... Bozo vous aime ! 💕" : "Purrrr... Bozo loves you! 💕");
  };

  // Color mapping
  const palette = {
    ginger: { main: '#f97316', secondary: '#fdba74', dark: '#c2410c', ear: '#fb7185', eyes: '#10b981' },
    black: { main: '#18181b', secondary: '#3f3f46', dark: '#09090b', ear: '#f43f5e', eyes: '#facc15' },
    white: { main: '#f8fafc', secondary: '#e2e8f0', dark: '#94a3b8', ear: '#f472b6', eyes: '#0ea5e9' },
    calico: { main: '#f59e0b', secondary: '#18181b', dark: '#b45309', ear: '#fb7185', eyes: '#10b981' },
    cyber: { main: '#06b6d4', secondary: '#ec4899', dark: '#0891b2', ear: '#a855f7', eyes: '#e11d48' },
  }[catColor];

  // Head and body bounce based on frame and activePadCount
  const bounceY = isPlaying ? (frame % 2 === 0 ? -3 : 2) : 0;
  const earTwitch = isPlaying && frame % 4 === 0;
  const tailAngle = isPlaying ? Math.sin(frame * 0.8) * 20 : Math.sin(frame * 0.4) * 8;
  const pawStep = isPlaying ? (frame % 2 === 0 ? 1 : -1) : 0;

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Speech Bubble */}
      <div className="relative mb-2 px-3 py-1.5 bg-black text-white text-xs md:text-sm font-mono-ibm font-bold rounded-lg shadow-md border-2 border-amber-400 flex items-center gap-1.5 max-w-xs text-center transition-all animate-bounce duration-1000">
        <span className="text-amber-400">🐾</span>
        <span>{speech}</span>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-8 border-t-black"></div>
      </div>

      {/* Interactive Cat Frame */}
      <div 
        onClick={handleCatClick}
        className="relative group cursor-pointer p-2 rounded-2xl bg-[#f5f5ee] border-2 border-black hover:border-amber-500 hover:shadow-lg transition-all"
        title={lang === 'fr' ? "Clique pour caresser le chat !" : "Click to pet the cat!"}
      >
        {/* Floating Heart Particles */}
        {hearts.map(h => (
          <div 
            key={h.id}
            className="absolute pointer-events-none text-red-500 animate-ping font-bold text-sm"
            style={{ left: h.x, top: h.y - 10 }}
          >
            ❤️
          </div>
        ))}

        {/* 8-bit Pixel SVG Cat */}
        <div 
          className="w-36 h-28 flex items-center justify-center transition-transform"
          style={{ transform: `translateY(${bounceY}px)` }}
        >
          <svg 
            viewBox="0 0 48 36" 
            className="w-full h-full drop-shadow-sm shape-rendering-crisp"
            style={{ imageRendering: 'pixelated' }}
          >
            {/* Tail */}
            <g style={{ transformOrigin: '36px 28px', transform: `rotate(${tailAngle}deg)` }}>
              <rect x="36" y="24" width="4" height="4" fill={palette.dark} />
              <rect x="40" y="20" width="4" height="6" fill={palette.main} />
              <rect x="42" y="16" width="4" height="6" fill={palette.secondary} />
            </g>

            {/* Body */}
            <rect x="12" y="18" width="24" height="13" rx="2" fill={palette.main} />
            <rect x="16" y="20" width="14" height="9" fill={palette.secondary} opacity="0.6" />

            {/* Back stripes / spots */}
            <rect x="20" y="18" width="2" height="6" fill={palette.dark} />
            <rect x="26" y="18" width="2" height="6" fill={palette.dark} />

            {/* Head */}
            <rect x="10" y="8" width="18" height="15" rx="2" fill={palette.main} />
            
            {/* Left Ear */}
            <polygon 
              points="10,8 14,8 11,2" 
              fill={palette.dark} 
              style={{ transform: earTwitch ? 'translateY(-1px)' : 'none' }} 
            />
            <polygon points="11,7 13,7 12,4" fill={palette.ear} />

            {/* Right Ear */}
            <polygon 
              points="24,8 28,8 27,2" 
              fill={palette.dark} 
              style={{ transform: earTwitch ? 'translateY(-1px)' : 'none' }} 
            />
            <polygon points="25,7 27,7 26,4" fill={palette.ear} />

            {/* Eyes */}
            {isBlinking || isPetted ? (
              // Happy squinting eyes ^ ^
              <>
                <path d="M 13 14 Q 15 11 17 14" stroke="#000" strokeWidth="1.5" fill="none" />
                <path d="M 21 14 Q 23 11 25 14" stroke="#000" strokeWidth="1.5" fill="none" />
              </>
            ) : (
              // Open 8-bit eyes with glow
              <>
                <rect x="13" y="12" width="4" height="4" fill="#000" />
                <rect x="13.5" y="12.5" width="2.5" height="3" fill={palette.eyes} />
                <rect x="14" y="13" width="1" height="1" fill="#fff" />

                <rect x="21" y="12" width="4" height="4" fill="#000" />
                <rect x="21.5" y="12.5" width="2.5" height="3" fill={palette.eyes} />
                <rect x="22" y="13" width="1" height="1" fill="#fff" />
              </>
            )}

            {/* Pink Nose */}
            <polygon points="18.5,17 19.5,17 19,18" fill="#fb7185" />

            {/* Cat mouth :3 */}
            <path d="M 17 19 Q 18 20 19 19 Q 20 20 21 19" stroke="#333" strokeWidth="0.8" fill="none" />

            {/* Whiskers */}
            <line x1="8" y1="16" x2="12" y2="17" stroke="#1f2937" strokeWidth="0.8" />
            <line x1="8" y1="18" x2="12" y2="18" stroke="#1f2937" strokeWidth="0.8" />
            <line x1="26" y1="17" x2="30" y2="16" stroke="#1f2937" strokeWidth="0.8" />
            <line x1="26" y1="18" x2="30" y2="18" stroke="#1f2937" strokeWidth="0.8" />

            {/* Paws */}
            {/* Left front paw */}
            <rect 
              x="13" 
              y={29 + (pawStep > 0 ? -1 : 0)} 
              width="4" 
              height="4" 
              rx="1" 
              fill={palette.secondary} 
              stroke={palette.dark} 
              strokeWidth="0.5" 
            />
            {/* Right front paw */}
            <rect 
              x="20" 
              y={29 + (pawStep < 0 ? -1 : 0)} 
              width="4" 
              height="4" 
              rx="1" 
              fill={palette.secondary} 
              stroke={palette.dark} 
              strokeWidth="0.5" 
            />
            {/* Back paw */}
            <rect x="30" y="29" width="4" height="3" rx="1" fill={palette.secondary} stroke={palette.dark} strokeWidth="0.5" />
          </svg>
        </div>

        {/* Pet me tooltip */}
        <div className="text-[10px] uppercase font-bold text-gray-500 text-center tracking-wider mt-0.5">
          {isPetted ? (lang === 'fr' ? '💕 Ronron !' : '💕 Purring!') : (lang === 'fr' ? 'Caresser 🐾' : 'Pet me 🐾')}
        </div>
      </div>

      {/* Cat Coat / Theme Selector */}
      <div className="flex items-center gap-1 mt-2">
        {(['ginger', 'black', 'white', 'calico', 'cyber'] as CatColorTheme[]).map(theme => (
          <button
            key={theme}
            onClick={() => setCatColor(theme)}
            className={`w-5 h-5 rounded-full border-2 transition-transform ${catColor === theme ? 'scale-125 border-black ring-2 ring-amber-400' : 'border-gray-300 opacity-70 hover:opacity-100'} ${
              theme === 'ginger' ? 'bg-orange-500' :
              theme === 'black' ? 'bg-zinc-800' :
              theme === 'white' ? 'bg-slate-100' :
              theme === 'calico' ? 'bg-amber-700' : 'bg-cyan-400'
            }`}
            title={`Cat coat: ${theme}`}
          />
        ))}
      </div>
    </div>
  );
};
