/** Prüft die Zeichenlimits der Store-Texte in store/listing.md. Aufruf: npm run store:check */
import { readFileSync } from 'node:fs';
import path from 'node:path';

const md = readFileSync(path.resolve(__dirname, '../store/listing.md'), 'utf8');
let failed = false;
const check = (label: string, value: string, max: number) => {
  const ok = [...value].length <= max;
  if (!ok) failed = true;
  console.log(`${ok ? '✓' : '✗'} ${label}: ${[...value].length}/${max}`);
};

for (const m of md.matchAll(/\*\*(Name|App-Name|App name|Untertitel|Subtitle|Kurzbeschreibung|Short description|Keywords)\*\*[^`\n]*\n?`([^`]+)`/g)) {
  const max = /Kurz|Short/.test(m[1]) ? 80 : m[1] === 'Keywords' ? 100 : 30;
  check(m[1], m[2], max);
}
for (const m of md.matchAll(/\*\*(Werbetext|Promotional text)\*\* \(max\. 170\):\n> (.+)/g)) check(m[1], m[2], 170);
for (const m of md.matchAll(/\*\*(Beschreibung|Description)\*\* \(max\. 4000\):\n\n([\s\S]+?)\n\n\*\*/g)) check(m[1], m[2], 4000);
process.exit(failed ? 1 : 0);
