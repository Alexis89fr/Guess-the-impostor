import { audio } from "../audio.js";
import { themesData } from "../words.js";

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

    // S'assurer que les structures sont définies dans l'état
    if (!this.state.playerNames) {
      this.state.playerNames = ["Alice", "Bob", "Charlie", "David"];
    }
    if (!this.state.playerAvatars) {
      this.state.playerAvatars = [null, null, null, null];
    }
    if (this.state.impostorCount === undefined) {
      this.state.impostorCount = 1;
    }
    if (!this.state.activeWordThemes) {
      this.state.activeWordThemes = ["classique"];
    }
    if (!this.state.savedProfiles) {
      this.state.savedProfiles = [];
    }
  }

  /**
   * Traduit une clé en fonction de la langue courante
   */
  t(key) {
    const lang = this.state.language || "fr";
    const dict = {
      fr: {
        title: "Configuration",
        impostors: "Imposteurs",
        players: "Joueurs (ordre de table)",
        addPlayer: "+ Ajouter un joueur",
        savedProfiles: "Profils enregistrés",
        wordThemes: "Thèmes de mots",
        btnStart: "Lancer la partie",
        noSavedProfiles: "Aucun profil enregistré (ajoutez une photo pour sauvegarder)"
      },
      en: {
        title: "Setup Game",
        impostors: "Impostors",
        players: "Players (table order)",
        addPlayer: "+ Add player",
        savedProfiles: "Saved Profiles",
        wordThemes: "Word Themes",
        btnStart: "Start Game",
        noSavedProfiles: "No profiles saved (upload an avatar to save one)"
      }
    };
    return dict[lang][key] || key;
  }

  /**
   * Rend l'écran de configuration
   */
  render() {
    const lang = this.state.language || "fr";

    this.container.innerHTML = `
      <div class="screen setup-screen">
        <header style="margin-bottom: 16px;">
          <h1>${this.t("title")}</h1>
        </header>

        <div class="card" style="margin-bottom: 12px; padding: 16px;">
          <!-- 1. Nombre d'imposteurs -->
          <div class="setup-group" style="margin-bottom: 16px;">
            <div class="label-container">
              <span class="label-title">${this.t("impostors")}</span>
              <span class="number-value" id="impostor-value" style="color: var(--accent-primary);">${this.state.impostorCount}</span>
            </div>
            <div class="number-picker">
              <button class="btn-icon" id="btn-impostor-minus" style="height: 36px; width: 36px;">—</button>
              <p style="font-size: 0.8rem; color: var(--text-muted);">${this.t("impostors")}</p>
              <button class="btn-icon" id="btn-impostor-plus" style="height: 36px; width: 36px;">+</button>
            </div>
          </div>

          <!-- 2. Ordre de passage et Liste des joueurs -->
          <div class="setup-group" style="margin-bottom: 12px;">
            <div class="label-container">
              <span class="label-title">${this.t("players")}</span>
              <span class="text-secondary" id="player-count" style="font-weight: 600; font-size: 0.85rem;">
                ${this.state.playerNames.length}
              </span>
            </div>
            
            <div class="player-list-container" id="player-list">
              <!-- Injecté dynamiquement par JS -->
            </div>

            <button class="btn btn-secondary" id="btn-add-player" style="padding: 10px; font-size: 0.9rem;">
              ${this.t("addPlayer")}
            </button>
          </div>

          <!-- 3. Profils enregistrés (suggestions) -->
          <div class="setup-group" style="margin-bottom: 0;">
            <span class="label-title" style="display: block; margin-bottom: 6px; font-size: 0.8rem;">
              ${this.t("savedProfiles")}
            </span>
            <div class="saved-profiles-panel" id="saved-profiles-list">
              <!-- Profils suggérés -->
            </div>
          </div>
        </div>

        <!-- 4. Choix des thèmes de mots -->
        <div class="card" style="margin-bottom: 16px; padding: 16px;">
          <span class="label-title" style="display: block; margin-bottom: 8px;">
            ${this.t("wordThemes")}
          </span>
          <div class="theme-checkbox-grid">
            ${Object.keys(themesData)
              .map((themeKey) => {
                const theme = themesData[themeKey];
                const isActive = this.state.activeWordThemes.includes(themeKey);
                const displayName = theme.name[lang] || theme.name.fr;
                return `
                <div class="theme-checkbox-card ${isActive ? "active" : ""}" data-theme="${themeKey}">
                  <input type="checkbox" id="chk-${themeKey}" ${isActive ? "checked" : ""} />
                  <span class="theme-checkbox-title">${displayName}</span>
                </div>
              `;
              })
              .join("")}
          </div>
        </div>

        <div class="setup-actions">
          <button class="btn btn-primary" id="btn-start-game">
            ${this.t("btnStart")}
          </button>
        </div>
      </div>
    `;

    this.renderPlayerList();
    this.renderSavedProfiles();
    this.bindEvents();
  }

  /**
   * Génère le HTML pour la liste des joueurs
   */
  renderPlayerList() {
    const listContainer = document.getElementById("player-list");
    listContainer.innerHTML = "";

    this.state.playerNames.forEach((name, index) => {
      const avatar = this.state.playerAvatars[index];
      const row = document.createElement("div");
      row.className = "player-row";
      row.draggable = true;
      row.dataset.index = index;
      
      row.innerHTML = `
        <!-- Poignée de drag-and-drop tactile -->
        <div class="drag-handle" title="Faites glisser pour réordonner">☰</div>

        <span class="player-index">${index + 1}</span>
        
        <!-- Upload d'avatar -->
        <div class="avatar-container" data-index="${index}">
          ${
            avatar 
              ? `<img src="${avatar}" alt="${name}" />`
              : `<span class="avatar-placeholder-char">${name.charAt(0).toUpperCase()}</span>`
          }
          <input type="file" accept="image/*" class="avatar-file-input" data-index="${index}" />
        </div>

        <!-- Saisie du Nom -->
        <input 
          type="text" 
          class="player-input" 
          value="${name}" 
          placeholder="Joueur ${index + 1}" 
          data-index="${index}"
          maxlength="15"
        />

        <!-- Bouton de suppression -->
        ${
          this.state.playerNames.length > 3
            ? `<button class="btn-remove-player" data-index="${index}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
               </button>`
            : ""
        }
      `;
      listContainer.appendChild(row);
    });

    document.getElementById("player-count").textContent = `${this.state.playerNames.length}`;
  }

  /**
   * Affiche la liste des profils enregistrés dans le localStorage
   */
  renderSavedProfiles() {
    const list = document.getElementById("saved-profiles-list");
    list.innerHTML = "";

    if (this.state.savedProfiles.length === 0) {
      list.innerHTML = `<span style="font-size:0.75rem; color: var(--text-muted);">${this.t("noSavedProfiles")}</span>`;
      return;
    }

    this.state.savedProfiles.forEach((profile) => {
      const chip = document.createElement("div");
      chip.className = "profile-chip";
      chip.innerHTML = `
        ${
          profile.avatar 
            ? `<img src="${profile.avatar}" class="profile-chip-avatar" />`
            : `<span style="font-weight:700; color: var(--accent-primary); width:16px; text-align:center;">${profile.name.charAt(0).toUpperCase()}</span>`
        }
        <span>${profile.name}</span>
      `;
      
      chip.addEventListener("click", () => {
        audio.playClick();
        this.addSavedProfileToParty(profile);
      });
      list.appendChild(chip);
    });
  }

  /**
   * Ajoute un profil de joueur enregistré à la partie actuelle
   */
  addSavedProfileToParty(profile) {
    this.state.playerNames.push(profile.name);
    this.state.playerAvatars.push(profile.avatar);
    this.renderPlayerList();
    this.validateImpostors();
    
    // Scroller vers le bas
    const listContainer = document.getElementById("player-list");
    setTimeout(() => {
      listContainer.scrollTop = listContainer.scrollHeight;
    }, 50);
  }

  /**
   * Liaison des événements utilisateur
   */
  bindEvents() {
    const listContainer = document.getElementById("player-list");

    // Saisie des noms
    listContainer.addEventListener("input", (e) => {
      if (e.target.classList.contains("player-input")) {
        const index = parseInt(e.target.dataset.index, 10);
        this.state.playerNames[index] = e.target.value;
      }
    });

    // Perte de focus sur un nom (remplit automatiquement s'il est vide)
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

    // Clics sur la ligne de joueur (suppression & déclenchement d'avatar)
    listContainer.addEventListener("click", (e) => {
      // 1. Déclenchement de l'input file lors du clic sur le conteneur d'avatar
      const avatarContainer = e.target.closest(".avatar-container");
      if (avatarContainer && e.target.type !== "file") {
        const fileInput = avatarContainer.querySelector("input[type='file']");
        if (fileInput) fileInput.click();
      }

      // 2. Supprimer un joueur
      const removeBtn = e.target.closest(".btn-remove-player");
      if (removeBtn) {
        audio.playClick();
        const index = parseInt(removeBtn.dataset.index, 10);
        if (this.state.playerNames.length > 3) {
          this.state.playerNames.splice(index, 1);
          this.state.playerAvatars.splice(index, 1);
          this.validateImpostors();
          this.renderPlayerList();
        }
      }
    });

    // --- DRAG AND DROP MOUSE (DESKTOP) ---
    listContainer.addEventListener("dragstart", (e) => {
      const row = e.target.closest(".player-row");
      if (!row) return;
      row.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", row.dataset.index);
    });

    listContainer.addEventListener("dragover", (e) => {
      e.preventDefault();
      const draggingRow = listContainer.querySelector(".player-row.dragging");
      const targetRow = e.target.closest(".player-row");
      if (!targetRow || targetRow === draggingRow) return;

      const bounding = targetRow.getBoundingClientRect();
      const offset = e.clientY - bounding.top;
      const isAfter = offset > bounding.height / 2;

      if (isAfter) {
        targetRow.after(draggingRow);
      } else {
        targetRow.before(draggingRow);
      }
    });

    listContainer.addEventListener("drop", (e) => {
      e.preventDefault();
      const rows = Array.from(listContainer.querySelectorAll(".player-row"));
      const newNames = [];
      const newAvatars = [];
      
      rows.forEach((row) => {
        const oldIndex = parseInt(row.dataset.index, 10);
        newNames.push(this.state.playerNames[oldIndex]);
        newAvatars.push(this.state.playerAvatars[oldIndex]);
      });
      
      this.state.playerNames = newNames;
      this.state.playerAvatars = newAvatars;
      
      this.renderPlayerList();
    });

    listContainer.addEventListener("dragend", (e) => {
      const row = e.target.closest(".player-row");
      if (row) {
        row.classList.remove("dragging");
      }
      this.renderPlayerList();
    });

    // --- DRAG AND DROP TOUCH (MOBILE) ---
    let touchStartEl = null;
    let touchStartY = 0;

    listContainer.addEventListener("touchstart", (e) => {
      const handle = e.target.closest(".drag-handle");
      if (!handle) return;
      const row = handle.closest(".player-row");
      if (!row) return;
      
      touchStartEl = row;
      touchStartY = e.touches[0].clientY;
      row.classList.add("dragging");
    }, { passive: true });

    listContainer.addEventListener("touchmove", (e) => {
      if (!touchStartEl) return;
      const currentY = e.touches[0].clientY;
      
      // Trouver l'élément actuellement survolé par le doigt
      const targetEl = document.elementFromPoint(e.touches[0].clientX, currentY);
      const targetRow = targetEl ? targetEl.closest(".player-row") : null;
      
      if (targetRow && targetRow !== touchStartEl) {
        const bounding = targetRow.getBoundingClientRect();
        const offset = currentY - bounding.top;
        const isAfter = offset > bounding.height / 2;
        
        if (isAfter) {
          targetRow.after(touchStartEl);
        } else {
          targetRow.before(touchStartEl);
        }
      }
    }, { passive: true });

    listContainer.addEventListener("touchend", () => {
      if (!touchStartEl) return;
      touchStartEl.classList.remove("dragging");
      touchStartEl = null;
      
      // Reconstruire le tableau en fonction de l'ordre réel du DOM
      const rows = Array.from(listContainer.querySelectorAll(".player-row"));
      const newNames = [];
      const newAvatars = [];
      
      rows.forEach((row) => {
        const oldIndex = parseInt(row.dataset.index, 10);
        newNames.push(this.state.playerNames[oldIndex]);
        newAvatars.push(this.state.playerAvatars[oldIndex]);
      });
      
      this.state.playerNames = newNames;
      this.state.playerAvatars = newAvatars;
      
      this.renderPlayerList();
    });

    // Écouter le chargement des images d'avatars
    listContainer.addEventListener("change", (e) => {
      if (e.target.classList.contains("avatar-file-input")) {
        const index = parseInt(e.target.dataset.index, 10);
        const file = e.target.files[0];
        if (file) {
          this.processAndCompressAvatar(file, index);
        }
      }
    });

    // Ajouter un joueur vierge
    document.getElementById("btn-add-player").addEventListener("click", () => {
      audio.playClick();
      const nextIndex = this.state.playerNames.length + 1;
      
      const defaultNames = ["Emma", "Lucas", "Léa", "Nathan", "Manon", "Louis", "Chloé", "Hugo", "Inès", "Jules"];
      let newName = `Joueur ${nextIndex}`;
      for (const name of defaultNames) {
        if (!this.state.playerNames.includes(name)) {
          newName = name;
          break;
        }
      }

      this.state.playerNames.push(newName);
      this.state.playerAvatars.push(null);
      this.renderPlayerList();
      
      setTimeout(() => {
        listContainer.scrollTop = listContainer.scrollHeight;
      }, 50);
    });

    // Paramètres imposteurs
    const btnImpostorMinus = document.getElementById("btn-impostor-minus");
    const btnImpostorPlus = document.getElementById("btn-impostor-plus");
    const impostorVal = document.getElementById("impostor-value");

    btnImpostorMinus.addEventListener("click", () => {
      if (this.state.impostorCount > 1) {
        audio.playClick();
        this.state.impostorCount--;
        impostorVal.textContent = this.state.impostorCount;
      }
    });

    btnImpostorPlus.addEventListener("click", () => {
      const maxImpostors = Math.max(1, this.state.playerNames.length - 2);
      if (this.state.impostorCount < maxImpostors && this.state.impostorCount < 2) {
        audio.playClick();
        this.state.impostorCount++;
        impostorVal.textContent = this.state.impostorCount;
      }
    });

    // Gestion des cases à cocher des thèmes de mots
    const cards = document.querySelectorAll(".theme-checkbox-card");
    cards.forEach((card) => {
      card.addEventListener("click", (e) => {
        // Empêcher le double-déclenchement si l'utilisateur a cliqué sur la checkbox elle-même
        if (e.target.type === "checkbox") return;

        const chk = card.querySelector("input[type='checkbox']");
        chk.checked = !chk.checked;
        this.toggleTheme(card, chk.checked);
      });

      const chk = card.querySelector("input[type='checkbox']");
      chk.addEventListener("change", () => {
        this.toggleTheme(card, chk.checked);
      });
    });

    // Lancer la partie
    document.getElementById("btn-start-game").addEventListener("click", () => {
      audio.playClick();
      
      // Nettoyage et formatage final
      this.state.playerNames = this.state.playerNames.map((name, i) => name.trim() || `Joueur ${i + 1}`);

      // Enregistrer les joueurs dans notre banque de profils persistante si ils ont une photo
      this.state.playerNames.forEach((name, i) => {
        const avatar = this.state.playerAvatars[i];
        if (avatar) {
          const alreadyExists = this.state.savedProfiles.some(p => p.name.toLowerCase() === name.toLowerCase());
          if (!alreadyExists) {
            this.state.savedProfiles.push({ name, avatar });
          }
        }
      });
      
      this.onStartGame({
        players: [...this.state.playerNames],
        avatars: [...this.state.playerAvatars],
        impostorCount: this.state.impostorCount,
        activeWordThemes: [...this.state.activeWordThemes]
      });
    });
  }

  /**
   * Coche/décoche un thème de mot dans la liste
   */
  toggleTheme(card, isChecked) {
    audio.playClick();
    const themeKey = card.dataset.theme;
    
    if (isChecked) {
      card.classList.add("active");
      if (!this.state.activeWordThemes.includes(themeKey)) {
        this.state.activeWordThemes.push(themeKey);
      }
    } else {
      // Empêcher de désactiver tous les thèmes (il doit toujours en rester un)
      if (this.state.activeWordThemes.length > 1) {
        card.classList.remove("active");
        this.state.activeWordThemes = this.state.activeWordThemes.filter(t => t !== themeKey);
      } else {
        // Rétablir la case à cocher
        const chk = card.querySelector("input[type='checkbox']");
        chk.checked = true;
      }
    }
  }

  /**
   * Échange la position de deux joueurs dans la liste
   */
  swapPlayers(idx1, idx2) {
    // Échanger les noms
    const tempName = this.state.playerNames[idx1];
    this.state.playerNames[idx1] = this.state.playerNames[idx2];
    this.state.playerNames[idx2] = tempName;

    // Échanger les avatars
    const tempAvatar = this.state.playerAvatars[idx1];
    this.state.playerAvatars[idx1] = this.state.playerAvatars[idx2];
    this.state.playerAvatars[idx2] = tempAvatar;

    this.renderPlayerList();
  }

  /**
   * Charge, recadre et compresse l'image pour tenir dans le LocalStorage
   * @param {File} file - Fichier image
   * @param {number} playerIndex - Index du joueur ciblé
   */
  processAndCompressAvatar(file, playerIndex) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Redimensionnement via un Canvas off-screen
        const canvas = document.createElement("canvas");
        const size = 80; // Vignette carrée de 80x80 pixels
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        // Recadrage en carré (centré)
        let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height;
        if (img.width > img.height) {
          sWidth = img.height;
          sx = (img.width - img.height) / 2;
        } else {
          sHeight = img.width;
          sy = (img.height - img.width) / 2;
        }

        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, size, size);

        // Récupérer la chaîne Base64 compressée
        const base64Avatar = canvas.toDataURL("image/jpeg", 0.7); // Compression JPEG 70%

        // Sauvegarder
        this.state.playerAvatars[playerIndex] = base64Avatar;
        this.renderPlayerList();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  /**
   * Sécurité : Ajuste les imposteurs si le nombre de joueurs baisse
   */
  validateImpostors() {
    const maxImpostors = Math.max(1, this.state.playerNames.length - 2);
    if (this.state.impostorCount > maxImpostors) {
      this.state.impostorCount = maxImpostors;
    }
  }
}
export default SetupScreen;
