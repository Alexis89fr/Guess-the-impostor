import { audio } from "../audio.js";

/**
 * Composant de la phase de Jeu (Description & Vote Direct)
 */
export class GameScreen {
  /**
   * @param {HTMLElement} container - Le conteneur HTML principal.
   * @param {Object} state - L'état global partagé (langue, volume, etc.).
   * @param {Array<Object>} assignedRoles - Tableau des joueurs avec leurs rôles { name, avatar, isImpostor, word, isEliminated }.
   * @param {Function} onGameOver - Callback appelé quand le jeu se termine.
   * @param {Function} onQuit - Callback appelé pour abandonner la partie.
   */
  constructor(container, state, assignedRoles, onGameOver, onQuit) {
    this.container = container;
    this.state = state;
    this.players = assignedRoles;
    this.onGameOver = onGameOver;
    this.onQuit = onQuit;
    
    this.roundNumber = 1;
    this.selectedPlayerForVote = null; // Index dans this.players
    this.eliminationResultModal = null; // Infos du modal d'élimination
    
    this.startNewRound();
  }

  /**
   * Traduit une clé en fonction de la langue courante
   */
  t(key) {
    const lang = this.state.language || "fr";
    const dict = {
      fr: {
        round: "Round",
        title: "Partie en Cours",
        instruction: "Parlez à l'oral dans l'ordre ci-dessous, puis votez :",
        starts: "commence",
        btnSelect: "Sélectionnez le suspect",
        btnEliminate: "Éliminer {1}",
        modalTitle: "Verdict du Vote",
        modalText: "<strong>{1}</strong> a été éliminé(e) de la table !",
        roleLabel: "Rôle secret :",
        impostor: "IMPOSTEUR 🚨",
        citizen: "CITOYEN 💀",
        wordLabel: "Son mot secret était :",
        btnContinue: "Continuer",
        alive: "En vie",
        dead: "Éliminé",
        quitConfirm: "Voulez-vous vraiment quitter la partie en cours ?"
      },
      en: {
        round: "Round",
        title: "Game in Progress",
        instruction: "Describe your words in order, then vote:",
        starts: "starts",
        btnSelect: "Select the suspect",
        btnEliminate: "Eliminate {1}",
        modalTitle: "Vote Verdict",
        modalText: "<strong>{1}</strong> was eliminated from the table!",
        roleLabel: "Secret Role:",
        impostor: "IMPOSTOR 🚨",
        citizen: "CITIZEN 💀",
        wordLabel: "Their secret word was:",
        btnContinue: "Continue",
        alive: "Alive",
        dead: "Eliminated",
        quitConfirm: "Are you sure you want to quit the current game?"
      }
    };
    return dict[lang][key] || key;
  }

  /**
   * Initialise un nouveau round : tirage au sort et ordre de passage
   */
  startNewRound() {
    this.selectedPlayerForVote = null;
    this.eliminationResultModal = null;
    
    // Récupérer les joueurs vivants
    const alivePlayers = this.players.filter(p => !p.isEliminated);
    
    // Tirer au sort le premier joueur parmi les vivants
    const randomIndex = Math.floor(Math.random() * alivePlayers.length);
    const startingPlayer = alivePlayers[randomIndex];
    
    // Déterminer l'ordre de passage circulaire
    const startingIndexInFullList = this.players.indexOf(startingPlayer);
    
    this.turnOrder = [];
    for (let i = 0; i < this.players.length; i++) {
      const idx = (startingIndexInFullList + i) % this.players.length;
      const player = this.players[idx];
      if (!player.isEliminated) {
        this.turnOrder.push(player);
      }
    }
  }

  /**
   * Rend l'écran de jeu (Vote direct)
   */
  render() {
    this.container.innerHTML = `
      <div class="screen game-screen">
        <!-- Bouton Quitter (Croix) -->
        <button class="btn-quit" id="btn-quit-game" title="${this.t("quitConfirm")}">✕</button>

        <header class="game-header">
          <p style="color: var(--text-muted); font-size: 0.85rem; font-weight: 700; text-transform: uppercase;">
            ${this.t("round")} ${this.roundNumber}
          </p>
          <h1 class="game-title">${this.t("title")}</h1>
        </header>

        <!-- Section 1 : Ordre de passage et descriptions -->
        <div class="turn-order-card" style="margin-bottom: 16px;">
          <h3 style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 2px;">
            ${this.t("instruction")}
          </h3>
        </div>

        <!-- Section 2 : Grille des suspects (TRIES PAR ORDRE DE PAROLE) -->
        <div class="card" style="flex: 1; display: flex; flex-direction: column; padding: 16px; margin-bottom: 16px; min-height: 250px;">
          <h3 class="vote-section-title">${this.t("title")}</h3>
          
          <div class="player-grid" id="game-player-grid">
            <!-- Injecté par JS -->
          </div>
        </div>

        <!-- Bouton d'action d'élimination -->
        <div class="setup-actions" style="margin-top: auto;">
          <button class="btn btn-primary" id="btn-game-vote">
            <!-- Texte dynamique par JS -->
          </button>
        </div>

        <!-- Modal de révélation d'élimination -->
        <div id="modal-container"></div>
      </div>
    `;

    this.renderPlayerGrid();
    this.renderActionButton();
    this.renderModal();
    this.bindEvents();
  }

