import type { RecipeDef } from '../types';

export const fruehstueck: RecipeDef[] = [
  {
    slug: 'pfannkuchen',
    title: 'Pfannkuchen',
    description: 'Dünne, goldene Pfannkuchen – süß mit Zimtzucker oder herzhaft gefüllt.',
    category: 'fruehstueck_suesses', diet: 'vegetarisch', minutes: 25, difficulty: 1, servings: 3,
    ingredients: [
      ['mehl', 200, 'g'], ['milch', 400, 'ml'], ['eier', 3], ['zucker', 1, 'EL'], ['salz', 1, 'Prise'], ['butter', 30, 'g'],
      ['zimt', 1, 'TL'], ['apfelmus', 200, 'g'],
    ],
    steps: [
      'Mehl, Milch, Eier, Zucker und Salz zu einem glatten Teig verquirlen und 10 Minuten ruhen lassen.',
      'Etwas Butter in einer Pfanne erhitzen, eine Kelle Teig hineingeben und durch Schwenken verteilen.',
      'Von jeder Seite 1–2 Minuten goldbraun backen. So fortfahren, bis der Teig aufgebraucht ist.',
      'Mit Zimtzucker und Apfelmus servieren.',
    ],
  },
  {
    slug: 'kaiserschmarrn',
    title: 'Kaiserschmarrn',
    description: 'Fluffig, karamellisiert und in Stücke gerissen – mit Puderzucker und Apfelmus.',
    category: 'fruehstueck_suesses', diet: 'vegetarisch', minutes: 30, difficulty: 2, servings: 2,
    ingredients: [
      ['eier', 4], ['mehl', 150, 'g'], ['milch', 250, 'ml'], ['zucker', 2, 'EL'], ['vanillezucker', 1, 'Pck.'],
      ['rosinen', 30, 'g', 'optional'], ['butter', 40, 'g'], ['puderzucker', 2, 'EL'], ['apfelmus', 200, 'g'], ['salz', 1, 'Prise'],
    ],
    steps: [
      'Eier trennen. Eigelb mit Mehl, Milch, Vanillezucker und Salz glatt rühren. Eiweiß mit 1 EL Zucker steif schlagen und unterheben.',
      'Die Hälfte der Butter in einer großen Pfanne schmelzen, Teig hineingeben, Rosinen darüberstreuen und bei mittlerer Hitze 5 Minuten stocken lassen.',
      'Vierteln, wenden und weitere 3 Minuten backen. Mit zwei Gabeln in Stücke reißen.',
      'Restliche Butter und Zucker zugeben und unter Wenden karamellisieren. Mit Puderzucker und Apfelmus servieren.',
    ],
  },
  {
    slug: 'milchreis-zimt',
    title: 'Milchreis mit Zimt und Kirschen',
    description: 'Cremig gekocht, mit Zimtzucker und warmen Sauerkirschen.',
    category: 'fruehstueck_suesses', diet: 'vegetarisch', minutes: 40, difficulty: 1, servings: 3,
    ingredients: [
      ['milchreis', 200, 'g'], ['milch', 1, 'l'], ['zucker', 3, 'EL'], ['vanillezucker', 1, 'Pck.'], ['butter', 1, 'EL'],
      ['salz', 1, 'Prise'], ['zimt', 1, 'TL'], ['sauerkirschen', 1, 'Glas'], ['speisestaerke', 1, 'EL'],
    ],
    steps: [
      'Milch mit Butter, 2 EL Zucker, Vanillezucker und Salz aufkochen. Reis einrühren.',
      'Bei kleinster Hitze 30 Minuten quellen lassen, gelegentlich umrühren.',
      'Kirschen mit Saft erhitzen, mit in wenig Wasser angerührter Stärke binden.',
      'Restlichen Zucker mit Zimt mischen und den Milchreis mit Zimtzucker und Kirschen servieren.',
    ],
  },
  {
    slug: 'arme-ritter',
    title: 'Arme Ritter',
    description: 'In Eiermilch getränktes Brot, goldbraun gebraten – die beste Brotresteverwertung.',
    category: 'fruehstueck_suesses', diet: 'vegetarisch', minutes: 20, difficulty: 1, servings: 2,
    ingredients: [
      ['toastbrot', 6, 'Scheibe'], ['eier', 2], ['milch', 200, 'ml'], ['zucker', 2, 'EL'], ['zimt', 1, 'TL'],
      ['vanillezucker', 1, 'Pck.'], ['butter', 30, 'g'], ['beeren_tk', 200, 'g'],
    ],
    steps: [
      'Eier, Milch und Vanillezucker verquirlen. Zucker mit Zimt mischen.',
      'Brotscheiben kurz in der Eiermilch wenden.',
      'In Butter von jeder Seite 2–3 Minuten goldbraun braten.',
      'In Zimtzucker wenden und mit aufgetauten Beeren servieren.',
    ],
  },
  {
    slug: 'ruehrei-schnittlauch',
    title: 'Cremiges Rührei mit Schnittlauch',
    description: 'Langsam gegart, weich und cremig – dazu frisches Brot.',
    category: 'fruehstueck_suesses', diet: 'vegetarisch', minutes: 10, difficulty: 1, servings: 2,
    ingredients: [
      ['eier', 5], ['butter', 20, 'g'], ['milch', 2, 'EL'], ['schnittlauch', 0.5, 'Bund'], ['bauernbrot', 2, 'Scheibe'],
      ['tomate', 2], ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Eier mit Milch, Salz und Pfeffer verquirlen.',
      'Butter bei schwacher Hitze schmelzen, Eier zugeben und mit einem Spatel langsam zu großen, weichen Flocken schieben.',
      'Vom Herd nehmen, solange das Ei noch leicht glänzt.',
      'Mit Schnittlauch bestreuen und mit Brot und Tomaten servieren.',
    ],
  },
  {
    slug: 'porridge-apfel',
    title: 'Apfel-Zimt-Porridge',
    description: 'Warmer Haferbrei mit Apfel, Zimt und gerösteten Walnüssen.',
    category: 'fruehstueck_suesses', diet: 'vegan', minutes: 10, difficulty: 1, servings: 2,
    ingredients: [
      ['haferflocken', 100, 'g'], ['haferdrink', 400, 'ml'], ['apfel', 1], ['zimt', 1, 'TL'], ['ahornsirup', 2, 'EL'],
      ['walnuesse', 30, 'g'], ['salz', 1, 'Prise'],
    ],
    steps: [
      'Haferflocken mit Haferdrink, Salz und Zimt aufkochen und 5 Minuten unter Rühren köcheln lassen.',
      'Apfel reiben und die Hälfte unterrühren.',
      'Walnüsse grob hacken und ohne Fett rösten.',
      'Porridge mit restlichem Apfel, Nüssen und Ahornsirup servieren.',
    ],
  },
  {
    slug: 'griessbrei-kirschen',
    title: 'Grießbrei mit Kirschen',
    description: 'Kindheitserinnerung in der Schüssel: cremiger Grießbrei mit Kirschkompott.',
    category: 'fruehstueck_suesses', diet: 'vegetarisch', minutes: 20, difficulty: 1, servings: 3,
    ingredients: [
      ['griess', 80, 'g'], ['milch', 750, 'ml'], ['zucker', 3, 'EL'], ['vanillezucker', 1, 'Pck.'], ['butter', 1, 'EL'],
      ['eier', 1], ['sauerkirschen', 1, 'Glas'], ['speisestaerke', 1, 'EL'], ['salz', 1, 'Prise'],
    ],
    steps: [
      'Milch mit Zucker, Vanillezucker, Butter und Salz aufkochen. Grieß einrieseln lassen und 5 Minuten unter Rühren quellen lassen.',
      'Vom Herd nehmen, Eigelb unterrühren. Eiweiß steif schlagen und unterheben.',
      'Kirschen mit Saft erhitzen und mit angerührter Stärke binden.',
      'Grießbrei mit warmen Kirschen servieren.',
    ],
  },
  {
    slug: 'gemuese-omelette',
    title: 'Gemüse-Omelette',
    description: 'Fluffiges Omelette mit Paprika, Spinat und Käse – schnelles Abendessen.',
    category: 'fruehstueck_suesses', diet: 'vegetarisch', minutes: 15, difficulty: 1, servings: 2,
    ingredients: [
      ['eier', 5], ['paprika', 1], ['spinat', 50, 'g'], ['fruehlingszwiebel', 2], ['reibekaese', 50, 'g'], ['butter', 1, 'EL'],
      ['milch', 2, 'EL'], ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Paprika würfeln, Frühlingszwiebeln in Ringe schneiden. Eier mit Milch, Salz und Pfeffer verquirlen.',
      'Gemüse in der Butter 3 Minuten anbraten, Spinat kurz zusammenfallen lassen.',
      'Eier darübergießen und bei mittlerer Hitze stocken lassen, dabei die Ränder gelegentlich zur Mitte schieben.',
      'Käse darüberstreuen, Omelette zusammenklappen und halbiert servieren.',
    ],
  },
  {
    slug: 'apfelpfannkuchen',
    title: 'Apfelpfannkuchen',
    description: 'Dicke Pfannkuchen mit eingebackenen Apfelscheiben und Zimtzucker.',
    category: 'fruehstueck_suesses', diet: 'vegetarisch', minutes: 30, difficulty: 1, servings: 3,
    ingredients: [
      ['mehl', 200, 'g'], ['milch', 300, 'ml'], ['eier', 3], ['backpulver', 1, 'TL'], ['zucker', 2, 'EL'], ['apfel', 2],
      ['zimt', 1, 'TL'], ['butter', 30, 'g'], ['salz', 1, 'Prise'],
    ],
    steps: [
      'Mehl, Backpulver, Milch, Eier, 1 EL Zucker und Salz zu einem dickflüssigen Teig rühren.',
      'Äpfel schälen, entkernen und in dünne Scheiben schneiden.',
      'Etwas Butter in einer Pfanne erhitzen, einige Apfelscheiben hineinlegen und mit Teig übergießen.',
      'Bei mittlerer Hitze von jeder Seite 3 Minuten backen. Restlichen Zucker mit Zimt mischen und darüberstreuen.',
    ],
  },
  {
    slug: 'dampfnudeln',
    title: 'Dampfnudeln mit Vanillesauce',
    description: 'Fluffige Hefeklöße mit Salzkruste und warmer Vanillesauce – Wochenendprojekt.',
    category: 'fruehstueck_suesses', diet: 'vegetarisch', minutes: 120, difficulty: 3, servings: 4,
    ingredients: [
      ['mehl', 500, 'g'], ['hefe', 1, 'Pck.'], ['milch', 600, 'ml'], ['zucker', 4, 'EL'], ['eier', 2], ['butter', 80, 'g'],
      ['vanillezucker', 2, 'Pck.'], ['speisestaerke', 2, 'EL'], ['salz', 1, 'TL'],
    ],
    steps: [
      'Mehl, Hefe, 250 ml lauwarme Milch, 2 EL Zucker, 1 Ei, 50 g weiche Butter und eine Prise Salz zu einem glatten Teig kneten. 1 Stunde gehen lassen.',
      'Teig in 8 Stücke teilen, zu Kugeln formen und zugedeckt weitere 15 Minuten gehen lassen.',
      'In einem breiten Topf mit Deckel restliche Butter, 100 ml Milch und 1 TL Salz erhitzen. Klöße hineinsetzen und mit geschlossenem Deckel bei mittlerer Hitze 25 Minuten garen. Deckel nicht öffnen!',
      'Für die Sauce restliche Milch mit Vanillezucker und Zucker aufkochen, mit Stärke und Eigelb binden.',
      'Dampfnudeln mit der knusprigen Unterseite nach oben mit Vanillesauce servieren.',
    ],
  },
  {
    slug: 'waffeln',
    title: 'Knusprige Waffeln',
    description: 'Klassische Waffeln mit heißen Beeren – ein Fest für Sonntagnachmittage.',
    category: 'fruehstueck_suesses', diet: 'vegetarisch', minutes: 30, difficulty: 1, servings: 4,
    ingredients: [
      ['mehl', 250, 'g'], ['butter', 125, 'g'], ['zucker', 75, 'g'], ['eier', 3], ['milch', 250, 'ml'], ['backpulver', 2, 'TL'],
      ['vanillezucker', 1, 'Pck.'], ['beeren_tk', 300, 'g'], ['puderzucker', 1, 'EL'], ['salz', 1, 'Prise'],
    ],
    steps: [
      'Weiche Butter mit Zucker und Vanillezucker cremig rühren, Eier nacheinander unterrühren.',
      'Mehl mit Backpulver und Salz mischen und abwechselnd mit der Milch unterrühren.',
      'Waffeleisen vorheizen, leicht fetten und den Teig portionsweise goldbraun backen.',
      'Beeren in einem Topf erhitzen und mit den Waffeln und Puderzucker servieren.',
    ],
  },
  {
    slug: 'quarkkeulchen',
    title: 'Quarkkeulchen',
    description: 'Sächsische Kartoffel-Quark-Plätzchen, in Butter gebraten, mit Zimtzucker und Apfelmus.',
    category: 'fruehstueck_suesses', diet: 'vegetarisch', minutes: 45, difficulty: 2, servings: 3,
    ingredients: [
      ['kartoffel', 400, 'g', 'mehligkochend, gekocht'], ['quark', 250, 'g'], ['eier', 1], ['mehl', 80, 'g'], ['zucker', 3, 'EL'],
      ['vanillezucker', 1, 'Pck.'], ['rosinen', 30, 'g', 'optional'], ['butter', 40, 'g'], ['zimt', 1, 'TL'], ['apfelmus', 300, 'g'],
      ['salz', 1, 'Prise'],
    ],
    steps: [
      'Gekochte, abgekühlte Kartoffeln fein reiben oder durchpressen.',
      'Mit Quark, Ei, Mehl, 1 EL Zucker, Vanillezucker, Salz und Rosinen zu einem formbaren Teig verkneten.',
      'Mit bemehlten Händen 12 flache Plätzchen formen und in Butter von jeder Seite 3–4 Minuten goldbraun braten.',
      'Restlichen Zucker mit Zimt mischen, die Keulchen darin wälzen und mit Apfelmus servieren.',
    ],
  },
  {
    slug: 'vegane-bananen-pancakes',
    title: 'Vegane Bananen-Pancakes',
    description: 'Fluffige Pancakes ohne Ei und Milch – mit Banane gesüßt und Ahornsirup.',
    category: 'fruehstueck_suesses', diet: 'vegan', minutes: 20, difficulty: 1, servings: 2,
    ingredients: [
      ['banane', 2], ['mehl', 150, 'g'], ['backpulver', 2, 'TL'], ['haferdrink', 200, 'ml'], ['zimt', 0.5, 'TL'],
      ['ahornsirup', 3, 'EL'], ['beeren_tk', 150, 'g'], ['oel', 1, 'EL'], ['salz', 1, 'Prise'],
    ],
    steps: [
      'Eine Banane zerdrücken und mit Haferdrink verrühren.',
      'Mehl, Backpulver, Zimt und Salz mischen und kurz unter die Bananenmischung rühren – der Teig darf klümpchen haben.',
      'Eine Pfanne dünn ölen und pro Pancake 2 EL Teig bei mittlerer Hitze backen, bis sich Bläschen zeigen. Wenden und fertig backen.',
      'Mit Bananenscheiben, Beeren und Ahornsirup servieren.',
    ],
  },
  {
    slug: 'tofu-scramble',
    title: 'Tofu-Scramble mit Spinat',
    description: 'Die vegane Rührei-Alternative mit Kurkuma, Gemüse und knusprigem Brot.',
    category: 'fruehstueck_suesses', diet: 'vegan', minutes: 15, difficulty: 1, servings: 2,
    ingredients: [
      ['tofu', 250, 'g'], ['spinat', 60, 'g'], ['kirschtomaten', 150, 'g'], ['fruehlingszwiebel', 2], ['kurkuma', 0.5, 'TL'],
      ['paprikapulver', 0.5, 'TL'], ['haferdrink', 3, 'EL'], ['bauernbrot', 2, 'Scheibe'], ['olivenoel', 2, 'EL'],
      ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Tofu mit einer Gabel grob zerbröseln.',
      'Frühlingszwiebeln im Öl anbraten, Tofu zugeben und 4 Minuten braten. Kurkuma, Paprika und Haferdrink unterrühren.',
      'Halbierte Tomaten und Spinat zugeben und kurz mitgaren.',
      'Mit Salz und Pfeffer abschmecken und mit geröstetem Brot servieren.',
    ],
  },
];
