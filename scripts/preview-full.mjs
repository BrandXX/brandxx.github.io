import { spawn, execFileSync } from 'node:child_process';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const ports = [Number(process.env.PREVIEW_PORT || 4326), Number(process.env.ORIGINAL_PORT || 4327)];
if (ports[0] === ports[1] || ports.some(port => !Number.isInteger(port) || port < 1024 || port > 65535)) {
  throw new Error('Choose two distinct ports between 1024 and 65535.');
}
for (const port of ports) {
  await new Promise((resolve, reject) => {
    const server = createServer();
    server.once('error', () => reject(new Error(`Port ${port} is in use. Set PREVIEW_PORT and ORIGINAL_PORT to unused ports; no existing process was stopped.`)));
    server.listen(port, '127.0.0.1', () => server.close(resolve));
  });
}
if (!process.argv.includes('--no-build')) execFileSync(process.execPath, ['scripts/build-preview.mjs'], { cwd: root, stdio: 'inherit' });
const children = ['themed', 'original'].map((name, index) => spawn(process.execPath,
  ['node_modules/astro/astro.js', 'preview', '--outDir', `.staging/${name}`, '--host', '127.0.0.1', '--port', String(ports[index])],
  { cwd: root, stdio: 'inherit' }));
let stopping = false;
function stop(code) {
  if (stopping) return;
  stopping = true;
  process.exitCode = code;
  for (const child of children) if (child.exitCode === null) child.kill('SIGTERM');
}
children.forEach(child => {
  child.on('error', error => { console.error(error); stop(1); });
  child.on('exit', code => { if (!stopping) stop(code || 1); });
});
process.on('SIGINT', () => stop(0));
process.on('SIGTERM', () => stop(0));
console.log(`\nThemed site: http://127.0.0.1:${ports[0]}/\nOriginal document styling: http://127.0.0.1:${ports[1]}/\nLocal only. Keep this process running; Ctrl+C stops both previews.\n`);
