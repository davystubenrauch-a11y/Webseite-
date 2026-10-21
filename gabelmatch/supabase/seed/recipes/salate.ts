import type { RecipeDef } from '../types';

export const salate: RecipeDef[] = [
  {
    slug: 'griechischer-salat',
    title: 'Griechischer Bauernsalat',
    description: 'Tomaten, Gurke, Paprika, Oliven und ein großes Stück Feta – Urlaub auf dem Teller.',
    category: 'salate', diet: 'vegetarisch', minutes: 15, difficulty: 1, servings: 2,
    ingredients: [
      ['tomate', 3], ['gurke', 1], ['paprika', 1], ['rote_zwiebel', 1], ['oliven', 60, 'g'], ['feta', 200, 'g'],
      ['oregano', 1, 'TL'], ['olivenoel', 4, 'EL'], ['essig', 1, 'EL'], ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Tomaten in Spalten, Gurke in dicke Halbmonde, Paprika in Streifen und Zwiebel in Ringe schneiden.',
      'Gemüse mit Oliven in eine Schüssel geben, salzen und pfeffern.',
      'Feta in einem Stück darauflegen, mit Oregano bestreuen und mit Öl und Essig beträufeln.',
      'Mit Brot servieren.',
    ],
  },
  {
    slug: 'nudelsalat-pesto',
    title: 'Nudelsalat mit Pesto und Tomaten',
    description: 'Der Grillparty-Klassiker ohne Mayo: Pesto, Kirschtomaten, Rucola und Mozzarella.',
    category: 'salate', diet: 'vegetarisch', minutes: 25, difficulty: 1, servings: 4,
    ingredients: [
      ['fusilli', 400, 'g'], ['pesto', 150, 'g'], ['kirschtomaten', 300, 'g'], ['mozzarella', 125, 'g'],
      ['rucola', 50, 'g'], ['pinienkerne', 3, 'EL'], ['balsamico', 2, 'EL'], ['olivenoel', 2, 'EL'], ['salz', null],
    ],
    steps: [
      'Nudeln in Salzwasser garen, abgießen, kalt abschrecken und abtropfen lassen.',
      'Pinienkerne ohne Fett rösten. Tomaten halbieren, Mozzarella würfeln.',
      'Nudeln mit Pesto, Öl und Balsamico mischen, Tomaten und Mozzarella unterheben.',
      'Kurz vor dem Servieren Rucola und Pinienkerne unterziehen.',
    ],
  },
  {
    slug: 'schwaebischer-kartoffelsalat',
    title: 'Schwäbischer Kartoffelsalat',
    description: 'Mit warmer Brühe angemacht, saftig und ganz ohne Mayonnaise.',
    category: 'salate', diet: 'vegan', minutes: 45, difficulty: 1, servings: 4,
    ingredients: [
      ['kartoffel', 1, 'kg', 'festkochend'], ['zwiebel', 1], ['gemuesebruehe', 250, 'ml'], ['essig', 4, 'EL'],
      ['senf', 1, 'TL'], ['oel', 4, 'EL'], ['schnittlauch', 1, 'Bund'], ['gurke', 0.5], ['zucker', 1, 'Prise'],
      ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Kartoffeln mit Schale etwa 20 Minuten kochen, pellen und noch warm in dünne Scheiben schneiden.',
      'Zwiebel fein würfeln und in der Brühe kurz aufkochen. Essig, Senf, Zucker, Salz und Pfeffer einrühren.',
      'Die heiße Marinade über die Kartoffeln gießen, vorsichtig mischen und 15 Minuten ziehen lassen.',
      'Öl, dünn gehobelte Gurke und Schnittlauch unterheben und lauwarm servieren.',
    ],
  },
  {
    slug: 'caesar-salad-haehnchen',
    title: 'Caesar Salad mit Hähnchen',
    description: 'Knackiger Römersalat, Knoblauchcroûtons und ein cremiges Parmesandressing.',
    category: 'salate', diet: 'fleisch', minutes: 30, difficulty: 2, servings: 2,
    ingredients: [
      ['roemersalat', 2], ['haehnchenbrust', 300, 'g'], ['toastbrot', 2, 'Scheibe'], ['knoblauch', 1, 'Zehe'],
      ['parmesan', 40, 'g'], ['mayonnaise', 3, 'EL'], ['joghurt', 2, 'EL'], ['zitrone', 0.5], ['senf', 1, 'TL'],
      ['olivenoel', 3, 'EL'], ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Hähnchen salzen, pfeffern und in 1 EL Öl von jeder Seite 5–6 Minuten braten. Ruhen lassen und in Streifen schneiden.',
      'Toast würfeln und mit gehacktem Knoblauch im restlichen Öl knusprig rösten.',
      'Mayonnaise, Joghurt, Zitronensaft, Senf und die Hälfte des geriebenen Parmesans verrühren.',
      'Salat in Stücke zupfen, mit Dressing mischen, Hähnchen und Croûtons darauf verteilen und mit Parmesan bestreuen.',
    ],
  },
  {
    slug: 'couscous-salat-minze',
    title: 'Couscous-Salat mit Minze',
    description: 'Frisch wie Taboulé: Couscous mit Gurke, Tomaten, viel Petersilie und Minze.',
    category: 'salate', diet: 'vegan', minutes: 20, difficulty: 1, servings: 3,
    ingredients: [
      ['couscous', 200, 'g'], ['gemuesebruehe', 250, 'ml'], ['gurke', 0.5], ['tomate', 2], ['fruehlingszwiebel', 3],
      ['petersilie', 1, 'Bund'], ['minze', 0.5, 'Bund'], ['zitrone', 1], ['olivenoel', 4, 'EL'], ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Couscous mit heißer Brühe übergießen, 5 Minuten quellen lassen und auflockern. Abkühlen lassen.',
      'Gurke und Tomaten klein würfeln, Frühlingszwiebeln in Ringe schneiden, Kräuter fein hacken.',
      'Alles mit Zitronensaft und Olivenöl mischen und kräftig abschmecken.',
    ],
  },
  {
    slug: 'linsensalat-feta',
    title: 'Linsensalat mit Feta',
    description: 'Würzige Tellerlinsen, knackiges Gemüse und Feta – sättigt auch als Hauptgericht.',
    category: 'salate', diet: 'vegetarisch', minutes: 30, difficulty: 1, servings: 3,
    ingredients: [
      ['tellerlinsen', 200, 'g'], ['paprika', 1], ['rote_zwiebel', 1], ['feta', 150, 'g'], ['petersilie', 1, 'Bund'],
      ['essig', 3, 'EL'], ['senf', 1, 'TL'], ['olivenoel', 4, 'EL'], ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Linsen in ungesalzenem Wasser 20–25 Minuten bissfest garen, abgießen und abkühlen lassen.',
      'Paprika und Zwiebel fein würfeln, Petersilie hacken.',
      'Essig, Senf, Öl, Salz und Pfeffer verrühren und mit Linsen und Gemüse mischen.',
      'Feta darüberbröseln.',
    ],
  },
  {
    slug: 'caprese',
    title: 'Caprese mit Ciabatta',
    description: 'Tomate, Mozzarella, Basilikum – drei Zutaten, ein perfekter Sommerabend.',
    category: 'salate', diet: 'vegetarisch', minutes: 10, difficulty: 1, servings: 2,
    ingredients: [
      ['tomate', 4], ['mozzarella', 250, 'g'], ['basilikum', 1, 'Bund'], ['olivenoel', 3, 'EL'],
      ['balsamico', 1, 'EL'], ['baguette', 0.5], ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Tomaten und Mozzarella in Scheiben schneiden und abwechselnd auf einer Platte anrichten.',
      'Mit Salz und Pfeffer würzen, Basilikumblätter dazwischenstecken.',
      'Mit Olivenöl und Balsamico beträufeln und mit Brot servieren.',
    ],
  },
  {
    slug: 'thunfisch-bohnen-salat',
    title: 'Thunfisch-Bohnen-Salat',
    description: 'Toskanischer Vorratsschrank-Salat mit weißen Bohnen, roten Zwiebeln und Zitrone.',
    category: 'salate', diet: 'fisch', minutes: 15, difficulty: 1, servings: 2,
    ingredients: [
      ['thunfisch', 1, 'Dose'], ['weisse_bohnen', 1, 'Dose'], ['rote_zwiebel', 1], ['kirschtomaten', 200, 'g'],
      ['petersilie', 0.5, 'Bund'], ['zitrone', 1], ['olivenoel', 3, 'EL'], ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Bohnen abspülen und abtropfen lassen. Zwiebel in feine Ringe schneiden, Tomaten halbieren.',
      'Thunfisch abtropfen lassen und grob zerpflücken.',
      'Alles mit Zitronensaft, Olivenöl, Petersilie, Salz und Pfeffer mischen.',
    ],
  },
  {
    slug: 'gurkensalat-tofu',
    title: 'Asiatischer Gurkensalat mit Knusper-Tofu',
    description: 'Erfrischender Gurkensalat mit Sesam-Dressing und knusprig gebratenem Tofu.',
    category: 'salate', diet: 'vegan', minutes: 25, difficulty: 1, servings: 2,
    ingredients: [
      ['gurke', 1], ['tofu', 200, 'g'], ['speisestaerke', 1, 'EL'], ['sojasauce', 3, 'EL'], ['essig', 1, 'EL'],
      ['sesamoel', 1, 'TL'], ['ahornsirup', 1, 'TL'], ['knoblauch', 1, 'Zehe'], ['chiliflocken', 0.5, 'TL'],
      ['sesam', 1, 'EL'], ['oel', 2, 'EL'],
    ],
    steps: [
      'Tofu trocken tupfen, würfeln, in Stärke wenden und im Öl rundum knusprig braten. Mit 1 EL Sojasauce ablöschen.',
      'Gurke leicht andrücken und in mundgerechte Stücke schneiden.',
      'Restliche Sojasauce, Essig, Sesamöl, Ahornsirup, gehackten Knoblauch und Chili verrühren.',
      'Gurke mit Dressing mischen, Tofu darauf verteilen und mit Sesam bestreuen.',
    ],
  },
  {
    slug: 'rote-bete-ziegenkaese',
    title: 'Rote-Bete-Salat mit Ziegenkäse',
    description: 'Erdige Rote Bete, cremiger Ziegenkäse, Rucola und karamellisierte Walnüsse.',
    category: 'salate', diet: 'vegetarisch', minutes: 20, difficulty: 1, servings: 2,
    ingredients: [
      ['rote_bete', 400, 'g'], ['ziegenkaese', 150, 'g'], ['rucola', 75, 'g'], ['walnuesse', 50, 'g'], ['honig', 2, 'EL'],
      ['balsamico', 2, 'EL'], ['olivenoel', 3, 'EL'], ['apfel', 1], ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Walnüsse in einer Pfanne mit 1 EL Honig karamellisieren lassen und auf Backpapier abkühlen lassen.',
      'Rote Bete in Spalten, Apfel in dünne Scheiben schneiden.',
      'Restlichen Honig mit Balsamico, Öl, Salz und Pfeffer verrühren.',
      'Rucola, Rote Bete und Apfel anrichten, Ziegenkäse darüberzupfen, mit Dressing und Nüssen vollenden.',
    ],
  },
  {
    slug: 'quinoa-avocado-salat',
    title: 'Quinoa-Salat mit Avocado und Mais',
    description: 'Mexikanisch angehaucht mit Limette, Koriander, Bohnen und cremiger Avocado.',
    category: 'salate', diet: 'vegan', minutes: 25, difficulty: 1, servings: 3,
    ingredients: [
      ['quinoa', 150, 'g'], ['avocado', 1], ['mais', 1, 'Dose'], ['kidneybohnen', 1, 'Dose'], ['paprika', 1],
      ['rote_zwiebel', 1], ['limette', 2], ['koriander', 0.5, 'Bund'], ['kreuzkuemmel', 0.5, 'TL'],
      ['olivenoel', 3, 'EL'], ['salz', null],
    ],
    steps: [
      'Quinoa abspülen und in der doppelten Menge Salzwasser 15 Minuten garen. Abkühlen lassen.',
      'Mais und Bohnen abspülen. Paprika, Zwiebel und Avocado würfeln.',
      'Limettensaft, Öl, Kreuzkümmel und Salz verrühren.',
      'Alles mischen und mit gehacktem Koriander bestreuen.',
    ],
  },
  {
    slug: 'wurstsalat',
    title: 'Schweizer Wurstsalat',
    description: 'Fleischwurst und Käse in würziger Essig-Öl-Marinade – Biergarten-Feeling zuhause.',
    category: 'salate', diet: 'fleisch', minutes: 15, difficulty: 1, servings: 2,
    ingredients: [
      ['fleischwurst', 250, 'g'], ['bergkaese', 100, 'g'], ['zwiebel', 1], ['gewuerzgurken', 3], ['essig', 4, 'EL'],
      ['oel', 3, 'EL'], ['senf', 1, 'TL'], ['schnittlauch', 0.5, 'Bund'], ['bauernbrot', 2, 'Scheibe'],
      ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Wurst und Käse in feine Streifen schneiden, Zwiebel in dünne Ringe, Gurken in Scheiben.',
      'Essig, Senf, Öl, 2 EL Gurkenwasser, Salz und Pfeffer verrühren.',
      'Alles mischen und mindestens 10 Minuten ziehen lassen.',
      'Mit Schnittlauch bestreuen und mit Bauernbrot servieren.',
    ],
  },
  {
    slug: 'bunter-bohnensalat',
    title: 'Bunter Bohnensalat',
    description: 'Grüne, weiße und rote Bohnen in einer würzigen Vinaigrette – lässt sich super vorbereiten.',
    category: 'salate', diet: 'vegan', minutes: 20, difficulty: 1, servings: 4,
    ingredients: [
      ['gruene_bohnen', 300, 'g'], ['weisse_bohnen', 1, 'Dose'], ['kidneybohnen', 1, 'Dose'], ['rote_zwiebel', 1],
      ['petersilie', 1, 'Bund'], ['essig', 4, 'EL'], ['senf', 1, 'TL'], ['olivenoel', 4, 'EL'], ['zucker', 1, 'Prise'],
      ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Grüne Bohnen putzen, halbieren und in Salzwasser 8 Minuten garen. Kalt abschrecken.',
      'Dosenbohnen abspülen, Zwiebel fein würfeln, Petersilie hacken.',
      'Essig, Senf, Öl, Zucker, Salz und Pfeffer verrühren.',
      'Alles mischen und 10 Minuten durchziehen lassen.',
    ],
  },
];
