# Structure de Projet - Frostapp Backoffice

Documentation de la structure des dossiers du projet **frostapp-v2-backoffice**. À utiliser comme référence pour maintenir la cohérence entre tous les projets.

## Vue d'ensemble

```
src/
├── App.css              # Styles principaux de l'application
├── App.tsx              # Composant racine
├── index.css            # Styles globaux
├── main.tsx             # Point d'entrée de l'application
├── assets/              # Images, fonts, fichiers statiques
├── core/                # Logique métier et état global
├── doc/                 # Documentation du projet
├── infra/               # Infrastructure (HTTP, routes)
└── ui/                  # Interface utilisateur (composants, pages)
```

---

## Structure détaillée

### 📂 `src/` - Répertoire source

Point d'entrée du projet TypeScript/React.

**Fichiers racine:**

- `main.tsx` - Point d'entrée de l'application
- `App.tsx` - Composant principal
- `App.css` - Styles du composant App
- `index.css` - Styles globaux de l'application

---

### 📂 `src/assets/` - Ressources statiques

Tous les assets (images, fonts, vidéos, etc.) utilisés dans l'application.

```
assets/
├── images/
├── fonts/
├── icons/
└── videos/
```

---

### 📂 `src/core/` - Cœur métier

Contient la logique métier, l'état global et les constantes.

```
core/
├── api/                     # API clients et calls
│   ├── auth.api.ts         # Endpoints d'authentification
│   └── index.ts            # Export centralisé
│
├── constants/              # Constantes applicatives
│   ├── user.constant.ts    # Constantes utilisateur
│   ├── errors.constant.ts  # Messages d'erreur
│   └── index.ts            # Export centralisé
│
├── context/                # React Context API
│   ├── AuthContext.tsx     # Contexte d'authentification
│   ├── ThemeContext.tsx    # Contexte du thème
│   └── index.ts            # Export centralisé
│
├── interfaces/             # Types TypeScript
│   ├── auth.interface.ts
│   ├── user.interface.ts
│   ├── chapter.interface.ts
│   ├── lesson.interface.ts
│   ├── subchapter.interface.ts
│   └── index.ts            # Export centralisé
│
├── redux/                  # Redux Toolkit
│   ├── store.ts            # Configuration du store
│   ├── slices/             # Slices Redux
│   │   ├── authSlice.ts
│   │   └── userSlice.ts
│   └── index.ts            # Export centralisé
│
└── services/               # Services métier
    ├── auth.service.ts     # Service d'authentification
    ├── api.ts              # Interceptors, configuration globale
    ├── file.ts             # Gestion des fichiers
    ├── mockCourses.ts      # Données mockées
    └── index.ts            # Export centralisé
```

**Responsabilités de chaque sous-dossier:**

| Dossier       | Responsabilité                  |
| ------------- | ------------------------------- |
| `api/`        | Appels API, endpoints           |
| `constants/`  | Énumérations, constantes métier |
| `context/`    | État global via React Context   |
| `interfaces/` | Types/Interfaces TypeScript     |
| `redux/`      | État global via Redux Toolkit   |
| `services/`   | Logique métier réutilisable     |

---

### 📂 `src/infra/` - Infrastructure

Couche infrastructure : HTTP, routage, configuration.

```
infra/
├── http/                   # Configuration HTTP
│   ├── baseApi.ts         # Instance Axios/Fetch configurée
│   ├── interceptors.ts    # Interceptors HTTP
│   └── index.ts           # Export centralisé
│
└── routes/                # Définition des routes
    ├── index.tsx          # Routes principales
    ├── ProtectedRoute.tsx  # Route protégée (authentification)
    ├── adminRoutes.tsx    # Routes admin
    └── index.ts           # Export centralisé
```

---

### 📂 `src/ui/` - Interface utilisateur

Tous les composants React et les pages.

```
ui/
├── components/            # Composants réutilisables
│   ├── ThemeToggle.tsx
│   ├── AdminLayout/
│   │   ├── AdminLayout.tsx
│   │   ├── AdminLayout.css
│   │   └── index.ts
│   ├── UserOptions/
│   │   ├── UserOptions.tsx
│   │   └── index.ts
│   └── CommonComponents/  # Boutons, inputs, modals, etc.
│       ├── Button.tsx
│       ├── Modal.tsx
│       └── index.ts
│
└── pages/                 # Pages (correspondent aux routes)
    ├── Login.tsx
    ├── Register.tsx
    ├── Dashboard.tsx
    ├── Courses.tsx
    ├── CourseDetail.tsx
    ├── AddCourse.tsx
    ├── Community.tsx
    ├── Users.tsx
    └── NotFound.tsx
```

