# context.md — Mémoire du projet : [NOM DU PROJET]

> **Rôle de ce fichier** : c'est la mémoire officielle du projet. Toute évolution (jalon terminé, décision, hypothèse confirmée) doit s'y refléter — une mémoire obsolète ment, et une mémoire qui ment est pire qu'une absence de mémoire.
> **Dernière mise à jour** : [DATE] par [qui]
> Devise du projet : « La précision est la clé et la stabilité le but »

## 1. Identité

- **Nom du projet** : [nom]
- **Version visée** : v1
- **Statut actuel** : [cadrage / architecture validée / mémoire créée / construction — Jalon N/N / durcissement / maintenance]
- **Fichiers jumeaux** : `agents.md` (comment travailler ici), plan de développement ([fichier plan])

## 2. Vision & problème résolu

[2 à 5 phrases : le problème concret vécu par qui, ce que la v1 change, et pourquoi c'est utile maintenant. Pas de marketing : des faits.]

## 3. Utilisateurs & cas d'usage

| Utilisateur / rôle | Ce qu'il fait dans la v1 | Fréquence d'usage estimée |
|---|---|---|
| [ex. Agent immobilier] | [crée des dossiers, assigne des tâches] | [quotidien] |

## 4. Description détaillée de la v1

### 4.1 Fonctionnalités indispensables (MUST)

- **[F1] [Nom]** : [description précise] — **Critère de réussite** : [comment on prouve que ça marche]

### 4.2 Fonctionnalités utiles si le temps le permet (SHOULD)

- **[F..] [Nom]** : [description] — [pourquoi ce n'est pas MUST]

### 4.3 Cas hors version v1 (HORS PÉRIMÈTRE — ne pas implémenter sans nouvelle décision consignée)

- **[X1] [Nom]** : [description] — **Raison de l'exclusion** : [raison, ex. « coûteux, non bloquant pour la valeur v1, reporté post-v1 »]

> Ce qui est listé ici est explicitement exclu. Toute demande nouvelle est arbitrée : soit elle entre au SHOULD avec accord, soit elle rejoint cette liste avec sa raison.

## 5. Données

- **Entités principales** : [ex. Utilisateur, Dossier, Tâche — et leurs relations essentielles]
- **Volume estimé** : [ordre de grandeur]
- **Données personnelles / sensibles** : [lesquelles, base légale si RGPD, minimisation appliquée]
- **Sauvegarde** : [fréquence, emplacement, procédure de restauration testée oui/non]

## 6. Architecture choisie

- **Type d'application** : [A/B/C/D/E + libellé]
- **Architecture retenue** : [option 1ᵉʳ palier retenue ou variante]
- **Stack** : [langage, framework, BDD, hébergement, ORM/outils principaux]
- **Alternatives écartées** : [option écartée → raison courte, renvoi au §7 si détaillé]

## 7. Journal des décisions (avec les raisons)

| Date | Décision | Alternatives considérées | Raison |
|---|---|---|---|
| [date] | [ex. Monolithe Next.js + PostgreSQL] | [SPA+API ; microservices] | [compétences de l'équipe, hébergement simple, charge faible] |

> Append-only : on n'efface pas une décision passée, on consigne la nouvelle avec sa raison.

## 8. Journal des avancées (append-only, daté)

### [DATE] — Jalon [N] : [nom du jalon]

- **Réalisé** : [ce qui a été livré]
- **Validé par** : [qui, avec quelle preuve : commande/démo]
- **Découvertes / écarts** : [problèmes rencontrés, ajustements]
- **Prochaine étape** : [jalon suivant ou tâche immédiate]

## 9. Étapes à venir

- **Jalon en cours** : [nom — ou « aucun »]
- **Prochain jalon** : [nom + objectif en une ligne]
- **Backlog post-v1** : [idées issues du hors-périmètre, non promises]

## 10. Hypothèses & questions ouvertes

- **[H1] Hypothèse** : [énoncé] — (à confirmer par [qui/quand])
- **[Q1] Question ouverte** : [énoncé] — [ce qui la bloque]

> Une hypothèse confirmée devient une décision (§7) ; une hypothèse infirmée est corrigée ici puis dans les sections concernées.
