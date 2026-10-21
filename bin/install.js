#!/usr/bin/env node
/**
 * skill-software-engineer — installateur npx (zéro dépendance)
 *
 * Installe le skill « software-engineer » (Ingénieur Logiciel) dans le
 * répertoire de skills de l'agent détecté ou choisi.
 *
 * Usage :
 *   npx github:AMstudioai-lgtm/skill-software-engineer
 *   npx github:AMstudioai-lgtm/skill-software-engineer -- --agent claude,codex -g
 *   npx skill-software-engineer            (si publié sur npm)
 *
 * Options :
 *   -a, --agent <noms>   Agents cibles, séparés par des virgules
 *                        (claude, codex, cursor, windsurf, opencode, copilot, amp, auto, all)
 *   -g, --global         Installation globale (défaut)
 *   -p, --project        Installation dans le projet courant
 *   -y, --yes            Écraser sans demander
 *   -u, --uninstall      Désinstaller le skill
 *   -l, --list           Lister les agents détectés
 *       --root <dir>     Racine personnalisée (tests / installation portable)
 *   -h, --help           Aide
 *   -v, --version        Version
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

/* Résilience au tube fermé (ex. : npx … | head) */
process.stdout.on('error', (e) => { if (e.code === 'EPIPE') process.exit(0); throw e; });
process.stderr.on('error', (e) => { if (e.code === 'EPIPE') process.exit(0); throw e; });

const PKG_VERSION = require('../package.json').version;
const SKILL_NAME = 'software-engineer';
const SKILL_SRC = path.join(__dirname, '..', 'skill', SKILL_NAME);
const ROOT_MARK = '« La précision est la clé et la stabilité le but »';

/* ------------------------------------------------------------------ */
/* Agents supportés                                                    */
/* ------------------------------------------------------------------ */

function agentTable(HOME) {
  return {
    claude: {
      label: 'Claude Code',
      global: path.join(HOME, '.claude', 'skills'),
      project: path.join('.claude', 'skills'),
    },
    codex: {
      label: 'Codex CLI',
      global: path.join(HOME, '.codex', 'skills'),
      project: path.join('.codex', 'skills'),
    },
    cursor: {
      label: 'Cursor',
      global: path.join(HOME, '.cursor', 'skills'),
      project: path.join('.cursor', 'skills'),
    },
    windsurf: {
      label: 'Windsurf',
      global: path.join(HOME, '.codeium', 'windsurf', 'skills'),
      project: path.join('.windsurf', 'skills'),
    },
    opencode: {
      label: 'OpenCode',
      global: path.join(HOME, '.config', 'opencode', 'skills'),
      project: path.join('.opencode', 'skills'),
    },
    copilot: {
      label: 'GitHub Copilot',
      global: null,
      project: path.join('.github', 'skills'),
    },
    amp: {
      label: 'Amp',
      global: path.join(HOME, '.config', 'amp', 'skills'),
      project: path.join('.agents', 'skills'),
    },
    agents: {
      label: 'Agent Skills (.agents)',
      global: path.join(HOME, '.agents', 'skills'),
      project: path.join('.agents', 'skills'),
    },
  };
}

/* ------------------------------------------------------------------ */
/* Utilitaires                                                         */
/* ------------------------------------------------------------------ */

const log = (msg) => process.stdout.write(msg + '\n');
const err = (msg) => process.stderr.write(msg + '\n');

function copyDir(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
}