**Conventions:**

- Un composant = Un dossier (si réutilisable multiple fois)
- Un composant simple = Un fichier `.tsx`
- Styles colocalisés (`.css` avec le `.tsx`)

---

### 📂 `src/doc/` - Documentation

Documentation technique du projet.

```
doc/
├── rtk-query.md           # Documentation RTK Query
├── architecture.md        # Architecture globale
├── api-integration.md     # Intégration API
└── setup.md              # Guide de configuration
```

---

## Fichiers de configuration racine

```
/
├── package.json           # Dépendances npm
├── tsconfig.json          # Configuration TypeScript (base)
├── tsconfig.app.json      # Configuration TypeScript (app)
├── tsconfig.node.json     # Configuration TypeScript (build tools)
├── vite.config.ts         # Configuration Vite
├── eslint.config.js       # Configuration ESLint
├── index.html             # Point d'entrée HTML
├── README.md              # Documentation générale
└── public/                # Assets publics (non importés)
```

---

## Conventions d'organisation

### 1. **Export centralisé**

Chaque dossier `core/` doit avoir un `index.ts` pour exporter tous les éléments.

```typescript
// core/interfaces/index.ts
export * from "./auth.interface";
export * from "./user.interface";
```

### 2. **Nommage des fichiers**

- **Services, interfaces, types** : `kebab-case.ts`
  - `auth.service.ts`
  - `user.interface.ts`

- **Composants React** : `PascalCase.tsx`
  - `LoginForm.tsx`
  - `UserProfile.tsx`

- **Styles** : `PascalCase.css` (même nom que le composant)
  - `LoginForm.css`

### 3. **Structure des composants réutilisables**

```
ui/components/MyComponent/
├── MyComponent.tsx        # Logique du composant
├── MyComponent.css        # Styles du composant
└── index.ts              # Export
```

### 4. **Structure des pages**

```
ui/pages/
├── LoginPage.tsx          # Une page = Un fichier
├── DashboardPage.tsx
└── index.ts              # Export centralisé
```

### 5. **État global**

- **Peu de composants** → `React Context` (dans `core/context/`)
- **Beaucoup de composants** → `Redux Toolkit` (dans `core/redux/`)

### 6. **Appels API**

- Centraliser dans `core/api/`
- Un fichier par domaine : `auth.api.ts`, `courses.api.ts`, etc.
- Importer depuis `core/services/` si besoin de logique supplémentaire

---

## Bonnes pratiques

✅ **À faire:**

- Garder les composants petits et focalisés
- Réutiliser les composants du dossier `components/`
- Centraliser la logique métier dans `services/`
- Utiliser les interfaces de `core/interfaces/`
- Colokaliser les styles avec les composants

❌ **À éviter:**

- Importer directement depuis des fichiers non-exportés (utiliser les `index.ts`)
- Créer des fichiers à la racine de `src/`
- Mélanger logique métier et UI dans les pages
- Styles globaux à la racine (utiliser un dossier `styles/`)

---

## Exemple d'import

```typescript
// ✅ Bon
import { getCurrentUser } from "@/core/services";
import { AuthContext } from "@/core/context";
import { LoginForm } from "@/ui/components";

// ❌ Mauvais
import { getCurrentUser } from "@/core/services/auth.service.ts";
import AuthContext from "@/core/context/AuthContext";
import LoginForm from "@/ui/components/LoginForm/LoginForm.tsx";
```

---

## Checklist pour un nouveau projet

```
[ ] Créer la structure `core/` avec tous les sous-dossiers
[ ] Créer la structure `infra/` (http, routes)
[ ] Créer la structure `ui/` (components, pages)
[ ] Ajouter `doc/` pour la documentation
[ ] Configurer les `index.ts` d'export centralisé
[ ] Ajouter les types TypeScript dans `core/interfaces/`
[ ] Configurer l'état global (Context ou Redux)
[ ] Mettre en place la configuration HTTP dans `infra/http/`
[ ] Définir les routes dans `infra/routes/`
[ ] Créer les premiers layouts dans `ui/components/`
```

---

## Notes supplémentaires

- Cette structure est pensée pour **scalabilité** : elle grandit avec le projet.
- Pour les **petits projets**, vous pouvez simplifier (`core/` directement dans `src/`).
- Pour les **grandes applications**, considérez des sous-dossiers supplémentaires dans `core/` (hooks, utils, validators).
- Adaptez selon vos besoins et conventions d'équipe.
