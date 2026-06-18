import { audio } from "../audio.js";

/**
 * Composant de l'écran d'accueil (Home)
 */
export class HomeScreen {
  /**
   * @param {HTMLElement} container - Le conteneur HTML principal.
   * @param {Object} state - L'état global partagé.
   * @param {Function} onPlay - Callback pour lancer la partie.
   * @param {Function} onSettings - Callback pour ouvrir les paramètres.
   */
  constructor(container, state, onPlay, onSettings) {
    this.container = container;
    this.state = state;
    this.onPlay = onPlay;
    this.onSettings = onSettings;
  }

  /**
   * Traduit une clé en fonction de la langue courante
   */
  t(key) {
    const lang = this.state.language || "fr";
    const dict = {
      fr: {
        title: "L'Imposteur",
        subtitle: "Qui cache son jeu ?",
        play: "Jouer 🎮",
        settings: "Paramètres ⚙️",
        footer: "Jeu de société locale"
      },
      en: {
        title: "The Impostor",
        subtitle: "Who is hiding their game?",
        play: "Play 🎮",
        settings: "Settings ⚙️",
        footer: "Local party game"
      }
    };
    return dict[lang][key] || key;
  }

  /**
   * Rend l'écran d'accueil
   */
  render() {
    this.container.innerHTML = `
      <div class="screen home-screen">
        <div class="home-logo-container">
          <div class="home-logo-glow"></div>
          <div class="home-logo-icon">🕵️‍♂️</div>
        </div>

        <div style="text-align: center;">
          <h1 class="home-title" style="margin-bottom: 4px;">${this.t("title")}</h1>
          <p style="font-weight: 500; letter-spacing: 0.02em;">${this.t("subtitle")}</p>
        </div>

        <div class="setup-actions" style="width: 100%; max-width: 280px; margin-top: 12px;">
          <button class="btn btn-primary" id="btn-home-play">
            ${this.t("play")}
          </button>
          <button class="btn btn-secondary" id="btn-home-settings">
            ${this.t("settings")}
          </button>
        </div>

        <footer style="margin-top: auto; font-size: 0.8rem; color: var(--text-muted);">
          ${this.t("footer")} • v1.1.0 (PWA)
        </footer>
      </div>
    `;

    this.bindEvents();
  }

  /**
   * Liaison des événements
   */
  bindEvents() {
    document.getElementById("btn-home-play").addEventListener("click", () => {
      audio.playClick();
      this.onPlay();
    });

    document.getElementById("btn-home-settings").addEventListener("click", () => {
      audio.playClick();
      this.onSettings();
    });
  }
}
export default HomeScreen;
