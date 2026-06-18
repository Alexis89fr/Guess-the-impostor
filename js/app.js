import { getRandomPair } from "./words.js";
import { SetupScreen } from "./components/setup.js";
import { DistributionScreen } from "./components/distribution.js";
import { GameScreen } from "./components/game.js";
import { ResultScreen } from "./components/result.js";

/**
 * Contrôleur principal de l'application (SPA App Engine)
 */
class App {
  constructor() {
    this.container = document.getElementById("app");
    this.state = {
      playerNames: this.loadFromLocalStorage("playerNames", ["Alice", "Bob", "Charlie", "David"]),
      impostorCount: parseInt(this.loadFromLocalStorage("impostorCount", "1"), 10),
      assignedRoles: [],
      winner: null
    };
  }

  /**
   * Initialise l'application et affiche le premier écran
   */
  init() {
    this.showSetup();
  }

  /**
   * Affiche l'écran de configuration (Accueil)
   */
  showSetup() {
    const setup = new SetupScreen(this.container, this.state, (config) => {
      // Sauvegarder les paramètres dans le LocalStorage pour les parties futures
      this.saveToLocalStorage("playerNames", config.players);
      this.saveToLocalStorage("impostorCount", config.impostorCount);
      
      this.state.playerNames = config.players;
      this.state.impostorCount = config.impostorCount;
      
      this.showDistribution();
    });
    
    setup.render();
  }

  /**
   * Affiche l'écran de distribution secrète des mots
   */
  showDistribution() {
    // Choisir une nouvelle paire de mots secrète
    const currentWordPair = getRandomPair();
    
    const distribution = new DistributionScreen(
      this.container,
      this.state,
      currentWordPair,
      (assignedRoles) => {
        this.state.assignedRoles = assignedRoles;
        this.showGame();
      }
    );
    
    distribution.render();
  }

  /**
   * Affiche l'écran de jeu principal (descriptions & votes)
   */
  showGame() {
    const game = new GameScreen(
      this.container,
      this.state.assignedRoles,
      (winner, finalRoles) => {
        this.state.winner = winner;
        this.state.assignedRoles = finalRoles;
        this.showResult();
      }
    );
    
    game.render();
  }

  /**
   * Affiche l'écran final des résultats
   */
  showResult() {
    const result = new ResultScreen(
      this.container,
      this.state.winner,
      this.state.assignedRoles,
      () => {
        // Option 1 : Rejouer avec les mêmes configurations
        this.showDistribution();
      },
      () => {
        // Option 2 : Retourner à la configuration des joueurs
        this.showSetup();
      }
    );
    
    result.render();
  }

  /* --- UTILS LOCAL STORAGE --- */

  /**
   * Sauvegarde une valeur sérialisée en JSON dans le localStorage
   */
  saveToLocalStorage(key, value) {
    try {
      localStorage.setItem(`imposteur_game_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error("Erreur lors de l'enregistrement localStorage", e);
    }
  }

  /**
   * Charge et parse une valeur du localStorage ou retourne une valeur par défaut
   */
  loadFromLocalStorage(key, defaultValue) {
    try {
      const item = localStorage.getItem(`imposteur_game_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error("Erreur lors de la lecture localStorage", e);
      return defaultValue;
    }
  }
}

// Lancement automatique au chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();
});
