# NusurNet

> Plateforme d'orientation pour immigrés et étudiants en Italie.
> Information transparente, gratuite, vérifiée.

**Statut :** Sprint 0 — Setup initial du projet.

---

## 🎯 Ce que contient ce sprint

À ce stade, le projet est un squelette opérationnel mais quasi-vide :

- ✅ Next.js 14 (App Router) + TypeScript en mode `strict`
- ✅ Tailwind CSS configuré
- ✅ Prisma + PostgreSQL avec un modèle `HealthCheck` minimal pour valider la chaîne
- ✅ Internationalisation (`next-intl`) — Italien et Français
- ✅ Validation des variables d'environnement avec Zod
- ✅ Logger structuré (JSON)
- ✅ Headers de sécurité de base (HSTS, X-Frame-Options, etc.)
- ✅ Docker Compose pour Postgres + Redis en local
- ✅ ESLint + Prettier + lint-staged + Husky
- ✅ Workflow CI GitHub Actions (lint, typecheck, build)
- ✅ Endpoint `/api/health` pour le monitoring
- ✅ Page d'accueil multilingue avec bascule de langue

**Hors périmètre Sprint 0 :** authentification, contenus réels, paiements, comparateur, cartographie. Tout cela vient dans les sprints suivants.

---

## 🛠 Pré-requis

Tu dois avoir installé sur ton poste :

| Outil | Version min. | Vérifier avec |
|-------|--------------|---------------|
| Node.js | 20.x | `node --version` |
| npm | 10.x | `npm --version` |
| Docker | récent | `docker --version` |
| Docker Compose | v2 | `docker compose version` |
| Git | 2.x | `git --version` |

> **Pas Docker ?** Tu peux installer PostgreSQL 16 directement sur ton OS, mais Docker est très fortement recommandé pour éviter les galères de setup et garantir que le dev local correspond à la prod.

---

## 🚀 Démarrage rapide (5 minutes)

```bash
# 1. Installer les dépendances
npm install

# 2. Copier la config d'environnement
cp .env.example .env.local

# 3. Lancer la base de données en local (Postgres + Redis dans Docker)
npm run docker:up

# 4. Générer le client Prisma + créer les tables
npm run db:generate
npm run db:push

# 5. Insérer les données de test
npm run db:seed

# 6. Lancer le serveur de dev
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000) — tu devrais être redirigé vers `/it` et voir la page d'accueil avec un badge vert "Connexion à la base de données OK".

---

## 📂 Structure du projet

```
nusurnet/
├── docker/                          # Config Docker (BDD locale)
│   ├── docker-compose.yml
│   └── postgres-init/
│       └── 01-extensions.sql        # Extensions Postgres (pg_trgm, unaccent...)
│
├── prisma/
│   ├── schema.prisma                # Schéma BDD (sera étendu Sprint 1)
│   └── seed.ts                      # Script de seed
│
├── src/
│   ├── app/                         # App Router Next.js
│   │   ├── [locale]/                # Routes localisées (/it, /fr)
│   │   │   ├── layout.tsx           # Layout principal avec providers i18n
│   │   │   └── page.tsx             # Page d'accueil
│   │   ├── api/
│   │   │   └── health/route.ts      # GET /api/health
│   │   ├── globals.css              # Tailwind + styles globaux
│   │   └── layout.tsx               # Layout root (placeholder)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   └── locale-switcher.tsx  # Sélecteur de langue
│   │   ├── ui/                      # (sera rempli Sprint 1+)
│   │   └── health-check-badge.tsx
│   │
│   ├── lib/
│   │   ├── env.ts                   # Validation des variables d'env
│   │   ├── prisma.ts                # Client Prisma singleton
│   │   ├── logger.ts                # Logger structuré
│   │   ├── utils.ts                 # cn() pour Tailwind
│   │   └── i18n/
│   │       ├── config.ts            # Locales supportées
│   │       ├── routing.ts           # Routing next-intl
│   │       └── request.ts           # Chargement des messages
│   │
│   ├── messages/
│   │   ├── it.json                  # Traductions italiennes
│   │   └── fr.json                  # Traductions françaises
│   │
│   ├── server/                      # (sera rempli Sprint 1+)
│   ├── types/
│   │   └── global.d.ts              # Type-safe i18n
│   └── middleware.ts                # Middleware Next.js (i18n routing)
│
├── .github/workflows/ci.yml         # CI GitHub Actions
├── .env.example                     # Template variables d'env
├── .eslintrc.json                   # Config ESLint
├── .prettierrc.json                 # Config Prettier
├── next.config.mjs                  # Config Next.js (avec headers sécu)
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 📋 Scripts disponibles

### Dev
| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement (port 3000) |
| `npm run build` | Build de production |
| `npm run start` | Lance le build de production |

### Qualité
| Commande | Description |
|----------|-------------|
| `npm run lint` | Lance ESLint |
| `npm run lint:fix` | Lance ESLint et corrige automatiquement |
| `npm run format` | Formate tout avec Prettier |
| `npm run format:check` | Vérifie le formatage sans modifier |
| `npm run typecheck` | Vérifie les types TypeScript |

