# Guide plateforme — Mobile (iOS / Android)

> **Quand lire ce guide** : la plateforme cadrée est une **application installée sur téléphone ou tablette** — « app mobile », « app Android », « app iOS », Flutter, React Native, natif Swift/Kotlin, ou une PWA envisagée comme app. C'est l'un des deux guides d'architecture du skill (l'autre : `web-api.md`). Pour le serveur qui alimentera l'app, applique en parallèle le guide `web-api.md` (section « API backend pure ») et consigne les deux décisions séparément.

## 1. Principe directeur : cross-platform d'abord, natif sur besoin mesuré

Pour une v1 mobile, **l'architecture par défaut est un client cross-platform unique (Flutter ou React Native) + un backend léger (BaaS ou API modulaire) + un stockage local (SQLite)**. Le natif par plateforme signifie deux bases de code, deux compétences, deux campagnes de tests et deux rythmes de publication — c'est un coût permanent, à réserver aux besoins matériels réels (BLE profond, capteurs, performance graphique, intégrations OS avancées) ou à une équipe déjà native. La PWA est l'option la moins chère quand l'app n'a pas besoin du store ni d'un accès matériel profond — mais elle ne remplace pas une app installée quand il faut des notifications push fiables sur iOS ou une présence sur l'App Store.

Le parallèle avec le web est direct : là où le web/API découpe proprement un monolithe, le mobile partage au maximum un seul code client et n'active le natif que sur contrainte **mesurée**.

## 2. La décision backend AVANT la décision client

Pour une app mobile, deux décisions se prennent dans cet ordre : **où vivent les données** (backend), puis **comment le client est construit** (matrice section 3). Le choix backend se fait avec les réponses du cadrage (compétences, budget, sensibilité des données, besoin hors ligne) :

| Option | Facilite | Coûte |
|---|---|---|
| BaaS managé (Supabase, Firebase) | Auth, stockage, temps réel et push prêts à l'emploi ; v1 en quelques jours | Dépendance fournisseur à documenter ; coûts croissants à l'échelle ; requêtes métier complexes limitées |
| API REST modulaire dédiée (guide `web-api.md`) | Contrôle total, portabilité, intégrations métier, pas de surprise tarifaire | À construire, héberger, sécuriser et versionner soi-même |
| BaaS au départ + plan d'extraction documenté | Rapidité de v1 avec une porte de sortie | Discipline d'isoler l'accès aux données derrière une couche de service dès le premier jour |

Règle de prudence : données de santé ou financières → évaluer le BaaS sérieusement (localisation des données, conformité, exportabilité) avant de le choisir ; l'API dédiée est alors souvent la voie la plus sûre.

## 3. Matrice par type d'application mobile

**A. App utilitaire / métier** (formulaires, collecte terrain, inventaire, back-office mobile)
| Palier | Option | Facilite | Coûte |
|---|---|---|---|
| 1 | Flutter ou React Native + BaaS (Supabase, Firebase) + SQLite local | Une seule base de code, auth/sync prêtes, publication rapide sur les deux stores | Dépendance BaaS à cadrer (coûts, localisation des données) |
| 2 | Cross-platform + API dédiée + sync offline (WatermelonDB, Drift…) | Logique métier maison, intégrations internes maîtrisées | Backend à construire ; stratégie de sync à concevoir explicitement |
| 3 | Natif par plateforme (SwiftUI / Kotlin Compose) | Intégrations OS et performance maximales | Deux codebases et deux compétences pour une v1 de besoin standard |

**B. App grand public contenu / e-commerce**
| Palier | Option | Facilite | Coûte |
|---|---|---|---|
| 1 | Cross-platform + API (existante ou BaaS) | Un code pour les deux stores, UI riche, écosystèmes matures | Reviews des stores à anticiper ; règles de facturation in-app selon le type de biens vendus |
| 2 | PWA (si pas de besoin store ni de push fiable) | Zéro review, zéro commission, mise à jour immédiate, une seule codebase web | Pas de présence store, push limité sur iOS, accès matériel réduit — à écarter si ces besoins existent |
| 3 | Natif | UX la plus fine de chaque plateforme | Coût double pour un besoin standard ; à réserver aux apps à identité UX forte |

**C. App temps réel / social** (chat, live, collaboration mobile)
| Palier | Option | Facilite | Coûte |
|---|---|---|---|
| 1 | Cross-platform + WebSocket + backend monolithe (guide `web-api.md` section D) | Réutilise le standard du chat ; un seul modèle de données serveur | Reconnexion, file d'attente d'envoi hors ligne et notifications à soigner dès J1 |
| 2 | Cross-platform + service temps réel managé (Firebase Realtime, Supabase Realtime) | Rapidité de mise en route, zéro infra temps réel à opérer | Coût et limites à l'échelle, dépendance fournisseur à documenter |
| 3 | Natif + SDK temps réel optimisé par plateforme | Performance et UX ultimes | Sur-ingénierie pour une v1 ; à réserver aux besoins mesurés |

