import { audio } from "../audio.js";

/**
 * Composant de l'écran des Paramètres (Settings)
 */
export class SettingsScreen {
  /**
   * @param {HTMLElement} container - Le conteneur HTML principal.
   * @param {Object} state - L'état global partagé.
   * @param {Function} onBack - Callback pour retourner à l'écran précédent (l'accueil).
   * @param {Function} onThemeChange - Callback appelé lors du changement de thème visuel.
   */
  constructor(container, state, onBack, onThemeChange) {
    this.container = container;
    this.state = state;
    this.onBack = onBack;
    this.onThemeChange = onThemeChange;
  }

  /**
   * Traduit une clé en fonction de la langue courante
   */
  t(key) {
    const lang = this.state.language || "fr";
    const dict = {
      fr: {
        title: "Paramètres",
        volume: "Volume des sons",
        theme: "Thème visuel",
        lang: "Langue du jeu",
        back: "Retour à l'accueil",
        themeViolet: "Violet",
        themeEmerald: "Émeraude",
        themeAmber: "Ambre",
        themeCyberpunk: "Cyberpunk"
      },
      en: {
        title: "Settings",
        volume: "Sound volume",
        theme: "Visual Theme",
        lang: "Game Language",
        back: "Back to Home",
        themeViolet: "Purple",
        themeEmerald: "Emerald",
        themeAmber: "Amber",
        themeCyberpunk: "Cyberpunk"
      }
    };
    return dict[lang][key] || key;
  }

  /**
   * Rend l'écran de configuration
   */
  render() {
    this.container.innerHTML = `
      <div class="screen settings-screen">
        <header style="margin-bottom: 24px;">
          <h1>${this.t("title")}</h1>
        </header>

        <div class="card">
          <!-- Groupe 1 : Réglage du Volume -->
          <div class="settings-group">
            <div class="settings-row">
              <span class="label-title">${this.t("volume")}</span>
              <span id="volume-pct" style="font-weight: 700; color: var(--accent-primary);">
                ${Math.round((this.state.volume !== undefined ? this.state.volume : 0.5) * 100)}%
              </span>
            </div>
            <input 
              type="range" 
              class="volume-slider" 
              id="slider-volume" 
              min="0" 
              max="1" 
              step="0.05" 
              value="${this.state.volume !== undefined ? this.state.volume : 0.5}"
            />
          </div>

          <!-- Groupe 2 : Langue du Jeu -->
          <div class="settings-group">
            <div class="settings-row">
              <span class="label-title">${this.t("lang")}</span>
            </div>
            <div class="lang-selector">
              <button class="lang-btn ${this.state.language === "fr" ? "active" : ""}" id="btn-lang-fr">
                Français 🇫🇷
              </button>
              <button class="lang-btn ${this.state.language === "en" ? "active" : ""}" id="btn-lang-en">
                English 🇬🇧
              </button>
            </div>
          </div>

          <!-- Groupe 3 : Thèmes de Couleurs -->
          <div class="settings-group" style="margin-bottom: 0;">
            <div class="settings-row">
              <span class="label-title">${this.t("theme")}</span>
            </div>
            <div class="theme-grid">
              <div class="theme-card ${this.state.theme === "violet" ? "active" : ""}" data-theme="violet">
                <div class="theme-color-preview" style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);"></div>
                <span class="theme-name-label">${this.t("themeViolet")}</span>
              </div>
              <div class="theme-card ${this.state.theme === "emerald" ? "active" : ""}" data-theme="emerald">
                <div class="theme-color-preview" style="background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);"></div>
                <span class="theme-name-label">${this.t("themeEmerald")}</span>
              </div>
              <div class="theme-card ${this.state.theme === "amber" ? "active" : ""}" data-theme="amber">
                <div class="theme-color-preview" style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);"></div>
                <span class="theme-name-label">${this.t("themeAmber")}</span>
              </div>
              <div class="theme-card ${this.state.theme === "cyberpunk" ? "active" : ""}" data-theme="cyberpunk">
                <div class="theme-color-preview" style="background: linear-gradient(135deg, #ff0055 0%, #00ffcc 100%);"></div>
                <span class="theme-name-label">${this.t("themeCyberpunk")}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="setup-actions" style="margin-top: auto;">
          <button class="btn btn-primary" id="btn-settings-back">
            ${this.t("back")}
          </button>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  /**
   * Liaison des événements
   */
  bindEvents() {
    // Changement de volume
    const slider = document.getElementById("slider-volume");
    const volPct = document.getElementById("volume-pct");
    
    slider.addEventListener("input", (e) => {
      const vol = parseFloat(e.target.value);
      this.state.volume = vol;
      audio.setVolume(vol);
      volPct.textContent = `${Math.round(vol * 100)}%`;
    });

    slider.addEventListener("change", () => {
      audio.playClick(); // Jouer un petit clic test à la fin du déplacement
    });

    // Choix de la langue
    const btnFr = document.getElementById("btn-lang-fr");
    const btnEn = document.getElementById("btn-lang-en");

    btnFr.addEventListener("click", () => {
      if (this.state.language !== "fr") {
        this.state.language = "fr";
        audio.playClick();
        this.render(); // Redessiner pour mettre à jour la langue
      }
    });

    btnEn.addEventListener("click", () => {
      if (this.state.language !== "en") {
        this.state.language = "en";
        audio.playClick();
        this.render(); // Redessiner
      }
    });

    // Choix du thème visuel
    const themeCards = document.querySelectorAll(".theme-card");
    themeCards.forEach((card) => {
      card.addEventListener("click", () => {
        const theme = card.dataset.theme;
        if (this.state.theme !== theme) {
          this.state.theme = theme;
          audio.playClick();
          
          // Mettre à jour l'état visuel actif localement
          themeCards.forEach(c => c.classList.remove("active"));
          card.classList.add("active");
          
          // Appliquer le thème visuel
          this.onThemeChange(theme);
        }
      });
    });

    // Retour à l'accueil
    document.getElementById("btn-settings-back").addEventListener("click", () => {
      audio.playClick();
      this.onBack();
    });
  }
}
export default SettingsScreen;
