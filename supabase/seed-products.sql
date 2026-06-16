-- RetrOase — Seed: Bestehende Produkte aus data/products.json
-- Einmalig im Supabase SQL Editor ausführen.
-- ON CONFLICT (slug) DO NOTHING → sicher wiederholbar.

INSERT INTO products (title, slug, description, price, condition, category, platform, images, is_sold, is_featured, badge, language, region, release_year, includes)
VALUES
(
  'Pokémon Gelbe Edition',
  'pokemon-gelbe-edition',
  E'Wer erinnert sich nicht an den Moment, als Pikachu zum ersten Mal aus dem Pokéball schlüpfte? Diese Original Game Boy Cartridge nimmt dich zurück in eine Zeit, als Tausch-Aktionen auf dem Schulhof und Pikachu-Sticker auf jedem Heft waren. Die Gelbe Edition — das Besondere ist: Hier ist Pikachu dein Starter-Pokémon und läuft dir nach, genau wie in der Anime-Serie.\n\nZustand: Sehr Gut — die Platine ist tadellos, der Speicher funktioniert einwandfrei.\n\nLieferumfang:\n- Pokémon Gelbe Edition Cartridge (Original, geprüft)\n- Original OVP (leichte Lagerspuren an den Ecken)\n- Anleitung (vollständig, leicht vergilbt)\n\nTechnische Details:\n- Plattform: Game Boy / Game Boy Color\n- Region: PAL (Deutschland)\n- Sprache: Deutsch\n- Erscheinungsjahr: 1999',
  89.00, 'Sehr Gut', 'Game Boy', 'Game Boy',
  ARRAY['/images/placeholder-product.jpg'],
  false, true, 'SELTEN', 'Deutsch', 'PAL', 1999,
  ARRAY['Cartridge', 'OVP', 'Anleitung']
),
(
  'Nintendo Game Boy Color (Lila)',
  'game-boy-color-lila',
  E'Der Game Boy Color in Traube-Lila — dieser Farbton ist bis heute der beliebteste unter Sammlern. Ende der 90er Jahre hat er Millionen von Kindern begeistert, und auch heute noch hat er diesen besonderen Charme.\n\nDieses Gerät wurde vollständig geprüft: Display ohne Dead Pixel, alle Tasten reagieren sauber, Lautsprecher und Kopfhörerbuchse funktionieren.\n\nLieferumfang:\n- Game Boy Color (Lila/Traubenfarbe)\n- Frisch gereinigt und geprüft\n\nTechnische Details:\n- Modell: CGB-001\n- Region: PAL (Europa)\n- Erscheinungsjahr: 1998',
  65.00, 'Sehr Gut', 'Game Boy', 'Game Boy Color',
  ARRAY['/images/placeholder-product.jpg'],
  false, true, 'TOP-ZUSTAND', NULL, 'PAL', 1998,
  ARRAY['Konsole']
),
(
  'Game Boy Advance SP (Silber)',
  'game-boy-advance-sp-silber',
  E'Das Klappsystem des Game Boy Advance SP war eine kleine Revolution — endlich kein Batterie-Hunger mehr dank eingebautem Akku, und das beleuchtete Display hat Millionen von Nacht-Sessions ermöglicht. Dieses Modell in klassischem Silber ist in einem sehr guten Gebrauchszustand.\n\nAkku wurde geprüft und hält noch problemlos mehrere Stunden.\n\nLieferumfang:\n- Game Boy Advance SP (Silber)\n- Ladekabel (Original)\n\nTechnische Details:\n- Modell: AGS-001 (Frontlight)\n- Region: PAL\n- Erscheinungsjahr: 2003',
  55.00, 'Gut', 'Game Boy', 'Game Boy Advance SP',
  ARRAY['/images/placeholder-product.jpg'],
  false, false, NULL, NULL, 'PAL', 2003,
  ARRAY['Konsole', 'Ladekabel']
),
(
  'Super Nintendo Mini (SNES)',
  'super-nintendo-mini-snes',
  E'Die Super Nintendo Mini ist nicht das klassische SNES — sie ist das offizielle Super Nintendo Classic Mini von Nintendo aus 2017, vollgepackt mit 21 vorinstallierten Spielen. Für alle, die die echte Retro-Erfahrung ohne die Suche nach Cartridges wollen.\n\nAlles im Top-Zustand, wurde kaum genutzt. Inklusive original Kabeln.\n\nLieferumfang:\n- Super Nintendo Classic Mini\n- 2x originale SNES-Controller\n- HDMI-Kabel\n- USB-Netzkabel\n\nTechnische Details:\n- Erscheinungsjahr: 2017 (Neuauflage)\n- 21 vorinstallierte Spiele inkl. Super Mario World, Donkey Kong Country',
  79.00, 'Sehr Gut', 'Nintendo', 'SNES',
  ARRAY['/images/placeholder-product.jpg'],
  false, true, 'NEU', NULL, NULL, 2017,
  ARRAY['Konsole', '2x Controller', 'HDMI-Kabel', 'USB-Netzkabel']
),
(
  'PlayStation 1 (SCPH-7502)',
  'playstation-1-scph-7502',
  E'Die Original PlayStation — der Beginn einer Ära. Das Modell SCPH-7502 ist die kompaktere Überarbeitung der ersten PS1 und bei Sammlern beliebt. Hier können Sie die Spiele von Final Fantasy VII, Metal Gear Solid und Crash Bandicoot wieder auf dem Original-System erleben.\n\nVollständig funktionsfähig, CD-Laufwerk liest alle getesteten Discs problemlos.\n\nLieferumfang:\n- PlayStation 1 (Grau, SCPH-7502)\n- 2x DualShock Controller (Original)\n- AV-Kabel\n- Netzteil\n\nTechnische Details:\n- Modell: SCPH-7502\n- Region: PAL (Europa)\n- Erscheinungsjahr: 1996 (Modell 1999)',
  69.00, 'Gut', 'PlayStation', 'PlayStation 1',
  ARRAY['/images/placeholder-product.jpg'],
  false, true, NULL, NULL, 'PAL', 1999,
  ARRAY['Konsole', '2x Controller', 'AV-Kabel', 'Netzteil']
),
(
  'PlayStation 2 Slim (Schwarz)',
  'playstation-2-slim-schwarz',
  E'Die PS2 Slim ist die elegantere, schlankere Version der meistverkauften Konsole aller Zeiten. Klein, leise und kompatibel mit dem riesigen PS2-Spielekatalog. Dieses Gerät läuft einwandfrei und wurde frisch gereinigt.\n\nDas CD/DVD-Laufwerk funktioniert ohne Probleme — auch PS1-Spiele werden erkannt.\n\nLieferumfang:\n- PlayStation 2 Slim (Schwarz)\n- 1x DualShock 2 Controller\n- AV-Kabel\n- Netzteil\n\nTechnische Details:\n- Modell: SCPH-77004\n- Region: PAL (Europa)\n- Erscheinungsjahr: 2004',
  85.00, 'Sehr Gut', 'PlayStation', 'PlayStation 2',
  ARRAY['/images/placeholder-product.jpg'],
  false, true, 'TOP-ZUSTAND', NULL, 'PAL', 2004,
  ARRAY['Konsole', 'Controller', 'AV-Kabel', 'Netzteil']
),
(
  'Nintendo 64 (Grau)',
  'nintendo-64-grau',
  E'Der Nintendo 64 — eine Konsole, die eine Generation geprägt hat. Hier begann die 3D-Ära mit Super Mario 64 und The Legend of Zelda: Ocarina of Time. Dieses Gerät wurde vollständig getestet: alle Anschlüsse funktionieren, das Bild ist sauber.\n\nLieferumfang:\n- Nintendo 64 Konsole (Grau)\n- 1x Original Controller\n- AV-Kabel\n- Netzteil\n\nTechnische Details:\n- Region: PAL (Europa)\n- Erscheinungsjahr: 1996',
  95.00, 'Gut', 'Nintendo', 'Nintendo 64',
  ARRAY['/images/placeholder-product.jpg'],
  false, true, 'SELTEN', NULL, 'PAL', 1996,
  ARRAY['Konsole', 'Controller', 'AV-Kabel', 'Netzteil']
),
(
  'Pokémon Karten — 1st Edition Base Set Booster',
  'pokemon-karten-1st-edition-base-set',
  E'Ein Stück Pokémon-Geschichte — ein 1st Edition Base Set Booster Pack. Diese Boosterpacks aus dem Jahr 1999 sind für Sammler weltweit begehrt. Mit dem Shadowless-Symbol auf der linken Seite und dem Erstauflage-Stempel.\n\nOVP-versiegelt, nie geöffnet. Zertifiziert echt.\n\nLieferumfang:\n- 1x 1st Edition Base Set Booster Pack (versiegelt)\n\nHinweis: Karten-Echtheit kann auf Anfrage mit einem Scan nachgewiesen werden.',
  120.00, 'Sehr Gut', 'Pokémon', 'Sammelkarten',
  ARRAY['/images/placeholder-product.jpg'],
  false, false, 'SELTEN', 'Deutsch', NULL, 1999,
  ARRAY['1x versiegeltes Booster Pack']
),
(
  'Game Boy Original (Grau, DMG-01)',
  'game-boy-original-grau',
  E'Der Original Game Boy — der Urahn aller portablen Gaming-Geräte. 1989 erschaffen, hat er die Spielewelt für immer verändert. Dieses Modell in Grau (Brick Boy) funktioniert einwandfrei und ist ein toller Einstieg in die Retro-Sammlung.\n\nKleiner Kratzer auf dem Display-Gehäuse (nicht auf dem Display selbst) — im Betrieb nicht sichtbar.\n\nLieferumfang:\n- Game Boy Original (Grau)\n\nTechnische Details:\n- Modell: DMG-01\n- Erscheinungsjahr: 1989',
  25.00, 'Akzeptabel', 'Game Boy', 'Game Boy',
  ARRAY['/images/placeholder-product.jpg'],
  false, false, 'SCHNÄPPCHEN', NULL, NULL, 1989,
  ARRAY['Konsole']
),
(
  'SNES Controller (Original, Grau)',
  'snes-controller-original-grau',
  E'Der originale SNES-Controller — das Gamepad, das das Design moderner Controller beeinflusst hat. Alle Knöpfe funktionieren einwandfrei, kein Stick-Drift (hat der SNES-Controller eh nicht), alle Schultertasten reagieren sauber.\n\nPerfekt als Ersatz oder Erweiterung für deine SNES-Sammlung.\n\nLieferumfang:\n- 1x SNES Controller (Original)\n\nTechnische Details:\n- Region: PAL',
  18.00, 'Sehr Gut', 'Zubehör', 'SNES',
  ARRAY['/images/placeholder-product.jpg'],
  false, false, NULL, NULL, 'PAL', NULL,
  ARRAY['Controller']
),
(
  'Pokémon Silberne Edition',
  'pokemon-silberne-edition',
  E'Pokémon Silber — die zweite Generation, die mit dem Tag-Nacht-System und 100 neuen Pokémon die Fans begeistert hat. Lugia auf dem Cover, Ho-Oh als Geheimnis — diese Cartridge ist ein Muss für jeden Pokémon-Sammler.\n\nSpeicher funktioniert, alte Spielstände gelöscht und frisch für dich vorbereitet.\n\nLieferumfang:\n- Pokémon Silberne Edition Cartridge (Original)\n\nTechnische Details:\n- Plattform: Game Boy Color\n- Region: PAL\n- Sprache: Deutsch\n- Erscheinungsjahr: 2001',
  45.00, 'Gut', 'Game Boy', 'Game Boy Color',
  ARRAY['/images/placeholder-product.jpg'],
  false, false, NULL, 'Deutsch', 'PAL', 2001,
  ARRAY['Cartridge']
),
(
  'PlayStation 2 DualShock 2 Controller',
  'ps2-dualshock-2-controller',
  E'Der DualShock 2 — der Standardcontroller der PS2-Ära. Alle Analog-Sticks ohne Drift, alle Tasten reagieren sauber. Kabel ohne Schäden. Ideal als Ersatz oder für lokalen Multiplayer.\n\nLieferumfang:\n- 1x DualShock 2 Controller (Original Sony)\n\nTechnische Details:\n- Modell: SCPH-10010\n- Farbe: Schwarz (Midnight Black)',
  22.00, 'Sehr Gut', 'Zubehör', 'PlayStation 2',
  ARRAY['/images/placeholder-product.jpg'],
  false, false, NULL, NULL, NULL, NULL,
  ARRAY['Controller']
)
ON CONFLICT (slug) DO NOTHING;
