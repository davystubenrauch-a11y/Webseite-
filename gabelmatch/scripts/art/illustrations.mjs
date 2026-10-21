// Vektor-Quellen der Kategorie-Illustrationen, des App-Icons und des Splashscreens.
// Gerendert werden sie mit scripts/art/render.mjs (benötigt Playwright + Chromium).

const W = 1200;
const H = 900;

const CONFETTI = [
  [130, 140, 10], [250, 90, 6], [1040, 120, 9], [1100, 260, 6], [90, 420, 7], [1110, 520, 8],
  [180, 760, 9], [1010, 790, 7], [320, 830, 5], [880, 70, 5], [60, 640, 5], [1150, 700, 5],
];

function frame(c1, c2, body) {
  const dots = CONFETTI.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity="0.35"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff" stop-opacity="0.35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="600" cy="470" r="420" fill="url(#glow)"/>
  ${dots}
  <ellipse cx="600" cy="790" rx="360" ry="34" fill="#000" opacity="0.12"/>
  ${body}
</svg>`;
}

// Schale in 3/4-Ansicht; `fill` = Inhalt oberhalb des Rands
function bowl(color, inner, fill) {
  return `
  <path d="M250 480 Q260 770 600 775 Q940 770 950 480 Z" fill="${color}"/>
  <path d="M250 480 Q260 770 600 775 Q600 760 600 760 Q330 740 300 480 Z" fill="#000" opacity="0.06"/>
  <ellipse cx="600" cy="480" rx="350" ry="78" fill="${inner}"/>
  ${fill}
  <path d="M250 480 A350 78 0 0 0 950 480" fill="none" stroke="#fff" stroke-width="10" opacity="0.55"/>`;
}

const leaf = (x, y, rot, color = '#3E9B4F') =>
  `<path transform="translate(${x} ${y}) rotate(${rot})" d="M0 0 C30 -40 90 -40 120 0 C90 40 30 40 0 0 Z" fill="${color}"/>
   <path transform="translate(${x} ${y}) rotate(${rot})" d="M8 0 L110 0" stroke="#fff" stroke-opacity="0.35" stroke-width="4"/>`;

export const categories = {
  pasta: frame('#F7B851', '#EF8B3B', `
    ${bowl('#FFFFFF', '#FBE6C2', `
      <g fill="none" stroke="#F6C453" stroke-width="16" stroke-linecap="round">
        <path d="M380 470 C420 360 560 330 620 380 C680 430 560 470 520 430 C480 390 600 330 700 360 C800 390 820 450 760 480"/>
        <path d="M420 490 C440 410 540 380 600 410 C680 450 640 500 580 480"/>
        <path d="M640 470 C660 400 760 390 800 440"/>
      </g>
      <path d="M470 400 C500 330 640 320 690 380 C720 420 650 450 580 440 C520 432 450 440 470 400 Z" fill="#E2442F"/>
      <circle cx="560" cy="380" r="16" fill="#C8341F"/><circle cx="630" cy="400" r="12" fill="#C8341F"/>
      ${leaf(600, 350, -30)}${leaf(560, 360, 200, '#4FAF5B')}`)}
    <g transform="translate(905 230) rotate(18)">
      <rect x="-14" y="120" width="28" height="330" rx="14" fill="#E9E4DE"/>
      <path d="M-50 0 V90 Q-50 130 0 130 Q50 130 50 90 V0" fill="none" stroke="#E9E4DE" stroke-width="18" stroke-linecap="round"/>
      <path d="M-17 0 V100 M17 0 V100" stroke="#E9E4DE" stroke-width="16" stroke-linecap="round"/>
    </g>`),

  reis_getreide: frame('#A8CF8E', '#5FA36B', `
    ${bowl('#2F6E8F', '#FFF8EA', `
      <path d="M330 480 C340 360 470 300 600 300 C730 300 860 360 870 480 Z" fill="#FFFDF7"/>
      ${Array.from({ length: 34 }, (_, i) => {
        const x = 380 + ((i * 97) % 440); const y = 340 + ((i * 53) % 130);
        return `<ellipse cx="${x}" cy="${y}" rx="11" ry="6" transform="rotate(${(i * 37) % 180} ${x} ${y})" fill="#EDE3CF"/>`;
      }).join('')}
      <circle cx="700" cy="380" r="40" fill="#F08A4B"/><circle cx="690" cy="372" r="12" fill="#fff" opacity="0.4"/>
      ${leaf(470, 360, -20, '#3E9B4F')}`)}
    <g stroke-linecap="round"><path d="M820 180 L640 420" stroke="#8A5A3B" stroke-width="18"/><path d="M880 210 L690 440" stroke="#A06B47" stroke-width="18"/></g>`),

  suppen_eintoepfe: frame('#F28A5B', '#D9542E', `
    <g fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round" opacity="0.75">
      <path d="M480 300 C440 250 520 220 480 160"/><path d="M600 290 C560 230 640 200 600 130"/><path d="M720 300 C680 250 760 220 720 160"/>
    </g>
    <rect x="190" y="430" width="90" height="40" rx="20" fill="#2B2B33"/><rect x="920" y="430" width="90" height="40" rx="20" fill="#2B2B33"/>
    <path d="M260 400 H940 V690 Q940 770 860 770 H340 Q260 770 260 690 Z" fill="#3A3A45"/>
    <rect x="260" y="400" width="680" height="34" fill="#4A4A57"/>
    <ellipse cx="600" cy="400" rx="340" ry="56" fill="#E8833A"/>
    <circle cx="500" cy="395" r="22" fill="#F6C453"/><circle cx="660" cy="410" r="18" fill="#F6C453"/>
    <rect x="560" y="380" width="44" height="22" rx="8" fill="#E2442F"/><rect x="720" y="384" width="38" height="20" rx="8" fill="#E2442F"/>
    ${leaf(400, 400, -10, '#3E9B4F')}
    <path d="M300 500 Q600 540 900 500" stroke="#fff" stroke-width="8" opacity="0.15" fill="none"/>`),

  salate: frame('#9DD68A', '#4FAF5B', `
    ${bowl('#FFFFFF', '#E9F5E1', `
      ${leaf(330, 440, -40, '#5DBB63')}${leaf(400, 400, -70, '#3E9B4F')}${leaf(560, 330, -100, '#6CC46F')}
      ${leaf(700, 360, -130, '#3E9B4F')}${leaf(800, 430, -160, '#5DBB63')}${leaf(520, 420, -20, '#2F8A44')}
      <circle cx="470" cy="420" r="38" fill="#E2442F"/><circle cx="458" cy="408" r="10" fill="#fff" opacity="0.5"/>
      <circle cx="720" cy="430" r="34" fill="#E2442F"/><circle cx="710" cy="420" r="9" fill="#fff" opacity="0.5"/>
      <rect x="580" y="400" width="70" height="56" rx="10" fill="#FFF7E6"/>
      <circle cx="630" cy="350" r="24" fill="#2B2B33"/><circle cx="410" cy="360" r="20" fill="#2B2B33"/>
      <path d="M640 455 A40 40 0 0 1 720 455" fill="#9FD38A" stroke="#6AB35B" stroke-width="6"/>`)}`),

  ofen_auflauf: frame('#E59A6B', '#B85A35', `
    <rect x="170" y="440" width="80" height="44" rx="22" fill="#7E3B22"/><rect x="950" y="440" width="80" height="44" rx="22" fill="#7E3B22"/>
    <path d="M230 420 H970 L930 720 Q925 760 885 760 H315 Q275 760 270 720 Z" fill="#A9492B"/>
    <path d="M230 420 H970 L962 470 H238 Z" fill="#C25A37"/>
    <path d="M250 430 Q320 360 400 410 Q470 350 540 405 Q610 345 690 400 Q760 350 830 405 Q900 360 950 430 Z" fill="#F6C453"/>
    <g fill="#E39A32"><circle cx="360" cy="410" r="14"/><circle cx="520" cy="392" r="18"/><circle cx="700" cy="404" r="15"/><circle cx="860" cy="410" r="12"/><circle cx="620" cy="420" r="10"/></g>
    ${leaf(440, 390, -25, '#3E9B4F')}${leaf(760, 390, 200, '#4FAF5B')}
    <g fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity="0.6"><path d="M480 320 C450 280 510 260 480 220"/><path d="M720 320 C690 280 750 260 720 220"/></g>`),

  pfanne_wok: frame('#F27C6B', '#C93F3A', `
    <path d="M880 470 L1120 380" stroke="#2B2B33" stroke-width="40" stroke-linecap="round"/>
    <ellipse cx="560" cy="500" rx="360" ry="150" fill="#2B2B33"/>
    <ellipse cx="560" cy="480" rx="330" ry="120" fill="#3D3D49"/>
    <g>
      <rect x="380" y="430" width="120" height="34" rx="14" fill="#F6C453" transform="rotate(-15 440 447)"/>
      <rect x="560" y="410" width="130" height="30" rx="12" fill="#E2442F" transform="rotate(10 625 425)"/>
      <rect x="620" y="480" width="110" height="30" rx="12" fill="#F28C3B" transform="rotate(-25 675 495)"/>
      <rect x="430" y="500" width="120" height="30" rx="12" fill="#5DBB63" transform="rotate(20 490 515)"/>
      <circle cx="540" cy="470" r="26" fill="#FFF3DA"/><circle cx="700" cy="440" r="20" fill="#FFF3DA"/><circle cx="420" cy="480" r="18" fill="#FFF3DA"/>
      ${leaf(740, 520, 200, '#3E9B4F')}
    </g>
    <g fill="#fff" opacity="0.8"><circle cx="460" cy="360" r="8"/><circle cx="640" cy="330" r="6"/><circle cx="760" cy="370" r="7"/></g>`),

  kartoffeln: frame('#E8C27A', '#C08B45', `
    ${bowl('#7A4E2D', '#5E3B22', `
      <ellipse cx="460" cy="430" rx="110" ry="80" fill="#E3B25E" transform="rotate(-15 460 430)"/>
      <ellipse cx="660" cy="410" rx="120" ry="86" fill="#D9A24E" transform="rotate(12 660 410)"/>
      <ellipse cx="560" cy="350" rx="100" ry="74" fill="#EBC06E"/>
      <ellipse cx="780" cy="460" rx="90" ry="64" fill="#E3B25E"/>
      <g fill="#B7843A"><circle cx="430" cy="410" r="7"/><circle cx="500" cy="450" r="6"/><circle cx="640" cy="390" r="7"/><circle cx="700" cy="430" r="6"/><circle cx="560" cy="330" r="6"/><circle cx="790" cy="450" r="6"/></g>
      <rect x="520" y="300" width="70" height="40" rx="10" fill="#FFF3B8"/>
      ${leaf(380, 380, -60, '#3E9B4F')}${leaf(840, 400, 230, '#4FAF5B')}`)}`),

  brot_snacks: frame('#F2CF8C', '#D79A4A', `
    <path d="M240 700 Q240 420 600 400 Q960 420 960 700 Q960 760 900 760 H300 Q240 760 240 700 Z" fill="#C9813E"/>
    <path d="M270 690 Q270 450 600 432 Q930 450 930 690" fill="#E3A35A"/>
    <g stroke="#F6D49A" stroke-width="20" stroke-linecap="round" fill="none"><path d="M380 520 Q420 470 470 500"/><path d="M560 490 Q600 440 650 470"/><path d="M740 520 Q780 470 830 500"/></g>
    <path d="M700 260 L960 330 L760 520 Z" fill="#F6C453"/>
    <path d="M700 260 L960 330 L950 360 L700 290 Z" fill="#D9853B"/>
    <circle cx="790" cy="340" r="24" fill="#E2442F"/><circle cx="860" cy="380" r="18" fill="#E2442F"/><circle cx="790" cy="420" r="16" fill="#E2442F"/>
    ${leaf(820, 300, 20, '#3E9B4F')}`),

  fruehstueck_suesses: frame('#F4A6B8', '#D86A8E', `
    <ellipse cx="600" cy="720" rx="380" ry="70" fill="#FFFFFF"/>
    <g>
      <ellipse cx="600" cy="660" rx="260" ry="56" fill="#D99A4E"/><ellipse cx="600" cy="640" rx="260" ry="56" fill="#F0C27A"/>
      <ellipse cx="600" cy="580" rx="250" ry="54" fill="#D99A4E"/><ellipse cx="600" cy="560" rx="250" ry="54" fill="#F0C27A"/>
      <ellipse cx="600" cy="500" rx="240" ry="52" fill="#D99A4E"/><ellipse cx="600" cy="480" rx="240" ry="52" fill="#F3CB86"/>
    </g>
    <path d="M400 470 Q600 420 800 470 Q790 520 760 540 Q740 580 720 560 Q700 520 640 520 Q600 600 560 520 Q500 520 470 560 Q440 590 420 530 Z" fill="#A2541D" opacity="0.85"/>
    <rect x="555" y="410" width="90" height="60" rx="12" fill="#FFF3B8"/>
    <circle cx="500" cy="440" r="28" fill="#C2185B"/><circle cx="700" cy="445" r="24" fill="#7B4BB3"/><circle cx="660" cy="410" r="20" fill="#C2185B"/>
    ${leaf(520, 400, -40, '#3E9B4F')}`),
};

// App-Icon: Gabel, deren Zinken ein Herz umschließen – „Gabel“ + „Match“
const iconArt = (bg, fg, heart) => `
  <g transform="translate(512 540)">
    <path d="M-150 -330 V-120 Q-150 0 -40 20 V300 Q-40 340 0 340 Q40 340 40 300 V20 Q150 0 150 -120 V-330" fill="none" stroke="${fg}" stroke-width="64" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-50 -330 V-170 M50 -330 V-170" stroke="${fg}" stroke-width="56" stroke-linecap="round"/>
    <path d="M0 -60 C-40 -110 -110 -80 -95 -25 C-85 15 -30 45 0 75 C30 45 85 15 95 -25 C110 -80 40 -110 0 -60 Z" fill="${heart}" transform="translate(0 -40)"/>
  </g>`;

export const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F0603F"/><stop offset="1" stop-color="#C7341F"/></linearGradient></defs>
  <rect width="1024" height="1024" fill="url(#g)"/>
  ${iconArt('#D4402A', '#FFF8F1', '#FFC94D')}
</svg>`;

// Android Adaptive Icon: Vordergrund mit Sicherheitsabstand (inneres 66 %), transparenter Hintergrund
export const adaptiveForeground = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <g transform="translate(512 512) scale(0.62) translate(-512 -512)">${iconArt('', '#FFF8F1', '#FFC94D')}</g>
</svg>`;

export const adaptiveBackground = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F0603F"/><stop offset="1" stop-color="#C7341F"/></linearGradient></defs>
  <rect width="1024" height="1024" fill="url(#g)"/>
</svg>`;

export const adaptiveMonochrome = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <g transform="translate(512 512) scale(0.62) translate(-512 -512)">${iconArt('', '#000000', '#000000')}</g>
</svg>`;

// Splash: Icon-Motiv als abgerundete Kachel (transparenter Rand, Hintergrundfarbe kommt aus app.json)
export const splash = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F0603F"/><stop offset="1" stop-color="#C7341F"/></linearGradient></defs>
  <rect x="112" y="112" width="800" height="800" rx="200" fill="url(#g)"/>
  <g transform="translate(512 512) scale(0.7) translate(-512 -512)">${iconArt('', '#FFF8F1', '#FFC94D')}</g>
</svg>`;

export const favicon = icon;

// Android-Benachrichtigungssymbol: weiße Silhouette auf transparentem Grund
export const notificationIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 1024 1024">
  <g transform="translate(512 512) scale(0.85) translate(-512 -540)">${iconArt('', '#FFFFFF', '#FFFFFF')}</g>
</svg>`;
