# Mon API de Gestion de Tâches

Une API qui permet à chaque utilisateur de l'application de gérer ses tâches de manière simple et efficace.

## Fonctionnalités

- **Création de compte utilisateur:** Chaque utilisateur peut créer un compte unique.
- **Authentification via JWT:** Après s'être inscrit ou connecté, l'utilisateur reçoit un JWT qui lui permet d'accéder à sa liste de tâches.
- **Gestion des tâches:** Chaque utilisateur peut :
    - Voir ses tâches dans l’ordre chronologique, avec leur date de création et de mise à jour.
    - Ajouter une nouvelle tâche.
    - Supprimer n'importe quelle tâche.
    - Modifier une tâche.
    - Filtrer ses tâches par statut (terminée ou non).
- **Support Unicode:** Les tâches peuvent être en texte brut (non HTML) et peuvent contenir n'importe quel caractère Unicode, y compris les accents et les emojis.

## Routes Principales

- `/signup/`: POST - Pour créer un compte utilisateur.
- `/signup/confirm`: GET - Pour confirmer la création du compte.
- `/signin`: POST - Pour se connecter.

### Routes liées aux tâches

- `/task/:create`: POST - Pour ajouter une nouvelle tâche.
- `/task/:update/:id`: PUT - Pour modifier une tâche existante.
- `/task/:delete/:id`: DELETE - Pour supprimer une tâche.

## Comment démarrer ?

1. Clonez le répertoire sur votre machine locale.
2. Naviguez vers le répertoire du projet via la ligne de commande/terminal.
3. Exécutez `npm install` pour installer toutes les dépendances nécessaires.
4. Une fois l'installation terminée, exécutez `npm start` pour démarrer le serveur.
5. Naviguez vers `http://localhost:YOUR_PORT_NUMBER` dans votre navigateur pour accéder à l'API.

---

