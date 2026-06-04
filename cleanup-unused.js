#!/usr/bin/env node

/**
 * cleanup-unused.js
 *
 * Removes unused imports and console.log statements across the app.
 * Also detects component/module files that are never imported anywhere.
 *
 * Usage:
 *   node cleanup-unused.js              # Dry run (report only)
 *   node cleanup-unused.js --fix        # Apply fixes
 *   node cleanup-unused.js --fix --no-console  # Also remove console.log
 */

const fs = require('fs');
const path = require('path');

// ─── Configuration ──────────────────────────────────────────────────────────
const SRC_DIR = path.join(__dirname, 'src');
const ROOT_FILES = [path.join(__dirname, 'App.tsx'), path.join(__dirname, 'index.js')];
const EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];
const FIX_MODE = process.argv.includes('--fix');
const REMOVE_CONSOLE = process.argv.includes('--no-console');

// ─── Helpers ────────────────────────────────────────────────────────────────

function getAllFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, {withFileTypes: true});
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      getAllFiles(fullPath, fileList);
    } else if (EXTENSIONS.includes(path.extname(entry.name))) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

/**
 * Parse all import statements from a file's content.
 * Handles:
 *   import X from '...'
 *   import { A, B, C } from '...'
 *   import X, { A, B } from '...'
 *   import * as X from '...'
 *   const X = require('...')
 */
function parseImports(content) {
  const imports = [];

  // ES module imports
  const esImportRegex =
    /^([ \t]*import\s+(?:(?:type\s+)?(?:(\w+)(?:\s*,\s*)?)?(?:\{([^}]*)\})?\s*(?:\*\s+as\s+(\w+)\s*)?from\s+['"][^'"]+['"]|['"][^'"]+['"])\s*;?\s*)$/gm;

  let match;
  while ((match = esImportRegex.exec(content)) !== null) {
    const fullStatement = match[1];
    const defaultImport = match[2] || null;
    const namedImports = match[3]
      ? match[3]
          .split(',')
          .map(s => {
            const parts = s.trim().split(/\s+as\s+/);
            return parts.length > 1 ? parts[1].trim() : parts[0].trim();
          })
          .filter(Boolean)
      : [];
    const namespaceImport = match[4] || null;

    const identifiers = [];
    if (defaultImport) identifiers.push(defaultImport);
    identifiers.push(...namedImports);
    if (namespaceImport) identifiers.push(namespaceImport);

    imports.push({
      fullStatement,
      identifiers,
      startIndex: match.index,
      endIndex: match.index + fullStatement.length,
    });
  }

  // CommonJS require
  const requireRegex =
    /^([ \t]*(?:const|let|var)\s+(?:(\w+)|\{([^}]*)\})\s*=\s*require\s*\(['"][^'"]+['"]\)\s*;?\s*)$/gm;

  while ((match = requireRegex.exec(content)) !== null) {
    const fullStatement = match[1];
    const defaultImport = match[2] || null;
    const namedImports = match[3]
      ? match[3]
          .split(',')
          .map(s => s.trim().split(/\s*:\s*/).pop().trim())
          .filter(Boolean)
      : [];

    const identifiers = [];
    if (defaultImport) identifiers.push(defaultImport);
    identifiers.push(...namedImports);

    imports.push({
      fullStatement,
      identifiers,
      startIndex: match.index,
      endIndex: match.index + fullStatement.length,
    });
  }

  return imports;
}

/**
 * Check if an identifier is used in the code outside of import statements.
 * We look for the identifier as a whole word, excluding the import lines themselves.
 */
