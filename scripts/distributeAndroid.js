#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const androidDir = path.join(rootDir, 'android');
const gradleFile = path.join(androidDir, 'app', 'build.gradle');
const servicesFile = path.join(androidDir, 'app', 'google-services.json');

const args = process.argv.slice(2);

const hasFlag = name => args.includes(name);

const valueOf = name => {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
};

const fail = message => {
  console.error(`\n${message}\n`);
  process.exit(1);
};

const readGradleValue = (source, key) => {
  const match = source.match(new RegExp(`${key}\\s+"?([^"\\s]+)"?`));
  return match ? match[1] : undefined;
};

const gradleSource = fs.readFileSync(gradleFile, 'utf8');
const applicationId = readGradleValue(gradleSource, 'applicationId');
const versionName = readGradleValue(gradleSource, 'versionName');
const versionCode = readGradleValue(gradleSource, 'versionCode');

const resolveAppId = () => {
  if (process.env.FIREBASE_ANDROID_APP_ID) {
    return process.env.FIREBASE_ANDROID_APP_ID;
  }

  const services = JSON.parse(fs.readFileSync(servicesFile, 'utf8'));
  const client = services.client.find(
    entry => entry.client_info.android_client_info.package_name === applicationId,
  );

  if (!client) {
    fail(
      `No client in google-services.json matches applicationId "${applicationId}".\n` +
        'Set FIREBASE_ANDROID_APP_ID to the App Distribution app id you want to upload to.',
    );
  }

  return client.client_info.mobilesdk_app_id;
};

const resolveCli = () => {
  const local = spawnSync('firebase', ['--version'], { stdio: 'ignore' });
  return local.status === 0
    ? { command: 'firebase', prefix: [] }
    : { command: 'npx', prefix: ['--yes', 'firebase-tools'] };
};

const runCli = (cli, cliArgs, options = {}) =>
  spawnSync(cli.command, [...cli.prefix, ...cliArgs], {
    cwd: rootDir,
    stdio: options.capture ? 'pipe' : 'inherit',
    encoding: 'utf8',
  });

const assertLoggedIn = cli => {
  const result = runCli(cli, ['login:list'], { capture: true });
  const output = `${result.stdout || ''}${result.stderr || ''}`;

  if (result.status !== 0 || /No authorized accounts/i.test(output)) {
    fail(
      'Not logged in to the Firebase CLI.\n' +
        `Run:  ${cli.command === 'firebase' ? 'firebase' : 'npx firebase-tools'} login`,
    );
  }
};

const gitValue = gitArgs => {
  try {
    return execFileSync('git', gitArgs, { cwd: rootDir, encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
};

const defaultNotes = () => {
  const branch = gitValue(['rev-parse', '--abbrev-ref', 'HEAD']);
  const subject = gitValue(['log', '-1', '--pretty=%h %s']);
  return `${versionName} (${versionCode}) — ${branch}\n${subject}`;
};

const buildArtifact = () => {
  const bundle = hasFlag('--aab');
  const task = bundle ? 'bundleRelease' : 'assembleRelease';
  const artifact = bundle
    ? path.join(androidDir, 'app', 'build', 'outputs', 'bundle', 'release', 'app-release.aab')
    : path.join(androidDir, 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk');

  if (!hasFlag('--no-build')) {
    console.log(`\n▸ ./gradlew ${task}\n`);
    const result = spawnSync('./gradlew', [task], { cwd: androidDir, stdio: 'inherit' });

    if (result.status !== 0) {
      fail(`Gradle ${task} failed.`);
    }
  }

  if (!fs.existsSync(artifact)) {
    fail(
      `Artifact not found: ${artifact}\n` +
        (hasFlag('--no-build') ? 'Drop --no-build to build it first.' : ''),
    );
  }

  return artifact;
};

const appId = resolveAppId();
const cli = resolveCli();

assertLoggedIn(cli);

const artifact = buildArtifact();
const notes = valueOf('--notes') || process.env.FIREBASE_RELEASE_NOTES || defaultNotes();
const groups = valueOf('--groups') || process.env.FIREBASE_TESTER_GROUPS;
const testers = valueOf('--testers') || process.env.FIREBASE_TESTERS;

const distributeArgs = ['appdistribution:distribute', artifact, '--app', appId, '--release-notes', notes];

if (groups) {
  distributeArgs.push('--groups', groups);
}

if (testers) {
  distributeArgs.push('--testers', testers);
}

if (!groups && !testers) {
  console.log('\n⚠ No tester groups or testers given — uploading without notifying anyone.');
  console.log('  Pass --groups <group-alias> or set FIREBASE_TESTER_GROUPS to distribute.\n');
}

console.log(`\n▸ Uploading ${path.basename(artifact)} to ${appId}\n`);

const upload = runCli(cli, distributeArgs);

if (upload.status !== 0) {
  fail('Upload to Firebase App Distribution failed.');
}

console.log('\n✓ Distributed.\n');
