#!/usr/bin/env node

/**
 * clean-code.js
 * Removes console.* statements and unused imports from JS/TS/JSX/TSX files.
 *
 * Usage:
 *   node scripts/clean-code.js              → dry-run (preview changes)
 *   node scripts/clean-code.js --fix        → apply changes
 *   node scripts/clean-code.js --fix --verbose  → apply + log every change
 */

const fs = require('fs');
const path = require('path');

// ─── Config ───────────────────────────────────────────────────────────────────
const TARGET_DIR = path.resolve(__dirname, '../src');
const EXTRA_ROOTS = [path.resolve(__dirname, '../App.tsx')]; // add extra root files if needed
const EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];
const FIX_MODE = process.argv.includes('--fix');
const VERBOSE = process.argv.includes('--verbose');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAllFiles(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      getAllFiles(full, results);
    } else if (EXTENSIONS.includes(path.extname(entry.name))) {
      results.push(full);
    }
  }
  return results;
}

// Remove console.log / console.warn / console.error / console.info / console.debug
// Handles multi-line calls like console.log(\n  'foo'\n)
function removeConsoleCalls(src) {
  // Match console.anything(...) including multi-line, but not inside comments
  // Strategy: line-by-line for simple single-line, regex for multi-line blocks
  let result = src;

  // Remove full-line console statements (most common case)
  result = result.replace(
    /^[ \t]*console\.(log|warn|error|info|debug|trace|dir|table|time|timeEnd|group|groupEnd)\s*\(.*?\);?[ \t]*\r?\n?/gm,
    '',
  );

  // Remove multi-line console calls (where the closing ); is on a different line)
  result = result.replace(
    /[ \t]*console\.(log|warn|error|info|debug|trace|dir|table|time|timeEnd|group|groupEnd)\s*\([\s\S]*?\);/g,
    '',
  );

  return result;
}

