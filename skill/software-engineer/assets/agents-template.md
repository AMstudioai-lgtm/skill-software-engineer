# agents.md — Contrat de travail pour tout agent (ou humain) intervenant sur ce projet

> **À lire AVANT toute modification de code**, avec `context.md` (ce que le projet est) et le plan de développement (où on en est).
> Ce fichier définit COMMENT on travaille ici. Il fait foi en cas de doute.
> Devise : « La précision est la clé et la stabilité le but »

## 1. Posture attendue

- **Précis avant rapide** : toute ambiguïté se résout par une question ou une hypothèse consignée dans `context.md` §10 — jamais par un choix silencieux.
- **Stable avant astucieux** : solution simple, éprouvée, compréhensible par l'équipe. Pas d'abstraction « au cas où ».
- **Fidèle au périmètre** : implémenter uniquement ce que `context.md` §4.1/4.2 liste. Toute idée nouvelle va en §4.2 ou §10 de `context.md`, pas dans le code. Le hors-périmètre (§4.3) ne se touche pas.
- **Mémoire à jour ou rien** : si `context.md` est obsolète, contradictoire ou absent, le corriger d'abord — ne pas coder sur une base qui ment.

## 2. Méthode de développement imposée — jalons incrémentaux

1. Lire `context.md` (§8 avancées, §9 étapes à venir) pour identifier **le jalon en cours**.
2. Travailler **un seul jalon à la fois**, dans l'ordre du plan. Ne jamais en commencer plusieurs, ne jamais anticiper le code d'un jalon futur.
3. Un jalon est terminé **uniquement** si son critère de validation est prouvé (commande exécutée, démo faite, résultat observé).
4. Après validation : mettre à jour `context.md` (§8 et §9), puis seulement démarrer le jalon suivant.
5. Si un jalon révèle un défaut d'architecture ou de cadrage : le signaler, consigner la décision corrective (`context.md` §7), ajuster le plan — ne pas contourner.

## 3. Conventions de code

- **Langage & framework** : [à compléter à l'étape architecture]
- **Structure des dossiers** : [à compléter, ex. `src/modules/<domaine>/…`]
- **Nommage** : [variables/fonctions, fichiers, branches, commits — ex. commits conventionnels]
- **Style** : formatage automatique par [outil] ; pas de code mort commenté ; pas de TODO sans jalon ou entrée de backlog associée.
- **Dépendances** : chaque ajout doit être justifié et consigné dans `context.md` §7. Retirer ce qui n'est plus utilisé.

## 4. Règles de sécurité minimales

- Secrets (clés, mots de passe, connexions) jamais en dur : variables d'environnement, `.env` gitignoré, `.env.example` fourni à jour.
- Toute entrée utilisateur validée côté serveur ; toute sortie échappée (injections SQL/XSS).
- Mots de passe hachés (bcrypt/argon2), jamais en clair, jamais loggés.
- Sessions/tokens : expiration définie, révocation possible.
- Données personnelles : collecte minimale à la v1, suppression possible sur demande.
- Permissions vérifiées côté serveur pour chaque action sensible (ne jamais se fier au front seul).

## 5. Interdits

- Écrire du code si `context.md` est absent, obsolète ou contradictoire → réparer la mémoire d'abord.
- Ajouter une dépendance, changer la base de données ou l'architecture sans décision consignée (`context.md` §7).
- Toucher au hors-périmètre (`context.md` §4.3).
- Réécrire ou effacer l'historique (`context.md` §7 et §8 sont append-only).
- Pousser du code non validé par le critère du jalon en cours.
- Garder un secret en dur, même « temporairement ».

## 6. Validation d'un jalon

- **Commande de test** : [commande qui prouve le critère]
- **Résultat attendu** : [ce que l'utilisateur doit observer]
- **Après validation** : `context.md` §8 (avancée) et §9 (étapes à venir) mis à jour, puis jalon suivant.

## 7. Protocole de mise à jour de la mémoire

| Événement | Mise à jour |
|---|---|
| Jalon terminé et validé | `context.md` §8 + §9 |
| Nouvelle ou nouvelle version d'une décision | `context.md` §7 (+ §6 si architecture) |
| Hypothèse confirmée / infirmée | `context.md` §10 (puis §7 si elle devient décision) |
| Fonctionnalité ajoutée/retirée du périmètre (accord utilisateur) | `context.md` §4 |
| Changement de méthode ou de conventions | `agents.md` (ce fichier) |

> Si tu hésites où écrire une information : le plus souvent §8 pour « ce qui s'est passé », §7 pour « ce qui a été décidé et pourquoi ».
