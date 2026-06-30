# Thoiras-Corbès — Espace d'administration

Ce guide explique comment mettre le site en ligne sur **Cloudflare Pages** et
permettre à la mairie de **publier ses actualités elle-même**, sans toucher au
code et sans solliciter le prestataire.

---

## 1. Comment ça marche (en clair)

- Les actualités et le bandeau d'alerte sont stockés dans deux fichiers :
  - `assets/data/news.json` — les actualités
  - `assets/data/site.json` — le bandeau d'alerte
- Le site les affiche automatiquement. Si un fichier est absent ou cassé, le
  site continue d'afficher le contenu de secours présent dans la page : **jamais
  de page blanche**.
- La mairie ne modifie **jamais** ces fichiers à la main : elle passe par
  l'espace d'administration (`/admin`), un formulaire simple. À chaque
  enregistrement, le site se met à jour tout seul en 1 à 2 minutes.

---

## 2. Mise en ligne (à faire une seule fois, par le prestataire)

### a. Mettre le site sur GitHub
1. Créer un compte GitHub (gratuit) pour la mairie, ex. `mairie-thoirascorbes`.
2. Créer un dépôt (ex. `thoirascorbes`) et y déposer **tout le dossier** du site.

### b. Déployer sur Cloudflare Pages
1. Compte Cloudflare → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git**.
2. Choisir le dépôt GitHub.
3. Réglages de build : **aucun** (site statique).
   - Build command : *(vide)*
   - Output directory : `/`
4. Déployer. Le site est en ligne sur une adresse `*.pages.dev` (on pourra
   ensuite brancher le vrai nom de domaine, ex. `thoirascorbes.fr`).

### c. Activer l'authentification de l'admin
L'espace `/admin` se connecte à GitHub pour enregistrer les modifications. Il
faut un petit service d'authentification (gratuit, à déployer une fois) :

1. Déployer **`sveltia-cms-auth`** sur Cloudflare Workers
   (procédure : <https://github.com/sveltia/sveltia-cms-auth>).
2. Créer une **GitHub OAuth App**
   (Settings → Developer settings → OAuth Apps → New) :
   - *Authorization callback URL* = l'adresse du worker + `/callback`
   - Reporter le **Client ID** et **Client Secret** dans le worker.
3. Renseigner les deux valeurs **TODO** dans `admin/config.yml` :
   ```yaml
   repo: VOTRE-COMPTE-GITHUB/thoirascorbes
   base_url: https://VOTRE-AUTH.workers.dev
   ```

> Astuce test : on peut tester l'admin en local sans rien déployer grâce au
> mode « local backend » de Sveltia CMS (voir sa documentation).

---

## 3. Mode d'emploi pour la mairie

1. Aller sur **`https://…/admin`** (l'adresse vous sera communiquée).
2. Cliquer sur **Se connecter avec GitHub**.
3. **Pour ajouter une actualité** :
   - Menu **Actualités** → **Liste des actualités**.
   - Bouton **+** pour ajouter, remplir Titre / Catégorie / Date / Texte.
   - Cocher *« Mettre en avant comme alerte »* pour une info urgente.
   - **Enregistrer (Publish)**. Le site se met à jour seul.
4. **Pour le bandeau d'alerte** (le bandeau orange en haut) :
   - Menu **Paramètres du site** → **Bandeau d'alerte**.
   - Décocher *« Afficher le bandeau »* pour le masquer, ou modifier le message.
   - **Enregistrer**.

C'est tout : aucune compétence technique nécessaire, et chaque modification est
sauvegardée et réversible.

---

## 4. Reste à finaliser avant la vente (hors admin)

- Brancher les liens « Démarches » vers les bons services (service-public.fr,
  cadastre, urbanisme…), aujourd'hui pointés vers `#contact`.
- Rédiger les pages légales obligatoires : **Mentions légales**, **Données
  personnelles (RGPD)**, **Accessibilité (RGAA)**, **Cookies**.
- Mettre à jour le pied de page « Accessibilité : non conforme » après audit.
