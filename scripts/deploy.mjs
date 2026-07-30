// Deploys the built site in dist/ to the webhost over FTP.
//
// Credentials come from .env (gitignored). Run `npm run deploy` to build first,
// or `node scripts/deploy.mjs` to upload whatever is already in dist/.
//
// Flags:
//   --dry-run   list what would be uploaded/deleted/removed, change nothing
//   --no-prune  keep remote files that are absent from dist/
//
// Pruning also removes directories left empty, so --dry-run reports those too;
// paths in PROTECTED below are never pruned.

import { readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { Client } from 'basic-ftp';
import 'dotenv/config';

const LOCAL_DIR = path.resolve(import.meta.dirname, '..', 'dist');

// Never ship these to the webhost.
const IGNORED = new Set(['.DS_Store', 'Thumbs.db', '.git']);

// Remote paths that are host infrastructure rather than site content. dist/ has
// no counterpart for them, so pruning would otherwise delete them: `.well-known`
// holds the ACME challenge path Let's Encrypt writes to when renewing the TLS
// certificate, and removing it can break an unattended renewal.
const PROTECTED = ['.well-known'];

const isProtected = (remotePath) =>
  PROTECTED.some(
    (base) => remotePath === base || remotePath.startsWith(`${base}/`)
  );

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const prune = !args.includes('--no-prune');

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing ${name}. Copy .env.example to .env and fill it in.`);
    process.exit(1);
  }
  return value;
}

const config = {
  host: requireEnv('FTP_HOST'),
  user: requireEnv('FTP_USER'),
  password: requireEnv('FTP_PASSWORD'),
  port: Number(process.env.FTP_PORT ?? 21),
  // Plain FTP sends your password in the clear, so prefer FTPS when the host
  // supports it: set FTP_SECURE=true.
  secure: process.env.FTP_SECURE === 'true',
};

const remoteRoot = process.env.FTP_REMOTE_DIR ?? '/';

// Recursively collect file paths relative to dist/, so local and remote trees
// can be compared with plain string keys.
async function collectLocal(dir, prefix = '') {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (IGNORED.has(entry.name)) continue;
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...(await collectLocal(path.join(dir, entry.name), rel)));
    } else {
      files.push(rel);
    }
  }
  return files;
}

// Walk the remote tree beneath `dir`, returning dist-relative files and dirs.
async function collectRemote(client, dir, prefix = '') {
  const files = [];
  const dirs = [];
  let listing;
  try {
    listing = await client.list(dir);
  } catch {
    return { files, dirs }; // does not exist yet — nothing to prune
  }
  for (const entry of listing) {
    if (entry.name === '.' || entry.name === '..') continue;
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory) {
      dirs.push(rel);
      const nested = await collectRemote(client, `${dir}/${entry.name}`, rel);
      files.push(...nested.files);
      dirs.push(...nested.dirs);
    } else {
      files.push(rel);
    }
  }
  return { files, dirs };
}

async function main() {
  if (!existsSync(LOCAL_DIR)) {
    console.error('No dist/ directory. Run `npm run build` first.');
    process.exit(1);
  }

  const localFiles = await collectLocal(LOCAL_DIR);
  if (localFiles.length === 0) {
    console.error('dist/ is empty — refusing to deploy.');
    process.exit(1);
  }

  console.log(
    `${dryRun ? '[dry run] ' : ''}Deploying ${localFiles.length} files ` +
      `to ${config.user}@${config.host}:${remoteRoot}`
  );

  const client = new Client(30_000);
  client.ftp.verbose = process.env.FTP_VERBOSE === 'true';

  try {
    await client.access(config);

    // Work relative to the target directory from here on, so FTP_REMOTE_DIR can
    // be given as either an absolute or a host-relative path.
    await client.ensureDir(remoteRoot);
    const root = await client.pwd();

    const localSet = new Set(localFiles);
    const remote = await collectRemote(client, root);
    const stale = remote.files.filter(
      (file) => !localSet.has(file) && !isProtected(file)
    );

    // Directories that would be left holding none of our files, deepest first so
    // children are removed before their parents. Computed here rather than inside
    // the prune step so a dry run can report them: they are deletions too, and
    // omitting them understates what a real deploy does.
    const staleDirs = remote.dirs
      .filter(
        (dir) =>
          !isProtected(dir) &&
          !localFiles.some((file) => file.startsWith(`${dir}/`))
      )
      .sort((a, b) => b.split('/').length - a.split('/').length);

    if (dryRun) {
      for (const file of localFiles) console.log(`  upload  ${file}`);
      if (prune) {
        for (const file of stale) console.log(`  delete  ${file}`);
        // Flagged as "if empty" because removeDir is best-effort at prune time:
        // a directory still holding files we don't manage is left alone.
        for (const dir of staleDirs) console.log(`  rmdir   ${dir}/ (if empty)`);
      }
      console.log(
        `\n[dry run] ${localFiles.length} upload(s), ` +
          `${prune ? stale.length : 0} deletion(s), ` +
          `${prune ? staleDirs.length : 0} directory removal(s). ` +
          `Nothing was changed.`
      );
      return;
    }

    const ensured = new Set(['.']);
    for (const file of localFiles) {
      const dir = path.posix.dirname(file);
      if (!ensured.has(dir)) {
        await client.ensureDir(`${root}/${dir}`);
        ensured.add(dir);
      }
      await client.uploadFrom(path.join(LOCAL_DIR, file), `${root}/${file}`);
      console.log(`  uploaded ${file}`);
    }

    // Gated on `prune` alone, not on there being stale files: directories can
    // need removing when no file does, and the dry run above already reported
    // them — the two runs must agree.
    if (prune && (stale.length > 0 || staleDirs.length > 0)) {
      if (stale.length > 0) console.log(`Pruning ${stale.length} stale file(s)…`);
      for (const file of stale) {
        try {
          await client.remove(`${root}/${file}`);
          console.log(`  deleted ${file}`);
        } catch (err) {
          console.warn(`  could not delete ${file}: ${err.message}`);
        }
      }

      for (const dir of staleDirs) {
        try {
          await client.removeDir(`${root}/${dir}`);
          console.log(`  removed dir ${dir}`);
        } catch {
          // Not empty or already gone — leave it alone.
        }
      }
    }

    console.log('Deploy complete.');
  } finally {
    client.close();
  }
}

main().catch((err) => {
  console.error(`Deploy failed: ${err.message}`);
  process.exit(1);
});
