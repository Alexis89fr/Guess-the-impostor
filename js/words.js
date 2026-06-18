// Base de données des paires de mots du dictionnaire pour le jeu de l'Imposteur
// Chaque paire contient un mot A pour les joueurs normaux et un mot B pour l'imposteur.
// Les mots sont similaires mais distincts pour permettre des descriptions ambiguës.

export const wordPairs = [
  { wordA: "Sac à dos", wordB: "Sac à main" },
  { wordA: "École", wordB: "Collège" },
  { wordA: "Chien", wordB: "Chat" },
  { wordA: "Soleil", wordB: "Lune" },
  { wordA: "Thé", wordB: "Café" },
  { wordA: "Ordinateur", wordB: "Téléphone" },
  { wordA: "Livre", wordB: "Journal" },
  { wordA: "Avion", wordB: "Train" },
  { wordA: "Vélo", wordB: "Trottinette" },
  { wordA: "Guitare", wordB: "Violon" },
  { wordA: "Pomme", wordB: "Poire" },
  { wordA: "Mer", wordB: "Océan" },
  { wordA: "Fourchette", wordB: "Cuillère" },
  { wordA: "Lit", wordB: "Canapé" },
  { wordA: "Chapeau", wordB: "Casquette" },
  { wordA: "Stylo", wordB: "Crayon" },
  { wordA: "Voiture", wordB: "Camion" },
  { wordA: "Fenêtre", wordB: "Porte" },
  { wordA: "Bouteille", wordB: "Carafe" },
  { wordA: "Piscine", wordB: "Baignoire" }
];

/**
  * Récupère une paire de mots aléatoire de la liste.
  * @returns {{wordA: string, wordB: string}}
  */
export function getRandomPair() {
  const randomIndex = Math.floor(Math.random() * wordPairs.length);
  // Pour varier, on échange aléatoirement quel mot est donné aux joueurs normaux (A) et à l'imposteur (B)
  const pair = wordPairs[randomIndex];
  if (Math.random() > 0.5) {
    return { wordA: pair.wordB, wordB: pair.wordA };
  }
  return { ...pair };
}
