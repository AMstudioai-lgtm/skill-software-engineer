# plan.md — Plan de développement par jalons : [NOM DU PROJET]

> **Architecture retenue** : [résumé en 1 ligne]
> **Règle d'or** : un jalon à la fois, validé avant de passer au suivant. Chaque jalon livre une capacité **testable de bout en bout** — jamais un quart de produit générique.
> **Suivi** : reporter le statut dans le tableau final et dans `context.md` §8/§9 après chaque validation.

## J0 — Socle du projet

- **Objectif** : un squelette qui démarre et se déploie, même vide — prouver que l'environnement tient debout.
- **Tâches ordonnées** :
  1. [ ] Dépôt initialisé + README de démarrage
  2. [ ] Environnement & variables (.env.example, secrets hors code)
  3. [ ] Squelette de l'application qui démarre (page/endpoint de santé)
  4. [ ] Pipeline minimal (lint / formatage)
  5. [ ] Sauvegarde initiale de la base (même vide) + procédure de restauration notée
- **Critère de validation** : « `_[commande de lancement]_` démarre le projet et `_[URL/commande]_` répond »
- **Hors-jalon** : toute fonctionnalité visible, tout design.

## J1 — Capabilité cœur (« marche à pied »)

- **Objectif** : la plus petite capacité de bout en bout traversant **toutes les couches** (interface → logique → base → retour interface), qui prouve que l'architecture tient. Si la v1 a des comptes dès le départ, inclure l'authentification minimale ici.
- **Exemples de formulation** : « créer une tâche, la persister, la revoir dans la liste » ; « se connecter et voir son espace ».
- **Tâches ordonnées** :
  1. [ ] [modèle/entité + migration]
  2. [ ] [route/endpoint + validation des entrées]
  3. [ ] [interface minimale]
  4. [ ] [test du critère]
- **Critère de validation** : « [scénario observable du point de vue de l'utilisateur] »
- **Hors-jalon** : [ce qui n'est PAS ici, ex. rôles avancés, recherche]

## J2…Jn — Capacités par ordre de dépendance

> Ordre : ce qui **débloque la suite** d'abord ; les SHOULD de `context.md` §4.2 en fin de plan ; une capacité testable par jalon.

### J2 — [Nom de la capacité]
- **Objectif** : [capacité testable]
- **Tâches ordonnées** : [liste numérotée]
- **Critère de validation** : [preuve observable]
- **Hors-jalon** : [frontière explicite]

### J3 — [Nom de la capacité]
- *(même format)*

## JD — Durcissement & mise en production

- **Objectif** : sécuriser, fiabiliser, déployer — transformer un projet qui marche en projet qu'on peut laisser tourner.
- **Tâches ordonnées** :
  1. [ ] Revue sécurité (secrets, validation des entrées, permissions, dépendances)
  2. [ ] Gestion d'erreurs + logs utiles (pas de secrets dans les logs)
  3. [ ] Sauvegardes automatisées + restauration **testée au moins une fois**
  4. [ ] Déploiement final + URL de production
  5. [ ] Documentation d'usage (README) + `context.md` à jour
- **Critère de validation** : « restauration d'une sauvegarde réussie + [scénario d'erreur géré proprement] + v1 accessible sur [URL] »

## Tableau de suivi

| Jalon | Objectif en 1 ligne | Statut (à faire / en cours / validé) | Validé le | Preuve (commande / démo) |
|---|---|---|---|---|
| J0 | Socle qui démarre | à faire | — | — |
| J1 | Capabilité cœur | à faire | — | — |
| J2… | … | à faire | — | — |
| JD | Durcissement | à faire | — | — |
