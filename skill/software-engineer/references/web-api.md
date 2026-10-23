# Guide plateforme — Web & API

> **Quand lire ce guide** : la plateforme cadrée est une **application web navigateur** ou une **API backend**. C'est l'un des deux guides d'architecture du skill (l'autre : `mobile.md`). Ne l'applique pas à un client mobile : pour un projet web + mobile, ce guide traite le volet web/API et `mobile.md` traite le volet client — deux propositions séparées, conformément aux règles de non-conflit de la section 5.2 du SKILL.md.

## 1. Principe directeur : le monolithe bien découpé d'abord

Pour une v1 web ou API, **l'architecture par défaut est un monolithe modulaire + une base de données relationnelle**. Les architectures distribuées (microservices, files d'événements, Kubernetes) ont des coûts opérationnels qui se paient dès le premier jour, alors que leurs bénéfices ne se manifestent qu'à grande échelle — une v1 n'y est presque jamais. Tu sépares seulement quand une contrainte **mesurée** l'exige (charge réelle, équipes séparées, exigence réglementaire), jamais par anticipation flatteuse. Découper proprement le monolithe en modules garde la porte ouverte à une séparation future sans coût immédiat.

## 2. Matrice par type d'application (web & API)

**A. Application web métier** (CRUD, back-office, dashboard interne)
| Palier | Option | Facilite | Coûte |
|---|---|---|---|
| 1 | Monolithe modulaire (Next.js, Django ou Laravel) + PostgreSQL + ORM | Une seule base de code, déploiement unique, écosystèmes matures, admin/auth souvent incluses | Choix du framework engage la stack pour longtemps |
| 2 | SPA (React/Vue) + API séparée (NestJS, FastAPI) + PostgreSQL | Réutilisation de l'API pour un futur mobile, équipes front/back séparées | Deux déploiements, contrat d'API à versionner, plus de code colle |
| 3 | Microservices + conteneurs + orchestration | Isolation des équipes, scalabilité par service | Coût opérationnel disproportionné pour une v1 ; à réserver aux charges massives déjà mesurées |

**B. API backend pure** (consommée par une app mobile ou un prestataire)
| Palier | Option | Facilite | Coûte |
|---|---|---|---|
| 1 | API REST modulaire en monolithe (FastAPI, NestJS, Express, Spring Boot) + PostgreSQL | Standard universel, documentation auto (OpenAPI), débogage simple, versionnement éprouvé | Modélisation des ressources à soigner dès le début |
| 2 | GraphQL + PostgreSQL | Clients hétérogènes qui façonnent leurs requêtes, moins de round-trips | Cache, sécurité par champ et N+1 plus complexes ; à réserver aux besoins réels de flexibilité |
| 3 | gRPC (ou event-driven avec broker) | Performance service-à-service, contrats binaires stricts | Inadapté aux clients web/mobiles grand public (support navigateur limité) ; sur-ingénierie en v1 |

**C. SaaS multi-tenant** (comptes, rôles, abonnements)
| Palier | Option | Facilite | Coûte |
|---|---|---|---|
| 1 | Monolithe + isolation par colonne `tenant_id` + règles d'accès systématiques (ex. Row-Level Security PostgreSQL) | Le plus simple qui fonctionne correctement ; une seule base à maintenir | Discipline d'isolation à chaque requête (tests dédiés indispensables) |
| 2 | Monolithe + un schéma PostgreSQL par tenant | Isolation plus nette, exports/restaurations par client | Migrations plus lourdes ; catalogues de tenants à gérer |
| 3 | Une base de données par tenant (+ infrastructure par instanciement si besoin) | Isolation maximale, arguments réglementaires forts | Coût d'exploitation et de migrations élevé ; ne se justifie que par une exigence réelle (santé, finance) |

