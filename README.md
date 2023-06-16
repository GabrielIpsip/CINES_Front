# esgbu-webapp

Implémentation de l'application cliente d'accès à l'enquête des bibliothèques universitaires.

### Installation

Prérequis : npm

#### 1. Télécharger Angular CLI

`npm install -g @angular/cli`

#### 2. Installer les paquets node_modules

Depuis la racine du projet, exécuter : `npm install`

#### 3. Lancer le serveur de développement

Lancer `ng serve` depuis la racine du projet. Sur le navigateur, se rendre à l'adresse `http://localhost:4200/`.  
Le projet sera compilé avec le fichier d'environnement de dev `src/environments/environment.ts`.

#### 4. Fichier environnement machine 

Pour chaque machine où l'on déploie le projet, il faudra modifier les variables d'environnement machine. Elles se trouvent dans le fichier `src/assets/environment.json`.
```
// Contenu exemple du fichier : environment.json
{
  "apiUrl": "http://localhost:8000", # URL de l'API ESGBU
  "log": true, # Afficher les logs dans la console.
  "mercureUrl": "http://localhost:3000/.well-known/mercure", # Adresse du hub Mercure
  "platform": "local" # Nom de la plateforme, s'affichera à côté du logo de l'application (Optionnel)
}
```

#### 5. Créer un paquet pour le déploiement

**ATTENTION** : Le dossier du projet API **esgbu-api** doit être dans le même répertoire que le dossier **esgbu-webapp**.  
Lancer le script `build_package.sh` pour créer une archive zip :   `dist/esgbu-webapp/esgbu-webapp.zip`.  
Lors de la compilation, le fichier d'environnement de prod `src/environments/environment.prod.ts` sera utilisé. 
