#!/usr/bin/env node

/**
 * Scaffolds a new screen folder under src/screens/<ScreenName>/ with:
 *   - <ScreenName>.js   (screen component)
 *   - use<ScreenName>.js (hook)
 *   - styles.js          (StyleSheet)
 *
 * Usage:
 *   node scripts/createScreen.js ScreenName
 *   npm run create-screen -- ScreenName
 */

const fs = require('fs');
const path = require('path');

const rawName = process.argv[2];

if (!rawName) {
  console.error('Usage: node scripts/createScreen.js <ScreenName>');
  process.exit(1);
}

const pascalName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
const screenName = pascalName.endsWith('Screen') ? pascalName : `${pascalName}Screen`;
const hookName = `use${screenName}`;

const screensDir = path.join(__dirname, '..', 'src', 'screens');
const targetDir = path.join(screensDir, screenName);

if (fs.existsSync(targetDir)) {
  console.error(`Folder already exists: ${targetDir}`);
  process.exit(1);
}

fs.mkdirSync(targetDir, { recursive: true });

const componentContent = `import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';
import { ${hookName} } from './${hookName}';

const ${screenName} = () => {
  const {} = ${hookName}();

  return (
    <View style={styles.container}>
      <Text>${screenName}</Text>
    </View>
  );
};

export default ${screenName};
`;

const hookContent = `export const ${hookName} = () => {
  return {};
};
`;

const stylesContent = `import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
`;

fs.writeFileSync(path.join(targetDir, `${screenName}.js`), componentContent);
fs.writeFileSync(path.join(targetDir, `${hookName}.js`), hookContent);
fs.writeFileSync(path.join(targetDir, 'styles.js'), stylesContent);

console.log(`Created src/screens/${screenName}/`);
console.log(`  ${screenName}.js`);
console.log(`  ${hookName}.js`);
console.log(`  styles.js`);
