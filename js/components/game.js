/**
 * Composant de la phase de Jeu (Description & Vote)
 */
export class GameScreen {
  /**
   * @param {HTMLElement} container - Le conteneur HTML principal.
   * @param {Array<Object>} assignedRoles - Tableau des joueurs avec leurs rôles { name, isImpostor, word, isEliminated }.
   * @param {Function} onGameOver - Callback appelé quand le jeu se termine { winner, roles }.
   */
  constructor(container, assignedRoles, onGameOver) {
    this.container = container;
    this.players = assignedRoles; // Référence directe pour modifier isEliminated
    this.onGameOver = onGameOver;
    
    this.roundNumber = 1;
    this.phase = "description"; // "description" ou "vote"
    
    this.selectedPlayerForVote = null; // Index dans this.players
    this.eliminationResultModal = null; // Données du modal de révélation
    
    this.startNewRound();
  }

  /**
   * Initialise un nouveau round : tirage au sort et ordre de passage
   */
  startNewRound() {
    this.phase = "description";
    this.selectedPlayerForVote = null;
    this.eliminationResultModal = null;
    
    // Récupérer les joueurs vivants
    const alivePlayers = this.players.filter(p => !p.isEliminated);
    
    // Tirer au sort le premier joueur parmi les vivants
    const randomIndex = Math.floor(Math.random() * alivePlayers.length);
    const startingPlayer = alivePlayers[randomIndex];
    
    // Déterminer l'ordre de passage à partir de ce joueur
    // On prend l'ordre initial des joueurs (assis autour de la table)
    // mais on commence par le joueur tiré au sort et on boucle.
    const startingIndexInFullList = this.players.indexOf(startingPlayer);
    
    this.turnOrder = [];
    for (let i = 0; i < this.players.length; i++) {
      const idx = (startingIndexInFullList + i) % this.players.length;
      const player = this.players[idx];
      if (!player.isEliminated) {
        this.turnOrder.push(player);
      }
    }
    
    this.currentDescriberIndex = 0; // Index dans this.turnOrder
  }

  /**
   * Rend l'écran de jeu
   */
  render() {
    this.container.innerHTML = `
      <div class="screen game-screen">
        <header class="game-header">
          <p style="color: var(--text-muted); font-size: 0.85rem; font-weight: 700; text-transform: uppercase;">
            Round ${this.roundNumber}
          </p>
          <h1 class="game-title">Phase de Jeu</h1>
          <span class="game-phase-indicator" id="phase-badge">
            ${this.phase === "description" ? "Descriptions" : "Vote de groupe"}
          </span>
        </header>

        <!-- Section 1 : Ordre de passage (Descriptions) -->
        <div class="turn-order-card">
          <h3 style="font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 6px;">
            ${this.phase === "description" ? "Ordre de passage (Décrivez votre mot) :" : "Ordre initial du round :"}
          </h3>
          <div class="turn-list" id="turn-list-container">
            <!-- Injecté par JS -->
          </div>
        </div>

        <!-- Section 2 : Zone centrale dynamique -->
        <div class="card" style="flex: 1; display: flex; flex-direction: column; justify-content: center; margin-bottom: 20px;">
          <div id="dynamic-game-area" style="width: 100%; text-align: center;">
            <!-- Injecté par JS selon la phase -->
          </div>
        </div>

        <!-- Bouton d'action principal -->
        <div class="setup-actions" style="margin-top: auto;">
          <button class="btn btn-primary" id="btn-game-action">
            <!-- Texte dynamique par JS -->
          </button>
        </div>

        <!-- Modal de révélation d'élimination -->
        <div id="modal-container"></div>
      </div>
    `;

    this.renderTurnList();
    this.renderDynamicArea();
    this.renderActionButton();
    this.renderModal();
    this.bindEvents();
  }

