# Prompts für realistische Werbefilme (Stand 17.11.)

Warum die alten Filme nach KI aussahen:
- Alles in einer Farbe (Wohnung komplett beige), alles perfekt und symmetrisch, kein gelebtes Detail.
- Wörter wie „cozy, luxury, aesthetic, perfect“ erzeugen den typischen KI-Look.
- Startbilder in niedriger Qualität, schwache Videoeinstellungen, nur ein Versuch.

Regeln für echt wirkende Bilder:
1. Kamera und Licht nennen (Sony FX3, Objektiv, nur vorhandenes Licht).
2. Unperfektes einbauen: Krümel, Kratzer, unterschiedliche Stühle, Alltagsgegenstände.
3. Gemischte Farben und Materialien statt einem Farbschema.
4. Bewegung im Video klein halten: eine ruhige Kamerafahrt, nur 1–2 Dinge bewegen sich.
5. Startbild: GPT Image 2.6 „high“, 2K (oder Nano Banana Pro 2K). Video: Kling 4.0 oder Seedance 2.5 in 1080p, 2–3 Versuche je Szene, ersten 0,5 s abschneiden.
6. Kennzeichnung: „Beispiel-Werbefilm von FOAV · mit KI erstellt“, Wohnung zusätzlich „virtuell eingerichtet“.

Gilt für jedes Bild (Negativ):
```
no oversaturated orange, no HDR look, no glowing bokeh balls, no candles everywhere, no plastic-looking food, no 3D render look, no perfect symmetry, no text, no logos, no watermark, no extra fingers
```

---

## 1. Café-Werbefilm (9:16, 3 Szenen à 5 s)

### Szene 1 – Bild
```
Vertical 9:16 photo, shot on Sony FX3 with a 35mm f/1.8 lens, available light only. A small neighbourhood café in Munich on a grey, rainy November afternoon, seen from a window seat. Raindrops and light condensation on the glass, blurred street outside with wet cobblestones and a passing cyclist. Cool daylight from the window mixed with one warm tungsten pendant lamp. On a slightly scratched, worn oak table: a ceramic cup of cappuccino with imperfect latte art, a teaspoon on the saucer, a slice of homemade German apple cake with an uneven crust and a few crumbs on the plate, a crumpled paper napkin. Out of focus in the background: a chalkboard menu, mismatched chairs, a coat on a hook. Natural colours, gentle film grain, real shadows, true-to-life textures, no retouching. Looks like a real photo, not a stock photo.
```
### Szene 1 – Video
```
Slow, steady slider push-in towards the table, 5 seconds. Rain runs down the window, thin steam rises from the cappuccino. Everything else stays completely still. Realistic physics, no camera shake, no morphing, no new objects appear.
```

### Szene 2 – Bild
```
Vertical 9:16 macro photo, Sony FX3, 90mm macro lens, f/2.8, window light from the left. Close-up of a slice of homemade apple cake on a stoneware plate: soft apple layers, golden buttery crust, a dusting of powdered sugar, a few crumbs and a fork resting on the plate. The cappuccino cup is soft and out of focus behind it. Real food texture, slight moisture on the apples, natural colours, gentle film grain.
```
### Szene 2 – Video
```
Very slow lateral slide from left to right, 5 seconds, shallow depth of field, focus gently shifts from the cake to the cup behind it. A little steam drifts through the frame. No hands, no morphing.
```

### Szene 3 – Bild (Ort zeigen)
```
Vertical 9:16 photo, Sony FX3, 24mm lens, available light. Interior of a small, real Munich café at dusk on a rainy day: warm lamps inside, blue hour outside, rain on the big window, a wooden counter with a glass cake display and an espresso machine, mismatched wooden chairs, a few plants, chalkboard menu. No people in focus. Lived-in, slightly imperfect, natural colours, film grain. Looks like a real photo taken by a good photographer.
```
### Szene 3 – Video
```
Slow gimbal move backwards from the cake display towards the door, 5 seconds, the café slowly reveals itself. Rain outside, lights stay steady. No people walking through, no morphing, no camera shake.
```

### Variante mit Menschen (wie mobileeditingclub, Seedance 2.5 oder Veo 3.1)
```
Vertical 9:16, cinematic but natural, Sony FX3, 35mm. A woman in her thirties in a wet wool coat comes in from the rain, shakes the water off her umbrella at the café door and smiles as she sees the cake display. Warm interior light, rainy blue street behind her. Natural skin texture, real hair, subtle movement, no exaggerated expressions. 5 seconds, slow handheld-free camera.
```

Texttafeln (als HTML-Overlay, nicht im Prompt): „Draußen grau.“ / „Drinnen Apfelkuchen.“ / Name, Adresse, „Heute geöffnet bis 18 Uhr“.

---

## 2. Wohnung virtuell eingerichtet (16:9, Referenzbild = leere Wohnung)

### Bild eingerichtet (mit `wohnung-leer.jpg` als Referenz)
```
Use the reference photo as the exact same room: keep walls, windows, doors, ceiling mouldings, radiator, herringbone parquet, light direction and camera angle exactly as they are. Virtually furnish it like a real, lived-in Munich Altbau apartment photographed for a high-end real-estate listing. Mix colours and materials, no single colour scheme: a deep olive-green velvet sofa, a faded vintage red-and-blue Persian rug, a walnut mid-century sideboard, a cognac leather armchair, a black metal floor lamp, a light oak dining table with mismatched chairs near the window, a bookshelf with colourful book spines, framed prints and photographs in different sizes, a large real fiddle-leaf fig with a few imperfect leaves, off-white linen curtains, a wool throw casually folded, a few everyday objects (reading glasses, a ceramic mug, an open magazine). Shot on a full-frame camera with a 24mm tilt-shift lens at eye level, natural overcast daylight from the windows, soft shadows in the corners, true-to-life colours, subtle film grain. Not staged, not symmetrical, not all beige, not a 3D render.
```

### Video „Rundgang“ (Startbild = eingerichtetes Bild)
```
Smooth gimbal walkthrough at slow walking speed, moving forward into the living room and gently turning right towards the windows, 8 seconds. The curtains move very slightly, daylight changes subtly as a cloud passes. Walls, windows and every piece of furniture keep exactly the same shape and position. No morphing, no furniture appearing or disappearing, no people.
```

### Video „Richtet sich ein“ (Startbild leer, Endbild eingerichtet)
```
Static camera on a tripod, 6 seconds. The empty room gradually becomes furnished: furniture and rug fade in naturally, one after another, in soft daylight. The room itself (walls, windows, floor) never changes. Calm, realistic, no flashes, no flying objects.
```

Weitere Räume genauso: erst leeres Foto, dann gleiche Perspektive einrichten (Schlafzimmer z. B. dunkelblaue Bettwäsche, Rattan-Nachttisch, Leselampe; Küche z. B. Holzbrett, Obstschale, Kräutertopf).
