/**
 * Composant de l'écran de Distribution des Rôles (Pass & Play)
 */
export class DistributionScreen {
  /**
   * @param {HTMLElement} container - Le conteneur HTML principal.
   * @param {Object} state - L'état global partagé.
   * @param {Object} wordPair - La paire de mots sélectionnée { wordA, wordB }.
   * @param {Function} onComplete - Callback appelé quand tous les joueurs ont vu leur mot.
   */
  constructor(container, state, wordPair, onComplete) {
    this.container = container;
    this.state = state;
    this.wordPair = wordPair;
    this.onComplete = onComplete;
    
    this.currentPlayerIndex = 0;
    this.isWordRevealed = false;
    this.assignedRoles = [];
    
    this.assignRoles();
  }

  /**
   * Assigne secrètement les rôles (normal vs imposteur) et les mots aux joueurs
   */
  assignRoles() {
    const players = this.state.playerNames;
    const totalPlayers = players.length;
    const impostorCount = this.state.impostorCount;
    
    // Générer un tableau d'indices
    const indices = Array.from({ length: totalPlayers }, (_, i) => i);
    
    // Tirer au sort les indices des imposteurs
    const impostorIndices = [];
    for (let i = 0; i < impostorCount; i++) {
      const randomIndexInPool = Math.floor(Math.random() * indices.length);
      const chosenPlayerIndex = indices.splice(randomIndexInPool, 1)[0];
      impostorIndices.push(chosenPlayerIndex);
    }
    
    // Assigner les rôles et mots
    this.assignedRoles = players.map((name, index) => {
      const isImpostor = impostorIndices.includes(index);
      return {
        name: name,
        isImpostor: isImpostor,
        word: isImpostor ? this.wordPair.wordB : this.wordPair.wordA,
        isEliminated: false
      };
    });
  }

  /**
   * Affiche l'écran de distribution pour le joueur actuel
   */
  render() {
    const currentPlayer = this.assignedRoles[this.currentPlayerIndex];
    
    this.container.innerHTML = `
      <div class="screen distribution-screen">
        <header style="margin-bottom: 16px;">
          <h1>Distribution</h1>
          <p style="text-align: center;">Joueur ${this.currentPlayerIndex + 1} sur ${this.assignedRoles.length}</p>
        </header>

        <div class="card dist-card">
          <div class="avatar-placeholder">
            ${currentPlayer.name.charAt(0).toUpperCase()}
          </div>
          
          <div>
            <p class="dist-instruction">Passez le téléphone à :</p>
            <h2 class="player-target-name">${currentPlayer.name}</h2>
          </div>

          <!-- Zone de révélation du mot secret -->
          <div class="reveal-box" id="reveal-area">
            ${this.getRevealAreaHTML()}
          </div>
        </div>

        <div class="setup-actions" style="margin-top: auto;">
          <button class="btn btn-primary" id="btn-next-player" ${this.isWordRevealed ? "" : "disabled"}>
            ${this.currentPlayerIndex === this.assignedRoles.length - 1 ? "Commencer le jeu" : "Joueur Suivant"}
          </button>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  /**
   * Retourne le HTML interne de la zone de révélation en fonction de l'état (caché/affiché)
   */
  getRevealAreaHTML() {
    const currentPlayer = this.assignedRoles[this.currentPlayerIndex];
    
    if (!this.isWordRevealed) {
      return `
        <div class="reveal-box-hidden-state">
          <div class="reveal-eye-icon">👁️‍🗨️</div>
          <span class="reveal-box-text-main">Appuyez pour révéler</span>
          <span class="reveal-box-text-sub">Assurez-vous d'être seul à regarder</span>
        </div>
      `;
    } else {
      return `
        <div class="reveal-box-shown-state">
          <span class="secret-word-label">Votre Mot Secret :</span>
          <span class="secret-word-display">${currentPlayer.word}</span>
          <span class="reveal-box-text-sub" style="color: var(--text-secondary);">Appuyez pour cacher et sécuriser</span>
        </div>
      `;
    }
  }

  /**
   * Liaison des événements
   */
  bindEvents() {
    const revealArea = document.getElementById("reveal-area");
    const btnNext = document.getElementById("btn-next-player");

    // Cliquer sur la zone de révélation pour alterner l'affichage
    revealArea.addEventListener("click", () => {
      this.isWordRevealed = !this.isWordRevealed;
      revealArea.innerHTML = this.getRevealAreaHTML();
      
      // Activer/Désactiver le bouton suivant
      if (this.isWordRevealed) {
        btnNext.removeAttribute("disabled");
        revealArea.style.borderColor = "var(--accent-secondary)";
        revealArea.style.background = "rgba(99, 102, 241, 0.08)";
      } else {
        btnNext.setAttribute("disabled", "true");
        revealArea.style.borderColor = "var(--border-glass)";
        revealArea.style.background = "rgba(0, 0, 0, 0.3)";
      }
    });

    // Passer au joueur suivant
    btnNext.addEventListener("click", () => {
      if (!this.isWordRevealed) return; // Sécurité

      // Si c'est le dernier joueur, terminer la distribution
      if (this.currentPlayerIndex === this.assignedRoles.length - 1) {
        this.onComplete(this.assignedRoles);
      } else {
        // Passer au joueur suivant et réinitialiser l'état masqué
        this.currentPlayerIndex++;
        this.isWordRevealed = false;
        this.render();
      }
    });
  }
}
