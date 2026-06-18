import { audio } from "../audio.js";

/**
 * Composant de l'écran de Distribution des Rôles (Pass & Play)
 */
export class DistributionScreen {
  /**
   * @param {HTMLElement} container - Le conteneur HTML principal.
   * @param {Object} state - L'état global partagé.
   * @param {Object} wordPair - La paire de mots sélectionnée { wordA, wordB }.
   * @param {Function} onComplete - Callback appelé quand tous les joueurs ont vu leur mot.
   * @param {Function} onQuit - Callback appelé pour quitter le jeu.
   */
  constructor(container, state, wordPair, onComplete, onQuit) {
    this.container = container;
    this.state = state;
    this.wordPair = wordPair;
    this.onComplete = onComplete;
    this.onQuit = onQuit;
    
    this.currentPlayerIndex = 0;
    this.isWordRevealed = false;
    this.assignedRoles = [];
    
    this.assignRoles();
  }

  /**
   * Traduit une clé en fonction de la langue courante
   */
  t(key) {
    const lang = this.state.language || "fr";
    const dict = {
      fr: {
        title: "Distribution",
        playerOf: "Joueur {1} sur {2}",
        passPhone: "Passez le téléphone à :",
        clickReveal: "Appuyez pour révéler",
        safetyWarn: "Assurez-vous d'être seul à regarder",
        secretWord: "Votre Mot Secret :",
        clickHide: "Appuyez pour cacher",
        btnNext: "Joueur Suivant",
        btnStart: "Commencer le jeu",
        quitConfirm: "Voulez-vous vraiment quitter la partie et retourner à l'accueil ?"
      },
      en: {
        title: "Word Reveal",
        playerOf: "Player {1} of {2}",
        passPhone: "Pass the phone to:",
        clickReveal: "Tap to reveal",
        safetyWarn: "Make sure no one is looking",
        secretWord: "Your Secret Word:",
        clickHide: "Tap to hide",
        btnNext: "Next Player",
        btnStart: "Start Game",
        quitConfirm: "Are you sure you want to quit and go back to home?"
      }
    };
    return dict[lang][key] || key;
  }

  /**
   * Assigne secrètement les rôles (normal vs imposteur) et les mots aux joueurs
   */
  assignRoles() {
    const players = this.state.playerNames;
    const avatars = this.state.playerAvatars;
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
        avatar: avatars[index],
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
    const headerTitle = this.t("playerOf")
      .replace("{1}", this.currentPlayerIndex + 1)
      .replace("{2}", this.assignedRoles.length);
    
    this.container.innerHTML = `
      <div class="screen distribution-screen">
        <!-- Bouton Quitter (Croix) -->
        <button class="btn-quit" id="btn-quit-game" title="${this.t("quitConfirm")}">✕</button>

        <header style="margin-bottom: 16px;">
          <h1>${this.t("title")}</h1>
          <p style="text-align: center;">${headerTitle}</p>
        </header>

        <div class="card dist-card">
          <div class="avatar-placeholder">
            ${
              currentPlayer.avatar 
                ? `<img src="${currentPlayer.avatar}" alt="${currentPlayer.name}" />`
                : currentPlayer.name.charAt(0).toUpperCase()
            }
          </div>
          
          <div>
            <p class="dist-instruction">${this.t("passPhone")}</p>
            <h2 class="player-target-name">${currentPlayer.name}</h2>
          </div>

          <!-- Zone de révélation du mot secret (aucune indication de Citoyen/Imposteur) -->
          <div class="reveal-box" id="reveal-area">
            ${this.getRevealAreaHTML()}
          </div>
        </div>

        <div class="setup-actions" style="margin-top: auto;">
          <button class="btn btn-primary" id="btn-next-player" ${this.isWordRevealed ? "" : "disabled"}>
            ${
              this.currentPlayerIndex === this.assignedRoles.length - 1 
                ? this.t("btnStart") 
                : this.t("btnNext")
            }
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
          <span class="reveal-box-text-main">${this.t("clickReveal")}</span>
          <span class="reveal-box-text-sub">${this.t("safetyWarn")}</span>
        </div>
      `;
    } else {
      // NOTE IMPORTANTE : N'affiche AUCUN rôle (pas de Citoyen ou Imposteur), juste le mot !
      return `
        <div class="reveal-box-shown-state">
          <span class="secret-word-label">${this.t("secretWord")}</span>
          <span class="secret-word-display">${currentPlayer.word}</span>
          <span class="reveal-box-text-sub" style="color: var(--text-secondary);">${this.t("clickHide")}</span>
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
    const btnQuit = document.getElementById("btn-quit-game");

    // Bouton de retour/abandon
    if (btnQuit) {
      btnQuit.addEventListener("click", () => {
        audio.playClick();
        if (confirm(this.t("quitConfirm"))) {
          this.onQuit();
        }
      });
    }

    // Cliquer sur la zone de révélation pour alterner l'affichage
    revealArea.addEventListener("click", () => {
      audio.playClick();
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
      audio.playClick();

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
export default DistributionScreen;
