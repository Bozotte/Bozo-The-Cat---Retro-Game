import React from 'react';
import { audioEngine } from './audioEngine';

interface CatSoundboardProps {
  lang: 'fr' | 'en';
  onSoundTriggered?: (name: string) => void;
}

export const CatSoundboard: React.FC<CatSoundboardProps> = ({ lang, onSoundTriggered }) => {
  const sounds = [
    {
      id: 'meow-high',
      emoji: '🐱',
      nameFr: 'Miaou Aigu',
      nameEn: 'Kitten Meow',
      color: 'bg-amber-100 hover:bg-amber-200 border-amber-500 text-amber-900',
      action: () => audioEngine.playMeow(1.35)
    },
    {
      id: 'meow-low',
      emoji: '🐈',
      nameFr: 'Miaou Grave',
      nameEn: 'Boss Meow',
      color: 'bg-orange-100 hover:bg-orange-200 border-orange-500 text-orange-900',
      action: () => audioEngine.playMeow(0.85)
    },
    {
      id: 'purr',
      emoji: '💖',
      nameFr: 'Ronron',
      nameEn: 'Purr Box',
      color: 'bg-rose-100 hover:bg-rose-200 border-rose-500 text-rose-900',
      action: () => audioEngine.playPurr()
    },
    {
      id: 'scratch',
      emoji: '🐾',
      nameFr: 'Griffe FX',
      nameEn: 'Scratch FX',
      color: 'bg-purple-100 hover:bg-purple-200 border-purple-500 text-purple-900',
      action: () => audioEngine.playScratch()
    },
    {
      id: 'laser',
      emoji: '🔴',
      nameFr: 'Laser Toy',
      nameEn: 'Laser Zap',
      color: 'bg-red-100 hover:bg-red-200 border-red-500 text-red-900',
      action: () => audioEngine.playLaser()
    },
    {
      id: 'tuna',
      emoji: '🐟',
      nameFr: 'Boîte Thon',
      nameEn: 'Tuna Coin',
      color: 'bg-cyan-100 hover:bg-cyan-200 border-cyan-500 text-cyan-900',
      action: () => audioEngine.playFishChime()
    },
    {
      id: 'hiss',
      emoji: '😾',
      nameFr: 'Feulement',
      nameEn: 'Hiss 8-bit',
      color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-500 text-yellow-900',
      action: () => audioEngine.playHiss()
    }
  ];

  return (
    <div className="w-full bg-[#faf9f5] border-2 border-black rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🐱</span>
          <span className="text-xs uppercase font-rose font-black tracking-widest text-black">
            {lang === 'fr' ? 'Boîte à Sons Félins (Instant SFX)' : 'Feline Soundboard (Instant SFX)'}
          </span>
        </div>
        <span className="text-[11px] font-mono-ibm text-gray-500 uppercase">
          {lang === 'fr' ? 'Jouable en direct par-dessus le beat' : 'Jam live over the beat'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {sounds.map(s => (
          <button
            key={s.id}
            onClick={() => {
              s.action();
              onSoundTriggered?.(lang === 'fr' ? s.nameFr : s.nameEn);
            }}
            className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all active:scale-95 shadow-sm hover:shadow ${s.color}`}
          >
            <span className="text-xl mb-1">{s.emoji}</span>
            <span className="text-[11px] font-bold font-mono-ibm uppercase tracking-wider text-center leading-tight">
              {lang === 'fr' ? s.nameFr : s.nameEn}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