**D. Application temps réel** (chat, collaboration, notifications live)
| Palier | Option | Facilite | Coûte |
|---|---|---|---|
| 1 | Monolithe + WebSocket (ex. Socket.IO) + Redis pub/sub dès la 2ᵉ instance | Standard bien documenté, tient plusieurs milliers de connexions, reconnexion gérée | Persistance des sessions à concevoir dès qu'on scale horizontalement |
| 2 | Server-Sent Events (SSE) | Beaucoup plus simple si le flux est surtout serveur → client (notifications, tableaux vivants) | Pas de flux client → serveur natif (on repasse par HTTP classique) |
| 3 | Service managé temps réel (Pusher, Ably, Firebase Realtime) | Zéro infrastructure temps réel à opérer, mise en route rapide | Coût croissant à l'échelle, dépendance fournisseur à documenter |

**E. Site de contenu / vitrine / e-commerce léger**
| Palier | Option | Facilite | Coûte |
|---|---|---|---|
| 1 | Génération statique ou hybride (Next.js SSG/ISR, Astro) + contenu en fichiers (Markdown) ou CMS headless (Payload, Directus) | Rapidité, SEO, hébergement économique, surface d'attaque minimale | Rebuild/déploiement à chaque changement de contenu (ou webhook CMS) |
| 2 | CMS complet éprouvé (WordPress moderne, Django CMS) | Édition de contenu par des non-développeurs, plugins nombreux | Maintenance (mises à jour, sécurité) régulière et obligatoire |
| 3 | Application dynamique complète (SSR + PostgreSQL + comptes) | Nécessaire si panier, comptes clients et personnalisation réels dès la v1 | Le coût de maintenance d'une app complète pour ce qui est parfois un besoin de vitrine |

## 3. Anti-patterns à nommer quand ils apparaissent

- **Sur-ingénierie de v1** : microservices, Kubernetes, cache distribué, files d'événements, multi-région — avant toute charge mesurée. Tu les écartes explicitement avec cette raison.
- **Choix par attrait** : « tel unicorne utilise X » n'est pas un argument ; « nos contraintes sont Y et X y répond à moindre coût de maintenance » en est un.
- **Stack que personne ne sait maintenir** : si l'utilisateur seul maintient et ne connaît pas la stack proposée, le poids du choix se déplace vers une stack qu'il peut apprendre en autonomie, quitte à perdre des points de performance.
- **Découplage prématuré** : front+back séparés « au cas où une app mobile viendrait » — si l'app mobile est sérieuse, elle est dans le cadrage ; sinon le monolithe suffit et une API pourra être extraite plus tard.

## 4. Angles morts spécifiques web & API (en complément de la checklist générale)

| # | Angle mort | Niveau |
|---|---|---|
| W1 | Nature du trafic & SEO (le produit vit-il du référencement ? rendu SSR/SSG à prévoir ?) | important |
| W2 | Navigateurs & écrans cibles (support minimum, responsive obligatoire ?) | important |
| W3 | Exposition publique (origines CORS, pages accessibles sans compte, exposition aux bots) | important |
| W4 | Emails transactionnels (inscriptions, réinitialisations — quel fournisseur, quel budget ?) | important |
| W5 | Environnements & déploiement (recette séparée ? CI/CD ? procédure de rollback ?) | secondaire |
| W6 | Exigences légales du web (cookies, mentions légales, RGPD côté navigateur) | secondaire |
| W7 | Fuseaux horaires & durée des créneaux (réservations, agendas, rappels : stockage UTC, affichage local, heure d'été, définition exacte d'un créneau) | important dès qu'un horodatage est au cœur du métier |

## 5. Adaptation des jalons au web & API

- **J0 — Socle** : squelette qui démarre + page/endpoint de santé + pipeline minimal + sauvegarde initiale. Le critère est une commande et une URL qui répondent.
- **J1 — Capabilité cœur** : de bout en bout via le navigateur ou l'API (requête réelle → validation → persistance → réponse observable).
- **JD — Durcissement** : revue sécurité web (injections, XSS, CSRF, sessions, dépendances), gestion d'erreurs et logs, sauvegardes restaurées au moins une fois, déploiement final + monitoring simple (erreurs, disponibilité).