function isIdentifierUsed(identifier, content, importStatements) {
  if (!identifier) return true;

  // Remove all import statements from the content for analysis
  let codeWithoutImports = content;
  // Work backwards to preserve indices
  const sortedImports = [...importStatements].sort(
    (a, b) => b.startIndex - a.startIndex,
  );
  for (const imp of sortedImports) {
    codeWithoutImports =
      codeWithoutImports.slice(0, imp.startIndex) +
      ' '.repeat(imp.endIndex - imp.startIndex) +
      codeWithoutImports.slice(imp.endIndex);
  }

  // Check if identifier is used as a word boundary match
  const regex = new RegExp(`\\b${escapeRegex(identifier)}\\b`);
  return regex.test(codeWithoutImports);
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Rebuild an import statement removing specific identifiers.
 */
function rebuildImport(importObj, usedIdentifiers) {
  const fullStatement = importObj.fullStatement.trim();

  // If no identifiers are used, remove the entire import
  if (usedIdentifiers.length === 0) {
    // Check if this is a side-effect import (import 'something')
    const sideEffectMatch = fullStatement.match(
      /^import\s+['"][^'"]+['"]\s*;?$/,
    );
    if (sideEffectMatch) {
      return fullStatement; // Keep side-effect imports
    }
    return null; // Remove entirely
  }

  // If all identifiers are used, keep as is
  if (usedIdentifiers.length === importObj.identifiers.length) {
    return fullStatement;
  }

  // Need to reconstruct

  // Extract the module path
  const moduleMatch = fullStatement.match(/from\s+(['"][^'"]+['"])/);
  if (!moduleMatch) return fullStatement; // Can't parse, keep as is

  const modulePath = moduleMatch[1];

  // Determine default and named
  const originalDefault = fullStatement.match(
    /import\s+(?:type\s+)?(\w+)\s*(?:,|\s+from)/,
  );
  const originalNamed = fullStatement.match(/\{([^}]*)\}/);
  const originalNamespace = fullStatement.match(/\*\s+as\s+(\w+)/);

  let hasDefault =
    originalDefault && usedIdentifiers.includes(originalDefault[1]);
  let hasNamespace =
    originalNamespace && usedIdentifiers.includes(originalNamespace[1]);

  const usedNamed = originalNamed
    ? originalNamed[1]
        .split(',')
        .map(s => s.trim())
        .filter(s => {
          const parts = s.split(/\s+as\s+/);
          const alias = parts.length > 1 ? parts[1].trim() : parts[0].trim();
          return usedIdentifiers.includes(alias);
        })
    : [];

  // Detect leading whitespace
  const leadingWhitespace = importObj.fullStatement.match(/^(\s*)/)?.[1] || '';

  // Detect if type import
  const isTypeImport = /import\s+type\s+/.test(fullStatement);
  const typeKeyword = isTypeImport ? 'type ' : '';

  let result = `${leadingWhitespace}import ${typeKeyword}`;

  if (hasDefault) {
    result += originalDefault[1];
    if (usedNamed.length > 0) {
      result += ', ';
    } else {
      result += ' ';
    }
  }

  if (hasNamespace) {
    result += `* as ${originalNamespace[1]} `;
  }

  if (usedNamed.length > 0) {
    result += `{${usedNamed.join(', ')}} `;
  }

  result += `from ${modulePath};`;

  return result;
}

/**
 * Remove console.log/warn/error/info/debug statements from code.
 */
function removeConsoleStatements(content) {
  // Match console.log(...), console.warn(...), etc. across multiple lines
  // This handles nested parentheses up to 3 levels deep
  const consoleRegex =
    /^[ \t]*console\.(log|warn|error|info|debug)\s*\([^)]*(?:\([^)]*(?:\([^)]*\)[^)]*)*\)[^)]*)*\)\s*;?\s*\n?/gm;
  return content.replace(consoleRegex, '');
}

