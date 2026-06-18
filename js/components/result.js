import { audio } from "../audio.js";

/**
 * Composant de l'écran des Résultats (Game Over)
 */
export class ResultScreen {
  /**
   * @param {HTMLElement} container - Le conteneur HTML principal.
   * @param {Object} state - L'état global partagé.
   * @param {string} winner - Le camp gagnant : "citizens" ou "impostors".
   * @param {Array<Object>} assignedRoles - Le tableau des rôles de la partie.
   * @param {Function} onRestartSameSettings - Relance une partie avec les mêmes joueurs.
   * @param {Function} onBackToSetup - Retourne à la configuration.
   */
  constructor(container, state, winner, assignedRoles, onRestartSameSettings, onBackToSetup) {
    this.container = container;
    this.state = state;
    this.winner = winner;
    this.assignedRoles = assignedRoles;
    this.onRestartSameSettings = onRestartSameSettings;
    this.onBackToSetup = onBackToSetup;
    
    this.extractWords();
    this.playVictorySounds();
  }

  /**
   * Traduit une clé en fonction de la langue courante
   */
  t(key) {
    const lang = this.state.language || "fr";
    const dict = {
      fr: {
        title: "Fin de Partie",
        impostorWin: "L'Imposteur a gagné !",
        citizensWin: "Victoire des Citoyens !",
        impostorSub: "L'imposteur a réussi à tromper tout le monde !",
        citizensSub: "Les citoyens ont démasqué l'imposteur à temps !",
        citizenWord: "Mot des Citoyens :",
        impostorWord: "Mot de l'Imposteur :",
        rolesTitle: "Rôles de la table",
        citizenBadge: "Citoyen",
        impostorBadge: "Imposteur",
        btnRestart: "Rejouer",
        btnChangeSettings: "Menu Principal / Paramètres",
        dead: "💀",
        alive: "✨"
      },
      en: {
        title: "Game Over",
        impostorWin: "The Impostor Won!",
        citizensWin: "Citizens Victory!",
        impostorSub: "The impostor successfully fooled everyone!",
        citizensSub: "The citizens unmasked the impostor in time!",
        citizenWord: "Citizens Word:",
        impostorWord: "Impostor Word:",
        rolesTitle: "Roles Summary",
        citizenBadge: "Citizen",
        impostorBadge: "Impostor",
        btnRestart: "Play Again",
        btnChangeSettings: "Main Menu / Settings",
        dead: "💀",
        alive: "✨"
      }
    };
    return dict[lang][key] || key;
  }

  /**
   * Extrait le mot des citoyens et le mot de l'imposteur
   */
  extractWords() {
    const citizen = this.assignedRoles.find(p => !p.isImpostor);
    const impostor = this.assignedRoles.find(p => p.isImpostor);
    
    this.citizenWord = citizen ? citizen.word : "???";
    this.impostorWord = impostor ? impostor.word : "???";
  }

  /**
   * Joue le son correspondant à l'issue de la partie
   */
  playVictorySounds() {
    if (this.winner === "impostors") {
      audio.playWinnerImpostors();
    } else {
      audio.playWinnerCitizens();
    }
  }

  /**
   * Rend l'écran de fin
   */
  render() {
    const isImpostorVictory = this.winner === "impostors";
    
    this.container.innerHTML = `
      <div class="screen result-screen">
        <header style="margin-bottom: 8px;">
          <h1>${this.t("title")}</h1>
        </header>

        <div class="trophy-container" style="border-color: ${isImpostorVictory ? "var(--color-danger)" : "var(--color-warning)"}; box-shadow: 0 0 30px ${isImpostorVictory ? "rgba(239, 68, 68, 0.2)" : "rgba(245, 158, 11, 0.2)"}">
          ${isImpostorVictory ? "😈" : "🏆"}
        </div>

        <div>
          <h2 class="winner-banner" style="color: ${isImpostorVictory ? "var(--color-danger)" : "var(--color-warning)"}">
            ${isImpostorVictory ? this.t("impostorWin") : this.t("citizensWin")}
          </h2>
          <p class="winner-subtitle">
            ${isImpostorVictory ? this.t("impostorSub") : this.t("citizensSub")}
          </p>
        </div>

        <!-- Révélation des mots secrets -->
        <div class="words-reveal-panel">
          <div class="word-reveal-row">
            <span class="word-reveal-role" style="color: var(--accent-primary);">${this.t("citizenWord")}</span>
            <span class="word-reveal-val">${this.citizenWord}</span>
          </div>
          <div style="border-bottom: 1px solid var(--border-glass); width: 100%;"></div>
          <div class="word-reveal-row">
            <span class="word-reveal-role" style="color: var(--color-danger);">${this.t("impostorWord")}</span>
            <span class="word-reveal-val">${this.impostorWord}</span>
          </div>
        </div>

        <!-- Tableau récapitulatif des rôles et états de survie (avec avatars) -->
        <div class="roles-summary">
          <h3 class="roles-list-title">${this.t("rolesTitle")}</h3>
          <div class="roles-grid">
            ${this.assignedRoles
              .map(
                (player) => `
                <div class="role-summary-row" style="opacity: ${player.isEliminated ? 0.6 : 1}">
                  <span class="role-summary-player" style="display: flex; align-items: center; gap: 8px;">
                    <span class="player-avatar" style="width: 20px; height: 20px; font-size: 0.65rem; border: none; background: rgba(255,255,255,0.1);">
                      ${
                        player.avatar 
                          ? `<img src="${player.avatar}" alt="" />`
                          : player.name.charAt(0).toUpperCase()
                      }
                    </span>
                    ${player.name} ${player.isEliminated ? this.t("dead") : this.t("alive")}
                  </span>
                  <span class="role-summary-badge ${player.isImpostor ? "impostor" : "normal"}">
                    ${player.isImpostor ? this.t("impostorBadge") : this.t("citizenBadge")}
                  </span>
                </div>
              `
              )
              .join("")}
          </div>
        </div>

        <!-- Actions -->
        <div class="setup-actions" style="margin-top: auto; width: 100%;">
          <button class="btn btn-primary" id="btn-restart">
            ${this.t("btnRestart")}
          </button>
          <button class="btn btn-secondary" id="btn-change-settings">
            ${this.t("btnChangeSettings")}
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
    document.getElementById("btn-restart").addEventListener("click", () => {
      audio.playClick();
      this.onRestartSameSettings();
    });

    document.getElementById("btn-change-settings").addEventListener("click", () => {
      audio.playClick();
      this.onBackToSetup();
    });
  }
}
export default ResultScreen;