// Parse all import statements and return structured info
function parseImports(src) {
  const imports = [];
  // Named: import { A, B as C } from 'mod'
  // Default: import Foo from 'mod'
  // Mixed: import Foo, { A, B } from 'mod'
  // Side-effect: import 'mod'
  // Namespace: import * as Foo from 'mod'
  const importRegex =
    /^import\s+([\s\S]*?)\s+from\s+(['"`][^'"`]+['"`])\s*;?[ \t]*$/gm;
  const sideEffectRegex = /^import\s+(['"`][^'"`]+['"`])\s*;?[ \t]*$/gm;

  let match;
  while ((match = importRegex.exec(src)) !== null) {
    imports.push({
      full: match[0],
      clause: match[1].trim(),
      source: match[2],
      start: match.index,
      end: match.index + match[0].length,
      isSideEffect: false,
    });
  }
  while ((match = sideEffectRegex.exec(src)) !== null) {
    imports.push({
      full: match[0],
      clause: null,
      source: match[1],
      start: match.index,
      end: match.index + match[0].length,
      isSideEffect: true,
    });
  }

  return imports.sort((a, b) => a.start - b.start);
}

// Extract individual identifiers from an import clause
function extractIdentifiers(clause) {
  const ids = [];
  // Default import (no braces, no *)
  const defaultMatch = clause.match(/^([A-Za-z_$][A-Za-z0-9_$]*)\s*(?:,|$)/);
  if (defaultMatch) ids.push(defaultMatch[1]);

  // Namespace: * as Foo
  const nsMatch = clause.match(/\*\s+as\s+([A-Za-z_$][A-Za-z0-9_$]*)/);
  if (nsMatch) ids.push(nsMatch[1]);

  // Named: { A, B as C, D }
  const namedBlock = clause.match(/\{([^}]+)\}/);
  if (namedBlock) {
    namedBlock[1].split(',').forEach(part => {
      const trimmed = part.trim();
      if (!trimmed) return;
      // "A as B" → use alias B
      const asMatch = trimmed.match(/\S+\s+as\s+([A-Za-z_$][A-Za-z0-9_$]*)/);
      if (asMatch) {
        ids.push(asMatch[1]);
      } else {
        ids.push(trimmed.split(/\s+/)[0]);
      }
    });
  }

  return ids.filter(Boolean);
}

// Check if an identifier is actually used in the file body (after imports)
function isUsed(identifier, bodyWithoutImports) {
  // Escape special regex chars in the identifier
  const escaped = identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Match as whole word, outside of import lines
  const re = new RegExp(`(?<!['"a-zA-Z0-9_$])${escaped}(?!['"a-zA-Z0-9_$])`, 'g');
  return re.test(bodyWithoutImports);
}

function removeUnusedImports(src) {
  const imports = parseImports(src);
  if (imports.length === 0) return src;

  // Build body = everything after the last import for usage checks
  const lastImportEnd = Math.max(...imports.map(i => i.end));
  const body = src.slice(lastImportEnd);

  let result = src;
  let removedCount = 0;

  // Process in reverse so string offsets stay valid
  const reversedImports = [...imports].reverse();

  for (const imp of reversedImports) {
    if (imp.isSideEffect) continue; // never remove side-effect imports

    const identifiers = extractIdentifiers(imp.clause);
    if (identifiers.length === 0) continue;

    // Separate default/namespace from named
    const clause = imp.clause;
    const namedBlock = clause.match(/\{([^}]+)\}/);
    const hasDefault = /^[A-Za-z_$][A-Za-z0-9_$]*\s*(?:,|\s*$)/.test(
      clause.replace(/\{[^}]*\}/, '').trim(),
    );
    const hasNamespace = /\*\s+as\s+/.test(clause);

    // Determine which named imports are used
    let usedNamed = [];
    if (namedBlock) {
      usedNamed = namedBlock[1]
        .split(',')
        .map(p => p.trim())
        .filter(p => {
          if (!p) return false;
          const asMatch = p.match(/\S+\s+as\s+([A-Za-z_$][A-Za-z0-9_$]*)/);
          const localName = asMatch ? asMatch[1] : p.split(/\s+/)[0];
          return isUsed(localName, body);
        });
    }

    // Check default
    let defaultUsed = false;
    if (hasDefault) {
      const defaultName = clause
        .replace(/\{[^}]*\}/, '')
        .replace(/\*\s+as\s+\S+/, '')
        .trim()
        .replace(/,$/, '')
        .trim();
      if (defaultName) defaultUsed = isUsed(defaultName, body);
    }

    // Check namespace
    let nsUsed = false;
    if (hasNamespace) {
      const nsMatch = clause.match(/\*\s+as\s+([A-Za-z_$][A-Za-z0-9_$]*)/);
      if (nsMatch) nsUsed = isUsed(nsMatch[1], body);
    }

    const anythingUsed = defaultUsed || nsUsed || usedNamed.length > 0;

    if (!anythingUsed) {
      // Remove entire import line
      result =
        result.slice(0, imp.start) +
        result.slice(imp.end).replace(/^\n/, ''); // eat trailing newline
      removedCount++;
      if (VERBOSE) console.log(`  ✂  Removed import: ${imp.full.trim()}`);
    } else if (namedBlock && usedNamed.length < namedBlock[1].split(',').filter(s => s.trim()).length) {
      // Some named imports unused — rewrite import with only used ones
      let newClause = '';
      if (defaultUsed) {
        const defaultName = clause
          .replace(/\{[^}]*\}/, '')
          .replace(/\*\s+as\s+\S+/, '')
          .trim()
          .replace(/,$/, '')
          .trim();
        newClause += defaultName;
      }
      if (nsUsed) {
        const nsMatch = clause.match(/(\*\s+as\s+[A-Za-z_$][A-Za-z0-9_$]*)/);
        if (nsMatch) {
          if (newClause) newClause += ', ';
          newClause += nsMatch[1];
        }
      }
      if (usedNamed.length > 0) {
        if (newClause) newClause += ', ';
        newClause += `{ ${usedNamed.join(', ')} }`;
      }
      const newImport = `import ${newClause} from ${imp.source};`;
      result = result.slice(0, imp.start) + newImport + result.slice(imp.end);
      if (VERBOSE)
        console.log(
          `  ✂  Trimmed import: ${imp.full.trim()} → ${newImport}`,
        );
      removedCount++;
    }
  }

  return result;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function processFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  let updated = original;

  updated = removeConsoleCalls(updated);
  updated = removeUnusedImports(updated);

  // Collapse more than 2 consecutive blank lines
  updated = updated.replace(/\n{3,}/g, '\n\n');

  if (updated === original) return { changed: false };

  if (FIX_MODE) {
    fs.writeFileSync(filePath, updated, 'utf8');
  }

  return { changed: true, original, updated };
}

function main() {
  const files = getAllFiles(TARGET_DIR);
  for (const extra of EXTRA_ROOTS) {
    if (fs.existsSync(extra)) files.push(extra);
  }

  console.log(
    `\n🔍  Scanning ${files.length} files in ${TARGET_DIR}${FIX_MODE ? ' [FIX MODE]' : ' [DRY RUN]'}\n`,
  );

  let changedCount = 0;

  for (const file of files) {
    if (VERBOSE) console.log(`Processing: ${path.relative(process.cwd(), file)}`);
    const { changed } = processFile(file);
    if (changed) {
      changedCount++;
      const rel = path.relative(process.cwd(), file);
      console.log(`  ${FIX_MODE ? '✅ Fixed' : '⚠️  Would fix'}: ${rel}`);
    }
  }

  console.log(`\n${FIX_MODE ? '✅ Done!' : '🔎 Dry-run complete.'}`);
  console.log(`   Files affected: ${changedCount} / ${files.length}`);
  if (!FIX_MODE && changedCount > 0) {
    console.log('\n   Run with --fix to apply changes:\n');
    console.log('   node scripts/clean-code.js --fix\n');
  }
}

main();
