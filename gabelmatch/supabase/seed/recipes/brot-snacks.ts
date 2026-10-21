import type { RecipeDef } from '../types';

export const brotSnacks: RecipeDef[] = [
  {
    slug: 'flammkuchen-klassisch',
    title: 'Flammkuchen Elsässer Art',
    description: 'Hauchdünn und knusprig mit Schmand, Speck und Zwiebeln.',
    category: 'brot_snacks', diet: 'fleisch', minutes: 25, difficulty: 1, servings: 2,
    ingredients: [
      ['flammkuchenteig', 1, 'Pck.'], ['schmand', 200, 'g'], ['speck', 100, 'g'], ['zwiebel', 2], ['muskat', 1, 'Prise'],
      ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Ofen auf höchster Stufe (mind. 230 °C) vorheizen.',
      'Teig samt Backpapier auf ein Blech legen. Schmand mit Salz, Pfeffer und Muskat verrühren und dünn darauf verstreichen.',
      'Zwiebeln in sehr feine Ringe schneiden und mit dem Speck darauf verteilen.',
      '10–12 Minuten backen, bis der Rand knusprig braun ist.',
    ],
  },
  {
    slug: 'flammkuchen-ziegenkaese',
    title: 'Flammkuchen mit Ziegenkäse und Honig',
    description: 'Vegetarische Variante mit Ziegenkäse, roten Zwiebeln, Walnüssen und einem Hauch Honig.',
    category: 'brot_snacks', diet: 'vegetarisch', minutes: 25, difficulty: 1, servings: 2,
    ingredients: [
      ['flammkuchenteig', 1, 'Pck.'], ['creme_fraiche', 150, 'g'], ['ziegenkaese', 120, 'g'], ['rote_zwiebel', 1],
      ['walnuesse', 30, 'g'], ['honig', 1, 'EL'], ['thymian', 2, 'Zweig'], ['rucola', 30, 'g'], ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Ofen auf höchster Stufe vorheizen.',
      'Teig ausbreiten, mit gewürzter Crème fraîche bestreichen.',
      'Zwiebel in feine Ringe schneiden, mit zerbröseltem Ziegenkäse, Walnüssen und Thymian verteilen.',
      '10–12 Minuten backen, mit Honig beträufeln und mit Rucola belegen.',
    ],
  },
  {
    slug: 'pizza-margherita',
    title: 'Pizza Margherita',
    description: 'Selbst gemachter Hefeteig, fruchtige Tomatensauce und Mozzarella – Pizzaabend!',
    category: 'brot_snacks', diet: 'vegetarisch', minutes: 90, difficulty: 2, servings: 2,
    ingredients: [
      ['mehl', 300, 'g'], ['hefe', 0.5, 'Pck.'], ['wasser', 180, 'ml', 'lauwarm'], ['olivenoel', 2, 'EL'], ['salz', 1, 'TL'],
      ['passierte_tomaten', 200, 'ml'], ['oregano', 1, 'TL'], ['mozzarella', 250, 'g'], ['basilikum', 0.5, 'Bund'],
    ],
    steps: [
      'Mehl, Hefe, Salz, Wasser und 1 EL Öl 8 Minuten zu einem glatten Teig kneten. Zugedeckt 1 Stunde gehen lassen.',
      'Ofen mit Blech auf 250 °C vorheizen. Passierte Tomaten mit Oregano, Salz und restlichem Öl verrühren.',
      'Teig halbieren, dünn ausrollen und auf Backpapier legen. Mit Sauce bestreichen und mit zerzupftem Mozzarella belegen.',
      'Auf dem heißen Blech 8–10 Minuten backen. Mit Basilikum servieren.',
    ],
  },
  {
    slug: 'haehnchen-wraps',
    title: 'Hähnchen-Wraps mit Joghurtsauce',
    description: 'Würzige Hähnchenstreifen, knackiger Salat und Knoblauch-Joghurt im warmen Wrap.',
    category: 'brot_snacks', diet: 'fleisch', minutes: 25, difficulty: 1, servings: 2,
    ingredients: [
      ['tortillas', 4], ['haehnchenbrust', 300, 'g'], ['paprikapulver', 1, 'TL'], ['kreuzkuemmel', 0.5, 'TL'],
      ['kopfsalat', 0.5], ['tomate', 2], ['gurke', 0.5], ['joghurt', 150, 'g'], ['knoblauch', 1, 'Zehe'], ['oel', 1, 'EL'],
      ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Hähnchen in Streifen schneiden, mit Gewürzen, Salz und Pfeffer mischen und im Öl 6 Minuten braten.',
      'Joghurt mit gepresstem Knoblauch und Salz verrühren. Salat, Tomaten und Gurke schneiden.',
      'Tortillas in einer trockenen Pfanne kurz erwärmen.',
      'Mit Sauce bestreichen, mit Salat, Gemüse und Hähnchen belegen und fest einrollen.',
    ],
  },
  {
    slug: 'falafel-wraps',
    title: 'Ofen-Falafel im Wrap',
    description: 'Falafel aus Dosen-Kichererbsen, im Ofen gebacken, mit Tahini-Sauce und Gemüse.',
    category: 'brot_snacks', diet: 'vegan', minutes: 40, difficulty: 2, servings: 2,
    ingredients: [
      ['kichererbsen', 1, 'Dose'], ['zwiebel', 0.5], ['knoblauch', 2, 'Zehe'], ['petersilie', 1, 'Bund'],
      ['kreuzkuemmel', 1, 'TL'], ['mehl', 2, 'EL'], ['backpulver', 0.5, 'TL'], ['tortillas', 4], ['tahini', 3, 'EL'],
      ['zitrone', 1], ['tomate', 2], ['kopfsalat', 0.5], ['olivenoel', 3, 'EL'], ['salz', null],
    ],
    steps: [
      'Ofen auf 200 °C vorheizen. Kichererbsen gut abtropfen lassen und trocken tupfen.',
      'Mit Zwiebel, Knoblauch, Petersilie, Kreuzkümmel, Mehl, Backpulver und Salz im Mixer zu einer groben Masse verarbeiten.',
      '12 kleine Bällchen formen, flach drücken, mit Öl bepinseln und 20 Minuten backen, nach der Hälfte wenden.',
      'Tahini mit Zitronensaft, Salz und Wasser cremig rühren. Wraps mit Salat, Tomaten, Falafel und Sauce füllen.',
    ],
  },
  {
    slug: 'burger-klassisch',
    title: 'Klassischer Cheeseburger',
    description: 'Saftiges Rindfleisch-Patty, geschmolzener Cheddar und eine schnelle Burgersauce.',
    category: 'brot_snacks', diet: 'fleisch', minutes: 30, difficulty: 2, servings: 4,
    ingredients: [
      ['rinderhack', 600, 'g'], ['burgerbroetchen', 4], ['cheddar', 4, 'Scheibe'], ['tomate', 2], ['kopfsalat', 0.5],
      ['rote_zwiebel', 1], ['gewuerzgurken', 2], ['mayonnaise', 3, 'EL'], ['ketchup', 2, 'EL'], ['senf', 1, 'TL'],
      ['oel', 1, 'EL'], ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Hack nur kurz zu 4 flachen Patties formen, die etwas größer als die Brötchen sind. Erst kurz vor dem Braten salzen und pfeffern.',
      'Mayonnaise, Ketchup, Senf und fein gehackte Gurke zu einer Sauce verrühren.',
      'Patties in einer sehr heißen Pfanne mit wenig Öl von jeder Seite 3 Minuten braten. Käse in der letzten Minute darauflegen.',
      'Brötchen anrösten und mit Sauce, Salat, Tomate, Zwiebel und Patty belegen.',
    ],
  },
  {
    slug: 'quesadillas-bohnen',
    title: 'Quesadillas mit Bohnen und Mais',
    description: 'Knusprig gebratene Tortillas mit schmelzendem Käse, Bohnen und Mais.',
    category: 'brot_snacks', diet: 'vegetarisch', minutes: 20, difficulty: 1, servings: 2,
    ingredients: [
      ['tortillas', 4], ['kidneybohnen', 1, 'Dose'], ['mais', 0.5, 'Dose'], ['reibekaese', 150, 'g'], ['paprika', 1],
      ['kreuzkuemmel', 0.5, 'TL'], ['schmand', 100, 'g'], ['limette', 1], ['koriander', 0.5, 'Bund'], ['salz', null],
    ],
    steps: [
      'Bohnen abspülen und grob zerdrücken, mit Mais, gewürfelter Paprika, Kreuzkümmel und Salz mischen.',
      'Je eine Tortillahälfte mit Käse und Füllung belegen, zuklappen.',
      'In einer trockenen Pfanne von jeder Seite 2–3 Minuten knusprig braten, bis der Käse schmilzt.',
      'In Ecken schneiden und mit Schmand, Limette und Koriander servieren.',
    ],
  },
  {
    slug: 'croque-monsieur',
    title: 'Croque Monsieur',
    description: 'Das Pariser Bistro-Sandwich mit Schinken, Käse und Béchamel.',
    category: 'brot_snacks', diet: 'fleisch', minutes: 20, difficulty: 1, servings: 2,
    ingredients: [
      ['toastbrot', 4, 'Scheibe'], ['schinken', 4, 'Scheibe'], ['bergkaese', 100, 'g'], ['butter', 20, 'g'], ['mehl', 1, 'EL'],
      ['milch', 150, 'ml'], ['senf', 1, 'TL'], ['muskat', 1, 'Prise'], ['salz', null],
    ],
    steps: [
      'Ofengrill auf 220 °C vorheizen. Butter schmelzen, Mehl einrühren, Milch zugießen und zu einer dicken Béchamel kochen. Mit Salz und Muskat würzen.',
      'Zwei Toastscheiben mit Senf bestreichen, mit Schinken und der Hälfte des Käses belegen und mit den anderen Scheiben bedecken.',
      'Béchamel obenauf streichen, mit restlichem Käse bestreuen.',
      '6–8 Minuten überbacken, bis der Käse blubbert.',
    ],
  },
  {
    slug: 'bruschetta',
    title: 'Bruschetta mit Tomaten',
    description: 'Geröstetes Brot mit Knoblauch, marinierten Tomaten und Basilikum.',
    category: 'brot_snacks', diet: 'vegan', minutes: 15, difficulty: 1, servings: 2,
    ingredients: [
      ['baguette', 1], ['tomate', 4], ['knoblauch', 1, 'Zehe'], ['basilikum', 0.5, 'Bund'], ['olivenoel', 4, 'EL'],
      ['balsamico', 1, 'TL'], ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Tomaten entkernen und fein würfeln, mit 2 EL Öl, Balsamico, gehacktem Basilikum, Salz und Pfeffer mischen.',
      'Baguette schräg in Scheiben schneiden und im Ofen oder in der Pfanne goldbraun rösten.',
      'Brotscheiben mit der halbierten Knoblauchzehe einreiben und mit restlichem Öl beträufeln.',
      'Tomaten darauf verteilen und sofort servieren.',
    ],
  },
  {
    slug: 'tacos-hackfleisch',
    title: 'Tacos mit Hackfleisch',
    description: 'Würziges Taco-Hack, frische Salsa und Schmand in warmen Tortillas.',
    category: 'brot_snacks', diet: 'fleisch', minutes: 30, difficulty: 1, servings: 4,
    ingredients: [
      ['tortillas', 8], ['rinderhack', 500, 'g'], ['zwiebel', 1], ['knoblauch', 1, 'Zehe'], ['tomatenmark', 1, 'EL'],
      ['kreuzkuemmel', 1, 'TL'], ['paprikapulver', 2, 'TL'], ['tomate', 3], ['rote_zwiebel', 1], ['limette', 1],
      ['kopfsalat', 0.5], ['reibekaese', 100, 'g'], ['schmand', 150, 'g'], ['oel', 1, 'EL'], ['salz', null],
    ],
    steps: [
      'Hack im Öl krümelig braten, Zwiebel und Knoblauch mitbraten. Tomatenmark, Gewürze und 50 ml Wasser zugeben und 5 Minuten schmoren.',
      'Tomaten und rote Zwiebel fein würfeln und mit Limettensaft und Salz zu einer Salsa mischen.',
      'Tortillas kurz in einer trockenen Pfanne erwärmen.',
      'Mit Salat, Hack, Salsa, Käse und Schmand füllen.',
    ],
  },
  {
    slug: 'linsen-burger',
    title: 'Linsen-Burger',
    description: 'Würzige Patties aus roten Linsen und Haferflocken – vegan und richtig saftig.',
    category: 'brot_snacks', diet: 'vegan', minutes: 45, difficulty: 2, servings: 4,
    ingredients: [
      ['rote_linsen', 150, 'g'], ['haferflocken', 60, 'g'], ['karotte', 1], ['zwiebel', 1], ['knoblauch', 1, 'Zehe'],
      ['tomatenmark', 1, 'EL'], ['paprikapulver', 1, 'TL'], ['senf', 1, 'TL'], ['burgerbroetchen', 4], ['tomate', 1],
      ['kopfsalat', 0.5], ['ketchup', 2, 'EL'], ['oel', 3, 'EL'], ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Linsen in 300 ml Wasser 12 Minuten weich kochen, bis das Wasser aufgesogen ist. Abkühlen lassen.',
      'Karotte fein raspeln, Zwiebel und Knoblauch fein würfeln und kurz anbraten.',
      'Linsen mit Gemüse, Haferflocken, Tomatenmark, Senf und Gewürzen verkneten. 10 Minuten quellen lassen und 4 Patties formen.',
      'Im Öl von jeder Seite 4 Minuten braten. Brötchen mit Ketchup, Salat, Tomate und Patty belegen.',
    ],
  },
  {
    slug: 'avocado-toast-ei',
    title: 'Avocado-Toast mit pochiertem Ei',
    description: 'Cremige Avocado, Chili und ein perfekt pochiertes Ei auf knusprigem Brot.',
    category: 'brot_snacks', diet: 'vegetarisch', minutes: 15, difficulty: 2, servings: 2,
    ingredients: [
      ['bauernbrot', 2, 'Scheibe'], ['avocado', 1], ['eier', 2], ['zitrone', 0.5], ['chiliflocken', 1, 'Prise'],
      ['essig', 1, 'EL'], ['radieschen', 3], ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Wasser mit Essig aufkochen und auf kleine Hitze schalten, sodass es nur noch simmert.',
      'Eier einzeln in eine Tasse schlagen, mit einem Strudel ins Wasser gleiten lassen und 3–4 Minuten pochieren.',
      'Brot toasten. Avocado mit Zitronensaft, Salz und Pfeffer zerdrücken und aufstreichen.',
      'Mit Radieschenscheiben, Ei und Chiliflocken belegen.',
    ],
  },
  {
    slug: 'pita-halloumi',
    title: 'Pita mit Halloumi und Gemüse',
    description: 'Gegrillter Halloumi, Paprika und Minz-Joghurt in warmem Pitabrot.',
    category: 'brot_snacks', diet: 'vegetarisch', minutes: 20, difficulty: 1, servings: 2,
    ingredients: [
      ['pita', 2], ['halloumi', 200, 'g'], ['paprika', 1], ['zucchini', 0.5], ['joghurt', 150, 'g'], ['minze', 0.5, 'Bund'],
      ['zitrone', 0.5], ['tomate', 1], ['olivenoel', 2, 'EL'], ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Paprika und Zucchini in Streifen schneiden und im Öl 5 Minuten braten. Salzen.',
      'Halloumi in Scheiben schneiden und in derselben Pfanne von jeder Seite 2 Minuten goldbraun braten.',
      'Joghurt mit gehackter Minze, Zitronensaft, Salz und Pfeffer verrühren.',
      'Pita aufbacken, aufschneiden und mit Gemüse, Tomate, Halloumi und Joghurt füllen.',
    ],
  },
  {
    slug: 'strammer-max',
    title: 'Strammer Max',
    description: 'Bauernbrot, Schinken und Spiegelei – in zehn Minuten satt und glücklich.',
    category: 'brot_snacks', diet: 'fleisch', minutes: 10, difficulty: 1, servings: 2,
    ingredients: [
      ['bauernbrot', 2, 'Scheibe'], ['schinken', 4, 'Scheibe'], ['eier', 2], ['butter', 1, 'EL'], ['gewuerzgurken', 2],
      ['schnittlauch', 0.5, 'Bund'], ['salz', null], ['pfeffer', null],
    ],
    steps: [
      'Brot dünn mit Butter bestreichen und mit Schinken belegen.',
      'Restliche Butter in einer Pfanne erhitzen und zwei Spiegeleier braten. Salzen und pfeffern.',
      'Eier auf die Brote setzen, mit Schnittlauch bestreuen und mit Gurken servieren.',
    ],
  },
];