// ─── Main Process ───────────────────────────────────────────────────────────

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const imports = parseImports(content);
  const results = {
    filePath: path.relative(__dirname, filePath),
    unusedImports: [],
    removedConsole: 0,
    modified: false,
  };

  let newContent = content;
  const importsToRemoveOrModify = [];

  for (const imp of imports) {
    if (imp.identifiers.length === 0) {
      // Side-effect import, keep it
      continue;
    }

    const usedIdentifiers = imp.identifiers.filter(id =>
      isIdentifierUsed(id, content, imports),
    );
    const unusedIdentifiers = imp.identifiers.filter(
      id => !usedIdentifiers.includes(id),
    );

    if (unusedIdentifiers.length > 0) {
      results.unusedImports.push(...unusedIdentifiers);
      importsToRemoveOrModify.push({
        original: imp,
        usedIdentifiers,
      });
    }
  }

  // Apply import fixes (work backwards to preserve indices)
  if (importsToRemoveOrModify.length > 0) {
    const sorted = [...importsToRemoveOrModify].sort(
      (a, b) => b.original.startIndex - a.original.startIndex,
    );

    for (const {original, usedIdentifiers} of sorted) {
      const rebuilt = rebuildImport(original, usedIdentifiers);
      if (rebuilt === null) {
        // Remove the entire line (including trailing newline)
        let endIdx = original.endIndex;
        if (newContent[endIdx] === '\n') endIdx++;
        newContent =
          newContent.slice(0, original.startIndex) +
          newContent.slice(endIdx);
      } else if (rebuilt !== original.fullStatement.trim()) {
        newContent =
          newContent.slice(0, original.startIndex) +
          rebuilt +
          newContent.slice(original.endIndex);
      }
    }
    results.modified = true;
  }

  // Remove console statements
  if (REMOVE_CONSOLE) {
    const beforeLen = (newContent.match(/console\.(log|warn|error|info|debug)\s*\(/g) || []).length;
    if (beforeLen > 0) {
      newContent = removeConsoleStatements(newContent);
      results.removedConsole = beforeLen;
      results.modified = true;
    }
  }

  // Write changes
  if (FIX_MODE && results.modified) {
    fs.writeFileSync(filePath, newContent, 'utf8');
  }

  return results;
}

/**
 * Detect files that export components/functions but are never imported anywhere.
 */
function findUnusedFiles(allFiles) {
  // Build a map of what each file exports (by filename)
  const fileBasenames = new Map();
  for (const file of allFiles) {
    const basename = path.basename(file, path.extname(file));
    if (!fileBasenames.has(basename)) {
      fileBasenames.set(basename, []);
    }
    fileBasenames.get(basename).push(file);
  }

  // Collect all import sources across all files + root files
  const allSources = new Set();
  const filesToScan = [...allFiles, ...ROOT_FILES.filter(f => fs.existsSync(f))];

  for (const file of filesToScan) {
    const content = fs.readFileSync(file, 'utf8');

    // ES imports
    const esMatches = content.matchAll(/from\s+['"]([^'"]+)['"]/g);
    for (const m of esMatches) {
      const source = m[1];
      const basename = path.basename(source).replace(/\.[^.]+$/, '');
      allSources.add(basename);
      // Also add the full resolved path basename
      allSources.add(source);
    }

    // require() calls
    const reqMatches = content.matchAll(/require\s*\(\s*['"]([^'"]+)['"]\s*\)/g);
    for (const m of reqMatches) {
      const source = m[1];
      const basename = path.basename(source).replace(/\.[^.]+$/, '');
      allSources.add(basename);
      allSources.add(source);
    }
  }

  // Find files that are never imported
  const unusedFiles = [];
  const skipFiles = new Set(['index', 'App', 'RootNavigator', 'MainTabNavigator']);

  for (const file of allFiles) {
    const basename = path.basename(file, path.extname(file));

    // Skip entry points and navigation files
    if (skipFiles.has(basename)) continue;

    // Check if this file's basename appears in any import
    if (!allSources.has(basename)) {
      unusedFiles.push(path.relative(__dirname, file));
    }
  }

  return unusedFiles;
}

// ─── Run ────────────────────────────────────────────────────────────────────

