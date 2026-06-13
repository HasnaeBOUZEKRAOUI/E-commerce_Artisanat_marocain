# Moroccan Designers — Plateforme E-commerce Artisanat Marocain

Plateforme e-commerce fullstack dédiée à la vente de produits artisanaux marocains, développée dans le cadre d'un projet de fin de formation. L'application connecte les artisans marocains avec des acheteurs locaux et internationaux.

---

## Apercu du projet

Moroccan Designers est une application web moderne qui permet aux artisans marocains de vendre leurs créations en ligne. Les produits sont organisés en catégories hiérarchiques (3 niveaux) inspirées de la structure de MyTindy.ma, avec import automatique des produits via l'API publique Shopify.

---

## Stack technique

**Backend**
- Laravel 12 (PHP 8.2+)
- MySQL 8
- Laravel Sanctum (authentification par token)
- API REST JSON

**Frontend**
- React 18 (Vite)
- React Router DOM v6
- Axios
- Tailwind CSS

---

## Fonctionnalites

**Catalogue**
- Plus de 2000 produits artisanaux importés depuis MyTindy.com
- Catégories hiérarchiques sur 3 niveaux (Home & Living, Fashion, Jewelry, Beauty & Hammam, Moroccan Pantry)
- Filtres par catégorie, prix, tri
- Pagination
- Recherche de produits

**Utilisateurs**
- Inscription et connexion (Client / Artisan / Admin)
- Authentification sécurisée via Laravel Sanctum
- Profil utilisateur
- Historique des commandes

**Panier et commandes**
- Panier persistant en session
- Passage de commande
- Gestion des commandes côté artisan

**Artisans**
- Tableau de bord artisan
- Gestion des produits (ajout, modification, suppression)
- Suivi des ventes

**Import de produits**
- Commande Artisan personnalisée pour importer les produits depuis l'API Shopify de MyTindy.com
- Conversion automatique EUR vers MAD
- Import par collection avec gestion des doublons

---

## Structure du projet

```
projet/
├── back_end/                  # Laravel 12
│   ├── app/
│   │   ├── Console/Commands/
│   │   │   └── Import.php         # Commande import MyTindy
│   │   ├── Http/Controllers/Api/
│   │   │   ├── AuthController.php
│   │   │   ├── ProduitController.php
│   │   │   ├── CategorieController.php
│   │   │   ├── CommandeController.php
│   │   │   └── ArtisanController.php
│   │   └── Models/
│   │       ├── Utilisateur.php
│   │       ├── Client.php
│   │       ├── Artisan.php
│   │       ├── Produit.php
│   │       ├── Categorie.php
│   │       ├── Image.php
│   │       ├── Commande.php
│   │       ├── LigneCommande.php
│   │       ├── Panier.php
│   │       ├── Paiement.php
│   │       ├── Avis.php
│   │       └── Notification.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   │       └── CategoriesSeeder.php
│   └── routes/
│       ├── api.php
│       └── web.php
│
└── front_end/                 # React + Vite
    └── src/
        ├── api/
        │   ├── axios.js           # Instance Axios centralisée
        │   └── services.js        # Tous les appels API
        ├── context/
        │   ├── AuthContext.jsx
        │   └── CartContext.jsx
        ├── hooks/
        │   ├── useProducts.js
        │   └── useRecentlyViewed.js
        ├── pages/
        │   ├── Home.jsx
        │   ├── LoginPage.jsx
        │   ├── CategoryPage.jsx
        │   └── CartPage.jsx
        └── components/
            ├── layout/
            │   └── NavBar.jsx     # Mega menu 3 niveaux
            └── home/
                ├── ProductsSection.jsx
                ├── CategoriesSection.jsx
                └── ArtisansSection.jsx
```

---

## Installation

### Prerequis

- PHP 8.2 ou supérieur
- Composer
- Node.js 18 ou supérieur
- MySQL 8
- Git

---

### Backend Laravel

```bash
# Cloner le projet
git clone https://github.com/votre-username/moroccan-designers.git
cd moroccan-designers/back_end

# Installer les dépendances
composer install

# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate

# Configurer la base de données dans .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=artisanat_marocain
DB_USERNAME=root
DB_PASSWORD=

# URL du frontend pour CORS
FRONTEND_URL=http://localhost:5173
SANCTUM_STATEFUL_DOMAINS=localhost:5173

# Exécuter les migrations
php artisan migrate

# Insérer les catégories (3 niveaux)
php artisan db:seed --class=CategoriesSeeder

# Installer Sanctum
php artisan install:api

# Démarrer le serveur
php artisan serve
```

