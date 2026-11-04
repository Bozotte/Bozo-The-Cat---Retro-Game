import { KitConfig } from './audioEngine';

export interface PresetKit {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  taglineFr: string;
  config: KitConfig;
}

export const PRESET_KITS: PresetKit[] = [
  {
    id: 'chaton-8bit',
    name: 'Bozo 8-Bit',
    emoji: '🐾',
    tagline: "Bozo's Signature Miaou & Miaou Synth",
    taglineFr: 'Groove signature de Bozo avec synthé miaou et ronronnements',
    config: {
      key: 'A Minor',
      tempo: 126,
      pads: [
        {
          id: 0,
          name: 'PATTES KICK',
          type: 'drum',
          synthParams: { oscillatorType: 'triangle' },
          sequence: ['C1', null, null, null, 'C1', null, null, null, 'C1', null, null, null, 'C1', null, null, 'C1']
        },
        {
          id: 1,
          name: 'POISSON SNARE',
          type: 'drum',
          synthParams: { oscillatorType: 'sawtooth' },
          sequence: [null, null, 'G2', null, null, null, 'G2', null, null, null, 'G2', null, null, null, 'G2', null]
        },
        {
          id: 2,
          name: 'RONRON BASS',
          type: 'bass',
          synthParams: { oscillatorType: 'square' },
          sequence: ['A1', null, 'A1', null, 'C2', null, 'D2', null, 'E2', null, 'G1', null, 'A1', null, 'E1', null]
        },
        {
          id: 3,
          name: 'MIAOU LEAD',
          type: 'lead',
          synthParams: { oscillatorType: 'sawtooth' },
          sequence: ['E4', 'G4', null, 'A4', null, 'C5', 'B4', null, 'A4', null, 'G4', 'E4', null, 'D4', 'E4', null]
        },
        {
          id: 4,
          name: 'GRIFFE SCRATCH',
          type: 'drum',
          synthParams: { oscillatorType: 'pwm' },
          sequence: [null, 'C3', null, 'C3', null, null, 'C3', null, null, 'C3', null, null, 'C3', null, 'C3', null]
        },
        {
          id: 5,
          name: 'PELOTE CHORDS',
          type: 'chord',
          synthParams: { oscillatorType: 'triangle' },
          sequence: ['A3', null, null, 'A3', 'C4', null, null, 'C4', 'E4', null, null, 'D4', 'A3', null, 'G3', null]
        },
        {
          id: 6,
          name: 'LASER CHASSE',
          type: 'lead',
          synthParams: { oscillatorType: 'square' },
          sequence: [null, 'A4', 'B4', 'C5', null, 'E5', 'D5', 'C5', null, 'A4', 'C5', 'E5', null, 'G5', 'E5', 'C5']
        },
        {
          id: 7,
          name: 'LAIT AMBIENT',
          type: 'chord',
          synthParams: { oscillatorType: 'sine' },
          sequence: ['C4', null, null, null, 'E4', null, null, null, 'G4', null, null, null, 'A4', null, null, null]
        }
      ]
    }
  },
  {
    id: 'zoomies-3am',
    name: 'Zoomies 3h',
    emoji: '⚡',
    tagline: 'High Speed Midnight Cat Arcade',
    taglineFr: 'Course frénétique de minuit à 148 BPM',
    config: {
      key: 'D Minor',
      tempo: 148,
      pads: [
        {
          id: 0,
          name: 'SPRINT KICK',
          type: 'drum',
          synthParams: { oscillatorType: 'triangle' },
          sequence: ['D1', null, 'D1', null, 'D1', null, 'D1', null, 'D1', null, 'D1', null, 'D1', 'D1', 'D1', null]
        },
        {
          id: 1,
          name: 'FEULE CLAP',
          type: 'drum',
          synthParams: { oscillatorType: 'sawtooth' },
          sequence: [null, null, 'A2', null, null, null, 'A2', null, null, null, 'A2', null, null, 'A2', null, 'A2']
        },
        {
          id: 2,
          name: 'TURBO BASS',
          type: 'bass',
          synthParams: { oscillatorType: 'sawtooth' },
          sequence: ['D2', 'D2', 'F2', 'D2', 'G2', 'D2', 'A2', 'G2', 'F2', 'D2', 'C2', 'D2', 'F2', 'G2', 'A2', 'C3']
        },
        {
          id: 3,
          name: 'HYPER MIAOU',
          type: 'lead',
          synthParams: { oscillatorType: 'square' },
          sequence: ['A4', 'D5', 'F5', 'A5', 'G5', 'F5', 'E5', 'D5', 'C5', 'D5', 'E5', 'F5', 'D5', null, 'A4', null]
        },
        {
          id: 4,
          name: 'CHAOS PATTES',
          type: 'drum',
          synthParams: { oscillatorType: 'pwm' },
          sequence: ['D2', null, 'F2', null, null, 'D2', null, 'F2', 'D2', null, 'A2', null, null, 'D2', 'F2', null]
        },
        {
          id: 5,
          name: 'LASER BEAM',
          type: 'lead',
          synthParams: { oscillatorType: 'sawtooth' },
          sequence: ['F5', 'E5', 'D5', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5', null, 'F5', null, 'D5', null, 'E5', null]
        },
        {
          id: 6,
          name: 'CANAPÉ GRATT',
          type: 'drum',
          synthParams: { oscillatorType: 'square' },
          sequence: [null, 'A3', null, 'A3', null, 'A3', null, 'A3', null, 'A3', null, 'A3', null, 'A3', null, 'A3']
        },
        {
          id: 7,
          name: 'ALERTE SOURIS',
          type: 'chord',
          synthParams: { oscillatorType: 'triangle' },
          sequence: ['D4', null, 'F4', null, 'A4', null, 'D5', null, 'A4', null, 'F4', null, 'D4', null, 'E4', null]
        }
      ]
    }
  },
  {
    id: 'sieste-soleil',
    name: 'Sieste Soleil',
    emoji: '☀️',
    tagline: 'Cozy Miaou Nap in Sunbeam',
    taglineFr: 'Bulle de douceur Miaou pour chat endormi',
    config: {
      key: 'F Major',
      tempo: 92,
      pads: [
        {
          id: 0,
          name: 'COUSSIN KICK',
          type: 'drum',
          synthParams: { oscillatorType: 'triangle' },
          sequence: ['F1', null, null, null, null, null, 'F1', null, 'F1', null, null, null, null, null, null, null]
        },
        {
          id: 1,
          name: 'DOUX SNARE',
          type: 'drum',
          synthParams: { oscillatorType: 'sine' },
          sequence: [null, null, null, null, 'C2', null, null, null, null, null, null, null, 'C2', null, null, null]
        },
        {
          id: 2,
          name: 'RONRON PROFOND',
          type: 'bass',
          synthParams: { oscillatorType: 'triangle' },
          sequence: ['F1', null, null, 'A1', null, null, 'C2', null, 'D2', null, null, 'C2', null, null, 'Bb1', null]
        },
        {
          id: 3,
          name: 'MELODIE DODO',
          type: 'lead',
          synthParams: { oscillatorType: 'sine' },
          sequence: ['A4', null, 'C5', null, 'F5', null, 'E5', null, 'D5', null, 'C5', null, 'A4', null, 'G4', null]
        },
        {
          id: 4,
          name: 'RAYON SOLEIL',
          type: 'chord',
          synthParams: { oscillatorType: 'triangle' },
          sequence: ['F3', null, null, 'A3', null, null, 'C4', null, 'G3', null, null, 'Bb3', null, null, 'D4', null]
        },
        {
          id: 5,
          name: 'BAILLEMENT',
          type: 'lead',
          synthParams: { oscillatorType: 'sawtooth' },
          sequence: [null, null, 'C5', null, null, null, 'A4', null, null, null, 'F4', null, null, null, 'G4', null]
        },
        {
          id: 6,
          name: 'BIRD WATCH',
          type: 'lead',
          synthParams: { oscillatorType: 'square' },
          sequence: [null, 'F5', null, 'G5', null, 'A5', null, null, null, 'C6', null, 'A5', null, 'G5', null, null]
        },
        {
          id: 7,
          name: 'NUAGE MOELLEUX',
          type: 'chord',
          synthParams: { oscillatorType: 'sine' },
          sequence: ['A3', null, null, null, 'C4', null, null, null, 'F4', null, null, null, 'E4', null, null, null]
        }
      ]
    }
  },
  {
    id: 'boss-arcade',
    name: 'Boss Battle',
    emoji: '👾',
    tagline: 'Dark 8-bit Dungeon Challenge',
    taglineFr: 'Bataille de boss Miaou sombre et rétro',
    config: {
      key: 'C Minor',
      tempo: 132,
      pads: [
        {
          id: 0,
          name: 'HEAVY KICK',
          type: 'drum',
          synthParams: { oscillatorType: 'triangle' },
          sequence: ['C1', null, null, 'C1', null, null, 'C1', null, 'C1', null, null, 'C1', null, null, 'C1', 'C1']
        },
        {
          id: 1,
          name: 'CRISP SNARE',
          type: 'drum',
          synthParams: { oscillatorType: 'sawtooth' },
          sequence: [null, null, 'G2', null, null, null, 'G2', null, null, null, 'G2', null, null, null, 'G2', 'Eb2']
        },
        {
          id: 2,
          name: 'DARK BASS',
          type: 'bass',
          synthParams: { oscillatorType: 'sawtooth' },
          sequence: ['C2', 'C2', 'Eb2', 'C2', 'G2', 'F2', 'Eb2', 'D2', 'C2', 'C2', 'Ab1', 'Bb1', 'C2', 'Eb2', 'D2', 'B1']
        },
        {
          id: 3,
          name: 'ARCADE ARPS',
          type: 'lead',
          synthParams: { oscillatorType: 'square' },
          sequence: ['C4', 'Eb4', 'G4', 'C5', 'Eb5', 'G5', 'Eb5', 'C5', 'Bb4', 'G4', 'Eb4', 'D4', 'C4', 'G4', 'C5', 'Eb5']
        },
        {
          id: 4,
          name: 'RETRO NOISE',
          type: 'drum',
          synthParams: { oscillatorType: 'pwm' },
          sequence: ['C2', 'C2', null, 'C2', 'C2', null, 'C2', null, 'C2', 'C2', null, 'C2', null, 'C2', 'C2', null]
        },
        {
          id: 5,
          name: 'DOOM CHORDS',
          type: 'chord',
          synthParams: { oscillatorType: 'sawtooth' },
          sequence: ['C3', null, null, 'Eb3', null, null, 'G3', null, 'Ab3', null, null, 'Bb3', null, null, 'G3', null]
        },
        {
          id: 6,
          name: 'HERO LEAD',
          type: 'lead',
          synthParams: { oscillatorType: 'square' },
          sequence: [null, 'G4', null, 'C5', null, 'D5', 'Eb5', null, 'D5', 'C5', 'Bb4', null, 'G4', null, 'C5', null]
        },
        {
          id: 7,
          name: 'LASER PULSE',
          type: 'lead',
          synthParams: { oscillatorType: 'sawtooth' },
          sequence: ['C5', 'C5', 'G5', 'G5', 'Ab5', 'Ab5', 'G5', 'F5', 'Eb5', 'Eb5', 'D5', 'D5', 'C5', null, 'G4', null]
        }
      ]
    }
  }
];