console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║            🧹  KapraDaily Codebase Cleanup                 ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');
console.log(`  Mode: ${FIX_MODE ? '🔧 FIX (applying changes)' : '🔍 DRY RUN (report only)'}`);
console.log(`  Console removal: ${REMOVE_CONSOLE ? '✅ Enabled' : '❌ Disabled (use --no-console to enable)'}`);
console.log('');

const allFiles = getAllFiles(SRC_DIR);
// Also include root-level files
for (const rf of ROOT_FILES) {
  if (fs.existsSync(rf)) allFiles.push(rf);
}

let totalUnusedImports = 0;
let totalConsoleRemoved = 0;
let totalFilesModified = 0;
const allResults = [];

for (const file of allFiles) {
  const result = processFile(file);
  if (result.unusedImports.length > 0 || result.removedConsole > 0) {
    allResults.push(result);
    totalUnusedImports += result.unusedImports.length;
    totalConsoleRemoved += result.removedConsole;
    if (result.modified) totalFilesModified++;
  }
}

// ─── Report: Unused Imports ─────────────────────────────────────────────────

if (allResults.some(r => r.unusedImports.length > 0)) {
  console.log('┌──────────────────────────────────────────────────────────────┐');
  console.log('│  📦 Unused Imports                                          │');
  console.log('└──────────────────────────────────────────────────────────────┘\n');

  for (const result of allResults) {
    if (result.unusedImports.length === 0) continue;
    console.log(`  📄 ${result.filePath}`);
    for (const imp of result.unusedImports) {
      console.log(`     ❌ ${imp}`);
    }
    console.log('');
  }
} else {
  console.log('  ✅ No unused imports found!\n');
}

// ─── Report: Console Statements ─────────────────────────────────────────────

if (REMOVE_CONSOLE && totalConsoleRemoved > 0) {
  console.log('┌──────────────────────────────────────────────────────────────┐');
  console.log('│  🖥️  Console Statements                                     │');
  console.log('└──────────────────────────────────────────────────────────────┘\n');

  for (const result of allResults) {
    if (result.removedConsole === 0) continue;
    console.log(`  📄 ${result.filePath} — ${result.removedConsole} statement(s)`);
  }
  console.log('');
}

// ─── Report: Unused Files ───────────────────────────────────────────────────

console.log('┌──────────────────────────────────────────────────────────────┐');
console.log('│  📁 Potentially Unused Files (never imported)               │');
console.log('└──────────────────────────────────────────────────────────────┘\n');

const unusedFiles = findUnusedFiles(getAllFiles(SRC_DIR));
if (unusedFiles.length > 0) {
  for (const f of unusedFiles) {
    console.log(`  ⚠️  ${f}`);
  }
  console.log(
    '\n  ℹ️  Review these files manually before deleting — they may be used dynamically.\n',
  );
} else {
  console.log('  ✅ No unused files detected!\n');
}

// ─── Summary ────────────────────────────────────────────────────────────────

console.log('═══════════════════════════════════════════════════════════════');
console.log('  📊 Summary');
console.log('───────────────────────────────────────────────────────────────');
console.log(`  Unused imports found:      ${totalUnusedImports}`);
if (REMOVE_CONSOLE) {
  console.log(`  Console statements found:  ${totalConsoleRemoved}`);
}
console.log(`  Potentially unused files:  ${unusedFiles.length}`);
console.log(`  Files ${FIX_MODE ? 'modified' : 'to modify'}:          ${totalFilesModified}`);
console.log('═══════════════════════════════════════════════════════════════');

if (!FIX_MODE && (totalUnusedImports > 0 || totalConsoleRemoved > 0)) {
  console.log(
    '\n  💡 Run with --fix to apply changes:',
  );
  console.log('     node cleanup-unused.js --fix');
  console.log('     node cleanup-unused.js --fix --no-console\n');
}

if (FIX_MODE) {
  console.log(`\n  ✅ Done! ${totalFilesModified} file(s) updated.\n`);
}