---

### Frontend React

```bash
cd ../front_end

# Installer les dépendances
npm install

# Créer le fichier .env
echo "VITE_API_URL=http://localhost:8000/api" > .env

# Démarrer le serveur de développement
npm run dev
```

L'application est accessible sur `http://localhost:5173`

---

### Import des produits MyTindy

```bash
# Tester sans insertion (dry run)
php artisan my:import --collection=moroccan-rugs --pages=1 --dry-run

# Importer une collection
php artisan my:import --collection=moroccan-rugs --pages=3

# Importer toutes les collections
php artisan my:import --collection=candles --pages=2
php artisan my:import --collection=womens-jewelry --pages=3
php artisan my:import --collection=body-care --pages=2
php artisan my:import --collection=tagines --pages=1
php artisan my:import --collection=honey --pages=1
php artisan my:import --collection=culinary-oils --pages=1
```

Les collections disponibles : `moroccan-rugs`, `candles`, `pillowcases`, `pottery-pots`, `lamps-lampshades`, `womens-jewelry`, `mens-jewelry`, `womens-bags`, `moroccan-leather-pouf`, `moroccan-handmade-blankets`, `body-care`, `hair-care`, `home-fragrance`, `mirrors`, `tagines`, `honey`, `culinary-oils`

---

## Base de données

### Schema principal

| Table | Description |
|---|---|
| utilisateurs | Comptes (client, artisan, admin) |
| clients | Extension du compte client |
| artisans | Extension du compte artisan avec boutique |
| categories | Catégories sur 3 niveaux (parent_id, niveau) |
| produits | Catalogue produits |
| images | Images des produits |
| caracteristiques | Attributs des produits |
| promotions | Réductions par produit |
| paniers | Panier actif par client |
| ligne_paniers | Lignes du panier |
| commandes | Commandes passées |
| ligne_commandes | Détail des commandes |
| paiements | Paiements associés aux commandes |
| avis | Avis et notes des clients |
| notifications | Notifications utilisateurs |

### Structure des catégories

```
Niveau 1 : HOME & LIVING
  Niveau 2 : DINING
    Niveau 3 : Tagines          (contient les produits)
    Niveau 3 : Cups & Mugs
    Niveau 3 : Plates & Bowls
  Niveau 2 : LIVING ROOM & BEDROOM
    Niveau 3 : Rugs
    Niveau 3 : Cushions
```

---

## API — Endpoints principaux

### Authentification

| Méthode | Endpoint | Description |
|---|---|---|
| POST | /api/register | Inscription |
| POST | /api/login | Connexion (retourne token) |
| POST | /api/logout | Déconnexion (token requis) |
| GET | /api/me | Utilisateur connecté (token requis) |

### Produits

| Méthode | Endpoint | Description |
|---|---|---|
| GET | /api/produits | Liste paginée avec filtres |
| GET | /api/produits/{id} | Détail d'un produit |
| POST | /api/produits/recently-viewed | Produits récemment consultés |

Paramètres disponibles pour `/api/produits` :
- `category` : slug de catégorie
- `sort` : `newest`, `price_asc`, `price_desc`
- `min_price` / `max_price` : filtre de prix
- `per_page` : nombre de résultats (max 100)
- `page` : numéro de page

### Catégories

| Méthode | Endpoint | Description |
|---|---|---|
| GET | /api/categories/menu | Arbre complet 3 niveaux pour la navbar |
| GET | /api/categories | Catégories niveau 1 |
| GET | /api/categories/{slug}/subcategories | Sous-catégories |

### Commandes (token requis)

| Méthode | Endpoint | Description |
|---|---|---|
| GET | /api/commandes | Historique commandes |
| POST | /api/commandes | Passer une commande |

---

## Variables d'environnement

### Backend (.env)

```env
APP_NAME="Moroccan Designers"
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
SANCTUM_STATEFUL_DOMAINS=localhost:5173

DB_CONNECTION=mysql
DB_DATABASE=artisanat_marocain
DB_USERNAME=root
DB_PASSWORD=
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000/api
```

---

## Roles utilisateurs

| Role | Permissions |
|---|---|
| client | Naviguer, acheter, laisser des avis |
| artisan | Gérer ses produits, consulter ses ventes |
| admin | Gérer tous les utilisateurs, produits, commandes |

---

## Auteur

Projet de fin de formation — Développement Web Fullstack

---

## Licence

Ce projet est développé à des fins académiques.