  /**
   * Rend la grille des joueurs suspects triés selon l'ordre de passage circulaire
   */
  renderPlayerGrid() {
    const grid = document.getElementById("game-player-grid");
    grid.innerHTML = "";

    // Afficher d'abord les joueurs vivants triés par l'ordre de passage du round
    this.turnOrder.forEach((player, displayIndex) => {
      // Trouver l'index original dans la liste complète des joueurs
      const originalIndex = this.players.indexOf(player);
      
      const card = document.createElement("div");
      card.className = "player-card";
      if (this.selectedPlayerForVote === originalIndex) {
        card.classList.add("selected-for-vote");
      }

      card.innerHTML = `
        <div class="player-card-info">
          <div class="player-avatar">
            ${
              player.avatar 
                ? `<img src="${player.avatar}" alt="${player.name}" />`
                : player.name.charAt(0).toUpperCase()
            }
          </div>
          <div>
            <span class="player-name">${player.name}</span>
            ${
              displayIndex === 0 
                ? `<span style="display:block; font-size:0.75rem; color: var(--accent-primary); font-weight:700;">★ ${this.t("starts")}</span>` 
                : ""
            }
          </div>
        </div>
        <div>
          <span class="player-status-badge alive">${this.t("alive")}</span>
        </div>
      `;

      card.addEventListener("click", () => {
        audio.playClick();
        this.selectedPlayerForVote = originalIndex;
        this.renderPlayerGrid();
        this.renderActionButton();
      });

      grid.appendChild(card);
    });

    // Ensuite, on ajoute les joueurs déjà éliminés (à la fin de la liste, pour mémoire)
    this.players.forEach((player, originalIndex) => {
      if (player.isEliminated) {
        const card = document.createElement("div");
        card.className = "player-card eliminated";
        
        card.innerHTML = `
          <div class="player-card-info">
            <div class="player-avatar">
              ${
                player.avatar 
                  ? `<img src="${player.avatar}" alt="${player.name}" />`
                  : player.name.charAt(0).toUpperCase()
              }
            </div>
            <span class="player-name">${player.name}</span>
          </div>
          <div>
            <span class="player-status-badge dead">${this.t("dead")}</span>
          </div>
        `;
        grid.appendChild(card);
      }
    });
  }

  /**
   * Met à jour le texte et l'état du bouton d'élimination
   */
  renderActionButton() {
    const btn = document.getElementById("btn-game-vote");
    
    if (this.selectedPlayerForVote === null) {
      btn.textContent = this.t("btnSelect");
      btn.setAttribute("disabled", "true");
      btn.className = "btn btn-secondary";
    } else {
      const suspect = this.players[this.selectedPlayerForVote];
      btn.textContent = this.t("btnEliminate").replace("{1}", suspect.name);
      btn.removeAttribute("disabled");
      btn.className = "btn btn-danger";
    }
  }

  /**
   * Rend le modal de révélation d'élimination
   */
  renderModal() {
    const modalContainer = document.getElementById("modal-container");
    if (!this.eliminationResultModal) {
      modalContainer.innerHTML = "";
      this.container.classList.remove("modal-open");
      return;
    }

    this.container.classList.add("modal-open");

    const { name, isImpostor, word } = this.eliminationResultModal;
    const modalText = this.t("modalText").replace("{1}", name);
    const roleText = isImpostor ? this.t("impostor") : this.t("citizen");

    modalContainer.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content">
          <div class="modal-icon">
            ${isImpostor ? "🚨" : "💀"}
          </div>
          <h2 class="modal-title">${this.t("modalTitle")}</h2>
          <p class="modal-text">${modalText}</p>
          
          <div class="card" style="background: rgba(0,0,0,0.25); margin-bottom: 24px; padding: 16px;">
            <p style="font-size: 0.85rem; margin-bottom: 4px; color: var(--text-secondary);">${this.t("roleLabel")}</p>
            <h3 style="font-size: 1.4rem; font-weight: 800; color: ${isImpostor ? "var(--color-danger)" : "var(--color-success)"}; margin-bottom: 8px;">
              ${roleText}
            </h3>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 2px;">${this.t("wordLabel")}</p>
            <p style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">${word}</p>
          </div>
          
          <button class="btn btn-primary" id="btn-modal-close">${this.t("btnContinue")}</button>
        </div>
      </div>
    `;

    document.getElementById("btn-modal-close").addEventListener("click", () => {
      audio.playClick();
      this.closeModalAndCheckWinConditions();
    });
  }

  /**
   * Liaison des événements principaux de l'écran
   */
  bindEvents() {
    const btnVote = document.getElementById("btn-game-vote");
    const btnQuit = document.getElementById("btn-quit-game");

    if (btnQuit) {
      btnQuit.addEventListener("click", () => {
        audio.playClick();
        if (confirm(this.t("quitConfirm"))) {
          this.onQuit();
        }
      });
    }
    
    btnVote.addEventListener("click", () => {
      if (this.selectedPlayerForVote !== null) {
        // Déclencher le son de sabre (slash) à l'élimination !
        audio.playSlash();
        this.eliminatePlayer(this.selectedPlayerForVote);
      }
    });
  }

  /**
   * Élimine le joueur sélectionné et prépare l'affichage du modal
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
   * Ferme le modal et vérifie les conditions de victoire ou relance un round
   */
  closeModalAndCheckWinConditions() {
    this.eliminationResultModal = null;
    
    // Calculer les joueurs restants en vie
    const alivePlayers = this.players.filter(p => !p.isEliminated);
    const aliveImpostors = alivePlayers.filter(p => p.isImpostor);
    const aliveCitizens = alivePlayers.filter(p => !p.isImpostor);
    
    // Victoire des Citoyens : plus d'imposteur
    if (aliveImpostors.length === 0) {
      this.onGameOver("citizens", this.players);
      return;
    }
    
    // Victoire des Imposteurs : citoyens <= imposteurs
    if (aliveCitizens.length <= aliveImpostors.length) {
      this.onGameOver("impostors", this.players);
      return;
    }
    
    // Sinon, relance d'un nouveau tour
    this.roundNumber++;
    this.startNewRound();
    this.render();
  }
}
export default GameScreen;
