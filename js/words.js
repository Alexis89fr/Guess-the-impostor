// Base de données complète de mots pour le jeu de l'Imposteur
// Contient plus de 400 paires de mots réparties dans 25 thèmes (classique + pop culture).

export const themesData = {
  classique: {
    name: { fr: "Classique 📚", en: "Classic 📚" },
    pairs: [
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
      { wordA: "Piscine", wordB: "Baignoire" },
      { wordA: "Lunettes", wordB: "Lentilles" },
      { wordA: "Bougie", wordB: "Lampe" },
      { wordA: "Clavier", wordB: "Souris" },
      { wordA: "Horloge", wordB: "Montre" },
      { wordA: "Peinture", wordB: "Dessin" },
      { wordA: "Chaise", wordB: "Tabouret" },
      { wordA: "Chaussette", wordB: "Chaussure" },
      { wordA: "Gant", wordB: "Moufle" },
      { wordA: "Chauffage", wordB: "Cheminée" },
      { wordA: "Clé", wordB: "Serrure" },
      { wordA: "Papier", wordB: "Carton" },
      { wordA: "Ciseau", wordB: "Couteau" },
      { wordA: "Miroir", wordB: "Vitre" },
      { wordA: "Assiette", wordB: "Bol" },
      { wordA: "Poêle", wordB: "Casserole" },
      { wordA: "Sel", wordB: "Poivre" },
      { wordA: "Sucre", wordB: "Miel" },
      { wordA: "Beurre", wordB: "Margarine" },
      { wordA: "Lait", wordB: "Crème" },
      { wordA: "Pain", wordB: "Brioche" },
      { wordA: "Gâteau", wordB: "Tarte" },
      { wordA: "Chocolat", wordB: "Caramel" },
      { wordA: "Fraise", wordB: "Framboise" },
      { wordA: "Orange", wordB: "Pamplemousse" },
      { wordA: "Banane", wordB: "Ananas" },
      { wordA: "Patate", wordB: "Carotte" },
      { wordA: "Tomate", wordB: "Courgette" },
      { wordA: "Salade", wordB: "Chou" },
      { wordA: "Oignon", wordB: "Ail" },
      { wordA: "Riz", wordB: "Pâtes" },
      { wordA: "Fromage", wordB: "Yaourt" },
      { wordA: "Viande", wordB: "Poisson" },
      { wordA: "Eau", wordB: "Jus" },
      { wordA: "Bière", wordB: "Vin" },
      { wordA: "Fête", wordB: "Anniversaire" },
      { wordA: "Plage", wordB: "Piscine" },
      { wordA: "Forêt", wordB: "Parc" },
      { wordA: "Montagne", wordB: "Colline" },
      { wordA: "Ciel", wordB: "Nuage" },
      { wordA: "Pluie", wordB: "Neige" },
      { wordA: "Vent", wordB: "Tempête" },
      { wordA: "Orage", wordB: "Éclair" },
      { wordA: "Étoile", wordB: "Planète" },
      { wordA: "Feu", wordB: "Cendre" },
      { wordA: "Fumée", wordB: "Vapeur" },
      { wordA: "Sable", wordB: "Gravier" },
      { wordA: "Pierre", wordB: "Terre" },
      { wordA: "Herbe", wordB: "Fleur" },
      { wordA: "Arbre", wordB: "Arbuste" },
      { wordA: "Oiseau", wordB: "Papillon" },
      { wordA: "Poisson", wordB: "Dauphin" },
      { wordA: "Lion", wordB: "Tigre" },
      { wordA: "Ours", wordB: "Loup" },
      { wordA: "Singe", wordB: "Gorille" },
      { wordA: "Éléphant", wordB: "Girafe" },
      { wordA: "Cheval", wordB: "Poney" },
      { wordA: "Vache", wordB: "Mouton" },
      { wordA: "Poule", wordB: "Canard" },
      { wordA: "Grenouille", wordB: "Crapaud" },
      { wordA: "Serpent", wordB: "Lézard" },
      { wordA: "Araignée", wordB: "Scorpion" },
      { wordA: "Abeille", wordB: "Guêpe" },
      { wordA: "Fourmi", wordB: "Termite" },
      { wordA: "Moustique", wordB: "Mouche" },
      { wordA: "Sac", wordB: "Valise" },
      { wordA: "Veste", wordB: "Manteau" },
      { wordA: "Pantalon", wordB: "Short" },
      { wordA: "Chemise", wordB: "T-shirt" },
      { wordA: "Robe", wordB: "Jupe" },
      { wordA: "Chapeau", wordB: "Bonnet" },
      { wordA: "Parapluie", wordB: "Imperméable" },
      { wordA: "Savon", wordB: "Shampoing" },
      { wordA: "Dentifrice", wordB: "Brosse à dents" },
      { wordA: "Serviette", wordB: "Gant de toilette" },
      { wordA: "Miroir", wordB: "Peigne" },
      { wordA: "Parfum", wordB: "Déodorant" },
      { wordA: "Maquillage", wordB: "Crème" },
      { wordA: "Bijou", wordB: "Montre" },
      { wordA: "Sac", wordB: "Portefeuille" },
      { wordA: "Pièce", wordB: "Billet" },
      { wordA: "Maison", wordB: "Immeuble" },
      { wordA: "Jardin", wordB: "Balcon" },
      { wordA: "Cuisine", wordB: "Salon" }
    ]
  },
  naruto: {
    name: { fr: "Naruto 🍥", en: "Naruto 🍥" },
    pairs: [
      { wordA: "Naruto", wordB: "Sasuke" },
      { wordA: "Itachi", wordB: "Sasuke" },
      { wordA: "Madara", wordB: "Hashirama" },
      { wordA: "Kakashi", wordB: "Obito" },
      { wordA: "Rasengan", wordB: "Chidori" },
      { wordA: "Konoha", wordB: "Suna" },
      { wordA: "Kyubi", wordB: "Hachibi" },
      { wordA: "Jiraya", wordB: "Orochimaru" },
      { wordA: "Sakura", wordB: "Hinata" },
      { wordA: "Gaara", wordB: "Rock Lee" },
      { wordA: "Sharingan", wordB: "Byakugan" },
      { wordA: "Akatsuki", wordB: "Gokage" },
      { wordA: "Kunai", wordB: "Shuriken" },
      { wordA: "Hokage", wordB: "Kazekage" }
    ]
  },
  nintendo: {
    name: { fr: "Nintendo 🎮", en: "Nintendo 🎮" },
    pairs: [
      { wordA: "Mario", wordB: "Luigi" },
      { wordA: "Zelda", wordB: "Link" },
      { wordA: "Bowser", wordB: "Donkey Kong" },
      { wordA: "Pikachu", wordB: "Évoli" },
      { wordA: "Peach", wordB: "Daisy" },
      { wordA: "Yoshi", wordB: "Toad" },
      { wordA: "Pokéball", wordB: "Superball" },
      { wordA: "Hyrule", wordB: "Royaume Champignon" },
      { wordA: "Samus", wordB: "Mega Man" },
      { wordA: "Nintendo Switch", wordB: "Wii U" },
      { wordA: "Mario Kart", wordB: "Super Smash Bros." },
      { wordA: "Splatoon", wordB: "Animal Crossing" }
    ]
  },
  star_wars: {
    name: { fr: "Star Wars 🌌", en: "Star Wars 🌌" },
    pairs: [
      { wordA: "Jedi", wordB: "Sith" },
      { wordA: "Sabre Laser", wordB: "La Force" },
      { wordA: "Anakin Skywalker", wordB: "Luke Skywalker" },
      { wordA: "Empire", wordB: "Rébellion" },
      { wordA: "Darth Vader", wordB: "Palpatine" },
      { wordA: "Han Solo", wordB: "Chewbacca" },
      { wordA: "R2-D2", wordB: "C-3PO" },
      { wordA: "Étoile de la Mort", wordB: "Base Starkiller" },
      { wordA: "Stormtrooper", wordB: "Clone Trooper" },
      { wordA: "Tatooine", wordB: "Hoth" },
      { wordA: "X-Wing", wordB: "Chasseur TIE" },
      { wordA: "Yoda", wordB: "Obi-Wan" }
    ]
  },
  marvel: {
    name: { fr: "Marvel 🦸‍♂️", en: "Marvel 🦸‍♂️" },
    pairs: [
      { wordA: "Iron Man", wordB: "Captain America" },
      { wordA: "Spider-Man", wordB: "Miles Morales" },
      { wordA: "Thor", wordB: "Loki" },
      { wordA: "Avengers", wordB: "X-Men" },
      { wordA: "Thanos", wordB: "Galactus" },
      { wordA: "Hulk", wordB: "Abomination" },
      { wordA: "Wolverine", wordB: "Deadpool" },
      { wordA: "Wakanda", wordB: "Asgard" },
      { wordA: "Bouclier de Cap", wordB: "Marteau de Thor" },
      { wordA: "Groot", wordB: "Rocket Raccoon" },
      { wordA: "Stan Lee", wordB: "Jack Kirby" }
    ]
  },
  dc: {
    name: { fr: "DC Comics 🦇", en: "DC Comics 🦇" },
    pairs: [
      { wordA: "Batman", wordB: "Superman" },
      { wordA: "Joker", wordB: "Harley Quinn" },
      { wordA: "Gotham City", wordB: "Metropolis" },
      { wordA: "Flash", wordB: "Reverse Flash" },
      { wordA: "Wonder Woman", wordB: "Shazam" },
      { wordA: "Robin", wordB: "Nightwing" },
      { wordA: "Lex Luthor", wordB: "Brainiac" },
      { wordA: "Batcave", wordB: "Forteresse de la Solitude" },
      { wordA: "Ligue de la Justice", wordB: "Suicide Squad" },
      { wordA: "Aquaman", wordB: "Namor" }
    ]
  },
  one_piece: {
    name: { fr: "One Piece ☠️", en: "One Piece ☠️" },
    pairs: [
      { wordA: "Luffy", wordB: "Gold Roger" },
      { wordA: "Zoro", wordB: "Sanji" },
      { wordA: "Marine", wordB: "Pirates" },
      { wordA: "Fruit du Démon", wordB: "Le Haki" },
      { wordA: "Shanks", wordB: "Mihawk" },
      { wordA: "Nami", wordB: "Nico Robin" },
      { wordA: "Kaido", wordB: "Big Mom" },
      { wordA: "Thousand Sunny", wordB: "Going Merry" },
      { wordA: "Impel Down", wordB: "Enies Lobby" },
      { wordA: "Barbe Blanche", wordB: "Barbe Noire" }
    ]
  },
  bleach: {
    name: { fr: "Bleach ⚔️", en: "Bleach ⚔️" },
    pairs: [
      { wordA: "Ichigo", wordB: "Rukia" },
      { wordA: "Zanpakutō", wordB: "Quincy" },
      { wordA: "Soul Society", wordB: "Hueco Mundo" },
      { wordA: "Aizen", wordB: "Yhwach" },
      { wordA: "Bankai", wordB: "Shikai" },
      { wordA: "Gotei 13", wordB: "Espada" },
      { wordA: "Uryū", wordB: "Chad" },
      { wordA: "Renji", wordB: "Byakuya" },
      { wordA: "Hollow", wordB: "Shinigami" },
      { wordA: "Kenpachi", wordB: "Hitsugaya" }
    ]
  },
  berserk: {
    name: { fr: "Berserk 🗡️", en: "Berserk 🗡️" },
    pairs: [
      { wordA: "Guts", wordB: "Griffith" },
      { wordA: "Dragon Slayer", wordB: "Béhérit" },
      { wordA: "Casca", wordB: "Farnese" },
      { wordA: "Troupe du Faucon", wordB: "God Hand" },
      { wordA: "L'Éclipse", wordB: "L'Âge d'Or" },
      { wordA: "Puck", wordB: "Ivalera" },
      { wordA: "Skull Knight", wordB: "Zodd le Nosferatu" },
      { wordA: "Armure du Berserker", wordB: "Épée du Faucon Blanc" }
    ]
  },
  game_of_thrones: {
    name: { fr: "Game of Thrones 👑", en: "Game of Thrones 👑" },
    pairs: [
      { wordA: "Jon Snow", wordB: "Robb Stark" },
      { wordA: "Daenerys Targaryen", wordB: "Cersei Lannister" },
      { wordA: "Winterfell", wordB: "Port-Réal" },
      { wordA: "Maison Stark", wordB: "Maison Lannister" },
      { wordA: "Le Limier", wordB: "La Montagne" },
      { wordA: "Tyrion", wordB: "Varys" },
      { wordA: "Marcheur Blanc", wordB: "Dragon" },
      { wordA: "Le Mur", wordB: "Le Trône de Fer" },
      { wordA: "Arya", wordB: "Sansa" }
    ]
  },
  breaking_bad: {
    name: { fr: "Breaking Bad 🧪", en: "Breaking Bad 🧪" },
    pairs: [
      { wordA: "Walter White", wordB: "Jesse Pinkman" },
      { wordA: "Gustavo Fring", wordB: "Lalo Salamanca" },
      { wordA: "Los Pollos Hermanos", wordB: "Madrigal" },
      { wordA: "Heisenberg", wordB: "Mr. Lambert" },
      { wordA: "Hank Schrader", wordB: "Steve Gomez" },
      { wordA: "Mike Ehrmantraut", wordB: "Jonathan Banks" },
      { wordA: "Albuquerque", wordB: "El Paso" },
      { wordA: "Blue Meth", wordB: "Méthylamine" }
    ]
  },
  better_call_saul: {
    name: { fr: "Better Call Saul ⚖️", en: "Better Call Saul ⚖️" },
    pairs: [
      { wordA: "Saul Goodman", wordB: "Kim Wexler" },
      { wordA: "Jimmy McGill", wordB: "Chuck McGill" },
      { wordA: "Howard Hamlin", wordB: "Cliff Main" },
      { wordA: "Nacho Varga", wordB: "Tuco Salamanca" },
      { wordA: "HHM", wordB: "Davis & Main" },
      { wordA: "Slippin' Jimmy", wordB: "Gene Takavic" }
    ]
  },
  cyberpunk: {
    name: { fr: "Cyberpunk 🦾", en: "Cyberpunk 🦾" },
    pairs: [
      { wordA: "Night City", wordB: "Les Badlands" },
      { wordA: "V (Protagoniste)", wordB: "Johnny Silverhand" },
      { wordA: "Netrunner", wordB: "Solo" },
      { wordA: "Arasaka", wordB: "Militech" },
      { wordA: "Cyberware", wordB: "Bioware" },
      { wordA: "Edgerunners", wordB: "Fixers" },
      { wordA: "Braindance", wordB: "Holo" },
      { wordA: "Trauma Team", wordB: "MaxTac" }
    ]
  },
  red_dead: {
    name: { fr: "Red Dead 🤠", en: "Red Dead 🤠" },
    pairs: [
      { wordA: "Arthur Morgan", wordB: "John Marston" },
      { wordA: "Dutch van der Linde", wordB: "Micah Bell" },
      { wordA: "Van der Linde Gang", wordB: "O'Driscoll Boyz" },
      { wordA: "Revolver", wordB: "Carabine Repeater" },
      { wordA: "Saint Denis", wordB: "Valentine" },
      { wordA: "Sadie Adler", wordB: "Abigail Marston" },
      { wordA: "Blackwater", wordB: "Armadillo" }
    ]
  },
  gta: {
    name: { fr: "GTA 🚗", en: "GTA 🚗" },
    pairs: [
      { wordA: "Franklin", wordB: "Trevor" },
      { wordA: "Los Santos", wordB: "Liberty City" },
      { wordA: "CJ (Carl Johnson)", wordB: "Big Smoke" },
      { wordA: "Michael De Santa", wordB: "Niko Bellic" },
      { wordA: "Lester Crest", wordB: "Lamar Davis" },
      { wordA: "Ammu-Nation", wordB: "Los Santos Customs" },
      { wordA: "Vice City", wordB: "San Andreas" }
    ]
  },
  demon_slayer: {
    name: { fr: "Demon Slayer 🗡️👹", en: "Demon Slayer 🗡️👹" },
    pairs: [
      { wordA: "Tanjiro", wordB: "Nezuko" },
      { wordA: "Muzan Kibutsuji", wordB: "Kokushibo" },
      { wordA: "Les Piliers", wordB: "Les Douze Lunes" },
      { wordA: "Souffle de l'Eau", wordB: "Souffle du Soleil" },
      { wordA: "Zenitsu", wordB: "Inosuke" },
      { wordA: "Giyu Tomioka", wordB: "Kyojuro Rengoku" },
      { wordA: "Katana du Soleil", wordB: "Sabre en bois" },
      { wordA: "Boîte en bois", wordB: "Masque de Sanglier" }
    ]
  },
  rock: {
    name: { fr: "Musique Rock 🎸", en: "Rock Music 🎸" },
    pairs: [
      { wordA: "Guitare électrique", wordB: "Guitare basse" },
      { wordA: "Kurt Cobain", wordB: "Jimi Hendrix" },
      { wordA: "Led Zeppelin", wordB: "Pink Floyd" },
      { wordA: "The Beatles", wordB: "The Rolling Stones" },
      { wordA: "Rock 'n' Roll", wordB: "Hard Rock" },
      { wordA: "Micro", wordB: "Amplificateur" },
      { wordA: "Queen", wordB: "David Bowie" }
    ]
  },
  metal: {
    name: { fr: "Musique Metal 🤘", en: "Metal Music 🤘" },
    pairs: [
      { wordA: "Metallica", wordB: "Megadeth" },
      { wordA: "Heavy Metal", wordB: "Death Metal" },
      { wordA: "Iron Maiden", wordB: "Black Sabbath" },
      { wordA: "Slayer", wordB: "Pantera" },
      { wordA: "Riff de guitare", wordB: "Double Pédale" },
      { wordA: "System of a Down", wordB: "Slipknot" }
    ]
  },
  walking_dead: {
    name: { fr: "The Walking Dead 🧟", en: "The Walking Dead 🧟" },
    pairs: [
      { wordA: "Rick Grimes", wordB: "Daryl Dixon" },
      { wordA: "Negan", wordB: "Le Gouverneur" },
      { wordA: "Les Rôdeurs", wordB: "Les Chuchoteurs" },
      { wordA: "Lucille (Batte)", wordB: "L'Arbalète de Daryl" },
      { wordA: "Alexandria", wordB: "La Colline" },
      { wordA: "Carl Grimes", wordB: "Judith Grimes" },
      { wordA: "Glenn Rhee", wordB: "Maggie Greene" }
    ]
  },
  youtube_francais: {
    name: { fr: "YouTube Français 📺", en: "French YouTube 📺" },
    pairs: [
      { wordA: "Squeezie", wordB: "Amixem" },
      { wordA: "Joueur du Grenier", wordB: "Antoine Daniel" },
      { wordA: "Mister V", wordB: "Freddy Gladieux" },
      { wordA: "GP Explorer", wordB: "Eleven All Stars" },
      { wordA: "Cyprien", wordB: "Norman" },
      { wordA: "Inoxtag", wordB: "Michou" },
      { wordA: "Mcfly", wordB: "Carlito" }
    ]
  },
  minecraft: {
    name: { fr: "Minecraft 🟩", en: "Minecraft 🟩" },
    pairs: [
      { wordA: "Steve", wordB: "Alex" },
      { wordA: "Creeper", wordB: "Enderman" },
      { wordA: "Nether", wordB: "L'Ender" },
      { wordA: "Pioche en Diamant", wordB: "Pioche en Netherite" },
      { wordA: "Zombie", wordB: "Squelette" },
      { wordA: "Table d'enchantement", wordB: "Alambic" },
      { wordA: "Redstone", wordB: "Lapis-lazuli" },
      { wordA: "Ender Dragon", wordB: "Wither" }
    ]
  },
  soulsborne: {
    name: { fr: "Soulsborne ⚔️🔥", en: "Soulsborne ⚔️🔥" },
    pairs: [
      { wordA: "Dark Souls", wordB: "Bloodborne" },
      { wordA: "Elden Ring", wordB: "Sekiro" },
      { wordA: "Anor Londo", wordB: "Yharnam" },
      { wordA: "Malenia", wordB: "Radahn" },
      { wordA: "Feu de camp (Bonfire)", wordB: "Lanterne" },
      { wordA: "Fiole d'Estus", wordB: "Fiole de sang" },
      { wordA: "Chevalier d'Artorias", wordB: "Ludwig le Maudit" }
    ]
  },
  resident_evil: {
    name: { fr: "Resident Evil ☣️", en: "Resident Evil ☣️" },
    pairs: [
      { wordA: "Leon S. Kennedy", wordB: "Chris Redfield" },
      { wordA: "Jill Valentine", wordB: "Claire Redfield" },
      { wordA: "Umbrella Corporation", wordB: "Raccoon City" },
      { wordA: "Virus T", wordB: "Les Plagas" },
      { wordA: "Nemesis", wordB: "Mr. X" },
      { wordA: "Albert Wesker", wordB: "Ada Wong" }
    ]
  },
  dragon_ball: {
    name: { fr: "Dragon Ball 🐉", en: "Dragon Ball 🐉" },
    pairs: [
      { wordA: "Goku", wordB: "Vegeta" },
      { wordA: "Gohan", wordB: "Trunks" },
      { wordA: "Frieza", wordB: "Cell" },
      { wordA: "Super Saiyan", wordB: "Ultra Instinct" },
      { wordA: "Shenron", wordB: "Porunga" },
      { wordA: "Kamehameha", wordB: "Final Flash" },
      { wordA: "Bulma", wordB: "Chichi" }
    ]
  },
  fairy_tail: {
    name: { fr: "Fairy Tail 👆", en: "Fairy Tail 👆" },
    pairs: [
      { wordA: "Natsu", wordB: "Gray" },
      { wordA: "Lucy", wordB: "Erza" },
      { wordA: "Happy", wordB: "Carla" },
      { wordA: "Fairy Tail", wordB: "Sabertooth" },
      { wordA: "Zeref", wordB: "Acnologia" },
      { wordA: "Chasseur de Dragon", wordB: "Magie constructrice de Glace" }
    ]
  },
  snk: {
    name: { fr: "Attaque des Titans 🧱", en: "Attack on Titan 🧱" },
    pairs: [
      { wordA: "Eren Jäger", wordB: "Armin Arlert" },
      { wordA: "Mikasa Ackerman", wordB: "Historia Reiss" },
      { wordA: "Titan Assaillant", wordB: "Titan Colossal" },
      { wordA: "Bataillon d'exploration", wordB: "Brigades spéciales" },
      { wordA: "Les Murs (Sina/Rose/Maria)", wordB: "Le sous-sol de Grisha" },
      { wordA: "Livaï Ackerman", wordB: "Erwin Smith" },
      { wordA: "Reiner", wordB: "Bertholdt" }
    ]
  },
  interrubriques: {
    name: { fr: "Cross-Over 🔀", en: "Cross-Over 🔀" },
    pairs: [
      { wordA: "Tortue Géniale", wordB: "Jiraya" },
      { wordA: "Walter White", wordB: "Saul Goodman" },
      { wordA: "Goku", wordB: "Luffy" },
      { wordA: "Batman", wordB: "Iron Man" },
      { wordA: "Sherlock Holmes", wordB: "Détective Conan" },
      { wordA: "Dumbledore", wordB: "Gandalf" }
    ]
  }
};

