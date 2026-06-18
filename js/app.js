import { getRandomPairFromThemes } from "./words.js";
import { HomeScreen } from "./components/home.js";
import { SettingsScreen } from "./components/settings.js";
import { SetupScreen } from "./components/setup.js";
import { DistributionScreen } from "./components/distribution.js";
import { GameScreen } from "./components/game.js";
import { ResultScreen } from "./components/result.js";
import { audio } from "./audio.js";

/**
 * Contrôleur principal de l'application (SPA App Engine)
 */
class App {
  constructor() {
    this.container = document.getElementById("app");
    
    // Chargement de l'état persistant
    this.state = {
      // Préférences
      language: this.loadFromLocalStorage("language", "fr"),
      theme: this.loadFromLocalStorage("theme", "violet"),
      volume: parseFloat(this.loadFromLocalStorage("volume", "0.5")),
      
      // Configuration de la partie
      playerNames: this.loadFromLocalStorage("playerNames", ["Alice", "Bob", "Charlie", "David"]),
      playerAvatars: this.loadFromLocalStorage("playerAvatars", [null, null, null, null]), // Base64 ou null
      impostorCount: parseInt(this.loadFromLocalStorage("impostorCount", "1"), 10),
      activeWordThemes: this.loadFromLocalStorage("activeWordThemes", ["classique"]),
      
      // Banque globale de profils enregistrés (noms + avatars sauvegardés par upload)
      savedProfiles: this.loadFromLocalStorage("savedProfiles", []),
      
      // État de la session de jeu courante
      assignedRoles: [],
      winner: null
    };
  }

  /**
   * Initialise l'application, applique les styles de thème et l'audio
   */
  init() {
    this.applyTheme(this.state.theme);
    audio.setVolume(this.state.volume);
    
    // Rendre l'écran d'accueil
    this.showHome();
  }

  /**
   * Applique le thème CSS sur la balise <body>
   * @param {string} themeName - Nom du thème (violet, emerald, amber, cyberpunk)
   */
  applyTheme(themeName) {
    document.body.className = "";
    document.body.classList.add(`theme-${themeName}`);
    
    // Mettre à jour la meta color du navigateur pour l'esthétique PWA mobile
    const themeColors = {
      violet: "#0d0e12",
      emerald: "#061f18",
      amber: "#241403",
      cyberpunk: "#040508"
    };
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", themeColors[themeName] || "#0d0e12");
    }
  }

  /**
   * Écran d'accueil
   */
  showHome() {
    const home = new HomeScreen(
      this.container,
      this.state,
      () => this.showSetup(),      // Aller au jeu (configuration)
      () => this.showSettings()    // Aller aux paramètres
    );
    home.render();
  }

  /**
   * Écran des paramètres
   */
  showSettings() {
    const settings = new SettingsScreen(
      this.container,
      this.state,
      () => {
        // En sortant, on enregistre tout
        this.saveToLocalStorage("language", this.state.language);
        this.saveToLocalStorage("theme", this.state.theme);
        this.saveToLocalStorage("volume", this.state.volume);
        this.showHome();
      },
      (newTheme) => {
        this.applyTheme(newTheme);
      }
    );
    settings.render();
  }

  /**
   * Écran de configuration des joueurs et des mots
   */
  showSetup() {
    const setup = new SetupScreen(this.container, this.state, (config) => {
      // Sauvegarder les configurations
      this.saveToLocalStorage("playerNames", config.players);
      this.saveToLocalStorage("playerAvatars", config.avatars);
      this.saveToLocalStorage("impostorCount", config.impostorCount);
      this.saveToLocalStorage("activeWordThemes", config.activeWordThemes);
      this.saveToLocalStorage("savedProfiles", this.state.savedProfiles); // Enregistré durant l'écran
      
      this.state.playerNames = config.players;
      this.state.playerAvatars = config.avatars;
      this.state.impostorCount = config.impostorCount;
      this.state.activeWordThemes = config.activeWordThemes;
      
      this.showDistribution();
    });
    
    setup.render();
  }

  /**
   * Écran de distribution secrète des rôles
   */
  showDistribution() {
    // Tirer au sort les mots du tour dans les thèmes actifs
    const currentWordPair = getRandomPairFromThemes(this.state.activeWordThemes);
    
    const distribution = new DistributionScreen(
      this.container,
      this.state,
      currentWordPair,
      (assignedRoles) => {
        this.state.assignedRoles = assignedRoles;
        this.showGame();
      },
      () => this.showHome()
    );
    
    distribution.render();
  }

  /**
   * Écran de jeu (descriptions à l'oral + vote direct)
   */
  showGame() {
    const game = new GameScreen(
      this.container,
      this.state, // Passer tout l'état pour la langue
      this.state.assignedRoles,
      (winner, finalRoles) => {
        this.state.winner = winner;
        this.state.assignedRoles = finalRoles;
        this.showResult();
      },
      () => this.showHome()
    );
    
    game.render();
  }

  /**
   * Écran final des résultats
   */
  showResult() {
    const result = new ResultScreen(
      this.container,
      this.state, // Pour la langue
      this.state.winner,
      this.state.assignedRoles,
      () => {
        // Rejouer avec les mêmes configurations de joueurs
        this.showDistribution();
      },
      () => {
        // Revenir à l'écran d'accueil
        this.showHome();
      }
    );
    
    result.render();
  }

  /* --- UTILS LOCAL STORAGE --- */

  saveToLocalStorage(key, value) {
    try {
      localStorage.setItem(`imposteur_game_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error("Erreur lors de l'enregistrement localStorage", e);
    }
  }

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
export default App;
