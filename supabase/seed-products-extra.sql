-- RetrOase — Zusätzliche Beispielprodukte
-- Im Supabase SQL Editor ausführen.
-- ON CONFLICT (slug) DO NOTHING → sicher wiederholbar.

INSERT INTO products (title, slug, description, price, condition, category, platform, images, is_sold, is_featured, badge, language, region, release_year, includes)
VALUES
(
  'Super Mario Bros. 3 (SNES)',
  'super-mario-bros-3-snes',
  E'🌴 Willkommen bei RetrOase – wo Gaming-Träume wahr werden. 🎮\n\nSuper Mario Bros. 3 auf dem SNES — eines der besten Jump''n''Run-Spiele aller Zeiten. Mit dem Tanooki-Anzug durch 8 Welten, Koopa-Kinder besiegen und Peach retten. Ein Muss für jede SNES-Sammlung.\n\n🌟 Was dieses Spiel so besonders macht:\n\n• Klassiker der 16-Bit-Ära — bis heute meisterhaft spielbar\n• 8 riesige Welten mit einzigartigen Themes\n• Ikonische Power-Ups: Tanooki, Froschanzug, Hammerbruder\n• Vollständig mit OVP und Anleitung\n\n🕹️ Zustand:\n✅ Gut — Cartridge voll funktionsfähig\n✅ Speicher geprüft: alle Slots einwandfrei\n✅ Aus gepflegter Sammlung: Rauch- und tierfreier Haushalt\n\n📦 Lieferumfang:\n• Super Mario Bros. 3 (SNES Cartridge, Original)\n• OVP (Lagerspuren)\n• Anleitung',
  34.00, 'Gut', 'Nintendo', 'SNES',
  ARRAY['/images/placeholder-product.jpg'],
  false, false, NULL, 'Deutsch', 'PAL', 1992,
  ARRAY['Cartridge', 'OVP', 'Anleitung']
),
(
  'The Legend of Zelda: A Link to the Past (SNES)',
  'zelda-a-link-to-the-past-snes',
  E'🌴 Willkommen bei RetrOase – wo Gaming-Träume wahr werden. 🎮\n\nA Link to the Past — das Zelda, das alles definiert hat. Dunkle Welt, helle Welt, Dungeon-Rätsel auf höchstem Niveau. Bis heute eines der höchstbewerteten Spiele aller Zeiten und ein absolutes Sammlerstück.\n\n🌟 Was dieses Spiel so besonders macht:\n\n• Gehört zu den besten Spielen jemals entwickelt\n• Dual-World-System: Lichtwelt & Schattenwelt\n• Komplett mit OVP und Anleitung — sehr selten\n• Perfekter Einstieg in die Zelda-Reihe\n\n🕹️ Zustand:\n✅ Sehr Gut — kaum sichtbare Gebrauchsspuren\n✅ Speicher: alle 3 Spielstände funktionieren\n✅ Aus gepflegter Sammlung: Rauch- und tierfreier Haushalt\n\n📦 Lieferumfang:\n• Zelda: A Link to the Past (SNES Cartridge)\n• OVP (sehr guter Zustand)\n• Anleitung (vollständig)',
  59.00, 'Sehr Gut', 'Nintendo', 'SNES',
  ARRAY['/images/placeholder-product.jpg'],
  false, true, 'SELTEN', 'Deutsch', 'PAL', 1992,
  ARRAY['Cartridge', 'OVP', 'Anleitung']
),
(
  'Donkey Kong Country (SNES)',
  'donkey-kong-country-snes',
  E'🌴 Willkommen bei RetrOase – wo Gaming-Träume wahr werden. 🎮\n\nDonkey Kong Country hat 1994 die Spielewelt mit seiner revolutionären 3D-Optik schockiert. Die Musik von David Wise, das Buddy-System mit Diddy Kong — ein Spiel, das man nie vergisst.\n\n🌟 Was dieses Spiel so besonders macht:\n\n• Visuell seiner Zeit jahrelang voraus\n• Legendärer Soundtrack — Aquatic Ambiance, Simian Segue\n• Klassisches 2-Spieler-Koop\n• Vollständig mit OVP\n\n🕹️ Zustand:\n✅ Gut — normale Gebrauchsspuren am Modul\n✅ Funktioniert einwandfrei auf jedem SNES/SNES Mini\n✅ Aus gepflegter Sammlung: Rauch- und tierfreier Haushalt\n\n📦 Lieferumfang:\n• Donkey Kong Country (SNES Cartridge)\n• OVP',
  28.00, 'Gut', 'Nintendo', 'SNES',
  ARRAY['/images/placeholder-product.jpg'],
  false, false, NULL, 'Deutsch', 'PAL', 1994,
  ARRAY['Cartridge', 'OVP']
),
(
  'Pokémon Rote Edition (Game Boy)',
  'pokemon-rote-edition-game-boy',
  E'🌴 Willkommen bei RetrOase – wo Gaming-Träume wahr werden. 🎮\n\nPokémon Rot — der Anfang von allem. 151 Pokémon fangen, die Elite Vier besiegen und Pokémon-Meister werden. Diese Cartridge hat mehr Kindheitserinnerungen getragen als jedes andere Spiel.\n\n🌟 Was dieses Spiel so besonders macht:\n\n• Das Original — Generation 1 in seiner reinsten Form\n• Versionspokémon: Arkani, Pinsir, Bisasam als Starter\n• Batteriewechsel frisch durchgeführt — Speicher hält wieder Jahre\n• Für echte Fans: die PAL-Version auf Deutsch\n\n🕹️ Zustand:\n✅ Gut — typische Kratzer am Label, Kontakte gereinigt\n✅ Speicher frisch: neue Batterie eingebaut, Spielstände halten\n✅ Aus gepflegter Sammlung: Rauch- und tierfreier Haushalt\n\n📦 Lieferumfang:\n• Pokémon Rote Edition (Game Boy Cartridge, Original)',
  42.00, 'Gut', 'Game Boy', 'Game Boy',
  ARRAY['/images/placeholder-product.jpg'],
  false, false, NULL, 'Deutsch', 'PAL', 1999,
  ARRAY['Cartridge']
),
(
  'Tetris (Game Boy) — mit OVP',
  'tetris-game-boy-ovp',
  E'🌴 Willkommen bei RetrOase – wo Gaming-Träume wahr werden. 🎮\n\nTetris auf dem Game Boy — das Launch-Titel-Bundle, das den Game Boy zum Millionenseller gemacht hat. Einfach. Süchtig machend. Zeitlos. Diese Version mit OVP ist ein echtes Sammlerstück.\n\n🌟 Was dieses Spiel so besonders macht:\n\n• Der originale Launch-Titel des Game Boy (1989)\n• Mit OVP — bei diesem Alter eine Seltenheit\n• 2-Spieler-Link-Cable-Modus unterstützt\n• Eines der meistverkauften Spiele aller Zeiten\n\n🕹️ Zustand:\n✅ Sehr Gut — OVP mit kleinen Lagerspuren, Modul makellos\n✅ Funktioniert auf allen Game Boy Modellen\n✅ Aus gepflegter Sammlung: Rauch- und tierfreier Haushalt\n\n📦 Lieferumfang:\n• Tetris (Game Boy Cartridge, Original)\n• OVP (leichte Altersspuren)\n• Anleitung',
  29.00, 'Sehr Gut', 'Game Boy', 'Game Boy',
  ARRAY['/images/placeholder-product.jpg'],
  false, false, 'SELTEN', 'Deutsch', 'PAL', 1989,
  ARRAY['Cartridge', 'OVP', 'Anleitung']
),
(
  'Crash Bandicoot (PlayStation 1)',
  'crash-bandicoot-ps1',
  E'🌴 Willkommen bei RetrOase – wo Gaming-Träume wahr werden. 🎮\n\nCrash Bandicoot — der Maskottchen-Kampf der 90er gegen Mario und Sonic. Die Spinattacke, die Aku Aku Maske, die frustrierenden Bonuslevels — wer Crash gespielt hat, vergisst ihn nie.\n\n🌟 Was dieses Spiel so besonders macht:\n\n• Der erste Teil — der Ursprung des Kults\n• Komplette PAL-Version auf Deutsch\n• Mit OVP im guten Zustand\n• Ideal für PS1, PS2 und PS3 Rückwärtskompatibilität\n\n🕹️ Zustand:\n✅ Gut — Disc ohne Kratzer, liest auf Anhieb\n✅ Geprüft auf PS1 SCPH-7502 — läuft einwandfrei\n✅ Aus gepflegter Sammlung: Rauch- und tierfreier Haushalt\n\n📦 Lieferumfang:\n• Crash Bandicoot (PS1 Disc, Original)\n• OVP\n• Anleitung',
  18.00, 'Gut', 'PlayStation', 'PlayStation 1',
  ARRAY['/images/placeholder-product.jpg'],
  false, false, NULL, 'Deutsch', 'PAL', 1996,
  ARRAY['Disc', 'OVP', 'Anleitung']
),
(
  'Metal Gear Solid (PlayStation 1)',
  'metal-gear-solid-ps1',
  E'🌴 Willkommen bei RetrOase – wo Gaming-Träume wahr werden. 🎮\n\nMetal Gear Solid — das Spiel, das Stealth-Action als Genre definiert hat. Solid Snake, Shadow Moses, Psycho Mantis, der Anruf auf deinem echten Controller-Port. Hideo Kojimas Meisterwerk auf 2 CDs.\n\n🌟 Was dieses Spiel so besonders macht:\n\n• Filmreife Inszenierung weit vor ihrer Zeit\n• Einer der besten Bosskämpfe in der Gaming-Geschichte (Psycho Mantis)\n• Komplett — beide Discs vorhanden\n• Kult-Status: unverzichtbar für jede PS1-Sammlung\n\n🕹️ Zustand:\n✅ Sehr Gut — beide Discs kratzerlos, OVP top\n✅ Geprüft: lädt schnell, kein Einleseproblem\n✅ Aus gepflegter Sammlung: Rauch- und tierfreier Haushalt\n\n📦 Lieferumfang:\n• Metal Gear Solid (2x PS1 Disc, Original)\n• OVP\n• Anleitung',
  26.00, 'Sehr Gut', 'PlayStation', 'PlayStation 1',
  ARRAY['/images/placeholder-product.jpg'],
  false, true, 'SELTEN', 'Deutsch', 'PAL', 1999,
  ARRAY['2x Disc', 'OVP', 'Anleitung']
),
(
  'Gran Turismo 3: A-Spec (PlayStation 2)',
  'gran-turismo-3-ps2',
  E'🌴 Willkommen bei RetrOase – wo Gaming-Träume wahr werden. 🎮\n\nGran Turismo 3 war der Grund, warum viele eine PS2 gekauft haben. Fotorealistische Autos (für 2001), 150+ Fahrzeuge, stundenlanger Karrieremodus. Für Sim-Racer unverzichtbar.\n\n🌟 Was dieses Spiel so besonders macht:\n\n• Launch-Titel der PS2 — zeigt die Stärke der Hardware\n• 150+ lizenzierte Fahrzeuge von echten Herstellern\n• Sehr guter Zustand, Disc glänzt\n• Perfekt für PS2 und rückwärtskompatible PS3\n\n🕹️ Zustand:\n✅ Sehr Gut — Disc nahezu kratzerlos\n✅ Geprüft: lädt auf Anhieb, kein Einlesefehler\n✅ Aus gepflegter Sammlung: Rauch- und tierfreier Haushalt\n\n📦 Lieferumfang:\n• Gran Turismo 3 (PS2 Disc, Original)\n• OVP',
  12.00, 'Sehr Gut', 'PlayStation', 'PlayStation 2',
  ARRAY['/images/placeholder-product.jpg'],
  false, false, NULL, 'Deutsch', 'PAL', 2001,
  ARRAY['Disc', 'OVP']
),
(
  'Nintendo GameCube (Lila) — Komplett',
  'nintendo-gamecube-lila-komplett',
  E'🌴 Willkommen bei RetrOase – wo Gaming-Träume wahr werden. 🎮\n\nDer Nintendo GameCube in Indigo-Lila — die Farbe, die den Cube zum Kult gemacht hat. Kleine, robuste Konsole mit einem der stärksten First-Party-Lineups aller Zeiten: Mario Sunshine, Wind Waker, Melee, Metroid Prime.\n\n🌟 Was dieses Spiel so besonders macht:\n\n• Ikonisches Design — Lila/Indigo ist der gesuchte Farbton\n• Komplett mit 2 Controllern, Speicherkarte und allen Kabeln\n• Voll funktionsfähig, Disc-Laufwerk geprüft\n• GBA-Konnektivität für bestimmte Spiele möglich\n\n🕹️ Zustand:\n✅ Gut — normale Gebrauchsspuren, kein Bruch\n✅ Laufwerk: liest alle getesteten Discs problemlos\n✅ Aus gepflegter Sammlung: Rauch- und tierfreier Haushalt\n\n📦 Lieferumfang:\n• Nintendo GameCube (Indigo/Lila)\n• 2x Original Controller (Lila)\n• 1x Memory Card 59\n• AV-Kabel\n• Netzteil',
  110.00, 'Gut', 'Nintendo', 'GameCube',
  ARRAY['/images/placeholder-product.jpg'],
  false, true, 'TOP DEAL', NULL, 'PAL', 2002,
  ARRAY['Konsole', '2x Controller', 'Memory Card', 'AV-Kabel', 'Netzteil']
),
(
  'Game Boy Pocket (Silber)',
  'game-boy-pocket-silber',
  E'🌴 Willkommen bei RetrOase – wo Gaming-Träume wahr werden. 🎮\n\nDer Game Boy Pocket — die schlanke, leichte Überarbeitung des Original Game Boy. Schärferes Display, kompaktere Form, echter Retro-Charme. Kompatibel mit allen klassischen Game Boy Spielen.\n\n🌟 Was dieses Gerät so besonders macht:\n\n• Schärferes Display als der Original Game Boy\n• Extrem kompakt — passt in jede Hosentasche\n• Kompatibel mit Game Boy & Game Boy Color Spielen\n• Batterie: 2x AAA — hält ewig\n\n🕹️ Zustand:\n✅ Sehr Gut — Display ohne Dead Pixel, alle Tasten knackig\n✅ Frisch gereinigt, Kontakte gecheckt\n✅ Aus gepflegter Sammlung: Rauch- und tierfreier Haushalt\n\n📦 Lieferumfang:\n• Game Boy Pocket (Silber/MGB-001)',
  38.00, 'Sehr Gut', 'Game Boy', 'Game Boy Pocket',
  ARRAY['/images/placeholder-product.jpg'],
  false, false, NULL, NULL, 'PAL', 1996,
  ARRAY['Konsole']
),
(
  'Pokémon Neo Genesis Booster Pack (1. Edition)',
  'pokemon-neo-genesis-booster-1st-edition',
  E'🌴 Willkommen bei RetrOase – wo Gaming-Träume wahr werden. 🎮\n\nEin versiegeltes Neo Genesis Booster Pack aus der 1. Edition — Generation 2 der Pokémon-Karten. Typisch-nostalgie: Ferngaukler, Tornupto, Endivie. Das Neo-Set markiert den Beginn der Johto-Karten-Ära.\n\n🌟 Was dieses Pack so besonders macht:\n\n• Versiegelt und ungeöffnet — Original-Zustand seit 2000\n• 1st Edition Stempel auf dem Pack\n• Johto-Starter und Legendaries möglich\n• Perfektes Sammlerstück oder als Geschenk\n\n🕹️ Zustand:\n✅ Versiegelt — OVP-Zustand, nie geöffnet\n✅ Keine Eindrücke oder Beschädigungen am Pack\n\n📦 Lieferumfang:\n• 1x Neo Genesis Booster Pack (versiegelt, 1st Edition)',
  85.00, 'Sehr Gut', 'Pokémon', 'Sammelkarten',
  ARRAY['/images/placeholder-product.jpg'],
  false, false, 'SELTEN', 'Deutsch', NULL, 2000,
  ARRAY['1x versiegeltes Booster Pack']
),
(
  'N64 Controller (Gelb, Original)',
  'n64-controller-gelb-original',
  E'🌴 Willkommen bei RetrOase – wo Gaming-Träume wahr werden. 🎮\n\nDer N64 Controller in Gelb — einer der selteneren Originalfarben und bei Sammlern sehr beliebt. Analogstick zeigt noch guten Widerstand, alle Tasten reagieren sauber.\n\n🌟 Was dieses Zubehör so besonders macht:\n\n• Seltene Gelb-Variante — nicht jeder hat den\n• Analogstick: guter Widerstand, kein exzessives Driften\n• Alle Buttons (A, B, C-Buttons, Z-Trigger) geprüft\n• Passt zu SNES Mini Konsolen via Adapter\n\n🕹️ Zustand:\n✅ Gut — normale Gebrauchsspuren, kein Bruch\n✅ Kabel komplett ohne Knick oder Beschädigung\n✅ Aus gepflegter Sammlung: Rauch- und tierfreier Haushalt\n\n📦 Lieferumfang:\n• 1x N64 Controller (Gelb, Original Nintendo)',
  24.00, 'Gut', 'Zubehör', 'Nintendo 64',
  ARRAY['/images/placeholder-product.jpg'],
  false, false, NULL, NULL, 'PAL', 1996,
  ARRAY['Controller']
),
(
  'Sega Mega Drive 2 — Komplett',
  'sega-mega-drive-2-komplett',
  E'🌴 Willkommen bei RetrOase – wo Gaming-Träume wahr werden. 🎮\n\nDer Sega Mega Drive 2 — Segas Antwort auf den SNES. Sonic, Streets of Rage, Mortal Kombat — die 16-Bit-Kriege live erleben. Komplett mit 2 Controllern und Sonic the Hedgehog als Bundle-Spiel.\n\n🌟 Was dieses Set so besonders macht:\n\n• Komplett mit 2x Original-6-Button-Controller\n• Sonic the Hedgehog 2 liegt bei — sofort spielbereit\n• Schlankes Design, weniger Einschübe als Mega Drive 1\n• Über 900 Mega Drive Spiele kompatibel\n\n🕹️ Zustand:\n✅ Sehr Gut — kaum Gebrauchsspuren, frisch gereinigt\n✅ Cartridge-Slot geprüft: liest alle getesteten Spiele\n✅ Aus gepflegter Sammlung: Rauch- und tierfreier Haushalt\n\n📦 Lieferumfang:\n• Sega Mega Drive 2 Konsole\n• 2x Original 6-Button Controller\n• Sonic the Hedgehog 2 (Cartridge)\n• AV-Kabel\n• Netzteil',
  75.00, 'Sehr Gut', 'Retro', 'Sega Mega Drive',
  ARRAY['/images/placeholder-product.jpg'],
  false, true, 'TOP DEAL', NULL, 'PAL', 1993,
  ARRAY['Konsole', '2x Controller', 'Sonic the Hedgehog 2', 'AV-Kabel', 'Netzteil']
),
(
  'Game Boy Color (Gelb, Pikachu Edition)',
  'game-boy-color-gelb-pikachu',
  E'🌴 Willkommen bei RetrOase – wo Gaming-Träume wahr werden. 🎮\n\nDer Game Boy Color in der offiziellen Pikachu-Edition — Pokémon-Gelb mit Pikachu-Aufdruck. Einer der begehrtesten Farb-Varianten des GBC, perfekt für Pokémon-Sammler.\n\n🌟 Was dieses Gerät so besonders macht:\n\n• Offizielle Pokémon/Pikachu-Sonderedition von Nintendo\n• Leuchtendes Gelb — sofort erkennbar in jeder Sammlung\n• Komplett funktionsfähig, Display ohne Flecken\n• Spielt alle GBC und Classic Game Boy Spiele\n\n🕹️ Zustand:\n✅ Gut — leichte Kratzer auf dem Gehäuse, Display einwandfrei\n✅ Alle Tasten: sauber, kein Sticking\n✅ Aus gepflegter Sammlung: Rauch- und tierfreier Haushalt\n\n📦 Lieferumfang:\n• Game Boy Color Pikachu Edition (Gelb)\n• Frisch gereinigt',
  72.00, 'Gut', 'Game Boy', 'Game Boy Color',
  ARRAY['/images/placeholder-product.jpg'],
  false, true, 'SELTEN', NULL, 'PAL', 1998,
  ARRAY['Konsole']
),
(
  'PlayStation 1 Memory Card (Original Sony)',
  'ps1-memory-card-original-sony',
  E'🌴 Willkommen bei RetrOase – wo Gaming-Träume wahr werden. 🎮\n\nDie originale Sony PlayStation Memory Card — 15 Blöcke Speicher für deine liebsten PS1-Spielstände. Keine Drittanbieter-Karte, keine Risiken. Das Original aus dem Hause Sony.\n\n🌟 Was diese Memory Card so besonders macht:\n\n• Original Sony — keine Billig-Kopie\n• 15 Speicherblöcke für Spielstände aller PS1-Spiele\n• Frisch formatiert — bereit für neue Abenteuer\n• Passt in PS1, PS2 und PS One\n\n🕹️ Zustand:\n✅ Sehr Gut — kaum Gebrauchsspuren\n✅ Speicher geprüft: alle 15 Blöcke beschreibbar\n✅ Aus gepflegter Sammlung: Rauch- und tierfreier Haushalt\n\n📦 Lieferumfang:\n• 1x PlayStation Memory Card (Original Sony, Grau)',
  9.00, 'Sehr Gut', 'Zubehör', 'PlayStation 1',
  ARRAY['/images/placeholder-product.jpg'],
  false, false, 'SCHNÄPPCHEN', NULL, NULL, NULL,
  ARRAY['Memory Card']
)
ON CONFLICT (slug) DO NOTHING;