### Base de données
| Commande | Description |
|----------|-------------|
| `npm run db:generate` | Génère le client Prisma TypeScript |
| `npm run db:push` | Applique le schéma sans créer de migration (dev rapide) |
| `npm run db:migrate` | Crée une migration formelle |
| `npm run db:seed` | Insère les données de test |
| `npm run db:studio` | Ouvre Prisma Studio (UI BDD sur port 5555) |
| `npm run db:reset` | ⚠️ Détruit et recrée la BDD |

### Docker
| Commande | Description |
|----------|-------------|
| `npm run docker:up` | Démarre Postgres + Redis |
| `npm run docker:down` | Arrête les containers |
| `npm run docker:logs` | Tail les logs |

---

## 🌍 Internationalisation

L'app est multilingue dès le départ. Les locales sont définies dans `src/lib/i18n/config.ts`.

**Sprint 0 :** Italien (par défaut) et Français.
**Sprint 1.1 :** Ajout de l'Arabe (RTL) et Anglais.

Pour ajouter une traduction :

1. Ajoute la clé dans `src/messages/it.json` ET `src/messages/fr.json` (les deux obligatoires).
2. Utilise dans un composant :
   ```tsx
   import { useTranslations } from 'next-intl';
   const t = useTranslations('home');
   return <h1>{t('title')}</h1>;
   ```

> ⚠️ **Règle :** ne jamais avoir de chaîne UI en dur dans le code. Toujours via `useTranslations`.

---

## 🔐 Sécurité

Déjà en place dès le Sprint 0 :

- **Validation des variables d'environnement** (`src/lib/env.ts`) — l'app refuse de démarrer si une variable critique est manquante ou malformée.
- **Headers HTTP sécurisés** (`next.config.mjs`) — HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- **`.gitignore` strict** sur tous les fichiers `.env*` — les secrets ne doivent JAMAIS être commités.
- **Headers `poweredByHeader: false`** — on ne révèle pas qu'on tourne sur Next.js.

À venir :
- Sprint 2 : authentification, hash mots de passe (Argon2), CSRF, rate-limiting login.
- Sprint 7 : PCI-DSS via Stripe (jamais de CB stockée chez nous).
- Sprint 8 : Content Security Policy, audits OWASP, Dependabot.

---

## 🏗 Décisions d'architecture

### Pourquoi App Router et pas Pages Router ?
L'App Router de Next.js 14 est désormais le défaut recommandé. Streaming, Server Components, layouts imbriqués — tout ce qu'il nous faut pour une plateforme avec beaucoup de contenu SEO-sensible.

### Pourquoi Prisma et pas Drizzle ?
Prisma est plus mature, mieux documenté, et son tooling (Studio, migrations) fait gagner du temps. Drizzle reste une option pour plus tard si on cherche plus de performance.

### Pourquoi `next-intl` et pas `next-i18next` ?
`next-intl` est conçu nativement pour l'App Router. `next-i18next` reste excellent pour le Pages Router mais on ne l'utilise pas.

### Pourquoi le préfixe de locale toujours visible ?
URL `/it/...` plutôt que `/...` pour la locale par défaut → meilleur SEO multilingue, hreflang clair, pas d'ambiguïté pour les crawlers.

---

## 🧪 Vérifier que tout marche (checklist post-installation)

Après avoir lancé `npm run dev`, vérifie :

- [ ] `http://localhost:3000` → redirige vers `http://localhost:3000/it`
- [ ] La page affiche "La piattaforma per gli immigrati e gli studenti in Italia"
- [ ] Le sélecteur en haut à droite permet de basculer en Français → URL devient `/fr`
- [ ] Le badge "Stato del sistema" est vert (DB OK)
- [ ] `http://localhost:3000/api/health` → renvoie `{ "status": "ok", ... }`
- [ ] `npm run typecheck` → 0 erreur
- [ ] `npm run lint` → 0 erreur
- [ ] `npm run build` → build réussit

Si tout est ✅, le Sprint 0 est validé et on peut attaquer le **Sprint 1 — Modélisation BDD complète**.

---

## ❓ Problèmes fréquents

### "Cannot connect to database"
1. Vérifie que Docker tourne : `docker ps` doit montrer `nusurnet_postgres`.
2. Si non : `npm run docker:up`.
3. Si oui mais ça plante toujours : `docker logs nusurnet_postgres` pour voir l'erreur.

### "PrismaClient is not configured"
Tu as oublié `npm run db:generate` après avoir cloné. C'est la commande qui génère le client TypeScript à partir du schéma.

### "Module not found: Can't resolve '@/...'"
Vérifie que `tsconfig.json` est bien à la racine et que tu as relancé le serveur de dev après modification.

### Le port 3000 est déjà pris
```bash
PORT=3001 npm run dev
```

### Le port 5432 est déjà pris (Postgres existant sur ta machine)
Modifie `docker/docker-compose.yml` pour mapper sur un autre port (ex `5433:5432`) puis ajuste `DATABASE_URL` dans `.env.local`.

---

## 📜 Licence et propriété

À définir avant lancement public. Code privé pour l'instant.

---

## 👤 Contact

Porteur de projet : *[à compléter]*

---

**Prochaine étape →** Sprint 1 : modélisation complète de la base (User, University, Course, Scholarship, Service, ResourcePoint, Order…).
