/**
 * Synthétiseur audio natif utilisant l'API Web Audio du navigateur.
 * Permet de générer des effets sonores dynamiquement sans télécharger de fichiers MP3.
 */
class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.volume = 0.5; // Volume par défaut (entre 0 et 1)
  }

  /**
   * Initialise le contexte audio (nécessaire après un clic utilisateur)
   */
  initContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  /**
   * Définit le volume général des effets sonores
   * @param {number} vol - Volume entre 0 et 1
   */
  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  /**
   * Crée un noeud de gain maître configuré avec le volume actuel
   * @returns {GainNode}
   */
  createMasterGain() {
    this.initContext();
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    gainNode.connect(this.ctx.destination);
    return gainNode;
  }

  /**
   * Son 1 : Clic d'interface doux (pop rond basse fréquence)
   */
  playClick() {
    try {
      const masterGain = this.createMasterGain();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      // Fréquence basse et douce
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch (e) {
      console.warn("Échec de lecture audio Click", e);
    }
  }

  /**
   * Son 2 : Son d'élimination (Poignard / Couteau dans la chair)
   */
  playSlash() {
    try {
      const masterGain = this.createMasterGain();
      const now = this.ctx.currentTime;
      const duration = 0.3;

      // 1. Impact métallique aigu de la lame (2000Hz -> 300Hz)
      const bladeOsc = this.ctx.createOscillator();
      const bladeGain = this.ctx.createGain();
      bladeOsc.type = "sine";
      bladeOsc.frequency.setValueAtTime(2200, now);
      bladeOsc.frequency.exponentialRampToValueAtTime(400, now + 0.08);
      
      bladeGain.gain.setValueAtTime(0.12, now);
      bladeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      
      bladeOsc.connect(bladeGain);
      bladeGain.connect(masterGain);

      // 2. Impact sourd de chair (Squish) via du bruit blanc filtré passe-bande
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseNode = this.ctx.createBufferSource();
      noiseNode.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      // Fréquence basse typique d'impact
      filter.frequency.setValueAtTime(350, now);
      filter.frequency.exponentialRampToValueAtTime(60, now + 0.2);
      filter.Q.setValueAtTime(4.5, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.45, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noiseNode.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(masterGain);

      bladeOsc.start(now);
      noiseNode.start(now);

      bladeOsc.stop(now + 0.12);
      noiseNode.stop(now + duration + 0.05);
    } catch (e) {
      console.warn("Échec de lecture audio Stab/Slash", e);
    }
  }

  /**
   * Son 3 : Fanfare triomphale de victoire des Citoyens
   */
  playWinnerCitizens() {
    try {
      const masterGain = this.createMasterGain();
      const now = this.ctx.currentTime;

      // Séquence de notes joyeuses (Arpège Majeur Do - C4, E4, G4, C5, E5)
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
      const noteDurations = [0.15, 0.15, 0.15, 0.25, 0.6];
      let timeOffset = 0;

      notes.forEach((freq, index) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + timeOffset);

        const duration = noteDurations[index];
        gain.gain.setValueAtTime(0, now + timeOffset);
        gain.gain.linearRampToValueAtTime(0.15, now + timeOffset + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + timeOffset + duration);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now + timeOffset);
        osc.stop(now + timeOffset + duration + 0.05);

        timeOffset += duration - 0.05; // Léger chevauchement
      });
    } catch (e) {
      console.warn("Échec de lecture audio Victoire Citoyens", e);
    }
  }

  /**
   * Son 4 : Ambiance sombre, dissonante et très angoissante de victoire de l'Imposteur (Longue durée)
   */
  playWinnerImpostors() {
    try {
      const masterGain = this.createMasterGain();
      const now = this.ctx.currentTime;
      const duration = 4.5; // Plus long

      // Drone basse désaccordé créant un effet de tension (55Hz / 57Hz / 82Hz / 110Hz)
      const baseFreq = 50; 
      const frequencies = [baseFreq, baseFreq + 2.5, baseFreq * 1.5 - 1, baseFreq * 1.88 + 1.5, baseFreq * 2.05];
      
      frequencies.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        // Dent de scie et triangle mélangés
        osc.type = idx % 2 === 0 ? "sawtooth" : "triangle";
        osc.frequency.setValueAtTime(freq, now);
        
        // Tremolo lent sur le volume (LFO)
        const tremolo = this.ctx.createOscillator();
        const tremoloGain = this.ctx.createGain();
        tremolo.frequency.value = 4.5; // Battement à 4.5Hz
        tremoloGain.gain.setValueAtTime(0.3, now);
        
        // LFO de pitch pour un sentiment d'instabilité
        const vibrato = this.ctx.createOscillator();
        const vibratoGain = this.ctx.createGain();
        vibrato.frequency.value = 0.8; // Oscillation très lente (0.8Hz)
        vibratoGain.gain.setValueAtTime(3.0, now); // Amplitude de pitch de 3Hz
        
        vibrato.connect(vibratoGain);
        vibratoGain.connect(osc.frequency);
        
        // Filtre passe-bas modulant
        const filter = this.ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(250, now);
        filter.frequency.exponentialRampToValueAtTime(90, now + duration);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.3); // Entrée en fondu lente
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        vibrato.start(now);
        tremolo.start(now);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + duration + 0.1);
        vibrato.stop(now + duration + 0.1);
        tremolo.stop(now + duration + 0.1);
      });
    } catch (e) {
      console.warn("Échec de lecture audio Victoire Imposteurs Angoissante", e);
    }
  }
}

export const audio = new AudioSynthesizer();
export default audio;