**D. App offline-first / terrain** (réseau instable, données critiques locales)
| Palier | Option | Facilite | Coûte |
|---|---|---|---|
| 1 | Cross-platform + base locale SQLite (Drift, WatermelonDB, Realm) + sync explicite | Fonctionne sans réseau, conflits gérés par conception | La sync (horodatage, résolution de conflits) se conçoit dès le modèle de données — pas en patch |
| 2 | Cross-platform + BaaS avec sync intégrée (Firebase offline, PowerSync…) | Moteur de sync fourni et éprouvé | Sémantique de conflit du fournisseur à comprendre et tester sur les cas réels |
| 3 | Natif + base locale bas niveau | Contrôle total sur la persistance et les migrations | Coût élevé ; à réserver aux contraintes très fortes (volumes, chiffrement spécifique) |

**E. App intensif matériel** (BLE, capteurs, caméra avancée, montre, GPS en arrière-plan)
| Palier | Option | Facilite | Coûte |
|---|---|---|---|
| 1 | Natif par plateforme (SwiftUI / Kotlin Compose) | Accès complet et fiable au matériel, comportements OS (permissions, arrière-plan) maîtrisés | Deux codebases — c'est le prix du besoin, l'assumer dans le plan |
| 2 | Cross-platform + modules natifs ciblés (platform channels / native modules) | ~90 % du code partagé, effort natif limité au pont matériel | Maintenance des ponts natifs ; compétences des deux mondes nécessaires |
| 3 | Cross-platform pur | Le plus simple à démarrer | Souvent insuffisant ici : à écarter sauf preuve par prototype sur le matériel réel |

## 4. Angles morts spécifiques mobile (en complément de la checklist générale)

| # | Angle mort | Niveau |
|---|---|---|
| M1 | Comptes développeur & publication (Apple 99 $/an, Google 25 $ une fois ; délais de review ; motifs de rejet) | [critique] |
| M2 | Mode hors ligne & synchronisation (que doit marcher sans réseau ? qui gagne en cas de conflit ?) | [critique] si usage terrain, sinon important |
| M3 | Notifications push (besoin v1 ? quel service envoie : FCM/APNs, via BaaS ou backend ?) | important |
| M4 | Permissions matérielles (caméra, localisation, micro — justifications exigées par les stores) | important |
| M5 | Version OS minimale & matrice d'appareils (min iOS/Android ; politique vis-à-vis des vieilles versions) | important |
| M6 | Mode de distribution (store public, TestFlight/track interne, MDM entreprise — l'APK direct reste un cas exceptionnel à justifier) | important |
| M7 | Exigences des stores (politique de confidentialité, suppression de compte in-app, déclaration des données collectées) | important |
| M8 | Batterie & data (tâches d'arrière-plan, sync wifi uniquement ?) | secondaire |
| M9 | Écrans, gestes, dark mode, accessibilité tactile | secondaire |

## 5. Anti-patterns mobiles à nommer quand ils apparaissent

- **Natif « par fierté »** pour une v1 de formulaires et de listes : le cross-platform fait le même travail à moitié du coût. Le natif se justifie par le matériel ou l'UX, pas par le prestige.
- **PWA par défaut quand le produit exige** des push fiables sur iOS, une présence store ou des accès matériels profonds : c'est un choix par évitement, pas par pertinence.
- **Distribuer un APK hors store au grand public** : pas de mises à jour automatiques, risque de sécurité, confiance dégradée. Réservé aux flottes entreprise maîtrisées.
- **« On gérera l'offline plus tard »** pour une app terrain : la synchronisation se conçoit dans le modèle de données dès J1 ; la rajouter ensuite est une réécriture, pas une fonctionnalité.
- **API GraphQL dédiée pour une seule app consommatrice en v1** : coût de cache et de sécurité pour un bénéfice absent ; REST suffit (guide `web-api.md`).
- **Ignorer la compatibilité des versions publiées** : un backend qui casse les vieilles versions d'app déjà installées garantit des incidents — prévoir versionnement d'API et fenêtre de compatibilité (ex. N-2).
- **Paiement web externe pour des biens numériques** : rejet quasi certain des stores ; respecter les règles de facturation in-app (et les distinguer des biens physiques).

## 6. Adaptation des jalons au mobile

- **J0 — Socle mobile = socle build & distribution** : le projet compile et s'installe sur un appareil réel, identifiants store créés (bundle ID, icône, splash), signature configurée, pipeline de build (debug + release), canal de diffusion interne ouvert (TestFlight / track interne Play). Sans ce canal dès le départ, chaque jalon suivant se heurte à « comment tester sur un vrai téléphone ? ».
- **J1 — Capabilité cœur SUR APPAREIL** : de bout en bout sur un téléphone réel (pas seulement l'émulateur), incluant le mode hors ligne si l'app en dépend.
- **J2…Jn** : une capacité testable par jalon ; les jalons matériels (permissions, push) se testent sur appareils réels des deux plateformes visées.
- **JD — Durcissement & publication** : revue sécurité mobile (aucun secret embarqué dans l'app, validation des entrées côté backend, chiffrement local si données sensibles), crash reporting (Sentry/Crashlytics), politique de confidentialité et suppression de compte in-app, **soumission aux stores avec marge pour les délais et allers-retours de review**, plan de hotfix.
- **Après publication** : chaque évolution d'API maintient la compatibilité avec les versions d'app en circulation (fenêtre N-2), consignée dans `context.md`.