function dirExists(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function verifyInstall(dest) {
  return fs.existsSync(path.join(dest, SKILL_NAME, 'SKILL.md'));
}

function detectAgents(table, HOME, root) {
  const found = [];
  for (const [id, cfg] of Object.entries(table)) {
    const globalHit = cfg.global && dirExists(cfg.global);
    // Détection projet : uniquement si un dossier du même nom existe déjà
    const projectHit = dirExists(path.join(root, cfg.project));
    if (globalHit || projectHit) found.push(id);
  }
  return found;
}

/* ------------------------------------------------------------------ */
/* Analyse des arguments                                               */
/* ------------------------------------------------------------------ */

function parseArgs(argv) {
  const opts = {
    agents: 'auto',
    scope: 'global',
    yes: false,
    uninstall: false,
    list: false,
    help: false,
    version: false,
    root: null,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    switch (a) {
      case '-a':
      case '--agent':
        opts.agents = (argv[++i] || 'auto').toLowerCase();
        break;
      case '-g':
      case '--global':
        opts.scope = 'global';
        break;
      case '-p':
      case '--project':
        opts.scope = 'project';
        break;
      case '-y':
      case '--yes':
        opts.yes = true;
        break;
      case '-u':
      case '--uninstall':
        opts.uninstall = true;
        break;
      case '-l':
      case '--list':
        opts.list = true;
        break;
      case '--root':
        opts.root = argv[++i];
        break;
      case '-v':
      case '--version':
        opts.version = true;
        break;
      case '-h':
      case '--help':
        opts.help = true;
        break;
      default:
        err(`⚠  Option inconnue ignorée : ${a}`);
    }
  }
  return opts;
}

/* ------------------------------------------------------------------ */
/* Programme principal                                                 */
/* ------------------------------------------------------------------ */

function askOverwrite(label) {
  const readline = require('readline');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(`      ${label} : le skill existe déjà, écraser ? [o/N] `, (answer) => {
      rl.close();
      resolve(/^o(u|i)?$/i.test((answer || '').trim()) && answer.trim() !== '');
    });
  });
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.version) {
    log(`skill-software-engineer v${PKG_VERSION}`);
    return 0;
  }
  if (opts.help) {
    log(
`skill-software-engineer v${PKG_VERSION} — installe le skill « ${SKILL_NAME} »

${ROOT_MARK}

Usage:
  npx github:AMstudioai-lgtm/skill-software-engineer [options]

Options:
  -a, --agent <noms>   claude | codex | cursor | windsurf | opencode | copilot | amp | agents | auto | all
  -g, --global         Installation globale (défaut)
  -p, --project        Installation dans le projet courant
  -y, --yes            Écraser sans demander
  -u, --uninstall      Désinstaller
  -l, --list           Lister les agents détectés
      --root <dir>     Racine personnalisée (tests)
  -h, --help           Aide
  -v, --version        Version`);
    return 0;
  }

  const HOME = opts.root ? path.resolve(opts.root) : os.homedir();
  const root = opts.root ? path.resolve(opts.root) : process.cwd();
  const table = agentTable(HOME);

  /* ---- --list ---------------------------------------------------- */
  if (opts.list) {
    const detected = detectAgents(table, HOME, root);
    log('\nAgents supportés :');
    for (const [id, cfg] of Object.entries(table)) {
      const hit = detected.includes(id) ? '✔ détecté' : '— absent';
      const target = opts.scope === 'global' ? cfg.global : cfg.project;
      log(`  ${id.padEnd(10)} ${cfg.label.padEnd(16)} ${hit}${target ? '  → ' + target : '  (projet uniquement)'}`);
    }
    log('');
    return 0;
  }

  /* ---- Résolution des agents cibles ------------------------------ */
  let targets;
  if (opts.agents === 'all') {
    targets = Object.keys(table);
  } else if (opts.agents === 'auto') {
    const detected = detectAgents(table, HOME, root);
    if (detected.length > 0) {
      targets = detected;
      log(`ℹ  Agents détectés : ${detected.map((id) => table[id].label).join(', ')}`);
    } else {
      targets = ['claude'];
      log('ℹ  Aucun agent détecté — cible par défaut : Claude Code.');
      log('   (Utilisez --agent <nom> pour choisir : claude, codex, cursor, windsurf, opencode, copilot, amp, all)');
    }
  } else {
    targets = opts.agents.split(',').map((s) => s.trim()).filter(Boolean);
    const invalid = targets.filter((t) => !table[t]);
    if (invalid.length > 0) {
      err(`✖ Agent(s) inconnu(s) : ${invalid.join(', ')}`);
      err(`   Agents valides : ${Object.keys(table).join(', ')}`);
      return 1;
    }
  }

  /* ---- Vérification de la source --------------------------------- */
  if (!fs.existsSync(path.join(SKILL_SRC, 'SKILL.md'))) {
    err('✖ Source du skill introuvable (skill/' + SKILL_NAME + '/SKILL.md).');
    err('  Le paquet semble corrompu — réinstallez-le.');
    return 1;
  }

  /* ---- Installation / désinstallation ----------------------------- */
  const scopeLabel = opts.scope === 'global' ? 'globale' : 'projet';
  log(`\nIngénieur Logiciel v${PKG_VERSION} — ${opts.uninstall ? 'désinstallation' : 'installation'} ${scopeLabel}\n`);

  let ok = 0;
  let ko = 0;

  for (const id of targets) {
    const cfg = table[id];
    const base = opts.scope === 'global' ? cfg.global : path.join(root, cfg.project);

    if (!base) {
      log(`  • ${cfg.label.padEnd(16)} ✖ installation globale non applicable (utilisez --project)`);
      ko++;
      continue;
    }

    const dest = path.join(base, SKILL_NAME);

    try {
      if (opts.uninstall) {
        if (dirExists(dest)) {
          fs.rmSync(dest, { recursive: true, force: true });
          log(`  • ${cfg.label.padEnd(16)} ✔ désinstallé (${dest})`);
          ok++;
        } else {
          log(`  • ${cfg.label.padEnd(16)} — rien à désinstaller`);
        }
        continue;
      }

      if (dirExists(dest)) {
        if (!opts.yes && process.stdin.isTTY) {
          const ok = await askOverwrite(cfg.label);
          if (!ok) {
            log(`  • ${cfg.label.padEnd(16)} — conservé (sans modification)`);
            continue;
          }
        } else if (!opts.yes) {
          log(`      (écrasement de ${dest} — utilisez --yes pour éviter ce message)`);
        }
        fs.rmSync(dest, { recursive: true, force: true });
      }

      copyDir(SKILL_SRC, dest);

      if (verifyInstall(base)) {
        log(`  • ${cfg.label.padEnd(16)} ✔ installé → ${dest}`);
        ok++;
      } else {
        throw new Error('vérification post-copie échouée');
      }
    } catch (e) {
      err(`  • ${cfg.label.padEnd(16)} ✖ échec : ${e.message}`);
      ko++;
    }
  }

  /* ---- Récapitulatif ---------------------------------------------- */
  if (opts.uninstall) {
    log(`\nTerminé : ${ok} désinstallation(s), ${ko} échec(s).\n`);
  } else {
    log(`\nTerminé : ${ok} installation(s) réussie(s), ${ko} échec(s).`);
    if (ok > 0) {
      log(`
Prochaines étapes :
  1. Redémarrez votre agent (ou rouvrez la session) pour qu'il charge le skill.
  2. Déclenchez-le avec une demande du type :
     « Aide-moi à construire une application de … »
  3. L'agent appliquera le cycle : cadrage → architecture (3 options) → mémoire
     (context.md / agents.md) → plan par jalons → construction incrémentale.

${ROOT_MARK}
`);
    }
  }

  return ko > 0 ? 1 : 0;
}

main()
  .then((code) => { process.exitCode = code; })
  .catch((e) => { err(`✖ Erreur inattendue : ${e.message}`); process.exitCode = 1; });
