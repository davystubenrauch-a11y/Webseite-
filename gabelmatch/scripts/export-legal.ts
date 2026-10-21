/**
 * Exportiert Datenschutzerklärung und Impressum als Markdown nach store/legal/,
 * damit dieselben Texte auf einer Webseite veröffentlicht werden können.
 * Aufruf: npm run legal:export
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { LEGAL } from '../src/content/legal';

const dir = path.resolve(__dirname, '../store/legal');
mkdirSync(dir, { recursive: true });
for (const [kind, byLocale] of Object.entries(LEGAL)) {
  for (const [locale, doc] of Object.entries(byLocale)) {
    const md = [
      `# ${doc.title}`,
      '',
      `_${doc.updated}_`,
      '',
      ...doc.sections.flatMap((s) => [`## ${s.heading}`, '', ...s.paragraphs.flatMap((p) => [p.replace(/\n/g, '  \n'), ''])]),
    ].join('\n');
    const file = path.join(dir, `${kind}.${locale}.md`);
    writeFileSync(file, md);
    console.log('✓', path.relative(process.cwd(), file));
  }
}