  /**
   * Rend la liste visuelle de l'ordre de passage
   */
  renderTurnList() {
    const container = document.getElementById("turn-list-container");
    container.innerHTML = "";

    this.turnOrder.forEach((player, index) => {
      const badge = document.createElement("span");
      badge.className = "turn-badge";
      
      // États visuels
      if (this.phase === "description") {
        if (index === this.currentDescriberIndex) {
          badge.classList.add("active");
          badge.innerHTML = `✨ <strong>${player.name}</strong>`;
        } else if (index < this.currentDescriberIndex) {
          badge.classList.add("done");
          badge.innerHTML = `✓ ${player.name}`;
        } else {
          badge.textContent = player.name;
        }
      } else {
        // En phase de vote, tout le monde a décrit
        badge.classList.add("done");
        badge.textContent = player.name;
      }
      
      container.appendChild(badge);
    });
  }

  /**
   * Rend le contenu central selon la phase
   */
  renderDynamicArea() {
    const area = document.getElementById("dynamic-game-area");
    
    if (this.phase === "description") {
      const activePlayer = this.turnOrder[this.currentDescriberIndex];
      area.innerHTML = `
        <div style="animation: zoomIn 0.3s ease-out;">
          <p style="font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 12px;">C'est au tour de :</p>
          <h2 style="font-size: 2.2rem; font-weight: 800; color: var(--text-primary); margin-bottom: 16px;">
            ${activePlayer.name}
          </h2>
          <div class="avatar-placeholder" style="margin: 0 auto 16px auto; border-style: solid;">
            ${activePlayer.name.charAt(0).toUpperCase()}
          </div>
          <p style="font-size: 0.95rem; max-width: 280px; margin: 0 auto; line-height: 1.4;">
            Donnez <strong>un seul mot</strong> de description pour votre mot secret, puis passez le téléphone au joueur suivant.
          </p>
        </div>
      `;
    } else {
      // Phase de Vote
      area.innerHTML = `
        <div style="animation: zoomIn 0.3s ease-out; text-align: left;">
          <h3 class="vote-section-title">Sélectionnez le suspect à éliminer :</h3>
          <div class="player-grid" id="vote-grid">
            <!-- Injecté par JS -->
          </div>
        </div>
      `;
      this.renderVoteGrid();
    }
  }

  /**
   * Rend la grille des joueurs pour le vote
   */
  renderVoteGrid() {
    const grid = document.getElementById("vote-grid");
    grid.innerHTML = "";

    this.players.forEach((player, index) => {
      const card = document.createElement("div");
      card.className = "player-card";
      if (player.isEliminated) {
        card.classList.add("eliminated");
      }
      if (this.selectedPlayerForVote === index) {
        card.classList.add("selected-for-vote");
      }

      card.innerHTML = `
        <div class="player-card-info">
          <div class="player-avatar">
            ${player.name.charAt(0).toUpperCase()}
          </div>
          <span class="player-name">${player.name}</span>
        </div>
        <div>
          ${
            player.isEliminated
              ? `<span class="player-status-badge dead">Éliminé</span>`
              : `<span class="player-status-badge alive">En vie</span>`
          }
        </div>
      `;

      if (!player.isEliminated) {
        card.addEventListener("click", () => {
          this.selectedPlayerForVote = index;
          this.renderVoteGrid();
          this.renderActionButton();
        });
      }

      grid.appendChild(card);
    });
  }

  /**
   * Rend le bouton principal en fonction de la phase
   */
  renderActionButton() {
    const btn = document.getElementById("btn-game-action");
    
    if (this.phase === "description") {
      if (this.currentDescriberIndex === this.turnOrder.length - 1) {
        btn.textContent = "Passer au Vote de Groupe";
      } else {
        btn.textContent = "Joueur Suivant";
      }
      btn.removeAttribute("disabled");
      btn.className = "btn btn-primary";
    } else {
      // Phase de Vote
      if (this.selectedPlayerForVote === null) {
        btn.textContent = "Sélectionnez un suspect";
        btn.setAttribute("disabled", "true");
        btn.className = "btn btn-secondary";
      } else {
        const suspect = this.players[this.selectedPlayerForVote];
        btn.textContent = `Éliminer ${suspect.name}`;
        btn.removeAttribute("disabled");
        btn.className = "btn btn-danger";
      }
    }
  }

