/**
 * Composant de l'écran de Configuration (Setup)
 */
export class SetupScreen {
  /**
   * @param {HTMLElement} container - Le conteneur HTML principal.
   * @param {Object} state - L'état global partagé.
   * @param {Function} onStartGame - Callback appelé quand le jeu commence.
   */
  constructor(container, state, onStartGame) {
    this.container = container;
    this.state = state;
    this.onStartGame = onStartGame;
    
    // Valeurs par défaut si non définies dans l'état global
    if (!this.state.playerNames) {
      this.state.playerNames = ["Alice", "Bob", "Charlie", "David"];
    }
    if (this.state.impostorCount === undefined) {
      this.state.impostorCount = 1;
    }
  }

  /**
   * Rend l'écran de configuration
   */
  render() {
    this.container.innerHTML = `
      <div class="screen setup-screen">
        <header style="margin-bottom: 24px;">
          <h1>L'Imposteur</h1>
          <p style="text-align: center;">Configurez votre partie locale</p>
        </header>

        <div class="card">
          <!-- Paramètres du jeu -->
          <div class="setup-group">
            <div class="label-container">
              <span class="label-title">Nombre d'imposteurs</span>
              <span class="number-value" id="impostor-value">${this.state.impostorCount}</span>
            </div>
            <div class="number-picker">
              <button class="btn-icon" id="btn-impostor-minus">—</button>
              <p style="font-size: 0.85rem; color: var(--text-muted);">Imposteur(s)</p>
              <button class="btn-icon" id="btn-impostor-plus">+</button>
            </div>
          </div>

          <!-- Liste des joueurs -->
          <div class="setup-group" style="margin-bottom: 12px;">
            <div class="label-container">
              <span class="label-title">Joueurs (ordre de table)</span>
              <span class="text-secondary" id="player-count" style="font-weight: 600;">
                ${this.state.playerNames.length} Joueurs
              </span>
            </div>
            
            <div class="player-list-container" id="player-list">
              <!-- Injecté dynamiquement par JS -->
            </div>
          </div>

          <button class="btn btn-secondary" id="btn-add-player" style="margin-bottom: 8px;">
            + Ajouter un joueur
          </button>
        </div>

        <div class="setup-actions">
          <button class="btn btn-primary" id="btn-start-game">
            Lancer la partie
          </button>
        </div>
      </div>
    `;

    this.renderPlayerList();
    this.bindEvents();
  }

  /**
   * Génère le HTML pour la liste des joueurs
   */
  renderPlayerList() {
    const listContainer = document.getElementById("player-list");
    listContainer.innerHTML = "";

    this.state.playerNames.forEach((name, index) => {
      const row = document.createElement("div");
      row.className = "player-row";
      row.innerHTML = `
        <span class="player-index">${index + 1}</span>
        <input 
          type="text" 
          class="player-input" 
          value="${name}" 
          placeholder="Nom du Joueur ${index + 1}" 
          data-index="${index}"
          maxlength="15"
        />
        ${
          this.state.playerNames.length > 3
            ? `<button class="btn-remove-player" data-index="${index}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
               </button>`
            : ""
        }
      `;
      listContainer.appendChild(row);
    });

    // Mettre à jour le compteur textuel
    document.getElementById("player-count").textContent = `${this.state.playerNames.length} Joueurs`;
  }

  /**
   * Liaison des événements utilisateur
   */
  bindEvents() {
    const listContainer = document.getElementById("player-list");

    // Écouter les changements dans les champs de saisie pour sauvegarder les noms
    listContainer.addEventListener("input", (e) => {
      if (e.target.classList.contains("player-input")) {
        const index = parseInt(e.target.dataset.index, 10);
        this.state.playerNames[index] = e.target.value;
      }
    });

    // Nettoyer les noms vides à la perte de focus (remplir avec Joueur X)
    listContainer.addEventListener("focusout", (e) => {
      if (e.target.classList.contains("player-input")) {
        const index = parseInt(e.target.dataset.index, 10);
        if (!e.target.value.trim()) {
          const defaultName = `Joueur ${index + 1}`;
          this.state.playerNames[index] = defaultName;
          e.target.value = defaultName;
        }
      }
    });

    // Supprimer un joueur
    listContainer.addEventListener("click", (e) => {
      const removeBtn = e.target.closest(".btn-remove-player");
      if (removeBtn) {
        const index = parseInt(removeBtn.dataset.index, 10);
        if (this.state.playerNames.length > 3) {
          this.state.playerNames.splice(index, 1);
          
          // Vérifier si le nombre d'imposteurs ne dépasse pas les limites recommandées
          this.validateImpostors();
          
          this.renderPlayerList();
        }
      }
    });

    // Ajouter un joueur
    document.getElementById("btn-add-player").addEventListener("click", () => {
      const nextIndex = this.state.playerNames.length + 1;
      
      // Choix de noms par défaut sympas
      const defaultNames = ["Emma", "Lucas", "Léa", "Nathan", "Manon", "Louis", "Chloé", "Hugo", "Inès", "Jules"];
      let newName = `Joueur ${nextIndex}`;
      
      // Essayer de trouver un nom inutilisé dans notre liste
      for (const name of defaultNames) {
        if (!this.state.playerNames.includes(name)) {
          newName = name;
          break;
        }
      }

      this.state.playerNames.push(newName);
      this.renderPlayerList();
      
      // Scroller vers le bas de la liste des joueurs
      setTimeout(() => {
        listContainer.scrollTop = listContainer.scrollHeight;
      }, 50);
    });

    // Gestion du nombre d'imposteurs
    const btnImpostorMinus = document.getElementById("btn-impostor-minus");
    const btnImpostorPlus = document.getElementById("btn-impostor-plus");
    const impostorVal = document.getElementById("impostor-value");

    btnImpostorMinus.addEventListener("click", () => {
      if (this.state.impostorCount > 1) {
        this.state.impostorCount--;
        impostorVal.textContent = this.state.impostorCount;
      }
    });

    btnImpostorPlus.addEventListener("click", () => {
      // Limite : max (nombre de joueurs - 2) imposteurs pour garder un intérêt de jeu
      const maxImpostors = Math.max(1, this.state.playerNames.length - 2);
      if (this.state.impostorCount < maxImpostors && this.state.impostorCount < 2) {
        // Pour l'instant on limite à 2 imposteurs maximum
        this.state.impostorCount++;
        impostorVal.textContent = this.state.impostorCount;
      }
    });

    // Lancer le jeu
    document.getElementById("btn-start-game").addEventListener("click", () => {
      // Nettoyer définitivement les noms
      this.state.playerNames = this.state.playerNames.map((name, i) => name.trim() || `Joueur ${i + 1}`);
      
      // Lancer la callback
      this.onStartGame({
        players: [...this.state.playerNames],
        impostorCount: this.state.impostorCount
      });
    });
  }

  /**
   * Assure la validité du nombre d'imposteurs en fonction du nombre de joueurs
   */
  validateImpostors() {
    const maxImpostors = Math.max(1, this.state.playerNames.length - 2);
    if (this.state.impostorCount > maxImpostors) {
      this.state.impostorCount = maxImpostors;
    }
  }
}