/**
 * Récupère une paire de mots aléatoire parmi les thèmes activés.
 * @param {Array<string>} activeThemes - Liste des clés de thèmes activés (ex: ["classique", "naruto"])
 * @returns {{wordA: string, wordB: string}}
 */
export function getRandomPairFromThemes(activeThemes) {
  // S'assurer qu'il y a des thèmes actifs, sinon utiliser classique par défaut
  const themesToUse = activeThemes && activeThemes.length > 0 ? activeThemes : ["classique"];
  
  // Compiler toutes les paires des thèmes actifs
  let allPairs = [];
  themesToUse.forEach((themeKey) => {
    if (themesData[themeKey]) {
      allPairs = allPairs.concat(themesData[themeKey].pairs);
    }
  });

  // Sécurité si aucune paire n'a été chargée
  if (allPairs.length === 0) {
    allPairs = themesData.classique.pairs;
  }

  // Tirer au sort une paire
  const randomIndex = Math.floor(Math.random() * allPairs.length);
  const pair = allPairs[randomIndex];
  
  // Échanger aléatoirement mot A et mot B pour éviter que le même mot soit toujours le normal ou l'imposteur
  if (Math.random() > 0.5) {
    return { wordA: pair.wordB, wordB: pair.wordA };
  }
  return { ...pair };
}