  /**
   * Rend le modal d'élimination s'il est actif
   */
  renderModal() {
    const modalContainer = document.getElementById("modal-container");
    if (!this.eliminationResultModal) {
      modalContainer.innerHTML = "";
      return;
    }

    const { name, isImpostor, word } = this.eliminationResultModal;
    
    modalContainer.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content">
          <div class="modal-icon">
            ${isImpostor ? "🚨" : "💀"}
          </div>
          <h2 class="modal-title">Verdict du Vote</h2>
          <p class="modal-text">
            <strong>${name}</strong> a été éliminé(e) de la table !
          </p>
          <div class="card" style="background: rgba(0,0,0,0.2); margin-bottom: 24px; padding: 16px;">
            <p style="font-size: 0.9rem; margin-bottom: 4px;">Rôle secret :</p>
            <h3 style="font-size: 1.4rem; font-weight: 800; color: ${isImpostor ? "var(--color-danger)" : "var(--color-success)"}; margin-bottom: 8px;">
              ${isImpostor ? "IMPOSTEUR" : "CITOYEN"}
            </h3>
            <p style="font-size: 0.85rem;">Mot qu'il/elle avait : <br/><strong>${word}</strong></p>
          </div>
          <button class="btn btn-primary" id="btn-modal-close">Continuer</button>
        </div>
      </div>
    `;

    document.getElementById("btn-modal-close").addEventListener("click", () => {
      this.closeModalAndCheckWinConditions();
    });
  }

  /**
   * Liaison générale des événements de l'écran
   */
  bindEvents() {
    const btnAction = document.getElementById("btn-game-action");
    
    btnAction.addEventListener("click", () => {
      if (this.phase === "description") {
        if (this.currentDescriberIndex < this.turnOrder.length - 1) {
          this.currentDescriberIndex++;
          this.renderTurnList();
          this.renderDynamicArea();
          this.renderActionButton();
        } else {
          // Passer à la phase de vote
          this.phase = "vote";
          this.render();
        }
      } else {
        // Validation du vote
        if (this.selectedPlayerForVote !== null) {
          this.eliminatePlayer(this.selectedPlayerForVote);
        }
      }
    });
  }

  /**
   * Élimine un joueur et prépare le modal de résultat
   */
  eliminatePlayer(playerIndex) {
    const player = this.players[playerIndex];
    player.isEliminated = true;
    
    this.eliminationResultModal = {
      name: player.name,
      isImpostor: player.isImpostor,
      word: player.word
    };
    
    this.render();
  }

  /**
   * Ferme le modal et vérifie si le jeu est fini ou s'il faut lancer un nouveau round
   */
  closeModalAndCheckWinConditions() {
    this.eliminationResultModal = null;
    
    // Calculer le nombre de joueurs en vie
    const alivePlayers = this.players.filter(p => !p.isEliminated);
    const aliveImpostors = alivePlayers.filter(p => p.isImpostor);
    const aliveCitizens = alivePlayers.filter(p => !p.isImpostor);
    
    // Conditions de victoire :
    // 1. Les Citoyens gagnent s'il ne reste plus aucun imposteur
    if (aliveImpostors.length === 0) {
      this.onGameOver("citizens", this.players);
      return;
    }
    
    // 2. Les Imposteurs gagnent s'il reste un nombre de Citoyens inférieur ou égal au nombre d'Imposteurs
    // (Ex: 1 imposteur vs 1 citoyen restants, ou 2 imposteurs vs 2 citoyens. Les citoyens ne peuvent plus gagner à la majorité)
    if (aliveCitizens.length <= aliveImpostors.length) {
      this.onGameOver("impostors", this.players);
      return;
    }
    
    // Si la partie continue, on commence un nouveau round (nouvel ordre de passage, etc.)
    this.roundNumber++;
    this.startNewRound();
    this.render();
  }
}
