/**
 * Composant de l'écran des Résultats (Game Over)
 */
export class ResultScreen {
  /**
   * @param {HTMLElement} container - Le conteneur HTML principal.
   * @param {string} winner - Le camp gagnant : "citizens" ou "impostors".
   * @param {Array<Object>} assignedRoles - Le tableau complet des rôles assignés à la fin du jeu.
   * @param {Function} onRestartSameSettings - Relance une partie avec les mêmes joueurs.
   * @param {Function} onBackToSetup - Retourne à la configuration.
   */
  constructor(container, winner, assignedRoles, onRestartSameSettings, onBackToSetup) {
    this.container = container;
    this.winner = winner;
    this.assignedRoles = assignedRoles;
    this.onRestartSameSettings = onRestartSameSettings;
    this.onBackToSetup = onBackToSetup;
    
    this.extractWords();
  }

  /**
   * Extrait le mot des citoyens et le mot de l'imposteur
   */
  extractWords() {
    const citizen = this.assignedRoles.find(p => !p.isImpostor);
    const impostor = this.assignedRoles.find(p => p.isImpostor);
    
    this.citizenWord = citizen ? citizen.word : "Inconnu";
    this.impostorWord = impostor ? impostor.word : "Inconnu";
  }

  /**
   * Rend l'écran de fin
   */
  render() {
    const isImpostorVictory = this.winner === "impostors";
    
    this.container.innerHTML = `
      <div class="screen result-screen">
        <header style="margin-bottom: 8px;">
          <h1>Fin de Partie</h1>
        </header>

        <div class="trophy-container" style="border-color: ${isImpostorVictory ? "var(--color-danger)" : "var(--color-warning)"}; box-shadow: 0 0 30px ${isImpostorVictory ? "rgba(239, 68, 68, 0.2)" : "rgba(245, 158, 11, 0.2)"}">
          ${isImpostorVictory ? "😈" : "🏆"}
        </div>

        <div>
          <h2 class="winner-banner" style="color: ${isImpostorVictory ? "var(--color-danger)" : "var(--color-warning)"}">
            ${isImpostorVictory ? "L'Imposteur a gagné !" : "Victoire des Citoyens !"}
          </h2>
          <p class="winner-subtitle">
            ${
              isImpostorVictory 
                ? "L'imposteur a réussi à tromper tout le monde !" 
                : "Les citoyens ont démasqué l'imposteur à temps !"
            }
          </p>
        </div>

        <!-- Révélation des mots secrets -->
        <div class="words-reveal-panel">
          <div class="word-reveal-row">
            <span class="word-reveal-role" style="color: var(--accent-primary);">Mot des Citoyens :</span>
            <span class="word-reveal-val">${this.citizenWord}</span>
          </div>
          <div style="border-bottom: 1px solid var(--border-glass); width: 100%;"></div>
          <div class="word-reveal-row">
            <span class="word-reveal-role" style="color: var(--color-danger);">Mot de l'Imposteur :</span>
            <span class="word-reveal-val">${this.impostorWord}</span>
          </div>
        </div>

        <!-- Tableau récapitulatif des rôles et états de survie -->
        <div class="roles-summary">
          <h3 class="roles-list-title">Rôles de la table</h3>
          <div class="roles-grid">
            ${this.assignedRoles
              .map(
                (player) => `
                <div class="role-summary-row" style="opacity: ${player.isEliminated ? 0.6 : 1}">
                  <span class="role-summary-player">
                    ${player.name} ${player.isEliminated ? "💀" : "✨"}
                  </span>
                  <span class="role-summary-badge ${player.isImpostor ? "impostor" : "normal"}">
                    ${player.isImpostor ? "Imposteur" : "Citoyen"}
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
            Rejouer
          </button>
          <button class="btn btn-secondary" id="btn-change-settings">
            Changer de joueurs / règles
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
      this.onRestartSameSettings();
    });

    document.getElementById("btn-change-settings").addEventListener("click", () => {
      this.onBackToSetup();
    });
  }
}
