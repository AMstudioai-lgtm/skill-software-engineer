# 🛠️ skill-software-engineer

> **Skill « Ingénieur Logiciel »** pour agents IA (Claude Code, Codex, Cursor, Windsurf, OpenCode, Copilot, Amp…)
>
> *« La précision est la clé et la stabilité le but. »*

Transforme un agent IA en ingénieur logiciel rigoureux : il **cadre** le besoin avant de coder, **recommande 3 architectures** classées par pertinence, **mémorise** le projet (context.md / agents.md), **planifie par jalons** incrémentaux et vous aide à choisir des solutions **maintenables dans la durée**.

---

## ✨ Ce que fait le skill

| Capacité | Description |
|---|---|
| 🏛️ **Architecture recommandée** | 3 options classées de la plus à la moins pertinente selon le type d'application (web, API, temps réel, data, mono-utilisateur), avec compromis coût/complexité/expéérience |
| 🕳️ **Comblement des angles morts** | Checklist de 12 points à clarifier (dont 5 critiques : auth, données, hébergement, budget, utilisateurs) avant toute ligne de code |
| 🧠 **Mémoire projet** | Crée et tient à jour `context.md` (progrès, étapes restantes, cas hors périmètre) et `agents.md` (méthode de travail, instructions) |
| 📋 **Plan strict par jalons** | Jalons incrémentaux, chacun livrant une capacité de bout en bout **testable** — jamais de « produit générique généré d'un bloc » |
| ♻️ **Décisions durables** | Chaque choix technique est justifié par sa maintenabilité, pas par la mode |

Résultats mesurés (benchmark v1, 3 scénarios × 6 assertions) : **100 % avec le skill vs 44,4 % sans**.

---

## 📦 Installation

### Méthode 1 — via `npx` (recommandée, aucune installation préalable)

Remplacez `VOTRE-UTILISATEUR` par votre compte GitHub après avoir poussé ce dépôt :

```bash
# Détection automatique de l'agent + installation globale
npx github:VOTRE-UTILISATEUR/skill-software-engineer

# Choisir explicitement l'agent (plusieurs possibles, séparés par des virgules)
npx github:VOTRE-UTILISATEUR/skill-software-engineer -- --agent claude,codex -g

# Installer dans le projet courant (.claude/skills/, .cursor/skills/, …)
npx github:VOTRE-UTILISATEUR/skill-software-engineer -- --project

# Sans confirmation (CI / scripts)
npx github:VOTRE-UTILISATEUR/skill-software-engineer -- --yes
```

> 💡 L'installateur est **zéro dépendance** (Node ≥ 18) : il s'exécute instantanément, sans `npm install`.

### Méthode 2 — via le registre skills.sh (compatible)

Si le dépôt est public, les consommateurs du standard *Agent Skills* peuvent aussi faire :

```bash
npx skills add VOTRE-UTILISATEUR/skill-software-engineer
```

### Méthode 3 — clonage manuel

```bash
git clone https://github.com/VOTRE-UTILISATEUR/skill-software-engineer.git
mkdir -p ~/.claude/skills
cp -r skill-software-engineer/skill/software-engineer ~/.claude/skills/
```

### Agents et emplacements cibles

| Agent | Global | Projet |
|---|---|---|
| Claude Code | `~/.claude/skills/` | `.claude/skills/` |
| Codex CLI | `~/.codex/skills/` | `.codex/skills/` |
| Cursor | `~/.cursor/skills/` | `.cursor/skills/` |
| Windsurf | `~/.codeium/windsurf/skills/` | `.windsurf/skills/` |
| OpenCode | `~/.config/opencode/skills/` | `.opencode/skills/` |
| GitHub Copilot | — | `.github/skills/` |
| Amp | `~/.config/amp/skills/` | `.agents/skills/` |

---

## 🚀 Utilisation

Une fois installé, **redémarrez votre agent**, puis déclenchez le skill naturellement :

> *« Aide-moi à construire une application de gestion de tâches pour une agence immobilière, budget serré, hébergement OVH, je débute. »*

L'agent enchaînera le cycle :

```
CADRER → ARCHITECTURER → MÉMORISER → PLANIFIER → CONSTRUIRE → MAINTENIR
```

1. **CADRER** — 4 phases de questions + checklist des angles morts (aucune supposition silencieuse)
2. **ARCHITECTURER** — 3 options d'architecture classées par pertinence, défaut prudent en gras
3. **MÉMORISER** — création de `context.md` + `agents.md` à partir des modèles fournis
4. **PLANIFIER** — jalons incrémentaux avec critères de validation explicites
5. **CONSTRUIRE** — un jalon à la fois, livrable testable, mise à jour de la mémoire
6. **MAINTENIR** — décisions documentées, dette suivie, cas hors périmètre notés

### Désinstallation

```bash
npx github:VOTRE-UTILISATEUR/skill-software-engineer -- --uninstall
```

---

## 🗂️ Structure du dépôt

```
skill-software-engineer/
├── bin/install.js              ← installateur npx (zéro dépendance)
├── skill/software-engineer/    ← LE SKILL (c'est ce dossier qui est copié)
│   ├── SKILL.md                ← posture, cycle en 6 phases, matrices, formats
│   ├── assets/
│   │   ├── context-template.md ← modèle de mémoire projet
│   │   ├── agents-template.md  ← modèle d'instructions agents
│   │   └── plan-template.md    ← modèle de plan par jalons
│   └── evals/evals.json        ← 3 scénarios de test, 6 assertions chacun
├── evals/evals.json            ← copie des évals (documentation)
├── dist/software-engineer.skill← archive .skill prête à importer
├── .github/workflows/ci.yml    ← vérification automatique du paquet
├── package.json                ← point d'entrée bin pour npx
└── README.md
```

## 🧪 Développement

Modifier le skill : éditez `skill/software-engineer/SKILL.md` (et les assets), puis :

```bash
# Bump de version
npm version patch   # ou minor / major

# Vérification locale de l'installateur
node bin/install.js --list
node bin/install.js --agent claude -g --yes

# Re-package de l'archive .skill (zip du dossier skill/)
cd skill && zip -r ../dist/software-engineer.skill software-engineer && cd ..
```

La CI vérifie à chaque push : validité du frontmatter YAML, présence des assets, intégrité de l'archive `dist/`.

## 📄 Licence

MIT — voir [LICENSE](LICENSE).
