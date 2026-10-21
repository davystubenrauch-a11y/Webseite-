import type { RecipeDef } from '../types';

export const kartoffeln: RecipeDef[] = [
  {
    slug: 'kartoffelgratin',
    title: 'Kartoffelgratin',
    description: 'Dünne Kartoffelscheiben in Knoblauchsahne, goldbraun und butterzart gebacken.',
    category: 'kartoffeln', diet: 'vegetarisch', minutes: 70, difficulty: 1, servings: 4,
    ingredients: [
      ['kartoffel', 1, 'kg', 'festkochend'], ['sahne', 300, 'ml'], ['milch', 200, 'ml'], ['knoblauch', 1, 'Zehe'],
      ['reibekaese', 100, 'g'], ['butter', 1, 'EL'], ['muskat', 1, 'Prise'], ['thymian', 2, 'Zweig'], ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Ofen auf 180 °C vorheizen. Eine Form mit Butter einfetten und mit der halbierten Knoblauchzehe ausreiben.',
      'Kartoffeln schälen und in 2–3 mm dünne Scheiben hobeln.',
      'Sahne und Milch mit Salz, Pfeffer, Muskat und Thymian aufkochen, Kartoffeln zugeben und 5 Minuten köcheln lassen.',
      'In die Form füllen, mit Käse bestreuen und 45 Minuten backen, bis die Kartoffeln weich sind.',
    ],
  },
  {
    slug: 'bratkartoffeln-spiegelei',
    title: 'Bratkartoffeln mit Spiegelei',
    description: 'Knusprige Bratkartoffeln mit Zwiebeln, dazu Spiegeleier und Gewürzgurken.',
    category: 'kartoffeln', diet: 'vegetarisch', minutes: 30, difficulty: 1, servings: 2,
    ingredients: [
      ['kartoffel', 600, 'g', 'am Vortag gekocht'], ['zwiebel', 1], ['eier', 4], ['butter', 1, 'EL'], ['oel', 3, 'EL'],
      ['majoran', 0.5, 'TL'], ['gewuerzgurken', 4], ['schnittlauch', 0.5, 'Bund'], ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Gekochte Kartoffeln pellen und in Scheiben schneiden. Zwiebel würfeln.',
      'Kartoffeln im Öl in einer großen Pfanne bei mittlerer Hitze 10 Minuten braten, ohne sie zu oft zu wenden.',
      'Zwiebeln zugeben und weitere 5 Minuten braten, bis alles knusprig ist. Mit Salz, Pfeffer und Majoran würzen.',
      'In einer zweiten Pfanne Spiegeleier in Butter braten. Mit Schnittlauch und Gurken servieren.',
    ],
  },
  {
    slug: 'kartoffelpuffer-apfelmus',
    title: 'Kartoffelpuffer mit Apfelmus',
    description: 'Außen knusprig, innen weich – Reibekuchen wie vom Weihnachtsmarkt.',
    category: 'kartoffeln', diet: 'vegetarisch', minutes: 35, difficulty: 2, servings: 3,
    ingredients: [
      ['kartoffel', 1, 'kg', 'mehligkochend'], ['zwiebel', 1], ['eier', 2], ['mehl', 2, 'EL'], ['oel', 100, 'ml'],
      ['apfelmus', 400, 'g'], ['muskat', 1, 'Prise'], ['salz', null],
    ],
    steps: [
      'Kartoffeln schälen und mit der Zwiebel fein reiben. In einem Tuch kräftig ausdrücken.',
      'Mit Eiern, Mehl, Salz und Muskat zu einem Teig vermengen.',
      'Öl in einer Pfanne erhitzen, pro Puffer 2 EL Teig hineingeben, flach drücken und von jeder Seite 3–4 Minuten goldbraun backen.',
      'Auf Küchenpapier abtropfen lassen und mit Apfelmus servieren.',
    ],
  },
  {
    slug: 'ofenkartoffel-kraeuterquark',
    title: 'Ofenkartoffeln mit Kräuterquark',
    description: 'Große Kartoffeln aus dem Ofen mit einem cremigen Quark voller frischer Kräuter.',
    category: 'kartoffeln', diet: 'vegetarisch', minutes: 60, difficulty: 1, servings: 2,
    ingredients: [
      ['kartoffel', 4, null, 'große'], ['quark', 250, 'g'], ['joghurt', 100, 'g'], ['schnittlauch', 0.5, 'Bund'],
      ['petersilie', 0.5, 'Bund'], ['dill', 0.5, 'Bund'], ['knoblauch', 1, 'Zehe'], ['olivenoel', 1, 'EL'],
      ['radieschen', 6], ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Ofen auf 200 °C vorheizen. Kartoffeln waschen, mehrfach einstechen, mit Öl und Salz einreiben und 50 Minuten backen.',
      'Quark mit Joghurt, gehackten Kräutern, gepresstem Knoblauch, Salz und Pfeffer cremig rühren.',
      'Radieschen in Scheiben schneiden.',
      'Kartoffeln kreuzweise einschneiden, auseinanderdrücken und mit Kräuterquark und Radieschen füllen.',
    ],
  },
  {
    slug: 'rosmarin-kartoffelpfanne',
    title: 'Rosmarin-Kartoffelpfanne mit Gemüse',
    description: 'Goldene Kartoffeln mit Paprika, Zucchini und Rosmarin – unkompliziert und vegan.',
    category: 'kartoffeln', diet: 'vegan', minutes: 35, difficulty: 1, servings: 2,
    ingredients: [
      ['kartoffel', 600, 'g'], ['paprika', 1], ['zucchini', 1], ['rote_zwiebel', 1], ['rosmarin', 2, 'Zweig'],
      ['knoblauch', 2, 'Zehe'], ['olivenoel', 4, 'EL'], ['paprikapulver', 1, 'TL'], ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Kartoffeln in kleine Würfel schneiden und 5 Minuten in Salzwasser vorgaren. Gut abtropfen lassen.',
      'Im Öl in einer großen Pfanne 10 Minuten knusprig braten.',
      'Gemüse würfeln, mit Knoblauch und Rosmarin zugeben und weitere 8 Minuten braten.',
      'Mit Paprikapulver, Salz und Pfeffer abschmecken.',
    ],
  },
  {
    slug: 'schupfnudeln-sauerkraut',
    title: 'Schupfnudeln mit Sauerkraut',
    description: 'Gebratene Schupfnudeln mit Sauerkraut und Zwiebeln – herzhaft und schnell.',
    category: 'kartoffeln', diet: 'vegetarisch', minutes: 25, difficulty: 1, servings: 3,
    ingredients: [
      ['schupfnudeln', 600, 'g'], ['sauerkraut', 400, 'g'], ['zwiebel', 1], ['butter', 30, 'g'], ['kuemmel', 0.5, 'TL'],
      ['schmand', 100, 'g'], ['petersilie', 0.5, 'Bund'], ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Zwiebel in Streifen schneiden und in der Hälfte der Butter glasig dünsten.',
      'Sauerkraut abtropfen lassen, mit Kümmel zugeben und 8 Minuten mitdünsten.',
      'In einer zweiten Pfanne Schupfnudeln in der restlichen Butter goldbraun braten.',
      'Alles mischen, abschmecken und mit Schmand und Petersilie servieren.',
    ],
  },
  {
    slug: 'kartoffel-spinat-curry',
    title: 'Kartoffel-Spinat-Curry',
    description: 'Inspiriert von Saag Aloo: zarte Kartoffeln mit Spinat in einer duftenden Gewürzsauce.',
    category: 'kartoffeln', diet: 'vegan', minutes: 35, difficulty: 1, servings: 3,
    ingredients: [
      ['kartoffel', 700, 'g'], ['spinat', 200, 'g'], ['zwiebel', 1], ['knoblauch', 2, 'Zehe'], ['ingwer', 15, 'g'],
      ['gehackte_tomaten', 1, 'Dose'], ['kokosmilch', 200, 'ml'], ['currypulver', 2, 'TL'], ['kreuzkuemmel', 1, 'TL'],
      ['oel', 2, 'EL'], ['salz', null],
    ],
    steps: [
      'Kartoffeln schälen und in 2 cm große Würfel schneiden. Zwiebel, Knoblauch und Ingwer fein hacken.',
      'Zwiebel im Öl goldgelb braten, Knoblauch, Ingwer und Gewürze 1 Minute mitrösten.',
      'Kartoffeln, Tomaten und Kokosmilch zugeben und zugedeckt 20 Minuten köcheln lassen.',
      'Spinat unterheben, zusammenfallen lassen und mit Salz abschmecken.',
    ],
  },
  {
    slug: 'pellkartoffeln-quark-leinoel',
    title: 'Pellkartoffeln mit Quark',
    description: 'Ein schlichter Klassiker aus der Lausitz: Pellkartoffeln, Kräuterquark und Gurke.',
    category: 'kartoffeln', diet: 'vegetarisch', minutes: 30, difficulty: 1, servings: 2,
    ingredients: [
      ['kartoffel', 800, 'g'], ['quark', 500, 'g'], ['milch', 50, 'ml'], ['zwiebel', 0.5], ['schnittlauch', 1, 'Bund'],
      ['gurke', 0.5], ['olivenoel', 2, 'EL'], ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Kartoffeln mit Schale in Salzwasser etwa 20–25 Minuten garen.',
      'Quark mit Milch glatt rühren, fein gewürfelte Zwiebel und Schnittlauch unterrühren, salzen und pfeffern.',
      'Gurke in Scheiben schneiden.',
      'Kartoffeln pellen und mit Quark, einem Schuss Öl und Gurke servieren.',
    ],
  },
  {
    slug: 'bauernfruehstueck',
    title: 'Bauernfrühstück',
    description: 'Bratkartoffeln, Speck und Ei in einer Pfanne – deftig und schnell.',
    category: 'kartoffeln', diet: 'fleisch', minutes: 30, difficulty: 1, servings: 2,
    ingredients: [
      ['kartoffel', 500, 'g', 'gekocht'], ['speck', 100, 'g'], ['zwiebel', 1], ['eier', 4], ['milch', 3, 'EL'],
      ['schnittlauch', 0.5, 'Bund'], ['oel', 2, 'EL'], ['gewuerzgurken', 3], ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Kartoffeln in Scheiben schneiden und im Öl 10 Minuten knusprig braten.',
      'Speck und gewürfelte Zwiebel zugeben und 4 Minuten mitbraten.',
      'Eier mit Milch, Salz und Pfeffer verquirlen, über die Kartoffeln gießen und bei mittlerer Hitze stocken lassen.',
      'Mit Schnittlauch bestreuen und mit Gewürzgurken servieren.',
    ],
  },
  {
    slug: 'roesti-raeucherlachs',
    title: 'Rösti mit Räucherlachs',
    description: 'Knusprige Kartoffelrösti mit Räucherlachs, Dill-Schmand und Zitrone.',
    category: 'kartoffeln', diet: 'fisch', minutes: 35, difficulty: 2, servings: 2,
    ingredients: [
      ['kartoffel', 600, 'g', 'festkochend'], ['raeucherlachs', 150, 'g'], ['schmand', 150, 'g'], ['dill', 0.5, 'Bund'],
      ['zitrone', 0.5], ['butter', 30, 'g'], ['oel', 2, 'EL'], ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Kartoffeln schälen, grob raspeln, gut ausdrücken und salzen.',
      'Öl und Butter in einer Pfanne erhitzen, die Masse zu 4 flachen Rösti formen und von jeder Seite 6–7 Minuten goldbraun braten.',
      'Schmand mit gehacktem Dill, Zitronensaft, Salz und Pfeffer verrühren.',
      'Rösti mit Lachs und Dill-Schmand anrichten.',
    ],
  },
  {
    slug: 'kartoffelpueree-bratwurst',
    title: 'Kartoffelpüree mit Bratwurst und Zwiebelsauce',
    description: 'Cremiges Püree, gebräunte Bratwurst und eine dunkle Zwiebelsauce – deutsche Hausmannskost.',
    category: 'kartoffeln', diet: 'fleisch', minutes: 35, difficulty: 1, servings: 4,
    ingredients: [
      ['kartoffel', 1, 'kg', 'mehligkochend'], ['bratwurst', 4], ['milch', 200, 'ml'], ['butter', 50, 'g'], ['zwiebel', 3],
      ['mehl', 1, 'EL'], ['rinderbruehe', 300, 'ml'], ['senf', 1, 'TL'], ['muskat', 1, 'Prise'], ['oel', 1, 'EL'],
      ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Kartoffeln schälen, würfeln und in Salzwasser 20 Minuten weich kochen.',
      'Bratwürste im Öl rundum braun braten und warm halten. Zwiebeln in Ringe schneiden und im Bratfett 8 Minuten bräunen.',
      'Mehl über die Zwiebeln stäuben, mit Brühe ablöschen, Senf einrühren und 5 Minuten sämig köcheln.',
      'Kartoffeln abgießen, mit warmer Milch und Butter zu Püree stampfen und mit Muskat und Salz würzen.',
    ],
  },
  {
    slug: 'suesskartoffel-pommes-dip',
    title: 'Süßkartoffel-Pommes mit Avocado-Dip',
    description: 'Ofen-Pommes aus Süßkartoffeln mit cremigem Limetten-Avocado-Dip.',
    category: 'kartoffeln', diet: 'vegan', minutes: 40, difficulty: 1, servings: 2,
    ingredients: [
      ['suesskartoffel', 2], ['speisestaerke', 1, 'EL'], ['paprikapulver', 1, 'TL'], ['olivenoel', 3, 'EL'], ['avocado', 1],
      ['limette', 1], ['knoblauch', 1, 'Zehe'], ['koriander', 0.5, 'Bund'], ['salz', null],
    ],
    steps: [
      'Ofen auf 220 °C Umluft vorheizen. Süßkartoffeln in gleichmäßige Stifte schneiden.',
      'Mit Stärke bestäuben, dann mit Öl, Paprikapulver und Salz mischen.',
      'Mit Abstand auf einem Blech verteilen und 25–30 Minuten backen, nach der Hälfte wenden.',
      'Avocado mit Limettensaft, Knoblauch, Koriander und Salz zerdrücken und zu den Pommes servieren.',
    ],
  },
  {
    slug: 'stampfkartoffeln-fischstaebchen',
    title: 'Erbsenstampf mit Fischstäbchen',
    description: 'Kinderliebling mit Upgrade: Kartoffel-Erbsen-Stampf und knusprige Fischstäbchen.',
    category: 'kartoffeln', diet: 'fisch', minutes: 30, difficulty: 1, servings: 3,
    ingredients: [
      ['kartoffel', 700, 'g'], ['erbsen_tk', 250, 'g'], ['fischstaebchen', 15], ['butter', 30, 'g'], ['milch', 100, 'ml'],
      ['zitrone', 0.5], ['oel', 2, 'EL'], ['muskat', 1, 'Prise'], ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Kartoffeln schälen, würfeln und in Salzwasser 15 Minuten garen. Erbsen die letzten 4 Minuten mitkochen.',
      'Fischstäbchen im Öl von jeder Seite 3–4 Minuten knusprig braten.',
      'Kartoffeln und Erbsen abgießen und mit Milch und Butter grob stampfen. Mit Muskat, Salz und Pfeffer würzen.',
      'Mit Fischstäbchen und Zitronenspalten servieren.',
    ],
  },
  {
    slug: 'gefuellte-kartoffeln-brokkoli',
    title: 'Gefüllte Kartoffeln mit Brokkoli und Käse',
    description: 'Ausgehöhlte Ofenkartoffeln, gefüllt mit Brokkoli, Frischkäse und Cheddar.',
    category: 'kartoffeln', diet: 'vegetarisch', minutes: 65, difficulty: 2, servings: 2,
    ingredients: [
      ['kartoffel', 4, null, 'große'], ['brokkoli', 0.5], ['frischkaese', 100, 'g'], ['cheddar', 80, 'g'],
      ['fruehlingszwiebel', 2], ['olivenoel', 1, 'EL'], ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Ofen auf 200 °C vorheizen. Kartoffeln mit Öl einreiben, einstechen und 45 Minuten backen.',
      'Brokkoli in kleine Röschen teilen und 4 Minuten in Salzwasser garen.',
      'Kartoffeln längs halbieren, aushöhlen und das Innere mit Frischkäse, Brokkoli, Frühlingszwiebeln, Salz und Pfeffer vermengen.',
      'Masse zurück in die Schalen füllen, mit Cheddar bestreuen und 10 Minuten überbacken.',
    ],
  },
];
